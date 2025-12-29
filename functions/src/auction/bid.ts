import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const bid = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const auctionId = req.params.auction_id || req.body.auction_id;
    const { bid_amount } = req.body;

    if (!auctionId || !bid_amount) {
      res.status(400).json({ error: 'auction_id and bid_amount are required' });
      return;
    }

    // 동시성 제어를 위한 트랜잭션
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

      const currentHighestBid = auctionData.currentHighestBid || 0;
      
      if (bid_amount <= currentHighestBid) {
        throw new Error('Bid amount must be higher than current highest bid');
      }

      // 최고가 업데이트 (화면 비노출)
      transaction.update(auctionRef, {
        currentHighestBid: bid_amount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    res.status(200).json({
      success: true,
      message: '입찰이 완료되었습니다.',
    });
  } catch (error: any) {
    console.error('Bid Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

