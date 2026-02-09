/**
 * Header Component (GNB)
 * 상단 네비게이션 메뉴
 * 
 * 디자인: design/design_component/GNB(상단 네비게이션 메뉴).svg
 * 높이: 64px (4.44vw)
 * z-index: 200 (STICKY)
 */

import { User, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Z_INDEX } from '@/shared/config/zIndex';

interface HeaderProps {
  userName?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

/**
 * 상단 GNB 헤더 (로고·대시보드·차량관리·탁송·정산·사용자 메뉴)
 * @param props.userName - 표시 딜러명
 * @param props.onMenuClick - 모바일 메뉴 클릭
 * @param props.onLogout - 로그아웃 핸들러
 */
export const Header = ({ userName = '딜러명', onMenuClick, onLogout }: HeaderProps) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm"
      style={{ zIndex: Z_INDEX.STICKY }}
    >
      <div className="h-16 px-6 flex items-center justify-between">
        {/* 좌측: 로고 */}
        <div className="flex items-center gap-6">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="메뉴"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-h3 font-bold text-primary">ForwardMax</h1>
        </div>

        {/* 중앙: 네비게이션 메뉴 */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className="text-body font-medium text-gray-700 hover:text-primary transition-fast">
            대시보드
          </Link>
          <Link to="/vehicles" className="text-body font-medium text-gray-700 hover:text-primary transition-fast">
            차량 관리
          </Link>
          <Link to="/logistics/schedule" className="text-body font-medium text-gray-700 hover:text-primary transition-fast">
            탁송 관리
          </Link>
          <Link to="/settlements" className="text-body font-medium text-gray-700 hover:text-primary transition-fast">
            정산 관리
          </Link>
        </nav>

        {/* 우측: 사용자 정보 */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-fast"
          >
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-body font-medium text-gray-900">{userName}</span>
          </button>

          {/* 사용자 드롭다운 메뉴 */}
          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200"
              style={{ zIndex: Z_INDEX.DROPDOWN }}
            >
              <div className="py-2">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-body text-gray-700 hover:bg-gray-100 transition-fast"
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
