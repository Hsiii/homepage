alter table public.user_bookmarks
add column trash jsonb not null default '[]'::jsonb
check (jsonb_typeof(trash) = 'array');
