import { useEffect, useRef, useState } from "react";
import InfoContainer from "../InfoContainer";
import StaticContainer from "./StaticContainer";
import ExerciseContainer from "./exercise/ExerciseContainer";
import DynamicContainer from "./DynamicContainer";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { IReportDetail } from "../../types/basic";
import { cn } from "../../lib/utils";

const tabs : string[] = ["측정 요약", "정면 측정", "측면 측정", "후면 측정", "동적 측정", "운동 추천"]
export type TabIndex = 0 | 1 | 2 | 3 | 4 | 5;

export default function BasicContainer({data}: {data: IReportDetail | undefined}) {
  const [currentTab, setCurrentTab] = useState<TabIndex>(0);
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
    <div>
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
  )
}