# OMNeXa Vercel Website

A premium multi-page consulting website for OMNeXa Pte. Ltd. built with Next.js App Router and ready for Vercel deployment.

## What is included

- Multi-page responsive website inspired by the structure of Crossroads Navigator
- Dedicated pages for Services, AI Readiness, About and Contact
- Updated OMX brand mark in the header and SVG asset
- Services and six OMNeXa pillars
- Human + AI future-readiness content
- Founder / About section
- Client feedback, FAQs and contact form
- Server-side contact form email route using Resend

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment variables

```bash
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=dhiraj.kumar@omnexagoc.com
CONTACT_FROM_EMAIL=OMNeXa <onboarding@resend.dev>
```

## Deploy to Vercel

1. Push this project to a Git repository.
2. Import the repository in Vercel.
3. Add the environment variables above.
4. Deploy.
