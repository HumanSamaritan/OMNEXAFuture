# OMNeXa Vercel Deployment Fix

This package is structured with `app/` and `package.json` at the project root.

## Why the previous deployment failed

Vercel/Next.js looks for either an `app/` directory or a `pages/` directory under the project root. If you upload or connect a GitHub repo whose root contains only a parent folder, Vercel cannot see the Next.js app and the build fails with:

> Couldn't find any `pages` or `app` directory. Please create one under the project root

## Correct structure

Your GitHub repository root should look like this:

```text
app/
components/
lib/
public/
package.json
next.config.mjs
tsconfig.json
```

Do not upload a GitHub repo where the structure is:

```text
some-folder/
  app/
  package.json
```

unless you set Vercel's Root Directory to `some-folder`.

## Vercel settings

Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: leave blank / default
Root Directory: leave blank if this package is used at repo root

## Environment variables for the contact form

Add these in Vercel > Project > Settings > Environment Variables:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=dhiraj.kumar@omnexagoc.com
CONTACT_FROM_EMAIL=OMNeXa Website <noreply@omnexagoc.com>
```

If you do not configure Resend, the website will still build, but the contact form email sending will show a configuration error.
