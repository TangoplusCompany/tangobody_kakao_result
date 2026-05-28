import type { IBasicCards, IBasicHistoryUnit, IBasicInfo, IReportDetail } from "../types/basic";
import body from "../assets/img_body.png";
import { getRangeCircle, getRiskString } from "../util/getRiskString";
import { useEffect, useState } from "react";
import { preprocessTrajectoryImage, removeBlackBackground } from "../util/removeBlackBackground";
import { PartRawDataContainer } from "./PartRawDataContainer";


export default function InfoContainer ({data}: {data: IReportDetail}) {
  const staticUrl = `${data.static_mat_data.measure_server_mat_image_name}`;
  const dynamicUrl = `${data.dynamic_mat_data.mat_hip_down_image_name}`;
  const hipDownUrl = `${data.dynamic_mat_data.mat_hip_trajectory_image_name}`;
  const leftKneeUrl = `${data.dynamic_mat_data.mat_left_knee_trajectory_image_name}`;
  const rightKneeUrl = `${data.dynamic_mat_data.mat_right_knee_trajectory_image_name}`;
  const riskUpperString = getRiskString(data.result_summary_data.risk_upper_risk_level);
  const riskLowerString = getRiskString(data.result_summary_data.risk_lower_risk_level);
  const [staticSrc, setstaticSrc] = useState<string>("");
  const [dynamicSrc, setdynamicSrc] = useState<string>("");
  const [hipDownSrc, sethipDownSrc] = useState<string>("");
  const [leftKneeSrc, setleftKneeSrc] = useState<string>("");
  const [rightKneeSrc, setrightKneeSrc] = useState<string>("");
  useEffect(() => {
    removeBlackBackground(staticUrl)
      .then((result) => {
        setstaticSrc(result);
      })
      .catch(() => {
        setstaticSrc("");
      });

      removeBlackBackground(dynamicUrl)
      .then((result) => {
        setdynamicSrc(result);
      })
      .catch(() => {
        setdynamicSrc("");
      });

      preprocessTrajectoryImage(hipDownUrl)
      .then((result) => {
        sethipDownSrc(result);
      })
      .catch(() => {
        sethipDownSrc("");
      });

      preprocessTrajectoryImage(leftKneeUrl)
      .then((result) => {
        setleftKneeSrc(result);
      })
      .catch(() => {
        setleftKneeSrc("");
      });

      preprocessTrajectoryImage(rightKneeUrl)
      .then((result) => {
        setrightKneeSrc(result);
      })
      .catch(() => {
        setrightKneeSrc("");
      });
  }, [dynamicSrc, dynamicUrl, hipDownSrc, hipDownUrl, leftKneeSrc, leftKneeUrl, rightKneeSrc, rightKneeUrl, staticUrl]);

  const bgUpperCondition = {
      0: "bg-sub-200",
      1: "bg-orange-600",
      2: "bg-red-600",
    }[data.result_summary_data.risk_upper_risk_level] ?? "bg-sub-200";
  const textUpperCondition = {
    0: "text-sub-800",
    1: "text-white",
    2: "text-white",
  }[data.result_summary_data.risk_upper_risk_level] ?? "text-sub-800";

  const bgLowerCondition = {
      0: "bg-sub-200",
      1: "bg-orange-600",
      2: "bg-red-600",
    }[data.result_summary_data.risk_lower_risk_level] ?? "bg-sub-200";
  const textLowerCondition = {
    0: "text-sub-800",
    1: "text-white",
    2: "text-white",
  }[data.result_summary_data.risk_lower_risk_level] ?? "text-sub-800";


  const jointPositions: Record<string, { top: string; left: string }> = {
    neck: { top: "15%", left: "50%" },
    shoulder_left: { top: "28%", left: "32%" },
    shoulder_right: { top: "28%", left: "68%" },
    elbow_left: { top: "38%", left: "27%" },
    elbow_right: { top: "38%", left: "73%" },
    hip_left: { top: "50%", left: "41%" },
    hip_right: { top: "50%", left: "59%" },
    knee_left: { top: "70%", left: "38%" },
    knee_right: { top: "70%", left: "62%" },
    ankle_left: { top: "89%", left: "39%" },
    ankle_right: { top: "89%", left: "61%" },
  };

  // 💡 2. 렌더링할 부위 리스트 정의 (IBasicInfo의 키값과 매칭)
  const jointsToRender: (keyof IBasicInfo)[] = [
    "risk_neck", "risk_shoulder_left", "risk_shoulder_right",
    "risk_elbow_left", "risk_elbow_right", "risk_wrist_left", "risk_wrist_right",
    "risk_hip_left", "risk_hip_right", "risk_knee_left", "risk_knee_right",
    "risk_ankle_left", "risk_ankle_right"
  ];
  const createRedCircleBitmap = (radius: number = 8, coreRadius:number, riskLevel: 0 | 1 | 2): string => {
    const level = Number(riskLevel);
    if (level === 0) return "";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const padding = 2;
    const size = radius * 2 + padding;
    canvas.width = size;
    canvas.height = size;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    const centerX = radius + padding / 2;
    const centerY = radius + padding / 2;

    const rValue = 255;
    const gValue = level === 1 ? 167 : 74;
    const bValue = level === 1 ? 58 : 74;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        const distToCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

        data[index] = rValue;     
        data[index + 1] = gValue; 
        data[index + 2] = bValue; 

        if (distToCenter <= coreRadius) {
          data[index + 3] = 255; 
        } else if (distToCenter <= radius) {
          const opacity = 1 - (distToCenter - coreRadius) / (radius - coreRadius);
          data[index + 3] = opacity * 255;
        } else if (distToCenter < radius + 1) {
          const opacity = 1 - (distToCenter - radius);
          data[index + 3] = Math.max(0, opacity * 30); // 부드럽게 사라지도록 낮춤
        } else {
          data[index + 3] = 0; 
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
  };
  
  function getBgColor(riskLevel: number): string {
    const colorMap: Record<number, string> = {
      0: "bg-sub-100 text-sub-200", // 정상 혹은 낮은 단계
      1: "bg-orange-400 text-orange-800",   // 주의 단계
      2: "bg-red-400 text-red-800",   // 위험 단계
    };

    // 매핑된 값이 없으면 기본값으로 "text-sub-800"을 반환합니다.
    return colorMap[riskLevel] ?? "text-sub-800";
  }

  const bodyParts: { key: keyof IBasicCards; label: string }[] = [
    { key: "neck", label: "목" },
    { key: "shoulder", label: "어깨" },
    { key: "elbow", label: "팔꿈치" },
    { key: "hip", label: "골반" },
    { key: "knee", label: "무릎" },
    { key: "ankle", label: "발목" },
  ];

  const historyList = [...(data.result_history_data?.history_data || [])]
    .reverse()
    .slice(0, 10);

  const gridSlots = Array.from({ length: 10 });


  return (
    <div className="flex flex-col gap-1">
      {/* body */}
      <div className="">
        <div className="flex flex-col md:grid md:grid-cols-[1fr_1.5fr_1.5fr] justify-center items-center ">
        
          <div className="relative w-[calc(100%-16px)] md:w-auto md:flex-1 h-full rounded-xl border border-sub-200 flex flex-col items-center justify-center  mx-2 my-1 md:m-2">
            <div className="flex w-full justify-between text-[10px] md:text-sm px-2 absolute top-6 z-10">
              <span className="bg-sub-200/80 px-2 py-0.5 ml-2 md:ml-6 rounded-full">좌측</span>
              <span className="bg-sub-200/80 px-2 py-0.5 mr-2 md:mr-6 rounded-full">우측</span>
            </div>

            <div className="relative mt-6">
              <img src={body} alt="인체 더미" className="w-32 md:w-46 block" />
              {jointsToRender.map((jointKey) => {
                const riskMent = data.result_summary_data[jointKey];

                const positionKey = jointKey.replace("risk_", "");
                const pos = jointPositions[positionKey as keyof typeof jointPositions];
                if (!pos) return null;

                const currentRadius = 10;
                const padding = 2;
                
                const circleBitmapUrl = createRedCircleBitmap(currentRadius, 2, riskMent as 0 | 1 | 2);
                if (!circleBitmapUrl) return null;

                return (
                  <img
                    key={jointKey}
                    src={circleBitmapUrl}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 object-contain z-20"
                    style={{ 
                      top: pos.top, 
                      left: pos.left,
                      width: `${currentRadius * 2 + padding}px`, 
                      height: `${currentRadius * 2 + padding}px` 
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex flex-col w-[calc(100%-16px)] md:w-auto md:flex-1 h-full border rounded-xl border-sub-200 mx-2 my-1 md:m-2">
            {/* 헤더 */}
            <div className="h-10 print:h-8  py-2 px-4 flex justify-between items-center leading-tight">
              <span className="font-bold print:text-[14px] text-start">상지 측정 요약</span>
              <span className={`${bgUpperCondition} ${textUpperCondition} text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shrink-0`}>
                {riskUpperString} {data.result_summary_data.risk_upper_range_level}단계
              </span>
            </div>
            {/* 콘텐츠 영역 */}
            <div className="p-4 text-start flex flex-col h-full overflow-y-auto whitespace-pre-line leading-tight ">
              {data.result_summary_data.risk_upper_ment ? (
                data.result_summary_data.risk_upper_ment
                  .split(/(\[[^\]]+\])/g)
                  .map((part, index) => {
                    
                    const trimmedPart = part.trim();
                    if (!trimmedPart) return null; 

                    if (trimmedPart.startsWith('[') && trimmedPart.endsWith(']')) {
                      return (
                        <span key={index} className="font-bold text-[9px] md:text-sm text-sub-800 block mt-3 first:mt-0">
                          {trimmedPart}
                        </span>
                      );
                    }
                    
                    // 본문 내용은 inline-block으로 설정하여 대괄호 바로 다음 줄에 1번만 줄바꿈되어 붙도록 유도
                    return (
                      <span className="text-sub-600 text-[9px] md:text-sm text-start block mt-0.5" key={index}>
                        {trimmedPart}
                      </span>
                    );
                  })
              ) : (
                "측정 데이터가 없습니다."
              )}
            </div>
          </div>

          <div className="flex flex-col w-[calc(100%-16px)] md:w-auto md:flex-1 h-full border rounded-xl border-sub-200 mx-2 my-1 md:m-2">
            {/* 헤더 */}
            <div className="h-10 print:h-8  py-2 px-4 flex justify-between items-center leading-tight ">
              <span className="font-bold print:text-[14px] text-start">하지 측정 요약</span>
              <span className={`${bgLowerCondition} ${textLowerCondition} text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shrink-0`}>
                {riskLowerString} {data.result_summary_data.risk_lower_range_level}단계
              </span>
            </div>
            <div className="p-4 text-start flex flex-col h-full overflow-y-auto whitespace-pre-line leading-tight ">
              {data.result_summary_data.risk_lower_ment ? (() => {
                const lines = data.result_summary_data.risk_lower_ment.split('\n');
                const processedLines: string[] = [];

                lines.forEach((line) => {
                  const trimmed = line.trim();
                  if (!trimmed) return;

                  if (trimmed.startsWith('-') && processedLines.length > 0) {
                    processedLines[processedLines.length - 1] += ` ${trimmed}`;
                  } else {
                    processedLines.push(trimmed);
                  }
                });

                // 3. 가공된 배열을 가지고 화면에 렌더링합니다.
                return processedLines.map((line, index) => {
                  if (line.startsWith('[') && line.endsWith(']')) {
                    return (
                      <span key={index} className="font-bold text-[9px] md:text-sm  text-sub-800 block mt-3 first:mt-0">
                        {line}
                      </span>
                    );
                  }
                  return (
                    <span className="text-sub-600 text-[9px] md:text-sm text-start block mt-0.5 whitespace-pre-line" key={index}>
                      {line}
                    </span>
                  );
                });
              })() : (
                "측정 데이터가 없습니다."
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] ">
        
        <div className="flex flex-col rounded-xl border border-sub-200  mx-2 my-1 md:m-2">
          <div className="h-10 print:h-8 py-2 items-center text-center font-bold text-base print:text-[14px] leading-tight ">
            족압 정적 측정
          </div>
          <div className="flex flex-col flex-1 items-center p-2">
            <div className="relative w-fit h-fit">
              {staticSrc !== "" && staticSrc !== null && (
                <img
                  src={staticSrc}
                  alt="정적 족압 이미지"
                  className="w-24 h-24 p-1 rounded-xl border border-sub-200 bg-transparent"
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
              )}
              <div className="absolute top-1/2 left-[40%] w-1/5 h-1 bg-sub-300 -translate-y-1/2" />
              <div className="absolute left-1/2 top-[40%] h-1/5 w-1 bg-sub-300 -translate-x-1/2" />

              {/* 상단 */}
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-sub-800 text-[10px] font-semibold">
                {Math.round(data.result_summary_data.mat_static_top_pressure)}%
              </span>

              {/* 좌측 */}
              <span className="absolute top-1/2 left-1 -translate-y-1/2 text-sub-800 text-[10px] font-semibold">
                {Math.round(data.result_summary_data.mat_static_left_pressure)}%
              </span>

              {/* 우측 */}
              <span className="absolute top-1/2 right-1 -translate-y-1/2 text-sub-800 text-[10px] font-semibold">
                {Math.round(data.result_summary_data.mat_static_right_pressure)}%
              </span>

              {/* 하단 */}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sub-800 text-[10px] font-semibold">
                {Math.round(data.result_summary_data.mat_static_bottom_pressure)}%
              </span>
            </div>

            <div className="flex flex-col text-[11px] md:text-sm  leading-tight text-start mt-1 md:mt-2">
              <span className="font-bold text-sub-800">[좌우 무게 분석] <span className="font-bold text-sub-600">{data.static_mat_data.mat_static_horizontal_ment}</span></span>
              <span className="font-bold text-sub-800">[상하 무게 분석] <span className="font-bold text-sub-600">{data.static_mat_data.mat_static_vertical_ment}</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-sub-200 m-2">
          <div className="h-10 print:h-8 py-2 items-center text-center font-bold text-base print:text-[14px] leading-tight ">
            족압 동적 측정
          </div>
          {/* 동적 족압 이미지 */}
          <div className="grid grid-cols-1 md:grid-cols-2 p-2">
            <div className="flex flex-col items-center mr-1">
              <div className="flex w-full gap-4 items-center justify-around">
                <div className="relative w-fit h-fit">
                  {dynamicSrc !== "" && dynamicSrc !== null && (
                    <img
                      src={dynamicSrc}
                      alt="동적 족압 이미지"
                      className="w-24 h-24 p-1 rounded-xl border border-sub-200 bg-transparent"
                      onError={(e) => {
                        e.currentTarget.src = "";
                      }}
                    />
                  )}
                  <div className="absolute top-1/2 left-[40%] w-1/5 h-px bg-sub-300 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-[40%] h-1/5 w-1px bg-sub-300 -translate-x-1/2" />

                  {/* 상단 */}
                  <span className="absolute top-1 left-1/2 -translate-x-1/2 text-sub-800 text-[10px] font-semibold">
                    {Math.round(data.result_summary_data.mat_static_top_pressure)}%
                  </span>

                  {/* 좌측 */}
                  <span className="absolute top-1/2 left-1 -translate-y-1/2 text-sub-800 text-[10px] font-semibold">
                    {Math.round(data.result_summary_data.mat_static_left_pressure)}%
                  </span>

                  {/* 우측 */}
                  <span className="absolute top-1/2 right-1 -translate-y-1/2 text-sub-800 text-[10px] font-semibold">
                    {Math.round(data.result_summary_data.mat_static_right_pressure)}%
                  </span>

                  {/* 하단 */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sub-800 text-[10px] font-semibold">
                    {Math.round(data.result_summary_data.mat_static_bottom_pressure)}%
                  </span>
                </div>
                {/* 힙다운 족압 이미지 */}
                <div className="relative w-fit h-fit">
                  {hipDownSrc !== "" && hipDownSrc !== null && (
                    <img
                      src={hipDownSrc}
                      alt="힙다운 이미지"
                      className="w-24 h-24 p-1 rounded-xl border border-sub-200 bg-transparent"
                      onError={(e) => {
                        e.currentTarget.src = "";
                      }}
                    />
                  )}
                  {/* <div className="absolute top-1/2 left-[40%] w-1/5 h-[1px] bg-sub-300 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-[40%] h-1/5 w-[1px] bg-sub-300 -translate-x-1/2" /> */}
                </div>
              </div>

              <div className="flex flex-col text-[11px] md:text-sm  leading-tight text-start mt-1 md:mt-2">
                <span className="font-bold text-sub-800">[좌우 무게 분석] <span className="font-bold text-sub-600">{data.static_mat_data.mat_static_horizontal_ment}</span></span>
                <span className="font-bold text-sub-800">[상하 무게 분석] <span className="font-bold text-sub-600">{data.static_mat_data.mat_static_vertical_ment}</span></span>
              </div>
            </div>


            {/* 무릎 */}
          <div className="flex flex-col items-center ml-1">
            <div className="flex w-full gap-4 items-center justify-around">
              <div className="relative w-fit h-fit">
                {leftKneeSrc !== "" && leftKneeSrc !== null && (
                  <img
                    src={leftKneeSrc}
                    alt="왼쪽 무릎 이미지"
                    className="w-24 h-24 p-1 rounded-xl border border-sub-200 bg-transparent"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                )}
                <div className="absolute top-1/2 left-[40%] w-1/5 h-px bg-sub-300 -translate-y-1/2" />
                <div className="absolute left-1/2 top-[40%] h-1/5 w-px bg-sub-300 -translate-x-1/2" />
              </div>
              {/* 오른쪽 무릎 이미지 */}
              <div className="relative w-fit h-fit">
                {rightKneeSrc !== "" && rightKneeSrc !== null && (
                  <img
                    src={rightKneeSrc}
                    alt="오른쪽 무릎 이미지"
                    className="w-24 h-24 p-1 rounded-xl border border-sub-200 bg-transparent"
                    onError={(e) => {
                      e.currentTarget.src = "";
                    }}
                  />
                )}
                {/* <div className="absolute top-1/2 left-[40%] w-1/5 h-[1px] bg-sub-300 -translate-y-1/2" />
                <div className="absolute left-1/2 top-[40%] h-1/5 w-[1px] bg-sub-300 -translate-x-1/2" /> */}
              </div>
            </div>

            <div className="flex flex-col text-[11px] md:text-sm leading-tight text-start mt-1 md:mt-2">
              <span className="font-bold text-sub-800">[무릎 흔들림 분석] <span className="font-bold text-sub-600">{data.dynamic_mat_data.mat_ohs_knee_ment}</span></span>
            </div>
          </div>
        </div>
        </div>
        
        




      </div>

      {/* 6가지 관절 데이터 */}
        <PartRawDataContainer data={data} />

        <div className="flex rounded-xl border border-sub-200 overflow-hidden bg-white text-[13px] text-sub-800 m-2">
          {/* 왼쪽 측정 이력 */}
          <div className="flex flex-col w-full">
            <div className="grid grid-cols-[1fr_4fr] items-center border-b border-sub-200">
              <div className="h-8 print:h-6 font-bold flex items-center justify-center text-sub-800 text-[12px] md:text-base border-r border-sub-200">
                측정 이력
              </div>
              <div className="grid grid-cols-10 h-8 md:h-12 items-center text-center text-[8px] text-sub-600 bg-sub-100">
                {gridSlots.map((_, idx) => {
                  const history = historyList[idx];
                  return (
                    <div key={idx} className="px-1 text-[9px] print:text-[8px] leading-tight text-center">
                      {history ? (() => {
                        const dateParts = history.measure_date.split('-'); 
                        if (dateParts.length < 3) return history.measure_date;

                        const year = dateParts[0];
                        const month = dateParts[1];
                        const day = dateParts[2].slice(0, 2);

                        return (
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-sub-600 text-[7px] md:text-xs">{year}</span>
                            <span className="font-bold text-sub-800 text-[8px] md:text-sm">{month}.{day}</span>
                          </div>
                        );
                      })() : ""}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ----------------- 하단 6행: 부위별 데이터 행 ----------------- */}
            <div className="flex flex-col h-full">
              {bodyParts.map(({ key, label }) => (
                // 💡 1. 여기에 border-b와 last:border-b-0을 몰아줍니다. 이제 진짜 '발목' 행에서만 선이 지워집니다.
                <div key={key} className="h-full grid grid-cols-[1fr_4fr] items-center border-b last:border-b-0 border-sub-200">
                  
                  {/* 좌측 부위 명칭 */}
                  {/* 💡 2. 내부의 border-b와 last:border-b-0은 완전히 제거합니다. */}
                  <div className="flex items-center h-full justify-center text-sub-600 text-[11px] md:text-sm border-r border-sub-200 font-bold">
                    {label}
                  </div>
                  
                  {/* 우측 부위별 10개 데이터 그리드 */}
                  {/* 💡 3. 여기도 마찬가지로 내부의 border-b와 last:border-b-0을 제거합니다. */}
                  <div className="grid grid-cols-10 h-full items-center text-center">
                    {gridSlots.map((_, idx) => {
                      const history = historyList[idx];
                      
                      const riskKey = `risk_level_${key}` as keyof IBasicHistoryUnit;
                      const rangeKey = `range_level_${key}` as keyof IBasicHistoryUnit;

                      const currentRiskLevel = (history?.[riskKey] as number) ?? 0;
                      const currentRangeLevel = (history?.[rangeKey] as number) ?? 0;

                      const bgColor = getBgColor(currentRiskLevel); 
                      const rangeCircle = getRangeCircle(currentRangeLevel);
                      
                      return (
                        <div key={idx} className="flex justify-center items-center h-full leading-none pt-0.5 pb-0.5 first:pt-1 first:pb-0.5 last:pt-0.5 last:pb-1 border-r last:border-r-0 border-sub-100">
                          {history ? (
                            <div className={`w-full h-full font-bold flex items-center mx-1 rounded-sm text-center justify-center ${bgColor} text-[14px] md:text-base`}>
                              {rangeCircle} 
                            </div>
                          ) : (
                            <div className="leading-none"/>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>





    </div>
  );
}