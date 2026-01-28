/**
 * 리뷰 생성 API
 */

import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const createReview = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      order_id: orderId,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      rating,
      content,
      platform_id: platformId,
    } = req.body || {};

    if (!orderId || typeof orderId !== 'string') {
      res.status(400).json({ error: 'order_id is required' });
      return;
    }
    if (!reviewerId || typeof reviewerId !== 'string') {
      res.status(400).json({ error: 'reviewer_id is required' });
      return;
    }
    if (!revieweeId || typeof revieweeId !== 'string') {
      res.status(400).json({ error: 'reviewee_id is required' });
      return;
    }
    if (rating == null || typeof rating !== 'number' || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'rating must be a number between 1 and 5' });
      return;
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = db.collection('reviews').doc();

    const data = {
      platform_id: platformId || null,
      order_id: orderId,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      rating,
      content: content || null,
      created_at: now,
      updated_at: now,
    };

    await ref.set({ id: ref.id, ...data });

    res.status(201).json({
      success: true,
      review: { id: ref.id, ...data, created_at: new Date(), updated_at: new Date() },
    });
  } catch (error: any) {
    console.error('CreateReview Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
