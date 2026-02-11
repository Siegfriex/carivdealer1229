/**
 * Application Router
 * React Router 기반 라우팅 (URL 단일 진입점, 새로고침/딥링크/뒤로가기 지원).
 * 경로 목록은 FSD_IA_NODEID_SSOT §2.2와 일치. IA §4.2 비로그인 시 보호된 라우트는 /signup으로 리다이렉트.
 * @file
 * @see docs/figma/FSD_IA_NODEID_SSOT.md §2.2
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/shared/context/AuthContext';
import { LandingPage } from '@/pages/landing/LandingPage';
import { SignupEntryPage } from '@/pages/auth/SignupEntryPage';
import { SignupStep1Page } from '@/pages/auth/SignupStep1Page';
import { SignupStep2Page } from '@/pages/auth/SignupStep2Page';
import { SignupStep3Page } from '@/pages/auth/SignupStep3Page';
import { SignupStep4Page } from '@/pages/auth/SignupStep4Page';
import { SignupStep5Page } from '@/pages/auth/SignupStep5Page';
import { SignupPendingPage } from '@/pages/auth/SignupPendingPage';
import { SignupCompletePage } from '@/pages/auth/SignupCompletePage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { VehicleRegisterEntryPage } from '@/pages/admin/vehicle/VehicleRegisterEntryPage';
import { VehicleRegisterStep1Page } from '@/pages/admin/vehicle/VehicleRegisterStep1Page';
import { VehicleRegisterStep2Page } from '@/pages/admin/vehicle/VehicleRegisterStep2Page';
import { InspectionListPage } from '@/pages/admin/inspection/InspectionListPage';
import { InspectionRequestLandingPage } from '@/pages/admin/inspection/InspectionRequestLandingPage';
import { InspectionRequestStep1Page } from '@/pages/admin/inspection/InspectionRequestStep1Page';
import { InspectionRequestStep2Page } from '@/pages/admin/inspection/InspectionRequestStep2Page';
import { InspectionProgressPage } from '@/pages/admin/inspection/InspectionProgressPage';
import { InspectionCompletePage } from '@/pages/admin/inspection/InspectionCompletePage';
import { InspectionHistoryPage } from '@/pages/admin/inspection/InspectionHistoryPage';
import { VehicleRegistrationCompletePage } from '@/pages/admin/vehicle/VehicleRegistrationCompletePage';
import { VehicleDetailPage } from '@/pages/admin/vehicle/VehicleDetailPage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { ForgotPasswordPage } from '@/pages/admin/ForgotPasswordPage';
import { VehicleListPage } from '@/pages/admin/VehicleListPage';
import { TradeListPage } from '@/pages/admin/TradeListPage';
import { GeneralSaleOffersPage } from '@/pages/admin/GeneralSaleOffersPage';
import { LogisticsSchedulePage } from '@/pages/admin/LogisticsSchedulePage';
import { LogisticsHistoryPage } from '@/pages/admin/LogisticsHistoryPage';
import { SalesHistoryPage } from '@/pages/admin/SalesHistoryPage';
import { SettlementListPage } from '@/pages/admin/SettlementListPage';
import { SettlementDetailPage } from '@/pages/admin/SettlementDetailPage';
import { GeneralSaleAnalyzingPage } from '@/pages/admin/sale/GeneralSaleAnalyzingPage';
import { GeneralSalePricePage } from '@/pages/admin/sale/GeneralSalePricePage';
import { GeneralSaleCompletePage } from '@/pages/admin/sale/GeneralSaleCompletePage';
import { AuctionDetailPage } from '@/pages/admin/auction/AuctionDetailPage';
import { AuctionStartPricePage } from '@/pages/admin/auction/AuctionStartPricePage';
import { AuctionDurationPage } from '@/pages/admin/auction/AuctionDurationPage';
import { AuctionCompletePage } from '@/pages/admin/auction/AuctionCompletePage';
import { TradeDetailPage } from '@/pages/admin/TradeDetailPage';
import { SettlementAccountPage } from '@/pages/admin/mypage/SettlementAccountPage';
import { DevSkipFloatingButton } from '@/shared/ui/DevSkipFloatingButton';
import { isRunDev } from '@/shared/config/runDev';

/**
 * 앱 라우터 (공개·보호·폴백 라우트)
 * @description FSD_IA_NODEID_SSOT §2.2·IA §4.2. 비로그인 시 보호 라우트는 /signup 리다이렉트.
 */
