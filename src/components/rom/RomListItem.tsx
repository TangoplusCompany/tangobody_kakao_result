import { useEffect, useMemo, useRef, useState } from "react";
import { ChartContainer, ChartTooltip } from "../ui/chart"; // 경로 확인
import { Area, AreaChart } from "recharts";
import type { IRomDetail } from "../../types/rom";

interface RomListItemProps {
  item: IRomDetail;
  onClick: (sn: number) => void;
}
const FIXED_SLOTS = 5;

export function RomListItem({ item, onClick }: RomListItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // XAxis 축 문자가 노출될 공간을 확보하기 위해 높이를 80에서 100으로 소폭 늘려줍니다.
  const [dimensions, setDimensions] = useState({ width: 0, height: 100 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          setDimensions((prev) => ({ ...prev, width }));
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const levelString = {
    0: "위험",
    1: "주의",
    2: "정상",
    3: "매우 양호"
  }[item.score] ?? "정상";

  const textCondition0 = {
    "매우 양호": "text-accent",
    "정상": "text-accent",
    "주의": "text-orange-800",
    "위험": "text-red-800",
  }[levelString] ?? "text-sub-600";

  const textBgCondition0 = {
    "매우 양호": "border-accent",
    "정상": "border-accent",
    "주의": "bg-orange-600",
    "위험": "bg-red-600",
  }[levelString] ?? "bg-white";

  const chartData = useMemo(() => {
    const sorted = Object.entries(item.history_by_measure_type)
     .map(([date, value]) => ({date, value}))
     .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dummy = Array.from(
      { length: Math.max(0, FIXED_SLOTS - sorted.length) },
      () => ({ date: " ", value: undefined }) 
    );                

    return [...sorted, ...dummy]  // 데이터 먼저, 더미 뒤에
  }, [item.history_by_measure_type]);

  const seriesKeys = useMemo(
    () => chartData
      .map((d) => d.date),
    [chartData]
  );

  return (
    <div 
      ref={containerRef} 
      className="flex flex-col p-2 md:px-4 md:py-2.5 bg-white hover:bg-sub-150 transition-colors border border-sub-200 rounded-xl w-full"
      onClick={() => onClick(item.sn)}
    >
      {/* 상단 텍스트 라인 */}
      <div className="flex items-center justify-between">
        <div className="text-base text-sub-800 font-medium truncate ">
          {item.title}
        </div>

        <div className="md:flex flex-col items-center gap-3">
          <div className="text-xs md:text-base font-semibold text-sub-800 text-end min-w-12.5">
            최대각도: {Number(item.value_1_max).toFixed(1)}º
          </div>
          <div className={`${textCondition0} ${textBgCondition0} border rounded-full text-xs md:text-sm px-2.5 py-0.5 font-medium text-center min-w-16.25`}>
            {levelString}
          </div>
        </div>
      </div>

      {/* 하단 확장 그래프 라인 */}
      <div className="flex w-full h-24 mt-2 overflow-hidden">
        {dimensions.width > 0 && chartData.length > 0 && (
          <ChartContainer
            config={{ value: { label: "이력", color: "#3b82f6" } }}
            className="w-full h-full"
          >
            <AreaChart data={chartData} width={dimensions.width} 
              height={dimensions.height} margin={{ top: 4, right: 16, left: 16, bottom: 16 }}>
              <defs>
                <linearGradient id={`fillGradient-${item.sn}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f1f6fe" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <Area
                dataKey="value"
                type="monotone"
                fill={`url(#fillGradient-${item.sn})`}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={(props) => {
                  if (props.payload?.value === null || props.payload?.value === undefined) return <g key={props.key} />;
                  return (
                    <circle key={props.key} cx={props.cx} cy={props.cy} r={4} fill="#3b82f6" stroke="#3b82f6" />
                  );
                }}
              />
              
              <ChartTooltip
                content={(props) => {
                  const value = props.payload?.[0]?.value;
                  if (!value || value === 0) return null;
                  
                  return (
                    <div className="rounded-lg border bg-white px-3 py-2 shadow-sm text-xs md:text-sm border-sub-400">
                      <p className="font-semibold text-sub-600">최대각도: {Number(value).toFixed(1)}º</p>
                    </div>
                  );
                }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
      <div className="flex items-center justify-between ">
        {seriesKeys.map((key, i) => (
          <span key={`${key}-${i}`} className="flex-1 text-center text-xs md:text-sm text-sub-600">
            {key === " " ? " " : key.slice(0, 11).replaceAll("-", ".")}
          </span>
        ))}
      </div>
    </div>
  );
}