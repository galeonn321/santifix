import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import IntroAnimation from '@/components/IntroAnimation';
import { siteName, siteUrl } from '@/lib/site';
import { aeonik, aeonikCapitalised } from '../fonts';
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
    applicationName: siteName,
    description,
    metadataBase: new URL(siteUrl),
    keywords: spanish
      ? ['handyman Austin', 'reparaciones del hogar Austin', 'mantenimiento Austin']
      : ['Austin handyman', 'home repairs Austin', 'handyman services Austin TX'],
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', es: '/es' },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      locale: spanish ? 'es_US' : 'en_US',
      alternateLocale: spanish ? ['en_US'] : ['es_US'],
      type: 'website',
      siteName,
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'Santi Handyman — Professional home services in Austin, TX',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image.png'],
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
  const spanish = locale === 'es';
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: siteName,
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/logo.svg`,
    image: `${siteUrl}/opengraph-image.png`,
    description: spanish
      ? 'Servicios profesionales de handyman en Austin, Texas.'
      : 'Professional handyman services in Austin, Texas.',
    areaServed: {
      '@type': 'City',
      name: 'Austin',
      containedInPlace: { '@type': 'State', name: 'Texas' },
    },
    serviceType: ['Repairs', 'Installation', 'Maintenance', 'Assembly'],
  };

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className={`${aeonik.variable} ${aeonikCapitalised.variable} bg-cream antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusiness).replace(/</g, '\\u003c'),
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <IntroAnimation />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
