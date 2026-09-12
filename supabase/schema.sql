-- ============================================================================
-- SAREE BUSINESS APP — DATABASE SCHEMA, STORAGE, ROW LEVEL SECURITY
-- Run this once in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  name text,
  role text not null default 'admin' check (role in ('admin','staff')),
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  what_can_do text[] not null default '{}',
  starting_price numeric,
  estimated_duration text,
  image_url text,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_designs (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid references services(id) on delete cascade not null,
  name text not null,
  description text,
  image_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists showcases (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid references services(id) on delete set null,
  title text not null,
  category text not null default 'Custom Work',
  description text,
  starting_price numeric,
  duration text,
  is_published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists showcase_images (
  id uuid primary key default uuid_generate_v4(),
  showcase_id uuid references showcases(id) on delete cascade not null,
  image_type text not null check (image_type in ('before','after','additional')),
  image_url text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  whatsapp text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence if not exists service_request_seq;

create table if not exists service_requests (
  id uuid primary key default uuid_generate_v4(),
  request_number text unique,
  customer_id uuid references customers(id) on delete set null,
  service_id uuid references services(id) on delete set null,
  design_id uuid references service_designs(id) on delete set null,
  description text,
  preferred_date date,
  budget numeric,
  status text not null default 'new' check (status in
    ('new','contacted','quotation_sent','approved','saree_received','in_progress','ready','delivered','cancelled')),
  quoted_price numeric,
  advance_amount numeric,
  remaining_amount numeric,
  payment_status text not null default 'not_paid' check (payment_status in
    ('not_paid','advance_paid','partially_paid','fully_paid','refunded')),
  admin_notes text,
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run: adds the column if it's missing from an existing database
-- (needed for the Terms/Privacy/marketing-consent update on the Request form).
alter table service_requests add column if not exists marketing_consent boolean not null default false;

create table if not exists request_images (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references service_requests(id) on delete cascade not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  review text not null,
  rating int not null default 5 check (rating between 1 and 5),
  image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  display_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  id int primary key default 1,
  business_name text default '[BUSINESS NAME]',
  phone text default '[PHONE NUMBER]',
  whatsapp text default '[WHATSAPP NUMBER]',
  whatsapp_digits text default '910000000000',
  email text default '[EMAIL]',
  address text default '[BUSINESS ADDRESS]',
  maps_url text default '',
  business_hours text default '[BUSINESS HOURS]',
  instagram_url text default '',
  facebook_url text default '',
  logo_url text default '',
  hero_image_url text default '',
  homepage_text text default '',
  footer_text text default '',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_services_active on services(is_active, display_order);
create index if not exists idx_showcases_published on showcases(is_published, display_order);
create index if not exists idx_showcase_images_showcase on showcase_images(showcase_id);
create index if not exists idx_service_designs_service on service_designs(service_id, display_order);
create index if not exists idx_requests_status on service_requests(status);
create index if not exists idx_requests_number on service_requests(request_number);
create index if not exists idx_requests_customer on service_requests(customer_id);
create index if not exists idx_request_images_request on request_images(request_id);
create index if not exists idx_customers_phone on customers(phone);
create index if not exists idx_testimonials_published on testimonials(is_published);
create index if not exists idx_faqs_published on faqs(is_published, display_order);

-- ============================================================================
-- AUTO-GENERATE REQUEST NUMBER  (format SR-YYYY-00001)
-- ============================================================================
create or replace function generate_request_number()
returns trigger as $$
begin
  if new.request_number is null then
    new.request_number := 'SR-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('service_request_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_generate_request_number on service_requests;
create trigger trg_generate_request_number
before insert on service_requests
for each row execute function generate_request_number();

-- keep updated_at fresh
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_services_updated_at on services;
create trigger trg_services_updated_at before update on services
for each row execute function set_updated_at();

drop trigger if exists trg_showcases_updated_at on showcases;
create trigger trg_showcases_updated_at before update on showcases
for each row execute function set_updated_at();

drop trigger if exists trg_requests_updated_at on service_requests;
create trigger trg_requests_updated_at before update on service_requests
for each row execute function set_updated_at();

drop trigger if exists trg_customers_updated_at on customers;
create trigger trg_customers_updated_at before update on customers
for each row execute function set_updated_at();

-- ============================================================================
-- is_admin() helper — used by every RLS policy below
-- ============================================================================
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table profiles enable row level security;
alter table services enable row level security;
alter table service_designs enable row level security;
alter table showcases enable row level security;
alter table showcase_images enable row level security;
alter table customers enable row level security;
alter table service_requests enable row level security;
alter table request_images enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table site_settings enable row level security;

-- profiles: a user can read their own row; admins can read all
drop policy if exists "profiles_select_self_or_admin" on profiles;
create policy "profiles_select_self_or_admin" on profiles
  for select using (auth.uid() = user_id or is_admin());
drop policy if exists "profiles_admin_manage" on profiles;
create policy "profiles_admin_manage" on profiles
  for all using (is_admin()) with check (is_admin());

-- services: public can read active services; admin full control
drop policy if exists "services_public_read" on services;
create policy "services_public_read" on services
  for select using (is_active = true or is_admin());
drop policy if exists "services_admin_write" on services;
create policy "services_admin_write" on services
  for insert with check (is_admin());
drop policy if exists "services_admin_update" on services;
create policy "services_admin_update" on services
  for update using (is_admin()) with check (is_admin());
drop policy if exists "services_admin_delete" on services;
create policy "services_admin_delete" on services
  for delete using (is_admin());

-- service_designs: same pattern, tied to parent service's active flag
drop policy if exists "designs_public_read" on service_designs;
create policy "designs_public_read" on service_designs
  for select using (is_active = true or is_admin());
drop policy if exists "designs_admin_write" on service_designs;
create policy "designs_admin_write" on service_designs
  for insert with check (is_admin());
drop policy if exists "designs_admin_update" on service_designs;
create policy "designs_admin_update" on service_designs
  for update using (is_admin()) with check (is_admin());
drop policy if exists "designs_admin_delete" on service_designs;
create policy "designs_admin_delete" on service_designs
  for delete using (is_admin());

-- showcases: public can read published; admin full control
drop policy if exists "showcases_public_read" on showcases;
create policy "showcases_public_read" on showcases
  for select using (is_published = true or is_admin());
drop policy if exists "showcases_admin_write" on showcases;
create policy "showcases_admin_write" on showcases
  for insert with check (is_admin());
drop policy if exists "showcases_admin_update" on showcases;
create policy "showcases_admin_update" on showcases
  for update using (is_admin()) with check (is_admin());
drop policy if exists "showcases_admin_delete" on showcases;
create policy "showcases_admin_delete" on showcases
  for delete using (is_admin());

-- showcase_images: readable if parent showcase is published; admin full
drop policy if exists "showcase_images_public_read" on showcase_images;
create policy "showcase_images_public_read" on showcase_images
  for select using (
    is_admin() or exists (
      select 1 from showcases s where s.id = showcase_id and s.is_published = true
    )
  );
drop policy if exists "showcase_images_admin_write" on showcase_images;
create policy "showcase_images_admin_write" on showcase_images
  for insert with check (is_admin());
drop policy if exists "showcase_images_admin_delete" on showcase_images;
create policy "showcase_images_admin_delete" on showcase_images
  for delete using (is_admin());

-- customers: public (anon) can INSERT only (creating their own record when
-- submitting a request). Nobody but admin can read customer data.
drop policy if exists "customers_public_insert" on customers;
create policy "customers_public_insert" on customers
  for insert with check (true);
drop policy if exists "customers_admin_read" on customers;
create policy "customers_admin_read" on customers
  for select using (is_admin());
drop policy if exists "customers_admin_update" on customers;
create policy "customers_admin_update" on customers
  for update using (is_admin()) with check (is_admin());

-- service_requests: public (anon) can INSERT only. Only admin can read/update.
drop policy if exists "requests_public_insert" on service_requests;
create policy "requests_public_insert" on service_requests
  for insert with check (true);
drop policy if exists "requests_admin_read" on service_requests;
create policy "requests_admin_read" on service_requests
  for select using (is_admin());
drop policy if exists "requests_admin_update" on service_requests;
create policy "requests_admin_update" on service_requests
  for update using (is_admin()) with check (is_admin());

-- request_images: public (anon) can INSERT only. Only admin can read.
drop policy if exists "request_images_public_insert" on request_images;
create policy "request_images_public_insert" on request_images
  for insert with check (true);
drop policy if exists "request_images_admin_read" on request_images;
create policy "request_images_admin_read" on request_images
  for select using (is_admin());

-- testimonials: public reads published; admin full control
drop policy if exists "testimonials_public_read" on testimonials;
create policy "testimonials_public_read" on testimonials
  for select using (is_published = true or is_admin());
drop policy if exists "testimonials_admin_write" on testimonials;
create policy "testimonials_admin_write" on testimonials
  for insert with check (is_admin());
drop policy if exists "testimonials_admin_update" on testimonials;
create policy "testimonials_admin_update" on testimonials
  for update using (is_admin()) with check (is_admin());
drop policy if exists "testimonials_admin_delete" on testimonials;
create policy "testimonials_admin_delete" on testimonials
  for delete using (is_admin());

-- faqs: public reads published; admin full control
drop policy if exists "faqs_public_read" on faqs;
create policy "faqs_public_read" on faqs
  for select using (is_published = true or is_admin());
drop policy if exists "faqs_admin_write" on faqs;
create policy "faqs_admin_write" on faqs
  for insert with check (is_admin());
drop policy if exists "faqs_admin_update" on faqs;
create policy "faqs_admin_update" on faqs
  for update using (is_admin()) with check (is_admin());
drop policy if exists "faqs_admin_delete" on faqs;
create policy "faqs_admin_delete" on faqs
  for delete using (is_admin());

-- site_settings: everyone can read; only admin can update
drop policy if exists "settings_public_read" on site_settings;
create policy "settings_public_read" on site_settings
  for select using (true);
drop policy if exists "settings_admin_update" on site_settings;
create policy "settings_admin_update" on site_settings
  for update using (is_admin()) with check (is_admin());

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
insert into storage.buckets (id, name, public)
values
  ('service-images', 'service-images', true),
  ('showcase-images', 'showcase-images', true),
  ('site-images', 'site-images', true),
  ('customer-uploads', 'customer-uploads', false)
on conflict (id) do nothing;

-- Public read for the three public buckets
drop policy if exists "public_read_service_images" on storage.objects;
create policy "public_read_service_images" on storage.objects
  for select using (bucket_id = 'service-images');

drop policy if exists "public_read_showcase_images" on storage.objects;
create policy "public_read_showcase_images" on storage.objects
  for select using (bucket_id = 'showcase-images');

drop policy if exists "public_read_site_images" on storage.objects;
create policy "public_read_site_images" on storage.objects
  for select using (bucket_id = 'site-images');

-- Admin can upload/update/delete in the three public buckets
drop policy if exists "admin_write_service_images" on storage.objects;
create policy "admin_write_service_images" on storage.objects
  for insert with check (bucket_id = 'service-images' and is_admin());
drop policy if exists "admin_update_service_images" on storage.objects;
create policy "admin_update_service_images" on storage.objects
  for update using (bucket_id = 'service-images' and is_admin());
drop policy if exists "admin_delete_service_images" on storage.objects;
create policy "admin_delete_service_images" on storage.objects
  for delete using (bucket_id = 'service-images' and is_admin());

drop policy if exists "admin_write_showcase_images" on storage.objects;
create policy "admin_write_showcase_images" on storage.objects
  for insert with check (bucket_id = 'showcase-images' and is_admin());
drop policy if exists "admin_update_showcase_images" on storage.objects;
create policy "admin_update_showcase_images" on storage.objects
  for update using (bucket_id = 'showcase-images' and is_admin());
drop policy if exists "admin_delete_showcase_images" on storage.objects;
create policy "admin_delete_showcase_images" on storage.objects
  for delete using (bucket_id = 'showcase-images' and is_admin());

drop policy if exists "admin_write_site_images" on storage.objects;
create policy "admin_write_site_images" on storage.objects
  for insert with check (bucket_id = 'site-images' and is_admin());
drop policy if exists "admin_update_site_images" on storage.objects;
create policy "admin_update_site_images" on storage.objects
  for update using (bucket_id = 'site-images' and is_admin());
drop policy if exists "admin_delete_site_images" on storage.objects;
create policy "admin_delete_site_images" on storage.objects
  for delete using (bucket_id = 'site-images' and is_admin());

-- customer-uploads: PRIVATE. Public (anon) may only INSERT (upload) their
-- photos when submitting a request. Only admin can read/list/delete.
drop policy if exists "public_upload_customer_uploads" on storage.objects;
create policy "public_upload_customer_uploads" on storage.objects
  for insert with check (bucket_id = 'customer-uploads');
drop policy if exists "admin_read_customer_uploads" on storage.objects;
create policy "admin_read_customer_uploads" on storage.objects
  for select using (bucket_id = 'customer-uploads' and is_admin());
drop policy if exists "admin_delete_customer_uploads" on storage.objects;
create policy "admin_delete_customer_uploads" on storage.objects
  for delete using (bucket_id = 'customer-uploads' and is_admin());

-- ============================================================================
-- SEED DATA (optional) — clearly-marked sample content so the site isn't
-- empty on first load. Safe to edit or delete from the admin dashboard later.
-- Placeholder images use placehold.co (branded colour blocks, not stock
-- photography) — replace with real photos from Admin whenever ready.
-- ============================================================================

insert into services (name, slug, short_description, description, what_can_do, starting_price, estimated_duration, image_url, display_order)
values
  ('Tassel / Tuzzel Work', 'tassel-work',
   $$Beautiful customised tassels and finishing for your saree's pallu and border.$$,
   $$Our tassel and tuzzel specialists hand-finish every thread to match your saree's colour, fabric and occasion, from simple everyday tassels to elaborate bridal tuzzel work.$$,
   array['Custom tassel colour matching','Bead, thread or zari tuzzel styles','Bridal & festive tassel designs','Repair or replace worn-out tassels'],
   null, '1-2 days', 'https://placehold.co/800x600/6E1E3C/FBF7EF?text=Tassel+Work', 1),
  ('Premium Polish', 'premium-polish',
   $$Enhance the appearance and finishing of sarees with a professional polish.$$,
   $$A careful finishing process that restores shine, crispness and drape to your saree, ideal before a special occasion or after long storage.$$,
   array['Fabric-safe shine restoration','Crease and dullness treatment','Suitable for silk, cotton & blended sarees','Gentle handling for delicate borders'],
   null, '2-4 days', 'https://placehold.co/800x600/1F4B4A/FBF7EF?text=Premium+Polish', 2),
  ('Saree Repair', 'saree-repair',
   $$Repair torn or damaged sarees while maintaining a clean, natural finish.$$,
   $$From small tears to significant damage, our repair work blends carefully into the original fabric so the saree looks whole again.$$,
   array['Torn fabric restoration','Border and pallu repair','Moth or damage patching','Reinforcement for fragile antique sarees'],
   null, '3-5 days', 'https://placehold.co/800x600/9C3A5C/FBF7EF?text=Saree+Repair', 3),
  ('Saree Alteration', 'saree-alteration',
   $$Modify length, finishing, borders or other required areas.$$,
   $$Whether your saree needs shortening, a fresh fall and edging, or border adjustments, we alter it neatly to your exact requirement.$$,
   array['Length adjustment','Fall & edging finishing','Border repositioning','Fabric resizing for comfort'],
   null, '2-3 days', 'https://placehold.co/800x600/7a5a2e/FBF7EF?text=Saree+Alteration', 4),
  ('Blouse Making', 'blouse-making',
   $$Blouses made to your measurements and design requirements.$$,
   $$Custom blouses stitched to your measurements, whether you bring a design reference or want our recommendation for your saree.$$,
   array['Measurement-based stitching','Design & neckline customisation','Lining and padding options','Matching or contrast fabric blouses'],
   null, '4-7 days', 'https://placehold.co/800x600/B8923F/2B2420?text=Blouse+Making', 5),
  ('Custom Saree Work', 'custom-work',
   $$Special customisation based on your specific requirements.$$,
   $$Have something specific in mind? Share your saree and requirement and we'll assess the best way to bring it to life.$$,
   array['Fabric embellishment','Design consultation','One-off custom requests','Combination of multiple services'],
   null, 'Varies', 'https://placehold.co/800x600/4C1329/FBF7EF?text=Custom+Work', 6)
on conflict (slug) do nothing;

insert into service_designs (service_id, name, description, image_url, display_order)
select s.id, d.name, d.description, d.image_url, d.ord
from services s
join (values
  ('tassel-work', 'Classic Zari Tassel', 'Traditional gold zari-thread tassel, simple and elegant.', 'https://placehold.co/600x600/6E1E3C/FBF7EF?text=Classic+Zari', 1),
  ('tassel-work', 'Beaded Tuzzel', 'Fine glass or metal beads woven into the tassel head.', 'https://placehold.co/600x600/B8923F/2B2420?text=Beaded+Tuzzel', 2),
  ('tassel-work', 'Bridal Kundan Tuzzel', 'Elaborate kundan-studded tuzzel for bridal sarees.', 'https://placehold.co/600x600/4C1329/E8D9AE?text=Bridal+Kundan', 3),
  ('tassel-work', 'Thread Pom-Pom Tassel', 'Soft, rounded thread pom-poms in matching or contrast colours.', 'https://placehold.co/600x600/1F4B4A/DCEAE8?text=Pom-Pom', 4),
  ('tassel-work', 'Contrast Silk Tassel', 'Silk thread tassel in a contrast colour for a statement look.', 'https://placehold.co/600x600/7a5a2e/FBF7EF?text=Contrast+Silk', 5),
  ('tassel-work', 'Temple Border Tuzzel', 'Temple-style motif tuzzel finished along the border.', 'https://placehold.co/600x600/9C3A5C/FBF7EF?text=Temple+Border', 6),
  ('blouse-making', 'Sweetheart Neck Blouse', 'A soft curved neckline, flattering for most saree styles.', 'https://placehold.co/600x600/B8923F/2B2420?text=Sweetheart+Neck', 1),
  ('blouse-making', 'Boat Neck Blouse', 'Wide, elegant neckline that sits along the collarbone.', 'https://placehold.co/600x600/1F4B4A/DCEAE8?text=Boat+Neck', 2),
  ('blouse-making', 'Backless Tie-Up Blouse', 'Statement back with tie-up or knot detailing.', 'https://placehold.co/600x600/9C3A5C/FBF7EF?text=Backless+Tie-Up', 3),
  ('blouse-making', 'High Neck Full Sleeve Blouse', 'Modest, structured fit with full-length sleeves.', 'https://placehold.co/600x600/7a5a2e/FBF7EF?text=High+Neck', 4),
  ('blouse-making', 'Halter Neck Blouse', 'Fitted halter style for a modern, contemporary look.', 'https://placehold.co/600x600/C6A24D/2B2420?text=Halter+Neck', 5),
  ('blouse-making', 'Embellished Bridal Blouse', 'Heavily worked bridal blouse with embellishment options.', 'https://placehold.co/600x600/4C1329/E8D9AE?text=Bridal+Blouse', 6)
) as d(slug, name, description, image_url, ord) on d.slug = s.slug
on conflict do nothing;

insert into showcases (service_id, title, category, description, is_published, display_order)
select s.id, w.title, w.category, w.description, true, w.ord
from services s
join (values
  ('saree-repair', 'Torn Saree Restoration', 'Repair', 'Damaged section repaired and finished to blend naturally with the surrounding fabric.', 1),
  ('tassel-work', 'Bridal Tuzzel Finishing', 'Tassel Work', 'Hand-finished zari tuzzels added for a festive bridal look.', 2),
  ('premium-polish', 'Silk Saree Shine Restoration', 'Polish', 'Dull, creased silk brought back to a crisp, radiant finish.', 3),
  ('saree-alteration', 'Length & Border Adjustment', 'Alteration', 'Saree shortened and re-edged for a cleaner drape.', 4),
  ('blouse-making', 'Custom Fitted Blouse', 'Blouse', 'Blouse stitched to measurement with a contrast lining.', 5),
  ('custom-work', 'Hand Embellished Border', 'Custom Work', 'Custom beadwork added along the border for an evening look.', 6)
) as w(slug, title, category, description, ord) on w.slug = s.slug
on conflict do nothing;

insert into showcase_images (showcase_id, image_type, image_url, display_order)
select sc.id, i.image_type, i.image_url, 1
from showcases sc
join (values
  ('Torn Saree Restoration', 'before', 'https://placehold.co/800x600/6b6357/FBF7EF?text=Before'),
  ('Torn Saree Restoration', 'after', 'https://placehold.co/800x600/8a3f5a/FBF7EF?text=After'),
  ('Bridal Tuzzel Finishing', 'before', 'https://placehold.co/800x600/6b6357/FBF7EF?text=Before'),
  ('Bridal Tuzzel Finishing', 'after', 'https://placehold.co/800x600/B8923F/2B2420?text=After'),
  ('Silk Saree Shine Restoration', 'before', 'https://placehold.co/800x600/6b6357/FBF7EF?text=Before'),
  ('Silk Saree Shine Restoration', 'after', 'https://placehold.co/800x600/1F4B4A/DCEAE8?text=After'),
  ('Length & Border Adjustment', 'before', 'https://placehold.co/800x600/6b6357/FBF7EF?text=Before'),
  ('Length & Border Adjustment', 'after', 'https://placehold.co/800x600/7a5a2e/FBF7EF?text=After'),
  ('Custom Fitted Blouse', 'before', 'https://placehold.co/800x600/6b6357/FBF7EF?text=Before'),
  ('Custom Fitted Blouse', 'after', 'https://placehold.co/800x600/9C3A5C/FBF7EF?text=After'),
  ('Hand Embellished Border', 'before', 'https://placehold.co/800x600/6b6357/FBF7EF?text=Before'),
  ('Hand Embellished Border', 'after', 'https://placehold.co/800x600/4C1329/E8D9AE?text=After')
) as i(title, image_type, image_url) on i.title = sc.title
on conflict do nothing;

insert into faqs (question, answer, display_order, is_published) values
  ('How much does saree repair cost?', $$Repair pricing depends on the extent of the damage. Share photos through our request form and we'll provide a quotation before starting any work.$$, 1, true),
  ('How long does the work take?', $$Most services take 1-7 days depending on complexity. Estimated durations are shown on each service page.$$, 2, true),
  ('Can you repair torn sarees?', $$Yes, torn or damaged sarees are one of our core services. We assess the fabric and blend the repair as naturally as possible.$$, 3, true),
  ('Can I send photos before visiting?', $$Yes, please use the Request a Service form to upload clear photos of the area that needs work.$$, 4, true),
  ('Do you make blouses?', $$Yes, we make custom blouses based on your measurements and design preferences.$$, 5, true),
  ('How do I request a quotation?', $$Fill in the Request a Service form with your details and photos. We'll review it and contact you with pricing.$$, 6, true)
on conflict do nothing;

-- Testimonials are inserted UNPUBLISHED on purpose — these are placeholder
-- sample reviews, not real ones. Publish real reviews from Admin -> Testimonials.
insert into testimonials (customer_name, review, rating, is_published) values
  ('Sample Customer', $$Loved how carefully my old saree was repaired, you can't even tell where the tear was.$$, 5, false),
  ('Sample Customer', $$The tassel work they added for my sister's wedding saree was beautiful.$$, 5, false),
  ('Sample Customer', $$Quick turnaround and clear communication about pricing before the work started.$$, 4, false)
on conflict do nothing;

-- ============================================================================
-- DONE. Next step: create your first admin login — see README.md
-- ============================================================================
