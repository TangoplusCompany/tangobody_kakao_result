import type { IBiaData } from "@/types/bia";

interface AnalysisHorizonCardProps {
  title: string;
  value: number;
  low: number;
  high: number;
}


export function AnalysisHorizonCard({ title, value, low, high }: AnalysisHorizonCardProps) {
  
  
  const calculatePosition = (val: number) => {
    if (val <= 0) return 0;
    
    // 1. 표준 이하 구간
    if (val < low) {
      return (val / low) * 33.3;
    }
    
    const range = high - low; // 표준 범위 너비
    
    // 2. 표준 구간
    if (val <= high) {
      return 33.3 + ((val - low) / range) * 33.3;
    }
    
    // 3. 표준 이상 구간 (초과분을 표준 범위 너비 대비 비율로 계산)
    const excess = val - high;
    const pos = 66.6 + (excess / range) * 33.3;
    
    return Math.min(pos, 100); // 최대 100%로 제한
  };
  
  const currentPos = calculatePosition(value);
  const statePos = (() => {
    if (value < low) return 0;
    if (value <= high) return 1;
    return 2;
  }) ();
  

  // const stateColor = {
  //   0: "bg-accent",
  //   1: "bg-sub300 ",
  //   2: "bg-redd"
  // }[statePos];
  const COLORS = {
    sub300: "#E0E0E0", // 표준 구간 배경색
    warning: "#FFA546", // 시작색 (bg-sub300)
    mainBlue: "#5B93FF", // 0일 때 끝색
    danger: "#FF766C",   // 2일 때 끝색
  };
  const endColor = {
    0: COLORS.danger,
    1: COLORS.mainBlue,
    2: COLORS.warning
  }[statePos];

  return (
    <div className="flex h-full items-center gap-1 w-full ">
      {/* 타이틀 박스 */}
      <div className={`flex items-center h-full p-2 w-14 text-sm leading-tight font-bold text-white rounded-[4px] justify-center bg-sub300`}>
        {title}
      </div>

      {/* 메인 데이터 영역 */}
      <div className="flex flex-1 h-full items-center bg-sub100 rounded-sm pr-2">
        <div className="flex flex-col leading-none items-center w-16 text-center bg-white/80 rounded-[4px] ml-1 my-1 px-1 py-1">
          <span className="text-xs font-bold text-sub800 ">{value}</span>
          <span className="text-xs text-sub400 ">{low}~{high}</span>
        </div>

        <div className="relative flex-1 h-full flex items-center">
          
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-sub100 rounded-l-md border-r border-white/50" />
            <div className="h-full flex-1 bg-sub200 border-r border-white/50" />
            <div className="flex-1 bg-sub100 rounded-r-md" />
          </div>
          
          <div className="flex flex-col flex-1 gap-1.5 z-10">
            <div 
              className={`relative h-3 rounded-r-[4px] transition-all duration-700 ease-out}`}
              style={{ width: `${currentPos}%`, backgroundImage: `linear-gradient(to right, ${COLORS.sub300}, ${endColor})` }}
            />
          
          </div>

          
          <div 
            className="absolute right-0 z-20 w-fit"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
          </div>
        </div>
      </div>
    </div>
  );
}


interface IAnalysisCardProps {
  label: string;
  value: number;
  unit: string;
  grade: number; // 0: 낮음, 1: 보통, 2: 높음
}

const labelMap = { 1: "보통", 2: "주의", 3: "위험" };
const labelBgMap = { 1: "bg-sub300", 2: "bg-orange-600", 3: "bg-red-600" };
const AnalysisCard = ({ label, value, unit, grade }: IAnalysisCardProps) => {
  const statusLabel = labelMap[grade as keyof typeof labelMap];

  return (
    <div className="bg-sub100 border border-sub200 rounded-[3px] py-1 flex flex-col items-center gap-1 leading-[2.0]">
      {/* 라벨 */}
      <span className="text-sm font-bold text-sub800 mb-0.5">{label}</span>
      
      {/* 수치 */}
      <div className="flex items-baseline gap-0.5 leading-[1]">
        <span className="text-xs font-bold text-sub800">{value.toFixed(1)}</span>
        <span className="text-xs text-sub400 font-medium">{unit}</span>
      </div>

      {/* 게이지 바 */}
      {/* <div className="relative w-12 h-1 bg-sub300 rounded-full my-0.5">
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-sub400 border border-sub100 rounded-full transition-all duration-300"
          style={{ left: leftPos, transform: `translate(-50%, -50%)` }}
        />
      </div> */}

      {/* 하단 등급 표시 */}
      <div className={`mt-0.5 px-1 ${labelBgMap[grade as keyof typeof labelMap]} rounded-[3px] text-white text-[10px] font-bold text-center`}>
        {statusLabel}
      </div>
    </div>
  );
};


