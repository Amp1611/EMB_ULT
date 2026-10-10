-- Members table
create table public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null,
  position text not null,
  srn text not null,
  email text not null,
  linkedin_url text,
  github_url text,
  branch text not null,
  semester integer not null,
  bio text,
  photo_url text not null,
  status text not null default 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row level security
alter table public.members enable row level security;
create policy "Allow public insert" on public.members for insert with check (true);
create policy "Allow public read" on public.members for select using (true);
create policy "Allow admin updates" on public.members for update using (true);
create policy "Allow admin deletes" on public.members for delete using (true);

-- Public storage bucket for profile photos
insert into storage.buckets (id, name, public)
values ('member-photos', 'member-photos', true)
on conflict (id) do nothing;

create policy "Public photo upload" on storage.objects
  for insert with check (bucket_id = 'member-photos');
create policy "Public photo read" on storage.objects
  for select using (bucket_id = 'member-photos');

-- Optional seed data: mock approved profiles
insert into public.members (name, domain, position, srn, email, branch, semester, bio, photo_url, status) values
('Aarav Sharma','Web Development','Head','PES1UG22CS001','aarav@example.com','CSE',7,'Builds fast, clean web apps and loves open source.','https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav','approved'),
('Diya Rao','Design','Vice-Head','PES1UG22CS002','diya@example.com','AIML',6,'Turns messy ideas into sleek interfaces.','https://api.dicebear.com/7.x/avataaars/svg?seed=Diya','approved'),
('Kabir Nair','Logistics','Core Member','PES1UG23CS003','kabir@example.com','ECE',5,'Keeps events running on time and on budget.','https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir','approved'),
('Meera Iyer','Social Media','Member','PES1UG24CS004','meera@example.com','CSE',3,'Writes the posts you end up sharing.','https://api.dicebear.com/7.x/avataaars/svg?seed=Meera','approved'),
('Rohan Gupta','Sponsorship','Core Member','PES1UG23CS005','rohan@example.com','ME',5,'Finds sponsors and closes deals.','https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan','approved');