/**
 * 주소 단건 조회 API
 */

import { Request, Response } from 'express';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const getAddress = async (req: Request, res: Response) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const addressId =
      (req.method === 'GET' ? req.query.addressId : req.body?.addressId) as string | undefined;

    if (!addressId || typeof addressId !== 'string') {
      res.status(400).json({ error: 'addressId is required' });
      return;
    }

    const doc = await db.collection('addresses').doc(addressId).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    const d = doc.data()!;
    const toDate = (v: unknown) => (v && typeof (v as any).toDate === 'function' ? (v as any).toDate() : v);

    res.status(200).json({
      success: true,
      address: {
        id: doc.id,
        ...d,
        created_at: toDate(d.created_at),
        updated_at: toDate(d.updated_at),
      },
    });
  } catch (error: any) {
    console.error('GetAddress Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
