import type { IBiaData } from "@/types/bia";
import type { SegmentData } from "../ui/VerticalStackedBar";
import VerticalStackedBar from "../ui/VerticalStackedBar";

interface CompositionCardProps {
  title: string;
  weight: number;
  value: number;
  low: number;
  high: number;
  prevValue?: number; // 직전 데이터 추가
}

export function CompositionCard({ title, weight, value, low, high, prevValue }: CompositionCardProps) {
  const stateColor = {
    "체수분": "bg-accent",
    "단백질": "bg-orange-600",
    "무기질": "bg-comp-dark",
    "체지방": "bg-red-600"
  }[title];
  
  const textColor = {
    "체수분": "text-accent",
    "단백질": "text-orange-600",
    "무기질": "text-sub750 ",
    "체지방": "text-red-600"
  }[title];

  const percentage = ((value / weight) * 100).toFixed(1);
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
  // 이전 데이터가 없으면 바를 보여주지 않도록 0으로 설정
  const prevPos = prevValue !== undefined ? calculatePosition(prevValue) : 0;
  
  // 증감 계산
  const diff = prevValue !== undefined ? (value - prevValue).toFixed(1) : undefined;
  const diffColor = Number(diff) > 0 ? "text-redd" : "text-accent";

  return (
    <div className="flex items-center gap-1 w-full h-full ">
      <div className={`flex items-center h-auto self-stretch w-12 sm:w-20 text-[12px] sm:text-sm leading-tight font-bold text-white rounded-[4px] justify-center ${stateColor}`}>
        {title}
      </div>

      {/* 메인 데이터 영역 */}
      <div className="flex flex-1 h-[34px] items-center bg-sub100 rounded-[4px] px-2 gap-0.5 sm:gap-2">
        <div className="w-12 text-center text-[13px] font-bold text-sub800">
          {percentage}%
        </div>

        <div className="relative flex-1 h-full flex items-center">
          {/* 배경 (3등분) */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-sub100 rounded-l-md border-r border-white/50" />
            <div className="flex-1 bg-sub200 border-r border-white/50" />
            <div className="flex-1 bg-sub100 rounded-r-md" />
          </div>
          
          {/* 막대 영역 */}
          <div className="flex flex-col flex-1 gap-1.5 z-10">
            {/* 현재 값 막대 */}
            <div 
              className={`relative h-2 rounded-r-[4px] transition-all duration-700 ease-out ${stateColor}`}
              style={{ width: `${currentPos}%` }}
            />
            {prevValue !== undefined && (
              <div 
                className={`relative h-1.5 rounded-r-full transition-all duration-700 ease-out bg-sub400/60`}
                style={{ width: `${prevPos}%` }}
              />
            )}
          </div>

          {/* 측정 값 라벨 */}
          <div 
            className="absolute right-0 z-20 w-fit"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <div className="bg-white/75 shadow-sm rounded-[4px] px-1.5 flex items-center justify-center gap-1 border border-sub200">
              <span className={`w-1.5 h-1.5 rounded-full ${stateColor}`} />
              <span className={`text-[12px] font-bold ${textColor}`}>{value}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 증감 표시 영역 */}
      <div className={`flex h-[34px] w-12 justify-center items-center bg-sub100 rounded-[4px] text-xs font-medium ${diff !== undefined ? diffColor : 'text-transparent'}`}>
        {diff !== undefined && (
          <>({Number(diff) >= 0 ? '▲' : '▼'} {Math.abs(Number(diff))})</>
        )}
        
      </div>
    </div>
  );
}


