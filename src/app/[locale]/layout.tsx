import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import IntroAnimation from '@/components/IntroAnimation';
import '../globals.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const spanish = locale === 'es';
  const title = spanish ? 'Santi Handyman | Handyman en Austin' : 'Santi Handyman | Austin Handyman';
  const description = spanish
    ? 'Servicios profesionales de handyman en Austin, TX: reparaciones, instalaciones, mantenimiento y ensamblaje.'
    : 'Professional handyman services in Austin, TX: repairs, installation, maintenance and assembly.';

  return {
    title,
    applicationName: 'Santi Handyman',
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://santihandyman.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', es: '/es' },
    },
    openGraph: {
      title,
      description,
      locale: spanish ? 'es_US' : 'en_US',
      type: 'website',
      siteName: 'Santi Handyman',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className="bg-cream antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <IntroAnimation />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
