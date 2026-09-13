import { Link } from 'react-router-dom';
import FaqExplorer from '@/components/sections/FaqExplorer';
import PageHero from '@/components/sections/PageHero';
import { AlertIcon, ArrowRightIcon, BikeIcon, type Icon, MailIcon, MessageIcon, PhoneIcon, ShieldIcon, WalletIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { faqGroups } from '@/content/faqs';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const topics: { icon: Icon; title: string; text: string; to: string }[] = [
  { icon: BikeIcon, title: 'Getting started', text: 'Signing up, finding bikes and your first ride.', to: '/faq#getting-started' },
  { icon: WalletIcon, title: 'Pricing and payments', text: 'Passes, fees, receipts and mobile money.', to: '/faq#pricing-and-payments' },
  { icon: ShieldIcon, title: 'Safety', text: 'Riding safely, accidents and our rules.', to: '/safety-guidelines' },
  { icon: PhoneIcon, title: 'Your account', text: 'Student verification, privacy and deleting your account.', to: '/faq#account-and-privacy' },
];

const channels = [
  { icon: MessageIcon, title: 'Chat in the app', text: 'The fastest way to get help, any time of day or night. Go to Help → Chat with us.' },
  { icon: MailIcon, title: 'Send a message', text: 'Use our contact form and we’ll reply within one working day.', link: { to: '/contact?topic=support', label: 'Contact support' } },
  { icon: AlertIcon, title: 'In an emergency', text: 'Call 112, or hold the shield button in the app to alert campus security and share your location.' },
];

export default function SupportCenter() {
  useDocumentTitle('Support center', 'Get help with Yenko rides, payments, safety and your account.');

  return (
    <>
      <PageHero eyebrow="Help & Support" title="How can we help?" intro="Find answers fast, or reach a real person at any hour." />

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map(({ icon: TopicIcon, title, text, to }) => (
            <li key={title}>
              <Link to={to} className="group flex h-full flex-col rounded-3xl bg-surface-muted p-7 transition-colors hover:bg-surface-sunken">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-onbrand">
                  <TopicIcon width={22} height={22} />
                </span>
                <span className="mt-6 flex items-center justify-between gap-4 text-xl font-medium tracking-tight">
                  {title}
                  <ArrowRightIcon width={18} height={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-2 text-ink-muted">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Contact options" title="Talk to a person." />
        <ul className="mt-12 grid gap-4 lg:grid-cols-3">
          {channels.map(({ icon: ChannelIcon, title, text, link }) => (
            <li key={title} className="rounded-3xl bg-surface-sunken p-7">
              <ChannelIcon width={26} height={26} />
              <h3 className="mt-6 text-xl font-medium tracking-tight">{title}</h3>
              <p className="mt-2 text-ink-muted">{text}</p>
              {link && (
                <Link to={link.to} className="mt-5 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline">
                  {link.label} <ArrowRightIcon width={18} height={18} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading eyebrow="FAQs" title="Popular questions." className="mb-10" />
        <FaqExplorer groups={faqGroups} />
      </Section>
    </>
  );
}
