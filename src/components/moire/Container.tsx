import { useMeasureMoireStaticJson } from "@/hooks/moire/useMoireStaticJson";
import type { IMoireDetail } from "@/types/moire"
import MoireImage from "./Image";
import MoireGraph from "./Graph";

export interface IMoireContainerProps {
  data : IMoireDetail
}
export type IMoireGraphTitle = "어깨 등고선" | "허리 등고선" | "골반 등고선"

// 2. 부위 식별 키
export type MoireBodyPart = 
  | 'frontShoulderValue'
  | 'frontWaistValue'
  | 'frontHipValue'
  | 'backShoulderValue'
  | 'backWaistValue'
  | 'backHipValue';


export type IMoireMultiPartData = Record<MoireBodyPart, number[]>;

export default function MoireContainer({data}: IMoireContainerProps) {
  const leftFileName = data.front.server_file_name_moire_json
  const rightFileName = data.back.server_file_name_moire_json

  const { data: measureJson0, isLoading: jsonLoading0, isError: jsonError0 } = useMeasureMoireStaticJson(leftFileName);
  const { data: measureJson1, isLoading: jsonLoading1, isError: jsonError1 } = useMeasureMoireStaticJson(rightFileName);

  if (jsonLoading0 || jsonLoading1) {
    return <div className="text-sub400">로딩중입니다.</div>;
  }
  if (jsonError0 || jsonError1) {
    return <div className="text-red-500">오류가 발생했습니다. Moire 데이터 데이터 누락</div>;
  }


  const frontD = data.front;
  const backD = data.back;
  const graphs = [
    {
      title: "전면 어깨 등고선" as IMoireGraphTitle,
      leftValue: frontD.shoulder_left_peak_depth,
      rightValue: frontD.shoulder_right_peak_depth,
      leftIndex: frontD.shoulder_left_peak_index,
      rightIndex: frontD.shoulder_right_peak_index,
      unit: "º",
      indexData : measureJson0?.[0]?.DepthArray ?? []
    },
    {
      title: "후면 어깨 등고선" as IMoireGraphTitle,
      leftValue: backD.shoulder_left_peak_depth,
      rightValue: backD.shoulder_right_peak_depth,
      leftIndex: backD.shoulder_left_peak_index,
      rightIndex: backD.shoulder_right_peak_index,
      unit: "º",
      indexData : measureJson1?.[0]?.DepthArray ?? []
    },
    {
      title: "전면 허리 등고선" as IMoireGraphTitle,
      leftValue: frontD.waist_left_peak_depth,
      rightValue: frontD.waist_right_peak_depth,
      leftIndex: frontD.waist_left_peak_index,
      rightIndex: frontD.waist_right_peak_index,
      unit: "cm",
      indexData : measureJson0?.[1]?.DepthArray ?? []
    },
    {      
      title: "후면 허리 등고선" as IMoireGraphTitle,
      leftValue: backD.waist_left_peak_depth,
      rightValue: backD.waist_right_peak_depth,
      leftIndex: backD.waist_left_peak_index,
      rightIndex: backD.waist_right_peak_index,
      unit: "cm",
      indexData : measureJson1?.[1]?.DepthArray ?? []
    },
    {
      title: "전면 골반 등고선" as IMoireGraphTitle,
      leftValue: frontD.hip_left_peak_depth,
      rightValue: frontD.hip_right_peak_depth,
      leftIndex: frontD.hip_left_peak_index,
      rightIndex: frontD.hip_right_peak_index,
      unit: "º",
      indexData : measureJson0?.[2]?.DepthArray ?? []
    },
    {
      title: "후면 골반 등고선" as IMoireGraphTitle,
      leftValue: backD.hip_left_peak_depth,
      rightValue: backD.hip_right_peak_depth,
      leftIndex: backD.hip_left_peak_index,
      rightIndex: backD.hip_right_peak_index,
      unit: "º",
      indexData : measureJson1?.[2]?.DepthArray ?? []
    },
  ]

  const imageDatas = [
    {
      isFront: true,
      data: frontD
    },
    {
      isFront: false, 
      data: backD
    }
  ]
  const frontGraphs = [graphs[0], graphs[2], graphs[4]]; 
  const backGraphs = [graphs[1], graphs[3], graphs[5]];
  return (
    <div className="flex flex-col gap-2 px-1">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {imageDatas.map((imageD, key) => (
          <MoireImage key={key} imageData={imageD}/>
        ))}
      </div>
 

      <div className='gap-1 pl-1 pt-1 items-center hidden md:flex'>
        <div className='w-3 h-3 rounded-[3px] bg-mainBlue-300' />
        <span className='text-mainBlue-300 font-bold text-sm'>전후면 등고선</span>
      </div>

      {/* 모바일: 전면 묶음 → 후면 묶음 */}
      <div className="flex flex-col gap-2 md:hidden">
        <div className='flex gap-1 pl-1 pt-1 items-center '>
          <div className='w-3 h-3 rounded-[3px] bg-mainBlue-300' />
          <span className='text-mainBlue-300 font-bold text-sm'>전면 등고선</span>
        </div>

        {frontGraphs.map((graphData, key) => (
          <MoireGraph key={`front-${key}`} graphData={graphData} />
        ))}

        <div className='flex gap-1 pl-1 pt-1 items-center md:hidden'>
          <div className='w-3 h-3 rounded-[3px] bg-mainBlue-300' />
          <span className='text-mainBlue-300 font-bold text-sm'>후면 등고선</span>
        </div>

        {backGraphs.map((graphData, key) => (
          <MoireGraph key={`back-${key}`} graphData={graphData} />
        ))}
      </div>

      {/* 데스크탑: 기존 2열 그리드 (전면/후면 나란히) */}
      <div className="hidden md:grid md:grid-cols-2 md:grid-rows-3 gap-2">
        {graphs.map((graphData, key) => (
          <MoireGraph key={key} graphData={graphData} />
        ))}
      </div>
    </div>
  )

}