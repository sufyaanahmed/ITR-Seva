-- Application data is read through RLS and mutated only by the authenticated API.
create table public.platform_roles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('reviewer','decision_maker','administrator'))
);
create function public.platform_staff() returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from platform_roles where user_id = auth.uid()) $$;
create table public.applications (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id),
 draft_key text not null, reference text not null unique default ('VS-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,16))),
 answers jsonb not null default '{}', status text not null default 'draft'
 check(status in ('draft','awaiting_payment','submitted','under_review','waiting_for_information','accepted','rejected')),
 payment_status text not null default 'unpaid' check(payment_status in ('unpaid','processing','pending','paid','failed','cancelled')),
 version integer not null default 1, confirmed_version integer, confirmed_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(owner_id,draft_key)
);
create index applications_queue on public.applications(status,updated_at desc);
create index applications_owner on public.applications(owner_id,updated_at desc);
create table public.application_documents (
 id uuid primary key default gen_random_uuid(), application_id uuid not null references public.applications(id),
 type text not null, path text not null unique, mime_type text not null, size integer not null check(size > 0 and size <= 10485760),
 sha256 text not null, created_at timestamptz not null default now(), unique(application_id,type)
);
create table public.application_history (
 id uuid primary key default gen_random_uuid(), application_id uuid not null references public.applications(id),
 actor_id uuid not null references auth.users(id), actor_kind text not null check(actor_kind in ('applicant','admin','agent')),
 from_status text, to_status text not null, reason text not null default '', created_at timestamptz not null default now()
);
create table public.platform_audit (
 id uuid primary key default gen_random_uuid(), application_id uuid references public.applications(id), actor_id uuid not null references auth.users(id),
 actor_kind text not null, action text not null, created_at timestamptz not null default now()
);
create table public.payment_sessions (
 id uuid primary key default gen_random_uuid(), application_id uuid not null references public.applications(id),
 request_key text not null, status text not null default 'pending' check(status in ('pending','processing','paid','failed','cancelled')),
 provider text not null default 'sandbox' check(provider='sandbox'), amount integer not null check(amount >= 0), currency text not null default 'USD',
 transaction_reference text unique, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(application_id,request_key)
);
create unique index one_open_checkout on public.payment_sessions(application_id) where status in ('pending','processing','paid');
create table public.email_notifications (
 id uuid primary key default gen_random_uuid(), application_id uuid not null references public.applications(id), history_id uuid not null unique references public.application_history(id),
 recipient text not null, subject text not null, body text not null,
 status text not null default 'queued' check(status in ('queued','sending','sent','delivered','bounced','failed','needs_attention')),
 attempts integer not null default 0, next_attempt_at timestamptz not null default now(), first_attempt_at timestamptz, lease_until timestamptz,
 provider_id text, last_error text, created_at timestamptz not null default now()
);
create table public.agent_grants (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), token_hash text not null unique,
 label text not null, scopes text[] not null, expires_at timestamptz not null, revoked_at timestamptz, created_at timestamptz not null default now()
);
alter table public.platform_roles enable row level security;
alter table public.applications enable row level security;
alter table public.application_documents enable row level security;
alter table public.application_history enable row level security;
alter table public.platform_audit enable row level security;
alter table public.payment_sessions enable row level security;
alter table public.email_notifications enable row level security;
alter table public.agent_grants enable row level security;
create policy own_role on public.platform_roles for select to authenticated using(user_id=auth.uid());
create policy authorized_applications on public.applications for select to authenticated using(owner_id=auth.uid() or public.platform_staff());
create policy authorized_documents on public.application_documents for select to authenticated using(exists(select 1 from public.applications a where a.id=application_id));
create policy authorized_history on public.application_history for select to authenticated using(exists(select 1 from public.applications a where a.id=application_id));
create policy authorized_payments on public.payment_sessions for select to authenticated using(exists(select 1 from public.applications a where a.id=application_id));
create policy staff_email on public.email_notifications for select to authenticated using(public.platform_staff());
create policy staff_audit on public.platform_audit for select to authenticated using(public.platform_staff());
-- Grant hashes are never available to clients, including via the Data API.
revoke all on public.agent_grants from anon, authenticated;
revoke insert,update,delete on public.platform_roles,public.applications,public.application_documents,public.application_history,public.platform_audit,public.payment_sessions,public.email_notifications from anon,authenticated;
grant select on public.platform_roles,public.applications,public.application_documents,public.application_history,public.platform_audit,public.payment_sessions,public.email_notifications to authenticated;
grant all on public.platform_roles,public.applications,public.application_documents,public.application_history,public.platform_audit,public.payment_sessions,public.email_notifications,public.agent_grants to service_role;

