/**
 * 판매자 서류 목록 조회 API (seller_id 기준)
 */

import { Request, Response } from 'express';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const listDocs = async (req: Request, res: Response) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const sellerId =
      (req.method === 'GET' ? req.query.seller_id : req.body?.seller_id) as string | undefined;

    if (!sellerId || typeof sellerId !== 'string') {
      res.status(400).json({ error: 'seller_id is required' });
      return;
    }

    const snapshot = await db
      .collection('seller_docs')
      .where('seller_id', '==', sellerId)
      .orderBy('created_at', 'desc')
      .get();

    const toDate = (v: unknown) =>
      v && typeof (v as any).toDate === 'function' ? (v as any).toDate() : v;

    const docs = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d,
        created_at: toDate(d.created_at),
        updated_at: toDate(d.updated_at),
      };
    });

    res.status(200).json({ success: true, docs });
  } catch (error: any) {
    console.error('ListDocs Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
