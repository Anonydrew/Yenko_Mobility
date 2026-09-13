import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cx } from '@/lib/cx';

type Variant = 'primary' | 'dark' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = CommonProps & { to: string } & Omit<LinkProps, 'to' | 'className' | 'children'>;
type NativeButtonProps = CommonProps & { to?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-onbrand hover:bg-brand-300',
  // High-contrast button: white on the dark theme.
  dark: 'bg-white text-onbrand hover:bg-ink-soft',
  secondary: 'bg-surface-sunken text-ink ring-1 ring-inset ring-line hover:bg-line',
  ghost: 'text-ink hover:bg-surface-sunken',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-14 px-7 text-base',
};

export default function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props;
  const classes = cx(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  );

  if (rest.to !== undefined) {
    return (
      <Link className={classes} {...(rest as Omit<LinkButtonProps, keyof CommonProps>)}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...(rest as Omit<NativeButtonProps, keyof CommonProps>)}>
      {children}
    </button>
  );
}
