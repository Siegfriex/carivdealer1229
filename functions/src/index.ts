import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { ocrRegistration } from './vehicle/ocrRegistration';
import { verifyBusiness } from './member/verifyBusiness';
import { inspectionRequest } from './vehicle/inspection';
import { assignEvaluator } from './inspection/assign';
import { uploadResult } from './inspection/uploadResult';
import { getResult } from './inspection/getResult';
import { changeSaleMethod } from './trade/changeSaleMethod';
import { acceptProposal } from './trade/acceptProposal';
import { manageProposalTTL } from './trade/manageProposalTTL';
import { schedule } from './logistics/schedule';
import { requestDispatch, confirmDispatch } from './logistics/dispatch';
import { approveHandover } from './logistics/handover';
import { notifySettlement } from './settlement/notify';
import { bid } from './auction/bid';
import { buyNow } from './auction/buyNow';
import { saveReport } from './report/saveReport';
import { generateReport } from './report/generateReport';
import { getGoogleMapsApiKey } from './config/getGoogleMapsApiKey';

// 전역 옵션 설정: 리전을 asia-northeast3로 설정
setGlobalOptions({
  region: 'asia-northeast3',
});

// API-0100: 등록원부 OCR
export const ocrRegistrationAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
  maxInstances: 10,
  memory: '1GiB', // OCR 이미지 처리용 메모리 증가 (512MiB → 1GiB)
  timeoutSeconds: 60,
}, ocrRegistration);

// API-0002: 사업자 인증
export const verifyBusinessAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, verifyBusiness);

// API-0101: 검차 신청
export const inspectionRequestAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, inspectionRequest);

// API-0102: 평가사 배정
export const inspectionAssignAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, assignEvaluator);

// API-0103: 검차 결과 업로드
export const inspectionUploadResultAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, uploadResult);

// API-0104: 검차 결과 조회
export const inspectionGetResultAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, getResult);

// API-0300: 판매 방식 변경
export const changeSaleMethodAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, changeSaleMethod);

// API-0301: 일반 판매 제안 수락/거절
export const acceptProposalAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, acceptProposal);

// Scheduled Function: 제안 유효기간 관리
export const manageProposalTTLFunction = manageProposalTTL;

// API-0600: 탁송 일정 조율
export const logisticsScheduleAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, schedule);

// API-0601: 배차 조율 요청
export const logisticsDispatchRequestAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, requestDispatch);

// API-0602: 배차 확정
export const logisticsDispatchConfirmAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, confirmDispatch);

// API-0603: 인계 승인 (PIN 검증)
export const handoverApproveAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, approveHandover);

// API-0604: 정산 완료 알림 발송
export const settlementNotifyAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, notifySettlement);

// API-0200: 경매 입찰
export const bidAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, bid);

// API-0201: 즉시구매
export const buyNowAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, buyNow);

// API-0205: 리포트 저장
export const saveReportAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, saveReport);

// API-0206: 리포트 생성 (Gemini AI)
export const generateReportAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
  timeoutSeconds: 60, // Gemini API 호출 시간 고려
}, generateReport);

// API-0207: Google Maps API 키 조회
export const getGoogleMapsApiKeyAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, getGoogleMapsApiKey);

