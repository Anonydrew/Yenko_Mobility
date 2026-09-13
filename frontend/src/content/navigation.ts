// The single source for every link in the header, mobile menu and footer.
// Each `to` must have a route in App.tsx.
import { services } from './services';

export type NavLink = {
  label: string;
  to: string;
  description: string;
};

export type NavGroup = {
  id: string;
  label: string;
  summary: string;
  links: NavLink[];
};

export const navGroups: NavGroup[] = [
  {
    id: 'products',
    label: 'Products',
    summary: 'Every way to move with Yenko, in one app.',
    links: [
      { label: 'E-bike features', to: '/products/e-bikes', description: 'Campus e-bikes with pedal assist and swappable batteries.' },
      ...services.map((service) => ({ label: service.navLabel, to: `/services/${service.slug}`, description: service.navDescription })),
      { label: 'Pricing', to: '/pricing', description: 'Plans for rides, delivery, rent-to-own and business.' },
      { label: 'Campus locations', to: '/locations', description: 'Find Yenko at your university.' },
      { label: 'Download app', to: '/download', description: 'Book, ride and pay from your phone.' },
    ],
  },
  {
    id: 'how-it-works',
    label: 'How it works',
    summary: 'From your first download to parking like a pro.',
    links: [
      { label: 'Step-by-step guide', to: '/how-it-works', description: 'Find, unlock, ride and park in four simple steps.' },
      { label: 'Safety tips', to: '/safety', description: 'Small habits that make every ride safer.' },
      { label: 'FAQs', to: '/faq', description: 'Quick answers to the questions riders ask most.' },
      { label: 'How to join', to: '/join', description: 'Sign up and verify your account.' },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    summary: "We're building clean, affordable transport for Ghana and beyond.",
    links: [
      { label: 'About Yenko', to: '/about', description: 'Our story and the team behind the bikes.' },
      { label: 'Our mission', to: '/mission', description: 'Why everyone deserves an easy ride.' },
      { label: 'Sustainability impact', to: '/sustainability', description: 'The CO₂ we avoid and how we measure it.' },
      { label: 'Careers', to: '/careers', description: 'Join us on campus or at our Accra HQ.' },
      { label: 'Partnerships', to: '/partnerships', description: 'For universities, businesses and ambassadors.' },
    ],
  },
  {
    id: 'support',
    label: 'Help & Support',
    summary: 'Answers, policies and a real person when you need one.',
    links: [
      { label: 'Support center', to: '/support', description: 'Help with rides, payments and your account.' },
      { label: 'Terms of service', to: '/terms', description: 'The rules for using Yenko.' },
      { label: 'Privacy policy', to: '/privacy', description: 'How we collect and protect your data.' },
      { label: 'Safety guidelines', to: '/safety-guidelines', description: 'Our formal rider rules and policies.' },
      { label: 'Contact us', to: '/contact', description: 'Talk to our team.' },
      { label: 'Brand guidelines', to: '/brand', description: 'Logos, colours and how to use them.' },
    ],
  },
];

/** Top-level links shown after the dropdown groups. */
export const primaryLinks: NavLink[] = [
  { label: 'Pricing', to: '/pricing', description: 'Plans for every way you move.' },
  { label: 'Blog', to: '/blog', description: 'News, safety advice and stories.' },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  ...navGroups.map((group) => ({ title: group.label, links: group.links })),
  {
    title: 'Resources',
    links: [
      { label: 'Blog', to: '/blog', description: '' },
      { label: 'Get the app', to: '/download', description: '' },
      { label: 'Become a partner', to: '/partnerships', description: '' },
      { label: 'Photo credits', to: '/credits', description: '' },
      { label: 'Sitemap', to: '/sitemap', description: '' },
    ],
  },
];

export function findNavLink(pathname: string): { group: NavGroup; link: NavLink } | null {
  for (const group of navGroups) {
    const link = group.links.find((item) => item.to === pathname);
    if (link) return { group, link };
  }
  return null;
}
