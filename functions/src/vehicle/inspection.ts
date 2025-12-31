import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { getFirestore } from '../utils/firebaseAdmin';
import { asyncHandler, createError } from '../middlewares/errorHandler';

const db = getFirestore();

export const inspectionRequest = asyncHandler(async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    throw createError('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    // Body only: Firebase Functions v2 onRequest는 경로 파라미터를 자동 파싱하지 않음
    const vehicleId = req.body.vehicle_id;
    const { preferred_date, preferred_time, location } = req.body;

    if (!vehicleId || !preferred_date || !preferred_time) {
      throw createError('vehicle_id, preferred_date, and preferred_time are required', 400, 'VALIDATION_ERROR', { vehicleId, preferred_date, preferred_time });
    }

    // 위치 정보 검증 및 정리
    let locationData = null;
    if (location) {
      if (location.address && location.location && location.location.lat && location.location.lng) {
        locationData = {
          address: location.address,
          coordinates: {
            lat: location.location.lat,
            lng: location.location.lng
          }
        };
      } else if (location.address) {
        // 주소만 있는 경우 (좌표는 나중에 Geocoding으로 변환 가능)
        locationData = {
          address: location.address,
          coordinates: null
        };
      }
    }

    // Firestore에 검차 신청 데이터 저장
    const inspectionRef = db.collection('inspections').doc();
    const inspectionData: any = {
      id: inspectionRef.id,
      vehicleId,
      preferredDate: preferred_date,
      preferredTime: preferred_time,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // 위치 정보가 있으면 추가
    if (locationData) {
      inspectionData.location = locationData;
    }

    await inspectionRef.set(inspectionData);

    // 차량의 inspectionId 업데이트
    const vehicleRef = db.collection('vehicles').doc(vehicleId);
    await vehicleRef.update({
      inspectionId: inspectionRef.id,
      status: 'inspection',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      inspection_id: inspectionRef.id,
      message: '검차 신청이 완료되었습니다.',
    });
  } catch (error: any) {
    // asyncHandler가 에러를 처리하므로 여기서는 throw만 하면 됨
    throw error;
  }
});

