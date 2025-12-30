import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  Zap, 
  LayoutDashboard, 
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Truck,
  FileText,
  LogIn,
  Menu,
  X,
  Percent,
  ScanEye,
  Gavel,
  Container,
  Check,
  Mail,
  Lock,
  AlertCircle,
  Upload,
  Building,
  User,
  MapPin,
  Loader2,
  Briefcase,
  RefreshCw,
  Keyboard,
  Car,
  Calendar,
  Fuel,
  Hash,
  ArrowLeft,
  Save,
  ImageIcon,
  Search as SearchIcon,
  ExternalLink,
  MoreHorizontal,
  Edit2,
  Trash2,
  Clock,
  Eye,
  AlertTriangle,
  Map,
  Navigation,
  CheckCircle2,
  PlayCircle,
  Download,
  Share2,
  Printer,
  ChevronDown,
  Activity,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  CreditCard,
  ShoppingBag,
  Megaphone,
  Gauge,
  Armchair,
  Filter,
  XCircle,
  CalendarDays,
  Plus,
  Timer
} from "lucide-react";
import { apiClient } from './src/services/api';
import { GeminiService } from './src/services/gemini';
import VehicleListPage from './src/components/VehicleListPage';
import GeneralSaleOffersPage from './src/components/GeneralSaleOffersPage';
import SalesHistoryPage from './src/components/SalesHistoryPage';
import SettlementListPage from './src/components/SettlementListPage';
import SettlementDetailPage from './src/components/SettlementDetailPage';
import LogisticsSchedulePage from './src/components/LogisticsSchedulePage';
import LogisticsHistoryPage from './src/components/LogisticsHistoryPage';

// --- Types & Constants ---

type Screen = 
  | 'SCR-0000' // Landing
  | 'SCR-0001' // Login
  | 'SCR-0002' // Signup Entry (Terms)
  | 'SCR-0002-1' // Signup Terms
  | 'SCR-0002-2' // Signup Info
  | 'SCR-0003-1' // Approval Pending
  | 'SCR-0003-2' // Approval Complete
  | 'SCR-0100' // Dashboard (Main)
  | 'SCR-0101' // Vehicle List
  | 'SCR-0102' // General Sale Offers
  | 'SCR-0103' // Sales History
  | 'SCR-0104' // Settlement List
  | 'SCR-0105' // Settlement Detail
  | 'SCR-0200' // Register Vehicle
  | 'SCR-0200-Draft' // Vehicle List (Drafts)
  | 'SCR-0201' // Inspection Request
  | 'SCR-0201-Progress' // Inspection Status
  | 'SCR-0202' // Inspection Report
  | 'SCR-0300' // Sales Method Selection
  | 'SCR-0301-N' // General Sale - Analyzing
  | 'SCR-0302-N' // General Sale - Price Setting
  | 'SCR-0303-N' // General Sale - Complete
  | 'SCR-0400' // Auction Detail (Existing)
  | 'SCR-0401-A' // Auction Sale - Start Price
  | 'SCR-0402-A' // Auction Sale - Duration
  | 'SCR-0403-A' // Auction Sale - Buy Now & Complete
  | 'SCR-0600' // Logistics Schedule
  | 'SCR-0601' // Logistics History
  ;

interface Offer {
  id: string;
  bidderName: string; // Masked
  amount: string;
  date: string;
  isHighest?: boolean;
}

