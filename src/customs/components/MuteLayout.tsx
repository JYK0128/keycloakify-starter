import { cn } from '#/shadcn/lib/utils';
import { HTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;


/** 바탕 레이아웃 */
export function MuteLayout({ children, className, ...props }: Props) {
  return (
    <div
      {...props}
      className={cn(
        'bg-muted',
        'min-h-svh max-h-svh',
        'flex items-center justify-center',
        className,
      )}
    >
      {children}
    </div>
  );
}
