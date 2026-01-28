/**
 * 판매자 서류 승인/거절 API
 */

import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

const VALID_STATUSES = ['APPROVED', 'REJECTED'] as const;

export const approveDoc = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { doc_id: docId, docId: docIdAlt, status } = req.body || {};

    const id = docId ?? docIdAlt;
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'doc_id (or docId) is required' });
      return;
    }
    if (!status || !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      res.status(400).json({ error: 'status must be APPROVED or REJECTED' });
      return;
    }

    const ref = db.collection('seller_docs').doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    await ref.update({
      status,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updated = await ref.get();
    const d = updated.data()!;
    const toDate = (v: unknown) => (v && typeof (v as any).toDate === 'function' ? (v as any).toDate() : v);

    res.status(200).json({
      success: true,
      doc: {
        id: updated.id,
        ...d,
        created_at: toDate(d.created_at),
        updated_at: toDate(d.updated_at),
      },
    });
  } catch (error: any) {
    console.error('ApproveDoc Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
