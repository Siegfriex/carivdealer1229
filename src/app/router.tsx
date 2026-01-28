/**
 * Application Router
 * 라우팅 설정
 */

import { useState, useEffect } from 'react';
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
import { VehicleRegistrationCompletePage } from '@/pages/admin/vehicle/VehicleRegistrationCompletePage';
import { LoginPage } from '@/pages/admin/LoginPage';
import { VehicleListPage } from '@/pages/admin/VehicleListPage';
import { GeneralSaleOffersPage } from '@/pages/admin/GeneralSaleOffersPage';
import { LogisticsSchedulePage } from '@/pages/admin/LogisticsSchedulePage';
import { LogisticsHistoryPage } from '@/pages/admin/LogisticsHistoryPage';
import { SalesHistoryPage } from '@/pages/admin/SalesHistoryPage';
import { SettlementListPage } from '@/pages/admin/SettlementListPage';
import { SettlementDetailPage } from '@/pages/admin/SettlementDetailPage';

// 간단한 라우팅 (React Router 없이, 기존 Screen 기반)
export type Screen =
  | 'SCR-0000'  // Landing
  | 'SCR-0001'  // Login
  | 'SCR-0100'  // Dashboard
  | 'SCR-0101'  // Vehicle List
  | 'SCR-0200'  // General Sale Offers
  | 'SCR-0300'  // Logistics Schedule
  | 'SCR-0301'  // Logistics History
  | 'SCR-0400'  // Sales History
  | 'SCR-0500'  // Settlement List
  | 'SCR-0501'  // Settlement Detail
  | 'SIGNUP_ENTRY'
  | 'SIGNUP_STEP1'
  | 'SIGNUP_STEP2'
  | 'SIGNUP_STEP3'
  | 'SIGNUP_STEP4'
  | 'SIGNUP_STEP5'
  | 'SIGNUP_PENDING'
  | 'SIGNUP_COMPLETE'
  | 'VEHICLE_REGISTER_ENTRY'
  | 'VEHICLE_REGISTER_STEP1'
  | 'VEHICLE_REGISTER_STEP2'
  | 'INSPECTIONS_LIST'
  | 'INSPECTION_REQUEST_STEP1'
  | 'INSPECTION_REQUEST_STEP2'
  | 'INSPECTION_PROGRESS'
  | 'INSPECTION_COMPLETE'
  | 'INSPECTION_HISTORY'
  | 'INSPECTION_REQUEST_LANDING'
  | 'VEHICLE_REGISTRATION_COMPLETE';

