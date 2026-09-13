const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function parse(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "9 Sept 2026" */
export function formatDate(iso: string | null | undefined): string {
  const date = parse(iso);
  return date ? dateFormatter.format(date) : '';
}

/** "9 Sept 2026, 14:30" */
export function formatDateTime(iso: string | null | undefined): string {
  const date = parse(iso);
  return date ? dateTimeFormatter.format(date) : '';
}

export function isFuture(iso: string | null | undefined): boolean {
  const date = parse(iso);
  return date !== null && date.getTime() > Date.now();
}

/** ISO string → value for <input type="datetime-local"> in the viewer's time zone. */
export function toLocalInput(iso: string | null | undefined): string {
  const date = parse(iso);
  if (!date) return '';
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Value from <input type="datetime-local"> → ISO string (UTC), or null when empty. */
export function fromLocalInput(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
