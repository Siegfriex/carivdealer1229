/**
 * 모달 다이얼로그 컴포넌트
 * 배경 클릭·ESC로 닫기, 제목·크기(sm/md/lg/xl) 지원.
 * 접근성: 포커스 트랩, ESC 닫기, 닫힐 시 포커스 복원.
 */

import { useEffect, useRef, type PropsWithChildren } from 'react';
import { X } from 'lucide-react';
import { Z_INDEX } from '@/shared/config/zIndex';

/** Modal props */
interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  titleClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * 모달. 열림 시 body 스크롤 잠금, ESC·배경 클릭으로 닫기.
 * 포커스 트랩: Tab/Shift+Tab 시 모달 내부에 포커스 유지.
 * 닫힐 시 이전 포커스 복원.
 * @param props.isOpen - 표시 여부
 * @param props.onClose - 닫을 때 콜백
 * @param props.title - 상단 제목 (선택)
 * @param props.size - 최대 너비 sm/md/lg/xl (기본 md)
 * @param props.closeOnBackdropClick - 배경 클릭 시 닫기 (기본 true)
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  titleClassName,
  size = 'md',
  closeOnBackdropClick = true,
  children,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // ESC 키로 닫기, 포커스 트랩, 포커스 복원
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const modal = modalRef.current;
      if (!modal) return;
      const focusables = modal.querySelectorAll<HTMLElement>(FOCUSABLE);
      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first && last) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last && first) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    if (isOpen) {
      prevFocusRef.current = document.activeElement as HTMLElement | null;
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // 다음 틱에 첫 포커스 가능 요소로 이동
      requestAnimationFrame(() => {
        const modal = modalRef.current;
        const first = modal?.querySelector<HTMLElement>(FOCUSABLE);
        first?.focus();
      });
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      prevFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        style={{ zIndex: Z_INDEX.MODAL_BACKDROP }}
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: Z_INDEX.MODAL }}
      >
        <div
          ref={modalRef}
          className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="modal-title" className={titleClassName ?? 'text-h3 font-bold text-gray-900'}>
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                aria-label="닫기"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6 overflow-y-auto scrollbar-custom">{children}</div>
        </div>
      </div>
    </>
  );
};
