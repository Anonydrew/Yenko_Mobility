// Every photo used on the marketing pages. To swap a photo, replace the file in
// frontend/public/images (keeping its name), or point `src` at a new file. Credits: CREDITS.md.

export type MediaImage = {
  src: string;
  alt: string;
};

export const media = {
  hero: { src: '/images/hero.jpg', alt: 'A woman riding a bicycle along a sunny road' },
  eBike: { src: '/images/e-bike.jpg', alt: 'A yellow electric bike leaning against a colourful painted wall' },
  fleet: { src: '/images/fleet.jpg', alt: 'A row of shared electric bikes docked at a station' },
  campus: { src: '/images/campus.jpg', alt: 'Legon Hall at the University of Ghana, with palm trees and red-tiled roofs' },
  riders: { src: '/images/riders.jpg', alt: 'A cyclist riding along a marked cycle lane' },
  night: { src: '/images/night-ride.jpg', alt: 'A bike parked under bright lights at night' },
  workshop: { src: '/images/workshop.jpg', alt: 'A mechanic repairing a bicycle in a workshop' },
  solar: { src: '/images/solar.jpg', alt: 'Solar panels on a rooftop under a blue sky' },
  parking: { src: '/images/parking.jpg', alt: 'Bicycles parked neatly in a row' },
  students: { src: '/images/students.jpg', alt: 'Two smiling students outdoors' },
} satisfies Record<string, MediaImage>;
