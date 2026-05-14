import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
        primary: 'bg-blue-600 text-white dark:bg-blue-700',
        success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
        secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
        outline:
          'border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-300',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export const Badge = ({
  className,
  variant,
  size,
  children,
  ...props
}: BadgeProps) => (
  <div
    className={cn(badgeVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </div>
);

export default Badge;
