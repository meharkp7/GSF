import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-lg overflow-hidden transition-shadow',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700',
        elevated: 'bg-white dark:bg-slate-800 shadow-md hover:shadow-lg dark:shadow-slate-900/50',
        outline: 'bg-transparent dark:bg-transparent border border-gray-300 dark:border-slate-600',
        ghost: 'bg-gray-50 dark:bg-slate-900 border-0',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = ({ className, variant, padding, children, ...props }: CardProps) => (
  <div className={cn(cardVariants({ variant, padding }), className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('border-b border-gray-200 dark:border-slate-700 pb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn('text-xl font-semibold text-gray-900 dark:text-white', className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-gray-600 dark:text-gray-400 mt-1', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('py-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('border-t border-gray-200 dark:border-slate-700 pt-4 flex gap-3', className)}
    {...props}
  >
    {children}
  </div>
);

export default Card;
