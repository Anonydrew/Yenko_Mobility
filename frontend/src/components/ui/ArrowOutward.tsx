import { cx } from '@/lib/cx';

/** The "arrow_outward" icon from Google Material Symbols. Sized relative to the surrounding text. */
export default function ArrowOutward({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cx('material-symbols-outlined select-none leading-none', className)} style={{ fontSize: '1.2em' }}>
      arrow_outward
    </span>
  );
}
