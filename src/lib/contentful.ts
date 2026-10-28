export const PROJECT_CATEGORIES = ['repairs', 'installation', 'maintenance', 'assembly'] as const;
export type ProjectCategory = typeof PROJECT_CATEGORIES[number];

export interface PortfolioImage {
  url: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  projectName: string;
  category: ProjectCategory;
  description: string;
  beforeImage: PortfolioImage;
  afterImage: PortfolioImage;
  gallery: PortfolioImage[];
  location: string;
  featured: boolean;
  order: number;
}

export interface ContentfulEntry {
  sys: { id: string };
  fields: Record<string, unknown>;
}

export interface ContentfulResponse {
  total?: number;
  items?: ContentfulEntry[];
  includes?: { Asset?: ContentfulEntry[] };
}

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const linkedId = (value: unknown): string => {
  if (!value || typeof value !== 'object' || !('sys' in value)) return '';
  const sys = value.sys;
  return sys && typeof sys === 'object' && 'id' in sys ? text(sys.id) : '';
};

function imageFromAsset(asset: ContentfulEntry | undefined): PortfolioImage | null {
  const file = asset?.fields.file as {
    url?: string;
    contentType?: string;
    details?: { image?: { width?: number; height?: number } };
  } | undefined;
  if (!asset || !file?.url || (file.contentType && !file.contentType.startsWith('image/'))) return null;
  const url = file.url.startsWith('//') ? `https:${file.url}` : file.url;
  // Only serve images through the Contentful hosts configured in next.config.ts.
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !['images.ctfassets.net', 'images.eu.ctfassets.net'].includes(parsed.hostname)) return null;
  } catch { return null; }
  return {
    url,
    title: text(asset.fields.title),
    description: text(asset.fields.description),
    width: file.details?.image?.width ?? 1600,
    height: file.details?.image?.height ?? 1200,
  };
}

export function normalizeProjects(response: ContentfulResponse): Project[] {
  const assets = new Map((response.includes?.Asset ?? []).map(asset => [asset.sys.id, asset]));
  return (response.items ?? []).flatMap(({ sys, fields }) => {
    const beforeImage = imageFromAsset(assets.get(linkedId(fields.beforeImage)));
    const afterImage = imageFromAsset(assets.get(linkedId(fields.afterImage)));
    const projectName = text(fields.projectName);
    const description = text(fields.description);
    const category = text(fields.category);
    if (!projectName || !description || !PROJECT_CATEGORIES.includes(category as ProjectCategory) || !beforeImage || !afterImage) return [];
    return [{
      id: sys.id,
      projectName,
      category: category as ProjectCategory,
      description,
      beforeImage,
      afterImage,
      gallery: (Array.isArray(fields.gallery) ? fields.gallery : [])
        .map(link => imageFromAsset(assets.get(linkedId(link))))
        .filter((image): image is PortfolioImage => image !== null),
      location: text(fields.location),
      featured: fields.featured === true,
      order: typeof fields.order === 'number' && Number.isFinite(fields.order) ? fields.order : 0,
    }];
  }).sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
}

export async function getProjects(siteLocale: string): Promise<Project[]> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? 'master';
  if (!spaceId || !accessToken) return [];
  try {
    const combined: ContentfulResponse = { items: [], includes: { Asset: [] } };
    let skip = 0;
    let total = 0;
    do {
      const url = new URL(`https://cdn.contentful.com/spaces/${encodeURIComponent(spaceId)}/environments/${encodeURIComponent(environment)}/entries`);
      url.searchParams.set('content_type', 'projects');
      url.searchParams.set('locale', siteLocale === 'es' ? 'es-MX' : 'en-US');
      url.searchParams.set('include', '1');
      url.searchParams.set('limit', '1000');
      url.searchParams.set('skip', String(skip));
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: { revalidate: 86400, tags: ['contentful'] },
      });
      if (!response.ok) throw new Error(`Contentful project request failed with ${response.status}`);
      const page = await response.json() as ContentfulResponse;
      const entries = page.items ?? [];
      combined.items!.push(...entries);
      combined.includes!.Asset!.push(...(page.includes?.Asset ?? []));
      skip += entries.length;
      total = page.total ?? skip;
      if (!entries.length) break;
    } while (skip < total);
    return normalizeProjects(combined);
  } catch (error) {
    console.error('Unable to load Contentful projects.', error);
    return [];
  }
}
