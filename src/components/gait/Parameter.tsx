import type { GaitContainerProps } from "./Container";

// 1. 위험도 레코드 (뱃지 스타일 및 활성화 바 색상)
const RISK_RECORD = {
  0: {
    label: "정상",
    badgeCss: "bg-sub600 dark:bg-gray-600",
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

export type RiskType = keyof typeof RISK_RECORD;
// 퍼센트 자동 계산 함수 (0~33% / 33~66% / 66~100% 구간 선형 보간)
const calculatePercent = (val: number, t0: number, t1: number) => {
  if (!val || val <= 0) return 0;
  if (val <= t0) {
    return (val / t0) * 33.3;
  }
  if (val <= t1) {
    return 33.3 + ((val - t0) / (t1 - t0)) * 33.3;
  }
  // t1 초과 시 (구간 간격을 상한선으로 설정하여 계산)
  const maxVal = t1 + (t1 - t0);
  const overPercent = 66.6 + ((val - t1) / (maxVal - t1)) * 33.4;
  return Math.min(100, Math.max(0, overPercent));
};
const getRiskFromValue = (val: number, t0: number, t1: number) => {
  if (val < t0) return 2; // 위험
  if (val <= t1) return 1; // 주의
  return 0; // 정상
};


export interface ParameterItem {
  title: string;
  risk: number;
  value: number; // 실제 측정값 (퍼센트 계산용)
  threshold0: number; // 33% 경계값
  threshold1: number; // 66% 경계값
  unit: string; // 단위 (m/s, m, step/min, %)
  leftValue?: string;
  rightValue?: string;
}
function GaitItem({ item }: { item: ParameterItem }) {
  // 💡 risk 값이 넘어오지 않거나 자동 계산이 필요한 경우 수치 기반으로 판정
  const calculatedRisk = getRiskFromValue(item.value, item.threshold0, item.threshold1);
  const riskKey = item.risk ?? calculatedRisk;
  const riskInfo = RISK_RECORD[riskKey as keyof typeof RISK_RECORD] || RISK_RECORD[0];

  const position = calculatePercent(item.value, item.threshold0, item.threshold1);

  // 구간별 활성화
  const isLowActive = position < 33.3;
  const isMidActive = position >= 33.3 && position < 66.6;
  const isHighActive = position >= 66.6;

  // 게이지 아이템 컴포넌트 파일 (예: src/components/gait/GaitGaugeItem.tsx)

  return (
    /* 💡 1. h-full 과 justify-center 를 추가하여 높이 안에서 중앙 정렬 기반 마련 */
    <div className="flex flex-col justify-center w-full h-full mb-2">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <span className="text-sm sm:text-base font-semibold text-sub700">{item.title}</span>
        
        <div className="flex gap-1 items-center">
          <span className="text-xs sm:text-sm text-sub700 font-semibold">{item.value.toFixed(1)}{item.unit}</span>
          <span className={`px-3 py-1 rounded-full text-xs text-white text-center whitespace-normal break-keep ${riskInfo.badgeCss}`}>
            {riskInfo.label}
          </span>
        </div>
      </div>

      {/* 게이지 바 
          💡 2. my-auto를 통해 L/R 박스가 없을 때는 자동으로 세로 중앙에 위치하도록 설정 
          💡 3. 하단 수치 라벨 공간 확보를 위해 pb-5 pt-2 지정
      */}
      <div className="relative w-full py-2 mb-3">
        <div className="relative w-full h-3 rounded-full overflow-hidden flex">
          {/* 1구간 (< t0): 위험 영역 */}
          <div className={`w-[33.3%] transition-colors ${isLowActive ? "bg-sub800" : "bg-sub800/50"}`} />
          {/* 2구간 (t0 ~ t1): 주의 영역 */}
          <div className={`w-[33.3%] transition-colors ${isMidActive ? "bg-sub400" : "bg-sub400/50"}`} />
          {/* 3구간 (> t1): 정상 영역 */}
          <div className={`w-[33.4%] transition-colors ${isHighActive ? "bg-sub200" : "bg-sub200/50"}`} />
        </div>

        {/* 발자국 인디케이터 */}
        <div
          className="absolute top-[1px] -translate-x-1/2 bg-white shadow-md border border-sub200 rounded-full w-6 h-6 flex items-center justify-center z-10"
          style={{ left: `${position}%` }}
        >
          <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.38235 0C3.07059 0 3.63971 0.302294 4.08971 0.906882C4.53971 1.51147 4.76471 2.268 4.76471 3.17647C4.76471 3.78529 4.69412 4.317 4.55294 4.77159C4.46028 5.06996 4.36952 5.32545 4.28066 5.53807C4.2055 5.7179 4.01103 5.81044 3.81991 5.77222L0.6079 5.12982C0.460243 5.10028 0.337049 4.99723 0.290049 4.85417C0.225286 4.65705 0.166192 4.44193 0.112765 4.20882C0.0379419 3.88235 0.000353537 3.53824 5.95514e-07 3.17647C5.95514e-07 2.39118 0.209648 1.66553 0.628942 0.999529C1.04824 0.333529 1.63271 0.000352941 2.38235 0ZM1.65441 9C1.17794 9 0.783001 8.83235 0.469589 8.49706C0.156177 8.16176 -0.000352346 7.74265 5.95514e-07 7.23971C5.95514e-07 7.03676 0.030883 6.84053 0.0926478 6.651C0.114374 6.58433 0.136646 6.52009 0.159465 6.45826C0.229274 6.26913 0.43022 6.16931 0.627823 6.20929L3.31367 6.75273C3.5301 6.79652 3.6838 6.99588 3.63887 7.21207C3.55193 7.63039 3.37574 8.00807 3.11029 8.34512C2.76618 8.78206 2.28088 9.00035 1.65441 9Z" fill="black"/>
          </svg>
        </div>

        {/* 라벨 */}
        <div className="absolute w-full bottom-0 flex text-[11px] text-sub400 font-medium">
          <span className="absolute left-[33.3%] -translate-x-1/2">{item.threshold0} {item.unit}</span>
          <span className="absolute left-[66.6%] -translate-x-1/2">{item.threshold1} {item.unit}</span>
        </div>
      </div>

      {/* L / R 수치 박스 */}
      {item.leftValue && item.rightValue && (
        <div className="grid grid-cols-2 gap-2 text-xs md:text-sm font-medium text-sub700 mt-2 mb-1">
          <div className="bg-sub200 py-2 rounded-lg text-center">L - {item.leftValue}</div>
          <div className="bg-sub200 py-2 rounded-lg text-center">R - {item.rightValue}</div>
        </div>
      )}
    </div>
  );
}

export default function GaitParameter({ data }: GaitContainerProps) {
  const iData = data.gait_measure_info
  const gaitItems: ParameterItem[] = [
    {
      title: "보행속도(Gait Speed)",
      risk: Number(iData?.resultSpeedRisk ?? 0),
      value: iData?.avgOverallStepSpeed ?? 1.1,
      threshold0: 0.8,
      threshold1: 1.3,
      unit: "m/s",
      leftValue: `${(iData?.avgLeftStepSpeed ?? 1.5).toFixed(1)} m/s`,
      rightValue: `${(iData?.avgRightStepSpeed ?? 1.2).toFixed(1)} m/s`,
    },
    {
      title: "평균 보폭(Step Length)",
      risk: Number(iData?.resultStepLengthRisk ?? 0),
      value: iData?.averageStepLength ?? 0.65,
      threshold0: 0.5,
      threshold1: 0.75,
      unit: "m",
      leftValue: `${(iData?.avgLeftStepLength ?? 0.65).toFixed(1)} %`,
      rightValue: `${(iData?.avgRightStepLength ?? 0.65).toFixed(1)} %`,
    },
    {
      title: "평균 활보장(Stride Length)",
      risk: Number(iData?.resultStrideLengthRisk ?? 1),
      value: iData?.avgLeftStrideLength ?? 0.6,
      threshold0: 1.0,
      threshold1: 1.5,
      unit: "m",
      leftValue: `${(iData?.avgLeftStepLength ?? 0.7).toFixed(1)} m`,
      rightValue: `${(iData?.avgRightStepLength ?? 0.5).toFixed(1)} m`,
    },
    {
      title: "케이던스(Cadence)",
      risk: 0,
      value: iData?.cadence ?? 95,
      threshold0: 90,
      threshold1: 120,
      unit: "steps/min",
    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full p-4 bg-white rounded-xl border-2 border-sub100">
      <div className="text-lg font-semibold mb-2 text-sub700">
        보행 분석 파라미터
      </div>
      <div className="grid grid-rows-4 gap-2 h-full">
        {gaitItems.map((item, index) => (
          <GaitItem key={index} item={item} />
        ))}
      </div>
      
    </div>
  );
}