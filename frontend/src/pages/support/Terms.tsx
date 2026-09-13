import LegalLayout from '@/components/sections/LegalLayout';
import { legalUpdated, termsSections } from '@/content/legal';

export default function Terms() {
  return (
    <LegalLayout
      eyebrow="Help & Support"
      title="Terms of Service"
      intro="The rules for using the Yenko app, website and e-bikes."
      updated={legalUpdated}
      sections={termsSections}
    />
  );
}
