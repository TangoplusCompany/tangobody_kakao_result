import { useState } from "react";
import { usePostGuestLogin } from "../hooks/usePostGuestLogin"; // 훅 경로에 맞게 수정
import { cn } from "../lib/utils";
import fullLogo from "../assets/img_logo_full.svg"
import MainContainer from "./MainContainer";

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
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 남기고 모두 제거
    const inputVal = e.target.value.replace(/[^0-9]/g, "");
    
    // eslint-disable-next-line no-useless-assignment
    let formattedVal = "";
    if (inputVal.length < 4) {
      formattedVal = inputVal;
    } else if (inputVal.length < 8) {
      formattedVal = `${inputVal.slice(0, 3)}-${inputVal.slice(3)}`;
    } else {
      formattedVal = `${inputVal.slice(0, 3)}-${inputVal.slice(3, 7)}-${inputVal.slice(7, 11)}`;
    }

    setMobile(formattedVal);
  };
  // 로그인 버튼 클릭 시 실행
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim() || !trValue) return;

    // 객체 형태로 인자 전달 (방법 1 기준)
    mutate({ 
      mobile: mobile.replace(/[^0-9]/g, ""), // 하이픈을 모두 지우고 숫자만 보냄
      encryptedData: trValue 
    });
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
    <div className="flex min-h-screen justify-center">
      {/* 💡 h-full 대신 min-h-screen을 유지하고 내부 정렬은 자식들에게 위임합니다. */}
      <main className="w-full bg-white flex flex-col min-h-[calc(100vh-80px)]">
        
        {/* 1. 로그인 성공 데이터(reportData)가 없으면 로그인 폼을 보여줌 */}
        {!reportData ? (
          <div className="flex-1 flex flex-col justify-center items-center py-12 px-6">
            <div className="w-full max-w-md flex flex-col justify-center items-center shadow-xl border border-sub-200 rounded-3xl p-6 bg-white">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex flex-col gap-6 items-center">
                  <img src={fullLogo} className="h-16" alt="Full Logo" />
                  <div className="flex flex-col text-start w-full">
                    <p className="text-xl font-bold text-sub-800 mt-2">탱고바디 사용자 조회</p>
                    <p className="text-base text-sub-500 mt-1">기기에서 등록했던 전화번호를 입력해주세요</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <input
                    type="tel"
                    placeholder="전화번호를 입력해 주세요 (010부터 입력)"
                    value={mobile}
                    onChange={handleMobileChange} 
                    maxLength={13} 
                    disabled={isPending}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-base transition-all"
                  />

                  <button
                    type="submit"
                    disabled={isPending || !mobile.trim()}
                    className={cn(
                      "w-full bg-accent text-white py-3 px-4 rounded-xl font-medium text-base transition-all active:scale-[0.98]",
                      "disabled:bg-sub-150 disabled:text-sub-400 cursor-pointer disabled:pointer-events-none"
                    )}
                  >
                    {isPending ? "로그인 중..." : "결과 확인하기"}
                  </button>
                </form>

                {isError && (
                  <p className="text-sm text-red-500 text-center font-medium pt-2">
                    {error?.message || "로그인에 실패했습니다. 번호를 확인해주세요."}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* 2. 로그인 성공 시 -> MainContainer는 중앙 정렬의 영향을 받지 않고 최상단부터 자연스럽게 나열됩니다. */
          <MainContainer data={reportData} />
        )}

      </main>
    </div>
  );
}