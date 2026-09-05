-- Private bytes are accessible only through short-lived, authorized API links.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('application-documents','application-documents',false,10485760,array['image/jpeg','application/pdf'])
on conflict(id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
-- No client object policies: only the backend service role can upload or sign downloads.
