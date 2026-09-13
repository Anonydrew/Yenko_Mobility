import { Link, useSearchParams } from 'react-router-dom';
import ContactForm, { contactTopics } from '@/components/sections/ContactForm';
import PageHero from '@/components/sections/PageHero';
import { MailIcon, MapPinIcon, MessageIcon, UsersIcon } from '@/components/ui/icons';
import Section from '@/components/ui/Section';
import { site } from '@/config/site';
import type { ContactTopic } from '@/lib/types';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const cards = [
  { icon: MessageIcon, title: 'Rider support', text: 'Chat in the app for the fastest help with a ride, 24/7.' },
  { icon: UsersIcon, title: 'Partnerships', text: 'Universities, hostels and businesses.', link: { to: '/partnerships', label: 'Partnership options' } },
  { icon: MailIcon, title: 'Press and media', text: 'Interviews, images and brand assets.', link: { to: '/brand', label: 'Brand guidelines' } },
  { icon: MapPinIcon, title: 'Head office', text: `Yenko Mobility Ltd., ${site.location}` },
];

export default function Contact() {
  useDocumentTitle('Contact us', 'Get in touch with the Yenko Mobility team.');
  const [searchParams] = useSearchParams();

  const requestedTopic = searchParams.get('topic');
  const topic = contactTopics.some((item) => item.value === requestedTopic) ? (requestedTopic as ContactTopic) : 'general';
  const role = searchParams.get('role');
  const message = role ? `I'd like to apply for the ${role} role.\n\nA bit about me: ` : '';

  return (
    <>
      <PageHero
        eyebrow="Help & Support"
        title={role ? `Apply: ${role}` : 'Talk to us.'}
        intro={
          role
            ? 'Tell us a little about yourself and include a link to your CV or LinkedIn profile.'
            : 'Questions, feedback or ideas? Send us a message and the right person will get back to you.'
        }
      />

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <div className="grid gap-10 lg:grid-cols-12">
          <ul className="grid content-start gap-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {cards.map(({ icon: CardIcon, title, text, link }) => (
              <li key={title} className="flex gap-4 rounded-3xl bg-surface-muted p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-sunken">
                  <CardIcon width={20} height={20} />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{text}</span>
                  {link && (
                    <Link to={link.to} className="mt-2 inline-block text-sm font-medium underline underline-offset-4">
                      {link.label}
                    </Link>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="rounded-4xl bg-surface-muted p-6 sm:p-10 lg:col-span-8">
            <ContactForm key={`${topic}-${role ?? ''}`} defaultTopic={topic} defaultMessage={message} />
          </div>
        </div>
      </Section>
    </>
  );
}
