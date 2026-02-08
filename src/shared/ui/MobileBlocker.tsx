/**
 * MobileBlocker Component
 * 700px 미만 화면에서 표시되는 안내 메시지
 */

export const MobileBlocker = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">데스크톱에서 접속해주세요</h1>
        <p className="text-gray-600 leading-relaxed mb-4">
          본 서비스는 데스크톱 환경에 최적화되어 있습니다.
          <br />
          PC나 태블릿(가로 모드)에서 접속해주세요.
        </p>
        <p className="text-sm text-gray-500">최소 권장 해상도: 700px × 600px</p>
      </div>
    </div>
  );
};