export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- 공개: 랜딩·로그인·회원가입·비밀번호 찾기 --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupEntryPage />} />
        <Route path="/signup/step1" element={<SignupStep1Page />} />
        <Route path="/signup/step2" element={<SignupStep2Page />} />
        <Route path="/signup/step3" element={<SignupStep3Page />} />
        <Route path="/signup/step4" element={<SignupStep4Page />} />
        <Route path="/signup/step5" element={<SignupStep5Page />} />
        <Route path="/signup/pending" element={<SignupPendingPage />} />
        <Route path="/signup/complete" element={<SignupCompletePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* IA §4.2: 비로그인 시 회원가입 유도. 보호된 라우트는 인증 필요 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehicleListPage />} />
          <Route path="/vehicles/new" element={<VehicleRegisterEntryPage />} />
          <Route path="/vehicles/new/step1" element={<VehicleRegisterStep1Page />} />
          <Route path="/vehicles/new/step2" element={<VehicleRegisterStep2Page />} />
          <Route path="/vehicles/:vehicleId/complete" element={<VehicleRegistrationCompletePage />} />
          <Route path="/vehicles/:vehicleId/sale/analyzing" element={<GeneralSaleAnalyzingPage />} />
          <Route path="/vehicles/:vehicleId/sale/price" element={<GeneralSalePricePage />} />
          <Route path="/vehicles/:vehicleId/sale/complete" element={<GeneralSaleCompletePage />} />
          <Route path="/vehicles/:vehicleId/auction" element={<AuctionDetailPage />} />
          <Route path="/vehicles/:vehicleId/auction/start-price" element={<AuctionStartPricePage />} />
          <Route path="/vehicles/:vehicleId/auction/duration" element={<AuctionDurationPage />} />
          <Route path="/vehicles/:vehicleId/auction/complete" element={<AuctionCompletePage />} />
          <Route path="/vehicles/:vehicleId/trade" element={<TradeDetailPage />} />
          <Route path="/vehicles/:vehicleId" element={<VehicleDetailPage />} />
          <Route path="/inspections" element={<InspectionListPage />} />
          <Route path="/inspections/request" element={<InspectionRequestLandingPage />} />
          <Route path="/inspections/request/step1" element={<InspectionRequestStep1Page />} />
          <Route path="/inspections/request/step2" element={<InspectionRequestStep2Page />} />
          <Route path="/inspections/history" element={<InspectionHistoryPage />} />
          <Route path="/inspections/:inspectionId/progress" element={<InspectionProgressPage />} />
          <Route path="/inspections/:inspectionId/complete" element={<InspectionCompletePage />} />
          <Route path="/offers" element={<TradeListPage />} />
          <Route path="/offers/proposals" element={<GeneralSaleOffersPage />} />
          <Route path="/logistics/schedule" element={<LogisticsSchedulePage />} />
          <Route path="/logistics/history" element={<LogisticsHistoryPage />} />
          <Route path="/sales/history" element={<SalesHistoryPage />} />
          <Route path="/settlements" element={<SettlementListPage />} />
          <Route path="/settlements/:settlementId" element={<SettlementDetailPage />} />
          <Route path="/mypage" element={<Navigate to="/mypage/settlement-account" replace />} />
          <Route path="/mypage/settlement-account" element={<SettlementAccountPage />} />
        </Route>

        {/* --- 폴백: 미매칭 경로 → /vehicles --- */}
        <Route path="*" element={<Navigate to="/vehicles" replace />} />
      </Routes>
      {isRunDev() && <DevSkipFloatingButton />}
    </BrowserRouter>
  );
};
