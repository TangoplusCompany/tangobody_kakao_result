

import type { GaitContainerProps } from "./Container";

export type GaugeType = "high" | "low" | "center";

export interface FallItemData {
  title: string;
  risk?: number;
  value: number;
  unit: string;
  gaugeType?: GaugeType; // 'high' | 'low' | 'center' (기본값: 'high')
  
  // 3단계(high/low)용
  threshold0: number;
  threshold1: number;
  
  // 5단계(center)용 옵션
  threshold2?: number;
  threshold3?: number;
}
const RISK_RECORD = {
  0: {
    label: "정상",
    badgeCss: "bg-sub600",
    activeBarCss: "bg-mainBlue-300",
  },
  1: {
    label: "주의",
    badgeCss: "bg-orange-600",
    activeBarCss: "bg-orange-600",
  },
  2: {
    label: "위험",
    badgeCss: "bg-red-600",
    activeBarCss: "bg-red-600",
  },
} as const;
// Risk 자동 판정
const getRiskFromValue = (item: FallItemData): number => {
  const { value, threshold0, threshold1, threshold2 = 0, threshold3 = 0, gaugeType = "high" } = item;

  if (gaugeType === "low") { // 낮을수록 정상 (정상 -> 주의 -> 위험)
    if (value < threshold0) return 0; // 정상
    if (value <= threshold1) return 1; // 주의
    return 2; // 위험
  }

  if (gaugeType === "center") { // 중앙이 정상 (위험 -> 주의 -> 정상 -> 주의 -> 위험)
    if (value < threshold0 || value > threshold3) return 2; // 위험
    if (value < threshold1 || value > threshold2) return 1; // 주의
    return 0; // 정상
  }

  // 기본 "high" (높을수록 정상: 위험 -> 주의 -> 정상)
  if (value < threshold0) return 2; // 위험
  if (value <= threshold1) return 1; // 주의
  return 0; // 정상
};

// 위치 퍼센트 계산
const calculatePercent = (item: FallItemData): number => {
  const { value, threshold0, threshold1, threshold2 = 0, threshold3 = 0, gaugeType = "high" } = item;
  if (!value || value <= 0) return 0;

  if (gaugeType === "center") { // 5단계 (구간당 20%)
    if (value <= threshold0) return (value / threshold0) * 20;
    if (value <= threshold1) return 20 + ((value - threshold0) / (threshold1 - threshold0)) * 20;
    if (value <= threshold2) return 40 + ((value - threshold1) / (threshold2 - threshold1)) * 20;
    if (value <= threshold3) return 60 + ((value - threshold2) / (threshold3 - threshold2)) * 20;
    const maxVal = threshold3 + (threshold3 - threshold2);
    return Math.min(100, 80 + ((value - threshold3) / (maxVal - threshold3)) * 20);
  }

  // 3단계 (구간당 33.3%)
  if (value <= threshold0) return (value / threshold0) * 33.3;
  if (value <= threshold1) return 33.3 + ((value - threshold0) / (threshold1 - threshold0)) * 33.3;
  const maxVal = threshold1 + (threshold1 - threshold0);
  return Math.min(100, 66.6 + ((value - threshold1) / (maxVal - threshold1)) * 33.4);
};
const calculatePercentFromRaw = (
  value: number,
  threshold0: number,
  threshold1: number
): number => {
  if (!value || value <= 0) return 0;

  if (value <= threshold0) return (value / threshold0) * 33.3;
  if (value <= threshold1) return 33.3 + ((value - threshold0) / (threshold1 - threshold0)) * 33.3;
  
  const maxVal = threshold1 + (threshold1 - threshold0);
  return Math.min(100, 66.6 + ((value - threshold1) / (maxVal - threshold1)) * 33.4);
};

