import { BikeIcon, GaugeIcon, HeartIcon, type Icon, MoonIcon, ShieldIcon, UsersIcon } from '@/components/ui/icons';

export type Tip = { icon: Icon; title: string; text: string };

export const safetyTips: Tip[] = [
  {
    icon: ShieldIcon,
    title: 'Do the 30-second check',
    text: 'Squeeze both brakes, press down on the tyres, switch the lights on and ring the bell. If anything feels wrong, pick another bike and report it.',
  },
  {
    icon: BikeIcon,
    title: 'Set the seat to your height',
    text: 'Sitting on the saddle, the balls of your feet should just touch the ground. Use the height markings on the seat post and remember your number.',
  },
  {
    icon: UsersIcon,
    title: 'Ride predictably',
    text: 'Keep to the right, signal before you turn and make eye contact with drivers at junctions. If you can’t see their eyes, they can’t see you.',
  },
  {
    icon: GaugeIcon,
    title: 'Slow down where people walk',
    text: 'Near lecture halls, libraries and halls of residence, the bike slows to 12 km/h. Ring your bell early. Pedestrians always have right of way.',
  },
  {
    icon: HeartIcon,
    title: 'One rider, two hands',
    text: 'Never carry a passenger. Keep both hands on the handlebars, and pull over before checking your phone.',
  },
  {
    icon: MoonIcon,
    title: 'Be seen after dark',
    text: 'The lights switch on automatically, but light or reflective clothing makes a big difference. Use the Well-lit routes layer in the app.',
  },
];

export const weatherTips = [
  'Brakes take longer to stop in the rain. Start braking earlier and more gently.',
  'Avoid riding through standing water. It can hide potholes and drainage covers.',
  'During thunderstorms we may pause rides on your campus. The app will tell you.',
  'In strong sun, carry water. On long rides, rest in the shade.',
];

export type GuidelineSection = { id: string; heading: string; intro?: string; points: string[] };

export const safetyGuidelines: GuidelineSection[] = [
  {
    id: 'eligibility',
    heading: 'Who can ride',
    points: [
      'Riders must be at least 16 years old. Riders aged 16 or 17 need a parent or guardian to accept the Terms of Service.',
      'Each account belongs to one person. Don’t unlock a bike for someone else.',
      'Riders must be physically able to ride a bicycle safely.',
    ],
  },
  {
    id: 'before-riding',
    heading: 'Before every ride',
    points: [
      'Check the brakes, tyres, lights and bell. Don’t ride a bike that seems faulty; report it in the app.',
      'Adjust the seat so you can reach the ground with the balls of your feet.',
      'Wearing a helmet is strongly recommended for every ride.',
      'Make sure any bag in the basket is secured with the strap and weighs no more than 8 kg.',
    ],
  },
  {
    id: 'while-riding',
    heading: 'While riding',
    points: [
      'Follow the Road Traffic Act and all campus traffic rules, including one-way roads and pedestrian areas.',
      'Keep to the right and ride in the same direction as traffic.',
      'Respect slow zones (12 km/h) and give way to pedestrians at all times.',
      'Keep both hands on the handlebars. Use your phone only when stopped.',
      'Use the lights between 6 pm and 6 am and in poor visibility.',
    ],
  },
  {
    id: 'not-allowed',
    heading: 'Not allowed',
    points: [
      'Riding under the influence of alcohol or drugs.',
      'Carrying passengers, or towing or being towed.',
      'Stunts, racing or riding off-road.',
      'Riding on closed paths, sports pitches or indoors.',
      'Tampering with the lock, battery, GPS unit or any other part of the bike.',
    ],
  },
  {
    id: 'parking',
    heading: 'Parking',
    points: [
      'End every ride inside a parking zone shown in the app.',
      'Park upright on the kickstand, and take the end-of-ride photo.',
      'Never block wheelchair ramps, tactile paving, doors, gates, fire exits or walkways.',
    ],
  },
  {
    id: 'incidents',
    heading: 'Accidents and incidents',
    points: [
      'If anyone is injured, call 112 or use the emergency button in the app.',
      'Report every accident, near miss or damage in the app within 24 hours, even if no one was hurt.',
      'Cooperate with campus security and Yenko staff investigating an incident.',
    ],
  },
  {
    id: 'enforcement',
    heading: 'How we enforce these rules',
    intro: 'Most problems are mistakes, and we treat them that way. For repeated or serious breaches we may:',
    points: [
      'Send a warning with guidance on how to ride or park safely.',
      'Charge the fees listed on the Pricing page, such as the out-of-zone parking fee.',
      'Suspend an account temporarily, or close it permanently for dangerous behaviour.',
      'Share information with the university or the police where the law requires it.',
    ],
  },
];
