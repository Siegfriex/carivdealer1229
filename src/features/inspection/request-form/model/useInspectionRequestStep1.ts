/**
 * useInspectionRequestStep1 Hook
 * 검차 신청 Step1 폼 상태 및 제출 로직.
 * SSOT: docs/figmaMCP/mcp_outputs/1033-4903
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface InspectionRequestStep1FormState {
  vehicleSearch: string;
  preferredDate: string;
  preferredTime: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  defaultAddress: boolean;
}

const initialFormState: InspectionRequestStep1FormState = {
  vehicleSearch: '',
  preferredDate: '',
  preferredTime: '',
  zipCode: '',
  address: '',
  addressDetail: '',
  defaultAddress: false,
};

export interface UseInspectionRequestStep1Options {
  skipRequired?: boolean;
  onValidationError?: (message: string) => void;
  /** 호출 시점: 유효성 통과 후, navigate 직전 */
  onBeforeNavigate?: () => void;
}

/**
 * 검차 신청 Step1 폼 상태·핸들러 훅
 * @returns form state, setters, handleSubmit (navigate to /inspections)
 */
export const useInspectionRequestStep1 = (options: UseInspectionRequestStep1Options = {}) => {
  const { skipRequired = false, onValidationError, onBeforeNavigate } = options;
  const navigate = useNavigate();

  const [form, setForm] = useState<InspectionRequestStep1FormState>(initialFormState);

  const setVehicleSearch = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, vehicleSearch: value }));
  }, []);
  const setPreferredDate = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, preferredDate: value }));
  }, []);
  const setPreferredTime = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, preferredTime: value }));
  }, []);
  const setZipCode = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, zipCode: value }));
  }, []);
  const setAddress = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, address: value }));
  }, []);
  const setAddressDetail = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, addressDetail: value }));
  }, []);
  const setDefaultAddress = useCallback((value: boolean) => {
    setForm((prev) => ({ ...prev, defaultAddress: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!skipRequired && (!form.preferredDate || !form.preferredTime || !form.address)) {
      onValidationError?.('필수 항목을 입력해주세요.');
      return;
    }
    onBeforeNavigate?.();
    navigate('/inspections');
  }, [skipRequired, form.preferredDate, form.preferredTime, form.address, navigate, onValidationError, onBeforeNavigate]);

  return {
    form,
    setVehicleSearch,
    setPreferredDate,
    setPreferredTime,
    setZipCode,
    setAddress,
    setAddressDetail,
    setDefaultAddress,
    handleSubmit,
  };
};
