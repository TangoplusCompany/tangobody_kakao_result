import type { IBiaData } from "../../types/bia";

export default function BodyTypeChart({data}: {data: IBiaData}) {

  const maxBodyFatMass = 30; // 체지방률 최대치
  const maxBMI = 33.5;       // BMI 최대치


  const bodyFatMassPos = Math.min((data.body_fat_mass / maxBodyFatMass) * 100, 100);
  const bmiPos = Math.min((data.bmi / maxBMI) * 100, 100);

  const myDotPosition = {
    left: `${bodyFatMassPos}%`,
    bottom: `${100 - bmiPos}%`, 
  };
  return (
    <div className="flex flex-col px-2 w-full h-full pb-8 md:pb-2">
      {/* 1. 타이틀 영역 */}
      <div className="flex gap-2 items-center mb-2 text-accent font-bold">
        <div className="w-3 h-3 rounded-[3px] bg-accent" />
        <div className="text-accent font-bold text-sm">
          바디 타입 세부 분석
        </div>
      </div>

      {/* 2. 그래프 영역 (여기에 flex-1 추가!) */}
      <div className="relative ml-6 mb-2">
        
        {/* --- Y축 라벨 (BMI) --- */}
        <div className="absolute -left-6 top-0 h-full text-[10px] text-sub400">
          <span className="absolute -top-2 left-1">BMI</span>
          <span className="absolute top-[25%] -translate-y-1/2">30.0</span>
          <span className="absolute top-[50%] -translate-y-1/2">25.0</span>
          <span className="absolute top-[75%] -translate-y-1/2">18.5</span>
        </div>

        {/* --- 메인 그리드 표 (h-[160px]를 h-full로 변경!) --- */}
        <div className="grid grid-cols-3 grid-rows-4 w-full h-[256px] border border-sub200 rounded-md text-[11px] text-sub800 bg-white relative">
          
          {/* Row 1 */}
          <div className="border-b border-r border-sub200 flex items-center justify-center">우람한</div>
          <div className="row-span-2 border-b border-r border-sub200 flex items-center justify-center">건장한</div>
          <div className="border-b border-sub200 flex items-center justify-center">뚱뚱한</div>

          {/* Row 2 */}
          <div className="border-b border-r border-sub200 flex items-center justify-center">다부진</div>
          <div className="border-b border-sub200 flex items-center justify-center">통통한</div>

          {/* Row 3 */}
          <div className="border-b border-r border-sub200 flex items-center justify-center">날씬한</div>
          <div className="border-b border-r border-sub200 flex items-center justify-center">평범한</div>
          <div className="row-span-2 border-sub200 flex flex-col items-center justify-center leading-tight">
            <span>부분적으로</span>
            <span>뚱뚱한</span>
          </div>

          {/* Row 4 */}
          <div className="border-r border-sub200 flex items-center justify-center">홀쭉한</div>
          <div className="border-r border-sub200 flex items-center justify-center">마른</div>

          {/* --- 내 위치 마커 --- */}
          <div
            className="absolute w-3.5 h-3.5 bg-accent/75 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: myDotPosition.left, top: myDotPosition.bottom }}
          />
        </div>

        {/* --- X축 라벨 (체지방률) --- */}
        <div className="absolute -bottom-0.5 left-0 w-full text-[10px] text-sub400">
          <span className="absolute left-[33.33%] -translate-x-1/2">10.0</span>
          <span className="absolute left-[66.66%] -translate-x-1/2">20.0</span>
          <span className="absolute right-0">체지방률</span>
        </div>

      </div>
    </div>
  );
}