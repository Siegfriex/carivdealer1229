/**
 * Firebase 초기화 및 App·Firestore·Storage·Auth export
 * 환경 변수 없으면 demo 값으로 앱이 동작하도록 optional 처리. 초기화 실패 시 콘솔 경고만 출력.
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'carivdealer',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'carivdealer.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abc123',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화 (실패 시에도 앱 동작하도록 처리)
let app!: FirebaseApp;
let db!: Firestore;
let storage!: FirebaseStorage;
let auth!: Auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase initialization failed. Running in demo mode.', error);
}

/** Firebase App 인스턴스 */
export { app, db, storage, auth };
/** Firebase App 기본 export */
export default app;