export default function MainAnalysis({
  data,
  prevMuscleMassIndex
}: {
  data: IBiaData
  prevMuscleMassIndex?: number
}) {
  const typeInitial = ({
    0: "C",
    1: "I",
    2: "D",
    3: "U"
  } as const)[data.result_cid_type as 0 | 1 | 2 | 3];
  const typeTitle = ({
    0: "C형 근감소성 비만",
    1: "I형 완전표준형",
    2: "D형 비만",
    3: "U형 불균형"
  } as const)[data.result_cid_type as 0 | 1 | 2 | 3];
  const diffMuscleMassIndex = data.skeletal_muscle_mass_index - (prevMuscleMassIndex ? prevMuscleMassIndex : data.skeletal_muscle_mass_index)
  // const statusLabel = labelMap[data. as keyof typeof labelMap];
  // const leftPos = posMap[grade as keyof typeof posMap];

  // 근감소 수치 지표
const muscleMassIndex = (() => {
  const val = data.skeletal_muscle_mass_index;
  const isMale = data.br_input_gender === 0;

  if (isMale) {
    // 남성 기준: 7.0 미만(0), 9.5 이상(2), 그 외(1)
    return val < 7.0 ? 0 : val >= 9.5 ? 2 : 1;
  } else {
    // 여성 기준: 5.7 미만(0), 7.0 이상(2), 그 외(1)
    return val < 5.7 ? 0 : val >= 7.0 ? 2 : 1;
  }
})();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4 p-2 h-auto items-stretch">
      
      <div className="flex flex-col gap-2 w-full h-full justify-between">
        <div className="flex flex-col flex-1 w-full justify-center items-center gap-4 py-4"> 
          {/* 가로 정렬을 위해 내부 아이템들을 감싸는 레이아웃 추가 */}
          <div className="flex w-full items-center justify-center gap-4">
            {/* 왼쪽 아이콘 */}
            <div className="w-20 shrink-0 bg-sub100 rounded-2xl border-2 border-sub200 flex justify-center">
              <span 
                className="text-[64px] font-bebas font-semibold text-sub200 leading-none flex items-center mt-2" 
                style={{ WebkitTextStroke: '1px #7E7E7E' }}
              >
                {typeInitial}
              </span>
            </div>

            {/* 오른쪽 텍스트 */}
            <div className="text-sub800 flex flex-col flex-1 min-w-0 text-start">
              <span className="text-sm font-bold">{typeTitle}</span>
              <span className="text-xs leading-[1.3] break-keep">{data.result_cid_comment}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col ">
          <div className="grid grid-cols-[0.9fr_1fr_1fr_1fr] text-xs text-center text-sub600 ml-14 mb-2 items-center">
            <span className="leading-none">체성분<br/> 밸런스</span>
            <span>표준 이하</span>
            <span>표준</span>
            <span>표준 이상</span>
          </div>


          <div className="grid grid-rows-3 gap-2 h-full">
            {[
              { label: "체중", value: data.weight, low: data.weight_std_min, high: data.weight_std_max }, // 0, 1, 2 중 하나
              { label: "골격근", value: data.skeletal_muscle_mass, low: data.skeletal_muscle_mass_std_min, high: data.skeletal_muscle_mass_std_max }, 
              { label: "체지방", value: data.body_fat_mass, low: data.body_fat_mass_std_min, high: data.body_fat_mass_std_max },
            ].map((item,) => {
            
              return (
                <AnalysisHorizonCard key={item.label} title={item.label} value={item.value} low={item.low} high={item.high} />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full h-full justify-between">
        <div className="flex flex-col flex-1  bg-sub100 border border-sub200 rounded-[2px] pt-1 pb-8 px-2">
            <div className="flex items-center gap-2 ">
              <div className="w-3 h-3 rounded-[3px] bg-accent" />
              <div className="text-accent font-bold text-sm">
                근감소 수치
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center leading-none">
                    
              {/* 수치 */}
              <div className="flex flex-col text-center">
                <span className="text-base font-bold text-sub800">{data.skeletal_muscle_mass_index.toFixed(1)}</span>
                <span className="text-sm font-bold text-sub800">(이전 대비 {-diffMuscleMassIndex.toFixed(1)})</span>
              </div>

              {/* 게이지 바 */}
              <div className="flex flex-col w-48 gap-2">
                {/* 상단 라벨 영역: justify-between으로 양 끝과 중앙 배치 */}
                <div className="flex justify-between w-full px-0.5">
                  <span className="text-xs font-bold text-gray-400">평균이하</span>
                  <span className="text-xs font-bold text-gray-400">평균</span>
                  <span className="text-xs font-bold text-gray-400">평균이상</span>
                </div>

                {/* 게이지 바 영역 */}
                <div className="relative flex items-center w-full ">
                  {/* 배경 바 */}
                  <div className="w-full h-1.5 bg-sub200 rounded-full"></div>
                  
                  {/* 현재 수치 포인트 */}
                  <div 
                    className="absolute w-3.5 h-3.5 bg-accent rounded-full border-2 border-white shadow-sm"
                    style={{ 
                      left: (muscleMassIndex === 1 ? "50%" : muscleMassIndex === 2 ? "90%" : "10%"), 
                      transform: "translate(-50%, 0)"
                    }}
                  ></div>
                </div>
              </div>

            </div>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-2 pt-2">
          <AnalysisCard 
            label="골격근량" 
            value={data.skeletal_muscle_mass} 
            unit="kg" 
            grade={data.result_skeletal_muscle_mass_grade} 
          />
          <AnalysisCard 
            label="내장지방" 
            value={data.visceral_fat_level} 
            unit="" 
            grade={data.result_visceral_fat_level_grade} 
          />
          <AnalysisCard 
            label="세포외 수분비" 
            value={data.extracellular_water_volume} 
            unit="" 
            grade={data.result_extracellular_water_grade} 
          />
          <AnalysisCard 
            label="체지방률" 
            value={data.body_fat_percentage} 
            unit="%" 
            grade={data.result_body_fat_percentage_grade} 
          />
          <AnalysisCard 
            label="기초대사량" 
            value={data.basal_metabolism_kcal} 
            unit="kcal" 
            grade={data.result_basal_metabolism_kcal_grade} 
          />
          <AnalysisCard 
            label="BMI" 
            value={data.bmi} 
            unit="" 
            grade={data.result_basal_metabolism_kcal_grade} 
          />
        </div>
      </div>
    </div>
  );
};