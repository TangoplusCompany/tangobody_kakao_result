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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 mb-12">
      <div className="md:col-span-2 md:col-start-1 md:row-start-1"> <Composition data={data}/> </div>
      <div className="md:col-start-3 md:row-start-1 md:row-span-2"> <BodyBenchMark data={data}/> </div>
      <div className="md:col-span-2 md:col-start-1 md:row-start-2"> <MainAnalysis data={data} prevMuscleMassIndex={data?.most_previous_data.skeletal_muscle_mass_index}/> </div>
      <div className="md:col-span-2 md:col-start-1 md:row-start-3"> <BodyModel data={data}/> </div>
      <div className="md:col-start-3 md:row-start-3"> <Recommend data={data}/> </div>
      <div className="md:col-start-3 md:row-start-4"> <BodyTypeChart data={data}/> </div>
      <div className="md:col-span-2 md:col-start-1 md:row-start-4"> <TrendGraph data={data}/> </div>
    </div>
  )
}