export default function Composition({data}: {data: IBiaData}) {
  const splitMessage = (message: string) => {
    const match = message.match(/\[(.*?)\]\s*(.*)/);
    
    if (match) {
      return {
        title: `[${match[1]}]`, // 좌측에 넣을 타이틀 (대괄호 포함)
        description: match[2]   // 우측에 넣을 나머지 본문
      };
    }

    return { title: "", description: message }; // 형식이 다를 경우 예외 처리
  };
  const { title, description } = splitMessage(data.result_body_composition_description);
  const mainComps = [
    {
      title: "체수분",
      value: data.moisture_content,
      low: data.moisture_content_std_min,
      high: data.moisture_content_std_max,
      prevValue: data.most_previous_data.moisture_content
    },
    {
      title: "단백질",
      value: data.protein_mass,
      low: data.protein_mass_std_min,
      high: data.protein_mass_std_max,
      prevValue: data.most_previous_data.protein_mass
      
    },
    {
      title: "무기질",
      value: data.amount_of_inorganic_salt,
      low: data.amount_of_inorganic_salt_std_min,
      high: data.amount_of_inorganic_salt_std_max,
      prevValue: data.most_previous_data.amount_of_inorganic_salt
    },
    {
      title: "체지방",
      value: data.body_fat_mass,
      low: data.body_fat_mass_std_min,
      high: data.body_fat_mass_std_max,
      prevValue: data.most_previous_data.body_fat_mass
    },
  ];
  const donutComps : SegmentData[] = [
    {
      label: "체수분",
      percentage: Number(((data.moisture_content / data.weight) * 100).toFixed(1)),
      color: "#5B93FF"
    },
    {
      label: "단백질",
      percentage: Number(((data.protein_mass / data.weight) * 100).toFixed(1)),
      color: "#FFA546"
    },
    {
      label: "무기질",
      percentage: Number(((data.amount_of_inorganic_salt / data.weight) * 100).toFixed(1)),
      color: "#7A828A"
    },
    {
      label: "체지방",
      percentage: Number(((data.body_fat_mass / data.weight) * 100).toFixed(1)),
      color: "#FF766C"
    }
  ]
  return (
    <div className="flex flex-col  p-2">
      
      <div className="flex items-center gap-2 ">
        <div className="w-3 h-3 rounded-[3px] bg-accent" />
        <div className="text-accent text-sm font-bold ">
          체성분 & 체수분 밸런스
        </div>
      </div>

      <div className="flex flex-col my-2 h-full w-full gap-2">
        {/* 1. 상단 헤더 영역 (전체 너비를 사용하며 하단 카드들의 바 위치와 정렬) */}
        

        {/* 2. 하단 컨텐츠 영역 (차트와 카드 리스트가 같은 높이를 공유) */}
        <div className="flex flex-1 gap-1 items-stretch">
          {/* 도넛 차트 컨테이너 (정중앙 배치) */}
          <div className="flex items-center justify-center px-2 md:px-12 ">
            <VerticalStackedBar  data={donutComps} />
          </div>

          <div className="flex flex-col flex-1 w-full h-full">
            <div className="flex w-full items-center text-xs text-sub800 font-bold">
              <div className="w-28 sm:w-40" /> 

              {/* 표준 영역: 하단 프로그레스 바와 수직으로 일치하게 됨 */}
              <div className="flex-1 grid grid-cols-3 text-center py-1">
                <span>표준 이하</span>
                <span>표준</span>
                <span>표준 이상</span>
              </div>

              {/* 변화 영역 */}
              <div className="w-16 text-right pr-3">
                <span>변화</span>
              </div>
            </div>
            {/* 카드 리스트 컨테이너 (차트 높이에 맞춰 카드 간격이 자동 조절되도록 justify-between 사용 가능) */}
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex items-center gap-1 w-full ">
                {/* 타이틀 박스 */}
                <div className={`flex items-center h-auto self-stretch w-12 sm:w-20 text-[12px] sm:text-sm leading-tight font-bold text-white rounded-[4px] justify-center bg-sub400`}>
                  평균 비율
                </div>

                {/* 메인 데이터 영역 */}
                <div className="flex h-fit flex-1 text-xs text-sub600 pl-2 sm:pl-6 items-center bg-sub100 rounded-sm px-2 py-1 gap-1">
                  체수분 : 55~65% / 단백질 : 15~18% / 무기질 : 5~6% / 체지방 :10~20%
                </div>
              </div>
              {mainComps.map((comp) => (
                <CompositionCard
                  key={comp.title}
                  title={comp.title}
                  weight={data.weight} 
                  value={comp.value}
                  low={comp.low}
                  high={comp.high}
                  prevValue={comp.prevValue}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-2  bg-sub100 border border-sub200 rounded-sm items-center ">
          <span className="font-bold text-sub800 text-xs md:text-sm text-center">{title}</span>
          <span className="text-sub800 text-[12px] md:text-xs leading-none">{description}</span>
      </div>
    </div>
  );
};