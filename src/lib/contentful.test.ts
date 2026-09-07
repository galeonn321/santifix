import { describe, expect, it } from 'vitest';
import { normalizeServicePortfolio, type ContentfulResponse } from './contentful';

const linked = (id: string) => ({ sys: { id } });

describe('normalizeServicePortfolio', () => {
  it('connects categories, service types, projects and their two images', () => {
    const categories: ContentfulResponse = {
      items: [
        {
          sys: { id: 'repairs' },
          fields: { name: 'Repairs', slug: 'repairs', icon: 'wrench', order: 1 },
        },
      ],
    };
    const serviceTypes: ContentfulResponse = {
      items: [
        {
          sys: { id: 'cabinet-repair' },
          fields: {
            name: 'Cabinet repair',
            slug: 'cabinet-repair',
            category: linked('repairs'),
            order: 1,
          },
        },
      ],
    };
    const projects: ContentfulResponse = {
      items: [
        {
          sys: { id: 'project-1' },
          fields: {
            title: 'Kitchen cabinet',
            slug: 'kitchen-cabinet',
            serviceType: linked('cabinet-repair'),
            beforeImage: linked('before'),
            afterImage: linked('after'),
            featured: true,
            order: 1,
          },
        },
      ],
      includes: {
        Asset: [
          {
            sys: { id: 'before' },
            fields: {
              title: 'Before',
              file: { url: '//images.ctfassets.net/before.jpg' },
            },
          },
          {
            sys: { id: 'after' },
            fields: {
              title: 'After',
              file: {
                url: '//images.ctfassets.net/after.jpg',
                details: { image: { width: 1800, height: 1200 } },
              },
            },
          },
        ],
      },
    };

    const result = normalizeServicePortfolio(categories, serviceTypes, projects);

    expect(result.categories[0]?.slug).toBe('repairs');
    expect(result.serviceTypes[0]?.categoryId).toBe('repairs');
    expect(result.projects[0]).toMatchObject({
      title: 'Kitchen cabinet',
      serviceTypeId: 'cabinet-repair',
      featured: true,
      beforeImage: { url: 'https://images.ctfassets.net/before.jpg' },
      afterImage: { url: 'https://images.ctfassets.net/after.jpg', width: 1800, height: 1200 },
    });
  });

  it('omits projects that do not have a complete before-and-after pair', () => {
    const result = normalizeServicePortfolio({}, {}, {
      items: [
        {
          sys: { id: 'incomplete' },
          fields: { title: 'Incomplete', serviceType: linked('type') },
        },
      ],
    });

    expect(result.projects).toEqual([]);
  });
});