interface Vehicle {
  id: string;
  status: 'draft' | 'inspection' | 'bidding' | 'sold' | 'pending_settlement' | 'active_sale'; // Added active_sale
  plateNumber: string;
  modelName: string;
  manufacturer: string;
  modelYear: string;
  mileage: string;
  price: string; // My Offer / Final Price
  highestBid?: string; // Market High Bid
  thumbnailUrl?: string;
  updatedAt: string;
  createdAt?: string; // 생성 일시
  fuelType?: string;
  registrationDate?: string;
  color?: string;
  vin?: string;
  inspectionId?: string;
  location?: string;
  endTime?: string; // For countdown
  offers?: Offer[]; // Added offers
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

interface InspectionReport {
  id: string;
  vehicleId: string;
  evaluator: {
    name: string;
    id: string;
    rating: number;
    phone: string;
  };
  summary: string; // Gemini-3-pro generated
  media: {
    category: string;
    count: number;
    items: { type: 'image' | 'video', url: string, label: string }[];
  }[];
  condition: {
    exterior: string;
    interior: string;
    mechanic: string;
    frame: string;
  };
  score: string;
  aiAnalysis: {
    pros: string[];
    cons: string[];
    marketVerdict: string;
  };
}

// Persistent Mock Data (Updated to match reference & spec)
const MOCK_VEHICLES: Vehicle[] = [
  { 
    id: "v-101", status: "bidding", plateNumber: "82가 1923", manufacturer: "Hyundai", modelName: "Porter II Diesel", modelYear: "2018", 
    mileage: "13.6", price: "550", highestBid: "620", location: "Daegu", 
    thumbnailUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Porter+II", updatedAt: "2024-05-20", endTime: "16:03:30",
    offers: [
      { id: "o-1", bidderName: "Mohammad A.", amount: "620", date: "2025.05.20", isHighest: true },
      { id: "o-2", bidderName: "Sergey K.", amount: "590", date: "2025.05.19" },
      { id: "o-3", bidderName: "Abdul R.", amount: "550", date: "2025.05.19" }
    ]
  },
  { 
    id: "v-102", status: "bidding", plateNumber: "91나 8821", manufacturer: "Hyundai", modelName: "Porter II Cargo Super Cab", modelYear: "2018", 
    mileage: "10.7", price: "650", highestBid: "680", location: "Daegu", 
    thumbnailUrl: "https://placehold.co/600x400/f1f5f9/475569?text=Porter+Cargo", updatedAt: "2024-05-20", endTime: "13:44:18",
    offers: []
  },
  { 
    id: "v-103", status: "bidding", plateNumber: "88다 1234", manufacturer: "Kia", modelName: "Bongo III 1T Freezer", modelYear: "2018", 
    mileage: "14.5", price: "550", highestBid: "-", location: "Chungbuk", 
    thumbnailUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Bongo+Freezer", updatedAt: "2024-05-20", endTime: "13:02:57",
    offers: []
  },
  { 
    id: "v-104", status: "inspection", plateNumber: "55라 5555", manufacturer: "Hyundai", modelName: "Grandeur IG", modelYear: "2019", 
    mileage: "8.2", price: "-", location: "Seoul", 
    thumbnailUrl: "https://placehold.co/600x400/1e293b/ffffff?text=Grandeur", updatedAt: "2024-05-19",
    offers: []
  },
  { 
    id: "v-105", status: "inspection", plateNumber: "11마 1111", manufacturer: "Genesis", modelName: "G80", modelYear: "2021", 
    mileage: "4.5", price: "-", location: "Busan", 
    thumbnailUrl: "https://placehold.co/600x400/1e293b/ffffff?text=G80", updatedAt: "2024-05-19",
    offers: []
  },
  { 
    id: "v-106", status: "sold", plateNumber: "33바 3333", manufacturer: "Kia", modelName: "Carnival KA4", modelYear: "2022", 
    mileage: "2.1", price: "2,850", location: "Incheon", 
    thumbnailUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Carnival", updatedAt: "2024-05-15",
    offers: []
  },
  { 
    id: "v-107", status: "sold", plateNumber: "77사 7777", manufacturer: "Hyundai", modelName: "Avante CN7", modelYear: "2021", 
    mileage: "3.3", price: "1,450", location: "Gyeonggi", 
    thumbnailUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Avante", updatedAt: "2024-05-14",
    offers: []
  },
  { 
    id: "v-108", status: "pending_settlement", plateNumber: "99아 9999", manufacturer: "Benz", modelName: "E-Class E300", modelYear: "2020", 
    mileage: "5.5", price: "4,200", location: "Seoul", 
    thumbnailUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Benz", updatedAt: "2024-05-10",
    offers: []
  },
];

// --- Services ---

const MockDataService = {
  getMockVehicles: (): Vehicle[] => [...MOCK_VEHICLES],
  getVehicleById: (id: string): Vehicle | undefined => MOCK_VEHICLES.find(v => v.id === id),
  // ✅ formData를 기반으로 차량 생성 (프로토타입용)
  createVehicle: (formData: any, vehicleId?: string): Vehicle => {
    const newId = vehicleId || `v-${Date.now()}`;
    const newVehicle: Vehicle = {
      id: newId,
      status: 'draft',
      plateNumber: formData.plateNumber || '미입력',
      manufacturer: formData.manufacturer || '미입력',
      modelName: formData.modelName || '미입력',
      modelYear: formData.modelYear || '미입력',
      mileage: formData.mileage || '0',
      price: formData.price || '-',
      location: 'Seoul',
      updatedAt: new Date().toISOString().split('T')[0],
      fuelType: formData.fuelType,
      registrationDate: formData.registrationDate,
      color: formData.color,
      vin: formData.vin,
      offers: []
    };
    // Mock 데이터에 추가
    MOCK_VEHICLES.push(newVehicle);
    return newVehicle;
  },
  deleteVehicle: (id: string) => {
    const idx = MOCK_VEHICLES.findIndex(v => v.id === id);
    if (idx > -1) MOCK_VEHICLES.splice(idx, 1);
    return new Promise(resolve => setTimeout(resolve, 500));
  },
  scheduleInspection: (vehicleId: string, schedule: any) => {
    const v = MOCK_VEHICLES.find(v => v.id === vehicleId);
    if (v) {
      v.status = 'inspection';
      v.inspectionId = `insp-${Date.now()}`;
    }
    return new Promise(resolve => setTimeout(resolve, 1000));
  },
  startAuction: (vehicleId: string, config?: any) => {
    const v = MOCK_VEHICLES.find(v => v.id === vehicleId);
    if (v) {
      v.status = 'bidding';
      v.endTime = '6d 23h 59m'; // Mock duration
      if (config?.price) v.price = config.price;
    }
  },
  startGeneralSale: (vehicleId: string, price: string) => {
    const v = MOCK_VEHICLES.find(v => v.id === vehicleId);
    if (v) {
      v.status = 'active_sale';
      v.price = price;
    }
  },
  getInspectionReport: (vehicleId: string): InspectionReport => ({
    id: "rpt-001",
    vehicleId,
    evaluator: { name: "Park Ji-sung", id: "ev-007", rating: 4.9, phone: "010-1234-5678" },
    score: "A",
    condition: {
      exterior: "Excellent condition with minor scratches on rear bumper.",
      interior: "Clean, non-smoker, leather seats in good condition.",
      mechanic: "Engine runs smooth, no leaks detected. Transmission shifts perfectly.",
      frame: "No accident history, original frame structure."
    },
    summary: "Comprehensive AI analysis indicates this vehicle is in the top 15% of its class for the 2018 model year. Engine acoustics are normal (confirmed by audio spectrum analysis), and the frame shows no signs of welding or corrosion.",
    aiAnalysis: {
      pros: ["Low mileage for commercial use", "Clean maintenance history", "Popular export model (Porter II)"],
      cons: ["Minor cosmetic scratches on cargo bed", "Tires at 40% life remaining"],
      marketVerdict: "High Demand"
    },
    media: [
      { category: "Exterior", count: 12, items: Array(12).fill(null).map((_, i) => ({ type: 'image', url: `https://placehold.co/600x400/e2e8f0/475569?text=Ext+${i+1}`, label: `Ext ${i+1}` })) },
      { category: "Interior", count: 15, items: Array(15).fill(null).map((_, i) => ({ type: 'image', url: `https://placehold.co/600x400/f1f5f9/475569?text=Int+${i+1}`, label: `Int ${i+1}` })) },
      { category: "Undercarriage", count: 10, items: Array(10).fill(null).map((_, i) => ({ type: 'image', url: `https://placehold.co/600x400/cfd8dc/455a64?text=Under+${i+1}`, label: `Under ${i+1}` })) },
      { category: "Videos", count: 3, items: [{ type: 'video', url: '#', label: 'Engine Sound' }, { type: 'video', url: '#', label: 'Walkaround' }, { type: 'video', url: '#', label: 'Test Drive' }] }
    ]
  })
};

// GeminiService는 src/services/gemini.ts에서 import됨

// --- Reusable UI Components ---

const Button = ({ 
  children, variant = 'primary', onClick, className = "", disabled = false, loading = false, icon: Icon 
}: any) => {
  const variants: any = {
    primary: "bg-fmax-primary hover:bg-primaryHover text-white shadow-md",
    secondary: "bg-fmax-accent text-white hover:brightness-110",
    outline: "border border-fmax-border text-fmax-text-main hover:bg-fmax-surface bg-white",
    ghost: "text-fmax-text-sub hover:text-fmax-primary hover:bg-fmax-surface",
    danger: "bg-fmax-error text-white hover:bg-red-700 shadow-md",
    dark: "bg-[#050B20] text-white hover:bg-black"
  };

  return (
    <button 
      onClick={onClick} 
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled || loading}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : Icon && <Icon className="ml-2 w-4 h-4 order-last" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = "", hoverEffect = true }: any) => (
  <div className={`bg-white border border-fmax-border rounded-xl shadow-sm ${hoverEffect ? 'hover:shadow-md transition-shadow' : ''} p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className="" }: any) => {
  const styles: any = {
    default: "bg-blue-50 text-blue-700 border-blue-100",
    success: "bg-green-50 text-green-700 border-green-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    error: "bg-red-50 text-red-700 border-red-100",
    neutral: "bg-gray-100 text-gray-600 border-gray-200"
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon, readOnly = false, helperText, highlight = false, className="" }: any) => (
  <div className={`space-y-1.5 w-full ${className}`}>
    {label && <label className="block text-sm font-semibold text-fmax-text-secondary">{label}</label>}
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fmax-text-sub">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <input
        type={type}
        className={`block w-full rounded-lg border-fmax-border bg-white text-fmax-text-main shadow-sm focus:border-fmax-primary focus:ring-2 focus:ring-fmax-primary/20 transition-all text-sm py-2.5 px-3 ${Icon ? 'pl-10' : ''} ${readOnly ? 'bg-gray-50 text-fmax-text-sub cursor-not-allowed' : ''} ${highlight ? 'ring-2 ring-fmax-primary/20 bg-blue-50/30' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
    {helperText && <p className="text-xs text-fmax-text-sub">{helperText}</p>}
  </div>
);

// --- SCR-0102-POP: Offer Modal Component ---
const OfferModal = ({ isOpen, onClose, vehicle }: any) => {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-fmax-text-main">구매 제안 현황</h3>
            <p className="text-sm text-gray-500 mt-1">48시간 29분 15초 남았습니다</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="bg-blue-50/50 p-4 border-b border-blue-50">
          <p className="text-sm text-blue-800 font-medium">바이어의 구매 제안을 확인하고 거래를 진행하세요!</p>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {vehicle.offers && vehicle.offers.length > 0 ? (
            vehicle.offers.map((offer: Offer) => (
              <div key={offer.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 relative group">
                {offer.isHighest && (
                  <div className="absolute top-5 right-5">
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">최고가</span>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                     <h4 className="font-bold text-fmax-text-main">{offer.bidderName}</h4>
                     <p className="text-xs text-gray-400 mt-0.5">{offer.date}</p>
                     <p className="text-2xl font-bold text-fmax-text-main mt-2">{offer.amount} 만원</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <Button variant="outline" className="flex-1 bg-gray-300 border-transparent text-gray-600 hover:bg-gray-400 hover:text-white h-11">제안 거절</Button>
                  <Button variant="dark" className="flex-1 h-11 bg-gray-600 hover:bg-gray-800">제안 수락</Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>도착한 제안이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- SCR-0100: Dashboard Page (Redesigned with Offer Tab) ---
const DashboardPage = ({ onNavigate }: any) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState({
    bidding: true,
    inspection: true,
    sold: false,
    pending: true
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedOfferVehicle, setSelectedOfferVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    setVehicles(MockDataService.getMockVehicles());
  }, []);

  const handleOpenOffers = () => {
    const targetVehicle = vehicles.find(v => v.offers && v.offers.length > 0);
    if (targetVehicle) {
      setSelectedOfferVehicle(targetVehicle);
      setShowOfferModal(true);
    }
  };

  const kpiStats = [
    { label: "전체 매물", value: vehicles.length.toString(), color: "text-fmax-text-main" },
    { label: "진행 중 (검차/입찰)", value: vehicles.filter(v => v.status === 'inspection' || v.status === 'bidding').length.toString(), color: "text-fmax-primary" },
    { label: "거래 완료", value: vehicles.filter(v => v.status === 'sold').length.toString(), color: "text-fmax-success" },
    { label: "정산 대기", value: vehicles.filter(v => v.status === 'pending_settlement').length.toString(), color: "text-fmax-accent" }
  ];

  const filteredVehicles = vehicles.filter(v => {
    if (!filters.bidding && v.status === 'bidding') return false;
    if (!filters.inspection && v.status === 'inspection') return false;
    if (!filters.sold && v.status === 'sold') return false;
    if (!filters.pending && v.status === 'pending_settlement') return false;
    if (searchTerm && !v.plateNumber.includes(searchTerm) && !v.modelName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <OfferModal 
        isOpen={showOfferModal} 
        onClose={() => setShowOfferModal(false)} 
        vehicle={selectedOfferVehicle} 
      />

      <header className="bg-white border-b border-fmax-border sticky top-0 z-30 h-16 flex items-center justify-between px-6 shadow-sm">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('SCR-0000')}>
               <div className="w-8 h-8 bg-fmax-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">F</div>
               <h1 className="text-xl font-bold text-fmax-text-main tracking-tight">ForwardMax <span className="text-xs font-normal text-fmax-text-sub ml-1">Partner</span></h1>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <Button icon={Plus} size="sm" className="h-9 text-xs" onClick={() => onNavigate('SCR-0200')}>매물 등록</Button>
            <div className="w-px h-5 bg-fmax-border"></div>
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-fmax-text-main">Global Motors</p>
                  <p className="text-xs text-fmax-text-sub">Dealer Admin</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
                  <img src="https://placehold.co/100x100" alt="Avatar" />
               </div>
            </div>
         </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
         {/* Sidebar Filters */}
         <aside className="w-64 bg-white border-r border-fmax-border hidden md:flex flex-col p-5 overflow-y-auto">
            <div className="mb-8">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Search</h3>
               <div className="flex gap-2 mb-2">
                 <Input placeholder="차량번호/모델명" value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />
                 <Button className="px-3" icon={SearchIcon}></Button>
               </div>
            </div>

            <div className="mb-6">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Status Filter</h3>
               <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.bidding ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                        {filters.bidding && <Check className="w-3.5 h-3.5 text-white" />}
                     </div>
                     <input type="checkbox" className="hidden" checked={filters.bidding} onChange={() => setFilters({...filters, bidding: !filters.bidding})} />
                     <span className="text-sm font-medium text-fmax-text-main">경매 진행 중</span>
                     <span className="ml-auto text-xs text-fmax-text-sub bg-gray-100 px-2 py-0.5 rounded-full">{vehicles.filter(v => v.status === 'bidding').length}</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.inspection ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                        {filters.inspection && <Check className="w-3.5 h-3.5 text-white" />}
                     </div>
                     <input type="checkbox" className="hidden" checked={filters.inspection} onChange={() => setFilters({...filters, inspection: !filters.inspection})} />
                     <span className="text-sm font-medium text-fmax-text-main">검차/준비 중</span>
                     <span className="ml-auto text-xs text-fmax-text-sub bg-gray-100 px-2 py-0.5 rounded-full">{vehicles.filter(v => v.status === 'inspection').length}</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.sold ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                        {filters.sold && <Check className="w-3.5 h-3.5 text-white" />}
                     </div>
                     <input type="checkbox" className="hidden" checked={filters.sold} onChange={() => setFilters({...filters, sold: !filters.sold})} />
                     <span className="text-sm font-medium text-fmax-text-main">거래 완료</span>
                     <span className="ml-auto text-xs text-fmax-text-sub bg-gray-100 px-2 py-0.5 rounded-full">{vehicles.filter(v => v.status === 'sold').length}</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.pending ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                        {filters.pending && <Check className="w-3.5 h-3.5 text-white" />}
                     </div>
                     <input type="checkbox" className="hidden" checked={filters.pending} onChange={() => setFilters({...filters, pending: !filters.pending})} />
                     <span className="text-sm font-medium text-fmax-text-main">정산 대기</span>
                     <span className="ml-auto text-xs text-fmax-text-sub bg-gray-100 px-2 py-0.5 rounded-full">{vehicles.filter(v => v.status === 'pending_settlement').length}</span>
                  </label>
               </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="mb-8">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Access</h3>
               <div className="space-y-2">
                  <button 
                     onClick={() => onNavigate('SCR-0101')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 text-left"
                  >
                     <Car className="w-4 h-4 text-fmax-primary" />
                     <span className="text-sm font-medium text-fmax-text-main">차량 목록</span>
                  </button>
                  <button 
                     onClick={() => onNavigate('SCR-0102')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 text-left"
                  >
                     <Megaphone className="w-4 h-4 text-fmax-primary" />
                     <span className="text-sm font-medium text-fmax-text-main">제안 목록</span>
                     <span className="ml-auto bg-fmax-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">2</span>
                  </button>
                  <button 
                     onClick={() => onNavigate('SCR-0103')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 text-left"
                  >
                     <TrendingUp className="w-4 h-4 text-fmax-primary" />
                     <span className="text-sm font-medium text-fmax-text-main">판매 내역</span>
                  </button>
                  <button 
                     onClick={() => onNavigate('SCR-0104')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 text-left"
                  >
                     <CreditCard className="w-4 h-4 text-fmax-primary" />
                     <span className="text-sm font-medium text-fmax-text-main">정산 내역</span>
                  </button>
                  <button 
                     onClick={() => onNavigate('SCR-0601')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 text-left"
                  >
                     <Truck className="w-4 h-4 text-fmax-primary" />
                     <span className="text-sm font-medium text-fmax-text-main">탁송 내역</span>
                  </button>
               </div>
            </div>
            
            <div className="mt-auto">
               <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="text-sm font-bold text-fmax-primary mb-1">Notice</h4>
                  <p className="text-xs text-blue-800 leading-relaxed">
                     순위가 밀린 차량은 '종료'로 자동 분류됩니다. 재입찰을 원하시면 갱신 버튼을 눌러주세요.
                  </p>
               </div>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 p-6 overflow-y-auto">
            {/* KPI Widgets */}
            <div className="grid grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-xl border border-fmax-border shadow-sm">
               {kpiStats.map((stat, i) => (
                  <div key={i} className={`flex flex-col items-center justify-center text-center ${i !== kpiStats.length -1 ? 'border-r border-fmax-border' : ''}`}>
                     <span className="text-xs font-semibold text-gray-500 mb-1">{stat.label}</span>
                     <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
               ))}
            </div>

            {/* Notification Banner */}
            <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
               {[
                 { type: 'INSPECTION_DONE', msg: '아반떼 CN7 검차가 완료되었습니다.', time: '10분 전', icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
                 { type: 'NEW_OFFER', msg: 'Porter II Diesel에 새로운 제안이 도착했습니다.', time: '30분 전', icon: DollarSign, color: 'text-blue-600 bg-blue-50', action: handleOpenOffers }
               ].map((notif: any, i) => (
                  <div key={i} onClick={notif.action} className={`flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-fmax-border shadow-sm min-w-[300px] ${notif.action ? 'cursor-pointer hover:bg-gray-50' : ''}`}>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                        <notif.icon className="w-4 h-4" />
                     </div>
                     <div>
                        <p className="text-sm font-medium text-fmax-text-main">{notif.msg}</p>
                        <p className="text-xs text-gray-400">{notif.time}</p>
                     </div>
                  </div>
               ))}
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredVehicles.map((v) => (
                  <div key={v.id} className="bg-white rounded-xl border border-fmax-border overflow-hidden hover:shadow-lg hover:border-fmax-primary/30 transition-all group flex flex-col h-full">
                     {/* Header: Status & Timer */}
                     <div className="px-4 py-3 border-b border-fmax-border flex items-center justify-between bg-gray-50/50">
                        {v.status === 'bidding' ? (
                           <>
                              <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                                 <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                 경매중
                              </span>
                              <span className="text-sm font-mono font-bold text-fmax-error flex items-center gap-1">
                                 <Timer className="w-3.5 h-3.5" /> {v.endTime}
                              </span>
                           </>
                        ) : v.status === 'inspection' ? (
                           <>
                              <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                                 <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                                 검차 진행중
                              </span>
                              <span className="text-xs text-gray-400">결과 대기</span>
                           </>
                        ) : v.status === 'active_sale' ? (
                           <>
                              <span className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                                 <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                 판매 중
                              </span>
                              <span className="text-xs text-gray-400">제안 대기</span>
                           </>
                        ) : (
                           <>
                              <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                                 <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                                 {v.status === 'sold' ? '거래 완료' : '정산 대기'}
                              </span>
                           </>
                        )}
                     </div>

                     {/* Content */}
                     <div className="p-4 flex gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                           {v.thumbnailUrl ? <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover" /> : <Car className="w-8 h-8 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                           <div>
                              <h3 className="font-bold text-fmax-text-main truncate text-base">{v.modelName}</h3>
                              <p className="text-xs text-fmax-text-sub mt-1 line-clamp-1">{v.modelYear}년 • {v.mileage}만km • {v.location}</p>
                           </div>
                           <div className="mt-3 space-y-1">
                              {v.highestBid && (
                                 <div className="flex justify-between items-end">
                                    <span className="text-xs text-gray-400">최고가</span>
                                    <span className="text-sm font-bold text-fmax-text-main">{v.highestBid}만원</span>
                                 </div>
                              )}
                              <div className="flex justify-between items-end">
                                 <span className="text-xs text-fmax-primary font-medium">내 견적</span>
                                 <span className="text-base font-bold text-fmax-primary">{v.price || '-'}만원</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Action Button */}
                     <div className="p-3 bg-gray-50 border-t border-fmax-border mt-auto">
                        <Button 
                           variant={v.status === 'inspection' ? 'primary' : 'outline'} 
                           className="w-full h-9 text-sm"
                           onClick={() => v.status === 'inspection' ? onNavigate('SCR-0201-Progress') : v.status === 'bidding' ? onNavigate('SCR-0400', v.id) : onNavigate('SCR-0202', v.id)}
                        >
                           {v.status === 'inspection' ? '현황 보기' : v.status === 'bidding' ? '경매 현황' : '상세 보기'}
                        </Button>
                     </div>
                  </div>
               ))}
            </div>
         </main>
      </div>
    </div>
  );
};

// --- SCR-0301-N, 0302-N, 0303-N: General Sale Flow ---

const GeneralSalePageLoading = ({ onNavigate }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('SCR-0302-N');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
       <div className="w-full max-w-md">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
             <Loader2 className="w-8 h-8 text-fmax-primary animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-fmax-text-main mb-2">기준 가격 설정</h2>
          <p className="text-fmax-text-sub text-sm">분석을 통해 내 차 시세를 확인해주세요.<br/>gemini-3-pro-preview Model</p>
          
          <div className="mt-8 bg-gray-100 rounded-lg p-3 text-xs text-gray-500 max-w-xs mx-auto animate-pulse">
            최근 수출 데이터 매칭 중...
          </div>
       </div>
    </div>
  );
};

const GeneralSalePagePrice = ({ onNavigate, vehicleId }: any) => {
  const [price, setPrice] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  
  const handleNext = () => {
    if(!price) return;
    const numPrice = parseInt(price.replace(/,/g, ''));
    if (numPrice < 1850 || numPrice > 2100) {
      if(!showWarning) {
        setShowWarning(true);
        return; // First click shows warning
      }
    }
    MockDataService.startGeneralSale(vehicleId, price);
    onNavigate('SCR-0303-N');
  };

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
       <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <button onClick={() => onNavigate('SCR-0300')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
               <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
             </button>
             <h1 className="text-lg font-bold text-fmax-text-main">판매 가격 설정</h1>
          </div>
          <button className="text-xs text-gray-400 underline" onClick={() => onNavigate('SCR-0303-N')}>Skip (Dev)</button>
       </header>

       <main className="flex-grow p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
             <div className="bg-gray-100 rounded-xl p-6 flex items-center gap-4">
               <div className="flex-1">
                 <p className="text-xs font-bold text-gray-500 uppercase mb-1">차량 정보</p>
                 <h2 className="text-lg font-bold text-fmax-text-main">12바 1234</h2>
                 <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                    <p>그랜저IG 3.0 익스클루시브</p>
                    <p>2019년식 · 8.2만km</p>
                 </div>
               </div>
               <div className="w-24 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <img src="https://placehold.co/200x120/1e293b/ffffff?text=Car" className="w-full h-full object-cover" />
               </div>
             </div>

             <div className="bg-gray-200 rounded-xl p-8 text-center">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">내 차 예상 시세</p>
                <p className="text-3xl font-black text-fmax-text-main">1,850~2,100만원</p>
             </div>

             <div className="bg-gray-200 rounded-xl p-8 space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase">판매 가격 설정</p>
                <div className="relative">
                   <input 
                      type="number" 
                      className="w-full bg-transparent border-2 border-fmax-text-main rounded-lg text-2xl font-bold p-3 text-center focus:outline-none focus:border-fmax-primary transition-colors"
                      placeholder="0,000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-500">만원</span>
                </div>
                {showWarning && (
                   <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg border border-yellow-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>입력하신 가격이 AI 예상 시세 범위를 벗어납니다. 판매 확률이 낮아질 수 있습니다. 계속 하시겠습니까?</span>
                   </div>
                )}
             </div>

             <Button className="w-full h-12 text-lg" onClick={handleNext}>확인</Button>
          </div>
       </main>
    </div>
  );
};

const GeneralSalePageComplete = ({ onNavigate }: any) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
       <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6 relative">
             <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-fmax-text-main rounded-full border-t-transparent animate-spin duration-700 opacity-20"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-12 h-12 text-fmax-text-main" />
             </div>
          </div>
          
          <h2 className="text-2xl font-bold text-fmax-text-main mb-2">판매 상태로 전환되었습니다</h2>
          <p className="text-gray-500 text-sm mb-8">구매 제안이 오면 알람을 통해 알려드려요!</p>
          
          <div className="w-full space-y-3">
            <Button className="w-full h-12" onClick={() => onNavigate('SCR-0102')}>제안 목록 보기</Button>
            <Button variant="outline" className="w-full h-12" onClick={() => onNavigate('SCR-0100')}>대시보드로 이동</Button>
          </div>
       </div>
    </div>
  );
};


// --- SCR-0401-A, 0402-A, 0403-A: Auction Sale Flow ---

const AuctionSalePageStartPrice = ({ onNavigate }: any) => {
  const [price, setPrice] = useState("");
  
  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
       <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <button onClick={() => onNavigate('SCR-0300')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
               <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
             </button>
             <h1 className="text-lg font-bold text-fmax-text-main">경매 사전 설정</h1>
          </div>
          <button className="text-xs text-gray-400 underline" onClick={() => onNavigate('SCR-0402-A')}>Skip (Dev)</button>
       </header>
       
       <div className="h-1 bg-gray-200 w-full">
         <div className="h-full bg-fmax-text-main w-1/3"></div>
       </div>

       <main className="flex-grow p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
             <div className="text-center">
               <h2 className="text-xl font-bold text-fmax-text-main mb-1">경매 사전 설정</h2>
               <p className="text-sm text-gray-500">경매 시작 이후에는 조건을 변경할 수 없습니다</p>
             </div>

             <div className="bg-gray-100 rounded-xl p-6 flex items-center gap-4">
               <div className="flex-1">
                 <p className="text-xs font-bold text-gray-500 uppercase mb-1">차량 정보</p>
                 <h2 className="text-lg font-bold text-fmax-text-main">12바 1234</h2>
                 <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                    <p>그랜저IG 3.0 익스클루시브</p>
                    <p>2019년식 · 8.2만km</p>
                 </div>
               </div>
               <div className="w-24 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <img src="https://placehold.co/200x120/1e293b/ffffff?text=Car" className="w-full h-full object-cover" />
               </div>
             </div>

             <div className="bg-gray-100 rounded-xl p-8 space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase">경매 시작가</p>
                <div className="relative">
                   <input 
                      type="number" 
                      className="w-full bg-transparent border-2 border-gray-300 rounded-lg text-2xl font-bold p-3 text-center focus:outline-none focus:border-fmax-text-main transition-colors"
                      placeholder="0,000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-500">만원</span>
                </div>
             </div>

             <Button className="w-full h-12 text-lg bg-gray-300 text-gray-600 hover:bg-fmax-text-main hover:text-white" disabled={!price} onClick={() => onNavigate('SCR-0402-A')}>다음</Button>
          </div>
       </main>
    </div>
  );
};

const AuctionSalePageDuration = ({ onNavigate }: any) => {
  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
       <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <button onClick={() => onNavigate('SCR-0401-A')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
               <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
             </button>
             <h1 className="text-lg font-bold text-fmax-text-main">경매 사전 설정</h1>
          </div>
          <button className="text-xs text-gray-400 underline" onClick={() => onNavigate('SCR-0403-A')}>Skip (Dev)</button>
       </header>
       
       <div className="h-1 bg-gray-200 w-full">
         <div className="h-full bg-fmax-text-main w-2/3"></div>
       </div>

       <main className="flex-grow p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
             <div className="bg-gray-100 rounded-xl p-6 space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase">경매 기간</p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-300 rounded-lg p-4 text-center">
                      <p className="text-xs text-gray-600 mb-1">경매 시작일</p>
                      <p className="font-bold text-fmax-text-main">12월 29일 (월)</p>
                   </div>
                   <div className="bg-gray-300 rounded-lg p-4 text-center">
                      <p className="text-xs text-gray-600 mb-1">경매 종료일</p>
                      <p className="font-bold text-fmax-text-main">1월 12일 (월)</p>
                   </div>
                </div>
                
                <div className="aspect-[4/3] bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500">
                   <CalendarDays className="w-12 h-12 mb-2" />
                   <span className="font-bold">캘린더</span>
                </div>
             </div>

             <Button className="w-full h-12 text-lg bg-gray-300 text-gray-600 hover:bg-fmax-text-main hover:text-white" onClick={() => onNavigate('SCR-0403-A')}>다음</Button>
          </div>
       </main>
    </div>
  );
};

const AuctionSalePageComplete = ({ onNavigate, vehicleId }: any) => {
  const [price, setPrice] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = () => {
    MockDataService.startAuction(vehicleId, { price });
    setIsComplete(true);
  };

  if (isComplete) {
     return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
           <div className="w-full max-w-md flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-12 h-12 text-fmax-text-main" />
                 </div>
              </div>
              
              <h2 className="text-2xl font-bold text-fmax-text-main mb-2">경매가 시작되었습니다</h2>
              <p className="text-gray-500 text-sm mb-8">입찰이 시작되면 알람을 통해 알려드려요!</p>
              
              <Button className="w-full h-12 bg-black text-white hover:bg-gray-800" onClick={() => onNavigate('SCR-0100')}>완료</Button>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
       <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <button onClick={() => onNavigate('SCR-0402-A')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
               <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
             </button>
             <h1 className="text-lg font-bold text-fmax-text-main">경매 사전 설정</h1>
          </div>
       </header>
       
       <div className="h-1 bg-gray-200 w-full">
         <div className="h-full bg-fmax-text-main w-full"></div>
       </div>

       <main className="flex-grow p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
             <div className="bg-gray-100 rounded-xl p-8 space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase">즉시 구매가</p>
                <div className="relative">
                   <input 
                      type="number" 
                      className="w-full bg-transparent border-2 border-gray-300 rounded-lg text-2xl font-bold p-3 text-center focus:outline-none focus:border-fmax-text-main transition-colors"
                      placeholder="0,000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-500">만원</span>
                </div>
             </div>

             <Button className="w-full h-12 text-lg bg-black text-white hover:bg-gray-800" onClick={handleComplete}>완료</Button>
          </div>
       </main>
    </div>
  );
};


// Plus 아이콘은 lucide-react에서 import됨

// --- SCR-0001: Login Screen ---
const LoginPage = ({ onNavigate, onLogin }: any) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-fmax-primary text-white mb-4">
            <span className="font-bold text-xl">F</span>
          </div>
          <h2 className="text-2xl font-bold text-fmax-text-main">로그인</h2>
          <p className="text-fmax-text-sub mt-2 text-sm">ForwardMax 파트너스</p>
        </div>

        <div className="space-y-5">
          <Input label="이메일" type="email" placeholder="email@company.com" icon={Mail} />
          <div className="space-y-1">
             <Input label="비밀번호" type="password" placeholder="••••••••" icon={Lock} />
             <div className="flex justify-end">
               <button className="text-xs text-fmax-primary hover:underline font-medium">비밀번호 찾기</button>
             </div>
          </div>
          <Button className="w-full h-11" onClick={onLogin}>로그인</Button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-xs"><span className="px-3 bg-white text-gray-400">또는</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
               Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
               Kakao
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-fmax-text-sub">
          계정이 없으신가요?{" "}
          <button onClick={() => onNavigate('SCR-0002')} className="font-semibold text-fmax-primary hover:underline">
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
};

// --- SCR-0002-2: Signup Info Page ---
const SignupInfoPage = ({ onNavigate, onSkip }: any) => {
  const [formData, setFormData] = useState({ companyName: '', businessRegNo: '', representative: '', email: '', phone: '', location: '' });
  const [isOCRLoading, setIsOCRLoading] = useState(false);
  const [ocrError, setOCRError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsOCRLoading(true);
    setOCRError(null);
    try {
      const result = await GeminiService.extractBusinessInfo(file);
      setFormData(prev => ({ ...prev, companyName: result.companyName || '', businessRegNo: result.businessRegNo || '', representative: result.representativeName || '' }));
    } catch (err: any) {
      setOCRError("문서 분석에 실패했습니다. 직접 입력해 주세요.");
    } finally {
      setIsOCRLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-fmax-text-main">사업자 정보 입력</h2>
             <span className="text-xs font-semibold text-fmax-primary bg-blue-50 px-2 py-1 rounded">Step 2/4</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* OCR Section - Single Column Flow */}
          <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100/50">
            <h3 className="text-sm font-bold text-fmax-text-main flex items-center gap-2 mb-2">
              <ScanEye className="w-4 h-4 text-fmax-primary" />
              자동 입력 (OCR)
            </h3>
            <p className="text-xs text-fmax-text-sub mb-4">사업자등록증 이미지를 업로드하면 정보가 자동으로 입력됩니다.</p>
            
            <div 
              className="border-2 border-dashed border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-white cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => !isOCRLoading && fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              {isOCRLoading ? (
                <div className="flex flex-col items-center py-2">
                  <Loader2 className="w-6 h-6 text-fmax-primary animate-spin mb-2" />
                  <span className="text-xs font-semibold text-fmax-primary">분석 중...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-blue-400 mb-2" />
                  <span className="text-sm font-medium text-blue-600">이미지 업로드</span>
                </>
              )}
            </div>
            {ocrError && <p className="text-xs text-red-500 mt-2 text-center">{ocrError}</p>}
          </div>

          {/* Form Section */}
          <div className="space-y-5">
            <Input label="상호명" placeholder="(주) 포워드맥스" value={formData.companyName} onChange={(e: any) => setFormData({...formData, companyName: e.target.value})} icon={Building} highlight={!!formData.companyName} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="사업자번호" placeholder="000-00-00000" value={formData.businessRegNo} onChange={(e: any) => setFormData({...formData, businessRegNo: e.target.value})} icon={FileText} highlight={!!formData.businessRegNo} />
              <Input label="대표자명" placeholder="성함" value={formData.representative} onChange={(e: any) => setFormData({...formData, representative: e.target.value})} icon={User} highlight={!!formData.representative} />
            </div>
            <Input label="이메일 (ID)" type="email" placeholder="email@company.com" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} icon={Mail} />
            
            <div className="pt-6">
               <Button className="w-full h-12 text-base" onClick={() => onNavigate('SCR-0003-1')}>신청하기</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SCR-0200: Register Vehicle Page ---
const RegisterVehiclePage = ({ onNavigate, editingVehicleId }: any) => {
  const [formData, setFormData] = useState({ plateNumber: '', vin: '', manufacturer: '', modelName: '', modelYear: '', fuelType: '', registrationDate: '', mileage: '', color: '', price: '' });
  const [isOCRLoading, setIsOCRLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [priceEstimate, setPriceEstimate] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingVehicleId) {
      const v = MockDataService.getVehicleById(editingVehicleId);
      if (v) {
        setFormData({
          plateNumber: v.plateNumber,
          vin: v.vin || '',
          manufacturer: v.manufacturer,
          modelName: v.modelName,
          modelYear: v.modelYear,
          fuelType: v.fuelType || '',
          registrationDate: v.registrationDate || '',
          mileage: v.mileage,
          color: v.color || '',
          price: v.price
        });
      }
    }
  }, [editingVehicleId]);

  const handleFileChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('지원하지 않는 파일 형식입니다. JPG, PNG, WEBP, PDF 파일만 업로드 가능합니다.');
      return;
    }
    
    // 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }
    
    setPreviewUrl(URL.createObjectURL(file));
    setIsOCRLoading(true);
    try {
      // 백엔드 API 호출로 변경
      const result = await apiClient.vehicle.ocrRegistration(file);
      
      // 응답 데이터를 폼에 매핑
      setFormData(prev => ({
        ...prev,
        plateNumber: result.plateNumber || prev.plateNumber,
        vin: result.vin || prev.vin,
        manufacturer: result.manufacturer || prev.manufacturer,
        modelName: result.model || prev.modelName,
        modelYear: result.year || prev.modelYear,
        mileage: result.mileage || prev.mileage,
        fuelType: result.fuelType || prev.fuelType,
        registrationDate: result.registrationDate || prev.registrationDate,
        color: result.color || prev.color,
      }));
    } catch (err: any) {
      console.error('OCR Error:', err);
      const errorMessage = err.message || '등록원부 인식 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setIsOCRLoading(false);
      e.target.value = '';
    }
  };

  const handleEstimate = async () => {
    if (!formData.modelName) return;
    setIsOCRLoading(true);
    try {
      // TODO: 시세 추정 기능은 향후 백엔드 API로 이동 예정
      // 현재는 프론트엔드에서 직접 호출 (임시)
      const { GeminiService } = await import('./src/services/gemini');
      const result = await GeminiService.estimateMarketPrice(formData.modelName, formData.modelYear);
      setPriceEstimate(result);
    } catch (err: any) {
      console.error('Price Estimate Error:', err);
      alert('시세 추정 중 오류가 발생했습니다.');
    } finally {
      setIsOCRLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
       <header className="bg-white border-b border-fmax-border sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('SCR-0100')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
            </button>
            <h1 className="text-lg font-bold text-fmax-text-main">{editingVehicleId ? "매물 정보 수정" : "새 매물 등록"}</h1>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" onClick={() => onNavigate('SCR-0200-Draft')}>임시 저장</Button>
             <Button 
               onClick={async () => {
                 // ✅ formData를 기반으로 Mock 차량 생성 (프로토타입용)
                 let savedVehicleId = editingVehicleId;
                 
                 if (!savedVehicleId) {
                   // 새 차량인 경우 formData로 Mock 차량 생성
                   const newVehicle = MockDataService.createVehicle(formData);
                   savedVehicleId = newVehicle.id;
                 } else {
                   // 기존 차량 수정인 경우 정보 업데이트
                   const existingVehicle = MockDataService.getVehicleById(savedVehicleId);
                   if (existingVehicle) {
                     existingVehicle.plateNumber = formData.plateNumber || existingVehicle.plateNumber;
                     existingVehicle.manufacturer = formData.manufacturer || existingVehicle.manufacturer;
                     existingVehicle.modelName = formData.modelName || existingVehicle.modelName;
                     existingVehicle.modelYear = formData.modelYear || existingVehicle.modelYear;
                     existingVehicle.mileage = formData.mileage || existingVehicle.mileage;
                     existingVehicle.price = formData.price || existingVehicle.price;
                     existingVehicle.fuelType = formData.fuelType || existingVehicle.fuelType;
                     existingVehicle.registrationDate = formData.registrationDate || existingVehicle.registrationDate;
                     existingVehicle.color = formData.color || existingVehicle.color;
                     existingVehicle.vin = formData.vin || existingVehicle.vin;
                   }
                 }
                 
                 // 검차 신청 화면으로 이동
                 onNavigate('SCR-0201', savedVehicleId);
               }} 
               icon={ChevronRight}
             >
               검차 요청
             </Button>
          </div>
       </header>

       <main className="flex-grow p-4 sm:p-6 lg:p-8 w-full flex justify-center">
         <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Document Recognition */}
            <div className="lg:col-span-5 space-y-6">
               <div className="sticky top-24 space-y-4">
                 <h3 className="text-base font-bold text-fmax-text-main flex items-center gap-2">
                    <FileText className="w-5 h-5 text-fmax-primary" />
                    등록증 인식
                 </h3>
                 <div 
                    className={`aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all cursor-pointer bg-white relative overflow-hidden
                       ${previewUrl ? 'border-fmax-primary/30' : 'border-gray-200 hover:border-fmax-primary hover:bg-blue-50/10'}
                    `}
                    onClick={() => !isOCRLoading && fileInputRef.current?.click()}
                 >
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    {previewUrl ? (
                      <div className="w-full h-full">
                         <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                         {isOCRLoading && (
                           <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                              <Loader2 className="w-8 h-8 text-fmax-primary animate-spin mb-2" />
                              <span className="font-semibold text-fmax-primary text-xs">분석 중...</span>
                           </div>
                         )}
                      </div>
                    ) : (
                      <div className="text-center">
                         <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                         <p className="font-medium text-fmax-text-main text-sm">등록증 사진 업로드</p>
                      </div>
                    )}
                 </div>
                 <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                    차대번호와 제원을 자동으로 입력합니다.
                 </div>
               </div>
            </div>

            {/* Right: Form Data */}
            <div className="lg:col-span-7 space-y-8">
               <div className="space-y-5">
                  <h3 className="text-base font-bold text-fmax-text-main border-b border-gray-100 pb-2">
                     차량 기본 정보
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Input label="차량 번호" value={formData.plateNumber} onChange={(e:any) => setFormData({...formData, plateNumber: e.target.value})} placeholder="예: 12가 3456" highlight={!!formData.plateNumber} />
                     <Input label="차대번호 (VIN)" value={formData.vin} readOnly icon={Lock} placeholder="자동 인식" highlight={!!formData.vin} />
                     <Input label="제조사" value={formData.manufacturer} onChange={(e:any) => setFormData({...formData, manufacturer: e.target.value})} highlight={!!formData.manufacturer} />
                     <Input label="모델명" value={formData.modelName} onChange={(e:any) => setFormData({...formData, modelName: e.target.value})} highlight={!!formData.modelName} />
                     <Input label="연식" value={formData.modelYear} onChange={(e:any) => setFormData({...formData, modelYear: e.target.value})} highlight={!!formData.modelYear} />
                     <Input label="연료" value={formData.fuelType} onChange={(e:any) => setFormData({...formData, fuelType: e.target.value})} highlight={!!formData.fuelType} />
                  </div>
               </div>

               <div className="space-y-5">
                  <h3 className="text-base font-bold text-fmax-text-main border-b border-gray-100 pb-2">
                     가격 정보
                  </h3>
                  <div className="space-y-4">
                     <div className="flex gap-3 items-end">
                        <div className="flex-1">
                           <Input label="판매 희망가 (USD)" value={formData.price} onChange={(e:any) => setFormData({...formData, price: e.target.value})} type="number" placeholder="예: 25,000" />
                        </div>
                        <Button variant="outline" onClick={handleEstimate} loading={isOCRLoading} className="h-[42px] px-4">시세 조회</Button>
                     </div>
                     {priceEstimate && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                           <div className="flex items-start gap-3">
                              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                 <p className="text-sm font-bold text-blue-800 mb-1">AI 마켓 분석</p>
                                 <p className="text-sm text-blue-900 leading-relaxed">
                                    {priceEstimate.text}
                                 </p>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
       </main>
    </div>
  );
};

// --- SCR-0000: Landing Page ---
const LandingPage = ({ onNavigate }: any) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A202C] font-sans selection:bg-[#405FF2] selection:text-white">
      {/* Navbar - Clean and minimal as per reference */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 h-20">
        <div className="max-w-[1440px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.reload()}>
            {/* Logo placeholder */}
            <div className="w-10 h-10 bg-[#405FF2] rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-[#050B20]">ForwardMax</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            {["Used Cars", "New Cars", "Sell Your Car", "Community"].map((l) => (
              <button 
                key={l} 
                onClick={() => onNavigate('SCR-0001')}
                className="text-base font-medium text-[#050B20] hover:text-[#405FF2] transition-colors"
              >
                {l}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
             <button onClick={() => onNavigate('SCR-0001')} className="hidden sm:block text-base font-bold text-[#050B20] px-4 py-2 hover:bg-gray-50 rounded-lg">Sign In</button>
             <Button onClick={() => onNavigate('SCR-0001')} className="h-11 px-6 rounded-full text-base">Submit Listing</Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-16 pb-32 px-6 max-w-[1440px] mx-auto text-center relative">
          <Badge variant="neutral" className="mb-6 bg-blue-50 text-[#405FF2] border-blue-100 px-3 py-1 text-sm">Find Your Dream Car</Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#050B20] mb-12">
            Find Your Dream Car
          </h1>

          {/* Search Filter Bar */}
          <div className="max-w-5xl mx-auto bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2.5 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-100 border border-gray-100 relative z-10">
             {["Used Cars", "Any Makes", "Any Models", "All Prices"].map((ph, idx) => (
                <div key={idx} className="flex-1 w-full px-6 py-3 flex flex-col items-start cursor-pointer hover:bg-gray-50 transition-colors md:rounded-none first:rounded-t-2xl last:rounded-b-2xl md:first:rounded-l-full md:last:rounded-r-full">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {idx === 0 ? "Condition" : idx === 1 ? "Make" : idx === 2 ? "Model" : "Price Range"}
                   </span>
                   <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-[#050B20]">{ph}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                   </div>
                </div>
             ))}
             <div className="p-2 w-full md:w-auto">
                <button className="w-full md:w-14 h-14 bg-[#405FF2] rounded-full flex items-center justify-center text-white hover:bg-[#324bc4] shadow-lg shadow-blue-500/30 transition-all">
                   <SearchIcon className="w-6 h-6" />
                </button>
             </div>
          </div>

          {/* Hero Car Image */}
          <div className="mt-16 md:-mt-10 relative pointer-events-none">
             {/* Using a placeholder that looks like a car cutout */}
             <div className="w-full h-[300px] md:h-[500px] flex items-center justify-center">
                 <img src="https://placehold.co/1000x500/ffffff/ffffff?text=." alt="Car Cutout Placeholder" className="w-full h-full object-contain mix-blend-multiply opacity-0" />
                 <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/2021_Tesla_Model_S_Plaid.jpg/1200px-2021_Tesla_Model_S_Plaid.jpg" 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[70%] object-contain drop-shadow-2xl rounded-3xl"
                    alt="Hero Car"
                 />
             </div>
          </div>
        </section>

        {/* Browse by Type */}
        <section className="py-20 px-6 max-w-[1440px] mx-auto">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-[#050B20]">Browse by Type</h2>
              <div className="flex gap-2">
                 <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronLeft className="w-5 h-5" /></button>
                 <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight className="w-5 h-5" /></button>
              </div>
           </div>
           <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
              {[
                { n: "SUV", i: Car }, { n: "Sedan", i: Car }, { n: "Hatchback", i: Car }, 
                { n: "Coupe", i: Car }, { n: "Hybrid", i: Zap }, { n: "Convertible", i: Car }, 
                { n: "Van", i: Truck }, { n: "Truck", i: Truck }, { n: "Electric", i: Zap }
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 hover:shadow-lg hover:border-transparent transition-all cursor-pointer group bg-white">
                   <t.i className="w-8 h-8 text-gray-400 group-hover:text-[#405FF2] mb-3 transition-colors" />
                   <span className="text-sm font-bold text-[#050B20]">{t.n}</span>
                </div>
              ))}
           </div>
        </section>

        {/* Promo Cards */}
        <section className="py-10 px-6 max-w-[1440px] mx-auto">
           <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#E9F2FF] rounded-3xl p-10 md:p-14 relative overflow-hidden group">
                 <div className="relative z-10 max-w-sm">
                    <h3 className="text-3xl font-bold text-[#050B20] mb-4">Are You Looking<br/>For a Car?</h3>
                    <p className="text-[#050B20]/70 mb-8 leading-relaxed">We are committed to providing our customers with exceptional service.</p>
                    <Button className="h-12 px-8 rounded-full bg-[#405FF2] border-none shadow-lg shadow-blue-500/20" icon={ArrowRight} onClick={() => onNavigate('SCR-0100')}>Get Started</Button>
                 </div>
                 <Car className="absolute bottom-10 right-10 w-40 h-40 text-[#405FF2]/10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="bg-[#FFECEC] rounded-3xl p-10 md:p-14 relative overflow-hidden group">
                 <div className="relative z-10 max-w-sm">
                    <h3 className="text-3xl font-bold text-[#050B20] mb-4">Do You Want to<br/>Sell a Car?</h3>
                    <p className="text-[#050B20]/70 mb-8 leading-relaxed">We are committed to providing our customers with exceptional service.</p>
                    <Button className="h-12 px-8 rounded-full bg-[#050B20] text-white border-none shadow-lg shadow-black/20" icon={ArrowRight} onClick={() => onNavigate('SCR-0200')}>Get Started</Button>
                 </div>
                 <DollarSign className="absolute bottom-10 right-10 w-40 h-40 text-[#FF5858]/10 group-hover:scale-110 transition-transform duration-500" />
              </div>
           </div>
        </section>

        {/* The Most Searched Cars */}
        <section className="py-20 px-6 max-w-[1440px] mx-auto">
            <div className="flex flex-col items-center text-center mb-12">
               <h2 className="text-3xl font-bold text-[#050B20] mb-6">The Most Searched Cars</h2>
               <div className="inline-flex items-center p-1.5 bg-gray-100 rounded-full">
                  {["In Stock", "Sedan", "SUV", "Convertible"].map((tab, i) => (
                     <button key={tab} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-white shadow-sm text-[#050B20]' : 'text-gray-500 hover:text-[#050B20]'}`}>
                        {tab}
                     </button>
                  ))}
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { ...MOCK_VEHICLES[0], img: "https://placehold.co/600x400/eef2ff/3730a3?text=Camry", name: "Toyota Camry New", trim: "3.5 D5 PowerPulse Momentum" },
                 { ...MOCK_VEHICLES[1], img: "https://placehold.co/600x400/fff1f2/9f1239?text=T-Cross", name: "T-Cross - 2023", trim: "4.0 D5 PowerPulse Momentum" },
                 { ...MOCK_VEHICLES[2], img: "https://placehold.co/600x400/ecfdf5/065f46?text=C-Class", name: "C-Class - 2023", trim: "4.0 D5 PowerPulse Momentum" },
                 { ...MOCK_VEHICLES[3], img: "https://placehold.co/600x400/fffbeb/92400e?text=Transit", name: "Ford Transit - 2021", trim: "4.0 D5 PowerPulse Momentum" },
               ].map((car, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
                     <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                        <img src={car.img} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-4 left-4 bg-[#40b93c] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">Great Price</span>
                        <button className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white"><HeartIcon className="w-4 h-4 text-gray-500" /></button>
                     </div>
                     <div className="p-5">
                        <h4 className="text-lg font-bold text-[#050B20] mb-1">{car.name}</h4>
                        <p className="text-xs text-gray-500 mb-4 truncate">{car.trim}</p>
                        
                        <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-3 mb-4">
                           <div className="flex flex-col items-center justify-center text-center gap-1">
                              <Gauge className="w-4 h-4 text-gray-400" />
                              <span className="text-[10px] font-medium text-gray-600">{car.mileage} Miles</span>
                           </div>
                           <div className="flex flex-col items-center justify-center text-center gap-1 border-l border-r border-gray-100">
                              <Fuel className="w-4 h-4 text-gray-400" />
                              <span className="text-[10px] font-medium text-gray-600">{car.fuelType}</span>
                           </div>
                           <div className="flex flex-col items-center justify-center text-center gap-1">
                              <Zap className="w-4 h-4 text-gray-400" />
                              <span className="text-[10px] font-medium text-gray-600">Automatic</span>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                           <span className="text-xl font-bold text-[#050B20]">${parseInt(car.price.replace(/,/g,'')).toLocaleString()}</span>
                           <button className="text-sm font-bold text-[#405FF2] flex items-center gap-1 hover:underline">
                              View Details <ChevronRight className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="flex justify-center mt-10">
               <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-[#050B20] text-white flex items-center justify-center hover:opacity-90"><ChevronLeft className="w-5 h-5" /></button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight className="w-5 h-5" /></button>
               </div>
            </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-6 max-w-[1440px] mx-auto bg-white">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#050B20] mb-3">Why Choose Us?</h2>
              <p className="text-gray-500">We offer the best experience with our wide range of services.</p>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { t: "Special Financing Offers", d: "Our stress-free finance department that can find financial solutions to save you money.", i: Percent },
                { t: "Trusted Car Dealership", d: "Our stress-free finance department that can find financial solutions to save you money.", i: ShieldCheck },
                { t: "Transparent Pricing", d: "Our stress-free finance department that can find financial solutions to save you money.", i: DollarSign },
                { t: "Expert Car Service", d: "Our stress-free finance department that can find financial solutions to save you money.", i: Armchair },
              ].map((f, i) => (
                 <div key={i} className="flex flex-col items-start p-2">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#405FF2] flex items-center justify-center mb-6">
                       <f.i className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-[#050B20] mb-3">{f.t}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
                 </div>
              ))}
           </div>
        </section>

        {/* Latest Cars Section (Simplified) */}
        <section className="py-20 px-6 max-w-[1440px] mx-auto border-t border-gray-100">
           <div className="flex items-center justify-center mb-10">
              <h2 className="text-3xl font-bold text-[#050B20]">Latest Cars</h2>
           </div>
           {/* Reusing car grid structure if needed, simply placing placeholder content for visual completeness */}
           <div className="flex justify-center text-gray-400 text-sm">
              <p>More inventory coming soon...</p>
           </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white py-12">
         <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-[#050B20]">ForwardMax</span>
              <span className="text-sm text-gray-500">© 2025. All rights reserved.</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-gray-500">
               <a href="#" className="hover:text-[#405FF2]">Terms & Conditions</a>
               <a href="#" className="hover:text-[#405FF2]">Privacy Policy</a>
               <a href="#" className="hover:text-[#405FF2]">Contact Us</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

// --- SCR-0200-Draft: Vehicle Draft List Page (임시저장 목록) ---
const VehicleDraftListPage = ({ onNavigate, onEdit }: any) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    setVehicles(MockDataService.getMockVehicles());
  }, []);

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <header className="bg-white border-b border-fmax-border sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('SCR-0100')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
          </button>
          <h1 className="text-lg font-bold text-fmax-text-main">내 매물 관리</h1>
        </div>
        <Button onClick={() => onNavigate('SCR-0200')} icon={Plus}>매물 등록</Button>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="bg-white border border-fmax-border rounded-xl overflow-hidden shadow-sm">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50 border-b border-fmax-border text-xs uppercase tracking-wider text-fmax-text-sub font-semibold">
                    <th className="p-4 pl-6">차량 정보</th>
                    <th className="p-4">상태</th>
                    <th className="p-4">희망가</th>
                    <th className="p-4">등록일</th>
                    <th className="p-4 text-right pr-6">관리</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-fmax-border">
                 {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors group">
                       <td className="p-4 pl-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 overflow-hidden">
                                {v.thumbnailUrl ? <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover" /> : <Car className="w-5 h-5" />}
                             </div>
                             <div>
                                <p className="font-bold text-fmax-text-main text-sm">{v.modelYear} {v.manufacturer} {v.modelName}</p>
                                <p className="text-xs text-fmax-text-sub mt-0.5">{v.plateNumber}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-4">
                          <Badge variant={v.status === 'sold' ? 'success' : v.status === 'inspection' ? 'warning' : 'default'}>{v.status}</Badge>
                       </td>
                       <td className="p-4 text-sm font-bold text-fmax-text-main">${parseInt(v.price.replace(/,/g, '')).toLocaleString()}</td>
                       <td className="p-4 text-xs text-fmax-text-sub">{v.updatedAt}</td>
                       <td className="p-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => onEdit(v.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-fmax-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                             <button className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           {vehicles.length === 0 && (
              <div className="p-12 text-center text-fmax-text-sub">
                 <p className="font-medium">등록된 매물이 없습니다.</p>
              </div>
           )}
        </div>
      </main>
    </div>
  );
};

// Google Maps Component (Google Maps JavaScript API 사용)
const GoogleMapsPicker = ({ 
  onPlaceSelect, 
  initialAddress = '' 
}: { 
  onPlaceSelect: (place: { address: string; location: { lat: number; lng: number } | null }) => void;
  initialAddress?: string;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState(initialAddress);
  // Gemini API 키를 Google Maps API 키로도 사용
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
                 import.meta.env.VITE_GEMINI_API_KEY || 
                 'AIzaSyC0H1moukd9KnWlCqrTaBxYj1WE3Y16QpY';
  
  // @ts-ignore
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  // @ts-ignore
  const markerRef = useRef<google.maps.Marker | null>(null);
  // @ts-ignore
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  // @ts-ignore
  const infowindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Google Maps JavaScript API 로드
  useEffect(() => {
    // 이미 로드되어 있는지 확인
    // @ts-ignore
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    // 스크립트가 이미 추가되어 있는지 확인
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => setMapLoaded(true));
      return;
    }

    // Google Maps JavaScript API 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsPicker`;
    script.async = true;
    script.defer = true;
    
    // @ts-ignore
    window.initGoogleMapsPicker = () => {
      setMapLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      // @ts-ignore
      if (window.initGoogleMapsPicker) {
        // @ts-ignore
        delete window.initGoogleMapsPicker;
      }
    };
  }, [apiKey]);

  // 지도 초기화 및 Places Autocomplete 설정
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !inputRef.current) return;

    try {
      // @ts-ignore
      const { google } = window;
      if (!google || !google.maps) return;

      // 지도 초기화 (서울 중심)
      const mapOptions = {
        center: { lat: 37.5665, lng: 126.9780 },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
      };

      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // InfoWindow 초기화
      const infowindow = new google.maps.InfoWindow();
      infowindowRef.current = infowindow;

      // Places Autocomplete 초기화
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types'],
        componentRestrictions: { country: 'kr' }, // 한국만 검색
      });

      autocompleteRef.current = autocomplete;

      // 마커 초기화
      const marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
      });
      markerRef.current = marker;

      // Autocomplete 이벤트 리스너
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          console.warn('No details available for input:', place.name);
          return;
        }

        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };

        // 마커 위치 설정
        marker.setPosition(location);
        marker.setVisible(true);

        // 지도 중심 이동
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(location);
          map.setZoom(17);
        }

        // InfoWindow 표시
        const address = place.formatted_address || place.name;
        infowindow.setContent(
          `<div style="padding: 8px;">
            <strong>${place.name || '선택한 위치'}</strong><br>
            <span style="font-size: 12px; color: #666;">${address}</span>
          </div>`
        );
        infowindow.open(map, marker);

        // 부모 컴포넌트에 선택된 위치 전달
        onPlaceSelect({
          address: address,
          location: location
        });

        // 입력 필드 업데이트
        setSearchValue(address);
      });

      // 지도 클릭 이벤트 (선택사항)
      map.addListener('click', (e: any) => {
        const location = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };

        marker.setPosition(location);
        marker.setVisible(true);
        map.setCenter(location);

        // 역지오코딩으로 주소 가져오기
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: location }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const address = results[0].formatted_address;
            infowindow.setContent(
              `<div style="padding: 8px;">
                <strong>선택한 위치</strong><br>
                <span style="font-size: 12px; color: #666;">${address}</span>
              </div>`
            );
            infowindow.open(map, marker);

            onPlaceSelect({
              address: address,
              location: location
            });

            setSearchValue(address);
          }
        });
      });

    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  }, [mapLoaded, onPlaceSelect]);

  return (
    <div className="mt-2 space-y-2">
      {/* 주소 검색 입력 필드 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fmax-text-sub">
          <MapPin className="h-4 w-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full rounded-lg border-fmax-border bg-white text-fmax-text-main shadow-sm focus:border-fmax-primary focus:ring-2 focus:ring-fmax-primary/20 transition-all text-sm py-2.5 px-3 pl-10"
          placeholder="주소를 검색하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      
      {/* 지도 컨테이너 */}
      <div 
        ref={mapRef} 
        className="w-full rounded-lg overflow-hidden border border-fmax-border"
        style={{ height: '160px', minHeight: '160px' }}
      >
        {!mapLoaded && (
          <div className="h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Map className="w-6 h-6 mr-2" /> 지도를 불러오는 중...
          </div>
        )}
      </div>
    </div>
  );
};

