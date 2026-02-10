/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_API_BASE_URL?: string;
  readonly GEMINI_API_KEY?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  /** 배포 빌드에서도 DEV 스킵/런데브 기능 노출 (true 시 활성화) */
  readonly VITE_RUN_DEV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

