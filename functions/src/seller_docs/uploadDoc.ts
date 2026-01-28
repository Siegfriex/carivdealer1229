/**
 * 판매자 서류 업로드 API
 * Storage에 파일 업로드 후 seller_docs 컬렉션에 메타데이터 저장
 */

import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();
// Storage는 실제 파일 업로드 구현 시 사용 (현재는 file_url 직접 입력)

const VALID_DOC_TYPES = ['BUSINESS_LICENSE', 'DEALER_LICENSE', 'ID_CARD'] as const;

export const uploadDoc = async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { seller_id: sellerId, doc_type: docType, platform_id: platformId } = req.body || {};

    if (!sellerId || typeof sellerId !== 'string') {
      res.status(400).json({ error: 'seller_id is required' });
      return;
    }
    if (!docType || !VALID_DOC_TYPES.includes(docType as (typeof VALID_DOC_TYPES)[number])) {
      res.status(400).json({ error: 'doc_type must be BUSINESS_LICENSE, DEALER_LICENSE, or ID_CARD' });
      return;
    }

    // 파일은 multipart/form-data로 전송되어야 함 (실제 구현 시 multer 등 사용)
    // 여기서는 file_url을 직접 받는 것으로 가정 (실제 Storage 업로드는 별도 처리)
    const { file_url: fileUrl } = req.body || {};

    if (!fileUrl || typeof fileUrl !== 'string') {
      res.status(400).json({ error: 'file_url is required (or implement file upload)' });
      return;
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const ref = db.collection('seller_docs').doc();

    const data = {
      platform_id: platformId || null,
      seller_id: sellerId,
      doc_type: docType,
      file_url: fileUrl,
      status: 'PENDING',
      created_at: now,
      updated_at: now,
    };

    await ref.set({ id: ref.id, ...data });

    res.status(201).json({
      success: true,
      doc: { id: ref.id, ...data, created_at: new Date(), updated_at: new Date() },
    });
  } catch (error: any) {
    console.error('UploadDoc Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
