create table public.platform_oauth_clients(id uuid primary key default gen_random_uuid(),name text not null,redirect_uris text[] not null,created_at timestamptz not null default now());
create table public.platform_oauth_requests(
 id uuid primary key default gen_random_uuid(),client_id uuid not null references public.platform_oauth_clients(id),redirect_uri text not null,state text not null,
 challenge text not null,scopes text[] not null,resource text not null,owner_id uuid references auth.users(id),code_hash text unique,used_at timestamptz,
 expires_at timestamptz not null default now()+interval '10 minutes'
);
alter table public.platform_oauth_clients enable row level security;
alter table public.platform_oauth_requests enable row level security;
revoke all on public.platform_oauth_clients,public.platform_oauth_requests from anon,authenticated;
grant all on public.platform_oauth_clients,public.platform_oauth_requests to service_role;
create function public.redeem_platform_code(code_digest text,client uuid,redirect text,pkce text,audience text,token_digest text) returns jsonb language plpgsql security definer set search_path=public as $$
declare r platform_oauth_requests; g agent_grants;
begin
 select * into r from platform_oauth_requests where code_hash=code_digest for update;
 if not found or r.used_at is not null or r.expires_at<now() or r.client_id<>client or r.redirect_uri<>redirect or r.challenge<>pkce or r.resource<>audience or r.owner_id is null then raise exception 'invalid_grant'; end if;
 update platform_oauth_requests set used_at=now() where id=r.id;
 insert into agent_grants(owner_id,token_hash,label,scopes,expires_at) values(r.owner_id,token_digest,'OAuth assistant',r.scopes,now()+interval '1 hour') returning * into g;
 return jsonb_build_object('scope',array_to_string(g.scopes,' '),'expires_in',3600);
end $$;
revoke all on function public.redeem_platform_code(text,uuid,text,text,text,text) from public,anon,authenticated;
grant execute on function public.redeem_platform_code(text,uuid,text,text,text,text) to service_role;
