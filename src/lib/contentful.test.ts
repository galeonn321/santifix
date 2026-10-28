import { afterEach, describe, expect, it, vi } from 'vitest';
import { getProjects, normalizeProjects, type ContentfulEntry, type ContentfulResponse } from './contentful';

const linked = (id: string) => ({ sys: { id } });
const asset = (id: string): ContentfulEntry => ({ sys: { id }, fields: { title: id, file: { url: `//images.ctfassets.net/${id}.jpg`, contentType: 'image/jpeg', details: { image: { width: 1800, height: 1200 } } } } });
const entry = (id: string, fields: Record<string, unknown> = {}): ContentfulEntry => ({
  sys: { id }, fields: { projectName: 'Wall repair', description: 'Patched and painted a damaged wall.', category: 'repairs', beforeImage: linked('before'), afterImage: linked('after'), ...fields },
});
const response = (items: ContentfulEntry[]): ContentfulResponse => ({ items, includes: { Asset: [asset('before'), asset('after'), asset('extra')] } });

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('normalizeProjects', () => {
  it('loads a single project model with direct category and ordered optional gallery', () => {
    const [project] = normalizeProjects(response([entry('one', { gallery: [linked('extra'), linked('missing'), linked('before')], location: 'South Austin' })]));
    expect(project).toMatchObject({ id: 'one', projectName: 'Wall repair', category: 'repairs', location: 'South Austin', featured: false, order: 0, afterImage: { url: 'https://images.ctfassets.net/after.jpg', width: 1800, height: 1200 } });
    expect(project.gallery.map(image => image.title)).toEqual(['extra', 'before']);
  });
  it('omits invalid categories and projects missing required content or published images', () => {
    expect(normalizeProjects(response([
      entry('category', { category: 'other' }), entry('name', { projectName: '' }),
      entry('description', { description: '' }), entry('image', { beforeImage: linked('unpublished') }),
    ]))).toEqual([]);
  });
  it('sorts featured projects first and respects order within each group', () => {
    const result = normalizeProjects(response([entry('regular', { order: 0 }), entry('featured-last', { featured: true, order: 5 }), entry('featured-first', { featured: true, order: 1 })]));
    expect(result.map(project => project.id)).toEqual(['featured-first', 'featured-last', 'regular']);
  });
  it('does not render unsupported media or external image hosts', () => {
    const data = response([entry('one')]);
    data.includes!.Asset![0].fields.file = { url: 'https://example.com/image.jpg', contentType: 'image/jpeg' };
    expect(normalizeProjects(data)).toEqual([]);
    data.includes!.Asset![0].fields.file = { url: '//images.ctfassets.net/file.pdf', contentType: 'application/pdf' };
    expect(normalizeProjects(data)).toEqual([]);
  });
});

describe('getProjects', () => {
  it('keeps the gallery empty when Contentful is not configured', async () => {
    vi.stubEnv('CONTENTFUL_SPACE_ID', '');
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    expect(await getProjects('en')).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('requests only project entries, selects the Spanish locale, and combines pages', async () => {
    vi.stubEnv('CONTENTFUL_SPACE_ID', 'space'); vi.stubEnv('CONTENTFUL_ACCESS_TOKEN', 'test-token');
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ...response([entry('one')]), total: 2 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ...response([entry('two', { category: 'assembly' })]), total: 2 }) });
    vi.stubGlobal('fetch', fetchMock);
    expect((await getProjects('es')).map(project => project.id)).toEqual(['one', 'two']);
    const firstUrl = fetchMock.mock.calls[0][0] as URL;
    expect(firstUrl.searchParams.get('content_type')).toBe('projects');
    expect(firstUrl.searchParams.get('locale')).toBe('es-MX');
    expect((fetchMock.mock.calls[1][0] as URL).searchParams.get('skip')).toBe('1');
  });
  it('handles Contentful errors without breaking the rest of the page', async () => {
    vi.stubEnv('CONTENTFUL_SPACE_ID', 'space'); vi.stubEnv('CONTENTFUL_ACCESS_TOKEN', 'test-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await getProjects('en')).toEqual([]);
  });
});
