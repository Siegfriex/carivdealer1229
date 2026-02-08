/**
 * Application Router
 * React Router 기반 라우팅 (URL 단일 진입점, 새로고침/딥링크/뒤로가기 지원)
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { SettlementAccountPage } from '@/pages/admin/mypage/SettlementAccountPage';
import { DevSkipFloatingButton } from '@/shared/ui/DevSkipFloatingButton';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
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
        <Route path="/vehicles/:vehicleId" element={<VehicleDetailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/inspections" element={<InspectionListPage />} />
        <Route path="/inspections/request" element={<InspectionRequestLandingPage />} />
        <Route path="/inspections/request/step1" element={<InspectionRequestStep1Page />} />
        <Route path="/inspections/request/step2" element={<InspectionRequestStep2Page />} />
        <Route path="/inspections/history" element={<InspectionHistoryPage />} />
        <Route path="/inspections/:inspectionId/progress" element={<InspectionProgressPage />} />
        <Route path="/inspections/:inspectionId/complete" element={<InspectionCompletePage />} />
        <Route path="/offers" element={<GeneralSaleOffersPage />} />
        <Route path="/logistics/schedule" element={<LogisticsSchedulePage />} />
        <Route path="/logistics/history" element={<LogisticsHistoryPage />} />
        <Route path="/sales/history" element={<SalesHistoryPage />} />
        <Route path="/settlements" element={<SettlementListPage />} />
        <Route path="/settlements/:settlementId" element={<SettlementDetailPage />} />
        <Route path="/mypage/settlement-account" element={<SettlementAccountPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      {import.meta.env.DEV && <DevSkipFloatingButton />}
    </BrowserRouter>
  );
};
