import type { Faq } from './faqs';

// Prices, plans and the comparison table are edited in the admin panel (Pricing) and loaded from the API.
// Only the pricing FAQs live here.

export const pricingFaqs: Faq[] = [
  {
    question: 'Are there any hidden fees?',
    answer: 'No. The price you see before you book or subscribe is what you pay. Optional fees, such as ending a ride outside a parking zone, are listed on this page.',
  },
  {
    question: 'Can I change or cancel my plan?',
    answer:
      'Ride passes are bought when you need them. Business plans can be upgraded at any time and cancelled with 30 days’ notice. Rent-to-own plans can be paid off early with no penalty.',
  },
  {
    question: 'What does “billed yearly” mean?',
    answer: 'You pay for 12 months upfront and get a lower monthly price, around 15% less than paying month by month.',
  },
  {
    question: 'What happens if I miss a rent-to-own payment?',
    answer: 'We’ll remind you first. After 14 days without payment the bike is locked remotely until your account is up to date. Talk to us early and we’ll help.',
  },
  {
    question: 'Do you offer student or non-profit discounts?',
    answer: 'Verified students get the Semester Pass and 10% off shared rides. Schools, universities and non-profits can ask our sales team about discounted Corporate plans.',
  },
];
