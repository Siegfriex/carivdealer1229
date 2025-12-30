import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const getResult = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Query only: GET 요청은 query string에서 파라미터 읽기
    const inspectionId = req.query.inspection_id as string;

    if (!inspectionId) {
      res.status(400).json({ error: 'inspection_id is required in query string' });
      return;
    }

    // 검차 정보 조회
    const inspectionRef = db.collection('inspections').doc(inspectionId);
    const inspectionDoc = await inspectionRef.get();

    if (!inspectionDoc.exists) {
      res.status(404).json({ error: 'Inspection not found' });
      return;
    }

    const inspectionData = inspectionDoc.data()!;

    if (!inspectionData.result) {
      res.status(404).json({ error: 'Inspection result not found' });
      return;
    }

    res.status(200).json({
      success: true,
      result: inspectionData.result,
      inspection: {
        id: inspectionId,
        vehicleId: inspectionData.vehicleId,
        status: inspectionData.status,
        preferredDate: inspectionData.preferredDate,
        preferredTime: inspectionData.preferredTime,
        evaluatorId: inspectionData.evaluatorId,
      },
    });
  } catch (error: any) {
    console.error('Get Result Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

