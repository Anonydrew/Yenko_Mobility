export type Campus = {
  slug: string;
  name: string;
  shortName: string;
  city: string;
  region: string;
  status: 'live' | 'coming-soon';
  since: string;
  bikes?: number;
  zones?: number;
  hours: string;
  hub?: string;
  summary: string;
  highlights: string[];
  tips: string[];
};

export const campuses: Campus[] = [
  {
    slug: 'university-of-ghana',
    name: 'University of Ghana',
    shortName: 'Legon',
    city: 'Accra',
    region: 'Greater Accra',
    status: 'live',
    since: 'Live since September 2025',
    bikes: 180,
    zones: 60,
    hours: 'Rides from 5:30 am to 11 pm, every day',
    hub: 'Yenko Hub Legon, near the Okponglo junction',
    summary: 'Our first campus and still our busiest. From the main gate to the Night Market, a bike is never more than a few minutes away.',
    highlights: [
      'Main gate and Okponglo junction',
      'Balme Library',
      'Night Market and Bush Canteen',
      'University of Ghana Business School',
      'Commonwealth, Legon and Volta Halls',
      'Sports Stadium',
    ],
    tips: [
      'The climb up to Legon Hall is much easier with pedal assist. Start pedalling before you reach the slope.',
      'Parking outside the Night Market fills up in the evening. The zone by the Bush Canteen usually has space.',
    ],
  },
  {
    slug: 'knust',
    name: 'Kwame Nkrumah University of Science and Technology',
    shortName: 'KNUST',
    city: 'Kumasi',
    region: 'Ashanti',
    status: 'live',
    since: 'Live since August 2026',
    bikes: 150,
    zones: 24,
    hours: 'Rides from 5:30 am to 11 pm, every day',
    hub: 'Yenko Hub KNUST, Commercial Area',
    summary: 'Our largest campus by area, where a 25-minute walk to lectures becomes a seven-minute ride.',
    highlights: [
      'Commercial Area and Ayeduase Gate',
      'Unity, Republic and Queen Elizabeth II Halls',
      'College of Engineering',
      'KNUST School of Business',
      'Main library and the Great Hall',
      'Brunei hostels',
    ],
    tips: [
      'Your first three rides at KNUST are free (up to 30 minutes each) until the end of the month.',
      'Tech Junction gets very busy at lecture change-over. Follow the quieter routes suggested in the app.',
    ],
  },
  {
    slug: 'university-of-cape-coast',
    name: 'University of Cape Coast',
    shortName: 'UCC',
    city: 'Cape Coast',
    region: 'Central',
    status: 'live',
    since: 'Live since September 2026',
    bikes: 90,
    zones: 38,
    hours: 'Rides from 6 am to 10 pm, every day',
    hub: 'Yenko Hub UCC, Science area',
    summary: 'Linking Old Site and New Site, so the trip between lectures takes minutes instead of a shuttle queue.',
    highlights: [
      'Science Market',
      'Sam Jonah Library',
      'Casely-Hayford and Atlantic Halls',
      'Old Site and New Site',
      'Main Auditorium',
    ],
    tips: [
      'Bikes can be picked up on Old Site and parked on New Site, or the other way round.',
      'Afternoon sea breezes can be strong. Slow down on exposed roads.',
    ],
  },
  {
    slug: 'ashesi-university',
    name: 'Ashesi University',
    shortName: 'Ashesi',
    city: 'Berekuso',
    region: 'Eastern',
    status: 'coming-soon',
    since: 'Planned for early 2027',
    hours: 'To be confirmed',
    summary: "We're planning a pilot fleet for Ashesi's hillside campus, with zones at the main campus, the residences and the Berekuso road.",
    highlights: ['Main campus', 'Student residences', 'Berekuso road'],
    tips: ['Join the waitlist on the Download page and we will tell you the moment bikes arrive.'],
  },
  {
    slug: 'upsa',
    name: 'University of Professional Studies, Accra',
    shortName: 'UPSA',
    city: 'Accra',
    region: 'Greater Accra',
    status: 'coming-soon',
    since: 'Planned for 2027',
    hours: 'To be confirmed',
    summary: "We're working with UPSA on bringing e-bikes to its East Legon campus and the neighbouring hostels.",
    highlights: ['Main campus', 'Nearby private hostels'],
    tips: ['Want Yenko sooner? Ask your SRC to get in touch through our Partnerships page.'],
  },
];

export const liveCampuses = campuses.filter((campus) => campus.status === 'live');
export const totalBikes = liveCampuses.reduce((sum, campus) => sum + (campus.bikes ?? 0), 0);
export const totalZones = liveCampuses.reduce((sum, campus) => sum + (campus.zones ?? 0), 0);
