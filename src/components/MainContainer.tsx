import { useState } from "react";
import type { IKakaoResponse } from "../types/basic";
import colorLogo from "../assets/img_logo_color.svg";
import { cn } from "../lib/utils";
import BasicContainer from "./basic/Container";
import RomContainer from "./rom/Container";
import BiaContainer from "./bia/Container";
import GaitContainer from "./gait/Container";
import MoireContainer from "./moire/Container";


export default function MainContainer({data}: {data: IKakaoResponse | undefined}) {
  
  const measureType = data?.measurement_meta;

  const mainTabs: string[] = [
    measureType?.has_basic === 1 && "간편 검사",
    measureType?.has_rom === 1 && "ROM 검사",
    measureType?.has_bia === 1 && "체성분 검사",
    measureType?.has_gait === 1 && "보행 분석 검사",
    measureType?.has_moire === 1 && "모아레 검사",
  ].filter(Boolean) as string[];
  const [currentMainTab, setCurrentMainTab] = useState<string>(() => {
    return mainTabs[0] ?? "";
  });
  const activeTab = mainTabs.includes(currentMainTab) ? currentMainTab : (mainTabs[0] ?? "");
  return (
    <div className="flex flex-col w-full">
      {/* 상단 탭  */}
      <div className="flex justify-between m-2">
        <div className="flex flex-col text-start px-2">
          <span className="text-base md:text-xl font-bold">{data?.measurement_meta?.user_name}님 측정 결과</span>
          <span className="text-start text-xs *:md:text-lg">측정일: {data?.measurement_meta.measure_date.replace("-", "년 ").replace("-","월 ").slice(0, 12)}일 {data?.measurement_meta.measure_date.slice(11)}</span>  
        </div>
        <img src={colorLogo} className="w-6 h-6 md:w-8 md:h-8 p-0.5 md:p-1 "/>
      </div>

      <div className="flex border-b border-sub200">
        {mainTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setCurrentMainTab(tab)}
              className={cn(
                "flex-1 py-2 text-sm md:text-base font-medium transition-all cursor-pointer",
                isActive
                  ? "border-b-2 border-mainBlue-300 text-mainBlue-300"
                  : "text-sub400 hover:text-sub600"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === "간편 검사" && <BasicContainer data={data} />}
      {activeTab === "ROM 검사" && <RomContainer />}
      {activeTab === "체성분 검사" && <BiaContainer />}
      {(activeTab === "보행 분석 검사" && data?.gait_result) && <GaitContainer data={data.gait_result}/>}
      {(activeTab === "모아레 검사" && data?.moire_result) && <MoireContainer data={data.moire_result}/>}
    </div>
  );
};
