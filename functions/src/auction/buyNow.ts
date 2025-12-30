import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const buyNow = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Body only: Firebase Functions v2 onRequest는 경로 파라미터를 자동 파싱하지 않음
    const auctionId = req.body.auction_id;

    if (!auctionId) {
      res.status(400).json({ error: 'auction_id is required' });
      return;
    }

    // 원자성 보장을 위한 트랜잭션
    await db.runTransaction(async (transaction) => {
      const auctionRef = db.collection('auctions').doc(auctionId);
      const auctionDoc = await transaction.get(auctionRef);

      if (!auctionDoc.exists) {
        throw new Error('Auction not found');
      }

      const auctionData = auctionDoc.data()!;
      
      if (auctionData.status !== 'Active') {
        throw new Error('Auction is not active');
      }

      if (!auctionData.buyNowPrice) {
        throw new Error('Buy now price is not set');
      }

      // 경매 종료 처리
      transaction.update(auctionRef, {
        status: 'Sold',
        currentHighestBid: auctionData.buyNowPrice,
        endedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 차량 상태 업데이트
      const vehicleRef = db.collection('vehicles').doc(auctionData.vehicleId);
      transaction.update(vehicleRef, {
        status: 'locked',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    res.status(200).json({
      success: true,
      contract_id: `contract-${Date.now()}`,
      message: '즉시구매가 완료되었습니다.',
    });
  } catch (error: any) {
    console.error('Buy Now Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

