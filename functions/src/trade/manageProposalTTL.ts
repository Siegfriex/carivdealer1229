import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * 제안 유효기간 관리 및 만료 처리
 * 매일 자정에 실행되는 Scheduled Function
 */
export const manageProposalTTL = onSchedule(
  {
    schedule: '0 0 * * *', // 매일 자정 (UTC)
    timeZone: 'Asia/Seoul',
    region: 'asia-northeast3',
  },
  async (event) => {
    try {
      const now = admin.firestore.Timestamp.now();
      
      // 만료된 제안 조회
      const expiredTradesQuery = db.collection('trades')
        .where('status', '==', 'pending')
        .where('expiresAt', '<=', now);

      const expiredTradesSnapshot = await expiredTradesQuery.get();

      if (expiredTradesSnapshot.empty) {
        console.log('No expired proposals found');
        return;
      }

      const batch = db.batch();
      let expiredCount = 0;

      expiredTradesSnapshot.forEach((doc) => {
        batch.update(doc.ref, {
          status: 'expired',
          expiredAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        expiredCount++;
      });

      await batch.commit();
      console.log(`Expired ${expiredCount} proposals`);
    } catch (error: any) {
      console.error('Manage Proposal TTL Error:', error);
      throw error;
    }
  }
);

