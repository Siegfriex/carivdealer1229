/**
 * 기본 텍스트 입력 컴포넌트
 * 라벨·에러·도움말·전체 너비 옵션.
 * 접근성: label-input 연동, aria-describedby, aria-invalid.
 */

import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

/** Input props (label, error, helperText, fullWidth + input 속성) */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * 입력 필드. ref 전달 가능.
 * @param props.label - 상단 라벨
 * @param props.error - 에러 메시지·테두리
 * @param props.helperText - 하단 도움말
 * @param props.fullWidth - 너비 100%
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className = '', id: idProp, ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';
    const errorClass = error ? 'border-error focus:border-error focus:ring-error' : 'border-gray-300 focus:border-primary focus:ring-primary';
    const uid = useId();
    const id = idProp ?? uid;
    const describedBy = [error && `${id}-error`, helperText && !error && `${id}-helper`].filter(Boolean).join(' ') || undefined;

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label htmlFor={id} className="block text-body font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={id}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={`
            block w-full px-4 py-3 
            text-body text-gray-900 
            border rounded-md 
            focus:outline-none focus:ring-2 focus:ring-opacity-50 focus-visible:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-base
            ${errorClass}
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <div id={`${id}-error`} className="mt-2 flex items-center text-caption text-error" role="alert">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div id={`${id}-helper`} className="mt-2 text-caption text-gray-600">{helperText}</div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
