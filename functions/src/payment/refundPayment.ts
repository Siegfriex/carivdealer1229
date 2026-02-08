/**
 * 결제 환불 API
 * status를 REFUNDED로 업데이트, refunded_at 설정.
 */

import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const refundPayment = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { payment_id: paymentId, paymentId: paymentIdAlt } = req.body || {};

    const id = paymentId ?? paymentIdAlt;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'payment_id (or paymentId) is required' });
      return;
    }

    const paymentRef = db.collection('payments').doc(id);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    const data = paymentDoc.data()!;
    if (data.status === 'REFUNDED') {
      res.status(400).json({ error: 'Payment is already refunded' });
      return;
    }

    if (data.status !== 'COMPLETED') {
      res.status(400).json({ error: 'Only COMPLETED payments can be refunded' });
      return;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    await paymentRef.update({
      status: 'REFUNDED',
      refunded_at: now,
      updated_at: now,
    });

    const updated = await paymentRef.get();
    const updatedData = updated.data()!;
    const toDate = (v: unknown) =>
      v && typeof (v as any).toDate === 'function' ? (v as any).toDate() : v;

    res.status(200).json({
      success: true,
      payment: {
        id: updated.id,
        ...updatedData,
        paid_at: updatedData.paid_at != null ? toDate(updatedData.paid_at) : null,
        refunded_at: toDate(updatedData.refunded_at),
        created_at: toDate(updatedData.created_at),
        updated_at: toDate(updatedData.updated_at),
      },
    });
  } catch (error: any) {
    console.error('RefundPayment Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