export function FallItem({ item }: { item: FallItemData }) {
  const gaugeType = item.gaugeType ?? "high";
  const calculatedRisk = getRiskFromValue(item);
  const riskKey = item.risk ?? calculatedRisk;
  const riskInfo = RISK_RECORD[riskKey as keyof typeof RISK_RECORD] || RISK_RECORD[0];
  const position = calculatePercent(item);

  return (
    <div className="flex flex-col w-full gap-4 mb-2 ">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <span className="text-sm sm:text-base font-semibold text-sub800">{item.title}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-semibold text-sub800">{item.value.toFixed(1)} {item.unit}</span>
          <span className={`px-3 py-1 rounded-full text-xs text-white text-center whitespace-normal break-keep ${riskInfo.badgeCss}`}>
            {riskInfo.label}
          </span>
        </div>
      </div>

      {/* 게이지 바 */}
      <div className="relative w-full py-2 items-center">
        <div className="relative w-full h-3 rounded-full overflow-hidden flex">
          {gaugeType === "center" ? (
            /* 5단계: 위험 -> 주의 -> 정상 -> 주의 -> 위험 */
            <>
              <div className={`w-[20%] ${position < 20 ? "bg-sub800" : "bg-sub800/50"}`} />
              <div className={`w-[20%] ${position >= 20 && position < 40 ? "bg-sub400" : "bg-sub400/50"}`} />
              <div className={`w-[20%] ${position >= 40 && position < 60 ? "bg-sub200" : "bg-sub200/50"}`} />
              <div className={`w-[20%] ${position >= 60 && position < 80 ? "bg-sub400" : "bg-sub400/50"}`} />
              <div className={`w-[20%] ${position >= 80 ? "bg-sub800" : "bg-sub800/50"}`} />
            </>
          ) : gaugeType === "low" ? (
            /* 3단계(Low): 정상 -> 주의 -> 위험 */
            <>
              <div className={`w-[33.3%] ${position < 33.3 ? "bg-sub200" : "bg-sub200/50"}`} />
              <div className={`w-[33.3%] ${position >= 33.3 && position < 66.6 ? "bg-sub400" : "bg-sub400/50"}`} />
              <div className={`w-[33.4%] ${position >= 66.6 ? "bg-sub800" : "bg-sub800/50"}`} />
            </>
          ) : (
            /* 3단계(High): 위험 -> 주의 -> 정상 */
            <>
              <div className={`w-[33.3%] ${position < 33.3 ? "bg-sub800" : "bg-sub800/50"}`} />
              <div className={`w-[33.3%] ${position >= 33.3 && position < 66.6 ? "bg-sub400" : "bg-sub400/50"}`} />
              <div className={`w-[33.4%] ${position >= 66.6 ? "bg-sub200" : "bg-sub200/50"}`} />
            </>
          )}
        </div>

        {/* 인디케이터 */}
        <div
          className="absolute top-[1px] -translate-x-1/2 bg-white shadow-md border border-sub200 rounded-full w-6 h-6 flex items-center justify-center z-10 transition-all"
          style={{ left: `${position}%` }}
        >
          <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.38235 0C3.07059 0 3.63971 0.302294 4.08971 0.906882C4.53971 1.51147 4.76471 2.268 4.76471 3.17647C4.76471 3.78529 4.69412 4.317 4.55294 4.77159C4.46028 5.06996 4.36952 5.32545 4.28066 5.53807C4.2055 5.7179 4.01103 5.81044 3.81991 5.77222L0.6079 5.12982C0.460243 5.10028 0.337049 4.99723 0.290049 4.85417C0.225286 4.65705 0.166192 4.44193 0.112765 4.20882C0.0379419 3.88235 0.000353537 3.53824 5.95514e-07 3.17647C5.95514e-07 2.39118 0.209648 1.66553 0.628942 0.999529C1.04824 0.333529 1.63271 0.000352941 2.38235 0ZM1.65441 9C1.17794 9 0.783001 8.83235 0.469589 8.49706C0.156177 8.16176 -0.000352346 7.74265 5.95514e-07 7.23971C5.95514e-07 7.03676 0.030883 6.84053 0.0926478 6.651C0.114374 6.58433 0.136646 6.52009 0.159465 6.45826C0.229274 6.26913 0.43022 6.16931 0.627823 6.20929L3.31367 6.75273C3.5301 6.79652 3.6838 6.99588 3.63887 7.21207C3.55193 7.63039 3.37574 8.00807 3.11029 8.34512C2.76618 8.78206 2.28088 9.00035 1.65441 9Z" fill="black"/>
          </svg>
        </div>

        {/* 하단 기준선 라벨 */}
        <div className="absolute w-full bottom-0 flex text-[11px] text-sub400 font-medium">
          {gaugeType === "center" ? (
            <>
              <span className="absolute left-[20%] -translate-x-1/2">{item.threshold0}</span>
              <span className="absolute left-[40%] -translate-x-1/2">{item.threshold1}</span>
              <span className="absolute left-[60%] -translate-x-1/2">{item.threshold2}</span>
              <span className="absolute left-[80%] -translate-x-1/2">{item.threshold3}</span>
            </>
          ) : (
            <>
              <span className="absolute left-[33.3%] -translate-x-1/2">{item.threshold0} {item.unit}</span>
              <span className="absolute left-[66.6%] -translate-x-1/2">{item.threshold1} {item.unit}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



//📞📞📞📞 tiltItem 
type TiltType = "deviation" | "zero";

interface TiltItemData {
  title: string;
  value: number;
  type: TiltType;
  target?: number;      // type이 "deviation"일 때 기준값 (기본 180)
  maxDeviation: number; // 이 편차 이상이면 0점
}
function calcScore({ value, type, target = 180, maxDeviation }: Omit<TiltItemData, "title">): number {
  const deviation = type === "deviation" ? Math.abs(value - target) : Math.abs(value);
  const score = 100 - (deviation / maxDeviation) * 100;
  return Math.max(0, Math.min(100, score));
}

// 점수 구간별 색상
function getScoreColor(score: number): string {
  if (score >= 80) return "bg-sub600";
  if (score >= 50) return "bg-orange-500";
  return "bg-red-600";
}

function TiltItem({ title, value, type, target, maxDeviation }: TiltItemData) {
  const score = calcScore({ value, type, target, maxDeviation });
  const barColor = getScoreColor(score);

  return (
    <div className="grid grid-cols-[25%_10%_65%] item-center rounded-xl bg-sub200 px-2 py-1">
      <span className="text-sub800 text-xs sm:text-sm text-start font-semibold">{title}</span>
      <span className="text-sub800 text-xs sm:text-sm font-semibold">{value.toFixed(1)}º</span>

      <div className="flex w-full rounded-r-lg overflow-hidden bg-sub100 items-center justify-between py-1">
        <div
          className={`flex h-2.5 rounded-r-lg ${barColor} transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function GaitFall({ data }: GaitContainerProps) {
  const iData = data.gait_measure_info
  const fallItems: FallItemData[] = [
    {
      title: "발끝 들림 높이",
      value: iData?.averageToeClearance ?? 1.1,
      unit: "cm",
      gaugeType: "high", // 3단계: 위험 -> 주의 -> 정상
      threshold0: 1.0,
      threshold1: 2.0,
    },
    {
      title: "양발 지지 비율",
      value: iData?.avgDoubleSupportRatio ?? 15,
      unit: "%",
      gaugeType: "low", // 3단계: 정상 -> 주의 -> 위험 (낮을수록 좋음)
      threshold0: 24,
      threshold1: 30,
    },
    {
      title: "보행 속도",
      value: iData?.overallGaitSpeed ?? 1.4,
      unit: "m/s",
      gaugeType: "high", // 5단계: 위험 -> 주의 -> 정상 -> 주의 -> 위험
      threshold0: 10,
      threshold1: 20,
      threshold2: 30,
      threshold3: 40,
    },
    {
      title: "보폭 너비",
      value: iData?.averageStepWidth ?? 16.3,
      unit: "cm",
      gaugeType: "center", // 5단계: 위험 -> 주의 -> 정상 -> 주의 -> 위험
      threshold0: 5,
      threshold1: 8,
      threshold2: 15,
      threshold3: 25,
    },
  ];

  const kneeRisk = iData.resultKneeFlexionRisk
  const riskInfo = RISK_RECORD[kneeRisk as keyof typeof RISK_RECORD] || RISK_RECORD[0];
  const leftKneePosition = calculatePercentFromRaw(iData.avgMaxLeftKneeFlexion, 40, 55);
  const rightKneePosition = calculatePercentFromRaw(iData.avgMaxRightKneeFlexion, 40, 55);

  const tiltItems: TiltItemData[] = [
    {
      title: "골반 틀어짐",
      value: iData.avgMaxPevisDrop,
      type: "deviation",
      target: 180,
      maxDeviation: 30, // 180에서 30도 이상 벗어나면 0점
    },
    {
      title: "상체 전방 숙임",
      value: iData.avgMaxTrunkFlexion,
      type: "zero",
      maxDeviation: 20, // 20도 이상이면 0점
    },
    {
      title: "상체 좌우 흔들림",
      value: iData.avgMaxTrunkSway,
      type: "zero",
      maxDeviation: 15,
    },
    {
      title: "팔 스윙 비대칭",
      value: iData.avgArmSwingSymmetry,
      type: "zero",
      maxDeviation: 100, // 예: 179.8 같은 큰 값이 나올 수 있어 범위 넓게 잡음
    },
  ];
  return (
    <div className="flex flex-col flex-1 min-h-80 h-full border-2 border-sub100 rounded-xl p-4 gap-2">
      
      <div className="text-lg font-semibold mb-2 text-sub800">
        낙상 주요 지표
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        {fallItems.map((item, index) => (
          <FallItem key={index} item={item} />
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col w-full gap-4 mb-2 ">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base font-semibold text-sub800">무릎 최대 굽힘</span>
            <div className="flex items-center gap-1.5">
              <div className="text-xs sm:text-sm flex gap-2 font-semibold">
                <span className=" text-sub800">L {iData.avgMaxLeftKneeFlexion.toFixed(1)}º</span>
                <span className=" text-sub800"> | </span>
                <span className=" text-sub800">R {iData.avgMaxRightKneeFlexion.toFixed(1)}º</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs text-white text-center whitespace-normal break-keep ${riskInfo.badgeCss}`}>
                {riskInfo.label}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            {/* 1. 좌측 게이지 바 */}
            <div className="flex items-center gap-2 w-full">
              <div className="shrink-0 whitespace-nowrap text-sm font-medium text-sub800 w-8">
                좌측
              </div>
              <div className="relative w-full py-2">
                <div className="relative w-full h-3 rounded-full overflow-hidden flex">
                  <div className={`w-[33.3%] ${leftKneePosition < 33.3 ? "bg-sub800" : "bg-sub800/50"}`} />
                  <div className={`w-[33.3%] ${leftKneePosition >= 33.3 && leftKneePosition < 66.6 ? "bg-sub400" : "bg-sub400/50"}`} />
                  <div className={`w-[33.4%] ${leftKneePosition >= 66.6 ? "bg-sub200" : "bg-sub200/50"}`} />
                </div>

                <div
                  className="absolute top-[1px] -translate-x-1/2 bg-white shadow-md border border-sub200 rounded-full w-6 h-6 flex items-center justify-center z-10 transition-all"
                  style={{ left: `${leftKneePosition}%` }}
                >
                  <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.38235 0C3.07059 0 3.63971 0.302294 4.08971 0.906882C4.53971 1.51147 4.76471 2.268 4.76471 3.17647C4.76471 3.78529 4.69412 4.317 4.55294 4.77159C4.46028 5.06996 4.36952 5.32545 4.28066 5.53807C4.2055 5.7179 4.01103 5.81044 3.81991 5.77222L0.6079 5.12982C0.460243 5.10028 0.337049 4.99723 0.290049 4.85417C0.225286 4.65705 0.166192 4.44193 0.112765 4.20882C0.0379419 3.88235 0.000353537 3.53824 5.95514e-07 3.17647C5.95514e-07 2.39118 0.209648 1.66553 0.628942 0.999529C1.04824 0.333529 1.63271 0.000352941 2.38235 0ZM1.65441 9C1.17794 9 0.783001 8.83235 0.469589 8.49706C0.156177 8.16176 -0.000352346 7.74265 5.95514e-07 7.23971C5.95514e-07 7.03676 0.030883 6.84053 0.0926478 6.651C0.114374 6.58433 0.136646 6.52009 0.159465 6.45826C0.229274 6.26913 0.43022 6.16931 0.627823 6.20929L3.31367 6.75273C3.5301 6.79652 3.6838 6.99588 3.63887 7.21207C3.55193 7.63039 3.37574 8.00807 3.11029 8.34512C2.76618 8.78206 2.28088 9.00035 1.65441 9Z" fill="black"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. 우측 게이지 바 */}
            <div className="flex items-center gap-2 w-full">
              <div className="shrink-0 whitespace-nowrap text-sm font-medium text-sub800 w-8">
                우측
              </div>
              <div className="relative w-full py-2">
                <div className="relative w-full h-3 rounded-full overflow-hidden flex">
                  <div className={`w-[33.3%] ${rightKneePosition < 33.3 ? "bg-sub800" : "bg-sub800/50"}`} />
                  <div className={`w-[33.3%] ${rightKneePosition >= 33.3 && rightKneePosition < 66.6 ? "bg-sub400" : "bg-sub400/50"}`} />
                  <div className={`w-[33.4%] ${rightKneePosition >= 66.6 ? "bg-sub200" : "bg-sub200/50"}`} />
                </div>

                <div
                  className="absolute top-[1px] -translate-x-1/2 bg-white shadow-md border border-sub200 rounded-full w-6 h-6 flex items-center justify-center z-10 transition-all"
                  style={{ left: `${rightKneePosition}%` }}
                >
                  <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.38235 0C3.07059 0 3.63971 0.302294 4.08971 0.906882C4.53971 1.51147 4.76471 2.268 4.76471 3.17647C4.76471 3.78529 4.69412 4.317 4.55294 4.77159C4.46028 5.06996 4.36952 5.32545 4.28066 5.53807C4.2055 5.7179 4.01103 5.81044 3.81991 5.77222L0.6079 5.12982C0.460243 5.10028 0.337049 4.99723 0.290049 4.85417C0.225286 4.65705 0.166192 4.44193 0.112765 4.20882C0.0379419 3.88235 0.000353537 3.53824 5.95514e-07 3.17647C5.95514e-07 2.39118 0.209648 1.66553 0.628942 0.999529C1.04824 0.333529 1.63271 0.000352941 2.38235 0ZM1.65441 9C1.17794 9 0.783001 8.83235 0.469589 8.49706C0.156177 8.16176 -0.000352346 7.74265 5.95514e-07 7.23971C5.95514e-07 7.03676 0.030883 6.84053 0.0926478 6.651C0.114374 6.58433 0.136646 6.52009 0.159465 6.45826C0.229274 6.26913 0.43022 6.16931 0.627823 6.20929L3.31367 6.75273C3.5301 6.79652 3.6838 6.99588 3.63887 7.21207C3.55193 7.63039 3.37574 8.00807 3.11029 8.34512C2.76618 8.78206 2.28088 9.00035 1.65441 9Z" fill="black"/>
                  </svg>
                </div>

                <div className="absolute w-full bottom-0 flex text-[11px] text-sub400 font-medium">
                  <span className="absolute left-[33.3%] -translate-x-1/2">40º</span>
                  <span className="absolute left-[66.6%] -translate-x-1/2">50º</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col w-full gap-4 mb-2 ">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base font-semibold text-sub800">보행 균형</span>
            
          </div>
          <div className="flex flex-col gap-2">
            {tiltItems.map((item) => (
              <TiltItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}