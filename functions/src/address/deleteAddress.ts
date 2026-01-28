/**
 * 주소 삭제 API
 */

import { Request, Response } from 'express';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const deleteAddress = async (req: Request, res: Response) => {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const addressId =
      (req.method === 'DELETE' ? req.query.addressId : req.body?.addressId) as string | undefined;

    if (!addressId || typeof addressId !== 'string') {
      res.status(400).json({ error: 'addressId is required' });
      return;
    }

    const ref = db.collection('addresses').doc(addressId);
    const doc = await ref.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    await ref.delete();

    res.status(200).json({ success: true, message: 'Address deleted' });
  } catch (error: any) {
    console.error('DeleteAddress Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
