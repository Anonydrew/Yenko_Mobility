import {
  BasketIcon,
  BatteryIcon,
  BikeIcon,
  BuildingIcon,
  ClockIcon,
  GraduationIcon,
  type Icon,
  LeafIcon,
  MapPinIcon,
  PhoneIcon,
  RouteIcon,
  ShieldIcon,
  SparkIcon,
  UsersIcon,
  WalletIcon,
} from '@/components/ui/icons';
import type { Faq } from './faqs';
import { media, type MediaImage } from './media';

// Placeholder copy and prices for each Yenko service. Replace with real details before launch.

export type Service = {
  slug: string;
  name: string;
  navLabel: string;
  navDescription: string;
  tagline: string;
  summary: string;
  heroTitle: string;
  heroIntro: string;
  priceFrom: string;
  image: MediaImage;
  icon: Icon;
  pricingTab: string;
  primaryCta: { label: string; to: string };
  features: { icon: Icon; title: string; text: string }[];
  steps: { title: string; text: string }[];
  checklist?: { eyebrow: string; title: string; text: string; items: string[]; image: MediaImage };
  faqs: Faq[];
};

export const services: Service[] = [
  {
    slug: 'shared-rides',
    name: 'Yenko Shared Rides',
    navLabel: 'Shared rides',
    navDescription: 'Split the cost of a city ride with people going your way.',
    tagline: 'Share the ride, split the cost',
    summary: 'Affordable shared electric rides across the city, with people heading your way.',
    heroTitle: 'Go further for less with shared rides.',
    heroIntro:
      'Book a seat on a shared electric ride going your way. You only pay for your seat, pick-ups are close by, and every trip is tracked from start to finish.',
    priceFrom: 'From GH₵ 8 per seat',
    image: media.hero,
    icon: UsersIcon,
    pricingTab: 'rides',
    primaryCta: { label: 'Download the app', to: '/download' },
    features: [
      { icon: RouteIcon, title: 'Smart matching', text: 'We match you with riders heading the same way, so detours stay short.' },
      { icon: WalletIcon, title: 'Pay per seat', text: 'A fixed price before you book, with no surge pricing at rush hour.' },
      { icon: ShieldIcon, title: 'Verified drivers', text: 'Every driver is background-checked and trained. Share your trip live with family.' },
      { icon: LeafIcon, title: 'Fully electric', text: 'Quiet, zero-emission vehicles that keep the city air cleaner.' },
    ],
    steps: [
      { title: 'Set your destination', text: 'Tell the app where you’re going and when you want to leave.' },
      { title: 'Book a seat', text: 'See your price and pick-up point, then confirm with MoMo or card.' },
      { title: 'Meet your ride', text: 'Follow your vehicle on the map and hop in at the pick-up point.' },
      { title: 'Arrive and rate', text: 'Get dropped close to your destination and rate your trip.' },
    ],
    faqs: [
      { question: 'How is shared ride pricing worked out?', answer: 'Prices are based on distance and are fixed before you book. You pay for your seat only, even if the vehicle is full.' },
      { question: 'Can I book for a friend?', answer: 'Yes. You can book up to three seats in one booking and share the trip details with the people riding with you.' },
      { question: 'Where are shared rides available?', answer: 'Shared rides run in Accra and Kumasi, with more cities coming. The app shows the areas we cover.' },
    ],
  },
  {
    slug: 'delivery',
    name: 'Yenko Delivery',
    navLabel: 'Yenko Delivery',
    navDescription: 'Same-day parcel and food delivery by electric bike.',
    tagline: 'Delivered by e-bike, on time',
    summary: 'Same-day parcel and food delivery by electric bike, across campus and the city.',
    heroTitle: 'Send anything across town, the clean way.',
    heroIntro:
      'From documents to dinner, Yenko riders deliver on electric bikes that beat the traffic. Book a one-off delivery in the app, or set up a business account for regular orders.',
    priceFrom: 'From GH₵ 10 per delivery',
    image: media.fleet,
    icon: BasketIcon,
    pricingTab: 'delivery',
    primaryCta: { label: 'Send a parcel', to: '/download' },
    features: [
      { icon: ClockIcon, title: 'Same-day delivery', text: 'Most deliveries within the city arrive in under two hours.' },
      { icon: MapPinIcon, title: 'Live tracking', text: 'Follow your rider on the map and share the link with your customer.' },
      { icon: BasketIcon, title: 'Up to 15 kg', text: 'Insulated boxes for food and secure bags for parcels and documents.' },
      { icon: BuildingIcon, title: 'Business accounts', text: 'Scheduled pick-ups, bulk orders and one monthly invoice.' },
    ],
    steps: [
      { title: 'Enter the addresses', text: 'Add the pick-up and drop-off points and what you’re sending.' },
      { title: 'Get an instant price', text: 'See the price and delivery time before you confirm.' },
      { title: 'A rider collects it', text: 'The nearest Yenko rider picks up your parcel within minutes.' },
      { title: 'Track it to the door', text: 'Get a photo and a notification the moment it’s delivered.' },
    ],
    faqs: [
      { question: 'What can I send?', answer: 'Documents, parcels, food and groceries up to 15 kg. We don’t carry cash, alcohol, medicines that need a prescription, or anything illegal.' },
      { question: 'Can my customers pay cash on delivery?', answer: 'Yes, on Business Growth and Enterprise plans. The rider collects payment and we transfer it to you the next working day.' },
      { question: 'Do you deliver outside the city?', answer: 'Not yet. Deliveries currently run within Accra, Kumasi and Cape Coast, including their university campuses.' },
    ],
  },
  {
    slug: 'rent-to-own',
    name: 'Yenko Rent to Own',
    navLabel: 'Rent to own',
    navDescription: 'Own your e-bike with small weekly or monthly payments.',
    tagline: 'Ride it today, own it tomorrow',
    summary: 'Get your own e-bike with small weekly or monthly payments, with servicing included.',
    heroTitle: 'Own an e-bike without paying upfront.',
    heroIntro:
      'Built for delivery riders, commuters and small businesses. Pay a deposit, ride from day one, and the bike is yours when your plan ends. Servicing and insurance are included along the way.',
    priceFrom: 'From GH₵ 150 per week',
    image: media.workshop,
    icon: WalletIcon,
    pricingTab: 'rent-to-own',
    primaryCta: { label: 'Apply now', to: '/contact?topic=general' },
    features: [
      { icon: WalletIcon, title: 'Small, regular payments', text: 'Pay weekly or monthly with MoMo. No bank loan needed.' },
      { icon: ShieldIcon, title: 'Insurance included', text: 'Cover against theft and accidental damage for the whole plan.' },
      { icon: SparkIcon, title: 'Free servicing', text: 'Regular check-ups and repairs at any Yenko hub.' },
      { icon: BatteryIcon, title: 'Battery swaps', text: 'Swap to a fully charged battery at Yenko hubs when you’re running low.' },
    ],
    steps: [
      { title: 'Apply online', text: 'Tell us about yourself and choose your bike and payment plan.' },
      { title: 'Get approved', text: 'We check your Ghana Card and guarantor, usually within two working days.' },
      { title: 'Collect your e-bike', text: 'Pay your deposit, get a safety briefing and ride away.' },
      { title: 'Make it yours', text: 'Keep up your payments and the bike is yours at the end of the plan.' },
    ],
    checklist: {
      eyebrow: 'Who can apply',
      title: 'What you’ll need.',
      text: 'We keep requirements simple so that more people can own a clean, reliable vehicle.',
      items: ['A valid Ghana Card', 'Aged 18 or over', 'A guarantor with a steady income', 'Proof of address in an area we serve'],
      image: media.eBike,
    },
    faqs: [
      { question: 'Can I pay off my bike early?', answer: 'Yes. You can pay the remaining balance at any time with no penalty, and the bike becomes yours straight away.' },
      { question: 'What if I miss a payment?', answer: 'We’ll remind you first. After 14 days without payment the bike is locked remotely until your account is up to date. Talk to us early if you’re struggling.' },
      { question: 'Can I earn with my bike?', answer: 'Yes. Cargo plan riders can apply to deliver with Yenko Delivery and pay off their bike faster.' },
    ],
  },
  {
    slug: 'corporate',
    name: 'Yenko Corporate',
    navLabel: 'Yenko Corporate',
    navDescription: 'Staff rides, shuttles and deliveries on one company account.',
    tagline: 'Mobility for your whole team',
    summary: 'Staff rides, shuttles and deliveries on one company account with monthly invoicing.',
    heroTitle: 'Move your people and parcels on one account.',
    heroIntro:
      'Give your team reliable, clean transport for commutes, meetings and deliveries. Set budgets, schedule staff shuttles and get one clear invoice every month.',
    priceFrom: 'From GH₵ 2,500 per month',
    image: media.riders,
    icon: BuildingIcon,
    pricingTab: 'business',
    primaryCta: { label: 'Talk to sales', to: '/contact?topic=partnerships' },
    features: [
      { icon: UsersIcon, title: 'Team accounts', text: 'Add staff in minutes and set monthly budgets by person or department.' },
      { icon: RouteIcon, title: 'Staff shuttles', text: 'Scheduled shared rides that match your shift patterns.' },
      { icon: BuildingIcon, title: 'One monthly invoice', text: 'Every ride and delivery on a single invoice, ready for your finance team.' },
      { icon: LeafIcon, title: 'Sustainability reports', text: 'See the CO₂ your company avoided, ready for ESG reporting.' },
    ],
    steps: [
      { title: 'Talk to our team', text: 'Tell us how your staff travel and what you need delivered.' },
      { title: 'Get your plan', text: 'We recommend a plan, budgets and shuttle routes that fit.' },
      { title: 'Invite your staff', text: 'Employees join with their work email and ride on the company account.' },
      { title: 'Track and save', text: 'Follow usage in your dashboard and get one invoice each month.' },
    ],
    faqs: [
      { question: 'Can staff use Yenko for personal trips?', answer: 'You decide. Set rules for when and where the company account can be used, and staff can add a personal payment method for everything else.' },
      { question: 'Is there a minimum contract?', answer: 'Monthly plans can be cancelled with 30 days’ notice. Yearly plans cost about 15% less.' },
      { question: 'Do you work with schools and NGOs?', answer: 'Yes. Talk to our sales team about discounted plans for schools, universities and non-profits.' },
    ],
  },
  {
    slug: 'business',
    name: 'Yenko for Business',
    navLabel: 'Yenko for Business',
    navDescription: 'Franchise with Yenko and run it in your city or campus.',
    tagline: 'Bring Yenko to your city',
    summary: 'Franchise with Yenko: run a local e-mobility business with our brand, app, fleet and training.',
    heroTitle: 'Build a mobility business with Yenko.',
    heroIntro:
      'Yenko for Business lets entrepreneurs and investors run Yenko in their own city, campus or region. You bring local knowledge and a team. We bring the brand, the technology, fleet financing and everything we’ve learned.',
    priceFrom: 'Packages to suit your market',
    image: media.students,
    icon: SparkIcon,
    pricingTab: 'business',
    primaryCta: { label: 'Enquire about franchising', to: '/contact?topic=partnerships' },
    features: [
      { icon: PhoneIcon, title: 'Our app and platform', text: 'Bookings, payments and a fleet dashboard, ready from day one.' },
      { icon: BikeIcon, title: 'Fleet and financing', text: 'E-bikes, batteries and introductions to our financing partners.' },
      { icon: GraduationIcon, title: 'Training and playbooks', text: 'Operations, safety and customer service training for your team.' },
      { icon: SparkIcon, title: 'Brand and marketing', text: 'The Yenko brand plus national campaigns that bring riders to you.' },
    ],
    steps: [
      { title: 'Send an enquiry', text: 'Tell us about you, your team and the market you want to serve.' },
      { title: 'Discovery and assessment', text: 'We meet, visit your area and model the business together.' },
      { title: 'Set up your hub', text: 'Sign your agreement, prepare your hub and receive your fleet.' },
      { title: 'Launch together', text: 'Our team joins you on the ground for launch and your first months.' },
    ],
    checklist: {
      eyebrow: 'What we look for',
      title: 'Is Yenko for Business right for you?',
      text: 'We partner with people who share our standards for safety, service and sustainability.',
      items: [
        'A local team with operations or transport experience',
        'Access to a secure space for charging and repairs',
        'Investment capacity for your first fleet',
        'Commitment to Yenko’s safety and service standards',
      ],
      image: media.workshop,
    },
    faqs: [
      { question: 'How much does a franchise cost?', answer: 'It depends on your market size and fleet. After a discovery call we share a detailed investment plan with expected costs and returns.' },
      { question: 'Do I need transport experience?', answer: 'It helps, but it isn’t required. We look for strong local operators and provide full training.' },
      { question: 'Which areas are available?', answer: 'We’re looking for partners in regional capitals and university towns across Ghana and West Africa.' },
    ],
  },
];

/** Every service as a card, including the original campus e-bike rides. */
export const serviceCards = [
  {
    key: 'campus-rides',
    name: 'Campus e-bikes',
    summary: 'Provides shared electric e-bicycles universities and communities.',
    to: '/products/e-bikes',
    image: media.eBike,
    priceFrom: '',
    icon: BikeIcon,
  },
  ...services.map((service) => ({
    key: service.slug,
    name: service.name,
    summary: service.summary,
    to: `/services/${service.slug}`,
    image: service.image,
    priceFrom: service.priceFrom,
    icon: service.icon,
  })),
];
