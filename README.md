# Embrione: Meet The Team

Onboarding and moderation system for The Embrione web development challenge.

## Features
- `/register`: member form with a live card preview, client-side WebP conversion (max 800px, quality 0.8), upload to Supabase Storage, duplicate SRN check
- `/admin`: login-protected dashboard with counters and Approve / Reject / Delete
- `/team`: public directory showing approved members only, with Domain and Position filters

## Tech stack
React + Vite, Tailwind CSS, Supabase (PostgreSQL + Storage), react-router-dom, react-hot-toast, deployed on Vercel.

## Setup
1. Clone the repo and run `npm install`
2. Create a Supabase project, then run `supabase/schema.sql` in the Supabase SQL Editor (creates the members table, RLS policies, the public `member-photos` bucket and sample data)
3. Create a `.env` file:
```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```
4. Run `npm run dev`

## Admin login
Email: `admin@embrione.pes.edu`
Password: `EmbrioneAdmin@2026`

## Author
Amartya Maiya P, PES1UG25CS050