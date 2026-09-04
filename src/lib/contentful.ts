export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export interface ServiceType {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  order: number;
}

export interface PortfolioImage {
  url: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  serviceTypeId: string;
  beforeImage: PortfolioImage;
  afterImage: PortfolioImage;
  location: string;
  completedAt: string;
  featured: boolean;
  order: number;
}

export interface ServicePortfolio {
  categories: ServiceCategory[];
  serviceTypes: ServiceType[];
  projects: Project[];
}

interface ContentfulLink {
  sys?: { id?: string };
}

interface ContentfulEntry {
  sys: { id: string };
  fields: Record<string, unknown>;
}

interface ContentfulAsset extends ContentfulEntry {}

interface ContentfulResponse {
  items?: ContentfulEntry[];
  includes?: { Asset?: ContentfulAsset[] };
}

const emptyPortfolio: ServicePortfolio = {
  categories: [],
  serviceTypes: [],
  projects: [],
};

const text = (value: unknown) => (typeof value === 'string' ? value : '');
const number = (value: unknown) => (typeof value === 'number' ? value : 0);
const boolean = (value: unknown) => (typeof value === 'boolean' ? value : false);
const linkedId = (value: unknown) => (value as ContentfulLink | undefined)?.sys?.id ?? '';

const imageFromAsset = (asset: ContentfulAsset | undefined): PortfolioImage | null => {
  if (!asset) return null;

  const file = asset.fields.file as {
    url?: string;
    details?: { image?: { width?: number; height?: number } };
  } | undefined;
  const rawUrl = file?.url;

  if (!rawUrl) return null;

  return {
    url: rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl,
    title: text(asset.fields.title),
    description: text(asset.fields.description),
    width: file.details?.image?.width ?? 1600,
    height: file.details?.image?.height ?? 1200,
  };
};

async function fetchContentType(
  contentType: 'serviceCategory' | 'serviceType' | 'project',
  locale: string,
): Promise<ContentfulResponse> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master';

  if (!spaceId || !accessToken) return {};

  const url = new URL(
    `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries`,
  );
  url.searchParams.set('content_type', contentType);
  url.searchParams.set('locale', locale);
  url.searchParams.set('include', '2');
  url.searchParams.set('limit', '1000');

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 86400, tags: ['contentful'] },
  });

  if (!response.ok) {
    throw new Error(`Contentful ${contentType} request failed with ${response.status}`);
  }

  return response.json() as Promise<ContentfulResponse>;
}

export async function getServicePortfolio(siteLocale: string): Promise<ServicePortfolio> {
  const contentfulLocale = siteLocale === 'es' ? 'es-MX' : 'en-US';

  try {
    const [categoryResponse, typeResponse, projectResponse] = await Promise.all([
      fetchContentType('serviceCategory', contentfulLocale),
      fetchContentType('serviceType', contentfulLocale),
      fetchContentType('project', contentfulLocale),
    ]);

    const categories = (categoryResponse.items ?? [])
      .map(({ sys, fields }) => ({
        id: sys.id,
        name: text(fields.name),
        slug: text(fields.slug),
        description: text(fields.description),
        icon: text(fields.icon),
        order: number(fields.order),
      }))
      .filter(category => category.name && category.slug)
      .sort((a, b) => a.order - b.order);

    const serviceTypes = (typeResponse.items ?? [])
      .map(({ sys, fields }) => ({
        id: sys.id,
        name: text(fields.name),
        slug: text(fields.slug),
        description: text(fields.description),
        categoryId: linkedId(fields.category),
        order: number(fields.order),
      }))
      .filter(serviceType => serviceType.name && serviceType.slug && serviceType.categoryId)
      .sort((a, b) => a.order - b.order);

    const assets = new Map(
      (projectResponse.includes?.Asset ?? []).map(asset => [asset.sys.id, asset]),
    );

    const projects = (projectResponse.items ?? [])
      .map(({ sys, fields }) => {
        const beforeImage = imageFromAsset(assets.get(linkedId(fields.beforeImage)));
        const afterImage = imageFromAsset(assets.get(linkedId(fields.afterImage)));

        if (!beforeImage || !afterImage) return null;

        return {
          id: sys.id,
          title: text(fields.title),
          slug: text(fields.slug),
          summary: text(fields.summary),
          serviceTypeId: linkedId(fields.serviceType),
          beforeImage,
          afterImage,
          location: text(fields.location),
          completedAt: text(fields.completedAt),
          featured: boolean(fields.featured),
          order: number(fields.order),
        } satisfies Project;
      })
      .filter((project): project is Project => Boolean(project?.title && project.serviceTypeId))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);

    return { categories, serviceTypes, projects };
  } catch (error) {
    console.error('Unable to load the Contentful service portfolio.', error);
    return emptyPortfolio;
  }
}
