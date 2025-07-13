import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KnoLib - Enterprise Knowledge Sharing Platform',
    short_name: 'KnoLib',
    description: 'Your comprehensive knowledge library for continuous learning and professional growth.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/knolib-icon-16.svg',
        sizes: '16x16',
        type: 'image/svg+xml',
      },
      {
        src: '/knolib-icon.svg',
        sizes: '24x24',
        type: 'image/svg+xml',
      },
      {
        src: '/knolib-icon-32.svg',
        sizes: '32x32',
        type: 'image/svg+xml',
      },
      {
        src: '/knolib-icon-48.svg',
        sizes: '48x48',
        type: 'image/svg+xml',
      },
      {
        src: '/knolib-icon-48.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
      {
        src: '/knolib-icon-48.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
  }
}
