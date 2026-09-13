// Attribution for third-party photos and icons. CC BY and CC BY-SA licences require visible credit,
// which is shown on the public /credits page. Update this list whenever you replace an image.

export type Credit = {
  file: string;
  usedFor: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
};

const CC0 = 'https://creativecommons.org/publicdomain/zero/1.0/';
const BY_SA_4 = 'https://creativecommons.org/licenses/by-sa/4.0/';

export const siteCredits: Credit[] = [
  {
    file: 'images/hero.jpg',
    usedFor: 'Shared rides',
    title: 'Bicycle 01',
    author: 'Amuzujoe',
    license: 'CC BY-SA 4.0',
    licenseUrl: BY_SA_4,
    source: 'https://commons.wikimedia.org/wiki/File:Bicycle_01.jpg',
  },
  {
    file: 'images/e-bike.jpg',
    usedFor: 'E-bike features, home page',
    title: 'Urwahn E-Bike “Platzhirsch”',
    author: 'Writtenby',
    license: 'CC BY-SA 4.0',
    licenseUrl: BY_SA_4,
    source: 'https://commons.wikimedia.org/wiki/File:Urwahn_E-Bike_%E2%80%9EPlatzhirsch%E2%80%9C.jpg',
  },
  {
    file: 'images/fleet.jpg',
    usedFor: 'E-bike features, sustainability, partnerships',
    title: 'Electric Wheels in Fort Lauderdale, Florida',
    author: 'Austin Kirk',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Electric_Wheels_in_Fort_Lauderdale,_Florida.jpg',
  },
  {
    file: 'images/campus.jpg',
    usedFor: 'Campus locations, home page, mission, partnerships',
    title: 'University of Ghana – Legon Hall 3',
    author: 'Nanakwafoa',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:University_of_Ghana_-_Legon_Hall_3.jpg',
  },
  {
    file: 'images/riders.jpg',
    usedFor: 'Safety tips, home page',
    title: 'Exempted bicycle moving during lockdown due to covid 19 in Uganda',
    author: 'Ndahiro derrick',
    license: 'CC BY-SA 4.0',
    licenseUrl: BY_SA_4,
    source: 'https://commons.wikimedia.org/wiki/File:Exempted_bicycle_moving_during_lockdown_due_to_covid_19_in_Uganda.jpg',
  },
  {
    file: 'images/workshop.jpg',
    usedFor: 'Careers, e-bike features, home page',
    title: 'The Bicycle Mechanic',
    author: 'NoahNairobi',
    license: 'CC BY-SA 4.0',
    licenseUrl: BY_SA_4,
    source: 'https://commons.wikimedia.org/wiki/File:The_Bicycle_Mechanic.jpg',
  },
  {
    file: 'images/students.jpg',
    usedFor: 'About, careers, campus locations, home page',
    title: 'Ghanaian Senior High School students in class 03',
    author: 'BAGANIAH',
    license: 'CC BY-SA 4.0',
    licenseUrl: BY_SA_4,
    source: 'https://commons.wikimedia.org/wiki/File:Ghanaian_Senior_High_School_students_in_class_03.jpg',
  },
  {
    file: 'images/night-ride.jpg',
    usedFor: 'Safety tips',
    title: 'Black Bike',
    author: 'YesManPro',
    license: 'CC0',
    licenseUrl: CC0,
    source: 'https://stocksnap.io/photo/black-bike-25GLOY14GV',
  },
  {
    file: 'images/solar.jpg',
    usedFor: 'Sustainability',
    title: 'Rooftop solar panels, Markham',
    author: 'Raysonho @ Open Grid Scheduler / Grid Engine',
    license: 'CC0',
    licenseUrl: CC0,
    source: 'https://commons.wikimedia.org/w/index.php?curid=88469120',
  },
  {
    file: 'images/parking.jpg',
    usedFor: 'Home page (how it works)',
    title: 'Bikes Bicycles',
    author: 'Ryan McGuire',
    license: 'CC0',
    licenseUrl: CC0,
    source: 'https://stocksnap.io/photo/bikes-bicycles-678CF2D9BA',
  },
];

export const blogCoverCredits: Credit[] = [
  { file: 'meet-the-yenko-e1.jpg', usedFor: 'Blog cover', title: 'BESV PSA1 electric bicycle', author: 'Syced', license: 'CC0', licenseUrl: CC0, source: 'https://commons.wikimedia.org/w/index.php?curid=191857576' },
  { file: 'semester-pass-unlimited-rides.jpg', usedFor: 'Blog cover', title: 'LUUP electric bicycle rental station', author: 'Syced', license: 'CC0', licenseUrl: CC0, source: 'https://commons.wikimedia.org/w/index.php?curid=93725819' },
  { file: 'five-habits-of-confident-riders.jpg', usedFor: 'Blog cover', title: 'Cycling City', author: 'Burst', license: 'CC0', licenseUrl: CC0, source: 'https://stocksnap.io/photo/cycling-city-E5BW2K6ZYK' },
  { file: 'riding-at-night-on-campus.jpg', usedFor: 'Blog cover', title: 'Black Bike', author: 'YesManPro', license: 'CC0', licenseUrl: CC0, source: 'https://stocksnap.io/photo/black-bike-25GLOY14GV' },
  { file: 'guide-to-parking-zones.jpg', usedFor: 'Blog cover', title: 'Bikes Bicycles', author: 'Ryan McGuire', license: 'CC0', licenseUrl: CC0, source: 'https://stocksnap.io/photo/bikes-bicycles-678CF2D9BA' },
  { file: 'yenko-arrives-at-knust.jpg', usedFor: 'Blog cover', title: 'Bike Share Toronto Electric Dock', author: 'Isaacberman', license: 'CC0', licenseUrl: CC0, source: 'https://commons.wikimedia.org/w/index.php?curid=187426161' },
  { file: 'first-100000-rides.jpg', usedFor: 'Blog cover', title: 'Older woman with flowers, protected bike lane, Boston', author: 'Adam Coppola', license: 'CC0', licenseUrl: CC0, source: 'https://commons.wikimedia.org/w/index.php?curid=46251073' },
  { file: 'inside-our-charging-hub-at-legon.jpg', usedFor: 'Blog cover', title: 'Rooftop solar panels, Markham', author: 'Raysonho @ Open Grid Scheduler / Grid Engine', license: 'CC0', licenseUrl: CC0, source: 'https://commons.wikimedia.org/w/index.php?curid=88469120' },
];
