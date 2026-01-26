/**
 * Checkbox Component
 * 체크박스 컴포넌트
 * 
 * 디자인: design/design_component/체크박스.svg, 체크박스2.svg
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            id={props.id || props.name}
            {...props}
          />
          <label
            htmlFor={props.id || props.name}
            className={`
              flex items-center justify-center
              w-[var(--checkbox-size-vw)] h-[var(--checkbox-size-vw)]
              min-w-[12px] min-h-[12px]
              border rounded-sm
              cursor-pointer
              transition-base
              peer-checked:bg-primary peer-checked:border-primary
              peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-opacity-50
              peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
              ${error ? 'border-error' : 'border-gray-500'}
              ${className}
            `}
          >
            <Check className="h-3 w-3 text-white hidden peer-checked:block" strokeWidth={3} />
          </label>
        </div>
        
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="ml-3 text-body text-gray-900 cursor-pointer select-none"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        {error && (
          <div className="ml-8 mt-1 text-caption text-error">{error}</div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
