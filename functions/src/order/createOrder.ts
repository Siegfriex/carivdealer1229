/**
 * 주문 생성 API
 * POST body로 주문 생성. orders 컬렉션에 추가.
 */

import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

const VALID_ORDER_TYPES = ['AUCTION', 'GENERAL', 'BUY_NOW'] as const;

export const createOrder = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
      vehicle_id: vehicleId,
      order_type: orderType,
      total_price: totalPrice,
      platform_id: platformId,
    } = req.body;

    if (!listingId || !buyerId || !sellerId || !vehicleId || !orderType || totalPrice == null) {
      res.status(400).json({
        error: 'listing_id, buyer_id, seller_id, vehicle_id, order_type, total_price are required',
      });
      return;
    }

    if (!VALID_ORDER_TYPES.includes(orderType)) {
      res.status(400).json({ error: 'order_type must be AUCTION, GENERAL, or BUY_NOW' });
      return;
    }

    if (typeof totalPrice !== 'number' || totalPrice < 0) {
      res.status(400).json({ error: 'total_price must be a non-negative number' });
      return;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const orderRef = db.collection('orders').doc();

    const data = {
      platform_id: platformId || null,
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
      vehicle_id: vehicleId,
      order_type: orderType,
      total_price: totalPrice,
      status: 'PENDING',
      created_at: now,
      updated_at: now,
    };

    await orderRef.set({ id: orderRef.id, ...data });

    res.status(201).json({
      success: true,
      order: { id: orderRef.id, ...data, created_at: new Date(), updated_at: new Date() },
    });
  } catch (error: any) {
    console.error('CreateOrder Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
