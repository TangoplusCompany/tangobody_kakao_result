import { useMeasureMoireStaticJson } from "@/hooks/moire/useMoireStaticJson";
import type { IMoireDetail } from "@/types/moire"
import MoireImage, { type IMoireImageProps } from "./Image";
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

export default function MoireContainer ({ data }: IMoireContainerProps) {
  const leftFileName = data?.front?.server_file_name_moire_json
  const rightFileName = data?.back?.server_file_name_moire_json

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
    ...(frontD ? [{
      title: "전면 어깨 등고선" as IMoireGraphTitle,
      leftValue: frontD?.shoulder_left_peak_depth * 100,
      rightValue: frontD?.shoulder_right_peak_depth * 100,
      leftIndex: frontD?.shoulder_left_peak_index,
      rightIndex: frontD?.shoulder_right_peak_index,
      unit: "cm",
      indexData: measureJson0?.[0]?.DepthArray ?? []
    }] : []),
    ...(backD ? [{
      title: "후면 어깨 등고선" as IMoireGraphTitle,
      leftValue: backD?.shoulder_left_peak_depth * 100,
      rightValue: backD?.shoulder_right_peak_depth * 100,
      leftIndex: backD?.shoulder_left_peak_index,
      rightIndex: backD?.shoulder_right_peak_index,
      unit: "cm",
      indexData: measureJson1?.[0]?.DepthArray ?? []
    }] : []),
    ...(frontD ? [{
      title: "전면 허리 등고선" as IMoireGraphTitle,
      leftValue: frontD?.waist_left_peak_depth * 100,
      rightValue: frontD?.waist_right_peak_depth * 100,
      leftIndex: frontD?.waist_left_peak_index,
      rightIndex: frontD?.waist_right_peak_index,
      unit: "cm",
      indexData: measureJson0?.[1]?.DepthArray ?? []
    }] : []),
    ...(backD ? [{
      title: "후면 허리 등고선" as IMoireGraphTitle,
      leftValue: backD?.waist_left_peak_depth * 100,
      rightValue: backD?.waist_right_peak_depth * 100,
      leftIndex: backD?.waist_left_peak_index,
      rightIndex: backD?.waist_right_peak_index,
      unit: "cm",
      indexData: measureJson1?.[1]?.DepthArray ?? []
    }] : []),
    ...(frontD ? [{
      title: "전면 골반 등고선" as IMoireGraphTitle,
      leftValue: frontD?.hip_left_peak_depth * 100,
      rightValue: frontD?.hip_right_peak_depth * 100,
      leftIndex: frontD?.hip_left_peak_index,
      rightIndex: frontD?.hip_right_peak_index,
      unit: "cm",
      indexData: measureJson0?.[2]?.DepthArray ?? []
    }] : []),
    ...(backD ? [{
      title: "후면 골반 등고선" as IMoireGraphTitle,
      leftValue: backD?.hip_left_peak_depth * 100,
      rightValue: backD?.hip_right_peak_depth * 100,
      leftIndex: backD?.hip_left_peak_index,
      rightIndex: backD?.hip_right_peak_index,
      unit: "cm",
      indexData: measureJson1?.[2]?.DepthArray ?? []
    }] : []),
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

      <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
        {imageDatas
          .filter((imageD): imageD is IMoireImageProps => !!imageD?.data)
          .map((imageD, key) => (
            <MoireImage key={key} imageData={imageD} />
          ))}
      </div>
 

      <div className='gap-1 pl-1 pt-1 items-center hidden md:flex'>
        <div className='w-3 h-3 rounded-[3px] bg-accent' />
        <span className='text-accent font-bold text-sm'>전후면 등고선</span>
      </div>


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

      <div className="hidden md:grid md:grid-cols-2 md:grid-rows-3 gap-2">
        {graphs.map((graphData, key) => (
          <MoireGraph key={key} graphData={graphData} />
        ))}
      </div>
    </div>
  )
}