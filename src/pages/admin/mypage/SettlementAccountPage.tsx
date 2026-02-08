/**
 * 마이페이지 정산 계좌 등록/변경/조회. IA §4.14.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.14
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.2
 * 라우트: /mypage/settlement-account. Figma 1418-38264.
 */

import { User, Plus, Check, Settings } from 'lucide-react';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { MypageSidebar } from '@/widgets/MypageSidebar/ui/MypageSidebar';
import { Button } from '@/shared/ui/Button';
import { LAYOUT_CLASSES } from '@/shared/config/layout';

export const SettlementAccountPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" />

      <div className={LAYOUT_CLASSES.CONTAINER}>
        <div className="flex">
          <MypageSidebar />

          <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING} ${LAYOUT_CLASSES.MAIN_LIST}`}>
            <div className={LAYOUT_CLASSES.MAIN_DETAIL}>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* 제목 */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <h1 className="text-h3 font-bold text-gray-900">
                  정산 계좌 등록 / 변경 / 조회
                </h1>
              </div>

              <div className="p-6 space-y-6">
                {/* 사용자 정보 영역 */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                    <button
                      type="button"
                      className="absolute -bottom-0.5 -right-0.5 p-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50"
                      aria-label="설정"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-h4 font-bold text-gray-900">홍길동</span>
                      <span className="text-success" aria-hidden>
                        <Check className="w-5 h-5" />
                      </span>
                    </div>
                    <p className="text-body text-gray-600 mt-0.5">개인 사업자</p>
                    <button
                      type="button"
                      className="mt-2 flex items-center gap-1.5 text-body text-primary font-medium hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      내 차량 추가하기
                    </button>
                  </div>
                </div>

                {/* 정산 계좌 */}
                <div>
                  <h2 className="text-h4 font-bold text-gray-900 mb-4">정산 계좌</h2>
                  <dl className="space-y-0 divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-3 bg-gray-50/50">
                      <dt className="text-body text-gray-600">국가</dt>
                      <dd className="text-body font-medium text-gray-900">대한민국</dd>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3">
                      <dt className="text-body text-gray-600">은행명</dt>
                      <dd className="text-body font-medium text-gray-900">카카오뱅크</dd>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 bg-gray-50/50">
                      <dt className="text-body text-gray-600">계좌번호</dt>
                      <dd className="text-body font-medium text-gray-900">00-0000-0000-0</dd>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3">
                      <dt className="text-body text-gray-600">예금주</dt>
                      <dd className="text-body font-medium text-gray-900">홍길동</dd>
                    </div>
                  </dl>
                </div>

                {/* 변경하기 버튼 */}
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    // 편집 뷰(1418:38114)로 전환 시 라우트 추가 후 navigate('/mypage/settlement-account/edit')
                  }}
                >
                  변경하기
                </Button>
              </div>
            </div>
          </div>
        </main>
        </div>
      <footer className="py-6 border-t border-gray-200">
        <p className="text-caption text-gray-500">
          ForwardMax Cariv Domestic Seller 1.0 Prototype
        </p>
      </footer>
      </div>
    </div>
  );
};
