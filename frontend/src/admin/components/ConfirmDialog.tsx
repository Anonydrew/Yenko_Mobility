import { useEffect, useRef, type ReactNode } from 'react';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', busy = false, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/70 p-4" onClick={() => !busy && onCancel()}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="w-full max-w-md rounded-2xl bg-surface-sunken p-6 shadow-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-lg font-bold tracking-tight">
          {title}
        </h2>
        <div id="confirm-message" className="mt-2 text-sm text-ink-muted">
          {message}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex h-11 items-center rounded-full bg-surface-muted px-5 text-[0.9375rem] font-medium hover:bg-surface-sunken disabled:opacity-50"
          >
            Cancel
          </button>
          <Button onClick={onConfirm} disabled={busy} className="bg-red-700 text-white hover:bg-red-500">
            {busy && <Spinner label="Working" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
