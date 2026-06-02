/* eslint-disable @typescript-eslint/no-explicit-any */
import img_body from "@/assets/img_body.png"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { IBiaData } from "../../types/bia";



export function PentagonChart({ data, isMuscle }: { data: any[]; isMuscle: boolean }) {

  
  const CustomAngleAxis = ({ payload, x, y }: any) => {
    const item = data.find((d) => d.subject === payload.value);
    if (!item) return null;
    
    return (
      /* g 태그의 위치를 꼭짓점(x, y)으로 고정하고 내부 요소들을 중앙 정렬합니다. */
      <g transform={`translate(${x},${y})`} style={{ overflow: 'visible' }}>
        
        {/* 1. Subject (제목): 중앙 정렬, 살짝 위로 배정 */}
        <text
          textAnchor="middle"
          fill="#333"
          fontSize="9"
          fontWeight="bold"
          dy="-12" 
        >
          {item.subject}
        </text>

        <text
          textAnchor="middle"
          fill="#666"
          dy="1" 
        >
          <tspan fontSize="9">{item.weight}kg</tspan>
          <tspan fontSize="7" fill="#999" >{` (${item.percent})`}</tspan>
        </text>

        {/* 3. Status Badge (상태): 중앙 정렬을 위해 x값을 너비의 절반만큼 왼쪽으로 이동 */}
        <foreignObject
          x="-20" // width(40)의 절반만큼 왼쪽으로 이동하여 중앙 맞춤
          y="6"   // 상세 정보 아래에 위치
          width="40"
          height="14"
          style={{ overflow: 'visible' }}
        >
          <div className={`
            text-[7px] text-white text-center rounded-xs 
            py-0.5 leading-none flex items-center justify-center min-w-10
            ${item.status === '표준이상' ? 'bg-accent' : 'bg-sub-400'}
          `}>
            {item.status}
          </div>
        </foreignObject>
      </g>
    );
  };
  const maxValue = isMuscle ? 150 : 300; // 지방일 경우 300~350 설정
  return (
    <div className='relative flex-1 w-full min-h-0 flex justify-center items-center'>

      <img 
        src={img_body} 
        className="absolute w-28 h-auto pointer-events-none" 
        alt="body-bg" 
      />
      <div className="w-full h-full z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid gridType="polygon" stroke="#DBDBDB" />

            {/* 최대값을 300으로 고정 (수치와 선은 숨김 처리) */}
            <PolarRadiusAxis domain={[0, maxValue]} tick={false} axisLine={false} />

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
              tick={(props) => <CustomAngleAxis {...props} />}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

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
    <div className='grid grid-cols-2 gap-1 w-full h-full'>
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