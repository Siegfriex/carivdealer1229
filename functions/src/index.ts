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
import { createOrder } from './order/createOrder';
import { getOrder } from './order/getOrder';
import { updateOrderStatus } from './order/updateOrderStatus';
import { createPayment } from './payment/createPayment';
import { getPayment } from './payment/getPayment';
import { refundPayment } from './payment/refundPayment';
import { createAddress } from './address/createAddress';
import { getAddress } from './address/getAddress';
import { listAddresses } from './address/listAddresses';
import { updateAddress } from './address/updateAddress';
import { deleteAddress } from './address/deleteAddress';
import { createReview } from './review/createReview';
import { listReviews } from './review/listReviews';
import { uploadDoc } from './seller_docs/uploadDoc';
import { approveDoc } from './seller_docs/approveDoc';
import { listDocs } from './seller_docs/listDocs';

// 전역 옵션 설정: 리전을 asia-northeast3로 설정
// 통합 런타임 서비스 계정 사용 (Secret Manager 접근 권한 포함)
setGlobalOptions({
  region: 'asia-northeast3',
  serviceAccount: 'cloud-runtime-unified@carivdealer.iam.gserviceaccount.com',
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

// API-0400: 주문 생성
export const createOrderAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, createOrder);

// API-0401: 주문 단건 조회
export const getOrderAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, getOrder);

// API-0402: 주문 상태 업데이트
export const updateOrderStatusAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, updateOrderStatus);

// API-0500: 결제 생성
export const createPaymentAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, createPayment);

// API-0501: 결제 단건 조회
export const getPaymentAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, getPayment);

// API-0502: 결제 환불
export const refundPaymentAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, refundPayment);

// API-0700: 주소 생성
export const createAddressAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, createAddress);

// API-0701: 주소 단건 조회
export const getAddressAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, getAddress);

// API-0702: 주소 목록 조회 (user_id)
export const listAddressesAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, listAddresses);

// API-0703: 주소 수정
export const updateAddressAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, updateAddress);

// API-0704: 주소 삭제
export const deleteAddressAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, deleteAddress);

// API-0800: 리뷰 생성
export const createReviewAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, createReview);

// API-0801: 리뷰 목록 조회
export const listReviewsAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, listReviews);

// API-0900: 판매자 서류 업로드
export const uploadDocAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, uploadDoc);

// API-0901: 판매자 서류 승인/거절
export const approveDocAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, approveDoc);

// API-0902: 판매자 서류 목록 조회
export const listDocsAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, listDocs);