# OMNeXa Professional Vercel Website

A polished Next.js website for OMNeXa Pte. Ltd. designed for Vercel deployment.

## What this version improves

- More premium consultancy-style visual design with dark, gold and blue brand system.
- Presentation-based OMNeXa logo and AI / sustainability / wellbeing visual assets.
- Clear service flow using service cards and detail pages.
- Topmate-style service entry points: Discovery Call, Advisory Sprint, Workshop / Keynote, Fractional Advisory.
- Contact form captures name, email, contact number, organisation, service interest and message.
- Contact form sends email to `dhiraj.kumar@omnexagoc.com` through Resend.
- Root-level project structure, so Vercel can find the `app/` directory.

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Vercel deployment settings

Use these settings in Vercel:

```text
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: leave blank
Root Directory: leave blank
```

## Environment variables

Add these in Vercel > Project > Settings > Environment Variables:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=dhiraj.kumar@omnexagoc.com
CONTACT_FROM_EMAIL=OMNeXa Website <noreply@omnexagoc.com>
NEXT_PUBLIC_TOPMATE_URL=https://topmate.io/dhiraj_kumar007
```

## Email configuration

The project uses Resend for transactional email. To avoid delivery issues:

1. Create a Resend account.
2. Verify your domain, ideally `omnexagoc.com`.
3. Create an API key.
4. Add the environment variables above in Vercel.
5. Redeploy the project.

## Folder structure

```text
app/
  api/contact/route.ts
  services/[slug]/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  ContactForm.tsx
lib/
  site-data.ts
public/
  brand/
  images/
package.json
```

## Important

Upload the contents of this folder directly to the GitHub repository root. Do not wrap it inside another parent folder unless you set Vercel's Root Directory to that folder.
