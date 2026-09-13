import { useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import Button from '@/components/ui/Button';
import { CheckIcon, CloseIcon, CopyIcon } from '@/components/ui/icons';
import Logo from '@/components/ui/Logo';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { site } from '@/config/site';
import { cx } from '@/lib/cx';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const colours = [
  { name: 'Yenko Lime', hex: '#D9E026', role: 'Logo, primary buttons and highlights.', swatch: 'bg-brand' },
  { name: 'Black', hex: '#000000', role: 'Page background.', swatch: 'bg-black ring-1 ring-inset ring-line' },
  { name: 'Chrome', hex: '#0E1010', role: 'Header and footer background.', swatch: 'bg-chrome ring-1 ring-inset ring-line' },
  { name: 'Surface', hex: '#111414', role: 'Cards and quiet sections.', swatch: 'bg-surface-muted' },
  { name: 'Mist', hex: '#F4F5F2', role: 'Headings and body text.', swatch: 'bg-ink' },
  { name: 'Line', hex: '#262B2B', role: 'Dividers and borders.', swatch: 'bg-line' },
];

const voice = {
  do: ['Short, friendly sentences', 'Talk to riders as "you"', 'Be clear about prices and fees', 'Use local references people recognise'],
  dont: ['Jargon or technical terms', 'Exaggerated claims about impact', 'Placing the lime logo on busy photos', 'Shouting in ALL CAPS'],
};

const misuse = [
  { label: 'Don’t stretch or squash the logo', className: 'scale-x-150' },
  { label: 'Don’t rotate the logo', className: 'rotate-12' },
  { label: 'Don’t change the logo colours', className: 'hue-rotate-180' },
  { label: 'Don’t add shadows or effects', className: 'drop-shadow-[4px_4px_0_rgba(0,0,0,0.6)] blur-[1px]' },
];

export default function BrandGuidelines() {
  useDocumentTitle('Brand guidelines', 'How to use the Yenko Mobility name, logo, colours and typography.');

  return (
    <>
      <PageHero
        eyebrow="Help & Support"
        title="Brand guidelines"
        intro="How to use the Yenko name, logo and colours. Writing about us or working on a partnership? Start here."
        actions={
          <Button to="/contact?topic=press" size="lg" variant="dark">
            Request brand assets
          </Button>
        }
      />

      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <SectionHeading eyebrow="Logo" title="Our logo." intro="Our lime wordmark. Always leave clear space around it equal to the height of the letter “y”." />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <LogoTile className="bg-black ring-1 ring-inset ring-line" label="On black" />
          <LogoTile className="bg-chrome ring-1 ring-inset ring-line" label="On chrome" />
          <LogoTile className="bg-surface-muted" label="On surface" />
        </div>
        <ul className="mt-8 grid gap-3 text-ink-muted sm:grid-cols-3">
          <li>Minimum height: 24 px on screen, 8 mm in print.</li>
          <li>Use the lime logo on dark backgrounds only.</li>
          <li>Never recolour, stretch or add effects to the logo.</li>
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Colour" title="Our palette." intro="Mostly black and dark surfaces, with lime used sparingly to draw the eye. Text on lime is always near-black." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colours.map((colour) => (
            <li key={colour.hex} className="overflow-hidden rounded-3xl bg-surface-sunken">
              <div className={cx('h-32', colour.swatch)} />
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <p className="font-medium">{colour.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">{colour.role}</p>
                </div>
                <CopyHex hex={colour.hex} />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex h-4 overflow-hidden rounded-full ring-1 ring-inset ring-line" aria-label="Recommended balance: 60% black, 25% surfaces, 15% lime">
          <div className="w-[60%] bg-black" />
          <div className="w-[25%] bg-surface-sunken" />
          <div className="w-[15%] bg-brand" />
        </div>
        <p className="mt-3 text-sm text-ink-muted">Recommended balance: 60% black, 25% surfaces, 15% lime.</p>
      </Section>

      <Section>
        <SectionHeading eyebrow="Typography" title="Google Sans, everywhere." intro="Bold for headlines, regular for everything else. Keep headlines short and tight." />
        <div className="mt-12 divide-y divide-line border-y border-line">
          <TypeSample label="Display · Bold" className="text-display-xl font-bold" text="Let’s go." />
          <TypeSample label="Heading · Bold" className="text-display-md font-bold" text="Campus rides, made electric." />
          <TypeSample label="Body · Regular" className="text-lg" text="Unlock an e-bike with your phone and ride to your next lecture in minutes." />
          <TypeSample label="Caption · Medium" className="text-sm font-medium text-ink-muted" text="GH₵ 2 to unlock · GH₵ 0.50 per minute" />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Voice" title="How we sound." intro="Like a helpful friend who knows campus inside out: warm, direct and never pushy." />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <VoiceList title="Do" items={voice.do} positive />
          <VoiceList title="Don’t" items={voice.dont} />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Logo misuse" title="Please don’t." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {misuse.map((item) => (
            <li key={item.label} className="rounded-3xl bg-surface-muted p-6">
              <div className="flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-surface-sunken">
                <Logo className={item.className} />
              </div>
              <p className="mt-4 flex gap-2 text-sm">
                <CloseIcon width={18} height={18} className="shrink-0 text-red-400" />
                {item.label}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-ink-muted">
          Questions about using the {site.name} brand?{' '}
          <Button to="/contact?topic=press" variant="ghost" size="sm" className="underline underline-offset-4">
            Contact our press team
          </Button>
        </p>
      </Section>
    </>
  );
}

function LogoTile({ className, label, inverted = false }: { className: string; label: string; inverted?: boolean }) {
  return (
    <figure className={cx('flex h-56 flex-col items-center justify-center rounded-3xl', className)}>
      <span className="inline-flex items-center gap-2">
        <img src={site.logo.src} alt="" className="h-12 w-auto" />
        {site.logo.showWordmark && <span className={cx('text-4xl font-bold tracking-tight', inverted ? 'text-white' : 'text-ink')}>yenko</span>}
      </span>
      <figcaption className={cx('mt-6 text-sm', inverted ? 'text-white/60' : 'text-ink-muted')}>{label}</figcaption>
    </figure>
  );
}

function CopyHex({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(hex);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard unavailable.
        }
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 font-mono text-xs transition-colors hover:bg-surface-sunken"
      aria-label={`Copy ${hex}`}
    >
      {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
      {hex}
    </button>
  );
}

function TypeSample({ label, className, text }: { label: string; className: string; text: string }) {
  return (
    <div className="grid gap-3 py-8 md:grid-cols-12 md:items-baseline">
      <p className="text-sm text-ink-muted md:col-span-3">{label}</p>
      <p className={cx('md:col-span-9', className)}>{text}</p>
    </div>
  );
}

function VoiceList({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div className={cx('rounded-4xl p-8', positive ? 'bg-surface-sunken text-white ring-1 ring-inset ring-brand' : 'bg-surface-sunken')}>
      <h3 className="text-2xl font-bold">{title}</h3>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            {positive ? (
              <CheckIcon className="shrink-0 text-brand" strokeWidth={2.25} />
            ) : (
              <CloseIcon className="shrink-0 text-red-400" strokeWidth={2.25} />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
