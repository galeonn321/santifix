const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.santihandy.com';

export const siteUrl = configuredUrl
  .replace(/^https:\/\/santihandy\.com(?=\/|$)/, 'https://www.santihandy.com')
  .replace(/\/$/, '');

export const siteName = 'Santi Handyman';
