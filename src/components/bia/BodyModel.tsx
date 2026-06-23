import img_body from "@/assets/img_body.png"
import type { IBiaData } from "@/types/bia";
import type { SVGProps } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

interface PentagonChartDataItem {
  subject: string; 
  value: number; 
  lastValue: number; 
  weight: number;
  percent: string;
  status: string;
}

interface RechartsTickProps extends SVGProps<SVGTextElement> {
  x?: number;
  y?: number;
  payload?: {
    value: string;
    coordinate: number;
    index: number;
  };
}

export function PentagonChart({
  data,
  isMuscle,
}: {
  data: PentagonChartDataItem[];
  isMuscle: boolean;
}) {
  
  const CustomAngleAxis = (props: RechartsTickProps) => {
    const { payload, x, y } = props;
    
    if (!payload || x === undefined || y === undefined) return <g />;

    const item = data.find((d) => d.subject === payload.value);
    if (!item) return <g />;

    return (
      <g transform={`translate(${x},${y})`} style={{ overflow: "visible" }}>
        {/* 1. Subject (제목) */}
        <text
          textAnchor="middle"
          fill="#333"
          fontSize="14"
          fontWeight="bold"
          dy="-12"
        >
          {item.subject}
        </text>

        <text textAnchor="middle" fill="#666" dy="1">
          <tspan fontSize="14">{item.weight}kg</tspan>
          <tspan fontSize="12" fill="#999">{` (${item.percent})`}</tspan>
        </text>

        {/* 3. Status Badge (상태) */}
        <foreignObject
          // 💡 [수정] width가 64이므로, 중앙 정렬을 위해 x는 절반인 -32로 이동합니다.
          x="-32"
          y="6"
          width="64"
          height="18" // py-[2px]와 text-xs 공간을 고려해 높이도 살짝 늘려줍니다.
          style={{ overflow: "visible" }}
        >
          <div
            className={`
              text-xs text-white text-center rounded-[2px] 
              py-[2px] leading-none flex items-center justify-center min-w-[64px]
              ${item.status === "표준이상" ? "bg-accent/30" : "bg-sub400/30"}
            `}
          >
            {item.status}
          </div>
        </foreignObject>
      </g>
    );
  };

  const maxValue = isMuscle ? 150 : 300;

  return (
    // 1. relative 컨테이너 유지 (차트가 이 위에 얹어짐)
    <div className="relative flex-1 w-full min-h-0 flex justify-center items-center">
      
      {/* 2. absolute를 제거하고 h-64 부여 -> 이제 이 이미지가 부모의 높이를 확보합니다 */}
      <img
        src={img_body} 
        className="w-auto h-64 pointer-events-none" 
        alt="body-bg"
      />
      
      {/* 3. 차트 영역을 absolute로 변경하여 이미지 위에 덮어씌웁니다 */}
      <div className="absolute inset-0 z-10 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid gridType="polygon" stroke="#DBDBDB" />
            <PolarRadiusAxis
              domain={[0, maxValue]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="근육량"
              dataKey="lastValue"
              stroke="#7E7E7E"
              fill="#C1C1C1"
              fillOpacity={0.25}
              strokeDasharray="4 4"
            />
            <Radar
              name="근육량"
              dataKey="value"
              stroke="#5B93FF"
              fill="#5B93FF"
              fillOpacity={0.25}
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={CustomAngleAxis}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function BodyModel({data} : {data: IBiaData}) {

  const getStatusLabel = (status: number): string => {
    const statusMap: Record<number, string> = {
      0: "표준이하",
      1: "표준",
      2: "표준이상"
    };

    return statusMap[status] ?? "데이터 없음";
  };
  const muscleData = [
    { subject: "복부", 
      value: data.trunk_muscle_ratio, 
      lastValue: data.most_previous_data.trunk_muscle_ratio,
      fullMark: 150, 
      weight: data.trunk_muscle_mass, 
      percent: data.trunk_muscle_ratio + "%", 
      status: getStatusLabel(data.muscle_std_trunk)
    },
    { subject: "왼팔", 
      value: data.left_hand_muscle_ratio, 
      lastValue: data.most_previous_data.left_hand_muscle_ratio,
      fullMark: 150, 
      weight: data.left_hand_muscle_mass, 
      percent: data.left_hand_muscle_ratio + "%", 
      status: getStatusLabel(data.muscle_std_left_hand)
    },
    { subject: "왼다리", 
      value: data.left_foot_muscle_ratio, 
      lastValue: data.most_previous_data.left_foot_muscle_ratio,
      fullMark: 150, 
      weight: data.left_foot_muscle_mass, 
      percent: data.left_foot_muscle_ratio + "%", 
      status: getStatusLabel(data.muscle_std_left_foot) 
    },
    { subject: "오른다리", 
      value: data.right_foot_muscle_ratio, 
      lastValue: data.most_previous_data.right_foot_muscle_ratio,
      fullMark: 150, 
      weight: data.right_foot_muscle_mass, 
      percent: data.right_foot_muscle_ratio + "%", 
      status: getStatusLabel(data.muscle_std_right_foot) 
    },
    { subject: "오른팔", 
      value: data.right_hand_muscle_ratio, 
      lastValue: data.most_previous_data.right_hand_muscle_ratio,
      fullMark: 150, 
      weight: data.right_hand_muscle_mass, 
      percent: data.right_hand_muscle_ratio + "%", 
      status: getStatusLabel(data.muscle_std_right_hand) 
    },
  ];

  const fatData = [
    { subject: "복부", 
      value: data.trunk_fat_percentage, 
      lastValue: data.most_previous_data.trunk_fat_percentage,
      fullMark: 350, 
      weight: data.trunk_fat_mass, 
      percent: data.trunk_fat_percentage + "%", 
      status: getStatusLabel(data.fat_std_trunk)
    },
    { subject: "왼팔", 
      value: data.left_hand_fat_percentage, 
      lastValue: data.most_previous_data.left_hand_fat_percentage,
      fullMark: 300, 
      weight: data.left_hand_fat_mass, 
      percent: data.left_hand_fat_percentage + "%", 
      status: getStatusLabel(data.fat_std_left_hand) 
    },
    { subject: "왼다리", 
      value: data.left_foot_fat_percentage, 
      lastValue: data.most_previous_data.left_foot_fat_percentage,
      fullMark: 300, 
      weight: data.left_foot_fat_mass, 
      percent: data.left_foot_fat_percentage + "%", 
      status: getStatusLabel(data.fat_std_left_foot) 
    },
    { subject: "오른다리", 
      value: data.right_foot_fat_percentage, 
      lastValue: data.most_previous_data.right_foot_fat_percentage,
      fullMark: 300, 
      weight: data.right_foot_fat_mass, 
      percent: data.right_foot_fat_percentage + "%", 
      status: getStatusLabel(data.fat_std_right_foot) 
    },
    { subject: "오른팔", 
      value: data.right_hand_fat_percentage, 
      lastValue: data.most_previous_data.right_hand_fat_percentage,
      fullMark: 300, 
      weight: data.right_hand_fat_mass, 
      percent: data.right_hand_fat_percentage + "%", 
      status: getStatusLabel(data.fat_std_right_hand) 
    },

  ];


  return (
    <div className='grid grid-cols-2 gap-1 w-full h-full p-2'>
      <div className='flex flex-col gap-1 w-full h-full'>
        <div className='flex justify-between '>
          <div className='flex gap-1 pl-1 pt-1 items-center'>
            <div className='w-3 h-3 rounded-[3px] bg-accent' />
            <span className='text-accent font-bold text-sm'>근육 분포</span>
          </div>
        </div>
        
        <PentagonChart data={muscleData} isMuscle={true} />
      </div>

      <div className='flex flex-col gap-1 w-full h-full'>
        <div className='flex justify-between '>
          <div className='flex gap-1 pl-1 pt-1 items-center'>
            <div className='w-3 h-3 rounded-[3px] bg-accent' />
            <span className='text-accent font-bold text-sm'>지방 분포</span>
          </div>
        </div>
        <PentagonChart data={fatData} isMuscle={false} />
      </div>

    </div>
  );
};