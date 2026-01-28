/**
 * 주문 단건 조회 API
 * orderId로 단건 조회.
 */

import { Request, Response } from 'express';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const getOrder = async (req: Request, res: Response) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const orderId =
      (req.method === 'GET' ? req.query.orderId : req.body?.orderId) as string | undefined;

    if (!orderId || typeof orderId !== 'string') {
      res.status(400).json({ error: 'orderId is required (query: orderId or body: orderId)' });
      return;
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const data = orderDoc.data()!;
    res.status(200).json({
      success: true,
      order: {
        id: orderDoc.id,
        ...data,
        created_at: data.created_at?.toDate?.() ?? data.created_at,
        updated_at: data.updated_at?.toDate?.() ?? data.updated_at,
      },
    });
  } catch (error: any) {
    console.error('GetOrder Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
