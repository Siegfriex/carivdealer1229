/**
 * 회원 엔티티 상수 (역할·상태 라벨·색상·검증 정규식)
 */

import type { MemberRole, MemberStatus } from './types';

/** 회원 역할 한글 라벨 */
export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  DEALER: '딜러',
  INSPECTOR: '평가사',
  ADMIN: '관리자',
};

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  active: '활성',
  suspended: '정지',
  withdrawn: '탈퇴',
};

export const MEMBER_STATUS_COLORS: Record<MemberStatus, string> = {
  active: '#10B981',    // Green
  suspended: '#EF4444', // Red
  withdrawn: '#909090', // Gray
};

/**
 * 비밀번호 검증 규칙
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

/**
 * 이메일 검증
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 전화번호 검증
 */
export const PHONE_REGEX = /^010-\d{4}-\d{4}$/;

/**
 * 사업자등록번호 검증
 */
export const BUSINESS_REG_NO_REGEX = /^\d{3}-\d{2}-\d{5}$/;
