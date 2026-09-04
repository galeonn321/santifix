import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      { protocol: 'https', hostname: 'images.eu.ctfassets.net' },
    ],
  },
  // TypeScript 7 is checked explicitly via `pnpm typecheck`. Next 16's
  // package detection does not recognize TS 7 yet, despite tsc working.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
