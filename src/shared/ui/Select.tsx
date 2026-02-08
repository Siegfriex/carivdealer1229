/**
 * Select Component
 * 선택 컴포넌트
 */

import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, fullWidth = false, className = '', ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';
    const errorClass = error
      ? 'border-error focus:border-error focus:ring-error'
      : 'border-gray-300 focus:border-primary focus:ring-primary';

    return (
      <div className={widthClass}>
        {label && (
          <label className="block text-body font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={`
              block w-full px-4 py-3 pr-10
              text-body text-gray-900
              border rounded-md
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-gray-100 disabled:cursor-not-allowed
              transition-base
              appearance-none
              ${errorClass}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          />
        </div>

        {error && <div className="mt-2 text-caption text-error">{error}</div>}
      </div>
    );
  }
);

Select.displayName = 'Select';
