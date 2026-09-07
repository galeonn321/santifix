import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Santi Handyman',
    short_name: 'Santi Handyman',
    description: 'Professional handyman services in Austin, Texas.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#001A3B',
    theme_color: '#075DE8',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
