import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { cx } from '@/lib/cx';

const STORAGE_KEY = 'yenko-cookie-preferences';

type Preferences = { analytics: boolean; marketing: boolean };

function loadPreferences(): Preferences {
  try {
    return { analytics: false, marketing: false, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') };
  } catch {
    return { analytics: false, marketing: false };
  }
}

function savePreferences(preferences: Preferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts for this visit only.
  }
}

type CookiePreferencesProps = {
  open: boolean;
  onClose: () => void;
};

export default function CookiePreferences({ open, onClose }: CookiePreferencesProps) {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);

  useEffect(() => {
    if (!open) return;
    setPreferences(loadPreferences());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const saveAndClose = (next: Preferences) => {
    savePreferences(next);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex animate-fade-in items-end justify-center bg-black/70 p-4 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        className="w-full max-w-md rounded-3xl border border-line bg-chrome p-6 shadow-panel sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="cookie-preferences-title" className="text-xl font-bold tracking-tight">
          Cookie preferences
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          We use essential cookies to run this site. You decide whether we can use any others. Learn more in our{' '}
          <Link to="/privacy" onClick={onClose} className="text-ink underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>

        <div className="mt-6 divide-y divide-line border-y border-line">
          <PreferenceRow title="Essential" description="Needed for the site to work, like remembering these choices." checked disabled />
          <PreferenceRow
            title="Analytics"
            description="Helps us understand which pages are useful."
            checked={preferences.analytics}
            onChange={(analytics) => setPreferences({ ...preferences, analytics })}
          />
          <PreferenceRow
            title="Marketing"
            description="Lets us measure our campaigns on other sites."
            checked={preferences.marketing}
            onChange={(marketing) => setPreferences({ ...preferences, marketing })}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="dark" className="flex-1" onClick={() => saveAndClose(preferences)}>
            Save choices
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => saveAndClose({ analytics: true, marketing: true })}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}

type PreferenceRowProps = {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
};

function PreferenceRow({ title, description, checked, disabled, onChange }: PreferenceRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cx(
          'relative h-6 w-10 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          checked ? 'bg-brand' : 'bg-surface-sunken ring-1 ring-inset ring-line',
        )}
      >
        <span
          className={cx(
            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow transition-transform',
            checked ? 'translate-x-4 bg-onbrand' : 'bg-ink-muted',
          )}
        />
      </button>
    </div>
  );
}
