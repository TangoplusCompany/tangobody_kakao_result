import type { IGaitStep, IGaitStride } from "@/types/gait";
import { useState } from "react";

export interface IGaitStepStrideProps {
  stepData: IGaitStep[]
  strideData: IGaitStride[];
}

export default function GaitStepStride({ data }: { data: IGaitStepStrideProps }) {
  const { stepData = [], strideData = [] } = data;
  const [activeTab, setActiveTab] = useState<"step" | "stride">("step");

  return (
    <div className="w-full flex flex-col gap-4 p-4 bg-white rounded-xl border border-sub200 shadow-sm mb-8">
      {/* 탭 헤더 */}
      <div className="flex items-center justify-between border-b border-sub200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("step")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === "step"
                ? "bg-mainBlue-300 text-white"
                : "bg-sub100 text-sub600 hover:bg-sub200"
            }`}
          >
            걸음 분석 (Step) 
          </button>
          <button
            onClick={() => setActiveTab("stride")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === "stride"
                ? "bg-mainBlue-300 text-white"
                : "bg-sub100 text-sub600 hover:bg-sub200"
            }`}
          >
            보폭 분석 (Stride)
          </button>
        </div>
      </div>

      {/* 1. Step 데이터 테이블 */}
      {activeTab === "step" && (
        <div className="overflow-x-auto">
          {stepData.length === 0 ? (
            <div className="py-8 text-center text-sub400 text-sm">Step 데이터가 없습니다.</div>
          ) : (
            <table className="w-full text-xs sm:text-sm text-left border-collapse whitespace-nowrap">
              <thead className="bg-sub100 text-sub800 font-semibold border-b border-sub200">
                <tr>
                  <th className="p-3">Seq / 방향</th>
                  <th className="p-3">Step No</th>
                  <th className="p-3">발 위치</th>
                  <th className="p-3 text-right">Step 길이 (cm)</th>
                  <th className="p-3 text-right">Step 폭 (cm)</th>
                  <th className="p-3 text-right">Step 시간 (s)</th>
                  <th className="p-3 text-right">Step 속도 (m/s)</th>
                  <th className="p-3 text-center">프레임 (시작-끝)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sub200 text-sub800">
                {stepData.map((step) => (
                  <tr key={`step-${step.sn || step.sequenceIndex}-${step.stepIndex}-${step.foot}`} className="hover:bg-sub50/50 transition-colors">
                    <td className="p-3 whitespace-nowrap">
                      {/* <span className="font-semibold text-sub800">Seq {step.sequenceIndex}</span> */}
                      <span className="ml-1.5 text-xs px-2 py-0.5 rounded bg-sub200 text-sub800">
                        {step.direction === "Towards" ? "걸어옴" : "멀어짐"}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{step.stepIndex}번</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          step.foot === "Left"
                            ? "bg-mainBlue-100 text-mainBlue-300"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {step.foot === "Left" ? "L (왼발)" : "R (오른발)"}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">{safeFixed(step.stepLength, 2)}</td>
                    <td className="p-3 text-right font-medium">{safeFixed(step.stepWidth, 2)}</td>
                    <td className="p-3 text-right">{safeFixed(step.stepTime, 3)}</td>
                    <td className="p-3 text-right font-semibold text-mainBlue-300">
                      {safeFixed(step.stepSpeed, 3)}
                    </td>
                    <td className="p-3 text-center text-sub500 text-xs">
                      {step.startFrameIndex} ~ {step.endFrameIndex}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 2. Stride 데이터 테이블 */}
      {activeTab === "stride" && (
        <div className="overflow-x-auto">
          {strideData.length === 0 ? (
            <div className="py-8 text-center text-sub400 text-sm">Stride 데이터가 없습니다.</div>
          ) : (
            <table className="w-full text-xs sm:text-sm text-left border-collapse whitespace-nowrap">
              <thead className="bg-sub100 text-sub800 font-semibold border-b border-sub200">
                <tr>
                  <th className="p-3">Seq / 방향</th>
                  <th className="p-3">Stride No</th>
                  <th className="p-3">기준 발</th>
                  <th className="p-3 text-right">Stride 길이 (cm)</th>
                  <th className="p-3 text-right">Stride 시간 (s)</th>
                  <th className="p-3 text-right">Stance / Swing 비율</th>
                  <th className="p-3 text-right">최대 발가락 높이 (cm)</th>
                  <th className="p-3 text-right">Stride 속도 (m/s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sub200 text-sub800">
                {strideData.map((stride) => (
                  <tr key={`stride-${stride.sn || stride.sequenceIndex}-${stride.strideIndex}-${stride.foot}`} className="hover:bg-sub50/50 transition-colors">
                    <td className="p-3 whitespace-nowrap">
                      {/* <span className="font-semibold text-sub800">Seq {stride.sequenceIndex}</span> */}
                      <span className="ml-1.5 text-xs px-2 py-0.5 rounded bg-sub200 text-sub800">
                        {stride.direction === "Towards" ? "다가옴" : "멀어짐"}
                      </span>
                    </td>
                    <td className="p-3 font-medium">#{stride.strideIndex}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          stride.foot === "Left"
                            ? "bg-mainBlue-100 text-mainBlue-300"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {stride.foot === "Left" ? "L (왼발)" : "R (오른발)"}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">{safeFixed(stride.strideLength, 2)}</td>
                    <td className="p-3 text-right">{safeFixed(stride.strideTime, 3)}</td>
                    <td className="p-3 text-right whitespace-nowrap text-xs">
                      <span className="font-semibold text-sub800">{safeFixed(stride.stanceRatio, 2)}%</span>
                      <span className="text-sub400"> / </span>
                      <span className="text-sub600">{safeFixed(stride.swingRatio, 2)}%</span>
                    </td>
                    <td className="p-3 text-right font-medium">{safeFixed(stride.maxToeClearance, 3)}</td>
                    <td className="p-3 text-right font-semibold text-mainBlue-300">
                      {safeFixed(stride.strideSpeed, 3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// 소수점 보정 헬퍼 함수
function safeFixed(val: number | undefined | null, digits: number): string {
  if (val === undefined || val === null || isNaN(val)) return "-";
  return val.toFixed(digits);
}