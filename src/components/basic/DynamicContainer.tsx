import { useEffect, useState } from "react";
import type {  IReportDetail, ISquart } from "../../types/basic";
import VideoPlayer from "../ui/VideoPlayer";
import { preprocessTrajectoryImage, removeBlackBackground } from "../../util/removeBlackBackground";
import { useGetPartResult } from "../../hooks/useGetPartResult";
import { useGetDynamicJson } from "../../hooks/landmark/useGetDynamicJson";
import RawDataContainer from "./RawDataContainer";
import { Shimmer } from "../ui/Shimmer";
import { cn } from "../../lib/utils";
import { cardStyle } from "../../lib/styles";


export type Fit = {
  stageW: number;
  stageH: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  dpr: number;
};
export type PoseLandmark = {
  sx: number;
  sy: number;
};

export type PoseLandmarks = PoseLandmark[];

export default function DynamicContainer({data}: {data: IReportDetail}) {
  const params = new URLSearchParams(window.location.search);
  const t_r = params.get("t_r") || "";
  const [dynamicSrc, setdynamicSrc] = useState<string>("");
  const [hipDownSrc, sethipDownSrc] = useState<string>("");
  const [leftKneeSrc, setleftKneeSrc] = useState<string>("");
  const [rightKneeSrc, setrightKneeSrc] = useState<string>("");

  const matUrl = `${data.dynamic_mat_data.mat_hip_down_image_name}`;
  const hipUrl = `${data.dynamic_mat_data.mat_hip_trajectory_image_name}`;
  const kneeLeftUrl = `${data.dynamic_mat_data.mat_left_knee_trajectory_image_name}`;
  const kneeRightUrl = `${data.dynamic_mat_data.mat_right_knee_trajectory_image_name}`;

    // 1. 파트 데이터 호출 (Mutation)
  const { mutate, data: dData, isPending, isError, error } = useGetPartResult<ISquart>();
  
    useEffect(() => {
      if (t_r) {
        mutate({seq: 'squat', t_r: t_r});
      }
      removeBlackBackground(matUrl)
        .then((result) => {
          setdynamicSrc(result);
        })
        .catch(() => {
          setdynamicSrc("");
        });
        removeBlackBackground(hipUrl)
        .then((result) => {
          sethipDownSrc(result);
        })
        .catch(() => {
          sethipDownSrc("");
        });
        preprocessTrajectoryImage(kneeLeftUrl)
        .then((result) => {
          setleftKneeSrc(result);
        })
        .catch(() => {
          setleftKneeSrc("");
        });
        preprocessTrajectoryImage(kneeRightUrl)
        .then((result) => {
          setrightKneeSrc(result);
        })
        .catch(() => {
          setrightKneeSrc("");
        });
        
  
    }, [t_r, mutate, matUrl, hipUrl, kneeLeftUrl, kneeRightUrl]);
  const isRotated = data.result_summary_data.camera_orientation === 1;
  const {
    data: dynamicJson,
    isLoading: isJsonLoading,
    isError: isJsonError,
  } = useGetDynamicJson(dData?.squat.measure_server_json_name);

  if (isPending || isJsonLoading) return (
    <div className="flex flex-col p-2 gap-4">
      <Shimmer className="h-105 md:h-200 rounded-xl"/>

      <div className="p-2 rounded-xl border border-sub-200">
        <Shimmer className="h-40 md:h-50 rounded-xl"/>
      </div>
      <div className="p-2 rounded-xl border border-sub-200">
        <Shimmer className="h-20 md:h-50 rounded-xl"/>
      </div>
      <div className="p-2 rounded-xl border border-sub-200">
        <Shimmer className="h-20 md:h-50 rounded-xl"/>
      </div>
      <div className="p-2 rounded-xl border border-sub-200">
        <Shimmer className="h-20 md:h-50 rounded-xl"/>
      </div>
      <div className="p-2 rounded-xl border border-sub-200">
        <Shimmer className="h-20 md:h-50 rounded-xl"/>
      </div>
    </div>
  );
  if (isError || isJsonError ) return <div className="p-4 text-center text-red-500">{error?.message}</div>;
  return (
    <div className="">
      <VideoPlayer
        videoSrc={dData?.squat.measure_server_file_name}
        isRotated={isRotated}
        isCompare={false}
        measureJson={dynamicJson}
        isLoading={isJsonLoading || isPending}
        isError={!!(isJsonError || isError)}
        customCanvasTransform={isRotated ? "scaleX(-1.25) scaleY(1.25)" : undefined}
        videoClassName={isRotated ? "-rotate-90 w-[75%] h-full object-contain" : "w-full h-full"}
        stageClassName="relative mx-auto w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[560px] xl:h-[680px] overflow-hidden"
        containerClassName="flex flex-col gap-4 lg:gap-10"
      />

      <div className={cn(cardStyle, "flex flex-col m-2 px-4 ")}>
        <div className="h-10 py-2 items-center font-bold text-base text-start leading-tight ">
          족압 동적 측정
        </div>
        {/* 동적 족압 이미지 */}
        <div className="grid grid-cols-1 md:grid-cols-2 p-2 gap-4">
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

            <div className="flex flex-col text-sm md:text-base leading-tight text-start mt-1 md:mt-2">
              <span className="font-bold text-sub-800">[좌우 무게 분석] <span className="font-medium text-sub-600">{data.static_mat_data.mat_static_horizontal_ment}</span></span>
              <span className="font-bold text-sub-800">[상하 무게 분석] <span className="font-medium text-sub-600">{data.static_mat_data.mat_static_vertical_ment}</span></span>
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

            <div className="flex flex-col text-sm md:text-base leading-tight text-start mt-1 md:mt-2">
              <span className="font-bold text-sub-800">[무릎 흔들림 분석] <span className="font-bold text-sub-600">{data.dynamic_mat_data.mat_ohs_knee_ment}</span></span>
            </div>
          </div>
        </div>
      </div>
      <RawDataContainer rawData={dData?.squat.detail_data ?? []} />
    </div>
  );
}