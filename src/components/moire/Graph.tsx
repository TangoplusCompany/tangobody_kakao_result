import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { useId, useMemo } from "react";
import type { IMoireGraphTitle } from "./Container";
import { ChartContainer } from "../ui/chart";
import { removeOutliersIQR } from "@/util/graph";

export interface IMoireGraphProps {
  title: IMoireGraphTitle;
  leftValue: number;
  rightValue: number;
  leftIndex: number;
  rightIndex: number;
  unit: string;
  indexData: number[];
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  index?: number;
}

export default function MoireGraph({ graphData }: { graphData: IMoireGraphProps }) {
  const uniqueId = useId().replace(/:/g, "");

  // 1차원 숫자 배열을 Recharts용 데이터로 변환
  const cleanedDepthArray = useMemo(
    () => removeOutliersIQR(graphData.indexData, 1.5),
    [graphData.indexData]
  );

  const chartData = (cleanedDepthArray || []).map((zValue, x) => ({ x, zValue }));

  const total = chartData.length;
  const minX = 0;
  const maxX = total > 0 ? total - 1 : 100;
  const midX = (minX + maxX) / 2;

  const xTicks = [minX, (minX + midX) / 2, midX, (midX + maxX) / 2, maxX];

  const { yMin, yMax, yTicks } = useMemo(() => {
    const data = cleanedDepthArray || [];
    if (data.length === 0) {
      return { yMin: 2.0, yMax: 2.5, yTicks: [2.0, 2.25, 2.5] };
    }

    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);

    const diff = maxVal - minVal;
    const padding = diff > 0 ? diff * 0.2 : 0.01;

    const computedMin = Number((minVal - padding).toFixed(2));
    const computedMax = Number((maxVal + padding).toFixed(2));
    const computedMid = Number(((computedMin + computedMax) / 2).toFixed(2));

    return {
      yMin: computedMin,
      yMax: computedMax,
      yTicks: [computedMin, computedMid, computedMax],
    };
  }, [cleanedDepthArray]);

  const renderCustomDot = (props: CustomDotProps): React.ReactElement<SVGElement> => {
    const { cx, cy, index } = props;

    if (cx === undefined || cy === undefined || index === undefined) {
      return <g key="empty" />;
    }

    // eslint-disable-next-line no-useless-assignment
    let color = "";
    if (index === graphData.leftIndex) {
      color = "#5B93FF";
    } else if (index === graphData.rightIndex) {
      color = "#49D68F";
    } else {
      return <g key={`dot-${index}`} />;
    }

    return (
      <g key={`dot-${index}`}>
        <circle
          cx={cx}
          cy={cy}
          r={11}
          fill={`${color}20`}
          stroke={color}
          strokeWidth={1.5}
          strokeOpacity={0.6}
        />
        <circle cx={cx} cy={cy} r={5.5} fill={color} />
      </g>
    );
  };

  const subTitle: string = graphData.title.includes("허리") ? "중심선 편위" : "높이 차";

  return (
    <div className="flex flex-col rounded-xl border-2 border-sub200 p-2 bg-white">
      {/* Header */}
      <div className="flex w-full items-center justify-between mb-2">
        <span className="text-xs font-semibold text-sub-700">{graphData.title}</span>
      </div>

      <div className="grid grid-cols-[70%_30%] md:grid-cols-[70%_30%] gap-1">
        <ChartContainer config={{}} className="aspect-auto h-32 w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`fillVal-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#e5e7eb" vertical horizontal />

            <XAxis
              dataKey="x"
              type="number"
              domain={[minX, maxX]}
              ticks={xTicks}
              tickLine={false}
              axisLine={{ stroke: "#374151" }}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(val) => {
                if (Math.abs(val - minX) < 0.1) return `L -30`;
                if (Math.abs(val - midX) < 0.1) return `0`;
                if (Math.abs(val - maxX) < 0.1) return `R +30`;
                return "";
              }}
            />

            {/* 💡 동적 yMin, yMax, yTicks 적용 */}
            <YAxis
              domain={[yMin, yMax]}
              reversed={true}
              ticks={yTicks}
              tickLine={false}
              axisLine={{ stroke: "#374151" }}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              tickFormatter={(val) => `${val.toFixed(2)}m`} // 2.15, 2.20 형태로 표시
            />

            <Area
              dataKey="zValue"
              type="monotone"
              fill={`url(#fillVal-${uniqueId})`}
              stroke="#2563EB"
              strokeWidth={3}
              dot={renderCustomDot}
            />
          </AreaChart>
        </ChartContainer>

        <div className="flex flex-col gap-0.5 py-2 items-center">
          <span className="text-xs sm:text-sm font-semibold text-sub700">
            {subTitle} {Math.abs(graphData.leftValue - graphData.rightValue).toFixed(1)} {graphData.unit}
          </span>
          <div className="flex gap-1 text-xs sm:text-sm font-semibold">
            <span className="text-mainBlue-300">L {(graphData.leftValue / 100).toFixed(2)} {graphData.unit.replace("c", "")}</span>
            <span className="text-mainGreen-600">R {(graphData.rightValue / 100).toFixed(2)} {graphData.unit.replace("c", "")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}