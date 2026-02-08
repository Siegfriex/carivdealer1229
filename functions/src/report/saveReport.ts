import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';
import { asyncHandler, createError } from '../middlewares/errorHandler';

const db = getFirestore();

interface SaveReportRequest {
  vehicleId: string;
  report: {
    condition: {
      exterior: string;
      interior: string;
      mechanic: string;
      frame: string;
    };
    summary?: string;
    score?: string;
    aiAnalysis?: {
      pros: string[];
      cons: string[];
      marketVerdict: string;
    };
  };
  vehicleInfo: {
    plateNumber?: string;
    vin?: string;
    manufacturer?: string;
    model?: string;
    year?: string;
    mileage?: string;
    fuelType?: string;
    registrationDate?: string;
    color?: string;
  };
}

export const saveReport = asyncHandler(async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    throw createError('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    const { vehicleId, report, vehicleInfo } = req.body as SaveReportRequest;

    // 입력값 유효성 검증
    if (!vehicleId || typeof vehicleId !== 'string' || vehicleId.trim() === '') {
      throw createError('vehicleId is required and must be a non-empty string', 400, 'VALIDATION_ERROR', { vehicleId });
    }

    if (!report || typeof report !== 'object') {
      throw createError('report is required and must be an object', 400, 'VALIDATION_ERROR');
    }

    if (!report.condition || typeof report.condition !== 'object') {
      throw createError('report.condition is required and must be an object', 400, 'VALIDATION_ERROR');
    }

    // 필수 필드 확인
    const requiredFields = ['exterior', 'interior', 'mechanic', 'frame'] as const;
    const condition = report.condition as Record<string, any>;
    const missingFields = requiredFields.filter(field => !condition[field] || typeof condition[field] !== 'string');
    if (missingFields.length > 0) {
      throw createError(`Missing required fields in condition: ${missingFields.join(', ')}`, 400, 'VALIDATION_ERROR', { missingFields });
    }

    // 리포트 컬렉션에 저장
    const reportRef = db.collection('reports').doc();
    const reportData: any = {
      id: reportRef.id,
      vehicleId,
      condition: report.condition,
      summary: report.summary || '',
      score: report.score || 'A',
      aiAnalysis: report.aiAnalysis || {
        pros: [],
        cons: [],
        marketVerdict: '평가 중',
      },
      vehicleInfo: vehicleInfo || {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      generatedBy: 'gemini-ai',
      status: 'draft', // draft, published, shared
    };

    // Firestore에 저장 (트랜잭션 사용 권장하지만 단순 저장이므로 생략)
    await reportRef.set(reportData);

    // 차량 문서에 리포트 ID 연결 (선택사항)
    try {
      const vehicleRef = db.collection('vehicles').doc(vehicleId);
      await vehicleRef.update({
        reportId: reportRef.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error: any) {
      // 차량 문서가 없어도 리포트는 저장됨
      console.warn('[SaveReport] Vehicle document not found:', vehicleId);
    }

    res.status(200).json({
      success: true,
      reportId: reportRef.id,
      message: '리포트가 저장되었습니다.',
    });
  } catch (error: any) {
    // asyncHandler가 에러를 처리하므로 여기서는 throw만 하면 됨
    throw error;
  }
});

