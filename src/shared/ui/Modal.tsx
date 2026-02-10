/**
 * 모달 다이얼로그 컴포넌트
 * 배경 클릭·ESC로 닫기, 제목·크기(sm/md/lg/xl) 지원.
 */

import { useEffect, type PropsWithChildren } from 'react';
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

/**
 * 모달. 열림 시 body 스크롤 잠금, ESC·배경 클릭으로 닫기.
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
  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
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
          className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id="modal-title" className={titleClassName ?? 'text-h3 font-bold text-gray-900'}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-fast"
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
