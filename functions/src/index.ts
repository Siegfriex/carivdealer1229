import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { ocrRegistration } from './vehicle/ocrRegistration';
import { verifyBusiness } from './member/verifyBusiness';
import { inspectionRequest } from './vehicle/inspection';
import { changeSaleMethod } from './trade/changeSaleMethod';
import { bid } from './auction/bid';
import { buyNow } from './auction/buyNow';

// 전역 옵션 설정: 리전을 asia-northeast3로 설정
setGlobalOptions({
  region: 'asia-northeast3',
});

// API-0100: 등록원부 OCR
export const ocrRegistrationAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
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

// API-0300: 판매 방식 변경
export const changeSaleMethodAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, changeSaleMethod);

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

