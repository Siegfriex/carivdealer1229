import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search as SearchIcon, Filter, Car, Edit2, Trash2, Eye } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface Vehicle {
  id: string;
  status: 'draft' | 'inspection' | 'bidding' | 'sold' | 'pending_settlement' | 'active_sale';
  plateNumber: string;
  modelName: string;
  manufacturer: string;
  modelYear: string;
  mileage: string;
  price?: string;
  thumbnailUrl?: string;
  updatedAt: string;
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
      
      // 임시 Mock 데이터
      const mockData: Vehicle[] = [
        { id: 'v-101', status: 'bidding', plateNumber: '82가 1923', manufacturer: 'Hyundai', modelName: 'Porter II Diesel', modelYear: '2018', mileage: '13.6', price: '550', updatedAt: '2024-05-20' },
        { id: 'v-102', status: 'inspection', plateNumber: '55라 5555', manufacturer: 'Hyundai', modelName: 'Grandeur IG', modelYear: '2019', mileage: '8.2', updatedAt: '2024-05-19' },
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
    draft: '초안',
    inspection: '검차중',
    bidding: '경매중',
    active_sale: '판매중',
    sold: '판매완료',
    pending_settlement: '정산대기',
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    inspection: 'bg-blue-100 text-blue-700',
    bidding: 'bg-purple-100 text-purple-700',
    active_sale: 'bg-green-100 text-green-700',
    sold: 'bg-gray-200 text-gray-800',
    pending_settlement: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('SCR-0100')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
          </button>
          <h1 className="text-lg font-bold text-fmax-text-main">차량 목록</h1>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg p-4 space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="차량번호, 모델명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-fmax-border rounded-lg focus:outline-none focus:border-fmax-primary"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {['all', 'draft', 'inspection', 'bidding', 'active_sale', 'sold'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filterStatus === status
                      ? 'bg-fmax-primary text-white'
                      : 'bg-fmax-surface text-fmax-text-sub hover:bg-fmax-border'
                  }`}
                >
                  {status === 'all' ? '전체' : statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle List */}
          {loading ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">로딩 중...</div>
          ) : filteredVehicles.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>등록된 차량이 없습니다</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg p-4 border border-fmax-border hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {vehicle.thumbnailUrl ? (
                        <img src={vehicle.thumbnailUrl} alt={vehicle.modelName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Car className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-fmax-text-main">{vehicle.plateNumber}</h3>
                          <p className="text-sm text-gray-600">{vehicle.manufacturer} {vehicle.modelName}</p>
                          <p className="text-xs text-gray-400">{vehicle.modelYear}년식 · {vehicle.mileage}만km</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[vehicle.status]}`}>
                          {statusLabels[vehicle.status]}
                        </span>
                      </div>
                      {vehicle.price && (
                        <p className="text-sm font-bold text-fmax-primary">{vehicle.price}만원</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onNavigate('SCR-0200', vehicle.id)}
                        className="p-2 hover:bg-fmax-surface rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onNavigate('SCR-0300', vehicle.id)}
                        className="p-2 hover:bg-fmax-surface rounded-lg transition-colors"
                        title="상세보기"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VehicleListPage;

