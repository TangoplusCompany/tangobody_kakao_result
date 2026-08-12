// src/components/gait/GaitSeqResult.tsx (컴포넌트 파일 경로)
"use client";

import { useMemo, useState, useId } from "react";
import { Area, AreaChart, CartesianGrid, YAxis } from "recharts";

import type { IMeasureGaitDetail } from "@/types/gait";
import { useMeasureGaitSeqJson } from "@/hooks/gait/useMeasureGaitSeqJson";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";


export interface GraphUnit {
  title: string;
  value: number[];
}

export function GaitGraphItem({
  data0,
  data1,
  data2,
}: {
  data0: GraphUnit;
  data1: GraphUnit;
  data2?: GraphUnit;
}) {
  const uniqueId = useId().replace(/:/g, "");
  
  // 단일 선택 상태 (null일 때는 아무것도 선택 안 됨 = 기본 상태)
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const toggleKey = (key: string) => {
    setSelectedKey((prev) => (prev === key ? null : key));
  };

  const DEFAULT_COLORS: Record<string, string> = {
    val0: "#5B93FFCC",
    val1: "#2563EBE6",
    val2: "#1E40AF",
  };

  // 💡 색상 결정 로직:
  // 선택된 게 없으면(null) -> 각자 기본 색상
  // 하나라도 선택되면 -> 선택된 항목만 기본 색상, 나머지는 #BBBBBB
  const getColor = (key: string) => {
    if (!selectedKey) return DEFAULT_COLORS[key];
    return selectedKey === key ? DEFAULT_COLORS[key] : "#BBBBBB";
  };

  const maxLength = Math.max(
    data0.value.length,
    data1.value.length,
    data2?.value.length || 0
  );

  const chartData = Array.from({ length: maxLength }, (_, index) => ({
    frame: index,
    val0: data0.value[index],
    val1: data1.value[index],
    val2: data2?.value[index],
  }));

  const yDomain = useMemo(() => {
    const combinedValues = [
      ...(data0.value || []),
      ...(data1.value || []),
      ...(data2?.value || []),
    ].filter((v) => typeof v === "number" && !isNaN(v));

    if (combinedValues.length === 0) return [0, 100];

    const min = Math.min(...combinedValues);
    const max = Math.max(...combinedValues);
    const diff = max - min;

    // 💡 패딩을 15% -> 5%로 축소 (전체 범위가 커서 5%만 줘도 충분함)
    const padding = diff === 0 ? 5 : diff * 0.05;

    return [
      Number((min - padding).toFixed(1)),
      Number((max + padding).toFixed(1)),
    ];
  }, [data0, data1, data2]);

  const chartConfig = {
    val0: { label: data0.title, color: getColor("val0") },
    val1: { label: data1.title, color: getColor("val1") },
    ...(data2 && { val2: { label: data2.title, color: getColor("val2") } }),
  } satisfies ChartConfig;

  const legendList = [
    { key: "val0", title: data0.title },
    { key: "val1", title: data1.title },
    ...(data2 ? [{ key: "val2", title: data2.title }] : []),
  ];

  return (
    <div className="w-full space-y-2">
      {/* 범례 영역 */}
      <div className="flex justify-end gap-3 text-xs font-medium pr-2">
        {legendList.map((item) => {
          const color = getColor(item.key);
          const isActive = !selectedKey || selectedKey === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleKey(item.key)}
              className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80"
            >
              <span
                className="w-3 h-3 rounded-sm transition-colors"
                style={{ backgroundColor: color }}
              />
              <span className={isActive ? "text-gray-900 font-bold" : "text-gray-400"}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <ChartContainer config={chartConfig} className="aspect-auto h-45 w-full">
        <AreaChart data={chartData} margin={{ top: 15, right: 10, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id={`fillVal0-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={getColor("val0")} stopOpacity={0.4} />
              <stop offset="100%" stopColor={getColor("val0")} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id={`fillVal1-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={getColor("val1")} stopOpacity={0.4} />
              <stop offset="100%" stopColor={getColor("val1")} stopOpacity={0.05} />
            </linearGradient>
            {data2 && (
              <linearGradient id={`fillVal2-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={getColor("val2")} stopOpacity={0.4} />
                <stop offset="100%" stopColor={getColor("val2")} stopOpacity={0.05} />
              </linearGradient>
            )}
          </defs>

          <YAxis
            domain={yDomain}
            ticks={yDomain}
            interval={0} // 👈 모든 ticks(최솟값, 최댓값)를 생략 없이 강제로 표시
            allowDataOverflow={true} // 👈 도메인 경계선에 걸친 눈금이 숨겨지지 않도록 설정
            tickFormatter={(value) => Number(value).toFixed(1)}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            width={40}
          />
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          <ChartTooltip
            content={<ChartTooltipContent labelFormatter={(value) => `${value} 프레임`} />}
          />

          <Area
            dataKey="val0"
            type="monotone"
            fill={`url(#fillVal0-${uniqueId})`}
            stroke={getColor("val0")}
            strokeWidth={2}
          />
          <Area
            dataKey="val1"
            type="monotone"
            fill={`url(#fillVal1-${uniqueId})`}
            stroke={getColor("val1")}
            strokeWidth={2}
          />
          {data2 && (
            <Area
              dataKey="val2"
              type="monotone"
              fill={`url(#fillVal2-${uniqueId})`}
              stroke={getColor("val2")}
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

export default function GaitSeqResult({
  isFront, 
  data 
}: {
  isFront: boolean, 
  data: IMeasureGaitDetail
}) {
  const { data: gaitSeq, isLoading: gaitLoading, isError: gaitError } = useMeasureGaitSeqJson(
    data?.gait_sequence_result[isFront ? 0 : 1]?.file_server_kinematics_frame
  );

  const graphGroups = useMemo(() => {
    // gaitSeq가 없으면 안전하게 빈 배열 처리
    const seq = gaitSeq ?? [];

    return {
      head: {
        data0: { title: "머리 좌우 기울기", value: seq.map((f) => f.headLateralTilt) },
        data1: { title: "머리 전후 기울기", value: seq.map((f) => f.headForwardTilt) },
      },
      trunk: {
        data0: { title: "몸통 흔들림", value: seq.map((f) => f.trunkSway) },
        data1: { title: "몸통 굽힘", value: seq.map((f) => f.trunkFlexion) },
      },
      shoulderArm: {
        data0: { title: "어깨 기울기", value: seq.map((f) => f.shoulderTilt) },
        data1: { title: "왼쪽 팔 각도", value: seq.map((f) => f.leftArmAngle) },
        data2: { title: "오른쪽 팔 각도", value: seq.map((f) => f.rightArmAngle) },
      },
      lowerBody: {
        data0: { title: "골반 틀어짐", value: seq.map((f) => f.pelvicDrop) },
        data1: { title: "왼쪽 무릎 각도", value: seq.map((f) => f.leftKneeAngle) },
        data2: { title: "오른쪽 무릎 각도", value: seq.map((f) => f.rightKneeAngle) },
      },
    };
  }, [gaitSeq]); // 💡 gaitSeq가 로드/변경될 때 감지하여 재계산하도록 의존성 배열 추가
  if (gaitLoading) return <div>Loading...</div>;
  if (gaitError) return <div>Error occured</div>
  return (
    <div className="bg-white rounded-xl border border-sub200 p-4">
      <div className="text-lg font-semibold mb-2 text-sub700">편도 보행 결과 - {isFront ? "걸어옴" : "멀어짐"}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <GaitGraphItem data0={graphGroups.head.data0} data1={graphGroups.head.data1} />
        <GaitGraphItem data0={graphGroups.trunk.data0} data1={graphGroups.trunk.data1} />
        <GaitGraphItem
          data0={graphGroups.shoulderArm.data0}
          data1={graphGroups.shoulderArm.data1}
          data2={graphGroups.shoulderArm.data2}
        />
        <GaitGraphItem
          data0={graphGroups.lowerBody.data0}
          data1={graphGroups.lowerBody.data1}
          data2={graphGroups.lowerBody.data2}
        />
      </div>
    </div>
  );
}