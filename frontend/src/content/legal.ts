// Placeholder legal text written for a campus e-bike service in Ghana.
// Have it reviewed by a qualified lawyer before launch.

export type LegalSection = { id: string; heading: string; paragraphs: string[]; list?: string[] };

export const legalUpdated = '1 September 2026';

export const termsSections: LegalSection[] = [
  {
    id: 'agreement',
    heading: 'About these terms',
    paragraphs: [
      'These Terms of Service ("Terms") are an agreement between you and Yenko Mobility Ltd. ("Yenko", "we", "us"), a company registered in Ghana. They apply whenever you use the Yenko app, website or any Yenko e-bike.',
      'By creating an account or starting a ride, you agree to these Terms, our Safety Guidelines and our Privacy Policy. If you do not agree, please do not use Yenko.',
    ],
  },
  {
    id: 'eligibility',
    heading: 'Eligibility and your account',
    paragraphs: [
      'You must be at least 16 years old to ride. If you are 16 or 17, a parent or guardian must accept these Terms on your behalf and is responsible for your use of Yenko.',
      'You are responsible for keeping your login details secure and for all activity on your account. Tell us straight away if you think someone else has used it.',
    ],
    list: [
      'One account per person, using accurate information.',
      'Student pricing requires a valid, verified university email address.',
      'You may not transfer or sell your account or passes.',
    ],
  },
  {
    id: 'rides',
    heading: 'Rides',
    paragraphs: [
      'A ride starts when a bike unlocks and ends when you close the lock inside a parking zone and the app confirms the ride has ended. You are responsible for the bike for the whole ride, including any paused time.',
      'You must follow the Safety Guidelines and all applicable laws while riding. We may limit speed in certain areas and may end a ride remotely if we believe it is unsafe.',
    ],
  },
  {
    id: 'payments',
    heading: 'Prices, passes and payments',
    paragraphs: [
      'Current prices are shown in the app and on our Pricing page. We will tell you in the app before any price change affects you.',
      'You authorise us to charge your chosen payment method for rides, passes and any fees you incur. Passes are personal, begin when purchased and cannot be refunded once used, except where the law requires.',
    ],
  },
  {
    id: 'fees',
    heading: 'Fees and damage',
    paragraphs: [
      'We may charge the fees listed on the Pricing page, including when a ride ends outside a parking zone. If a bike is damaged through misuse, or is lost or not returned, we may charge reasonable repair or replacement costs, up to the amount shown on the Pricing page.',
      'If you believe a charge is wrong, contact support within 30 days and we will review it.',
    ],
  },
  {
    id: 'conduct',
    heading: 'Acceptable use',
    paragraphs: ['You agree not to:'],
    list: [
      'Ride under the influence of alcohol or drugs, or carry passengers.',
      'Tamper with, damage or try to unlock a bike without the app.',
      'Use Yenko for commercial delivery or any unlawful purpose.',
      'Interfere with the app, our systems or other riders’ accounts.',
    ],
  },
  {
    id: 'liability',
    heading: 'Our responsibility to you',
    paragraphs: [
      'We maintain our bikes carefully and check them regularly, but cycling carries some risk. You ride at your own risk to the extent the law allows.',
      'Nothing in these Terms limits our liability for death or personal injury caused by our negligence, or any other liability that cannot be limited under Ghanaian law.',
    ],
  },
  {
    id: 'suspension',
    heading: 'Suspending or closing accounts',
    paragraphs: [
      'We may suspend or close an account if these Terms or the Safety Guidelines are seriously or repeatedly broken, or to protect riders and the public. You can close your account at any time from the app.',
    ],
  },
  {
    id: 'changes-and-law',
    heading: 'Changes and governing law',
    paragraphs: [
      'We may update these Terms. If a change is significant, we will notify you in the app at least 14 days before it takes effect.',
      'These Terms are governed by the laws of the Republic of Ghana, and the courts of Ghana have jurisdiction over any dispute.',
    ],
  },
  {
    id: 'contact',
    heading: 'Contact',
    paragraphs: ['Questions about these Terms? Reach us through the Contact page or the in-app chat.'],
  },
];

export const privacySections: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    paragraphs: [
      'Yenko Mobility Ltd. is the data controller for personal data collected through the Yenko app, website and e-bikes. We process personal data in line with Ghana’s Data Protection Act, 2012 (Act 843).',
    ],
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect',
    paragraphs: ['We collect only what we need to run the service safely:'],
    list: [
      'Account details: your name, phone number, email address and, if you verify, your university email.',
      'Ride data: start and end times, route, distance and the bike used.',
      'Location: your device’s location while the app is open or a ride is in progress.',
      'Payment details: transaction records. Card and mobile money details are handled by our payment providers.',
      'Support and safety records: messages to support, incident reports and end-of-ride photos.',
      'Website data: messages sent through our contact form and basic technical data such as browser type.',
    ],
  },
  {
    id: 'how-we-use-it',
    heading: 'How we use it',
    paragraphs: ['We use personal data to:'],
    list: [
      'Show nearby bikes, unlock them and record your rides.',
      'Charge for rides and passes and prevent fraud.',
      'Keep riders safe, investigate incidents and enforce our Safety Guidelines.',
      'Improve the service, for example by planning where to add parking zones.',
      'Reply to your messages and send important service updates.',
    ],
  },
  {
    id: 'legal-basis',
    heading: 'Our legal basis',
    paragraphs: [
      'We process your data to provide the service you signed up for, to meet our legal obligations, where we have a legitimate interest such as improving safety, and, for optional marketing and analytics cookies, with your consent.',
    ],
  },
  {
    id: 'sharing',
    heading: 'Who we share it with',
    paragraphs: ['We never sell your personal data. We share it only with:'],
    list: [
      'Payment providers, to process your payments.',
      'Cloud hosting and customer support providers who work for us under contract.',
      'Your university, only in aggregated form that does not identify you, unless a safety incident requires otherwise.',
      'Police or authorities, when the law requires it.',
    ],
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    paragraphs: [
      'We keep account data while your account is open. Detailed location and route data is kept for 12 months, then anonymised. Payment records are kept for as long as tax law requires. Contact form messages are deleted after 24 months.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    paragraphs: [
      'You can ask to access, correct or delete your personal data, object to certain processing, or withdraw consent at any time. To make a request, contact us through the Contact page. You may also complain to the Data Protection Commission of Ghana.',
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies',
    paragraphs: [
      'Our website uses essential cookies to work. With your permission, we also use analytics and marketing cookies. You can change your choice at any time using "Cookie preferences" at the bottom of every page.',
    ],
  },
  {
    id: 'security',
    heading: 'Security',
    paragraphs: [
      'We protect your data with encryption in transit, access controls and regular reviews. No system is perfectly secure, so we will tell you and the regulator promptly if a breach affects you.',
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    paragraphs: ['If we make significant changes, we will let you know in the app or by email before they take effect.'],
  },
];
