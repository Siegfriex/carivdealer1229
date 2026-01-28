/**
 * 결제 단건 조회 API
 */

import { Request, Response } from 'express';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const getPayment = async (req: Request, res: Response) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const paymentId =
      (req.method === 'GET' ? req.query.paymentId : req.body?.paymentId) as string | undefined;

    if (!paymentId || typeof paymentId !== 'string') {
      res
        .status(400)
        .json({ error: 'paymentId is required (query: paymentId or body: paymentId)' });
      return;
    }

    const paymentRef = db.collection('payments').doc(paymentId);
    const paymentDoc = await paymentRef.get();

    if (!paymentDoc.exists) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    const data = paymentDoc.data()!;

    const toDate = (v: unknown) => (v && typeof (v as any).toDate === 'function' ? (v as any).toDate() : v);

    res.status(200).json({
      success: true,
      payment: {
        id: paymentDoc.id,
        ...data,
        paid_at: data.paid_at != null ? toDate(data.paid_at) : null,
        refunded_at: data.refunded_at != null ? toDate(data.refunded_at) : null,
        created_at: toDate(data.created_at),
        updated_at: toDate(data.updated_at),
      },
    });
  } catch (error: any) {
    console.error('GetPayment Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
