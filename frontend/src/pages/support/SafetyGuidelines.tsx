import LegalLayout from '@/components/sections/LegalLayout';
import { legalUpdated } from '@/content/legal';
import { safetyGuidelines } from '@/content/safety';

export default function SafetyGuidelines() {
  return (
    <LegalLayout
      eyebrow="Help & Support"
      title="Safety Guidelines"
      intro="The rules every Yenko rider agrees to follow, and what happens if they’re broken. For friendly advice, see our safety tips."
      updated={legalUpdated}
      sections={safetyGuidelines.map((section) => ({
        id: section.id,
        heading: section.heading,
        paragraphs: section.intro ? [section.intro] : [],
        list: section.points,
      }))}
    />
  );
}