// --- SCR-0201: Inspection Request Page ---
const InspectionRequestPage = ({ onNavigate, vehicleId }: any) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    location: { lat: number; lng: number } | null;
  }>({ address: '', location: null });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  useEffect(() => {
    const loadVehicle = async () => {
      setLoading(true);
      if (vehicleId) {
        const v = MockDataService.getVehicleById(vehicleId);
        if (v) {
          setVehicle(v);
        } else {
          // ✅ vehicleId가 있지만 Mock 데이터에 없는 경우 (새로 생성된 차량)
          // 첫 번째 Mock 차량을 사용하거나 기본 차량 생성
          const vehicles = MockDataService.getMockVehicles();
          setVehicle(vehicles[0] || null);
        }
      } else {
        // vehicleId가 없으면 첫 번째 차량 사용 (임시)
        const vehicles = MockDataService.getMockVehicles();
        setVehicle(vehicles[0] || null);
      }
      setLoading(false);
    };
    loadVehicle();
  }, [vehicleId]);

  const handlePlaceSelect = (place: { address: string; location: { lat: number; lng: number } | null }) => {
    setSelectedLocation(place);
  };

  const handleRequest = async () => {
    if (!selectedLocation.address) {
      alert('검차 장소를 선택해주세요.');
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert('방문 희망 일시를 선택해주세요.');
      return;
    }
    if (vehicle) {
       await MockDataService.scheduleInspection(vehicle.id, {
         location: selectedLocation,
         date: selectedDate,
         time: selectedTime
       });
       onNavigate('SCR-0201-Progress', vehicle.id);
    }
  };

  if (loading || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fmax-surface">
         <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-fmax-primary animate-spin mb-4" />
            <p className="text-sm text-fmax-text-sub">차량 정보를 불러오는 중입니다...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30 h-16">
         <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('SCR-0200', vehicle.id)} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
            </button>
            <h1 className="text-lg font-bold text-fmax-text-main">AI 정밀 검차 신청</h1>
         </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6">
         <Card className="!p-6">
            <div className="flex items-start gap-5 border-b border-fmax-border pb-6 mb-6">
               <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Car className="w-8 h-8 text-gray-400" />
               </div>
               <div>
                  <Badge variant="default">검차 대상</Badge>
                  <h2 className="text-xl font-bold text-fmax-text-main mt-1">{vehicle.modelYear} {vehicle.manufacturer} {vehicle.modelName}</h2>
                  <p className="text-sm text-fmax-text-sub mt-1">{vehicle.plateNumber} • {vehicle.mileage}km</p>
               </div>
            </div>
            
            <div className="space-y-5">
               <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-fmax-text-main block">검차 장소</label>
                  {selectedLocation.address && (
                    <div className="text-sm text-fmax-text-sub bg-blue-50 p-3 rounded-lg border border-blue-100">
                      선택된 주소: {selectedLocation.address}
                    </div>
                  )}
                  <GoogleMapsPicker 
                    onPlaceSelect={handlePlaceSelect}
                    initialAddress={selectedLocation.address}
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-fmax-text-main block">방문 희망 일시</label>
                  <div className="grid grid-cols-2 gap-4">
                     <Input 
                       type="date" 
                       icon={Calendar}
                       value={selectedDate}
                       onChange={(e) => setSelectedDate(e.target.value)}
                     />
                     <Input 
                       type="time" 
                       icon={Clock}
                       value={selectedTime}
                       onChange={(e) => setSelectedTime(e.target.value)}
                     />
                  </div>
               </div>
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                     신청 후 24시간 이내에 평가사가 배정됩니다. 검차 비용은 최종 정산 시 차감됩니다.
                  </p>
               </div>
               <Button className="w-full h-12 text-base mt-2" onClick={handleRequest}>예약 확정</Button>
            </div>
         </Card>
      </main>
    </div>
  );
};

