import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const inspectionRequest = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Body only: Firebase Functions v2 onRequest는 경로 파라미터를 자동 파싱하지 않음
    const vehicleId = req.body.vehicle_id;
    const { preferred_date, preferred_time } = req.body;

    if (!vehicleId || !preferred_date || !preferred_time) {
      res.status(400).json({ error: 'vehicle_id, preferred_date, and preferred_time are required' });
      return;
    }

    // Firestore에 검차 신청 데이터 저장
    const inspectionRef = db.collection('inspections').doc();
    await inspectionRef.set({
      id: inspectionRef.id,
      vehicleId,
      preferredDate: preferred_date,
      preferredTime: preferred_time,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 차량의 inspectionId 업데이트
    const vehicleRef = db.collection('vehicles').doc(vehicleId);
    await vehicleRef.update({
      inspectionId: inspectionRef.id,
      status: 'inspection',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      inspection_id: inspectionRef.id,
      message: '검차 신청이 완료되었습니다.',
    });
  } catch (error: any) {
    console.error('Inspection Request Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

