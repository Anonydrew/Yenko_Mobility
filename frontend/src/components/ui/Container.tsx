import type { ElementType, ReactNode } from 'react';
import { cx } from '@/lib/cx';

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
};

export default function Container({ as: Tag = 'div', className, children }: ContainerProps) {
  return <Tag className={cx('mx-auto w-full max-w-site px-5 sm:px-8 lg:px-10', className)}>{children}</Tag>;
}