// --- SCR-0201-Progress: Inspection Status Page ---
const InspectionStatusPage = ({ onNavigate, vehicleId }: any) => {
  const [progress, setProgress] = useState(0);
  const [currentVehicleId, setCurrentVehicleId] = useState<string | undefined>(vehicleId);
  const [inspectionId, setInspectionId] = useState<string | null>(null);
  const [inspectionStatus, setInspectionStatus] = useState<string>('pending');

  useEffect(() => {
    // vehicleId가 없으면 첫 번째 차량 사용 (임시)
    if (!currentVehicleId) {
      const vehicles = MockDataService.getMockVehicles();
      if (vehicles.length > 0) {
        setCurrentVehicleId(vehicles[0].id);
      }
    }
  }, [vehicleId]);

  // Firestore 실시간 리스너로 검차 진행률 업데이트
  useEffect(() => {
    if (!currentVehicleId) return;

    // vehicleId로 inspectionId 찾기 (임시: Mock 데이터에서)
    const vehicle = MockDataService.getVehicleById(currentVehicleId);
    if (vehicle?.inspectionId) {
      setInspectionId(vehicle.inspectionId);
    } else {
      // Mock: inspectionId가 없으면 임시로 생성
      const mockInspectionId = `insp-${currentVehicleId}`;
      setInspectionId(mockInspectionId);
    }
  }, [currentVehicleId]);

  useEffect(() => {
    if (!inspectionId) return;

    // TODO: Firestore 실시간 리스너 구현
    // 현재는 Mock 데이터로 진행률 시뮬레이션
    // 실제 구현 시:
    // import { doc, onSnapshot } from 'firebase/firestore';
    // import { db } from './src/config/firebase';
    // 
    // const unsubscribe = onSnapshot(
    //   doc(db, 'inspections', inspectionId),
    //   (snapshot) => {
    //     if (snapshot.exists()) {
    //       const data = snapshot.data();
    //       const status = data.status;
    //       setInspectionStatus(status);
    //       
    //       // 상태에 따른 진행률 계산
    //       let calculatedProgress = 0;
    //       if (status === 'pending') calculatedProgress = 0;
    //       else if (status === 'assigned') calculatedProgress = 25;
    //       else if (status === 'in_progress') calculatedProgress = 50;
    //       else if (status === 'completed') calculatedProgress = 100;
    //       
    //       setProgress(calculatedProgress);
    //       
    //       // 완료 시 검차 결과 화면으로 이동
    //       if (status === 'completed' && calculatedProgress === 100) {
    //         setTimeout(() => {
    //           onNavigate('SCR-0202', currentVehicleId);
    //         }, 2000);
    //       }
    //     }
    //   }
    // );
    // 
    // return () => unsubscribe();

    // Mock: 진행률 시뮬레이션
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // 완료 시 검차 결과 화면으로 이동
          setTimeout(() => {
            onNavigate('SCR-0202', currentVehicleId);
          }, 2000);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [inspectionId, currentVehicleId, onNavigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
       <div className="w-full max-w-md space-y-8">
          <div className="relative mx-auto w-24 h-24">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="44" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                <circle cx="48" cy="48" r="44" fill="none" stroke="#2563eb" strokeWidth="6" strokeDasharray={276} strokeDashoffset={276 - (276 * progress) / 100} className="transition-all duration-100 ease-linear" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold text-fmax-text-main">{progress}%</span>
             </div>
          </div>
          <div>
             <h2 className="text-xl font-bold text-fmax-text-main mb-2">AI 정밀 분석 중</h2>
             <p className="text-fmax-text-sub text-sm">차량 이미지를 분석하고 있습니다.<br/>gemini-3-pro-preview Model</p>
          </div>
          <div className="space-y-3 pt-2">
             {['평가사 출발 확인', '차량 검차 진행', '사진 업로드 (37+)', 'AI 상태 분석'].map((step, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm font-medium transition-colors ${progress > (i + 1) * 20 ? 'text-fmax-primary' : 'text-gray-300'}`}>
                   <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${progress > (i + 1) * 20 ? 'bg-fmax-primary border-fmax-primary text-white' : 'border-gray-200'}`}>
                      {progress > (i + 1) * 20 && <Check className="w-2.5 h-2.5" />}
                   </div>
                   {step}
                </div>
             ))}
          </div>
          {progress === 100 && (
             <Button className="w-full h-12 mt-6" onClick={() => onNavigate('SCR-0202', currentVehicleId)}>결과 확인</Button>
          )}
       </div>
    </div>
  );
};

// --- SCR-0202: Inspection Report Page ---
const InspectionReportPage = ({ onNavigate, vehicleId }: any) => {
  const [report, setReport] = useState<InspectionReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      if (vehicleId) {
        const r = MockDataService.getInspectionReport(vehicleId);
        setReport(r || null);
      } else {
        // vehicleId가 없으면 첫 번째 차량 리포트 사용 (임시)
        const vehicles = MockDataService.getMockVehicles();
        if (vehicles.length > 0) {
          const r = MockDataService.getInspectionReport(vehicles[0].id);
          setReport(r || null);
        }
      }
      setLoading(false);
    };
    loadReport();
  }, [vehicleId]);

  if (loading || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fmax-surface">
         <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-fmax-primary animate-spin mb-4" />
            <p className="text-sm text-fmax-text-sub">리포트를 생성하는 중입니다...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
       <header className="bg-white border-b border-fmax-border sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
           <button onClick={() => onNavigate('SCR-0100')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
             <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
           </button>
           <div>
             <h1 className="text-lg font-bold text-fmax-text-main">성능 평가 리포트</h1>
             <div className="flex items-center gap-2">
               <span className="text-xs text-fmax-text-sub">ID: {report.id}</span>
               <Badge variant="success">검차 완료</Badge>
             </div>
           </div>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={Printer}>인쇄</Button>
            <Button variant="outline" size="sm" icon={Share2}>공유</Button>
         </div>
       </header>

       <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8 pb-24">
          {/* AI Summary Card */}
          <div className="bg-white rounded-xl border border-fmax-primary/30 p-6 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-32 h-32 text-fmax-primary" />
             </div>
             <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 bg-fmax-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                   <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                   <h2 className="text-lg font-bold text-fmax-text-main mb-2">Gemini AI 종합 진단</h2>
                   <p className="text-fmax-text-main text-sm leading-relaxed mb-4">{report.summary}</p>
                   <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                         <h4 className="text-xs font-bold text-green-800 uppercase mb-2">Pros</h4>
                         <ul className="space-y-1">
                            {report.aiAnalysis.pros.map((p, i) => (
                               <li key={i} className="text-xs text-green-700 flex items-center gap-2"><Check className="w-3 h-3" /> {p}</li>
                            ))}
                         </ul>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                         <h4 className="text-xs font-bold text-red-800 uppercase mb-2">Cons</h4>
                         <ul className="space-y-1">
                            {report.aiAnalysis.cons.map((c, i) => (
                               <li key={i} className="text-xs text-red-700 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> {c}</li>
                            ))}
                         </ul>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex flex-col justify-center text-center">
                         <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">Market Verdict</h4>
                         <p className="text-xl font-black text-blue-600">{report.aiAnalysis.marketVerdict}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
             {/* Left: Score & Details */}
             <div className="space-y-6">
                <Card className="text-center py-8">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Overall Condition Score</p>
                   <div className="w-32 h-32 rounded-full border-[6px] border-fmax-primary flex items-center justify-center mx-auto mb-4 relative">
                      <span className="text-5xl font-black text-fmax-text-main">{report.score}</span>
                      <div className="absolute bottom-2 bg-white px-2">
                         <StarRating rating={4.5} />
                      </div>
                   </div>
                   <p className="text-sm font-medium text-fmax-text-sub">Based on 142 inspection points</p>
                </Card>

                <Card>
                   <h3 className="text-sm font-bold text-fmax-text-main mb-4 border-b pb-2">담당 평가사</h3>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
                         <img src="https://placehold.co/100x100" alt="Evaluator" className="w-full h-full object-cover" />
                      </div>
                      <div>
                         <p className="font-bold text-fmax-text-main">{report.evaluator.name}</p>
                         <p className="text-xs text-fmax-text-sub">Rating: {report.evaluator.rating}/5.0</p>
                      </div>
                      <Button size="sm" variant="outline" className="ml-auto text-xs">연락하기</Button>
                   </div>
                </Card>

                <Card>
                   <h3 className="text-sm font-bold text-fmax-text-main mb-4 border-b pb-2">상세 상태</h3>
                   <div className="space-y-4">
                      {Object.entries(report.condition).map(([key, value]: any) => (
                         <div key={key}>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">{key}</p>
                            <p className="text-sm text-fmax-text-main leading-snug">{value}</p>
                         </div>
                      ))}
                   </div>
                </Card>
             </div>

             {/* Right: Media Grid */}
             <div className="lg:col-span-2 space-y-8">
                {report.media.map((section, idx) => (
                   <div key={idx}>
                      <h3 className="text-lg font-bold text-fmax-text-main flex items-center gap-2 mb-4">
                         {section.category === 'Videos' ? <PlayCircle className="w-5 h-5 text-fmax-primary" /> : <ImageIcon className="w-5 h-5 text-fmax-primary" />}
                         {section.category} <span className="text-sm font-normal text-fmax-text-sub">({section.count})</span>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                         {section.items.map((item: any, i: number) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer border border-gray-200 hover:border-fmax-primary transition-all">
                               {item.type === 'video' ? (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white group-hover:bg-gray-800">
                                     <PlayCircle className="w-8 h-8 opacity-80" />
                                  </div>
                               ) : (
                                  <img src={item.url} alt={item.label} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                               )}
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                  <span className="text-white text-[10px] font-medium truncate w-full">{item.label}</span>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </main>

       {/* Next Action Footer */}
       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-fmax-border p-4 z-40 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
             <div className="text-xs text-fmax-text-sub hidden sm:block">
                <span className="font-bold text-fmax-text-main">검차 완료</span> · 판매 방식을 선택하여 매물을 등록하세요.
             </div>
             
             {/* Floating Navigation Arrow (Implemented as a main CTA) */}
             <div className="flex items-center gap-3 ml-auto">
               <span className="text-sm font-semibold text-fmax-primary animate-pulse">판매 등록 시작하기</span>
               <button 
                  onClick={() => onNavigate('SCR-0300', vehicleId)}
                  className="w-12 h-12 bg-fmax-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primaryHover hover:scale-105 transition-all"
               >
                  <ArrowRight className="w-6 h-6" />
               </button>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- SCR-0300: Sales Method Selection Page ---
const SalesMethodPage = ({ onNavigate, vehicleId }: any) => {
  const [selectedMethod, setSelectedMethod] = useState<'NORMAL' | 'AUCTION' | null>(null);
  const [currentVehicleId, setCurrentVehicleId] = useState<string | undefined>(vehicleId);

  useEffect(() => {
    // vehicleId가 없으면 첫 번째 차량 사용 (임시)
    if (!currentVehicleId) {
      const vehicles = MockDataService.getMockVehicles();
      if (vehicles.length > 0) {
        setCurrentVehicleId(vehicles[0].id);
      }
    }
  }, [vehicleId]);

  const handleNext = () => {
    if (selectedMethod === 'NORMAL' && currentVehicleId) onNavigate('SCR-0301-N', currentVehicleId);
    if (selectedMethod === 'AUCTION' && currentVehicleId) onNavigate('SCR-0401-A', currentVehicleId);
  };

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
       <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => onNavigate('SCR-0202', vehicleId)} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
          </button>
          <h1 className="text-lg font-bold text-fmax-text-main">판매 방식 선택</h1>
       </header>

       <main className="flex-grow p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
             {/* Auction Card */}
             <div 
                className={`bg-white rounded-2xl border p-8 transition-all cursor-pointer group relative overflow-hidden ${selectedMethod === 'AUCTION' ? 'border-fmax-primary ring-2 ring-fmax-primary/20 shadow-lg' : 'border-fmax-border hover:shadow-lg hover:border-fmax-primary/50'}`} 
                onClick={() => setSelectedMethod('AUCTION')}
             >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedMethod === 'AUCTION' ? 'bg-fmax-primary text-white' : 'bg-blue-50 text-fmax-primary group-hover:bg-blue-100'}`}>
                   <Gavel className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                   <h2 className="text-2xl font-bold text-fmax-text-main">경매 (Auction)</h2>
                   <p className="text-fmax-text-sub leading-relaxed">
                      글로벌 바이어들의 경쟁 입찰을 통해 최고가로 판매합니다. 빠른 회전율을 보장합니다.
                   </p>
                   <ul className="space-y-2 pt-2">
                      <li className="flex items-center gap-2 text-sm text-fmax-text-main"><Check className="w-4 h-4 text-fmax-primary" /> 48시간 내 판매 완료</li>
                      <li className="flex items-center gap-2 text-sm text-fmax-text-main"><Check className="w-4 h-4 text-fmax-primary" /> 경쟁 입찰로 가격 상승 유도</li>
                      <li className="flex items-center gap-2 text-sm text-fmax-text-main"><Check className="w-4 h-4 text-fmax-primary" /> 진행 중 입찰가 비공개 (Blind)</li>
                   </ul>
                </div>
             </div>

             {/* Fixed Price Card */}
             <div 
                className={`bg-white rounded-2xl border p-8 transition-all cursor-pointer group ${selectedMethod === 'NORMAL' ? 'border-fmax-primary ring-2 ring-fmax-primary/20 shadow-lg' : 'border-fmax-border hover:shadow-lg hover:border-fmax-primary/50'}`} 
                onClick={() => setSelectedMethod('NORMAL')}
             >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedMethod === 'NORMAL' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 group-hover:bg-green-100'}`}>
                   <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                   <h2 className="text-2xl font-bold text-fmax-text-main">일반 판매 (Fixed Price)</h2>
                   <p className="text-fmax-text-sub leading-relaxed">
                      원하는 가격을 설정하고 바이어의 제안을 받습니다. 가격 결정권이 딜러에게 있습니다.
                   </p>
                   <ul className="space-y-2 pt-2">
                      <li className="flex items-center gap-2 text-sm text-fmax-text-main"><Check className="w-4 h-4 text-green-600" /> 희망 판매가 직접 설정</li>
                      <li className="flex items-center gap-2 text-sm text-fmax-text-main"><Check className="w-4 h-4 text-green-600" /> 바이어 제안(Offer) 수락/거절</li>
                      <li className="flex items-center gap-2 text-sm text-fmax-text-main"><Check className="w-4 h-4 text-green-600" /> 언제든지 경매로 전환 가능</li>
                   </ul>
                </div>
             </div>
          </div>
       </main>
       
       <div className="sticky bottom-0 bg-white border-t border-fmax-border p-4">
          <div className="max-w-4xl mx-auto">
             <Button className="w-full h-12 text-lg" disabled={!selectedMethod} onClick={handleNext}>다음</Button>
          </div>
       </div>
    </div>
  );
};

// --- SCR-0400: Auction Detail Page ---
const AuctionDetailPage = ({ onNavigate, vehicleId }: any) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehicle = async () => {
      setLoading(true);
      let targetVehicleId = vehicleId;
      
      if (!targetVehicleId) {
        // vehicleId가 없으면 첫 번째 차량 사용 (임시)
        const vehicles = MockDataService.getMockVehicles();
        if (vehicles.length > 0) {
          targetVehicleId = vehicles[0].id;
        }
      }
      
      if (targetVehicleId) {
        const v = MockDataService.getVehicleById(targetVehicleId);
        setVehicle(v || null);
        if (v) {
          MockDataService.startAuction(targetVehicleId);
        }
      }
      setLoading(false);
    };
    loadVehicle();
  }, [vehicleId]);

  if (loading || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fmax-surface">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-fmax-primary mb-4" />
          <p className="text-sm text-fmax-text-sub">차량 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
       <header className="bg-white border-b border-fmax-border sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('SCR-0100')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
            </button>
            <h1 className="text-lg font-bold text-fmax-text-main">경매 상세 (Dealer View)</h1>
          </div>
          <div className="flex items-center gap-2">
             <Badge variant="neutral" className="px-3 py-1.5"><div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div> Live</Badge>
          </div>
       </header>

       <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Status Header */}
          <Card className="flex flex-col md:flex-row items-center justify-between gap-6 !p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none">
             <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="px-2.5 py-0.5 rounded bg-white/10 text-xs font-medium border border-white/10">Auction ID: #AUC-{vehicle.id}</span>
                   <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">Global Bidding</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{vehicle.modelYear} {vehicle.manufacturer} {vehicle.modelName}</h2>
                <p className="text-slate-400 text-sm">{vehicle.plateNumber} · {vehicle.vin}</p>
             </div>
             <div className="flex items-center gap-8">
                <div className="text-center">
                   <p className="text-xs text-slate-400 mb-1">Time Remaining</p>
                   <p className="text-3xl font-mono font-bold text-red-400">{vehicle.endTime || "47:59:59"}</p>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="text-center">
                   <p className="text-xs text-slate-400 mb-1">Current Bid (Blind)</p>
                   <p className="text-3xl font-bold">비공개</p>
                </div>
             </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
             {/* Left Column: Stats */}
             <div className="space-y-6">
                <Card>
                   <h3 className="text-sm font-bold text-fmax-text-main mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Activity Log</h3>
                   <div className="space-y-4">
                      <div className="flex items-start gap-3">
                         <div className="w-2 h-2 rounded-full bg-fmax-primary mt-2"></div>
                         <div>
                            <p className="text-sm font-medium text-fmax-text-main">New Bid Received</p>
                            <p className="text-xs text-fmax-text-sub">Just now · Buyer from Jordan</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                         <div>
                            <p className="text-sm font-medium text-fmax-text-main">New Bid Received</p>
                            <p className="text-xs text-fmax-text-sub">5 mins ago · Buyer from Russia</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
                         <div>
                            <p className="text-sm font-medium text-fmax-text-main">Auction Started</p>
                            <p className="text-xs text-fmax-text-sub">15 mins ago</p>
                         </div>
                      </div>
                   </div>
                </Card>

                <Card>
                   <h3 className="text-sm font-bold text-fmax-text-main mb-4">Price Settings</h3>
                   <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                         <span className="text-fmax-text-sub">Start Price</span>
                         <span className="font-bold text-fmax-text-main">$12,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-fmax-text-sub">Buy Now Price</span>
                         <span className="font-bold text-fmax-text-main">$15,500</span>
                      </div>
                   </div>
                </Card>
             </div>

             {/* Right Column: Actions & Info */}
             <div className="md:col-span-2 space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-4">
                   <Megaphone className="w-6 h-6 text-fmax-primary shrink-0" />
                   <div>
                      <h4 className="font-bold text-fmax-text-main text-sm">딜러님, 현재 경매가 활발하게 진행 중입니다.</h4>
                      <p className="text-xs text-fmax-text-sub mt-1 leading-relaxed">
                         경매 진행 중에는 현재 입찰가가 비공개(Blind) 처리됩니다. 경매가 종료되면 낙찰자와 최종 낙찰가가 공개됩니다.
                         예상보다 입찰이 저조할 경우, 일반 판매로 전환할 수 있습니다.
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <Button 
                     variant="outline" 
                     className="h-12" 
                     onClick={async () => {
                       // TODO: API 호출하여 판매 방식 변경 (FUNC-15, API-0300)
                       // await apiClient.trade.changeSaleMethod(vehicle.id, { start_price: 0, buy_now_price: 0 });
                       onNavigate('SCR-0300', vehicle.id);
                     }}
                   >
                     일반 판매로 전환
                   </Button>
                   <Button className="h-12" onClick={() => onNavigate('SCR-0100')}>대시보드로 이동</Button>
                </div>
                
                {/* Simulation Button for Demo */}
                <div className="border-t border-dashed border-gray-200 pt-6 mt-6">
                   <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Demo Actions (Buyer Simulation)</p>
                   <Button variant="secondary" className="w-full" onClick={() => { alert("Buyer clicked Buy Now! Auction Ended."); onNavigate('SCR-0100'); }}>
                      [Demo] 바이어 즉시구매 실행 (FUNC-19)
                   </Button>
                </div>
             </div>
          </div>
       </main>
    </div>
  );
};

