import {  useState } from "react";
import type { IReportDetail } from "../types/basic";
import colorLogo from "../assets/img_logo_color.svg";
import { cn } from "../lib/utils";
import BasicContainer from "./basic/BasicContainer";
import RomContainer from "./rom/RomContainer";


const mainTabs : string[] = ["간편 검사", "ROM"]; 
export default function MainContainer({data}: {data: IReportDetail | undefined}) {
  const [currentMainTab, setCurrentMainTab] = useState(0);
  
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
        {mainTabs.map((tab, index) => {
          const isActive = currentMainTab === index;
          return (
            <button
              key={tab}
              onClick={() => setCurrentMainTab(index)}
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

      {currentMainTab === 0 && <BasicContainer data={data} />}
      {(currentMainTab === 1 ) && (
        <RomContainer  />
      )}

    </div>
  );
};
