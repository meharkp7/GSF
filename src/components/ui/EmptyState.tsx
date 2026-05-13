import { ReactNode } from 'react';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  children,
}: EmptyStateProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-center"
      role="status"
      aria-label={title}
    >
      <div className="text-gray-400 dark:text-gray-500">
        {icon || <InboxIcon className="w-12 h-12 mx-auto" />}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          {action.label}
        </button>
      )}
      {children && <div className="mt-4 w-full">{children}</div>}
    </div>
  );
};

export default EmptyState;
