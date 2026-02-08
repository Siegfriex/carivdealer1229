/**
 * Input Component
 * 기본 입력 컴포넌트
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className = '', ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';
    const errorClass = error ? 'border-error focus:border-error focus:ring-error' : 'border-gray-300 focus:border-primary focus:ring-primary';

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label className="block text-body font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={`
            block w-full px-4 py-3 
            text-body text-gray-900 
            border rounded-md 
            focus:outline-none focus:ring-2 focus:ring-opacity-50 
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-base
            ${errorClass}
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <div className="mt-2 flex items-center text-caption text-error">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div className="mt-2 text-caption text-gray-600">{helperText}</div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
