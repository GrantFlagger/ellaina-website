This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More
## Outlook inquiry emails

The contact, B2B, and restaurant inquiry forms send directly through Microsoft Graph to `OUTLOOK_EMAIL` (defaults to `info@ellainaoliveoil.com`). These forms do not store submissions in InsForge.

Configure these server-only environment variables in Netlify and locally for development:

- `MS_TENANT_ID`
- `MS_CLIENT_ID`
- `MS_CLIENT_SECRET`
- `OUTLOOK_EMAIL` (optional; defaults to `info@ellainaoliveoil.com`)

Register a single-tenant app in Microsoft Entra ID, grant Microsoft Graph **Application** permission `Mail.Send`, and grant admin consent. Keep the client secret only in Netlify environment settings or `.env.local`; never expose it with a `NEXT_PUBLIC_` variable. Restrict the app's mailbox access to this sender mailbox in Exchange Online. Redeploy after setting the Netlify variables.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
