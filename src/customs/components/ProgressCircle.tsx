import { cn } from '#/shadcn/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentPropsWithoutRef } from 'react';

const styles = cva('', {
  variants: {
    size: {
      'xs': 'text-xs size-3',
      'sm': 'text-sm size-5',
      'base': 'text-base size-6',
      'lg': 'text-lg size-7',
      'xl': 'text-xl size-8',
      '2xl': 'text-2xl size-9',
      '3xl': 'text-3xl size-10',
      '4xl': 'text-4xl size-12',
      '5xl': 'text-5xl size-14',
      '6xl': 'text-6xl size-16',
      '7xl': 'text-7xl size-20',
      '8xl': 'text-8xl size-24',
      '9xl': 'text-9xl size-32',
    },
  },
});

type Props = {
  pct: number
}
& ComponentPropsWithoutRef<'div'>
& VariantProps<typeof styles>;


/** 진행률 표시(원형) */
export function ProgressCircle({ pct, className, size = 'xs', ...props }: Props) {
  return (
    <div
      className={cn(
        'relative',
        styles({ size }),
        className)}
      {...props}
    >
      <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
        {/* 배경 원 */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--background))"
          strokeWidth="10"
        />
        {/* 진행 원 */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset={283 * (1 - pct / 100)}
        />
      </svg>
    </div>
  );
}
