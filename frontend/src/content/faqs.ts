export type Faq = { question: string; answer: string };
export type FaqGroup = { id: string; title: string; faqs: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    faqs: [
      {
        question: 'Who can ride Yenko?',
        answer:
          'Anyone aged 16 or over with a Ghanaian phone number. Students who verify their university email get student pricing, including the Semester Pass. Riders aged 16 or 17 need a parent or guardian to accept our terms.',
      },
      {
        question: 'Do I need to be a student?',
        answer: 'No. Staff, visitors and local residents can ride with pay as you go or a Day Pass. Only the Semester Pass is limited to verified students.',
      },
      {
        question: 'How do I find a bike?',
        answer:
          'Open the Yenko app and check the map. Available bikes show as lime pins with their battery level. You can reserve a bike for free for up to 10 minutes while you walk to it.',
      },
      {
        question: 'Which campuses have Yenko?',
        answer:
          'Yenko is live at the University of Ghana (Legon), KNUST and the University of Cape Coast. Ashesi University and UPSA are coming next. See Campus locations for details.',
      },
    ],
  },
  {
    id: 'pricing-and-payments',
    title: 'Pricing & payments',
    faqs: [
      {
        question: 'How much does a ride cost?',
        answer:
          'Pay as you go costs GH₵ 2 to unlock plus GH₵ 0.50 per minute. The average ride is nine minutes, so most trips cost about GH₵ 6.50. A Day Pass is GH₵ 25 and a Semester Pass is GH₵ 250.',
      },
      {
        question: 'How can I pay?',
        answer: 'With MTN MoMo, Telecel Cash, AT Money, or a Visa or Mastercard debit card. You can pay per ride or top up your Yenko wallet.',
      },
      {
        question: 'Can I split the Semester Pass into payments?',
        answer: 'Yes. Choose Split payment to pay GH₵ 125 when you buy the pass and GH₵ 125 six weeks later, with no fees and no interest.',
      },
      {
        question: 'Why was I charged a GH₵ 10 fee?',
        answer:
          "The out-of-zone fee is added when a ride ends outside a parking zone without a good reason. If something stopped you reaching a zone, contact support within 48 hours and we'll review it.",
      },
    ],
  },
  {
    id: 'riding-and-parking',
    title: 'Riding & parking',
    faqs: [
      {
        question: 'How fast do the bikes go?',
        answer:
          'Pedal assist helps you up to 25 km/h. Around lecture halls, libraries and halls of residence, the app limits assistance to 12 km/h. These slow zones are shaded yellow on the map.',
      },
      {
        question: 'How far can I ride on one charge?',
        answer:
          'Up to 60 km. Our team swaps batteries before they drop below 25%, and the app shows every bike’s battery level before you unlock it.',
      },
      {
        question: 'Where can I park?',
        answer:
          'Every ride must end inside a parking zone, shown in blue with a P on the map. Park upright on the kickstand, close the lock and take a quick photo in the app.',
      },
      {
        question: 'Can I stop somewhere during a ride?',
        answer: 'Yes. Tap Pause in the app and close the lock. On pay as you go, paused time costs GH₵ 0.25 per minute and the bike stays reserved for you.',
      },
      {
        question: 'Can I ride in the rain?',
        answer:
          'Yes. The bikes are weather-sealed and their disc brakes work well in the wet. Leave extra stopping distance and avoid standing water. During storms we may pause rides for safety.',
      },
    ],
  },
  {
    id: 'safety-and-support',
    title: 'Safety & support',
    faqs: [
      {
        question: 'Do I have to wear a helmet?',
        answer: 'We strongly recommend it. Semester Pass holders can collect a free Yenko helmet from any campus hub by showing their student ID.',
      },
      {
        question: 'What should I do after an accident?',
        answer:
          'Get somewhere safe first. If anyone is hurt, call 112 or hold the emergency button in the app, which shares your location with campus security. Then report the incident in the app so we can help.',
      },
      {
        question: 'A bike is damaged or not working. What should I do?',
        answer:
          "Don't ride it. Tap Report an issue on the bike's card in the app and tell us what's wrong. If it happens during a ride, end the ride and we won't charge you for the time.",
      },
      {
        question: 'How do I contact support?',
        answer: 'Chat with us in the app (Help → Chat with us) at any time of day or night, or send a message using the contact form on this website.',
      },
    ],
  },
  {
    id: 'account-and-privacy',
    title: 'Account & privacy',
    faqs: [
      {
        question: 'How do I verify that I’m a student?',
        answer: 'In the app, go to Profile → Student verification and enter your university email. We’ll send you a six-digit code. It takes less than a minute.',
      },
      {
        question: 'Can I delete my account?',
        answer:
          'Yes. Go to Profile → Settings → Delete account, or contact support. We delete your personal data within 30 days, except records the law requires us to keep, such as payment records.',
      },
      {
        question: 'Do you track my location?',
        answer:
          'We only use your location while the app is open or a ride is in progress, to show nearby bikes and record your trip. Our privacy policy explains the details.',
      },
    ],
  },
];
