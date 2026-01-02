import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Timer,
  Phone,
  FileCheck,
  Signature
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
import { ToastProvider, useToast } from './src/components/ui/Toast';

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
  | 'SCR-0300-REQ' // Inspection Request (C-1)
  | 'SCR-0300-PROG' // Inspection Progress (C-2)
  | 'SCR-0300-RES' // Inspection Result (C-3)
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

const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon, readOnly = false, helperText, highlight = false, error, success, required = false, className="" }: any) => (
  <div className={`space-y-1.5 w-full ${className}`}>
    {label && (
      <label className="block text-sm font-semibold text-fmax-text-secondary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fmax-text-sub">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <input
        type={type}
        className={`
          block w-full rounded-lg border transition-all text-sm py-2.5 px-3
          ${Icon ? 'pl-10' : ''}
          ${error 
            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
            : success
              ? 'border-green-300 bg-green-50/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
              : 'border-fmax-border bg-white focus:border-fmax-primary focus:ring-2 focus:ring-fmax-primary/20'
          }
          ${readOnly ? 'bg-gray-50 text-fmax-text-sub cursor-not-allowed' : ''}
          ${highlight ? 'ring-2 ring-fmax-primary/20 bg-blue-50/30' : ''}
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
      />
      {success && (
        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
      )}
      {error && (
        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>
    )}
    {helperText && !error && <p className="text-xs text-fmax-text-sub">{helperText}</p>}
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

// --- SCR-0002-Wizard: Dealer Signup Wizard (4-Step Flow) ---
const SignupWizard = ({ onNavigate }: any) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Identity Verification
  const [step1Data, setStep1Data] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    authCode: '',
    socialAuth: null as string | null
  });

  // Step 2: Dealer Authentication
  const [step2Data, setStep2Data] = useState({
    // Business Info
    businessRegNo: '',
    businessRegImage: null as File | null,
    representativeName: '',
    businessAddress: '',
    businessCategory: '',
    businessType: '',
    vatTaxType: '',
    businessPhone: '',
    // Dealership Info
    dealershipRegCert: null as File | null,
    dealershipName: '',
    employeeCardNo: '',
    employeeCardPhoto: null as File | null,
    dealershipRegImage: null as File | null,
    falseSalePledgeSignature: null as string | null,
    associationMember: false,
    // KYC/AML
    phoneAuthVerified: false,
    idCardImage: null as File | null,
    vatInvoiceEmail: ''
  });

  // Step 3: Terms Agreement
  const [step3Data, setStep3Data] = useState({
    allAgreed: false,
    terms: false,
    privacy: false,
    marketing: false,
    thirdParty: false,
    electronicSignature: false,
    sensitiveInfoAgreed: null as boolean | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload handlers
  const handleFileUpload = (field: string, file: File | null) => {
    setStep2Data(prev => ({ ...prev, [field]: file }));
  };

  // Step validation
  const canProceedStep1 = step1Data.email && step1Data.password && step1Data.passwordConfirm && 
                          step1Data.password === step1Data.passwordConfirm && 
                          step1Data.name && step1Data.phone;
  const canProceedStep2 = step2Data.businessRegNo && step2Data.representativeName && 
                          step2Data.businessAddress && step2Data.dealershipName;
  const canProceedStep3 = step3Data.terms && step3Data.privacy;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare form data for submission
      const formDataToSubmit = new FormData();
      
      // Step 1 data
      formDataToSubmit.append('email', step1Data.email);
      formDataToSubmit.append('password', step1Data.password);
      formDataToSubmit.append('name', step1Data.name);
      formDataToSubmit.append('phone', step1Data.phone);
      if (step1Data.socialAuth) {
        formDataToSubmit.append('socialAuth', step1Data.socialAuth);
      }
      
      // Step 2 data - Business Info
      formDataToSubmit.append('businessRegNo', step2Data.businessRegNo);
      formDataToSubmit.append('representativeName', step2Data.representativeName);
      formDataToSubmit.append('businessAddress', step2Data.businessAddress);
      formDataToSubmit.append('businessCategory', step2Data.businessCategory);
      formDataToSubmit.append('businessType', step2Data.businessType);
      formDataToSubmit.append('businessPhone', step2Data.businessPhone);
      formDataToSubmit.append('vatTaxType', step2Data.vatTaxType);
      
      // Step 2 data - Dealership Info
      formDataToSubmit.append('dealershipName', step2Data.dealershipName);
      formDataToSubmit.append('employeeCardNo', step2Data.employeeCardNo);
      formDataToSubmit.append('associationMember', String(step2Data.associationMember));
      if (step2Data.falseSalePledgeSignature) {
        formDataToSubmit.append('falseSalePledgeSignature', step2Data.falseSalePledgeSignature);
      }
      
      // Step 2 data - KYC
      formDataToSubmit.append('vatInvoiceEmail', step2Data.vatInvoiceEmail);
      formDataToSubmit.append('phoneAuthVerified', String(step2Data.phoneAuthVerified));
      
      // Step 2 files
      if (step2Data.businessRegImage) {
        formDataToSubmit.append('businessRegImage', step2Data.businessRegImage);
      }
      if (step2Data.dealershipRegCert) {
        formDataToSubmit.append('dealershipRegCert', step2Data.dealershipRegCert);
      }
      if (step2Data.employeeCardPhoto) {
        formDataToSubmit.append('employeeCardPhoto', step2Data.employeeCardPhoto);
      }
      if (step2Data.dealershipRegImage) {
        formDataToSubmit.append('dealershipRegImage', step2Data.dealershipRegImage);
      }
      if (step2Data.idCardImage) {
        formDataToSubmit.append('idCardImage', step2Data.idCardImage);
      }
      
      // Step 3 data - Terms
      formDataToSubmit.append('termsAgreed', String(step3Data.terms));
      formDataToSubmit.append('privacyAgreed', String(step3Data.privacy));
      formDataToSubmit.append('marketingAgreed', String(step3Data.marketing));
      formDataToSubmit.append('thirdPartyAgreed', String(step3Data.thirdParty));
      formDataToSubmit.append('electronicSignatureAgreed', String(step3Data.electronicSignature));
      formDataToSubmit.append('sensitiveInfoAgreed', String(step3Data.sensitiveInfoAgreed || false));
      
      // Submit to backend API
      // Note: This will need a backend endpoint that accepts FormData
      // For now, we'll navigate to pending approval
      // await apiClient.member.register(formDataToSubmit);
      
      // Navigate to pending approval
      onNavigate('SCR-0003-1');
    } catch (error) {
      console.error('Signup submission failed:', error);
      // TODO: Show error toast to user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common GNB Component
  const CommonGNB = () => (
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
            <p className="text-sm font-bold text-fmax-text-main">회원가입</p>
            <p className="text-xs text-fmax-text-sub">Sign Up</p>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-white">
      <CommonGNB />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-h1 text-fmax-text-main mb-8 text-center">회원가입</h1>
        
        {/* Step Indicator */}
        <div 
          className="flex items-center justify-center mb-8 md:mb-12 gap-1 md:gap-2"
          role="progressbar" 
          aria-valuenow={currentStep} 
          aria-valuemin={1} 
          aria-valuemax={4}
          aria-label={`회원가입 진행 단계: ${currentStep}단계 중 ${currentStep}단계`}
        >
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 ${
                  step === currentStep 
                    ? 'bg-fmax-primary text-white scale-110 shadow-lg ring-2 ring-fmax-primary/20' 
                    : step < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}
                aria-label={`${step}단계`}
              >
                {step < currentStep ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-8 md:w-16 h-1 transition-all duration-300 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <div key={currentStep} className="animate-fade-in">
            {currentStep === 1 && (
              <SignupStep1 
                data={step1Data} 
                setData={setStep1Data}
                canProceed={canProceedStep1}
              />
            )}
            {currentStep === 2 && (
              <SignupStep2 
                data={step2Data} 
                setData={setStep2Data}
                canProceed={canProceedStep2}
                onFileUpload={handleFileUpload}
              />
            )}
            {currentStep === 3 && (
              <SignupStep3 
                data={step3Data} 
                setData={setStep3Data}
                canProceed={canProceedStep3}
              />
            )}
            {currentStep === 4 && (
              <SignupStep4 onNavigate={onNavigate} />
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        {currentStep < 4 && (
          <div className="max-w-4xl mx-auto mt-8">
            {/* Dev Skip Button */}
            <div className="mb-3 flex justify-end">
              <button
                onClick={() => {
                  if (currentStep < 4) setCurrentStep(currentStep + 1);
                }}
                className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
                title="개발용: 검증 없이 다음 단계로 이동"
              >
                [DEV] 스킵 →
              </button>
            </div>
            
            <div className="flex items-center justify-between bg-gray-100 px-8 py-4 rounded-lg">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && currentStep > 1) {
                    e.preventDefault();
                    handlePrev();
                  }
                }}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fmax-primary focus:ring-offset-2 ${
                  currentStep === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-fmax-text-main hover:bg-gray-200 bg-white active:scale-[0.98]'
                }`}
                aria-label="이전 단계로 이동"
              >
                이전페이지
              </button>
              <button
                onClick={currentStep === 3 ? handleSubmit : handleNext}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    const canProceed = 
                      (currentStep === 1 && canProceedStep1) ||
                      (currentStep === 2 && canProceedStep2) ||
                      (currentStep === 3 && canProceedStep3);
                    if (canProceed && !isSubmitting) {
                      e.preventDefault();
                      if (currentStep === 3) handleSubmit();
                      else handleNext();
                    }
                  }
                }}
                disabled={
                  (currentStep === 1 && !canProceedStep1) ||
                  (currentStep === 2 && !canProceedStep2) ||
                  (currentStep === 3 && !canProceedStep3) ||
                  isSubmitting
                }
                className={`px-8 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fmax-primary focus:ring-offset-2 ${
                  (currentStep === 1 && !canProceedStep1) ||
                  (currentStep === 2 && !canProceedStep2) ||
                  (currentStep === 3 && !canProceedStep3)
                    ? 'text-gray-400 cursor-not-allowed bg-gray-200'
                    : 'bg-fmax-primary text-white hover:bg-fmax-primary-hover shadow-md hover:shadow-lg active:scale-[0.98] transform hover:-translate-y-0.5'
                }`}
                aria-label={currentStep === 3 ? '회원가입 제출' : '다음 단계로 진행'}
              >
                {isSubmitting ? '제출 중...' : currentStep === 3 ? '제출하기' : '다음페이지'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Step 1: Identity Verification Component
const SignupStep1 = ({ data, setData, canProceed }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [authCodeSent, setAuthCodeSent] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16">
        {/* Left: Step Info */}
        <div className="w-full md:w-56 flex-shrink-0">
          {/* Step Number Badge */}
          <div className="w-12 h-12 bg-fmax-primary/10 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-fmax-primary">1</span>
          </div>
          <div className="text-xs text-fmax-text-sub mb-3 font-medium uppercase tracking-wider">Step 1 of 4</div>
          <h2 className="text-h2 text-fmax-text-main mb-4">개인인증</h2>
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-fmax-primary transition-all duration-500" style={{ width: '25%' }} />
          </div>
          {/* Guide Text */}
          <p className="text-xs text-fmax-text-sub leading-relaxed">
            다음 단계로 진행하려면<br/>
            모든 필수 항목을 입력해주세요.
          </p>
        </div>

        {/* Right: Form */}
        <div className="flex-1 space-y-6">
          {/* Account Info Section */}
          <div className="space-y-4">
            <Input
              label="이메일"
              type="email"
              placeholder="email@example.com"
              value={data.email}
              onChange={(e: any) => setData({ ...data, email: e.target.value })}
              icon={Mail}
            />
            <div className="relative">
              <Input
                label="비밀번호"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={data.password}
                onChange={(e: any) => setData({ ...data, password: e.target.value })}
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-fmax-text-sub hover:text-fmax-text-main"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Input
              label="비밀번호 재입력"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 다시 입력하세요"
              value={data.passwordConfirm}
              onChange={(e: any) => setData({ ...data, passwordConfirm: e.target.value })}
              icon={Lock}
            />
            {data.password && data.passwordConfirm && data.password !== data.passwordConfirm && (
              <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다</p>
            )}
          </div>

          {/* Personal Auth Section */}
          <div className="space-y-4 pt-4 border-t border-fmax-border">
            <Input
              label="이름"
              placeholder="이름을 입력하세요"
              value={data.name}
              onChange={(e: any) => setData({ ...data, name: e.target.value })}
              icon={User}
            />
            <div className="flex gap-3">
              <Input
                label="휴대전화"
                placeholder="010-0000-0000"
                value={data.phone}
                onChange={(e: any) => setData({ ...data, phone: e.target.value })}
                icon={Phone}
                className="flex-1"
              />
              <button
                onClick={() => {
                  // Mock: Send auth code
                  setAuthCodeSent(true);
                  setTimeout(() => setAuthCodeSent(false), 3000);
                }}
                disabled={!data.phone || authCodeSent}
                className={`mt-7 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  authCodeSent
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : data.phone
                      ? 'bg-fmax-primary text-white hover:bg-fmax-primary-hover shadow-sm'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {authCodeSent ? '✓ 전송완료' : '인증번호 전송'}
              </button>
            </div>
            {authCodeSent && (
              <Input
                label="인증번호"
                placeholder="인증번호를 입력하세요"
                value={data.authCode}
                onChange={(e: any) => setData({ ...data, authCode: e.target.value })}
              />
            )}
            
            {/* Social Auth */}
            <div className="pt-6">
              <label className="block text-sm font-semibold text-fmax-text-secondary mb-4">
                소셜 인증(Pass등)
              </label>
              <div className="flex gap-4">
                {['Pass', 'Kakao', 'Naver', 'Google'].map((provider) => (
                  <button
                    key={provider}
                    onClick={() => setData({ ...data, socialAuth: provider })}
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all ${
                      data.socialAuth === provider
                        ? 'border-fmax-primary bg-fmax-primary text-white shadow-md scale-105'
                        : 'border-gray-300 bg-white text-gray-500 hover:border-fmax-primary/50 hover:scale-105'
                    }`}
                  >
                    {provider.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Dealer Authentication Component
const SignupStep2 = ({ data, setData, canProceed, onFileUpload }: any) => {
  const fileInputRefs = {
    businessReg: useRef<HTMLInputElement>(null),
    dealershipReg: useRef<HTMLInputElement>(null),
    employeeCard: useRef<HTMLInputElement>(null),
    dealershipRegImage: useRef<HTMLInputElement>(null),
    idCard: useRef<HTMLInputElement>(null)
  };
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isVerifyingBusiness, setIsVerifyingBusiness] = useState(false);

  useEffect(() => {
    // Initialize canvas context
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#373EEF';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const handleFileSelect = (field: string, ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(field, file);
    }
  };

  const handleSignatureStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#373EEF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleSignatureMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const handleSignatureEnd = () => {
    setIsDrawing(false);
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      setData({ ...data, falseSalePledgeSignature: signatureData });
    }
  };

  const handleVerifyBusiness = async () => {
    if (!data.businessRegNo) return;
    setIsVerifyingBusiness(true);
    try {
      // TODO: Call verifyBusinessAPI when businessRegImage is uploaded
      // For now, mock verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsVerifyingBusiness(false);
      // In real implementation:
      // if (data.businessRegImage) {
      //   const result = await apiClient.member.verifyBusiness(data.businessRegImage);
      //   // Auto-fill business info if available
      // }
    } catch (error) {
      console.error('Business verification failed:', error);
      setIsVerifyingBusiness(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16">
        <div className="w-full md:w-56 flex-shrink-0">
          {/* Step Number Badge */}
          <div className="w-12 h-12 bg-fmax-primary/10 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-fmax-primary">2</span>
          </div>
          <div className="text-xs text-fmax-text-sub mb-3 font-medium uppercase tracking-wider">Step 2 of 4</div>
          <h2 className="text-h2 text-fmax-text-main mb-4">딜러 인증</h2>
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-fmax-primary transition-all duration-500" style={{ width: '50%' }} />
          </div>
          {/* Guide Text */}
          <p className="text-xs text-fmax-text-sub leading-relaxed">
            사업자 정보와 딜러 인증 서류를<br/>
            준비하여 업로드해주세요.
          </p>
        </div>

        <div className="flex-1 space-y-10">
          {/* Section 1: Business Info */}
          <div>
            <h3 className="text-lg font-bold text-fmax-text-main mb-4">1. 사업자 필수 정보 입력</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  label="사업자 등록번호"
                  placeholder="000-00-00000"
                  value={data.businessRegNo}
                  onChange={(e: any) => setData({ ...data, businessRegNo: e.target.value })}
                  icon={FileText}
                  className="flex-1"
                />
                <button
                  onClick={handleVerifyBusiness}
                  disabled={!data.businessRegNo || isVerifyingBusiness}
                  className={`mt-7 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shadow-sm ${
                    isVerifyingBusiness
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : data.businessRegNo
                        ? 'bg-fmax-primary text-white hover:bg-fmax-primary-hover'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isVerifyingBusiness ? '확인 중...' : '확인'}
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-fmax-text-secondary mb-2">
                  사업자등록증 이미지 <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => handleFileSelect('businessRegImage', fileInputRefs.businessReg)}
                  className={`
                    border-2 border-dashed rounded-lg p-8 md:p-10 text-center cursor-pointer
                    transition-all duration-200 group relative overflow-hidden
                    ${data.businessRegImage 
                      ? 'border-green-300 bg-green-50/30' 
                      : 'border-gray-300 hover:border-fmax-primary/50 hover:bg-blue-50/30'
                    }
                  `}
                >
                  {/* 배경 그라데이션 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-fmax-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <input
                    type="file"
                    ref={fileInputRefs.businessReg}
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('businessRegImage', e)}
                  />
                  {data.businessRegImage ? (
                    <div className="flex flex-col items-center justify-center gap-3 relative z-10">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-sm text-fmax-text-main font-medium">
                        {data.businessRegImage.name}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileUpload('businessRegImage', null);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        파일 제거
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4 group-hover:text-fmax-primary transition-colors relative z-10" />
                      <span className="text-sm text-gray-500 group-hover:text-fmax-text-main font-medium relative z-10">
                        클릭하여 파일 업로드
                      </span>
                      <span className="text-xs text-gray-400 mt-2 relative z-10">
                        JPG, PNG, PDF (최대 10MB)
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Input
                label="대표자명"
                placeholder="대표자 이름"
                value={data.representativeName}
                onChange={(e: any) => setData({ ...data, representativeName: e.target.value })}
                icon={User}
              />

              <div className="flex gap-3">
                <Input
                  label="사업장 주소"
                  placeholder="주소를 검색하세요"
                  value={data.businessAddress}
                  onChange={(e: any) => setData({ ...data, businessAddress: e.target.value })}
                  icon={MapPin}
                  className="flex-1"
                />
                <button className="mt-7 px-5 py-2.5 bg-gray-100 text-fmax-text-main rounded-lg hover:bg-gray-200 text-sm font-medium whitespace-nowrap transition-colors border border-gray-200">
                  주소등록
                </button>
              </div>

              <Input
                label="업태/종목"
                placeholder="업태/종목을 입력하세요"
                value={data.businessCategory}
                onChange={(e: any) => setData({ ...data, businessCategory: e.target.value })}
              />

              <Input
                label="사업자 정보 선택"
                placeholder="선택하세요"
                value={data.businessType}
                onChange={(e: any) => setData({ ...data, businessType: e.target.value })}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-fmax-border">
              <h4 className="text-sm font-semibold text-fmax-text-secondary mb-4">선택정보 입력</h4>
              <div className="space-y-4">
                <Input
                  label="부가가치세 과세 유형"
                  placeholder="선택하세요"
                  value={data.vatTaxType}
                  onChange={(e: any) => setData({ ...data, vatTaxType: e.target.value })}
                />
                <Input
                  label="사업장 전화번호"
                  placeholder="02-0000-0000"
                  value={data.businessPhone}
                  onChange={(e: any) => setData({ ...data, businessPhone: e.target.value })}
                  icon={Phone}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dealership Info */}
          <div className="pt-8 border-t border-fmax-border">
            <h3 className="text-lg font-bold text-fmax-text-main mb-4">2. 중고차 매매업 관련 인증</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-fmax-text-secondary mb-2">
                  중고차 매매업 등록증 <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => handleFileSelect('dealershipRegCert', fileInputRefs.dealershipReg)}
                  className={`
                    border-2 border-dashed rounded-lg p-8 md:p-10 text-center cursor-pointer
                    transition-all duration-200 group relative overflow-hidden
                    ${data.dealershipRegCert 
                      ? 'border-green-300 bg-green-50/30' 
                      : 'border-gray-300 hover:border-fmax-primary/50 hover:bg-blue-50/30'
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fmax-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="file"
                    ref={fileInputRefs.dealershipReg}
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('dealershipRegCert', e)}
                  />
                  {data.dealershipRegCert ? (
                    <div className="flex flex-col items-center justify-center gap-3 relative z-10">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-sm text-fmax-text-main font-medium">
                        {data.dealershipRegCert.name}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileUpload('dealershipRegCert', null);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        파일 제거
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4 group-hover:text-fmax-primary transition-colors relative z-10" />
                      <span className="text-sm text-gray-500 group-hover:text-fmax-text-main font-medium relative z-10">
                        클릭하여 파일 업로드
                      </span>
                      <span className="text-xs text-gray-400 mt-2 relative z-10">
                        JPG, PNG, PDF (최대 10MB)
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Input
                label="매매 상사명"
                placeholder="매매 상사명을 입력하세요"
                value={data.dealershipName}
                onChange={(e: any) => setData({ ...data, dealershipName: e.target.value })}
                icon={Building}
              />

              <div>
                <label className="block text-sm font-semibold text-fmax-text-secondary mb-2">
                  매매 사원증 번호 / 사진
                </label>
                <Input
                  placeholder="사원증 번호를 입력하세요"
                  value={data.employeeCardNo}
                  onChange={(e: any) => setData({ ...data, employeeCardNo: e.target.value })}
                  className="mb-2"
                />
                <div
                  onClick={() => handleFileSelect('employeeCardPhoto', fileInputRefs.employeeCard)}
                  className={`
                    border-2 border-dashed rounded-lg p-8 md:p-10 text-center cursor-pointer
                    transition-all duration-200 group relative overflow-hidden
                    ${data.employeeCardPhoto 
                      ? 'border-green-300 bg-green-50/30' 
                      : 'border-gray-300 hover:border-fmax-primary/50 hover:bg-blue-50/30'
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fmax-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="file"
                    ref={fileInputRefs.employeeCard}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange('employeeCardPhoto', e)}
                  />
                  {data.employeeCardPhoto ? (
                    <div className="flex flex-col items-center justify-center gap-3 relative z-10">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-sm text-fmax-text-main font-medium">
                        {data.employeeCardPhoto.name}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileUpload('employeeCardPhoto', null);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        파일 제거
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4 group-hover:text-fmax-primary transition-colors relative z-10" />
                      <span className="text-sm text-gray-500 group-hover:text-fmax-text-main font-medium relative z-10">
                        클릭하여 파일 업로드
                      </span>
                      <span className="text-xs text-gray-400 mt-2 relative z-10">
                        JPG, PNG (최대 10MB)
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-fmax-text-secondary mb-2">
                  매매업 등록증 이미지 <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => handleFileSelect('dealershipRegImage', fileInputRefs.dealershipRegImage)}
                  className={`
                    border-2 border-dashed rounded-lg p-8 md:p-10 text-center cursor-pointer
                    transition-all duration-200 group relative overflow-hidden
                    ${data.dealershipRegImage 
                      ? 'border-green-300 bg-green-50/30' 
                      : 'border-gray-300 hover:border-fmax-primary/50 hover:bg-blue-50/30'
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fmax-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="file"
                    ref={fileInputRefs.dealershipRegImage}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange('dealershipRegImage', e)}
                  />
                  {data.dealershipRegImage ? (
                    <div className="flex flex-col items-center justify-center gap-3 relative z-10">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-sm text-fmax-text-main font-medium">
                        {data.dealershipRegImage.name}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileUpload('dealershipRegImage', null);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        파일 제거
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4 group-hover:text-fmax-primary transition-colors relative z-10" />
                      <span className="text-sm text-gray-500 group-hover:text-fmax-text-main font-medium relative z-10">
                        클릭하여 파일 업로드
                      </span>
                      <span className="text-xs text-gray-400 mt-2 relative z-10">
                        JPG, PNG (최대 10MB)
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-fmax-text-secondary mb-3">
                  허위매물 근절 서약서(전자서명)
                </label>
                <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50/50">
                  <canvas
                    ref={signatureCanvasRef}
                    width={600}
                    height={200}
                    className="border-2 border-gray-200 rounded-lg cursor-crosshair w-full bg-white shadow-inner"
                    onMouseDown={handleSignatureStart}
                    onMouseMove={handleSignatureMove}
                    onMouseUp={handleSignatureEnd}
                    onMouseLeave={handleSignatureEnd}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-fmax-text-sub">위 영역에 서명해주세요</p>
                    {data.falseSalePledgeSignature && (
                      <button
                        onClick={() => {
                          const canvas = signatureCanvasRef.current;
                          if (canvas) {
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                              ctx.clearRect(0, 0, canvas.width, canvas.height);
                              setData({ ...data, falseSalePledgeSignature: null });
                            }
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      >
                        서명 지우기
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-fmax-text-secondary mb-2">
                  협회/조합 회원 여부
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="associationMember"
                      checked={data.associationMember === true}
                      onChange={() => setData({ ...data, associationMember: true })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-fmax-text-main">예</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="associationMember"
                      checked={data.associationMember === false}
                      onChange={() => setData({ ...data, associationMember: false })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-fmax-text-main">아니오</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: KYC/AML */}
          <div className="pt-8 border-t border-fmax-border">
            <h3 className="text-lg font-bold text-fmax-text-main mb-4">4. 위험 관리(KYC/AML) 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-fmax-text-secondary mb-2">
                  휴대폰 본인 인증
                </label>
                <button className="w-full px-4 py-3 bg-gray-100 text-fmax-text-main rounded-lg hover:bg-gray-200 text-sm font-medium">
                  본인 인증하기
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-fmax-text-secondary mb-2">
                  신분증(면허증/주민증) <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => handleFileSelect('idCardImage', fileInputRefs.idCard)}
                  className={`
                    border-2 border-dashed rounded-lg p-8 md:p-10 text-center cursor-pointer
                    transition-all duration-200 group relative overflow-hidden
                    ${data.idCardImage 
                      ? 'border-green-300 bg-green-50/30' 
                      : 'border-gray-300 hover:border-fmax-primary/50 hover:bg-blue-50/30'
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fmax-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="file"
                    ref={fileInputRefs.idCard}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange('idCardImage', e)}
                  />
                  {data.idCardImage ? (
                    <div className="flex flex-col items-center justify-center gap-3 relative z-10">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-sm text-fmax-text-main font-medium">
                        {data.idCardImage.name}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileUpload('idCardImage', null);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        파일 제거
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4 group-hover:text-fmax-primary transition-colors relative z-10" />
                      <span className="text-sm text-gray-500 group-hover:text-fmax-text-main font-medium relative z-10">
                        클릭하여 파일 업로드
                      </span>
                      <span className="text-xs text-gray-400 mt-2 relative z-10">
                        JPG, PNG (최대 10MB)
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Input
                label="부가세계산서 이메일 주소"
                type="email"
                placeholder="vat@example.com"
                value={data.vatInvoiceEmail}
                onChange={(e: any) => setData({ ...data, vatInvoiceEmail: e.target.value })}
                icon={Mail}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Terms of Service Component
const SignupStep3 = ({ data, setData, canProceed }: any) => {
  const handleSelectAll = () => {
    const newAllAgreed = !data.allAgreed;
    setData({
      ...data,
      allAgreed: newAllAgreed,
      terms: newAllAgreed,
      privacy: newAllAgreed,
      marketing: newAllAgreed,
      thirdParty: newAllAgreed,
      electronicSignature: newAllAgreed,
      sensitiveInfoAgreed: newAllAgreed ? true : null
    });
  };

  const handleCheckboxChange = (field: string, value: boolean) => {
    setData({ ...data, [field]: value });
    // Update allAgreed based on required fields
    if (field === 'terms' || field === 'privacy') {
      const newAllAgreed = (field === 'terms' ? value : data.terms) && 
                           (field === 'privacy' ? value : data.privacy);
      setData({ ...data, [field]: value, allAgreed: newAllAgreed });
    } else {
      setData({ ...data, [field]: value });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16">
        <div className="w-full md:w-56 flex-shrink-0">
          {/* Step Number Badge */}
          <div className="w-12 h-12 bg-fmax-primary/10 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-fmax-primary">3</span>
          </div>
          <div className="text-xs text-fmax-text-sub mb-3 font-medium uppercase tracking-wider">Step 3 of 4</div>
          <h2 className="text-h2 text-fmax-text-main mb-4">이용약관 동의</h2>
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-fmax-primary transition-all duration-500" style={{ width: '75%' }} />
          </div>
          {/* Guide Text */}
          <p className="text-xs text-fmax-text-sub leading-relaxed">
            서비스 이용을 위한<br/>
            필수 약관에 동의해주세요.
          </p>
        </div>

        <div className="flex-1 space-y-6">
          {/* Select All */}
          <div className="p-5 bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={handleSelectAll}>
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
              data.allAgreed ? 'bg-fmax-primary border-fmax-primary shadow-sm' : 'border-gray-300 bg-white'
            }`}>
              {data.allAgreed && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className="font-bold text-fmax-text-main text-base">전체동의</span>
          </div>

          <div className="p-5 bg-blue-50/50 rounded-lg border border-blue-100 text-sm text-fmax-text-sub leading-relaxed">
            민간정보 수집이용, 개인정보의 수집 및 이용, 온라인신청 서비스 정책, 고유식별정보 수집 및 이용 항목에 대해 모두 동의합니다. 각 사항에 대한 동의 여부를 개별적으로 선택하실 수 있으며, 선택 동의 사항에 대한 동의를 거부하여도 서비스를 이용하실 수 있습니다.
          </div>

          {/* Required Terms */}
          <div>
            <h4 className="text-base font-bold text-fmax-text-main mb-4 flex items-center gap-2">
              <span className="text-red-500">[필수]</span>
              <span>약관</span>
            </h4>
            <div className="border-2 border-gray-200 rounded-lg p-6 mb-5 min-h-[200px] max-h-[300px] overflow-y-auto bg-gray-50 shadow-inner">
              <p className="text-sm text-fmax-text-sub leading-relaxed">
                서비스 이용약관 내용이 여기에 표시됩니다. 실제 약관 텍스트는 백엔드에서 가져와야 합니다.
              </p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.terms}
                  onChange={(e) => handleCheckboxChange('terms', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-fmax-primary focus:ring-fmax-primary"
                />
                <span className="text-sm text-fmax-text-main">만 14세 이상 동의</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.terms}
                  onChange={(e) => handleCheckboxChange('terms', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-fmax-primary focus:ring-fmax-primary"
                />
                <span className="text-sm text-fmax-text-main">서비스 이용약관 동의</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.privacy}
                  onChange={(e) => handleCheckboxChange('privacy', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-fmax-primary focus:ring-fmax-primary"
                />
                <span className="text-sm text-fmax-text-main">개인정보 처리방침 동의</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.marketing}
                  onChange={(e) => handleCheckboxChange('marketing', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-fmax-primary focus:ring-fmax-primary"
                />
                <span className="text-sm text-fmax-text-main">마케팅 정보 수신 동의</span>
              </label>
            </div>
          </div>

          {/* Optional Terms */}
          <div>
            <h4 className="text-base font-bold text-fmax-text-main mb-4 flex items-center gap-2">
              <span className="text-blue-500">[선택]</span>
              <span>약관</span>
            </h4>
            <div className="border-2 border-gray-200 rounded-lg p-6 mb-5 min-h-[200px] max-h-[300px] overflow-y-auto bg-gray-50 shadow-inner">
              <p className="text-sm text-fmax-text-sub leading-relaxed">
                선택 약관 내용이 여기에 표시됩니다.
              </p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.thirdParty}
                  onChange={(e) => handleCheckboxChange('thirdParty', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-fmax-primary focus:ring-fmax-primary"
                />
                <span className="text-sm text-fmax-text-main">제3자 제공 동의(관세사·결제사 등)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.electronicSignature}
                  onChange={(e) => handleCheckboxChange('electronicSignature', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-fmax-primary focus:ring-fmax-primary"
                />
                <span className="text-sm text-fmax-text-main">전자서명 동의(계약서 발행용)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.marketing}
                  onChange={(e) => handleCheckboxChange('marketing', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-fmax-primary focus:ring-fmax-primary"
                />
                <span className="text-sm text-fmax-text-main">마케팅 알림 수신 동의(선택)</span>
              </label>
            </div>
          </div>

          {/* Sensitive Info Terms */}
          <div>
            <h4 className="text-base font-bold text-fmax-text-main mb-4">민감정보 관련 약관</h4>
            <div className="border-2 border-gray-200 rounded-lg p-6 mb-5 min-h-[100px] max-h-[150px] overflow-y-auto bg-gray-50 shadow-inner">
              <p className="text-sm text-fmax-text-sub leading-relaxed">
                민감정보 관련 약관 내용이 여기에 표시됩니다.
              </p>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sensitiveInfo"
                  checked={data.sensitiveInfoAgreed === false}
                  onChange={() => setData({ ...data, sensitiveInfoAgreed: false })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-fmax-text-main">동의안함</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sensitiveInfo"
                  checked={data.sensitiveInfoAgreed === true}
                  onChange={() => setData({ ...data, sensitiveInfoAgreed: true })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-fmax-text-main">동의함</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Approval Status Component
const SignupStep4 = ({ onNavigate }: any) => {
  const [status, setStatus] = useState<'pending' | 'complete'>('pending');

  useEffect(() => {
    // Mock: Simulate approval after 3 seconds for demo
    const timer = setTimeout(() => {
      setStatus('complete');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (status === 'pending') {
    return (
      <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-12 min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
              <Loader2 className="w-10 h-10 text-fmax-primary animate-spin" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-fmax-border">
              <Clock className="w-5 h-5 text-fmax-text-sub" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-fmax-text-main mb-3">심사가 진행 중입니다</h2>
          <p className="text-fmax-text-sub text-base leading-relaxed mb-8">
            제출해주신 서류를 꼼꼼히 검토하고 있습니다.<br/>
            평균 24시간 이내에 결과가 문자로 안내됩니다.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 w-full mb-8 text-left border border-gray-100">
            <h4 className="text-xs font-bold text-fmax-text-secondary uppercase mb-2">체크 포인트</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-fmax-text-sub">
                <CheckCircle2 className="w-4 h-4 text-fmax-primary mr-2" />
                사업자 등록증 진위 여부
              </li>
              <li className="flex items-center text-sm text-fmax-text-sub">
                <CheckCircle2 className="w-4 h-4 text-fmax-primary mr-2" />
                매매업 등록증 유효성
              </li>
              <li className="flex items-center text-sm text-fmax-text-sub">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2 flex-shrink-0 animate-pulse" />
                서류 일치 여부 확인 중...
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('SCR-0000')}
            className="text-fmax-text-sub hover:text-fmax-text-main text-sm font-medium underline decoration-gray-300 hover:decoration-fmax-text-main underline-offset-4 transition-all"
          >
            홈 화면으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-8 md:p-12 min-h-[500px] flex items-center justify-center overflow-hidden relative">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(55,62,239,0.1)_0%,_transparent_50%)]" />
      </div>
      
      {/* 상단 그라데이션 바 */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-fmax-primary via-fmax-accent to-fmax-primary" />
      
      {/* 배경 데코레이션 */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-50 rounded-full opacity-50 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="flex flex-col items-center text-center max-w-lg mx-auto relative z-10 animate-fade-in">
        {/* 성공 아이콘 개선 */}
        <div className="mb-8 relative">
          <div className="w-28 h-28 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center shadow-inner relative">
            <CheckCircle2 className="w-14 h-14 text-green-500" strokeWidth={2.5} />
            {/* 성공 애니메이션 링 */}
            <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-20" />
          </div>
          <div className="absolute -bottom-3 -right-3 bg-white px-4 py-1.5 rounded-full shadow-lg border border-green-100 flex items-center gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-green-700">승인 완료</span>
          </div>
        </div>
        
        {/* 제목 및 설명 */}
        <h2 className="text-3xl md:text-4xl font-bold text-fmax-text-main mb-4 tracking-tight">
          환영합니다!
        </h2>
        <h3 className="text-xl md:text-2xl font-semibold text-fmax-text-main mb-3">
          가입이 승인되었습니다
        </h3>
        <p className="text-fmax-text-sub text-base md:text-lg mb-10 max-w-sm leading-relaxed">
          이제 포워드맥스의 <span className="font-semibold text-fmax-primary">모든 프리미엄 서비스</span>를<br/>
          제한 없이 이용하실 수 있습니다.
        </p>
        
        {/* 바로가기 카드 개선 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
          <div 
            className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-6 hover:border-fmax-primary/30 hover:shadow-lg transition-all cursor-pointer group text-left relative overflow-hidden"
            onClick={() => onNavigate('SCR-0200')}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-fmax-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform relative z-10">
              <Car className="w-6 h-6 text-fmax-primary" />
            </div>
            <h4 className="font-bold text-fmax-text-main mb-2 text-lg">매물 등록하기</h4>
            <p className="text-xs text-fmax-text-sub leading-relaxed">
              보유하신 차량을 등록하고<br/>수출 견적을 받아보세요.
            </p>
            <div className="mt-4 flex items-center text-xs text-fmax-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              시작하기 <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
          
          <div 
            className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-6 hover:border-fmax-primary/30 hover:shadow-lg transition-all cursor-pointer group text-left relative overflow-hidden"
            onClick={() => onNavigate('SCR-0100')}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-fmax-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform relative z-10">
              <LayoutDashboard className="w-6 h-6 text-fmax-text-main" />
            </div>
            <h4 className="font-bold text-fmax-text-main mb-2 text-lg">대시보드 홈</h4>
            <p className="text-xs text-fmax-text-sub leading-relaxed">
              전체 현황을 한눈에<br/>확인하러 가기
            </p>
            <div className="mt-4 flex items-center text-xs text-fmax-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              이동하기 <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </div>
        
        {/* 메인 CTA 버튼 개선 */}
        <Button
          onClick={() => onNavigate('SCR-0200')}
          className="h-14 w-full text-lg font-bold shadow-xl shadow-fmax-primary/20 hover:shadow-fmax-primary/30 transition-all relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center">
            바로 매물 등록 시작하기 
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-fmax-primary to-fmax-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>
    </div>
  );
};

// --- SCR-0200: Register Vehicle Page ---
const RegisterVehiclePage = ({ onNavigate, editingVehicleId }: any) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ plateNumber: '', vin: '', manufacturer: '', modelName: '', modelYear: '', fuelType: '', registrationDate: '', mileage: '', color: '', price: '' });
  const [isOCRLoading, setIsOCRLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [wonbuInputMode, setWonbuInputMode] = useState<'image' | 'manual'>('image'); // B-1: 이미지/직접 입력 모드
  const [vehicleFields, setVehicleFields] = useState<Array<{ label: string; value: string; field: string }>>([]); // B-1: 자동 입력된 항목들
  const [priceEstimate, setPriceEstimate] = useState<any>(null);
  const [vehicleStatistics, setVehicleStatistics] = useState<any>(null);  // 공공데이터 통계 정보
  const [publicDataMetadata, setPublicDataMetadata] = useState<any>(null);  // 공공데이터 메타데이터
  const [generatedReport, setGeneratedReport] = useState<{ condition: any; vehicleInfo: any; generatedAt: string } | null>(null);  // OCR 완료 후 생성된 리포트
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportGenerationProgress, setReportGenerationProgress] = useState(0);  // 리포트 생성 진행률 (0-100)
  const [reportGenerationError, setReportGenerationError] = useState<string | null>(null);  // 리포트 생성 에러
  const [savedReportId, setSavedReportId] = useState<string | null>(null);  // 저장된 리포트 ID
  const [isSavingReport, setIsSavingReport] = useState(false);  // 리포트 저장 중
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());  // 자동 입력된 필드 추적
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
  
  // 컴포넌트 언마운트 시 미리보기 URL 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      // 파일이 선택되지 않았을 경우 input 초기화
      if (e.target) {
        e.target.value = '';
      }
      return;
    }
    
    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      showToast('지원하지 않는 파일 형식입니다. JPG, PNG, WEBP, PDF 파일만 업로드 가능합니다.', 'error');
      // input 초기화
      if (e.target) {
        e.target.value = '';
      }
      return;
    }
    
    // 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('파일 크기는 10MB를 초과할 수 없습니다.', 'error');
      // input 초기화
      if (e.target) {
        e.target.value = '';
      }
      return;
    }
    
    // 이전 미리보기 URL 정리 (메모리 누수 방지)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
    setIsOCRLoading(true);
    try {
      // 백엔드 API 호출로 변경
      const result = await apiClient.vehicle.ocrRegistration(file);
      
      // 응답 데이터를 폼에 매핑
      const updatedFormData = {
        plateNumber: result.plateNumber || formData.plateNumber,
        vin: result.vin || formData.vin,
        manufacturer: result.manufacturer || formData.manufacturer,
        modelName: result.model || formData.modelName,
        modelYear: result.year || formData.modelYear,
        mileage: result.mileage || formData.mileage,
        fuelType: result.fuelType || formData.fuelType,
        registrationDate: result.registrationDate || formData.registrationDate,
        color: result.color || formData.color,
        price: formData.price,
      };
      
      // 자동 입력된 필드 추적
      const newAutoFilledFields = new Set<string>();
      if (result.plateNumber) newAutoFilledFields.add('plateNumber');
      if (result.vin) newAutoFilledFields.add('vin');
      if (result.manufacturer) newAutoFilledFields.add('manufacturer');
      if (result.model) newAutoFilledFields.add('modelName');
      if (result.year) newAutoFilledFields.add('modelYear');
      if (result.mileage) newAutoFilledFields.add('mileage');
      if (result.fuelType) newAutoFilledFields.add('fuelType');
      if (result.registrationDate) newAutoFilledFields.add('registrationDate');
      if (result.color) newAutoFilledFields.add('color');
      
      setAutoFilledFields(newAutoFilledFields);
      
      // B-1: 자동 입력된 항목들을 vehicleFields에 추가 (모든 필드 포함)
      const fields = [
        { label: '차량번호', value: result.plateNumber || '', field: 'plateNumber' },
        { label: '차대번호', value: result.vin || '', field: 'vin' },
        { label: '제조사', value: result.manufacturer || '', field: 'manufacturer' },
        { label: '모델명', value: result.model || '', field: 'modelName' },
        { label: '연식', value: result.year || '', field: 'modelYear' },
        { label: '주행거리', value: result.mileage || '', field: 'mileage' },
        { label: '연료', value: result.fuelType || '', field: 'fuelType' },
        { label: '등록일자', value: result.registrationDate || '', field: 'registrationDate' },
        { label: '색상', value: result.color || '', field: 'color' },
      ].filter(f => f.value);
      setVehicleFields(fields);
      
      // 자동 입력 완료 토스트 메시지
      if (fields.length > 0) {
        showToast(`✅ ${fields.length}개 항목이 자동으로 입력되었습니다.`, 'success');
      }
      
      setFormData(prev => ({
        ...prev,
        ...updatedFormData,
      }));

      // 공공데이터 API 호출 성공/실패 알림
      if (result.publicDataSuccess) {
        // 공공데이터에서 정보를 성공적으로 가져온 경우
        const publicDataFields = [];
        if (result.vin) publicDataFields.push('차대번호');
        if (result.manufacturer) publicDataFields.push('제조사');
        if (result.model) publicDataFields.push('모델명');
        if (result.year) publicDataFields.push('연식');
        if (result.mileage) publicDataFields.push('주행거리');
        if (result.fuelType) publicDataFields.push('연료');
        if (result.registrationDate) publicDataFields.push('등록일자');
        if (result.color) publicDataFields.push('색상');
        
        if (publicDataFields.length > 0) {
          showToast(`✅ 공공데이터에서 ${publicDataFields.length}개 항목을 가져왔습니다: ${publicDataFields.join(', ')}`, 'success');
        } else {
          showToast('✅ 공공데이터 조회 성공 (추가 정보 없음)', 'success');
        }
      } else {
        // 공공데이터 조회 실패 시
        const errorMsg = result.publicDataError || '알 수 없는 오류';
        showToast(`⚠️ 공공데이터 조회 실패: ${errorMsg}. 차량번호만 입력되었습니다.`, 'warning');
      }
      
      // 자동 입력 완료 알림 (전체 필드)
      const extractedFields = [];
      if (result.plateNumber) extractedFields.push('차량번호');
      if (result.vin) extractedFields.push('차대번호');
      if (result.manufacturer) extractedFields.push('제조사');
      if (result.model) extractedFields.push('모델명');
      if (result.year) extractedFields.push('연식');
      if (result.mileage) extractedFields.push('주행거리');
      if (result.fuelType) extractedFields.push('연료');
      if (result.registrationDate) extractedFields.push('등록일자');
      if (result.color) extractedFields.push('색상');
      
      // 3초 후 자동 입력 표시 제거
      setTimeout(() => {
        setAutoFilledFields(new Set());
      }, 3000);

      // 공공데이터 통계 정보는 현재 백엔드에서 직접 차량 정보로 변환되어 반환됨
      // 별도의 vehicleStatistics, publicDataMetadata 필드는 사용하지 않음

      // ✅ OCR 완료 후 즉시 백엔드 API로 성능 평가 리포트 생성
      if (result.plateNumber) {
        // 이미 리포트 생성 중이면 중복 실행 방지
        if (isGeneratingReport) {
          console.warn('리포트 생성이 이미 진행 중입니다.');
          return;
        }
        
        setIsGeneratingReport(true);
        setReportGenerationError(null);
        setReportGenerationProgress(0);
        
        let progressInterval: NodeJS.Timeout | null = null;
        
        try {
          // 진행률 시뮬레이션 (백엔드 API 호출 중간에 업데이트)
          progressInterval = setInterval(() => {
            setReportGenerationProgress(prev => {
              if (prev >= 90) {
                if (progressInterval) clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 300);

          // 백엔드 리포트 생성 API 호출
          const reportResult = await apiClient.report.generateReport({
            plateNumber: result.plateNumber,
            vin: result.vin,
            manufacturer: result.manufacturer,
            modelName: result.model,
            modelYear: result.year,
            mileage: result.mileage,
            fuelType: result.fuelType,
            registrationDate: result.registrationDate,
            color: result.color,
          });
          
          // 진행률 인터벌 정리
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
          
          // 생성된 리포트 유효성 검증
          if (!reportResult || !reportResult.success || !reportResult.condition) {
            throw new Error('리포트 생성 결과가 유효하지 않습니다.');
          }
          
          // 필수 필드 확인
          const requiredFields = ['exterior', 'interior', 'mechanic', 'frame'];
          const missingFields = requiredFields.filter(field => !reportResult.condition[field]);
          if (missingFields.length > 0) {
            throw new Error(`리포트 필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
          }
          
          setReportGenerationProgress(100);
          
          // 생성된 리포트를 상태에 저장
          setGeneratedReport({
            condition: reportResult.condition,
            vehicleInfo: reportResult.vehicleInfo || result,
            generatedAt: reportResult.generatedAt || new Date().toISOString(),
          });
        } catch (reportError: any) {
          console.error('리포트 생성 실패:', reportError);
          // 진행률 인터벌 정리 (에러 발생 시에도)
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
          setReportGenerationError(reportError.message || '리포트 생성 중 오류가 발생했습니다.');
          setReportGenerationProgress(0);
        } finally {
          setIsGeneratingReport(false);
        }
      }
    } catch (err: any) {
      console.error('OCR Error:', err);
      const errorMessage = err.message || '등록원부 인식 중 오류가 발생했습니다.';
      showToast(errorMessage, 'error');
      // 에러 발생 시 미리보기 제거
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setIsOCRLoading(false);
      // input 초기화 (같은 파일 재선택 가능하도록)
      if (e.target) {
        e.target.value = '';
      }
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
      showToast('시세 추정 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsOCRLoading(false);
    }
  };

  return (
    <>
      {/* 리포트 미리보기 모달 */}
      {generatedReport && !isGeneratingReport && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-fmax-text-main">성능 평가 리포트 미리보기</h2>
              <p className="text-xs text-gray-500 mt-1">차량 정보를 기반으로 생성된 리포트입니다.</p>
            </div>
            <button 
              onClick={() => setGeneratedReport(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {/* 차량 정보 요약 */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-sm font-bold text-blue-800 mb-3">차량 정보</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {generatedReport.vehicleInfo.plateNumber && (
                  <div>
                    <p className="text-xs text-blue-600 mb-0.5">차량번호</p>
                    <p className="font-semibold text-blue-900">{generatedReport.vehicleInfo.plateNumber}</p>
                  </div>
                )}
                {generatedReport.vehicleInfo.manufacturer && (
                  <div>
                    <p className="text-xs text-blue-600 mb-0.5">제조사</p>
                    <p className="font-semibold text-blue-900">{generatedReport.vehicleInfo.manufacturer}</p>
                  </div>
                )}
                {generatedReport.vehicleInfo.model && (
                  <div>
                    <p className="text-xs text-blue-600 mb-0.5">모델명</p>
                    <p className="font-semibold text-blue-900">{generatedReport.vehicleInfo.model}</p>
                  </div>
                )}
                {generatedReport.vehicleInfo.year && (
                  <div>
                    <p className="text-xs text-blue-600 mb-0.5">연식</p>
                    <p className="font-semibold text-blue-900">{generatedReport.vehicleInfo.year}년식</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 상세 상태 */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-fmax-text-main border-b pb-2">상세 상태</h3>
              {generatedReport.condition && typeof generatedReport.condition === 'object' ? (
                Object.entries(generatedReport.condition).map(([key, value]: any) => {
                  const labelMap: Record<string, string> = {
                    exterior: '외관',
                    interior: '내부',
                    mechanic: '기계적 상태',
                    frame: '차대/프레임',
                  };
                  const koreanLabel = labelMap[key] || key;
                  
                  return (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">{koreanLabel}</p>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 min-h-[60px] max-h-[200px] overflow-y-auto">
                        <p className="text-sm text-fmax-text-main leading-relaxed whitespace-pre-wrap break-words">
                          {value || '정보 없음'}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">상세 상태 정보를 불러올 수 없습니다.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex gap-3 justify-between items-center">
            <div className="flex gap-2">
              {savedReportId && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    // 리포트 공유 링크 생성 및 복사
                    if (!savedReportId) {
                      showToast('리포트가 저장되지 않았습니다. 먼저 리포트를 저장해주세요.', 'warning');
                      return;
                    }
                    
                    const shareUrl = `${window.location.origin}/report/${savedReportId}`;
                    try {
                      // Clipboard API 사용 시도
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(shareUrl);
                        showToast('공유 링크가 클립보드에 복사되었습니다.', 'success');
                      } else {
                        // 클립보드 API 실패 시 fallback
                        const textArea = document.createElement('textarea');
                        textArea.value = shareUrl;
                        textArea.style.position = 'fixed';
                        textArea.style.opacity = '0';
                        textArea.style.left = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        try {
                          const successful = document.execCommand('copy');
                          if (successful) {
                            showToast('공유 링크가 클립보드에 복사되었습니다.', 'success');
                          } else {
                            throw new Error('복사 실패');
                          }
                        } catch (err) {
                          // 복사 실패 시 링크만 표시 (브라우저 권한 이슈로 alert 유지)
                          alert('공유 링크를 복사하세요:\n\n' + shareUrl);
                        } finally {
                          document.body.removeChild(textArea);
                        }
                      }
                    } catch (err) {
                      // 모든 복사 방법 실패 시 alert로 링크 표시 (브라우저 권한 이슈)
                      alert('공유 링크를 복사하세요:\n\n' + shareUrl);
                    }
                  }}
                  icon={Share2}
                >
                  공유
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setGeneratedReport(null)}>닫기</Button>
            <Button onClick={async () => {
              // 리포트 저장 후 리포트 페이지로 이동
              let vehicleId = editingVehicleId;
              if (!vehicleId) {
                const savedVehicle = MockDataService.createVehicle(formData);
                vehicleId = savedVehicle.id;
              }
              
              // 리포트 저장 시도 (중복 저장 방지)
              if (generatedReport && !savedReportId && !isSavingReport) {
                setIsSavingReport(true);
                try {
                  // 리포트 유효성 검증
                  if (!generatedReport.condition || typeof generatedReport.condition !== 'object') {
                    throw new Error('저장할 리포트 데이터가 유효하지 않습니다.');
                  }
                  
                  const saveResult = await apiClient.report.saveReport({
                    vehicleId: vehicleId,
                    report: {
                      condition: generatedReport.condition,
                      summary: '',
                      score: 'A',
                    },
                    vehicleInfo: generatedReport.vehicleInfo || {},
                  });
                  
                  if (saveResult && saveResult.reportId) {
                    setSavedReportId(saveResult.reportId);
                  } else {
                    throw new Error('리포트 저장 응답이 유효하지 않습니다.');
                  }
                } catch (saveError: any) {
                  console.error('리포트 저장 실패:', saveError);
                  showToast('리포트 저장 중 오류가 발생했습니다: ' + (saveError.message || '알 수 없는 오류'), 'error');
                  // 저장 실패해도 리포트 페이지로 이동
                } finally {
                  setIsSavingReport(false);
                }
              }
              
              setGeneratedReport(null);
              onNavigate('SCR-0202', vehicleId);
            }}
            loading={isSavingReport}
            >
              전체 리포트 보기
            </Button>
            </div>
          </div>
        </div>
      </div>
    )}
    
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
          {/* Dev Skip Button */}
          <button
            onClick={() => {
              showToast('개발용: 목록으로 이동합니다.', 'info');
              onNavigate('SCR-0101');
            }}
            className="ml-4 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
            title="개발용: 검증 없이 목록으로 이동"
          >
            [DEV] 스킵
          </button>
       </header>

       <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
          {/* Page Title */}
          <h1 className="text-h1 text-fmax-text-main mb-12 text-center">차량등록</h1>

          {/* Section 1: 차량 번호 입력 */}
          <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-fmax-primary rounded-full" />
              <h2 className="text-h3 text-fmax-text-main">차량 번호 입력</h2>
            </div>
            <p className="text-sm text-fmax-text-sub mb-6">차량번호를 입력하시면 자동으로 차량 정보를 불러옵니다.</p>
            <div className="max-w-md">
              <Input
                label="차량 번호"
                value={formData.plateNumber}
                onChange={(e: any) => setFormData({ ...formData, plateNumber: e.target.value })}
                placeholder="예: 12가 3456"
                icon={Hash}
              />
              {formData.plateNumber && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  차량번호가 입력되었습니다
                </p>
              )}
            </div>
          </div>

          {/* Section 2: 차량 등록 원부 등록 */}
          <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-fmax-primary rounded-full" />
              <h2 className="text-h3 text-fmax-text-main">차량 등록 원부 등록</h2>
            </div>
            
            {/* Tab Toggle */}
            <div className="flex gap-2 mb-6 border-b border-fmax-border">
              <button
                onClick={() => setWonbuInputMode('image')}
                className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
                  wonbuInputMode === 'image'
                    ? 'border-fmax-primary text-fmax-primary'
                    : 'border-transparent text-fmax-text-sub hover:text-fmax-text-main'
                }`}
              >
                이미지로 등록
              </button>
              <button
                onClick={() => setWonbuInputMode('manual')}
                className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
                  wonbuInputMode === 'manual'
                    ? 'border-fmax-primary text-fmax-primary'
                    : 'border-transparent text-fmax-text-sub hover:text-fmax-text-main'
                }`}
              >
                직접 입력
              </button>
            </div>

            {/* Image Upload Mode */}
            {wonbuInputMode === 'image' && (
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 group relative overflow-hidden ${
                    previewUrl
                      ? 'border-green-300 bg-green-50/30'
                      : 'border-gray-300 hover:border-fmax-primary/50 hover:bg-blue-50/30'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fmax-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    disabled={isOCRLoading}
                  />
                  {previewUrl ? (
                    <div className="flex flex-col items-center justify-center gap-3 relative z-10">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-sm text-fmax-text-main font-medium">이미지 업로드 완료</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewUrl(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        파일 제거
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-fmax-primary transition-colors relative z-10" />
                      <p className="text-sm text-gray-500 group-hover:text-fmax-text-main font-medium relative z-10 mb-2">
                        이미지 업로드 시 각 항목이 자동으로 입력됩니다.
                      </p>
                      <p className="text-xs text-gray-400 relative z-10">*부가설명은 다음과 같이 들어갑니다</p>
                      <button className="mt-4 px-6 py-2 bg-gray-100 text-fmax-text-main rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors relative z-10">
                        이미지 등록
                      </button>
                    </>
                  )}
                  {isOCRLoading && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-fmax-primary animate-spin mx-auto mb-2" />
                        <span className="text-sm text-fmax-primary font-medium">분석 중...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manual Input Mode */}
            {wonbuInputMode === 'manual' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="차대번호" value={formData.vin} onChange={(e: any) => setFormData({ ...formData, vin: e.target.value })} />
                  <Input label="제조사" value={formData.manufacturer} onChange={(e: any) => setFormData({ ...formData, manufacturer: e.target.value })} />
                  <Input label="모델명" value={formData.modelName} onChange={(e: any) => setFormData({ ...formData, modelName: e.target.value })} />
                  <Input label="연식" value={formData.modelYear} onChange={(e: any) => setFormData({ ...formData, modelYear: e.target.value })} />
                  <Input label="주행거리" value={formData.mileage} onChange={(e: any) => setFormData({ ...formData, mileage: e.target.value })} />
                  <Input label="연료" value={formData.fuelType} onChange={(e: any) => setFormData({ ...formData, fuelType: e.target.value })} />
                </div>
              </div>
            )}

            {/* Auto-filled Fields List */}
            {vehicleFields.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="text-base font-bold text-fmax-text-main">자동 입력된 항목</h3>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-semibold">{vehicleFields.length}개</span>
                </div>
                <div className="space-y-3">
                  {vehicleFields.map((field, index) => (
                    <div key={field.field} className="flex items-center gap-4 p-4 bg-green-50/50 rounded-lg border border-green-200 hover:bg-green-50 transition-colors group">
                      <span className="text-sm font-semibold text-fmax-text-main w-28 flex-shrink-0">{field.label}</span>
                      <Input
                        value={field.value}
                        onChange={(e: any) => {
                          const updatedFields = [...vehicleFields];
                          updatedFields[index].value = e.target.value;
                          setVehicleFields(updatedFields);
                          setFormData({ ...formData, [field.field]: e.target.value });
                        }}
                        className="flex-1"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                          if (input) {
                            input.focus();
                            input.select();
                          }
                        }}
                        className="px-4 py-2 text-sm text-fmax-primary hover:text-fmax-primary-hover font-medium hover:bg-white rounded-lg transition-colors"
                      >
                        수정
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-900 rounded-lg px-8 py-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {vehicleFields.length > 0 && (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>{vehicleFields.length}개 항목이 자동 입력되었습니다</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={async () => {
                  // 임시 저장: 목록으로 돌아가기
                  if (editingVehicleId) {
                    showToast('임시 저장되었습니다.', 'success');
                    onNavigate('SCR-0101');
                  } else {
                    const savedVehicle = MockDataService.createVehicle(formData);
                    showToast('임시 저장되었습니다.', 'success');
                    onNavigate('SCR-0101');
                  }
                }}
                className="px-6 py-2.5 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                임시저장
              </button>
              <button
                onClick={async () => {
                  if (!formData.plateNumber) {
                    showToast('차량번호를 입력해주세요.', 'warning');
                    return;
                  }
                  // 등록하기: 차량 저장 후 목록으로 이동
                  let savedVehicleId = editingVehicleId;
                  if (!savedVehicleId) {
                    const newVehicle = MockDataService.createVehicle(formData);
                    savedVehicleId = newVehicle.id;
                  } else {
                    const existingVehicle = MockDataService.getVehicleById(savedVehicleId);
                    if (existingVehicle) {
                      Object.assign(existingVehicle, formData);
                    }
                  }
                  showToast('차량이 등록되었습니다.', 'success');
                  onNavigate('SCR-0101');
                }}
                className="px-6 py-2.5 bg-fmax-primary text-white rounded-lg font-medium hover:bg-fmax-primary-hover transition-colors shadow-md flex items-center gap-2"
              >
                등록하기
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
       </main>
    </div>
    </>
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
            <button 
              onClick={() => onNavigate('SCR-0001')}
              className="text-sm font-medium text-[#050B20] hover:text-[#405FF2] transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => onNavigate('SCR-0002')}
              className="px-4 py-2 bg-[#405FF2] text-white rounded-lg font-medium hover:bg-[#2A30C6] transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="lg:col-span-7 space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-[#050B20] leading-tight">
                Find Your Perfect
                <span className="text-[#405FF2]"> Used Car</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Browse thousands of verified used cars from trusted dealers. Get the best deals with transparent pricing and detailed vehicle reports.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onNavigate('SCR-0001')}
                  className="px-8 py-4 bg-[#405FF2] text-white rounded-lg font-semibold text-lg hover:bg-[#2A30C6] transition-colors shadow-lg"
                >
                  Browse Cars
                </button>
                <button 
                  onClick={() => onNavigate('SCR-0002')}
                  className="px-8 py-4 bg-white border-2 border-[#405FF2] text-[#405FF2] rounded-lg font-semibold text-lg hover:bg-[#405FF2]/5 transition-colors"
                >
                  Sell Your Car
                </button>
              </div>
            </div>

            {/* Right: Image Upload Section */}
            <div className="lg:col-span-5 space-y-6">
               <div className="sticky top-24 space-y-4">
                 <h3 className="text-base font-bold text-fmax-text-main flex items-center gap-2">
                    <FileText className="w-5 h-5 text-fmax-primary" />
                    등록증 인식
                 </h3>
                 <div className="aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all cursor-pointer bg-white relative overflow-hidden border-gray-200 hover:border-fmax-primary hover:bg-blue-50/10">
                    <div className="text-center">
                       <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                       <p className="font-medium text-fmax-text-main text-sm">등록증 사진 업로드</p>
                       <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, PDF</p>
                    </div>
                 </div>
                 <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                    차대번호와 제원을 자동으로 입력합니다.
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
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
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  // 백엔드에서 Google Maps API 키 가져오기 (Secret Manager 사용)
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        // 무조건 백엔드에서 Secret Manager를 통해 가져오기
        const result = await apiClient.config.getGoogleMapsApiKey();
        if (result && result.success && result.apiKey) {
          setApiKey(result.apiKey);
          console.log('[GoogleMaps] API key retrieved from backend Secret Manager');
        } else {
          console.error('[GoogleMaps] Failed to get API key from backend: Invalid response');
          // API 키가 없으면 지도 로드하지 않음
        }
      } catch (error) {
        console.error('[GoogleMaps] Error fetching API key from backend:', error);
        // 에러 발생 시에도 환경 변수 fallback 없음
        // Secret Manager 설정을 확인하도록 에러만 로깅
      }
    };
    
    fetchApiKey();
  }, []);
  
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
    if (!apiKey) return; // API 키가 없으면 로드하지 않음
    
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
  const { showToast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    location: { lat: number; lng: number } | null;
  }>({ address: '', location: null });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  // 시간 슬롯 생성 (9:00 ~ 18:00, 30분 간격)
  const timeSlots = Array.from({ length: 19 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });
  
  // 날짜 선택을 위한 현재 달력 생성
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);
  
  const handleDateClick = (day: number) => {
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  useEffect(() => {
    const loadVehicle = async () => {
      setLoading(true);
      if (vehicleId) {
        const v = MockDataService.getVehicleById(vehicleId);
        if (v) {
          setVehicle(v);
        } else {
          const vehicles = MockDataService.getMockVehicles();
          setVehicle(vehicles[0] || null);
        }
      } else {
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
      showToast('검차 장소를 선택해주세요.', 'warning');
      return;
    }
    if (!selectedDate || !selectedTime) {
      showToast('방문 희망 일시를 선택해주세요.', 'warning');
      return;
    }
    if (!termsAgreed) {
      showToast('약관에 동의해주세요.', 'warning');
      return;
    }
    if (vehicle) {
       await MockDataService.scheduleInspection(vehicle.id, {
         location: selectedLocation,
         date: selectedDate,
         time: selectedTime
       });
       showToast('검차 신청이 완료되었습니다.', 'success');
       onNavigate('SCR-0300-PROG', vehicle.id);
    }
  };

  if (loading || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
         <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-fmax-primary animate-spin mb-4" />
            <p className="text-sm text-fmax-text-sub">차량 정보를 불러오는 중입니다...</p>
         </div>
      </div>
    );
  }

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

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
        {/* Dev Skip Button */}
        <button
          onClick={() => {
            showToast('개발용: 검차 진행 화면으로 이동합니다.', 'info');
            onNavigate('SCR-0300-PROG', vehicleId);
          }}
          className="ml-4 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
          title="개발용: 검증 없이 검차 진행 화면으로 이동"
        >
          [DEV] 스킵
        </button>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <h1 className="text-h1 text-fmax-text-main mb-12 text-center">검차 요청</h1>

        {/* Vehicle Info Card */}
        <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-fmax-text-main">{vehicle.modelYear} {vehicle.manufacturer} {vehicle.modelName}</h2>
              <p className="text-sm text-fmax-text-sub">{vehicle.plateNumber} • {vehicle.mileage}만km</p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-8 mb-8">
          <h2 className="text-h3 text-fmax-text-main mb-6">날짜 선택</h2>
          <div className="max-w-md mx-auto">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-fmax-text-sub" />
              </button>
              <h3 className="text-lg font-bold text-fmax-text-main">{currentYear}년 {monthNames[currentMonth]}</h3>
              <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-fmax-text-sub" />
              </button>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-fmax-text-sub py-2">
                  {day}
                </div>
              ))}
              {emptyDays.map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}
              {days.map(day => {
                const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
                const isPast = new Date(dateStr) < new Date(today.toISOString().split('T')[0]);
                
                return (
                  <button
                    key={day}
                    onClick={() => !isPast && handleDateClick(day)}
                    disabled={isPast}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-fmax-primary text-white shadow-md'
                        : isPast
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-fmax-text-main hover:bg-gray-100'
                    } ${isToday && !isSelected ? 'ring-2 ring-fmax-primary/30' : ''}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            
            {selectedDate && (
              <div className="text-center text-sm text-fmax-text-sub">
                선택된 날짜: {selectedDate}
              </div>
            )}
          </div>
        </div>

        {/* Time Selection */}
        <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-8 mb-8">
          <h2 className="text-h3 text-fmax-text-main mb-6">시간 선택</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {timeSlots.map(time => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-fmax-primary text-white shadow-md'
                      : 'bg-gray-50 text-fmax-text-main hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Selection */}
        <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-8 mb-8">
          <h2 className="text-h3 text-fmax-text-main mb-6">위치 선택</h2>
          {selectedLocation.address && (
            <div className="mb-4 text-sm text-fmax-text-sub bg-blue-50 p-3 rounded-lg border border-blue-100">
              선택된 주소: {selectedLocation.address}
            </div>
          )}
          <GoogleMapsPicker 
            onPlaceSelect={handlePlaceSelect}
            initialAddress={selectedLocation.address}
          />
        </div>

        {/* Terms Agreement */}
        <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-8 mb-8">
          <h2 className="text-h3 text-fmax-text-main mb-6">약관 동의</h2>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-fmax-primary focus:ring-fmax-primary mt-0.5"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-fmax-text-main">검차 관련 약관에 동의합니다</span>
                <p className="text-xs text-fmax-text-sub mt-1">
                  검차 비용, 일정 변경, 취소 정책 등에 대한 약관 내용을 확인하고 동의합니다.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onNavigate('SCR-0101')}
            className="px-6 py-2.5 bg-gray-100 text-fmax-text-main rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleRequest}
            className="px-6 py-2.5 bg-fmax-primary text-white rounded-lg font-medium hover:bg-fmax-primary-hover transition-colors shadow-md"
          >
            검차 신청하기
          </button>
        </div>
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
            onNavigate('SCR-0300-RES', currentVehicleId);
          }, 2000);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [inspectionId, currentVehicleId, onNavigate]);

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
        {/* Dev Skip Button */}
        <button
          onClick={() => {
            onNavigate('SCR-0300-RES', currentVehicleId);
          }}
          className="ml-4 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
          title="개발용: 검증 없이 검차 결과 화면으로 이동"
        >
          [DEV] 스킵
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="relative mx-auto w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle 
                cx="64" 
                cy="64" 
                r="56" 
                fill="none" 
                stroke="#373EEF" 
                strokeWidth="8" 
                strokeDasharray={352} 
                strokeDashoffset={352 - (352 * progress) / 100} 
                className="transition-all duration-300 ease-linear"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-fmax-text-main">{progress}%</span>
              <span className="text-xs text-fmax-text-sub mt-1">진행 중</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-fmax-text-main mb-3">AI 정밀 분석 중</h2>
            <p className="text-fmax-text-sub text-sm leading-relaxed">
              차량 이미지를 분석하고 있습니다.<br/>
              <span className="text-xs text-fmax-text-sub/70">gemini-3-pro-preview Model</span>
            </p>
          </div>
          
          <div className="space-y-4 pt-4 bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-fmax-text-main mb-3">검차 진행 단계</h3>
            {[
              { label: '평가사 출발 확인', threshold: 25 },
              { label: '차량 검차 진행', threshold: 50 },
              { label: '사진 업로드 (37+)', threshold: 75 },
              { label: 'AI 상태 분석', threshold: 100 }
            ].map((step, i) => {
              const isCompleted = progress >= step.threshold;
              return (
                <div 
                  key={i} 
                  className={`flex items-center gap-3 text-sm font-medium transition-all ${
                    isCompleted ? 'text-fmax-primary' : 'text-gray-400'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted 
                      ? 'bg-fmax-primary border-fmax-primary text-white' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isCompleted && <Check className="w-3 h-3" />}
                  </div>
                  <span className={isCompleted ? 'font-semibold' : ''}>{step.label}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                </div>
              );
            })}
          </div>
          
          {progress === 100 && (
            <div className="space-y-4 pt-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">검차 완료</span>
                </div>
                <p className="text-xs text-green-700">이제 검차 결과를 업로드해주세요.</p>
              </div>
              <Button 
                className="w-full h-12 text-base" 
                onClick={() => onNavigate('SCR-0300-RES', currentVehicleId)}
                icon={ArrowRight}
              >
                검차 결과 업로드하기
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- SCR-0300-RES: Inspection Result Page (C-3) ---
const InspectionResultPage = ({ onNavigate, vehicleId }: any) => {
  const { showToast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 이미지/비디오 업로드 상태 관리
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({
    exterior: [],
    interior: [],
    tires: [],
    glass: [],
    mirrors: [],
    trunk: [],
    bumper: [],
    bonnet: [],
    performance: [],
    videos: [],
  });
  
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  
  // 카테고리별 요구사항 (37개 이미지 + 3개 비디오)
  // 외관 9개 + 내부 14개 + 타이어/유리/사이드미러 10개 + 트렁크 1개 + 범퍼 2개 + 보닛 1개 = 37개
  const categories = [
    { key: 'exterior', label: '외관', count: 9, type: 'image', description: '전면, 후면, 좌측면, 우측면 등' },
    { key: 'interior', label: '내부', count: 14, type: 'image', description: '대시보드, 시트, 계기판 등' },
    { key: 'tires', label: '타이어', count: 4, type: 'image', group: 'tires-glass-mirrors' },
    { key: 'glass', label: '유리', count: 4, type: 'image', group: 'tires-glass-mirrors' },
    { key: 'mirrors', label: '사이드미러', count: 2, type: 'image', group: 'tires-glass-mirrors' },
    { key: 'trunk', label: '트렁크', count: 1, type: 'image' },
    { key: 'bumper', label: '범퍼', count: 2, type: 'image' },
    { key: 'bonnet', label: '보닛', count: 1, type: 'image' },
    { key: 'performance', label: '성능', count: 0, type: 'image', optional: true },
    { key: 'videos', label: '비디오', count: 3, type: 'video', items: ['시동', '저속주행', '둘러보기'] },
  ];
  
  // 그룹화된 카테고리 (타이어/유리/사이드미러)
  const groupedCategories = useMemo(() => {
    const grouped = categories.filter(c => c.group === 'tires-glass-mirrors');
    const totalCount = grouped.reduce((sum, c) => sum + c.count, 0);
    return { categories: grouped, totalCount, label: '타이어/유리/사이드미러' };
  }, []);
  
  useEffect(() => {
    const loadVehicle = async () => {
      setLoading(true);
      if (vehicleId) {
        const v = MockDataService.getVehicleById(vehicleId);
        if (v) {
          setVehicle(v);
        } else {
          const vehicles = MockDataService.getMockVehicles();
          setVehicle(vehicles[0] || null);
        }
      } else {
        const vehicles = MockDataService.getMockVehicles();
        setVehicle(vehicles[0] || null);
      }
      setLoading(false);
    };
    loadVehicle();
  }, [vehicleId]);
  
  const handleFileUpload = (category: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const categoryData = categories.find(c => c.key === category);
    if (!categoryData) return;
    
    const fileArray = Array.from(files);
    const currentFiles = uploadedFiles[category] || [];
    
    // 최대 개수 제한
    const maxCount = categoryData.count;
    if (currentFiles.length + fileArray.length > maxCount) {
      showToast(`${categoryData.label}은(는) 최대 ${maxCount}개까지 업로드 가능합니다.`, 'warning');
      return;
    }
    
    setUploadedFiles(prev => ({
      ...prev,
      [category]: [...currentFiles, ...fileArray],
    }));
    
    // 업로드 진행률 시뮬레이션
    fileArray.forEach((file, index) => {
      setTimeout(() => {
        setUploadProgress(prev => ({
          ...prev,
          [`${category}-${currentFiles.length + index}`]: 100,
        }));
      }, 500 * (index + 1));
    });
  };
  
  const handleRemoveFile = (category: string, index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev[category]];
      newFiles.splice(index, 1);
      return { ...prev, [category]: newFiles };
    });
    
    // 진행률도 제거
    const progressKey = `${category}-${index}`;
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[progressKey];
      return newProgress;
    });
  };
  
  const getTotalUploaded = () => {
    const images = Object.entries(uploadedFiles)
      .filter(([key]) => key !== 'videos')
      .reduce((sum, [, files]) => sum + (files as File[]).length, 0);
    const videos = uploadedFiles.videos?.length || 0;
    const requiredImages = 37; // 외관 9 + 내부 14 + 타이어/유리/사이드미러 10 + 트렁크 1 + 범퍼 2 + 보닛 1
    const requiredVideos = 3;
    return { 
      images, 
      videos, 
      total: images + videos,
      requiredImages,
      requiredVideos,
      imagesComplete: images >= requiredImages,
      videosComplete: videos >= requiredVideos,
      allComplete: images >= requiredImages && videos >= requiredVideos
    };
  };
  
  const handleSave = async () => {
    const totals = getTotalUploaded();
    if (!totals.allComplete) {
      const missingImages = totals.requiredImages - totals.images;
      const missingVideos = totals.requiredVideos - totals.videos;
      let message = '모든 항목을 업로드해주세요.\n';
      if (missingImages > 0) message += `- 이미지 ${missingImages}개 부족\n`;
      if (missingVideos > 0) message += `- 비디오 ${missingVideos}개 부족`;
      showToast(message, 'warning');
      return;
    }
    
    showToast('검차 결과가 저장되었습니다.', 'success');
    onNavigate('SCR-0101');
  };
  
  // 카테고리 섹션 렌더링 헬퍼 함수
  const renderCategorySection = (category: any, files: File[], isComplete: boolean) => {
    return (
      <div key={category.key} className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-fmax-text-main">{category.label}</h3>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {files.length}/{category.count}
            </span>
            {category.description && (
              <span className="text-xs text-fmax-text-sub">({category.description})</span>
            )}
          </div>
          {category.items && (
            <div className="flex gap-2 text-xs text-fmax-text-sub">
              {category.items.map((item: string, idx: number) => (
                <span key={idx} className={files[idx] ? 'text-green-600 font-semibold' : ''}>
                  {item}{idx < category.items!.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* File Upload Area */}
        <div className="mb-4">
          <label className="block">
            <input
              type="file"
              multiple={category.count > 1}
              accept={category.type === 'video' ? 'video/*' : 'image/*'}
              onChange={(e) => handleFileUpload(category.key, e.target.files)}
              className="hidden"
            />
            <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isComplete 
                ? 'border-green-300 bg-green-50/30' 
                : 'border-gray-300 hover:border-fmax-primary hover:bg-blue-50/30'
            }`}>
              {isComplete ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                  <p className="text-sm font-medium text-green-700">업로드 완료</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-fmax-text-main mb-1">
                    {category.type === 'video' ? '비디오' : '이미지'} 업로드
                  </p>
                  <p className="text-xs text-gray-400">
                    {category.count > 1 ? `최대 ${category.count}개` : '1개'} 업로드 가능
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
        
        {/* Uploaded Files Grid */}
        {files.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-fmax-primary transition-colors">
                  {category.type === 'image' ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`${category.label} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <PlayCircle className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveFile(category.key, index)}
                  className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="삭제"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <p className="text-xs text-center mt-1 truncate px-1" title={file.name}>{file.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  if (loading || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-fmax-primary animate-spin mb-4" />
          <p className="text-sm text-fmax-text-sub">차량 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }
  
  const totals = getTotalUploaded();
  
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
        {/* Dev Skip Button */}
        <button
          onClick={() => {
            showToast('개발용: 목록으로 이동합니다.', 'info');
            onNavigate('SCR-0101');
          }}
          className="ml-4 px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
          title="개발용: 검증 없이 목록으로 이동"
        >
          [DEV] 스킵
        </button>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-h1 text-fmax-text-main mb-2">검차 완료</h1>
          <p className="text-h3 text-fmax-text-sub">검차 결과를 업로드해주세요</p>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-fmax-text-main">{vehicle.modelYear} {vehicle.manufacturer} {vehicle.modelName}</h2>
              <p className="text-sm text-fmax-text-sub">{vehicle.plateNumber} • {vehicle.mileage}만km</p>
            </div>
          </div>
        </div>

        {/* Upload Progress Summary */}
        <div className={`rounded-xl border p-6 mb-8 transition-all ${
          totals.allComplete 
            ? 'bg-green-50 border-green-200' 
            : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {totals.allComplete ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Activity className="w-6 h-6 text-blue-600" />
              )}
              <h3 className={`text-lg font-bold ${
                totals.allComplete ? 'text-green-900' : 'text-blue-900'
              }`}>
                업로드 진행 상황
              </h3>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold">
              <span className={totals.imagesComplete ? 'text-green-700' : 'text-blue-700'}>
                이미지 {totals.images}/{totals.requiredImages}
              </span>
              <span className="text-gray-400">•</span>
              <span className={totals.videosComplete ? 'text-green-700' : 'text-blue-700'}>
                비디오 {totals.videos}/{totals.requiredVideos}
              </span>
            </div>
          </div>
          <div className={`w-full rounded-full h-3 mb-2 ${
            totals.allComplete ? 'bg-green-200' : 'bg-blue-200'
          }`}>
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                totals.allComplete ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${((totals.images + totals.videos) / 40) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-xs font-medium ${
              totals.allComplete ? 'text-green-700' : 'text-blue-700'
            }`}>
              전체 진행률: {Math.round(((totals.images + totals.videos) / 40) * 100)}%
            </p>
            {totals.allComplete && (
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                모든 항목 업로드 완료
              </span>
            )}
          </div>
        </div>

        {/* Image/Video Upload Sections */}
        <div className="space-y-6">
          {/* 외관 */}
          {categories.filter(c => c.key === 'exterior').map(category => {
            const files = uploadedFiles[category.key] || [];
            const isComplete = files.length >= category.count;
            return renderCategorySection(category, files, isComplete);
          })}
          
          {/* 내부 */}
          {categories.filter(c => c.key === 'interior').map(category => {
            const files = uploadedFiles[category.key] || [];
            const isComplete = files.length >= category.count;
            return renderCategorySection(category, files, isComplete);
          })}
          
          {/* 타이어/유리/사이드미러 그룹화 */}
          <div className="bg-white rounded-xl shadow-fmax-card border border-fmax-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-fmax-text-main">타이어/유리/사이드미러</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  groupedCategories.totalCount === (uploadedFiles.tires?.length || 0) + (uploadedFiles.glass?.length || 0) + (uploadedFiles.mirrors?.length || 0)
                    ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {(uploadedFiles.tires?.length || 0) + (uploadedFiles.glass?.length || 0) + (uploadedFiles.mirrors?.length || 0)}/{groupedCategories.totalCount}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groupedCategories.categories.map(category => {
                const files = uploadedFiles[category.key] || [];
                const isComplete = files.length >= category.count;
                return (
                  <div key={category.key} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-semibold text-fmax-text-main">{category.label}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        isComplete ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {files.length}/{category.count}
                      </span>
                    </div>
                    
                    <label className="block">
                      <input
                        type="file"
                        multiple={category.count > 1}
                        accept="image/*"
                        onChange={(e) => handleFileUpload(category.key, e.target.files)}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-fmax-primary hover:bg-blue-50/30 transition-all">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs font-medium text-fmax-text-main mb-1">이미지 업로드</p>
                        <p className="text-xs text-gray-400">{category.count}개</p>
                      </div>
                    </label>
                    
                    {files.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {files.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`${category.label} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => handleRemoveFile(category.key, index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* 트렁크, 범퍼, 보닛 */}
          {categories.filter(c => ['trunk', 'bumper', 'bonnet'].includes(c.key)).map(category => {
            const files = uploadedFiles[category.key] || [];
            const isComplete = files.length >= category.count;
            return renderCategorySection(category, files, isComplete);
          })}
          
          {/* 비디오 */}
          {categories.filter(c => c.key === 'videos').map(category => {
            const files = uploadedFiles[category.key] || [];
            const isComplete = files.length >= category.count;
            return renderCategorySection(category, files, isComplete);
          })}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => onNavigate('SCR-0101')}
            className="px-6 py-2.5 bg-gray-100 text-fmax-text-main rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!totals.allComplete}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md ${
              totals.allComplete
                ? 'bg-fmax-primary text-white hover:bg-fmax-primary-hover cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={!totals.allComplete ? `이미지 ${totals.requiredImages - totals.images}개, 비디오 ${totals.requiredVideos - totals.videos}개 더 필요합니다` : ''}
          >
            {totals.allComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4 inline-block mr-2" />
                검차 결과 저장
              </>
            ) : (
              `업로드 필요 (이미지 ${totals.requiredImages - totals.images}개, 비디오 ${totals.requiredVideos - totals.videos}개)`
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

// --- SCR-0202: Inspection Report Page ---
const InspectionReportPage = ({ onNavigate, vehicleId }: any) => {
  const { showToast } = useToast();
  const [report, setReport] = useState<InspectionReport | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      
      // 차량 정보 가져오기
      let targetVehicle: Vehicle | null = null;
      if (vehicleId) {
        targetVehicle = MockDataService.getVehicleById(vehicleId) || null;
      } else {
        // vehicleId가 없으면 첫 번째 차량 사용 (임시)
        const vehicles = MockDataService.getMockVehicles();
        if (vehicles.length > 0) {
          targetVehicle = vehicles[0];
        }
      }
      
      setVehicle(targetVehicle);
      
      if (targetVehicle) {
        // 리포트 가져오기
        const r = MockDataService.getInspectionReport(targetVehicle.id);
        
        // 차량 정보를 바탕으로 백엔드 API로 상세 상태 생성
        try {
          const reportResult = await apiClient.report.generateReport({
            plateNumber: targetVehicle.plateNumber,
            vin: targetVehicle.vin,
            manufacturer: targetVehicle.manufacturer,
            modelName: targetVehicle.modelName,
            modelYear: targetVehicle.modelYear,
            mileage: targetVehicle.mileage,
            fuelType: targetVehicle.fuelType,
            registrationDate: targetVehicle.registrationDate,
            color: targetVehicle.color,
          });
          
          // 생성된 상세 상태로 리포트 업데이트
          if (reportResult && reportResult.success && reportResult.condition) {
            r.condition = {
              exterior: reportResult.condition.exterior || r.condition.exterior,
              interior: reportResult.condition.interior || r.condition.interior,
              mechanic: reportResult.condition.mechanic || r.condition.mechanic,
              frame: reportResult.condition.frame || r.condition.frame,
            };
          }
        } catch (error: any) {
          console.error('Failed to generate vehicle condition:', error);
          // 에러 발생 시 기존 리포트 사용
        }
        
        setReport(r || null);
      } else {
        // 차량이 없으면 기본 리포트 사용
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
            <Button 
               variant="outline" 
               size="sm" 
               icon={Printer}
               onClick={() => window.print()}
            >
               인쇄
            </Button>
            <Button 
               variant="outline" 
               size="sm" 
               icon={Share2}
               onClick={async () => {
                  // 리포트 공유 링크 생성 및 복사
                  if (!report || !report.id) {
                     showToast('리포트 정보가 없습니다.', 'warning');
                     return;
                  }
                  
                  const shareUrl = `${window.location.origin}/report/${report.id}`;
                  try {
                     // Clipboard API 사용 시도
                     if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(shareUrl);
                        showToast('공유 링크가 클립보드에 복사되었습니다.', 'success');
                     } else {
                        // 클립보드 API 실패 시 fallback
                        const textArea = document.createElement('textarea');
                        textArea.value = shareUrl;
                        textArea.style.position = 'fixed';
                        textArea.style.opacity = '0';
                        textArea.style.left = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        try {
                           const successful = document.execCommand('copy');
                           if (successful) {
                              showToast('공유 링크가 클립보드에 복사되었습니다.', 'success');
                           } else {
                              throw new Error('복사 실패');
                           }
                        } catch (err) {
                           // 복사 실패 시 링크만 표시 (브라우저 권한 이슈로 alert 유지)
                           alert('공유 링크를 복사하세요:\n\n' + shareUrl);
                        } finally {
                           document.body.removeChild(textArea);
                        }
                     }
                  } catch (err) {
                     // 모든 복사 방법 실패 시 alert로 링크 표시 (브라우저 권한 이슈)
                     alert('공유 링크를 복사하세요:\n\n' + shareUrl);
                  }
               }}
            >
               공유
            </Button>
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
                   
                   {/* 차량 정보 제시 섹션 */}
                   {vehicle && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                         <h3 className="text-xs font-bold text-gray-600 uppercase mb-3">차량 정보</h3>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            {vehicle.plateNumber && (
                               <div>
                                  <p className="text-xs text-gray-500 mb-0.5">차량번호</p>
                                  <p className="font-semibold text-fmax-text-main">{vehicle.plateNumber}</p>
                               </div>
                            )}
                            {vehicle.vin && (
                               <div>
                                  <p className="text-xs text-gray-500 mb-0.5">차대번호</p>
                                  <p className="font-semibold text-fmax-text-main font-mono text-xs">{vehicle.vin}</p>
                               </div>
                            )}
                            {(vehicle.manufacturer || vehicle.modelName) && (
                               <div>
                                  <p className="text-xs text-gray-500 mb-0.5">차량명</p>
                                  <p className="font-semibold text-fmax-text-main">{vehicle.manufacturer} {vehicle.modelName}</p>
                               </div>
                            )}
                            {vehicle.modelYear && (
                               <div>
                                  <p className="text-xs text-gray-500 mb-0.5">연식</p>
                                  <p className="font-semibold text-fmax-text-main">{vehicle.modelYear}년식</p>
                               </div>
                            )}
                            {vehicle.mileage && (
                               <div>
                                  <p className="text-xs text-gray-500 mb-0.5">주행거리</p>
                                  <p className="font-semibold text-fmax-text-main">
                                    {isNaN(parseInt(vehicle.mileage)) ? vehicle.mileage : parseInt(vehicle.mileage).toLocaleString()} km
                                  </p>
                               </div>
                            )}
                            {vehicle.fuelType && (
                               <div>
                                  <p className="text-xs text-gray-500 mb-0.5">연료</p>
                                  <p className="font-semibold text-fmax-text-main">{vehicle.fuelType}</p>
                               </div>
                            )}
                            {vehicle.registrationDate && (
                               <div>
                                  <p className="text-xs text-gray-500 mb-0.5">등록일자</p>
                                  <p className="font-semibold text-fmax-text-main">{vehicle.registrationDate}</p>
                               </div>
                            )}
                            {vehicle.color && (
                               <div>
                                  <p className="text-xs text-gray-500 mb-0.5">색상</p>
                                  <p className="font-semibold text-fmax-text-main">{vehicle.color}</p>
                               </div>
                            )}
                         </div>
                      </div>
                   )}
                   
                   <p className="text-fmax-text-main text-sm leading-relaxed mb-4 whitespace-pre-wrap break-words">{report.summary}</p>
                   <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                         <h4 className="text-xs font-bold text-green-800 uppercase mb-2">장점</h4>
                         <ul className="space-y-1">
                            {report.aiAnalysis.pros.map((p, i) => (
                               <li key={i} className="text-xs text-green-700 flex items-start gap-2">
                                  <Check className="w-3 h-3 mt-0.5 shrink-0" /> 
                                  <span className="break-words">{p}</span>
                               </li>
                            ))}
                         </ul>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                         <h4 className="text-xs font-bold text-red-800 uppercase mb-2">단점</h4>
                         <ul className="space-y-1">
                            {report.aiAnalysis.cons.map((c, i) => (
                               <li key={i} className="text-xs text-red-700 flex items-start gap-2">
                                  <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" /> 
                                  <span className="break-words">{c}</span>
                               </li>
                            ))}
                         </ul>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex flex-col justify-center text-center">
                         <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">시장 판단</h4>
                         <p className="text-xl font-black text-blue-600 break-words">{report.aiAnalysis.marketVerdict}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
             {/* Left: Score & Details */}
             <div className="space-y-6">
                <Card className="text-center py-8">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">전체 상태 점수</p>
                   <div className="w-32 h-32 rounded-full border-[6px] border-fmax-primary flex items-center justify-center mx-auto mb-4 relative">
                      <span className="text-5xl font-black text-fmax-text-main">{report.score}</span>
                      <div className="absolute bottom-2 bg-white px-2">
                         <StarRating rating={4.5} />
                      </div>
                   </div>
                   <p className="text-sm font-medium text-fmax-text-sub">142개 검사 항목 기준</p>
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
                      {report.condition && typeof report.condition === 'object' ? (
                         Object.entries(report.condition).map(([key, value]: any) => {
                            // 한글 라벨 매핑
                            const labelMap: Record<string, string> = {
                              exterior: '외관',
                              interior: '내부',
                              mechanic: '기계적 상태',
                              frame: '차대/프레임',
                            };
                            const koreanLabel = labelMap[key] || key;
                            
                            return (
                               <div key={key} className="group">
                                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">{koreanLabel}</p>
                                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 min-h-[60px] max-h-[200px] overflow-y-auto transition-all hover:border-gray-300">
                                     <p className="text-sm text-fmax-text-main leading-relaxed whitespace-pre-wrap break-words">
                                       {value || '정보 없음'}
                                     </p>
                                  </div>
                               </div>
                            );
                         })
                      ) : (
                         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">상세 상태 정보를 불러올 수 없습니다.</p>
                         </div>
                      )}
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
      case 'SCR-0002-1':
      case 'SCR-0002-2':
      case 'SCR-0002-3': return <SignupWizard onNavigate={handleNavigate} />;
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
      case 'SCR-0300-REQ': return <InspectionRequestPage onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
      case 'SCR-0300-PROG': return <InspectionStatusPage onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
      case 'SCR-0300-RES': return <InspectionResultPage onNavigate={handleNavigate} vehicleId={currentVehicleId || undefined} />;
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
root.render(
  <ToastProvider>
    <App />
  </ToastProvider>
);