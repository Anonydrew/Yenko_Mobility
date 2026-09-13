import { BikeIcon, GraduationIcon, HeartIcon, type Icon, SparkIcon } from '@/components/ui/icons';

export type Role = {
  title: string;
  team: 'Operations' | 'Support' | 'Engineering' | 'Product' | 'Marketing';
  location: string;
  type: string;
};

export const openRoles: Role[] = [
  { title: 'Field Operations Technician', team: 'Operations', location: 'Kumasi (KNUST)', type: 'Full-time' },
  { title: 'Battery Swap Operator, night shift', team: 'Operations', location: 'Accra (Legon)', type: 'Full-time' },
  { title: 'Campus Operations Lead', team: 'Operations', location: 'Cape Coast (UCC)', type: 'Full-time' },
  { title: 'Customer Support Agent (English and Twi)', team: 'Support', location: 'Accra', type: 'Full-time, shifts' },
  { title: 'Senior Mobile Engineer', team: 'Engineering', location: 'Accra or remote in Ghana', type: 'Full-time' },
  { title: 'Data Analyst', team: 'Product', location: 'Accra', type: 'Full-time' },
  { title: 'Campus Ambassador', team: 'Marketing', location: 'Legon, KNUST or UCC', type: 'Part-time, students' },
];

export const perks: { icon: Icon; title: string; text: string }[] = [
  { icon: BikeIcon, title: 'Free riding', text: 'Unlimited Yenko rides for you, on every campus.' },
  { icon: HeartIcon, title: 'Health cover', text: 'Private health insurance for full-time staff and their dependants.' },
  { icon: GraduationIcon, title: 'Learning budget', text: 'GH₵ 3,000 a year for courses, certifications and books.' },
  { icon: SparkIcon, title: 'Room to grow', text: 'Many of our team leads started as field technicians. We promote from within first.' },
];

export const values = [
  { title: 'Riders first', text: 'Every decision starts with what makes a student’s day easier and safer.' },
  { title: 'Own the details', text: 'A clean bike, a charged battery and a clear parking zone are how trust is built.' },
  { title: 'Built here', text: 'We hire locally, repair locally and design for Ghanaian campuses, not someone else’s city.' },
  { title: 'Leave it better', text: 'Fewer emissions, less congestion and longer-lasting batteries. Every ride should count.' },
];
