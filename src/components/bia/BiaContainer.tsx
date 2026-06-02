import { usePostBiaData } from "@/hooks/bia/usePostBiaData";
import { useEffect } from "react";
import Composition from "./Composition";
import BodyBenchMark from "./BodyBenchMark";
import BodyModel from "./BodyModel";
import MainAnalysis from "./MainAnalysis";
import Recommend from "./Recommend";
import TrendGraph from "./TrendGraph";
import BodyTypeChart from "./BodyTypeChart";

export default function BiaContainer() {
  const params = new URLSearchParams(window.location.search);
  const t_r = params.get("t_r") || "";

  const { mutate, data, isPending, isError } = usePostBiaData();
  useEffect(() => {
    if (t_r) {
      mutate(t_r);
    }
  }, [mutate, t_r]);


  if (isPending) return <div className="flex h-screen items-center justify-center">로딩 중...</div>;
  if (!t_r || isError || (data === undefined)) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4">
        <div className="text-xl font-bold text-red-500">올바르지 않은 데이터입니다.</div>
      </div>
    );
  }
  return (
    <div className='flex flex-1 w-full px-2 py-4 gap-2'>
      {/* 🥘🥘🥘🥘 left 🥘🥘🥘🥘 */}
      <div className='md:grid md:grid-cols-[2fr_1fr] w-full gap-2'>
        <Composition data={data} />
        <BodyBenchMark data={data} />
      </div>
      <div className='md:grid md:grid-cols-[2fr_1fr] w-full gap-2'>
        <MainAnalysis data={data} prevMuscleMassIndex={data?.most_previous_data.skeletal_muscle_mass_index}/>
        
      </div>
      <div className='md:grid md:grid-cols-[2fr_1fr] w-full gap-2'>
        <BodyModel data={data}  />
        <Recommend data={data} />
      </div>
      <div className='md:grid md:grid-cols-[2fr_1fr] w-full gap-2'>
        <TrendGraph data={data} />
        <BodyTypeChart data={data} />
      </div>
      
    </div>
  )
}