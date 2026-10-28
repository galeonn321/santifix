import { getLocale } from 'next-intl/server';
import ServicesExplorer from './ServicesExplorer';
import { getProjects } from '@/lib/contentful';

export default async function Services() {
  const locale = await getLocale();
  return <ServicesExplorer projects={await getProjects(locale)} />;
}
