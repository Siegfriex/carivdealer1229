/**
 * Firebase Admin 초기화 공통 모듈
 * 모든 Functions에서 중복되는 admin.initializeApp() 호출을 제거하고
 * 일관된 초기화를 보장합니다.
 */

import * as admin from 'firebase-admin';

let initialized = false;

/**
 * Firebase Admin 앱 초기화 (1회만 실행)
 */
export function initializeFirebaseAdmin(): void {
  if (!admin.apps.length && !initialized) {
    admin.initializeApp();
    initialized = true;
  }
}

/**
 * Firestore 인스턴스 반환 (초기화 보장)
 */
export function getFirestore(): admin.firestore.Firestore {
  initializeFirebaseAdmin();
  return admin.firestore();
}

/**
 * Storage 인스턴스 반환 (초기화 보장)
 */
export function getStorage(): admin.storage.Storage {
  initializeFirebaseAdmin();
  return admin.storage();
}

/**
 * Auth 인스턴스 반환 (초기화 보장)
 */
export function getAuth(): admin.auth.Auth {
  initializeFirebaseAdmin();
  return admin.auth();
}


