/**
 * ProgressSidebar Component
 * 회원가입/차량등록 플로우 진행 표시
 *
 * 디자인: design/design_component/좌측 프로그래스바.svg
 * 너비: 256px (w-64) - 다른 Sidebar와 통일
 *
 * Props:
 * - inline: true면 fixed가 아닌 일반 flex 배치
 */

import { Check } from 'lucide-react';
import { Z_INDEX } from '@/shared/config/zIndex';
import { LAYOUT_CLASSES } from '@/shared/config/layout';

export interface ProgressStep {
  id: string;
  label: string;
  sublabels?: string[];
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressSidebarProps {
  steps: ProgressStep[];
  className?: string;
  /** true면 fixed가 아닌 일반 배치 (flex 레이아웃용) */
  inline?: boolean;
}

export const ProgressSidebar = ({ steps, className = '', inline = false }: ProgressSidebarProps) => {
  const baseClasses = `${LAYOUT_CLASSES.SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200`;
  const positionClasses = inline
    ? LAYOUT_CLASSES.CONTENT_MIN_HEIGHT
    : 'fixed left-0 top-0 bottom-0';

  return (
    <aside
      className={`${baseClasses} ${positionClasses} ${className}`}
      style={inline ? undefined : { zIndex: Z_INDEX.FIXED }}
    >
      <div className="p-8">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Step */}
            <div className="flex items-start gap-4 mb-8">
              {/* Circle */}
              <div
                className={`
                  flex items-center justify-center
                  transition-all duration-300
                  ${
                    step.status === 'completed'
                      ? 'bg-primary'
                      : step.status === 'current'
                      ? 'bg-white border-2 border-primary'
                      : 'bg-white border-2 border-gray-300'
                  }
                `}
                style={{
                  width: 'var(--progress-circle-size-vw)',
                  height: 'var(--progress-circle-size-vw)',
                  minWidth: '24px',
                  minHeight: '24px',
                  borderRadius: '50%',
                }}
              >
                {step.status === 'completed' ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : step.status === 'current' ? (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                ) : (
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                )}
              </div>

              {/* Label */}
              <div className="flex-1">
                <p
                  className={`
                    text-body font-medium mb-1
                    ${
                      step.status === 'completed' || step.status === 'current'
                        ? 'text-primary'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </p>
                
                {step.sublabels && (
                  <div className="space-y-1">
                    {step.sublabels.map((sublabel, i) => (
                      <p
                        key={i}
                        className={`
                          text-caption
                          ${step.status === 'upcoming' ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        {sublabel}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  absolute left-[13px] w-[2px] h-8
                  ${step.status === 'completed' ? 'bg-primary' : 'bg-gray-300'}
                `}
                style={{ top: '30px' }}
              />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
