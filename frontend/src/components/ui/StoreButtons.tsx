import { Link } from 'react-router-dom';
import { cx } from '@/lib/cx';

// Official badge artwork lives in frontend/public/brand. The files are dark, so they're inverted on dark backgrounds.
const stores = [
  { label: 'Download on the App Store', src: '/brand/app-store.svg', width: 120 },
  { label: 'Get it on Google Play', src: '/brand/app-android.svg', width: 122 },
];

type StoreButtonsProps = {
  /** "dark" for dark backgrounds (badges shown in white), "light" for light or lime backgrounds. */
  tone?: 'dark' | 'light';
  className?: string;
};

/** Store links point to the Download page until the real App Store and Google Play listings are live. */
export default function StoreButtons({ tone = 'dark', className }: StoreButtonsProps) {
  return (
    <div className={cx('flex flex-wrap items-center gap-3', className)}>
      {stores.map((store) => (
        <Link key={store.src} to="/download#get-the-app" aria-label={store.label} className="inline-block rounded-[10px] transition-opacity hover:opacity-75">
          <img src={store.src} alt="" width={store.width} height={40} className={cx('h-12 w-auto', tone === 'dark' && 'invert')} />
        </Link>
      ))}
    </div>
  );
}
