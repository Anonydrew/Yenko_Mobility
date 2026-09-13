import LegalLayout from '@/components/sections/LegalLayout';
import { legalUpdated, privacySections } from '@/content/legal';

export default function Privacy() {
  return (
    <LegalLayout
      eyebrow="Help & Support"
      title="Privacy Policy"
      intro="What personal data we collect, why we collect it and the choices you have."
      updated={legalUpdated}
      sections={privacySections}
    />
  );
}
