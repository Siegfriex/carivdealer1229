/**
 * Sidebar Component
 * 좌측 메뉴 사이드바
 */

import { LayoutDashboard, Car, Truck, FileText, TrendingUp } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface SidebarProps {
  currentPath?: string;
  className?: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'vehicles', label: '차량 관리', icon: Car, href: '/vehicles' },
  { id: 'logistics', label: '탁송 관리', icon: Truck, href: '/logistics/schedule' },
  { id: 'settlements', label: '정산 관리', icon: FileText, href: '/settlements' },
  { id: 'sales', label: '판매 이력', icon: TrendingUp, href: '/sales/history' },
];

/**
 * 좌측 메뉴 사이드바 (대시보드·차량·탁송·정산·판매이력)
 * @param props.currentPath - 현재 경로 (활성 링크 하이라이트)
 */
export const Sidebar = ({ currentPath = '/', className = '' }: SidebarProps) => {
  return (
    <aside className={`w-64 bg-white border-r border-gray-200 h-screen sticky top-0 ${className}`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath.startsWith(item.href);

            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-md
                    text-body font-medium transition-base
                    ${
                      isActive
                        ? 'bg-primary-light text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
