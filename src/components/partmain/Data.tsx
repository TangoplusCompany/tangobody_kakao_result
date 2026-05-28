import type { IBasicCards, IBasicCardUnit, IBasicInfo, IReportDetail } from "../../types/basic";
import { getRiskString } from "../../util/getRiskString";

interface PartMainDataProps {
  data: keyof IBasicCards;   // "neck", "shoulder" 등
  rawData: IBasicCards;      // 전체 데이터 객체
  summaryData: IReportDetail;
}


export function PartMainData({ data, rawData, summaryData }: PartMainDataProps) {
  function getRiskBgColor(riskLevel: number): string {
    const colorMap: Record<number, string> = {
      0: "bg-sub-100 text-sub-200", // 정상 혹은 낮은 단계
      1: "bg-orange-600 text-orange-600",   // 주의 단계
      2: "bg-red-600 text-red-600",   // 위험 단계
    };

    // 매핑된 값이 없으면 기본값으로 "text-sub-800"을 반환합니다.
    return colorMap[riskLevel] ?? "bg-sub-100 text-sub-200";
  }

  function getArrowColor(riskLevel: number): string {
    const colorMap: Record<number, string> = {
      0: "text-sub-200", // 정상 혹은 낮은 단계
      1: "text-orange-800",   // 주의 단계
      2: "text-red-800",   // 위험 단계
    };

    // 매핑된 값이 없으면 기본값으로 "text-sub-800"을 반환합니다.
    return colorMap[riskLevel] ?? "text-sub-800";
  }

  const riskKey = `risk_level_${data}` as keyof IBasicInfo;
  const rangeKey = `range_level_${data}` as keyof IBasicInfo;
  const currentRiskLevel = summaryData.result_summary_data[riskKey] as number;
  const currentRangeLevel = summaryData.result_summary_data[rangeKey] as number;
  const bgCondition = {
    0: "bg-sub-600",
    1: "bg-orange-600",
    2: "bg-red-600",
  }[currentRiskLevel] ?? "bg-sub-200";
    const riskString = getRiskString(riskKey);



  const titleMap: Record<keyof IBasicCards, string> = {
    neck: "목",
    shoulder: "어깨",
    elbow: "팔꿈치",
    hip: "골반",
    knee: "무릎",
    ankle: "발목"
  };

  const detailTitleMap: Record<string, string> = {
    turtle_neck: "거북목",
    scoliosis: "경추 측만",
    side_neck_balance: "측면 목 근육",
    shoulder_tilit: "어깨 기울기",
    frozen_shoulder: "오십견",
    shoulder_impingement: "어깨 충돌 증후군",
    bicep_tension: "이두근 긴장",
    elbow_disorder: "팔꿈치 질환",
    elbow_muscle_tension: "팔꿈치 아래팔 근육 긴장",
    hip_tilit: "골반 기울기",
    hip_disorder: "골반 질환",
    hip_knee_tilit: "골반,무릎 기울기 (측면)",
    knee_angle: "골반,무릎 각도 (정면)",
    knee_disorder: "무릎 질환",
    hip_knee_ankle_tilit: "골반,무릎,발목 기울기",
    ankle_angle: "발목 각도",
    left_right_balance: "족압 분포-좌우",
    uppper_lower_balance: "상하 무게 균형",
  };

  const title: string = titleMap[data] || "알 수 없음";

  const targetSection = rawData[data]; 

  const detailKeys = Object.keys(targetSection);

  return (
    <div className="grid grid-cols-[1fr_3fr] border-b border-sub-200 last:border-b-0 w-full h-full">
      <div className={`bg-sub-100 font-bold p-2 flex items-center justify-center`}>
        <div className="flex flex-col text-[12px] md:text-base">
          {title} 
          <span className={`${bgCondition} text-white text-[9px] md:text-xs font-bold px-2 py-0.5 md:py-1 rounded-full shrink-0 mt-1 leading-none`}>
            {riskString} {currentRangeLevel}단계
          </span>
        </div>
      </div>

      <div className="grid grid-rows-3 h-full">
        {detailKeys.map((rawKey) => {
          const detailTitle = detailTitleMap[rawKey] || rawKey;
          const unitData = targetSection[rawKey as keyof typeof targetSection] as IBasicCardUnit;
          const riskLevel = unitData.risk_level;
          const rangeLevel = unitData.range_level;
          const styleClass = getRiskBgColor(riskLevel);
          const arrowClass = getArrowColor(riskLevel);
          return (
            <div key={rawKey} className="h-full grid grid-cols-[30%_70%] border-b last:border-b-0 items-center">
              <span className="text-sub-800 text-[9px] md:text-sm leading-none items-center flex justify-center text-center p-1 print:p-0">
                {detailTitle}
              </span>

              <div className="grid grid-rows-2 w-full h-full text-center text-[8px] font-bold leading-none">
                {/* 1층: 상단 바 및 화살표 영역 */}
                <div className="grid grid-cols-3">
                  {[0, 1, 2].map((idx) => {
                    const defaultBgMap: Record<number, string> = {
                      0: "bg-sub-100",
                      1: "bg-sub-150",
                      2: "bg-sub-200",
                    };

                    // 현재 인덱스가 riskLevel과 같으면 활성화 색상, 다르면 지정된 기본 배경색 사용
                    const currentBg = riskLevel === idx 
                      ? styleClass.split(" ")[0] 
                      : (defaultBgMap[idx] ?? "bg-sub-600");

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center justify-center relative ${currentBg}`}
                      >
                        {/* 현재 riskLevel 위치에만 역삼각형 화살표 표시 */}
                        {riskLevel === idx && (
                          <span className={`text-[12px] md:text-base  leading-none absolute top-0.5 ${arrowClass}`}>▼</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 2층: 단계 텍스트 영역 */}
                <div className="grid grid-cols-3 h-full items-center">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="flex justify-center items-center">
                      {/* 현재 riskLevel 위치에만 X단계 텍스트 표시 */}
                      {riskLevel === idx && (
                        <span className={`text-xs md:text-sm ${styleClass.split(" ")[1]}`}>
                          {rangeLevel}단계
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}