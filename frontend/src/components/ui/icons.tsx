import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;
export type Icon = (props: IconProps) => JSX.Element;

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

function icon(paths: JSX.Element): Icon {
  return (props: IconProps) => (
    <svg {...base} {...props}>
      {paths}
    </svg>
  );
}

// Navigation
export const ArrowRightIcon = icon(<path d="M5 12h14M13 6l6 6-6 6" />);
export const ArrowLeftIcon = icon(<path d="M19 12H5M11 18l-6-6 6-6" />);
export const ArrowUpRightIcon = icon(<path d="M7 17 17 7M8 7h9v9" />);
export const ChevronDownIcon = icon(<path d="m6 9 6 6 6-6" />);
export const ChevronLeftIcon = icon(<path d="m15 18-6-6 6-6" />);
export const ChevronRightIcon = icon(<path d="m9 18 6-6-6-6" />);
export const MenuIcon = icon(<path d="M4 8h16M4 16h16" />);
export const CloseIcon = icon(<path d="M6 6l12 12M18 6 6 18" />);
export const PlusIcon = icon(<path d="M12 5v14M5 12h14" />);
export const CheckIcon = icon(<path d="M20 6 9 17l-5-5" />);
export const SearchIcon = icon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
);

// Product
export const BikeIcon = icon(
  <>
    <circle cx="18.5" cy="17.5" r="3.5" />
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="15" cy="5" r="1" />
    <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
  </>,
);
export const PlayIcon = icon(<path d="M6 3.5v17l14-8.5z" />);
export const BoltIcon = icon(<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />);
export const BatteryIcon = icon(
  <>
    <rect x="2" y="7" width="17" height="10" rx="2" />
    <path d="M22 11v2M6 10.5v3M9.5 10.5v3M13 10.5v3" />
  </>,
);
export const LockIcon = icon(
  <>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>,
);
export const ShieldIcon = icon(
  <>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </>,
);
export const MapPinIcon = icon(
  <>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </>,
);
export const GaugeIcon = icon(
  <>
    <path d="M3.3 19a10 10 0 1 1 17.4 0" />
    <path d="m12 14 4-4" />
  </>,
);
export const SunIcon = icon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>,
);
export const MoonIcon = icon(<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />);
export const BasketIcon = icon(
  <>
    <path d="M3 9h18l-2 11H5L3 9z" />
    <path d="m8 9 4-6 4 6M9 13v3M15 13v3" />
  </>,
);
export const LeafIcon = icon(
  <>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
    <path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12" />
  </>,
);
export const ClockIcon = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
);
export const WalletIcon = icon(
  <>
    <rect x="3" y="6" width="18" height="14" rx="2" />
    <path d="M3 10h18M16 15h1" />
  </>,
);
export const PhoneIcon = icon(
  <>
    <rect x="6" y="2" width="12" height="20" rx="2.5" />
    <path d="M11 18h2" />
  </>,
);
export const UsersIcon = icon(
  <>
    <circle cx="9" cy="8" r="4" />
    <path d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M16 3.5a4 4 0 0 1 0 8M22 21v-1a5 5 0 0 0-3.5-4.8" />
  </>,
);
export const GraduationIcon = icon(
  <>
    <path d="M22 10 12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c3.5 2.7 8.5 2.7 12 0v-5" />
  </>,
);
export const BuildingIcon = icon(
  <>
    <rect x="4" y="3" width="16" height="18" rx="1.5" />
    <path d="M9 21v-4h6v4M8 7h1M12 7h1M16 7h-1M8 11h1M12 11h1M16 11h-1" />
  </>,
);
export const HeartIcon = icon(
  <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />,
);
export const SparkIcon = icon(<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" />);
export const MailIcon = icon(
  <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </>,
);
export const MessageIcon = icon(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />);
export const AlertIcon = icon(
  <>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </>,
);
export const DownloadIcon = icon(<path d="M12 3v12M7 10l5 5 5-5M5 21h14" />);
export const CopyIcon = icon(
  <>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </>,
);
export const RouteIcon = icon(
  <>
    <circle cx="6" cy="19" r="3" />
    <circle cx="18" cy="5" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
  </>,
);

// Admin
export const FileTextIcon = icon(
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h5" />
  </>,
);
export const TagIcon = icon(
  <>
    <path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z" />
    <circle cx="7.5" cy="7.5" r="1" />
  </>,
);
export const InboxIcon = icon(
  <>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z" />
  </>,
);
export const ImageIcon = icon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
  </>,
);
export const TrashIcon = icon(<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />);
export const PencilIcon = icon(<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />);
export const EyeIcon = icon(
  <>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);
export const LogOutIcon = icon(<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />);
export const ExternalIcon = icon(<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />);
export const BoldIcon = icon(<path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" />);
export const ItalicIcon = icon(<path d="M19 4h-9M14 20H5M15 4 9 20" />);
export const LinkIcon = icon(<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />);
export const ListIcon = icon(<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />);
export const ListOrderedIcon = icon(<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />);
export const QuoteIcon = icon(<path d="M3 21c3 0 7-1 7-8V5c0-1.3-.8-2-2-2H4c-1.3 0-2 .8-2 2v6c0 1.3.8 2 2 2h3M14 21c3 0 7-1 7-8V5c0-1.3-.8-2-2-2h-4c-1.3 0-2 .8-2 2v6c0 1.3.8 2 2 2h3" />);
export const HeadingIcon = icon(<path d="M6 4v16M18 4v16M6 12h12" />);
