/**
 * 주문 상태 업데이트 API
 * status만 업데이트.
 */

import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;

export const updateOrderStatus = async (req: Request, res: Response) => {
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { order_id: orderId, orderId: orderIdAlt, status } = req.body || {};

    const id = orderId ?? orderIdAlt;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'order_id (or orderId) is required' });
      return;
    }

    if (!status || typeof status !== 'string') {
      res.status(400).json({ error: 'status is required' });
      return;
    }

    if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      res.status(400).json({
        error: 'status must be one of: PENDING, CONFIRMED, CANCELLED, COMPLETED',
      });
      return;
    }

    const orderRef = db.collection('orders').doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await orderRef.update({
      status,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updated = await orderRef.get();
    const data = updated.data()!;

    res.status(200).json({
      success: true,
      order: {
        id: updated.id,
        ...data,
        created_at: data.created_at?.toDate?.() ?? data.created_at,
        updated_at: data.updated_at?.toDate?.() ?? data.updated_at,
      },
    });
  } catch (error: any) {
    console.error('UpdateOrderStatus Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
