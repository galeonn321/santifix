# Santi Handyman

Bilingual marketing and service-request site for Santi Handyman, an Austin handyman business.

## Getting Started

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000/es](http://localhost:3000/es) or [http://localhost:3000/en](http://localhost:3000/en).

## Checks

```bash
pnpm typecheck
pnpm build
```

The project uses TypeScript 7. Next 16 does not yet recognize TypeScript 7's new package entry point, so the build uses the official `@typescript/native-preview` compatibility path and type checking runs separately through `pnpm typecheck`.

## Contact form

Create `.env.local` with:

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_EMAIL=
NEXT_PUBLIC_SITE_URL=https://santihandyman.com
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_WEBHOOK_SECRET=
```

## Contentful portfolio

The services portfolio reads published `serviceCategory`, `serviceType`, and
`project` entries from Contentful. Configure the production webhook as a
`POST` request to `/api/contentful/revalidate` and send the shared secret in
the `x-contentful-webhook-secret` header. Subscribe only to Entry and Asset
publish, unpublish, and delete events in the `master` environment.
