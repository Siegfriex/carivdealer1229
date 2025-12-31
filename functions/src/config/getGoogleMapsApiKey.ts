import { Request, Response } from 'express';
import { getSecret } from './secrets';
import { asyncHandler, createError } from '../middlewares/errorHandler';

/**
 * Google Maps API 키를 Secret Manager에서 가져와서 반환
 * 프론트엔드에서 Google Maps를 사용하기 위해 호출
 */
export const getGoogleMapsApiKey = asyncHandler(async (req: Request, res: Response) => {
  if (req.method !== 'GET') {
    throw createError('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    // Secret Manager에서 Google Maps API 키 로드
    // Google Maps API 키는 별도로 저장하거나, Gemini API 키와 동일한 키를 사용할 수 있음
    let apiKey: string;
    try {
      // 먼저 google-maps-api-key 시크릿 시도, 없으면 gemini-api-key 사용
      try {
        apiKey = await getSecret('google-maps-api-key');
      } catch {
        // google-maps-api-key가 없으면 gemini-api-key 사용 (동일한 키를 사용하는 경우)
        apiKey = await getSecret('gemini-api-key');
      }
      
      if (!apiKey || apiKey.trim() === '') {
        throw new Error('Google Maps API key is empty or not configured');
      }
      console.log('[GetGoogleMapsApiKey] API key retrieved successfully');
    } catch (error: any) {
      console.error('[GetGoogleMapsApiKey] Failed to get API key:', {
        message: error.message,
        code: error.code,
        details: error
      });
      throw createError(
        `Google Maps API key configuration error: ${error.message}`,
        500,
        'CONFIGURATION_ERROR'
      );
    }

    res.status(200).json({
      success: true,
      apiKey: apiKey,
    });
  } catch (error: any) {
    // asyncHandler가 에러를 처리하므로 여기서는 throw만 하면 됨
    throw error;
  }
});

