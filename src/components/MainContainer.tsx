import { useEffect, useRef, useState } from "react";
import type { IReportDetail } from "../types/basic";
import colorLogo from "../assets/img_logo_color.svg";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";
import InfoContainer from "./InfoContainer";
import StaticContainer from "./Measure/StaticContainer";
import DynamicContainer from "./Measure/DynamicContainer";
import ExerciseContainer from "./exercise/ExerciseContainer";
import { ChevronLeft, ChevronRight } from "lucide-react";

const tabs : string[] = ["측정 요약", "정면 측정", "측면 측정", "후면 측정", "동적 측정", "운동 추천"]
export type TabIndex = 0 | 1 | 2 | 3 | 4 | 5;
const mainTabs = ["간편 검사", "ROM", "체성분", "MOARE"]; 
export default function MainContainer({data}: {data: IReportDetail | undefined}) {
  const [currentTab, setCurrentTab] = useState<TabIndex>(0);
  const [currentMainTab, setCurrentMainTab] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -150 : 150, behavior: "smooth" });
  };


  if (!data) {
    return (
      <div className="flex w-full justify-center py-12 text-sub-400">
        데이터를 불러올 수 없습니다.
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full ">
      

      {/* 상단 탭  */}
      <div className="">
        <div className="flex flex-col">
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

        </div>
      </div>

      <div className="relative w-full  bg-sub-100">
        {showLeft && (
          <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-none border-none rounded-full p-1">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {showRight && (
          <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-none border-none rounded-full p-1">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-4 py-2 rounded-t-2xl overflow-x-auto scrollbar-none mx-5"
        >
          {tabs.map((tab, index) => {
            const isActive = currentTab === index;
            return (
              <Button
                key={tab}
                type="button"
                variant={isActive ? "default" : "ghost"}
                onClick={() => setCurrentTab(index as TabIndex)}
                className={cn(
                  "flex-none py-4 rounded-full font-medium text-sm md:text-base transition-all tracking-tight cursor-pointer",
                  isActive
                    ? "bg-accent text-white shadow-sm"
                    : "bg-white text-sub-600 hover:bg-sub-150/50 shadow-xs"
                )}
              >
                {tab}
              </Button>
            );
          })}
        </div>
      </div>


      <div className="w-full pb-12 md:pb-36 bg-sub-100">
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
