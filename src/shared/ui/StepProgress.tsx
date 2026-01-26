/**
 * StepProgress Component
 * 가로형 스텝 진행 표시
 * 
 * 디자인: design/design_component/검차단계 프로그래스바.svg
 */

import { Check } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface StepProgressProps {
  steps: Step[];
  className?: string;
}

export const StepProgress = ({ steps, className = '' }: StepProgressProps) => {
  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-[27px] h-[27px] rounded-full
                flex items-center justify-center
                transition-base
                ${
                  step.status === 'completed'
                    ? 'bg-primary'
                    : step.status === 'current'
                    ? 'bg-white border-2 border-primary'
                    : 'bg-white border-2 border-gray-300'
                }
              `}
            >
              {step.status === 'completed' ? (
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              ) : step.status === 'current' ? (
                <div className="w-2 h-2 rounded-full bg-primary" />
              ) : (
                <span className="text-caption text-gray-400">{index + 1}</span>
              )}
            </div>
            
            {/* Step Label */}
            <span
              className={`
                mt-2 text-caption font-medium
                ${
                  step.status === 'completed' || step.status === 'current'
                    ? 'text-primary'
                    : 'text-gray-400'
                }
              `}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`
                flex-1 h-[2px] mx-4
                ${step.status === 'completed' ? 'bg-primary' : 'bg-gray-300'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
};
