import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const changeSaleMethod = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Body only: Firebase Functions v2 onRequest는 경로 파라미터를 자동 파싱하지 않음
    const vehicleId = req.body.vehicle_id;
    const { auction_settings } = req.body;

    if (!vehicleId || !auction_settings) {
      res.status(400).json({ error: 'vehicle_id and auction_settings are required' });
      return;
    }

    const { start_price, buy_now_price } = auction_settings;

    if (!start_price) {
      res.status(400).json({ error: 'start_price is required' });
      return;
    }

    // Firestore에서 차량 상태 업데이트 및 경매 생성
    const vehicleRef = db.collection('vehicles').doc(vehicleId);
    const vehicleDoc = await vehicleRef.get();

    if (!vehicleDoc.exists) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    // 경매 생성
    const auctionRef = db.collection('auctions').doc();
    await auctionRef.set({
      vehicleId,
      startPrice: start_price,
      buyNowPrice: buy_now_price || null,
      currentHighestBid: null,
      status: 'Active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      vehicleOwnerId: vehicleDoc.data()?.ownerId || null, // 차량 소유자 ID 추가
    });

    // 차량 상태 업데이트
    await vehicleRef.update({
      status: 'bidding',
      auctionId: auctionRef.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      auction_id: auctionRef.id,
    });
  } catch (error: any) {
    console.error('Change Sale Method Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

