/**
 * 주소 목록 조회 API (user_id 기준)
 */

import { Request, Response } from 'express';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const listAddresses = async (req: Request, res: Response) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const userId =
      (req.method === 'GET' ? req.query.user_id : req.body?.user_id) as string | undefined;

    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'user_id is required' });
      return;
    }

    const snapshot = await db
      .collection('addresses')
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();

    const toDate = (v: unknown) => (v && typeof (v as any).toDate === 'function' ? (v as any).toDate() : v);

    const addresses = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        ...d,
        created_at: toDate(d.created_at),
        updated_at: toDate(d.updated_at),
      };
    });

    res.status(200).json({ success: true, addresses });
  } catch (error: any) {
    console.error('ListAddresses Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
