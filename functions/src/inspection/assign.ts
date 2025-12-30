import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const assignEvaluator = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Body only: Firebase Functions v2 onRequest는 경로 파라미터를 자동 파싱하지 않음
    const inspectionId = req.body.inspection_id;

    if (!inspectionId) {
      res.status(400).json({ error: 'inspection_id is required in request body' });
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

    if (inspectionData.status !== 'pending') {
      res.status(400).json({ error: 'Inspection is not in pending status' });
      return;
    }

    // TODO: 실제 평가사 배정 로직 구현
    // 현재는 Mock 평가사 배정
    // 향후: 지역 기반 또는 부하 분산 기반 배정 로직 추가
    const mockEvaluatorId = 'eval-001'; // Mock 평가사 ID

    // 평가사 배정 정보 업데이트
    await inspectionRef.update({
      evaluatorId: mockEvaluatorId,
      status: 'assigned',
      assignedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      evaluator_id: mockEvaluatorId,
      message: '평가사가 배정되었습니다.',
    });
  } catch (error: any) {
    console.error('Assign Evaluator Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

