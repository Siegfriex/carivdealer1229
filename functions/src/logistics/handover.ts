import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

/**
 * API-0603: 인계 승인 (PIN 검증 포함)
 */
export const approveHandover = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Body only: Firebase Functions v2 onRequest는 경로 파라미터를 자동 파싱하지 않음
    const { logistics_id: logisticsId, pin } = req.body;

    if (!logisticsId || !pin) {
      res.status(400).json({ error: 'logistics_id and pin are required in request body' });
      return;
    }

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      res.status(400).json({ error: 'PIN must be a 6-digit number' });
      return;
    }

    // 탁송 정보 조회
    const logisticsRef = db.collection('logistics').doc(logisticsId);
    const logisticsDoc = await logisticsRef.get();

    if (!logisticsDoc.exists) {
      res.status(404).json({ error: 'Logistics not found' });
      return;
    }

    const logisticsData = logisticsDoc.data()!;

    if (logisticsData.status !== 'in_transit') {
      res.status(400).json({ error: 'Logistics is not in transit status' });
      return;
    }

    // PIN 검증
    if (logisticsData.handoverPin !== pin) {
      res.status(401).json({ error: 'Invalid PIN' });
      return;
    }

    // 인계 승인 처리
    await logisticsRef.update({
      status: 'completed',
      handoverTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 차량 상태 업데이트 (정산 대기 상태로 변경)
    const vehicleRef = db.collection('vehicles').doc(logisticsData.vehicleId);
    await vehicleRef.update({
      status: 'pending_settlement',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      handover_timestamp: new Date().toISOString(),
      message: '인계 승인이 완료되었습니다.',
    });
  } catch (error: any) {
    console.error('Approve Handover Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

