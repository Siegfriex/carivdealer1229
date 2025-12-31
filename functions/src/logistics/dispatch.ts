import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

/**
 * API-0601: 배차 조율 요청
 */
export const requestDispatch = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { logistics_id } = req.body;

    if (!logistics_id) {
      res.status(400).json({ error: 'logistics_id is required' });
      return;
    }

    // 탁송 정보 조회
    const logisticsRef = db.collection('logistics').doc(logistics_id);
    const logisticsDoc = await logisticsRef.get();

    if (!logisticsDoc.exists) {
      res.status(404).json({ error: 'Logistics not found' });
      return;
    }

    const logisticsData = logisticsDoc.data()!;

    if (logisticsData.status !== 'scheduled') {
      res.status(400).json({ error: 'Logistics is not in scheduled status' });
      return;
    }

    // TODO: 물류 파트너에 배차 요청 전송 (Mock 또는 외부 API)
    // 현재는 Mock 배차 요청 처리
    const mockDispatchId = `dispatch-${logistics_id}`;

    // 배차 요청 상태로 업데이트
    await logisticsRef.update({
      dispatchId: mockDispatchId,
      status: 'dispatched',
      dispatchAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      dispatch_id: mockDispatchId,
      message: '배차 요청이 전송되었습니다.',
    });
  } catch (error: any) {
    console.error('Request Dispatch Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

/**
 * API-0602: 배차 확정
 */
export const confirmDispatch = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Body only: Firebase Functions v2 onRequest는 경로 파라미터를 자동 파싱하지 않음
    const dispatchId = req.body.dispatch_id;
    const { driver_name, driver_phone } = req.body;

    if (!dispatchId) {
      res.status(400).json({ error: 'dispatch_id is required in request body' });
      return;
    }

    // 탁송 정보 조회 (dispatchId로 검색)
    const logisticsQuery = await db.collection('logistics')
      .where('dispatchId', '==', dispatchId)
      .limit(1)
      .get();

    if (logisticsQuery.empty) {
      res.status(404).json({ error: 'Dispatch not found' });
      return;
    }

    const logisticsDoc = logisticsQuery.docs[0];
    const logisticsRef = logisticsDoc.ref;

    // 배차 확정 정보 업데이트
    const updateData: any = {
      status: 'in_transit', // 배차 확정 시 운송 중 상태로 변경
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (driver_name) {
      updateData.driverName = driver_name;
    }
    if (driver_phone) {
      updateData.driverPhone = driver_phone;
    }

    await logisticsRef.update(updateData);

    res.status(200).json({
      success: true,
      message: '배차가 확정되었습니다.',
    });
  } catch (error: any) {
    console.error('Confirm Dispatch Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

