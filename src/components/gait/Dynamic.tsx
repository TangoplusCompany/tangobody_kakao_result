import { useMeasureGaitDynamicJson } from "@/hooks/gait/useMeasureGaitDynamicJson";
import VideoPlayer from "./VideoPlayer";
import type { GaitContainerProps } from "./Container";


export default function GaitDynamic({ data }: GaitContainerProps) {
  const { data: measureJson0, isLoading: jsonLoading0, isError: jsonError0 } = useMeasureGaitDynamicJson(
    data?.gait_measure_info?.file_server_gait_frame_name
  );
  return (
    <div className="flex flex-col w-full h-full gap-4 rounded-xl">
      <VideoPlayer
        videoSrc={data?.gait_measure_info?.file_server_video_name}
        measureJson={measureJson0}
        isLoading={jsonLoading0}
        isError={!!(jsonError0)}
        cropScale={1.0} 
        isRotated={true}
        isCompare={false}        
      />
    </div>
  );
}