/**
 * 런데브(Run Dev) 활성화 여부
 * - npm run dev 시 true (import.meta.env.DEV)
 * - 배포 빌드에서도 VITE_RUN_DEV=true 로 빌드하면 DEV 스킵 등 노출
 */
export const isRunDev = (): boolean =>
  import.meta.env.DEV || import.meta.env.VITE_RUN_DEV === 'true';
