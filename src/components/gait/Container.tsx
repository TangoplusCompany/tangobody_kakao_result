import type { IMeasureGaitDetail } from "@/types/gait";
import GaitBalance from "./Balance";
import GaitDynamic from "./Dynamic";
import GaitFall from "./Fall";
import GaitInfo from "./Info";
import GaitParameter from "./Parameter";
import GaitSeqResult from "./SeqResult";
import GaitStepStride from "./StepStride";

export interface GaitContainerProps {
  data: IMeasureGaitDetail;
}
export default function GaitContainer({ data }: GaitContainerProps) {
  const stepStride = {
    stepData: data.gait_step_data,
    strideData: data.gait_stride_data
  }
  return (
    <div className="flex flex-col gap-2 mt-4 px-1">
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2">
        <GaitDynamic data={data} />
        <GaitInfo  data={data} />
      </div>
      <GaitBalance data={data} />
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2">
        <GaitParameter data={data} />
        <GaitFall data={data} />
      </div>

      <GaitSeqResult isFront={true} data={data}/>
      <GaitSeqResult isFront={false} data={data}/>
      <GaitStepStride data={stepStride} />
    </div>
  )
};
