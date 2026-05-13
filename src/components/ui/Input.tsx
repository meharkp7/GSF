import { ReactNode, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const inputVariants = cva(
  'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-base placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors dark:bg-slate-900 dark:text-white dark:placeholder:text-gray-500',
  {
    variants: {
      state: {
        default: 'border-gray-300 dark:border-gray-600',
        error: 'border-red-500 dark:border-red-600 focus-visible:ring-red-500',
        success: 'border-green-500 dark:border-green-600 focus-visible:ring-green-500',
        warning: 'border-yellow-500 dark:border-yellow-600 focus-visible:ring-yellow-500',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  warning?: string;
  helperText?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      state,
      label,
      error,
      success,
      warning,
      helperText,
      icon,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputState = error ? 'error' : success ? 'success' : warning ? 'warning' : 'default';

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            disabled={disabled}
            className={cn(inputVariants({ state: inputState }), className)}
            {...props}
          />
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          {inputState === 'error' && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
          {inputState === 'success' && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {success}
          </p>
        )}
        {warning && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            {warning}
          </p>
        )}
        {helperText && !error && !success && !warning && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
