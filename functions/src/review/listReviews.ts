/**
 * 리뷰 목록 조회 API (order_id 또는 reviewee_id 기준)
 */

import { Request, Response } from 'express';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const listReviews = async (req: Request, res: Response) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const query = req.method === 'GET' ? req.query : req.body || {};
    const { order_id: orderId, reviewee_id: revieweeId } = query;

    if (!orderId && !revieweeId) {
      res.status(400).json({ error: 'order_id or reviewee_id is required' });
      return;
    }

    let snapshot;
    if (orderId) {
      snapshot = await db
        .collection('reviews')
        .where('order_id', '==', orderId)
        .orderBy('created_at', 'desc')
        .get();
    } else {
      snapshot = await db
        .collection('reviews')
        .where('reviewee_id', '==', revieweeId)
        .orderBy('created_at', 'desc')
        .get();
    }

    const toDate = (v: unknown) =>
      v && typeof (v as any).toDate === 'function' ? (v as any).toDate() : v;

    const reviews = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d,
        created_at: toDate(d.created_at),
        updated_at: toDate(d.updated_at),
      };
    });

    res.status(200).json({ success: true, reviews });
  } catch (error: any) {
    console.error('ListReviews Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
