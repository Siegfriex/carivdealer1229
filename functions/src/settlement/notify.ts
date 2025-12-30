import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * API-0604: 정산 완료 알림 발송
 */
export const notifySettlement = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Body only: Firebase Functions v2 onRequest는 경로 파라미터를 자동 파싱하지 않음
    const settlementId = req.body.settlement_id;

    if (!settlementId) {
      res.status(400).json({ error: 'settlement_id is required' });
      return;
    }

    // 정산 정보 조회
    const settlementRef = db.collection('settlements').doc(settlementId);
    const settlementDoc = await settlementRef.get();

    if (!settlementDoc.exists) {
      res.status(404).json({ error: 'Settlement not found' });
      return;
    }

    const settlementData = settlementDoc.data()!;

    // 딜러 정보 조회
    const dealerRef = db.collection('members').doc(settlementData.dealerId);
    const dealerDoc = await dealerRef.get();

    if (!dealerDoc.exists) {
      res.status(404).json({ error: 'Dealer not found' });
      return;
    }

    const dealerData = dealerDoc.data()!;

    // TODO: Firebase Cloud Messaging 또는 이메일로 알림 발송
    // 현재는 Mock 알림 처리
    const notificationId = `notif-${Date.now()}`;

    // 알림 발송 로그 저장 (선택 사항)
    // await db.collection('notifications').doc(notificationId).set({
    //   settlementId,
    //   dealerId: settlementData.dealerId,
    //   type: 'settlement_completed',
    //   sentAt: admin.firestore.FieldValue.serverTimestamp(),
    // });

    res.status(200).json({
      success: true,
      notification_id: notificationId,
      message: '정산 완료 알림이 발송되었습니다.',
    });
  } catch (error: any) {
    console.error('Notify Settlement Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

