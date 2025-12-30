import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const acceptProposal = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Body only: Firebase Functions v2 onRequest는 경로 파라미터를 자동 파싱하지 않음
    const { proposal_id: proposalId, action } = req.body; // 'accept' or 'reject'

    if (!proposalId || !action) {
      res.status(400).json({ error: 'proposal_id and action are required in request body' });
      return;
    }

    if (action !== 'accept' && action !== 'reject') {
      res.status(400).json({ error: 'action must be "accept" or "reject"' });
      return;
    }

    // 거래 정보 조회 (trades 컬렉션 또는 offers 배열에서)
    // TODO: 실제 데이터 구조에 맞게 수정 필요
    // 현재는 Mock 구조 가정: trades/{tradeId} 또는 vehicles/{vehicleId}/offers 배열

    // 거래 정보 업데이트
    const tradeRef = db.collection('trades').doc(proposalId);
    const tradeDoc = await tradeRef.get();

    if (!tradeDoc.exists) {
      res.status(404).json({ error: 'Trade proposal not found' });
      return;
    }

    const tradeData = tradeDoc.data()!;

    if (tradeData.status !== 'pending') {
      res.status(400).json({ error: 'Trade proposal is not in pending status' });
      return;
    }

    // 상태 업데이트
    const updateData: any = {
      status: action === 'accept' ? 'accepted' : 'rejected',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (action === 'accept') {
      updateData.acceptedAt = admin.firestore.FieldValue.serverTimestamp();
      
      // 차량 상태를 locked로 변경
      const vehicleRef = db.collection('vehicles').doc(tradeData.vehicleId);
      await vehicleRef.update({
        status: 'locked',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      updateData.rejectedAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await tradeRef.update(updateData);

    res.status(200).json({
      success: true,
      message: action === 'accept' ? '제안이 수락되었습니다.' : '제안이 거절되었습니다.',
    });
  } catch (error: any) {
    console.error('Accept Proposal Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

