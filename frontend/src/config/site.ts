/**
 * Site-wide settings. To use your own logo, replace public/brand/logo.svg (or point `logo.src` at a new file).
 * If your logo file already includes the company name, set `showWordmark` to false.
 */
export const site = {
  name: 'Yenko Mobility',
  shortName: 'Yenko',
  description: "Yenko is Ghana's electric mobility app: campus e-bikes, shared rides, delivery, rent-to-own e-bikes, corporate mobility and franchising.",
  logo: {
    src: '/brand/logo.svg',
    alt: 'Yenko Mobility',
    showWordmark: false,
  },
  location: 'Accra, Ghana',
};

function normalisePath(path: string): string {
  const trimmed = path.trim().replace(/\/+$/, '');
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/** Where the admin panel lives, e.g. https://yenkomobility.com/login-yenkoadmin. Set VITE_ADMIN_PATH in .env to change it. */
export const ADMIN_PATH = normalisePath(import.meta.env.VITE_ADMIN_PATH || '/login-yenkoadmin');