// Helper for Star Rating
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      ))}
    </div>
  );
};

// Extra Icon for the Landing Page Heart
const HeartIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;

const SignupTermsPage = ({ onNavigate, onSkip }: any) => {
  const [agreements, setAgreements] = useState({ all: false, terms: false, privacy: false, marketing: false });
  const isNextEnabled = agreements.terms && agreements.privacy;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
           <h2 className="text-2xl font-bold text-fmax-text-main">약관 동의</h2>
           <p className="text-sm text-fmax-text-sub mt-1">서비스 이용을 위해 약관에 동의해주세요.</p>
        </div>
        <Card className="!p-6">
           <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3 cursor-pointer" onClick={() => setAgreements({all: !agreements.all, terms: !agreements.all, privacy: !agreements.all, marketing: !agreements.all})}>
                 <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreements.all ? 'bg-fmax-primary border-fmax-primary' : 'border-gray-300 bg-white'}`}>
                    {agreements.all && <Check className="w-3.5 h-3.5 text-white" />}
                 </div>
                 <span className="font-bold text-fmax-text-main text-sm">전체 약관 동의</span>
              </div>
              <hr className="border-gray-100" />
              <div className="space-y-3">
                 {[
                   { id: 'terms', l: "서비스 이용약관 동의", r: true },
                   { id: 'privacy', l: "개인정보 수집 및 이용 동의", r: true },
                   { id: 'marketing', l: "마케팅 정보 수신 동의 (선택)", r: false },
                 ].map((t) => (
                   <div key={t.id} className="flex items-center gap-3">
                      <input type="checkbox" checked={(agreements as any)[t.id]} onChange={(e) => setAgreements({...agreements, [t.id]: e.target.checked})} className="w-4 h-4 rounded border-gray-300 text-fmax-primary focus:ring-fmax-primary" />
                      <span className="text-sm text-fmax-text-main flex-1">{t.l} {t.r && <span className="text-fmax-primary text-xs ml-1">(필수)</span>}</span>
                      <button className="text-xs text-gray-400 underline">보기</button>
                   </div>
                 ))}
              </div>
           </div>
        </Card>
        <div className="flex flex-col gap-3">
          <Button className="h-11 w-full" disabled={!isNextEnabled} onClick={() => onNavigate('SCR-0002-2')}>다음</Button>
          <button onClick={onSkip} className="text-xs text-gray-400 hover:text-gray-600">Skip (Dev Only)</button>
        </div>
      </div>
    </div>
  );
};

const ApprovalStatusPage = ({ status, onNavigate }: any) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {status === 'pending' ? (
        <>
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-8 h-8 text-fmax-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-fmax-text-main mb-2">심사 중입니다</h2>
          <p className="text-fmax-text-sub text-sm max-w-xs mx-auto mb-8">
            제출하신 서류를 검토하고 있습니다.<br/>
            결과는 24시간 내에 문자로 안내됩니다.
          </p>
          {/* Added Demo Button to prevent user getting stuck */}
          <Button variant="outline" size="sm" className="mt-6 text-xs" onClick={() => onNavigate('SCR-0003-2')}>
             [데모용] 심사 완료 처리
          </Button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <Badge variant="success" className="mb-4">승인 완료</Badge>
          <h2 className="text-2xl font-bold text-fmax-text-main mb-2">가입이 승인되었습니다</h2>
          <p className="text-fmax-text-sub text-sm max-w-xs mx-auto mb-8">
            이제 포워드맥스의 모든 서비스를<br/>이용하실 수 있습니다.
          </p>
          <Button icon={ArrowRight} onClick={() => onNavigate('SCR-0100')} className="h-11 px-8">시작하기</Button>
        </>
      )}
    </div>
  );
};

// --- Main App Logic ---

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>( 'SCR-0000' );
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [currentVehicleId, setCurrentVehicleId] = useState<string | null>(null);

  const handleNavigate = (screen: Screen, vehicleId?: string) => {
    if (vehicleId) setCurrentVehicleId(vehicleId);
    if (screen === 'SCR-0200' && !vehicleId) setEditingVehicleId(null);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'SCR-0000': return <LandingPage onNavigate={handleNavigate} />;
      case 'SCR-0001': return <LoginPage onNavigate={handleNavigate} onLogin={() => handleNavigate('SCR-0100')} />;
      case 'SCR-0002':
      case 'SCR-0002-1': return <SignupTermsPage onNavigate={handleNavigate} onSkip={() => handleNavigate('SCR-0003-2')} />;
      case 'SCR-0002-2': return <SignupInfoPage onNavigate={handleNavigate} onSkip={() => handleNavigate('SCR-0003-2')} />;
      case 'SCR-0003-1': return <ApprovalStatusPage status="pending" onNavigate={handleNavigate} />;
      case 'SCR-0003-2': return <ApprovalStatusPage status="complete" onNavigate={handleNavigate} />;
      case 'SCR-0100': return <DashboardPage onNavigate={handleNavigate} />;
      case 'SCR-0101': return <VehicleListPage onNavigate={handleNavigate} />;
      case 'SCR-0102': return <GeneralSaleOffersPage onNavigate={handleNavigate} />;
      case 'SCR-0103': return <SalesHistoryPage onNavigate={handleNavigate} />;
      case 'SCR-0104': return <SettlementListPage onNavigate={handleNavigate} />;
      case 'SCR-0105': return <SettlementDetailPage onNavigate={handleNavigate} settlementId={currentVehicleId || undefined} />;
      case 'SCR-0200': return <RegisterVehiclePage onNavigate={handleNavigate} editingVehicleId={editingVehicleId} />;
      case 'SCR-0200-Draft': return <VehicleDraftListPage onNavigate={handleNavigate} onEdit={(id: any) => { setEditingVehicleId(id); handleNavigate('SCR-0200'); }} />;
      case 'SCR-0201': return <InspectionRequestPage onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
      case 'SCR-0201-Progress': return <InspectionStatusPage onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
      case 'SCR-0202': return <InspectionReportPage onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
      case 'SCR-0300': return <SalesMethodPage onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
      case 'SCR-0600': return <LogisticsSchedulePage onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
      case 'SCR-0601': return <LogisticsHistoryPage onNavigate={handleNavigate} />;
      case 'SCR-0301-N': return <GeneralSalePageLoading onNavigate={handleNavigate} />;
      case 'SCR-0302-N': return <GeneralSalePagePrice onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
      case 'SCR-0303-N': return <GeneralSalePageComplete onNavigate={handleNavigate} />;
      case 'SCR-0400': return <AuctionDetailPage onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
      case 'SCR-0401-A': return <AuctionSalePageStartPrice onNavigate={handleNavigate} />;
      case 'SCR-0402-A': return <AuctionSalePageDuration onNavigate={handleNavigate} />;
      case 'SCR-0403-A': return <AuctionSalePageComplete onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
      default: return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderScreen()}
      {currentScreen === 'SCR-0000' && (
        <div className="fixed bottom-6 right-6 z-[100]">
          <button 
            onClick={() => handleNavigate('SCR-0003-2')}
            className="group flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase rounded-full shadow-lg transition-all"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            Dev: Skip Flow
          </button>
        </div>
      )}
    </>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);