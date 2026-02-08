/**
 * 주소 생성 API
 */

import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

const VALID_ADDRESS_TYPES = ['HOME', 'WORK', 'DEALER'] as const;

export const createAddress = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      user_id: userId,
      address_type: addressType,
      postal_code: postalCode,
      address1,
      address2,
      is_default: isDefault,
      platform_id: platformId,
    } = req.body || {};

    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'user_id is required' });
      return;
    }
    if (!addressType || !VALID_ADDRESS_TYPES.includes(addressType as (typeof VALID_ADDRESS_TYPES)[number])) {
      res.status(400).json({ error: 'address_type must be HOME, WORK, or DEALER' });
      return;
    }
    if (!postalCode || typeof postalCode !== 'string') {
      res.status(400).json({ error: 'postal_code is required' });
      return;
    }
    if (!address1 || typeof address1 !== 'string') {
      res.status(400).json({ error: 'address1 is required' });
      return;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = db.collection('addresses').doc();

    const data = {
      platform_id: platformId || null,
      user_id: userId,
      address_type: addressType,
      postal_code: postalCode,
      address1,
      address2: address2 ?? null,
      is_default: Boolean(isDefault),
      created_at: now,
      updated_at: now,
    };

    await ref.set({ id: ref.id, ...data });

    res.status(201).json({
      success: true,
      address: { id: ref.id, ...data, created_at: new Date(), updated_at: new Date() },
    });
  } catch (error: any) {
    console.error('CreateAddress Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
