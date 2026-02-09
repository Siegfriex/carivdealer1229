/**
 * 메시지 모달 (제목·내용·취소/확인 버튼)
 * 확인 시 onConfirm 호출 후 닫기. variant로 스타일 분기 가능.
 */

import { Modal } from './Modal';
import { Button } from './Button';

/** MessageModal props */
export interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: 'info' | 'confirm' | 'warning';
}

/**
 * 메시지 모달. 제목·메시지·확인/취소 버튼.
 * @param props.onConfirm - 확인 클릭 시 호출 (호출 후 모달 닫힘)
 * @param props.variant - info/confirm/warning (스타일 분기)
 */
export function MessageModal({
  isOpen,
  onClose,
  title = '제목',
  message,
  placeholder = '내용을 입력해주세요.',
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  variant: _variant = 'confirm',
}: MessageModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-6">
        {message ? (
          <p className="text-body text-gray-700">{message}</p>
        ) : (
          <p className="text-body text-gray-500">{placeholder}</p>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
