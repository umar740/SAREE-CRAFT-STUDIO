# Saree Business App

A saree customisation & finishing service website — customer-facing site (services,
before/after gallery, request-a-service form) plus a full admin dashboard, built on
React + Vite + TypeScript + Tailwind + Supabase.

This README walks through the **one-time setup** needed before the app is fully live.
Do these in order.

---

## 0. What's already done for you

- `.env` already has your Supabase project URL and anon key filled in.
- All the frontend code is written and wired to Supabase (no more mock data).
- `supabase/schema.sql` has every table, security policy, storage bucket, and a
  small set of clearly-marked sample services/designs/showcases/FAQs so the site
  isn't empty on first load.

What's **not** done yet (you do these, ~10 minutes total):
1. Run the SQL script in Supabase
2. Create your first admin login
3. Install dependencies and test locally
4. Deploy to Netlify

---

## 1. Run the database setup

1. Go to your Supabase project → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy the whole file, paste it in.
3. Click **Run**.

This creates every table (services, showcases, requests, customers, testimonials,
FAQs, site settings, etc.), turns on Row Level Security with the correct public vs
admin-only policies, creates the 4 storage buckets, and inserts a small amount of
sample data so you have something to look at immediately.

You can re-run this script safely — it uses `if not exists` / `on conflict do nothing`
throughout, so it won't duplicate data if you run it twice.

### Storage buckets it creates
| Bucket | Public? | Purpose |
|---|---|---|
| `service-images` | Yes | Service photos, design photos |
| `showcase-images` | Yes | Before/after gallery photos |
| `site-images` | Yes | Logo, hero image |
| `customer-uploads` | **No** (private) | Photos customers upload with a request — only admins can view these |

---

## 2. Create your first admin login

1. In Supabase: **Authentication → Users → Add user**. Enter an email and password
   you'll use to log into `/admin`. (You choose these — I never see them.)
2. Copy the new user's **UID** (shown in the users list).
3. Back in **SQL Editor**, run this (replace the UID and name):

```sql
insert into profiles (user_id, name, role)
values ('paste-the-user-uid-here', 'Owner', 'admin');
```

That's it — that email/password can now log in at `/admin` on the site.

You can repeat step 1–3 later to add more admin/staff logins.

---

## 3. Run it locally

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). You should see the full
site with the sample services and showcases from the SQL seed data. Go to
`/admin`, log in with the account you just created, and you'll see the real
dashboard reading from your Supabase project.

### Try the full loop
1. On the public site, go to **Request a Service**, fill it in, upload a photo, submit.
2. Log into `/admin` → **Requests** → you should see it appear with your uploaded photo.
3. Go to **Admin → Settings** and replace the `[BUSINESS NAME]` / `[PHONE NUMBER]` /
   etc. placeholders with your real business details, save, and refresh the site.

---

## 4. Deploy to Netlify

**Option A — connect a Git repo (recommended)**
1. Push this project to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build command: `npm run build`   Publish directory: `dist`
   (already set in `netlify.toml`, Netlify should detect it automatically)
4. Under **Site settings → Environment variables**, add:
   - `VITE_SUPABASE_URL` = `https://eqjdcuujyydjuikqxdwm.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = your anon key (same values as your local `.env`)
5. Deploy.

**Option B — manual drag-and-drop**
1. Locally: `npm install && npm run build` (this reads your local `.env`)
2. Drag the generated `dist/` folder onto Netlify's "Deploy manually" drop zone.
3. If you ever rebuild, you'll need to re-drag — Option A is easier long-term.

> Never commit your `.env` file to a public repo. It's already in `.gitignore`.
> The anon key is safe to expose in a deployed frontend (that's what it's for) —
> it's the `service_role` key you must never expose, and this project never uses it.

---

## Project structure

```
src/
  lib/            Supabase client, TypeScript types, data-fetching helpers,
                   storage upload helpers, admin API calls
  contexts/       Auth (admin session), Settings (site_settings), Toast notifications
  components/     Shared UI: Navbar, Footer, ServiceCard, BeforeAfterSlider,
                   ImageUploader, ProtectedRoute, etc.
  pages/          Public pages (Home, Services, ServiceDetail, BeforeAfter,
                   RequestService, About, Contact, Privacy, Terms)
  pages/admin/    Admin dashboard pages (Login, Dashboard, Requests, Customers,
                   Services, BeforeAfter, Testimonials, FAQs, Settings)
supabase/
  schema.sql      Full database schema, RLS policies, storage buckets, seed data
```

## Notes on how things work

- **Request numbers** (`SR-2026-00001`) are generated automatically by a Postgres
  trigger on insert — never by the frontend — so they can't collide.
- **Customer uploads are private.** They go to the `customer-uploads` bucket, which
  is not publicly readable. Only a logged-in admin can view them (via a signed URL
  that expires after an hour).
- **Prices are never invented.** If a service has no `starting_price` set, the site
  shows "Price on inspection" rather than a placeholder number.
- **Designs** (the "6 designs to choose from" galleries on Tassel Work and Blouse
  Making) are stored in their own `service_designs` table — add more from
  **Admin → Services → Designs** for any service, not just those two.

## What's deliberately not built yet (per the original spec)

- Customer accounts/login
- Online payment processing (the database has quoted/advance/remaining price and
  payment_status fields ready for it, but no payment gateway is wired up)
- WhatsApp/SMS/email notifications on status change
- Multi-branch / staff-specific permissions beyond the single `admin` role

These were explicitly marked as "later" features in the original project brief.
