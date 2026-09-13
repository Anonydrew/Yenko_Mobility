import FaqExplorer from '@/components/sections/FaqExplorer';
import PageHero from '@/components/sections/PageHero';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

export default function Faqs() {
  useDocumentTitle('FAQs', 'Answers to the questions Yenko riders ask most, from pricing and payments to parking and safety.');

  return (
    <>
      <PageHero eyebrow="How it works" title="Frequently asked questions" intro="Quick answers about riding, paying, parking and your account." />

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <FaqExplorer />
      </Section>

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <div className="flex flex-col gap-6 rounded-4xl bg-surface-muted p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Still have a question?</h2>
            <p className="mt-2 text-ink-muted">Chat with us in the app at any time, or send our support team a message.</p>
          </div>
          <Button to="/contact?topic=support" variant="dark">
            Contact support
          </Button>
        </div>
      </Section>
    </>
  );
}