create function public.platform_command(actor uuid, kind text, app_id uuid, command text, payload jsonb default '{}')
returns jsonb language plpgsql security definer set search_path = public as $$
declare a applications; p payment_sessions; old_status text; next_status text; staff_role text; event_id uuid; recipient_email text;
begin
 if kind not in ('applicant','admin','agent') then raise exception 'Forbidden'; end if;
 if command='create' then
  if kind='admin' then raise exception 'Forbidden'; end if;
  insert into applications(owner_id,draft_key,answers) values(actor,payload->>'draft_key',payload->'answers') on conflict(owner_id,draft_key) do nothing;
  select * into a from applications where owner_id=actor and draft_key=payload->>'draft_key';
  insert into platform_audit(application_id,actor_id,actor_kind,action) values(a.id,actor,kind,command);
  return to_jsonb(a);
 end if;
 select * into a from applications where id=app_id for update;
 if not found then raise exception 'Application not found'; end if;
 if kind='admin' then
  select role into staff_role from platform_roles where user_id=actor;
  if staff_role is null or command <> 'transition' then raise exception 'Forbidden'; end if;
 elsif a.owner_id <> actor then raise exception 'Application not found'; end if;
 old_status := a.status;
 if command in ('update','document','remove_document','confirm','submit','checkout','transition') and a.version is distinct from (payload->>'version')::integer then raise exception 'Version conflict. Reload the application.'; end if;
 if command in ('update','document','remove_document') then
  if a.status not in ('draft','waiting_for_information') then raise exception 'Application is not editable'; end if;
  if command='update' then
   -- A changed category invalidates the old checklist.
   if (a.answers->>'application_type',a.answers->>'visa_category',a.answers->>'afghan_purpose',a.answers->>'student_course_type') is distinct from
      (payload->'answers'->>'application_type',payload->'answers'->>'visa_category',payload->'answers'->>'afghan_purpose',payload->'answers'->>'student_course_type') then
    delete from application_documents where application_id=a.id;
   end if;
   a.answers := payload->'answers';
  elsif command='document' then
   insert into application_documents(application_id,type,path,mime_type,size,sha256)
    values(a.id,payload->>'type',payload->>'path',payload->>'mime_type',(payload->>'size')::integer,payload->>'sha256')
    on conflict(application_id,type) do update set path=excluded.path,mime_type=excluded.mime_type,size=excluded.size,sha256=excluded.sha256,created_at=now();
  else delete from application_documents where application_id=a.id and type=payload->>'type'; end if;
  a.version := a.version+1; a.confirmed_version := null; a.confirmed_at := null;
 elsif command='confirm' then
  if kind <> 'applicant' or a.status not in ('draft','waiting_for_information','awaiting_payment') then raise exception 'Human confirmation required'; end if;
  if a.payment_status <> 'paid' then a.status := 'awaiting_payment'; end if;
  a.version := a.version+1; a.confirmed_version := a.version; a.confirmed_at := now();
 elsif command='reopen' then
  if a.status <> 'awaiting_payment' then raise exception 'Application cannot be reopened'; end if;
  if exists(select 1 from payment_sessions where application_id=a.id and status in ('processing','pending')) then raise exception 'Cancel the open checkout before editing'; end if;
  a.status := 'draft'; a.version := a.version+1; a.confirmed_version := null;
 elsif command='checkout' then
  if a.confirmed_version is distinct from a.version or a.status <> 'awaiting_payment' then raise exception 'Review and confirm this application first'; end if;
  select * into p from payment_sessions where application_id=a.id and (request_key=payload->>'request_key' or status in ('pending','processing','paid')) order by created_at desc limit 1;
  if not found then
   insert into payment_sessions(application_id,request_key,amount,currency) values(a.id,payload->>'request_key',(payload->>'amount')::integer,payload->>'currency') returning * into p;
  end if;
  a.payment_status := p.status;
 elsif command='payment' then
  if kind <> 'applicant' then raise exception 'Authorize payment in checkout'; end if;
  select * into p from payment_sessions where id=(payload->>'payment_id')::uuid and application_id=a.id for update;
  if not found then raise exception 'Checkout not found'; end if;
  if p.status in ('paid','failed','cancelled') then return to_jsonb(a); end if;
  if payload->>'outcome' not in ('processing','paid','failed','cancelled','pending') then raise exception 'Invalid payment outcome'; end if;
  p.status := payload->>'outcome';
  update payment_sessions set status=p.status,updated_at=now(),transaction_reference=case when p.status='paid' then 'SANDBOX-'||p.id::text else null end where id=p.id;
  a.payment_status := p.status;
 elsif command='submit' then
  if a.status in ('submitted','under_review','accepted','rejected') then return to_jsonb(a); end if;
  if a.status not in ('awaiting_payment','waiting_for_information','draft') or a.payment_status <> 'paid' or a.confirmed_version is distinct from a.version or a.confirmed_at < now()-interval '24 hours' then raise exception 'Payment and current user confirmation required'; end if;
  a.status := 'submitted'; a.version := a.version+1;
 elsif command='transition' then
  next_status := payload->>'status';
  if length(trim(coalesce(payload->>'reason',''))) < 3 then raise exception 'A reason is required'; end if;
  if next_status in ('accepted','rejected') and staff_role not in ('decision_maker','administrator') then raise exception 'Decision role required'; end if;
  if not ((a.status='submitted' and next_status in ('under_review','waiting_for_information')) or
          (a.status='under_review' and next_status in ('waiting_for_information','accepted','rejected')) or
          (a.status='waiting_for_information' and next_status='under_review')) then raise exception 'Invalid status transition'; end if;
  a.status := next_status; a.version := a.version+1; a.confirmed_version := null;
 else raise exception 'Unknown command'; end if;
 update applications set answers=a.answers,status=a.status,payment_status=a.payment_status,version=a.version,confirmed_version=a.confirmed_version,confirmed_at=a.confirmed_at,updated_at=now() where id=a.id returning * into a;
 insert into platform_audit(application_id,actor_id,actor_kind,action) values(a.id,actor,kind,command);
 if old_status <> a.status then
  insert into application_history(application_id,actor_id,actor_kind,from_status,to_status,reason) values(a.id,actor,kind,old_status,a.status,coalesce(payload->>'reason','')) returning id into event_id;
  if a.status in ('submitted','waiting_for_information','accepted','rejected') then
   select email into recipient_email from auth.users where id=a.owner_id;
   insert into email_notifications(application_id,history_id,recipient,subject,body) values(a.id,event_id,recipient_email,
    'Visa Seva: '||replace(a.status,'_',' '),
    'Application '||a.reference||E'\nStatus: '||replace(a.status,'_',' ')||E'\n'||coalesce(payload->>'reason','')||E'\n'||
    case a.status when 'submitted' then 'We have received your application. You can follow its progress in your account.' when 'waiting_for_information' then 'Open your application, provide the requested information, and submit it again.' when 'accepted' then 'Open your application to review the decision and next steps. This decision does not grant a government visa.' else 'Open your application to review the reason and next steps.' end);
  end if;
 end if;
 return to_jsonb(a);
end $$;
revoke all on function public.platform_command(uuid,text,uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.platform_command(uuid,text,uuid,text,jsonb) to service_role;

create function public.claim_platform_emails() returns setof public.email_notifications language plpgsql security definer set search_path=public as $$
begin
 update email_notifications set status='needs_attention',last_error='Delivery uncertain beyond provider deduplication window' where status in ('queued','sending') and first_attempt_at < now()-interval '23 hours';
 return query update email_notifications set status='sending',attempts=attempts+1,first_attempt_at=coalesce(first_attempt_at,now()),lease_until=now()+interval '2 minutes'
 where id in(select id from email_notifications where ((status='queued' and next_attempt_at<=now()) or (status='sending' and lease_until<now())) order by created_at for update skip locked limit 10) returning *;
end $$;
revoke all on function public.claim_platform_emails() from public,anon,authenticated;
grant execute on function public.claim_platform_emails() to service_role;
