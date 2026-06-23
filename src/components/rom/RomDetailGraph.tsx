import { useEffect, useRef, useState } from "react";
import type { IRomDetail } from "../../types/rom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Area, AreaChart, CartesianGrid } from "recharts";

export interface RawDataGraphProps {
  graphType: 0 | 1;
  data: number[];
  maxMinValue?: IRomDetail;
}

export const RomDetailGraph = ({
  graphType,
  data,
  maxMinValue
}: RawDataGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 80 });

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

  const chartData = data.map((value, index) => ({
    frame: index,
    value: value
  }));

  const maxValue = (graphType === 0 ? maxMinValue?.value_1_max : maxMinValue?.value_2_max) ?? 0;
  const minValue = (graphType === 0 ? maxMinValue?.value_1_min : maxMinValue?.value_2_min) ?? 0;

  return (
    <div className="flex flex-col gap-1 rounded-xl p-4 bg-white w-full shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <span className="text-lg font-semibold text-sub800">
          {graphType === 0 ? '각도 변화' : '각속도 변화'}
        </span>

        <div className="flex flex-col text-sm text-sub-700 text-end">
          <div>{graphType === 0 ? '최대 각도' : '최대 각속도'}: {Math.abs(maxValue).toFixed(1)}º</div>
          {/* 💡 오타 수정: graphType이 0일 때는 최소 각도가 나오도록 수정 */}
          <div>{graphType === 0 ? '최소 각도' : '최소 각속도'}: {Math.abs(minValue).toFixed(1)}º</div>
        </div>
      </div>

      {/* 💡 1. 앵커 역할을 하는 가로 100%짜리 wrapper div */}
      <div ref={containerRef} className="block w-full relative h-20">
        {dimensions.width > 0 && (
          <ChartContainer
            config={{
              value: {
                label: graphType === 0 ? "각도" : "각속도",
                color: "#3b82f6",
              },
            }}
            className="w-full h-full"
          >
            <AreaChart 
              data={chartData} 
              width={dimensions.width} 
              height={dimensions.height}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f1f6fe" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                dataKey="value"
                type="monotone"
                fill="url(#fillGradient)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="bg-white! text-black! border border-gray-200 shadow-md"
                    labelFormatter={(value) => `프레임 ${value}`}
                  />
                }
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
};

export default RomDetailGraph;