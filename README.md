# Joseph Chimaobi Egbuonu — Creative Portfolio

A full-stack cinematic portfolio website with a custom CMS admin dashboard.

**Live:** https://joseph-portfolio-kohl.vercel.app

---

## Overview

Premium, editorial-style portfolio for a cinematographer and creative director. Built with Next.js 16 (App Router) and driven entirely by a Prisma + PostgreSQL database — every visible piece of content is editable from the admin dashboard.

### Features

**Public site**
- Cinematic homepage (hero, featured work, services preview, about, CTA)
- Work portfolio with category filtering
- Individual project pages with video, gallery, prev/next navigation
- About page with bio, skills, tools, experience
- Services page
- Contact form saving to database + optional WhatsApp
- Social links in footer/contact (only render if URL is set)
- Light / Dark theme toggle
- Fully responsive (mobile → 4K)
- Accessible (semantic HTML, keyboard nav, ARIA)
- SEO metadata, Open Graph, noindex on admin
- Installable as a PWA (phone + desktop)

**Admin dashboard** (`/admin`, login required)
- Secure credentials auth (bcrypt + JWT sessions)
- Real stats (projects, published, drafts, featured, services, unread messages)
- Full CRUD for: Projects, Services, Testimonials
- Messages inbox with read/unread tracking
- Homepage CMS (hero, sections, CTAs)
- About CMS (bio, skills, tools)
- Site Settings (contact, SEO, footer)
- Social Links manager
- Client Share Links page (one-click copy of the site URL)
- Media uploads — direct-to-Blob, orientation-aware previews
- Password change form
- Custom 3D-feel Select component with orange glow
- Theme switcher (light/dark)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, Lucide icons |
| Database | PostgreSQL (Neon, Frankfurt) |
| ORM | Prisma 5 |
| Auth | NextAuth.js v4 (Credentials) |
| Validation | Zod |
| Hashing | bcryptjs |
| Media | Vercel Blob |
| Hosting | Vercel (functions in `fra1`) |
| Fonts | Inter (next/font/google) |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Londoski/joseph-portfolio.git
cd joseph-portfolio
npm install