/**
 * 주소 수정 API
 */

import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

const VALID_ADDRESS_TYPES = ['HOME', 'WORK', 'DEALER'] as const;

export const updateAddress = async (req: Request, res: Response) => {
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { address_id: addressId, addressId: addressIdAlt, ...updates } = req.body || {};

    const id = addressId ?? addressIdAlt;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'address_id (or addressId) is required' });
      return;
    }

    const ref = db.collection('addresses').doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Address not found' });
      return;
    }

    const allowed = [
      'address_type',
      'postal_code',
      'address1',
      'address2',
      'is_default',
    ] as const;
    const updateData: Record<string, unknown> = {
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        if (key === 'address_type' && !VALID_ADDRESS_TYPES.includes(updates[key])) {
          res.status(400).json({ error: 'address_type must be HOME, WORK, or DEALER' });
          return;
        }
        if (key === 'is_default') {
          updateData[key] = Boolean(updates[key]);
        } else {
          updateData[key] = updates[key];
        }
      }
    }

    await ref.update(updateData);

    const updated = await ref.get();
    const d = updated.data()!;
    const toDate = (v: unknown) => (v && typeof (v as any).toDate === 'function' ? (v as any).toDate() : v);

    res.status(200).json({
      success: true,
      address: {
        id: updated.id,
        ...d,
        ...updateData,
        created_at: toDate(d.created_at),
        updated_at: toDate(d.updated_at),
      },
    });
  } catch (error: any) {
    console.error('UpdateAddress Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
