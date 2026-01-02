import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search as SearchIcon, Filter, Car, Edit2, Trash2, Eye, FileCheck, Loader2 } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface Vehicle {
  id: string;
  status: 'draft' | 'inspection' | 'bidding' | 'sold' | 'pending_settlement' | 'active_sale' | 'inspection_complete' | 'registration_complete' | 'wonbu_writing';
  plateNumber: string;
  modelName: string;
  manufacturer: string;
  modelYear: string;
  mileage: string;
  price?: string;
  thumbnailUrl?: string;
  updatedAt: string;
  createdAt?: string; // 생성 일시
  ocrMetadata?: { // OCR 메타데이터
    extractedAt?: string;
    ocrVersion?: string;
    confidence?: number;
  };
  publicDataMetadata?: { // 공공데이터 메타데이터
    lastQueriedAt?: string;
    queryParams?: {
      registYy?: string;
      registMt?: string;
      useFuelCode?: string;
    };
  };
}

const VehicleListPage = ({ onNavigate }: { onNavigate: (screen: string, vehicleId?: string) => void }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, [filterStatus]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      // TODO: Firestore에서 실제 데이터 로드
      // const q = query(
      //   collection(db, 'vehicles'),
      //   filterStatus !== 'all' ? where('status', '==', filterStatus) : undefined,
      //   orderBy('updatedAt', 'desc')
      // );
      // const snapshot = await getDocs(q);
      // const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // 임시 Mock 데이터 (와이어프레임에 맞춘 상태)
      const mockData: Vehicle[] = [
        { id: 'v-101', status: 'inspection_complete', plateNumber: '82가 1923', manufacturer: 'Hyundai', modelName: 'Porter II Diesel', modelYear: '2018', mileage: '13.6', price: '550', updatedAt: '2024-05-20' },
        { id: 'v-102', status: 'registration_complete', plateNumber: '55라 5555', manufacturer: 'Hyundai', modelName: 'Grandeur IG', modelYear: '2019', mileage: '8.2', updatedAt: '2024-05-19' },
        { id: 'v-103', status: 'wonbu_writing', plateNumber: '12나 3456', manufacturer: 'Kia', modelName: 'Sorento', modelYear: '2020', mileage: '5.2', updatedAt: '2024-05-18' },
        { id: 'v-104', status: 'inspection_complete', plateNumber: '34다 7890', manufacturer: 'Hyundai', modelName: 'Sonata', modelYear: '2019', mileage: '7.8', updatedAt: '2024-05-17' },
      ];
      setVehicles(mockData);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesSearch = !searchQuery || 
      v.plateNumber.includes(searchQuery) || 
      v.modelName.includes(searchQuery) ||
      v.manufacturer.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const statusLabels: Record<string, string> = {
    draft: '임시저장',
    inspection: '검차중',
    inspection_complete: '검차완료',
    registration_complete: '등록완료',
    wonbu_writing: '차량 등록 원부 작성 중',
    bidding: '경매중',
    active_sale: '판매중',
    sold: '판매완료',
    pending_settlement: '정산대기',
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    inspection: 'bg-blue-100 text-blue-700',
    inspection_complete: 'bg-green-100 text-green-700',
    registration_complete: 'bg-blue-100 text-blue-700',
    wonbu_writing: 'bg-yellow-100 text-yellow-700',
    bidding: 'bg-purple-100 text-purple-700',
    active_sale: 'bg-green-100 text-green-700',
    sold: 'bg-gray-200 text-gray-800',
    pending_settlement: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with GNB */}
      <header className="bg-white border-b border-fmax-border px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="text-lg font-bold text-fmax-text-main">logo</div>
        <nav className="flex items-center gap-6 text-sm text-fmax-text-main">
          <a href="#" className="hover:text-fmax-primary">매물등록</a>
          <a href="#" className="hover:text-fmax-primary">검차</a>
          <a href="#" className="hover:text-fmax-primary">거래</a>
          <a href="#" className="hover:text-fmax-primary">진행상황</a>
          <a href="#" className="hover:text-fmax-primary">로그아웃</a>
        </nav>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-h1 text-fmax-text-main mb-2">차량등록</h1>
          <h2 className="text-h2 text-fmax-text-sub">등록매물</h2>
        </div>

        {/* Vehicle List - Card Grid */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-12 text-center text-gray-500">
            <Loader2 className="w-8 h-8 mx-auto mb-4 text-fmax-primary animate-spin" />
            로딩 중...
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-12 text-center">
            <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-fmax-text-sub">등록된 차량이 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredVehicles.map((vehicle) => {
              const canRequestInspection = vehicle.status === 'inspection_complete' || vehicle.status === 'registration_complete' || vehicle.status === 'wonbu_writing';
              
              return (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden"
                  onClick={() => onNavigate('SCR-0200', vehicle.id)}
                >
                  {/* Hover Overlay - 검차신청 버튼 */}
                  {canRequestInspection && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10 rounded-xl">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('SCR-0300-REQ', vehicle.id);
                        }}
                        className="bg-fmax-primary text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-fmax-primary-hover transition-all transform hover:scale-105"
                      >
                        검차신청
                      </button>
                    </div>
                  )}

                  <div className="flex items-start gap-6">
                    {/* Left: Vehicle Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-fmax-text-main mb-1">매물 {vehicle.id.split('-')[1]} 차량 정보</h3>
                          <div className="flex items-center gap-4 text-sm text-fmax-text-sub">
                            <span>상태: <span className="font-semibold text-fmax-text-main">{statusLabels[vehicle.status]}</span></span>
                            <span>정보: ----</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColors[vehicle.status]}`}>
                          {statusLabels[vehicle.status]}
                        </span>
                      </div>
                      
                      {/* Vehicle Details */}
                      <div className="space-y-2 text-sm text-fmax-text-sub">
                        <p><span className="font-semibold text-fmax-text-main">차량번호:</span> {vehicle.plateNumber}</p>
                        <p><span className="font-semibold text-fmax-text-main">제조사/모델:</span> {vehicle.manufacturer} {vehicle.modelName}</p>
                        <p><span className="font-semibold text-fmax-text-main">연식:</span> {vehicle.modelYear}년식</p>
                        <p><span className="font-semibold text-fmax-text-main">주행거리:</span> {vehicle.mileage}만km</p>
                        {vehicle.price && (
                          <p><span className="font-semibold text-fmax-text-main">가격:</span> {vehicle.price}만원</p>
                        )}
                      </div>

                      {/* Action Links */}
                      <div className="mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('SCR-0200', vehicle.id);
                          }}
                          className="text-fmax-primary hover:text-fmax-primary-hover text-sm font-medium underline"
                        >
                          수정
                        </button>
                      </div>
                    </div>

                    {/* Right: Vehicle Image/Placeholder */}
                    <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
                      {vehicle.thumbnailUrl ? (
                        <img src={vehicle.thumbnailUrl} alt={vehicle.modelName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Car className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                          <p className="text-xs text-gray-400">차량 이미지</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 bg-gray-900 rounded-lg px-8 py-4 flex items-center justify-end gap-4">
          <button
            onClick={() => onNavigate('SCR-0200')}
            className="px-6 py-2.5 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            임시저장
          </button>
          <button
            onClick={() => onNavigate('SCR-0200')}
            className="px-6 py-2.5 bg-fmax-primary text-white rounded-lg font-medium hover:bg-fmax-primary-hover transition-colors shadow-md"
          >
            등록하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default VehicleListPage;

