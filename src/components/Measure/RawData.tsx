"use client";

import type { IRawDataUnit } from "../../types/basic";

export const RawData = (
  {
    data,
  } : 
  {
    data: IRawDataUnit | [IRawDataUnit, IRawDataUnit];
  }
) => {
  const isArrayData = Array.isArray(data);
  const data0 = isArrayData ? data[0] : data;
  const data1 = isArrayData && data.length === 2 ? data[1] : undefined;
  
  // data0용 변수들
  const formattedData0 = (data0.measure_unit?.includes("거리") ? Math.abs(data0.data) : data0.data).toFixed(1);
  const unit0 = data0.measure_unit?.includes("족압") 
    ? "%" 
    : data0.measure_unit?.includes("거리") 
      ? "cm" 
      : "°";
  const leftRightString0 = {
    0: "좌측",
    1: "우측"
  }[data0.left_right] ?? "";

  const levelString0 = {
    0: "정상",
    1: "주의",
    2: "위험"
  }[data0.risk_level] ?? "정상";

  // data1용 변수들 (존재할 경우에만)
  const formattedData1 = data1?.measure_unit?.includes("거리") 
  ? Math.abs(data1.data).toFixed(1) 
  : data1?.data?.toFixed(1) ?? null;
  const unit1 = data1?.measure_unit?.includes("족압") 
    ? "%" 
    : data1?.measure_unit?.includes("거리") 
      ? "cm" 
      : "°";
  const leftRightString1 = data1 ? ({
    0: "좌측",
    1: "우측"
  }[data1.left_right] ?? "") : undefined;

  const levelString1 = data1 ? ({
    0: "정상",
    1: "주의",
    2: "위험"
  }[data1.risk_level] ?? "정상") : null;

  const textCondition0 = {
    정상: "text-sub-600 ",
    주의: "text-orange-800 ",
    위험: "text-red-800",
  }[levelString0] ?? "bg-primary-foreground";
  const textBgCondition0 = {
    정상: "bg-sub-600 dark:bg-gray-600",
    주의: "bg-orange-600",
    위험: "bg-red-600",
  }[levelString0] ?? "bg-primary-foreground";

  const textCondition1 = {
    정상: "text-sub-600 dark:text-muted-foreground",
    주의: "text-orange-800 dark:text-warning-foreground",
    위험: "bg-red-800",
  }[levelString1 ?? "정상"] ?? "bg-primary-foreground";
  const textBgCondition1 = {
    정상: "bg-sub-600",
    주의: "bg-orange-600",
    위험: "bg-red-600",
  }[levelString1 ?? "정상"] ?? "bg-primary-foreground";
  const getStandard = (unit: string | undefined) => {
    if (unit?.includes("기울기")) return "0°";
    if (unit?.includes("족압 분포-상하")) return "40%/60%";
    if (unit?.includes("족압 분포-좌우")) return "50%/50%";
    return ".";
  };
  return (
    <div className="w-full table table-fixed min-w-0 rounded-xl border border-sub-200">
      <div className="flex flex-col overflow-x-auto overflow-y-hidden w-full min-w-0 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col">
          
          
          <div className="grid grid-cols-[45%_20%_35%] md:grid md:grid-cols-[18%_10%_12%_60%] items-center rounded-t-xl border-b border-sub-200 bg-sub-100  py-2">
            <span className="text-sm md:text-base font-bold text-sub-800 dark:text-foreground px-4 whitespace-normal break-keep">{data0.measure_unit}</span>
            <span className={`flex flex-1 justify-center text-[12px] md:text-sm text-sub600 dark:text-muted-foreground`}>{!data1 ? '' : '기준값'}</span>
            <span className="flex justify-center text-[12px] md:text-sm text-sub600 dark:text-muted-foreground">단계표시</span>
            <span className="hidden md:block text-[12px] md:text-sm text-sub600 dark:text-muted-foreground px-4">분석설명</span>
          </div>

          <div className="flex flex-col">
            {/* 왼쪽(상단) */}
            <div className={`grid grid-cols-[45%_20%_35%] md:grid md:grid-cols-[18%_10%_12%_60%] items-center h-full divide-x divide-sub-200 last:divide-none`}>
              <div className={`grid items-center h-full divide-y divide-sub-200 last:divide-y-0 border-r border-sub-200`}>
                <div className="flex justify-center">
                  {data1 && leftRightString0 !== "" && (
                    <span className="flex text-xs items-center justify-center text-sub-600 px-2 py-1 rounded-full bg-sub-100 my-1 md:my-2 whitespace-normal break-keep">
                      {leftRightString0}
                    </span>
                  )}
                  
                  <span className={`flex items-center text-base md:text-xl leading-none mx-2 whitespace-normal break-keep`}>
                    {formattedData0} {unit0}
                  </span>
                </div>
                {data1 && (
                  <div className="flex justify-center">
                    <span className={`flex text-xs items-center justify-center text-sub-0600 px-2 py-1 rounded-full bg-sub-100 my-1 md:my-2 whitespace-normal break-keep`}>
                      {leftRightString1}
                    </span>
                    <span className={`flex items-center text-base md:text-xl leading-none mx-2 whitespace-normal break-keep`}>
                      {formattedData1} {unit1}
                    </span>
                  </div>
                )}
              </div>
              
              <div className={`flex items-center justify-center w-full h-full border-r border-sub-200`}>
                <span className={`flex text-sm font-medium leading-none`}>
                  {getStandard(data0.measure_unit)}
                </span>
              </div>    



              <div className={`grid items-center h-full relative border-r border-sub-200 p-1`}>
                <span className={`
                  inline-flex items-center justify-center mx-auto
                  px-2 py-1 ${textBgCondition0} text-white
                  text-xs rounded-full whitespace-normal break-keep text-center
                `}>
                  {levelString0} {data0?.range_level}단계
                </span>
                {data1 && (
                  <span className={`
                    inline-flex items-center justify-center mx-auto
                    px-2 py-1 ${textBgCondition1} text-white
                    text-xs rounded-full whitespace-normal break-keep text-center
                  `}>
                    {levelString1} {data1?.range_level}단계
                  </span>
                )}
                {data1 && (
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-sub200 -translate-y-1/2" />
                )}
              </div>
              
              <div className={`hidden md:grid md:grid-cols-1 items-center justify-center w-full h-full relative`}>
                {data1 && data0.ment_all === data1.ment_all ? (
                  // 두 내용이 같으면 하나만 표시. 색상은 더 심한 단계(위험 > 주의 > 정상) 기준
                  (() => {
                    const worseLevel = (data0.risk_level === "2" || data1?.risk_level === "2") ? "위험"
                      : (data0.risk_level === "1" || data1?.risk_level === "1") ? "주의" : "정상";
                    const sameTextCondition = { 정상: "text-sub-600", 주의: "text-orange-800", 위험: "text-red-800" }[worseLevel] ?? "text-sub-600";
                    return (
                      <div className={`text-sm ${sameTextCondition} place-self-center whitespace-normal break-keep`}>
                        {data0.ment_all}
                      </div>
                    );
                  })()
                ) : (
                  // 두 내용이 다르거나 data1이 없으면 기존 로직 (정상: sub600, 주의: warningDeep, 위험: dangerDeep)
                  <>
                    <div className={`${textCondition0} text-base whitespace-normal break-keep`}>
                      {data0.ment_all}
                    </div>
                    {data1 && (
                      <div className={`${textCondition1} text-base whitespace-normal break-keep`}>
                        {data1.ment_all}
                      </div>
                    )}
                    {/* 정중앙 구분선 */}
                    {data1 && (
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-sub200 -translate-y-1/2" />
                    )}
                  </>
                )}
              </div>
            </div>

            <div className={`md:hidden grid items-center justify-start text-start w-full h-full relative px-2 py-1 bg-sub-100 rounded-b-xl border-t border-sub-200`}>
              <span className="text-[12px] md:text-sm">분석 설명</span>
              {data1 && data0.ment_all === data1.ment_all ? (
                // 두 내용이 같으면 하나만 표시. 색상은 더 심한 단계(위험 > 주의 > 정상) 기준
                (() => {
                  const worseLevel = (data0.risk_level === "2" || data1?.risk_level === "2") ? "위험"
                    : (data0.risk_level === "1" || data1?.risk_level === "1") ? "주의" : "정상";
                  const sameTextCondition = { 정상: "text-sub-600", 주의: "text-orange-800", 위험: "text-red-800" }[worseLevel] ?? "text-sub-600";
                  return (
                    <div className={`text-sm ${sameTextCondition} place-self-center whitespace-normal break-keep`}>
                      {data0.ment_all}
                    </div>
                  );
                })()
              ) : (
                // 두 내용이 다르거나 data1이 없으면 기존 로직 (정상: sub600, 주의: warningDeep, 위험: dangerDeep)
                <>
                  <div className={`${textCondition0} text-sm whitespace-normal break-keep`}>
                    {data0.ment_all}
                  </div>
                  {data1 && (
                    <div className={`${textCondition1} text-sm whitespace-normal break-keep`}>
                      {data1.ment_all}
                    </div>
                  )}
                  {/* 정중앙 구분선 */}
                  {data1 && (
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-sub200 -translate-y-1/2" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default RawData;
