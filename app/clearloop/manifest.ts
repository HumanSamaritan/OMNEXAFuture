import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OMNeXa ClearLoop',
    short_name: 'ClearLoop',
    description: 'A private, local-first companion for understanding vaping, managing cravings and recognising progress.',
    start_url: '/clearloop',
    scope: '/clearloop',
    display: 'standalone',
    background_color: '#fbfdfc',
    theme_color: '#176b52',
    icons: [
      {
        src: '/clearloop-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ]
  };
}
