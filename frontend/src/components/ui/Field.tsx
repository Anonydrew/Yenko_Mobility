import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';

type CommonProps = {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
};

const control =
  'block w-full rounded-2xl border bg-surface-muted px-4 py-3 text-base text-ink placeholder:text-ink-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-0 disabled:opacity-60';

function FieldShell({ id, label, error, hint, optional, className, children }: CommonProps & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-4 text-sm font-medium text-ink">
        {label}
        {optional && <span className="font-normal text-ink-subtle">Optional</span>}
      </label>
      <div className="mt-2">{children}</div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function TextField({ label, error, hint, optional, className, ...props }: CommonProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cx(control, error ? 'border-red-500' : 'border-line')}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({ label, error, hint, optional, className, children, ...props }: CommonProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cx(control, 'appearance-none bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12', error ? 'border-red-500' : 'border-line')}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239BA09F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({ label, error, hint, optional, className, ...props }: CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cx(control, 'min-h-32 resize-y', error ? 'border-red-500' : 'border-line')}
        {...props}
      />
    </FieldShell>
  );
}
