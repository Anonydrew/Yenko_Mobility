import { site } from '@/config/site';
import { cx } from '@/lib/cx';

type LogoProps = {
  className?: string;
  /** Show only the mark, without the wordmark. */
  markOnly?: boolean;
};

export default function Logo({ className, markOnly = false }: LogoProps) {
  const showWordmark = site.logo.showWordmark && !markOnly;

  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <img src={site.logo.src} alt={showWordmark ? '' : site.logo.alt} className="h-8 w-auto" height={32} />
      {showWordmark && <span className="text-[1.375rem] font-bold leading-none tracking-tight text-ink">yenko</span>}
    </span>
  );
}
