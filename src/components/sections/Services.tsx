import { getLocale, getTranslations } from 'next-intl/server';
import ServicesExplorer from './ServicesExplorer';
import { getServicePortfolio, type ServiceCategory } from '@/lib/contentful';

const FALLBACK_ICONS: Record<string, string> = {
  repairs: 'wrench',
  installation: 'plug',
  maintenance: 'settings',
  assembly: 'package',
};

export default async function Services() {
  const locale = await getLocale();
  const [portfolio, t] = await Promise.all([
    getServicePortfolio(locale === 'es' ? 'es-MX' : 'en-US'),
    getTranslations('services'),
  ]);

  const fallbackItems = t.raw('items') as {
    key: string;
    title: string;
    description: string;
  }[];

  const fallbackCategories: ServiceCategory[] = fallbackItems.map((item, index) => ({
    id: `fallback-${item.key}`,
    name: item.title,
    slug: item.key,
    description: item.description,
    icon: FALLBACK_ICONS[item.key] ?? 'wrench',
    order: index + 1,
  }));

  return (
    <ServicesExplorer
      categories={portfolio.categories.length > 0 ? portfolio.categories : fallbackCategories}
      serviceTypes={portfolio.serviceTypes}
      projects={portfolio.projects}
    />
  );
}
