import type { IBiaData } from "../../types/bia";


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
        value: curr[key].toFixed(1),
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
      value: currVal.toFixed(1),
      diff: Math.abs(Number(diffVal)).toFixed(1),
      status: status,
      up: isUp,
    };
  });
};

// 2. 개별 데이터 셀 컴포넌트
const DataCell = ({ value, diff, status, unit, up }: { value: string, diff: string, status: string, unit: string, up: boolean }) => {
  const colorClass = 
    status === 'red' ? ' text-redd-600' : 
    status === 'blue' ? ' text-accent' :
    ' text-sub-600 bg-white';

  return (
    <div className={`flex flex-col items-center justify-center rounded-sm py-1 px-1 w-full min-w-10 h-7 leading-none ${colorClass}`}>
      <span className="text-[9px] font-bold leading-tight">{value}{unit}</span>
      <div className="flex items-center gap-0.5 text-[7px] mt-1">
        <span>{up ? '▲' : '▼'}</span>
        <span>{diff}</span>
      </div>
    </div>
  );
};

export default function TrendGraph({data}: {data:IBiaData}) {
  const dates = data.history_data.map((data) => data.measure_date)
  const sortedHistory = [...data.history_data].reverse();
  const TREND_DATA = {
    score: transformToTrend(sortedHistory, 'body_score'),
    sarcopenia: transformToTrend(sortedHistory, 'skeletal_muscle_mass_index'),
    skeletal: transformToTrend(sortedHistory, 'skeletal_muscle_mass'),
    weight: transformToTrend(sortedHistory, 'weight', true),
    fat: transformToTrend(sortedHistory, 'body_fat_mass', true),
  };
  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex justify-between items-center ">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-sm" />
          <h2 className="text-sm font-bold text-accent">측정 이력</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-sub-600 rounded-xs" />
          <span className="text-[10px] text-gray-500 font-medium">최근이력</span>
        </div>
      </div>

      <div className="flex justify-center h-full items-center">
        <div className="">
          {/* 날짜 행 */}
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-2 mb-1">
            <div /> {/* 첫 칸 비우기 */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="text-center text-[9px] text-gray-400 font-medium min-h-3">
                {dates[i] ? dates[i].slice(0, 10).replace(/-/g, ".") : ""}
              </div>
            ))}
          </div>

          {/* 카테고리별 데이터 행 */}
          <div className="flex flex-col gap-0.5">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="grid grid-cols-[80px_repeat(7,1fr)] gap-0.5 items-center">
                {/* 왼쪽 카테고리 라벨 */}
                <div className="flex flex-col items-center justify-center bg-gray-100 rounded-sm h-7 text-center leading-tight">
                  <span className="text-[9px] font-bold text-gray-700 leading-tight">{cat.label}</span>
                  <span className="text-[7px] text-gray-500 font-medium">({cat.unit})</span>
                </div>

                {/* 해결책: 항상 7번 루프를 돕니다 */}
                {Array.from({ length: 7 }).map((_, i) => {
                  // 해당 인덱스(i)에 데이터가 있는지 확인
                  const data = TREND_DATA[cat.id as keyof typeof TREND_DATA]?.[i];

                  return data ? (
                    <DataCell key={i} {...data} unit={cat.unit} />
                  ) : (
                    <div key={i} className="border-2 border-gray-200 rounded-sm h-full opacity-40" />
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