export const Router = () => {
  // URL 기반 라우팅
  const [pathname, setPathname] = useState(window.location.pathname);

  // URL 변경 감지
  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleNavigate = (screen: string) => {
    // Screen ID를 URL로 변환하여 이동 (기존 호환성)
    const screenToPath: Record<string, string> = {
      'SCR-0000': '/',
      'SCR-0001': '/login',
      'SCR-0100': '/dashboard',
      'SCR-0101': '/vehicles',
      // ... 필요시 추가
    };
    const path = screenToPath[screen] || '/login';
    window.history.pushState({}, '', path);
    setPathname(path);
  };

  // URL to Screen 매핑
  const getScreenFromPath = (): Screen => {
    const pathToScreen: Record<string, Screen> = {
      '/': 'SCR-0000',
      '/login': 'SCR-0001',
      '/signup': 'SIGNUP_ENTRY',
      '/signup/step1': 'SIGNUP_STEP1',
      '/signup/step2': 'SIGNUP_STEP2',
      '/signup/step3': 'SIGNUP_STEP3',
      '/signup/step4': 'SIGNUP_STEP4',
      '/signup/step5': 'SIGNUP_STEP5',
      '/signup/pending': 'SIGNUP_PENDING',
      '/signup/complete': 'SIGNUP_COMPLETE',
      '/dashboard': 'SCR-0100',
      '/vehicles': 'SCR-0101',
      '/vehicles/new': 'VEHICLE_REGISTER_ENTRY',
      '/vehicles/new/step1': 'VEHICLE_REGISTER_STEP1',
      '/vehicles/new/step2': 'VEHICLE_REGISTER_STEP2',
      '/inspections': 'INSPECTIONS_LIST',
      '/inspections/request/step1': 'INSPECTION_REQUEST_STEP1',
      '/inspections/request/step2': 'INSPECTION_REQUEST_STEP2',
      '/offers': 'SCR-0200',
      '/logistics/schedule': 'SCR-0300',
      '/logistics/history': 'SCR-0301',
      '/sales/history': 'SCR-0400',
      '/settlements': 'SCR-0500',
    };

    // 동적 경로 처리: /inspections/history, /inspections/request, /inspections/:id/progress
    if (pathname === '/inspections/history') return 'INSPECTION_HISTORY';
    if (pathname === '/inspections/request') return 'INSPECTION_REQUEST_LANDING';
    if (pathname.startsWith('/inspections/') && pathname.endsWith('/progress')) {
      return 'INSPECTION_PROGRESS';
    }
    if (pathname.startsWith('/inspections/') && pathname.endsWith('/complete')) {
      return 'INSPECTION_COMPLETE';
    }
    if (pathname.startsWith('/vehicles/') && pathname.endsWith('/complete')) {
      return 'VEHICLE_REGISTRATION_COMPLETE';
    }
    if (pathname.startsWith('/settlements/')) {
      return 'SCR-0501';
    }

    return pathToScreen[pathname] || 'SCR-0001';
  };

  const currentScreen = getScreenFromPath();

  // Screen to Component 매핑
  const renderScreen = () => {
    switch (currentScreen) {
      case 'SCR-0000':
        return <LandingPage />;
      case 'SCR-0001':
        return <LoginPage />;
      case 'SCR-0100':
        // Dashboard를 매물목록뷰로 리다이렉트
        window.location.href = '/vehicles';
        return <VehicleListPage />;
      case 'SCR-0101':
        return <VehicleListPage />;
      case 'INSPECTIONS_LIST':
        return <InspectionListPage />;
      case 'SCR-0200':
        return <GeneralSaleOffersPage onNavigate={handleNavigate} />;
      case 'SCR-0300':
        return <LogisticsSchedulePage onNavigate={handleNavigate} />;
      case 'SCR-0301':
        return <LogisticsHistoryPage onNavigate={handleNavigate} />;
      case 'SCR-0400':
        return <SalesHistoryPage onNavigate={handleNavigate} />;
      case 'SCR-0500':
        return <SettlementListPage onNavigate={handleNavigate} />;
      case 'SCR-0501':
        return <SettlementDetailPage onNavigate={handleNavigate} />;
      case 'SIGNUP_ENTRY':
        return <SignupEntryPage />;
      case 'SIGNUP_STEP1':
        return <SignupStep1Page />;
      case 'SIGNUP_STEP2':
        return <SignupStep2Page />;
      case 'SIGNUP_STEP3':
        return <SignupStep3Page />;
      case 'SIGNUP_STEP4':
        return <SignupStep4Page />;
      case 'SIGNUP_STEP5':
        return <SignupStep5Page />;
      case 'SIGNUP_PENDING':
        return <SignupPendingPage />;
      case 'SIGNUP_COMPLETE':
        return <SignupCompletePage />;
      case 'VEHICLE_REGISTER_ENTRY':
        return <VehicleRegisterEntryPage />;
      case 'VEHICLE_REGISTER_STEP1':
        return <VehicleRegisterStep1Page />;
      case 'VEHICLE_REGISTER_STEP2':
        return <VehicleRegisterStep2Page />;
      case 'INSPECTION_REQUEST_STEP1':
        return <InspectionRequestStep1Page />;
      case 'INSPECTION_REQUEST_STEP2':
        return <InspectionRequestStep2Page />;
      case 'INSPECTION_PROGRESS':
        return <InspectionProgressPage />;
      case 'INSPECTION_COMPLETE':
        return <InspectionCompletePage />;
      case 'INSPECTION_HISTORY':
        return <InspectionCompletePage />;
      case 'INSPECTION_REQUEST_LANDING':
        return <InspectionRequestLandingPage />;
      case 'VEHICLE_REGISTRATION_COMPLETE':
        return <VehicleRegistrationCompletePage />;
      default:
        return <DashboardPage />;
    }
  };

  return renderScreen();
};
