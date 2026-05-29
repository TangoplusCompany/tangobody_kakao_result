import { useState } from "react";
import type { IReportDetail } from "../types/basic";
import colorLogo from "../assets/img_logo_color.svg";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";
import InfoContainer from "./InfoContainer";
import StaticContainer from "./Measure/StaticContainer";
import DynamicContainer from "./Measure/DynamicContainer";
import ExerciseContainer from "./exercise/ExerciseContainer";

const tabs : string[] = ["측정 요약", "정면 측정", "측면 측정", "후면 측정", "동적 측정", "운동 추천"]
export type TabIndex = 0 | 1 | 2 | 3 | 4 | 5;

export default function MainContainer({data}: {data: IReportDetail | undefined}) {
  const [currentTab, setCurrentTab] = useState<TabIndex>(0);
  if (!data) {
    return (
      <div className="flex w-full justify-center py-12 text-sub-400">
        데이터를 불러올 수 없습니다.
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full ">
      <div className="flex flex-col px-2 gap-2 ">
        <div className="flex gap-2 items-center">
          <img src={colorLogo} className="w-10 h-10 md:w-14 md:h-14"/>
          <span className="text-lg md:text-2xl font-bold">{data?.result_summary_data.user_name}님 측정 결과</span>
        </div>
        <span className="text-start text-sm *:md:text-lg">측정일: {data?.result_summary_data.measure_date.replace("-", "년 ").replace("-","월 ").slice(0, 12)}일 {data?.result_summary_data.measure_date.slice(11)}</span> 
      </div>

      <div className="w-full grid grid-cols-3 md:grid-cols-6 gap-0.5 md:gap-1 p-2 rounded-t-2xl md:rountded-t-lg border-t-2 border-sub-150 mt-2">
        {tabs.map((tab, index) => {
          const isActive = currentTab === index;
          return (
            <Button
              key={tab}
              type="button"
              // 활성화 상태에 따라 디자인 스위칭
              variant={isActive ? "default" : "ghost"}
              onClick={() => setCurrentTab(index as TabIndex)}
              className={cn(
                "w-full py-4 rounded-lg md:rounded-xl font-medium text-sm md:text-lg transition-all tracking-tight cursor-pointer",
                isActive 
                  ? "bg-accent text-white shadow-sm" // 선택된 탭 (Accent 컬러 사용)
                  : "text-sub-600 hover:bg-sub-150/50" // 선택 안 된 탭
              )}
            >
              {tab}
            </Button>
          );
        })}
      </div>

      <div className="w-full pt-2 mb-36">
        {currentTab === 0 && <InfoContainer data={data} />}

        {(currentTab === 1 || currentTab === 2 || currentTab === 3 ) && (
          <StaticContainer data={data} tab={currentTab} />
        )}

        {currentTab === 4 && <DynamicContainer data={data} />}
        {currentTab === 5 && <ExerciseContainer />}
      </div>
    </div>
  );
};
