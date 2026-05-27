import { useState } from "react";
import { usePostGuestLogin } from "../hooks/usePostGuestLogin"; // 훅 경로에 맞게 수정
import { cn } from "../../lib/utils";

export default function ResultPage() {
  const [trValue, setTrValue] = useState<string | undefined>(undefined);
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  
  // 로그인 및 결과 데이터 관련 상태
  const [mobile, setMobile] = useState("");
  const { mutate, data: reportData, isPending, isError, error } = usePostGuestLogin();

  // URL 검증 로직 (기존 유지)
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tr = params.get("t_r");
    if (tr && tr.length >= 30) {
      setTrValue(tr);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  });

  // 로그인 버튼 클릭 시 실행
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim() || !trValue) return;

    // 객체 형태로 인자 전달 (방법 1 기준)
    mutate({ mobile, encryptedData: trValue });
  };

  if (isValid === undefined) return undefined;
  if (!isValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <p className="text-lg font-semibold text-gray-700">올바르지 않은 경로입니다.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-gray-100">
      <main className="w-full max-w-md bg-white shadow-lg min-h-screen flex flex-col p-6">
        
        {/* 1. 로그인 성공 데이터(reportData)가 없으면 로그인 폼을 보여줌 */}
        {!reportData ? (
          <div className="flex flex-col flex-1 justify-center items-center">
            <div className="w-full max-w-sm space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">TANGOBODY</h1>
                <p className="text-sm text-gray-500 mt-2">결과 확인을 위해 전화번호를 입력해주세요.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="tel"
                  placeholder="전화번호를 입력하세요 (- 제외)"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  disabled={isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-base transition-all"
                />

                <button
                  type="submit"
                  disabled={isPending || !mobile.trim()}
                  className={cn(
                    "w-full bg-brand text-white py-3 px-4 rounded-xl font-medium text-base transition-all active:scale-[0.98]",
                    "disabled:bg-gray-200 disabled:text-gray-400 disabled:pointer-events-none"
                  )}
                >
                  {isPending ? "로그인 중..." : "결과 확인하기"}
                </button>
              </form>

              {isError && (
                <p className="text-sm text-red-500 text-center font-medium">
                  {error?.message || "로그인에 실패했습니다. 번호를 확인해주세요."}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* 2. 로그인 성공 시 (reportData가 존재할 때) 보여줄 결과 화면 */
          <div className="flex flex-col flex-1 mt-4">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900">분석 결과 리포트</h2>
              <p className="text-sm text-gray-500 mt-1">안녕하세요, 회원님!</p>
            </div>
            
            {/* 여기에 이어서 다음 화면 UI 작업 진행하시면 됩니다. reportData 변수에 결과 들어있음 */}
            <div className="bg-gray-50 p-4 rounded-xl text-sm break-all">
              <pre>{JSON.stringify(reportData, null, 2)}</pre>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}