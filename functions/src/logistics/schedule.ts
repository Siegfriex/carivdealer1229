import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';

const db = getFirestore();

export const schedule = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { schedule_date, schedule_time, address, vehicle_id, special_notes } = req.body;

    if (!schedule_date || !schedule_time || !address || !vehicle_id) {
      res.status(400).json({ error: 'schedule_date, schedule_time, address, and vehicle_id are required' });
      return;
    }

    // 차량 정보 확인
    const vehicleRef = db.collection('vehicles').doc(vehicle_id);
    const vehicleDoc = await vehicleRef.get();

    if (!vehicleDoc.exists) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    // 탁송 일정 저장
    const logisticsRef = db.collection('logistics').doc();
    
    // PIN 생성 (6자리 숫자)
    const handoverPin = Math.floor(100000 + Math.random() * 900000).toString();
    
    await logisticsRef.set({
      id: logisticsRef.id,
      vehicleId: vehicle_id,
      scheduleDate: schedule_date,
      scheduleTime: schedule_time,
      departureAddress: address,
      destinationAddress: '인천광역시 중구 인천항 물류센터', // 고정 도착지
      status: 'scheduled',
      specialNotes: special_notes || '',
      handoverPin: handoverPin, // 인계 승인용 PIN 저장
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      logistics_id: logisticsRef.id,
      message: '탁송 일정이 조율되었습니다.',
    });
  } catch (error: any) {
    console.error('Logistics Schedule Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

