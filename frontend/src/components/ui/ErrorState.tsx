import Button from './Button';
import { AlertIcon } from './icons';

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export default function ErrorState({ title = "We couldn't load this", message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-4xl bg-surface-muted p-8 sm:p-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken">
        <AlertIcon />
      </span>
      <h2 className="mt-6 text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-xl text-ink-muted">{message}</p>
      {onRetry && (
        <Button variant="dark" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
