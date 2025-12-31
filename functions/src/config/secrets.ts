import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

// 시크릿 이름을 환경변수 이름으로 매핑
const SECRET_TO_ENV_MAP: Record<string, string> = {
  'gemini-api-key': 'GEMINI_API_KEY',
  'kotsa-public-data-api-key': 'KOTSA_PUBLIC_DATA_API_KEY',
  'google-maps-api-key': 'GOOGLE_MAPS_API_KEY',
};

export async function getSecret(secretName: string): Promise<string> {
  // 로컬 개발 환경: 환경변수 사용 (Firebase Emulator 실행 시)
  if (process.env.FUNCTIONS_EMULATOR === 'true' || process.env.NODE_ENV === 'development') {
    const envVarName = SECRET_TO_ENV_MAP[secretName];
    
    if (envVarName) {
      const envValue = process.env[envVarName];
      if (envValue) {
        console.log(`[LOCAL] Using environment variable: ${envVarName}`);
        return envValue;
      }
      console.warn(`[LOCAL] Environment variable ${envVarName} not found, falling back to Secret Manager`);
    }
  }
  
  // 프로덕션 환경: Secret Manager 사용
  try {
    const projectId = 'carivdealer';
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });
    const secretValue = version.payload?.data?.toString() || '';
    
    if (!secretValue) {
      console.error(`[SECRET] Secret ${secretName} exists but is empty`);
      throw new Error(`Secret ${secretName} is empty. Please add a secret version.`);
    }
    
    console.log(`[SECRET] Successfully retrieved secret: ${secretName}`);
    return secretValue;
  } catch (error: any) {
    // 상세한 에러 로깅
    const errorCode = error.code || 'UNKNOWN';
    const errorMessage = error.message || 'Unknown error';
    
    console.error(`[SECRET] Failed to get secret ${secretName}:`, {
      code: errorCode,
      message: errorMessage,
      details: error.details || error
    });
    
    // 에러 타입별 처리
    if (errorCode === 'NOT_FOUND' || errorCode === 5) {
      throw new Error(`Secret ${secretName} not found in Secret Manager. Please create it first.`);
    } else if (errorCode === 'PERMISSION_DENIED' || errorCode === 7) {
      throw new Error(`Permission denied accessing secret ${secretName}. Check IAM permissions.`);
    } else {
      throw new Error(`Failed to retrieve secret ${secretName}: ${errorMessage}`);
    }
  }
}

