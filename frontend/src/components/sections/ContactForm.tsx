import { useEffect, useState, type FormEvent } from 'react';
import Button from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field';
import { AlertIcon, CheckIcon } from '@/components/ui/icons';
import Spinner from '@/components/ui/Spinner';
import { campuses } from '@/content/locations';
import { api, ApiError } from '@/lib/api';
import type { ContactTopic } from '@/lib/types';

export const contactTopics: { value: Exclude<ContactTopic, 'waitlist'>; label: string }[] = [
  { value: 'general', label: 'General question' },
  { value: 'support', label: 'Help with a ride, payment or my account' },
  { value: 'partnerships', label: 'Partnerships' },
  { value: 'careers', label: 'Careers' },
  { value: 'press', label: 'Press and media' },
];

type ContactFormProps = {
  variant?: 'contact' | 'waitlist';
  defaultTopic?: ContactTopic;
  defaultMessage?: string;
};

type Values = { name: string; email: string; topic: ContactTopic; campus: string; message: string; website: string };

export default function ContactForm({ variant = 'contact', defaultTopic = 'general', defaultMessage = '' }: ContactFormProps) {
  const isWaitlist = variant === 'waitlist';
  const initialTopic: ContactTopic = isWaitlist ? 'waitlist' : defaultTopic;
  const [values, setValues] = useState<Values>({ name: '', email: '', topic: initialTopic, campus: '', message: defaultMessage, website: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent'>('idle');

  // Links such as /contact?topic=careers can change the preset while the page is open.
  useEffect(() => {
    setValues((current) => ({ ...current, topic: initialTopic, message: defaultMessage || current.message }));
  }, [initialTopic, defaultMessage]);

  const update = (field: keyof Values) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('submitting');
    setErrors({});
    setFormError(null);

    try {
      await api('/contact', { body: { ...values, campus: values.campus || null } });
      setStatus('sent');
    } catch (error) {
      setStatus('idle');
      if (error instanceof ApiError && Object.keys(error.fields).length > 0) {
        setErrors(error.fields);
      } else {
        setFormError(error instanceof ApiError ? error.message : 'Something went wrong. Please try again.');
      }
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-4xl bg-surface-sunken p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-onbrand">
          <CheckIcon strokeWidth={2.5} />
        </span>
        <h3 className="mt-6 text-2xl font-bold tracking-tight">{isWaitlist ? "You're on the list." : 'Thanks, we got your message.'}</h3>
        <p className="mt-2 text-ink-muted">
          {isWaitlist
            ? "We'll email you the download links the moment the app is in the stores."
            : 'Our team usually replies within one working day.'}
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setValues({ name: '', email: '', topic: initialTopic, campus: '', message: '', website: '' });
            setStatus('idle');
          }}
        >
          {isWaitlist ? 'Add someone else' : 'Send another message'}
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Your name" name="name" autoComplete="name" value={values.name} onChange={update('name')} error={errors.name} required />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={update('email')}
          error={errors.email}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {!isWaitlist && (
          <SelectField label="What's it about?" name="topic" value={values.topic} onChange={update('topic')} error={errors.topic}>
            {contactTopics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </SelectField>
        )}
        <SelectField label="Campus" name="campus" value={values.campus} onChange={update('campus')} error={errors.campus} optional className={isWaitlist ? 'sm:col-span-2' : undefined}>
          <option value="">Choose a campus</option>
          {campuses.map((campus) => (
            <option key={campus.slug} value={campus.shortName}>
              {campus.name}
            </option>
          ))}
          <option value="Other">Another campus</option>
        </SelectField>
      </div>

      {!isWaitlist && (
        <TextAreaField
          label="Message"
          name="message"
          rows={6}
          value={values.message}
          onChange={update('message')}
          error={errors.message}
          hint="Include your phone number or ride details if you need help with a specific trip."
          required
        />
      )}

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={update('website')} />
        </label>
      </div>

      {formError && (
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-500/10 p-4 text-sm text-red-300">
          <AlertIcon width={18} height={18} className="mt-0.5 shrink-0" />
          {formError}
        </p>
      )}

      <Button type="submit" variant="dark" size="lg" disabled={status === 'submitting'}>
        {status === 'submitting' && <Spinner label="Sending" />}
        {isWaitlist ? 'Join the waitlist' : 'Send message'}
      </Button>
    </form>
  );
}
