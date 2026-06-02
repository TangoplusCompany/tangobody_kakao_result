import { useState } from "react";
import type { IKakaoResponse } from "../types/basic";
import colorLogo from "../assets/img_logo_color.svg";
import { cn } from "../lib/utils";
import BasicContainer from "./basic/BasicContainer";
import RomContainer from "./rom/RomContainer";
import BiaContainer from "./bia/BiaContainer";


export default function MainContainer({data}: {data: IKakaoResponse | undefined}) {
  
  const measureType = data?.measure_type ?? "000";
  const mainTabs: string[] = [
    measureType[0] === "1" && "간편 검사",
    measureType[1] === "1" && "ROM",
    measureType[2] === "1" && "BIA",
  ].filter(Boolean) as string[]; // false나 undefined 제거
  const [currentMainTab, setCurrentMainTab] = useState<string>(() => {
    return mainTabs[0] ?? "";
  });
  const activeTab = mainTabs.includes(currentMainTab) ? currentMainTab : (mainTabs[0] ?? "");
  return (
    <div className="flex flex-col w-full">
      {/* 상단 탭  */}
      <div className="flex justify-between m-2">
        <div className="flex flex-col text-start px-2">
          <span className="text-base md:text-xl font-bold">{data?.result_summary_data.user_name}님 측정 결과</span>
          <span className="text-start text-xs *:md:text-lg">측정일: {data?.result_summary_data.measure_date.replace("-", "년 ").replace("-","월 ").slice(0, 12)}일 {data?.result_summary_data.measure_date.slice(11)}</span>  
        </div>
        <img src={colorLogo} className="w-6 h-6 md:w-8 md:h-8 p-0.5 md:p-1 "/>
      </div>

      <div className="flex border-b border-sub-200">
        {mainTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setCurrentMainTab(tab)}
              className={cn(
                "flex-1 py-2 text-sm md:text-base font-medium transition-all cursor-pointer",
                isActive
                  ? "border-b-2 border-accent text-accent"
                  : "text-sub-400 hover:text-sub-600"
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === "간편 검사" && <BasicContainer data={data} />}
      {activeTab === "ROM" && <RomContainer />}
      {activeTab === "BIA" && <BiaContainer />}
    </div>
  );
};
