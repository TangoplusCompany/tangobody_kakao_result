import type { IBiaData } from "@/types/bia";


const CATEGORIES = [
  { id: 'score', label: '통합점수', unit: '점' },
  { id: 'sarcopenia', label: '근감소증 수치', unit: '%' },
  { id: 'weight', label: '몸무게', unit: 'kg' },
  { id: 'skeletal', label: '골격근량', unit: 'kg' },
  { id: 'fat', label: '지방량', unit: 'kg' },
];

const transformToTrend = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  history: any[], 
  key: string, 
  isInverse: boolean = false 
) => {
  return history.map((curr, idx) => {
    
    if (idx === 0) {
      return {
        value: curr[key],
        diff: "0.0",
        status: "gray",
        up: false,
      };
    }

    const prevVal = history[idx - 1][key];
    const currVal = curr[key];
    const diffVal = (currVal - prevVal).toFixed(1);
    const isUp = currVal > prevVal;
    const isDown = currVal < prevVal;

    // 상태 색상 로직
    let status = "gray";
    if (isUp) {
      status = isInverse ? "red" : "blue"; // 지표 성격에 따라 빨강/파랑 결정
    } else if (isDown) {
      status = isInverse ? "blue" : "red";
    }

    return {
      value: currVal,
      diff: Math.abs(Number(diffVal)).toFixed(1),
      status: status,
      up: isUp,
    };
  });
};

// 2. 개별 데이터 셀 컴포넌트
const DataCell = ({ idx, value, diff, status, unit, up }: { idx: number, value: string, diff: string, status: string, unit: string, up: boolean }) => {
  const colorClass = 
    status === 'red' ? ' text-red-600' : 
    status === 'blue' ? ' text-mainBlue-300' :
    ' text-sub600 bg-white';

  return (
    <div className={`flex flex-col items-center justify-center rounded-sm py-1 px-1 w-full min-w-[40px] h-[48px] leading-none border border-sub200 ${idx >= 5 ? 'hidden md:block' : ''} ${colorClass}`}>
      <span className="text-xs md:text-sm font-bold leading-tight">{value}{unit}</span>
      <div className="flex items-center gap-0.5 text-[12px] md:text-xs mt-1">
        <span>{up ? '▲' : '▼'}</span>
        <span>{diff}</span>
      </div>
    </div>
  );
};

export default function TrendGraph({data}: {data:IBiaData}) {
  const sortedHistory = [...data.history_data].slice(0, 7).reverse();
  const dates = sortedHistory.map((h) => h.measure_date);

  const TREND_DATA = {
    score: transformToTrend(sortedHistory, 'body_score'),
    sarcopenia: transformToTrend(sortedHistory, 'skeletal_muscle_mass_index'),
    skeletal: transformToTrend(sortedHistory, 'skeletal_muscle_mass'),
    weight: transformToTrend(sortedHistory, 'weight', true),
    fat: transformToTrend(sortedHistory, 'body_fat_mass', true),
  };
  return (
    <div className="flex flex-col w-full bg-white p-2">
      <div className="flex justify-between items-center ">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-mainBlue-300 rounded-[4px]" />
          <span className="text-sm font-bold text-mainBlue-300">측정 이력</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-sub600 rounded-[2px]" />
          <span className="text-xs text-gray-500 font-medium">최근이력</span>
        </div>
      </div>

      <div className="flex flex-1 w-full h-full items-center justify-center">
        {/* 기존 빈 div를 제거하거나 w-full 추가 */}
        <div className="w-full"> 
          
          {/* 상단 날짜 헤더 구역 */}
          {/* gap-2에서 아래 데이터 행과 맞추기 위해 gap-0.5로 통일하고 w-full 부여 */}
          <div className="grid grid-cols-[50px_repeat(5,1fr)] md:grid-cols-[80px_repeat(7,1fr)] gap-0.5 mb-1 w-full">
            <div /> 
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`text-center text-[10px] leading-tight md:text-sm text-gray-400 font-medium min-h-[12px] truncate ${i >= 5 ? 'hidden md:block' : ''}`}>
                {dates[i] ? (() => {
                  const [datePart, timePart] = dates[i].split(" "); 
                  const formattedDate = datePart.replace(/-/g, "."); 
                  const formattedTime = timePart ? timePart.slice(0, 5) : ""; 

                  return (
                    <>
                      {formattedDate}
                      <br />
                      {formattedTime}
                    </>
                  );
                })() : ""}
              </div>
            ))}
          </div>

          {/* 데이터 행 구역 */}
          <div className="flex flex-col w-full gap-0.5">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="grid grid-cols-[50px_repeat(5,1fr)] md:grid-cols-[80px_repeat(7,1fr)] gap-0.5 items-center w-full">
                
                {/* 카테고리 이름 영역 */}
                <div className="flex flex-col items-center justify-center bg-gray-100 rounded-sm h-[48px] text-center leading-tight">
                  <span className="text-xs md:text-sm font-bold text-gray-700 leading-tight">{cat.label}</span>
                  <span className="text-[12px] md: text-xs text-gray-500 font-medium">({cat.unit})</span>
                </div>

                {/* 7개 데이터 셀 영역 */}
                {Array.from({ length: 7 }).map((_, i) => {
                  const data = TREND_DATA[cat.id as keyof typeof TREND_DATA]?.[i];

                  return data ? (
                    // DataCell 내부에도 h-full과 w-full이 잘 먹히는지 확인 필요합니다.
                    <DataCell key={i} idx={i} {...data} unit={cat.unit} />
                  ) : (
                    // 빈 셀의 높이를 카테고리 높이(h-[28px])와 맞춰주기 위해 h-[28px] 추가
                    <div key={i} className="border-2 border-sub200 rounded-sm h-[48px] w-full opacity-40" />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}