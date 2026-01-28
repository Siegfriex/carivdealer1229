/**
 * 결제 생성 API
 * order_id 기준 결제 생성. order 존재 여부 확인.
 */

import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

const VALID_METHODS = ['CARD', 'BANK_TRANSFER', 'VIRTUAL_ACCOUNT', 'ESCROW'] as const;

export const createPayment = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      order_id: orderId,
      amount,
      method,
      platform_id: platformId,
      pg_provider: pgProvider,
      pg_transaction_id: pgTransactionId,
    } = req.body || {};

    if (!orderId || typeof orderId !== 'string') {
      res.status(400).json({ error: 'order_id is required' });
      return;
    }

    if (amount == null || typeof amount !== 'number' || amount < 0) {
      res.status(400).json({ error: 'amount must be a non-negative number' });
      return;
    }

    if (!method || typeof method !== 'string') {
      res.status(400).json({ error: 'method is required' });
      return;
    }

    if (!VALID_METHODS.includes(method as (typeof VALID_METHODS)[number])) {
      res.status(400).json({
        error: 'method must be one of: CARD, BANK_TRANSFER, VIRTUAL_ACCOUNT, ESCROW',
      });
      return;
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const paymentRef = db.collection('payments').doc();

    const data = {
      order_id: orderId,
      platform_id: platformId || null,
      amount,
      method,
      status: 'PENDING',
      pg_provider: pgProvider || null,
      pg_transaction_id: pgTransactionId || null,
      paid_at: null,
      refunded_at: null,
      created_at: now,
      updated_at: now,
    };

    await paymentRef.set({ id: paymentRef.id, ...data });

    res.status(201).json({
      success: true,
      payment: {
        id: paymentRef.id,
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  } catch (error: any) {
    console.error('CreatePayment Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
