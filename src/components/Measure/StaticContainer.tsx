import { useEffect, useState } from "react";
import { useGetJson } from "../../hooks/useGetJson";
import { useGetPartResult } from "../../hooks/useGetPartResult";
import type { IBack, IFront, IRawDataUnit, IReportDetail, ISide } from "../../types/basic";
import { MeasurementImage, type Step } from "./LandmarkImage";
import { removeBlackBackground } from "../../util/removeBlackBackground";
import RawDataContainer from "./RawDataContainer";

const tabToSeqMap: Record<number, 'front' | 'side' | 'back' > = {
  1: "front",
  2: "side",
  3: "back",
};

const partMap: Record<number, Step[]> = {
  1: ["first", "second"],
  2: ["third", "fourth"],
  3: ["fifth", "sixth",]
}

export default function StaticContainer ({data, tab}: {data: IReportDetail, tab: 1| 2 | 3}) {
  const params = new URLSearchParams(window.location.search);
  const t_r = params.get("t_r") || "";
  const [staticSrc, setstaticSrc] = useState<string>("");
  const staticUrl = `${data.static_mat_data.measure_server_mat_image_name}`;
  // 1. 파트 데이터 호출 (Mutation)
  const { mutate, data: partData, isPending, isError, error } = useGetPartResult<IFront | ISide | IBack>();

  useEffect(() => {
    const seq = tabToSeqMap[tab];
    if (seq && t_r) {
      mutate({ seq, t_r });
    }
    removeBlackBackground(staticUrl)
      .then((result) => {
        setstaticSrc(result);
      })
      .catch(() => {
        setstaticSrc("");
      });

  }, [tab, t_r, mutate]);

  // 2. 💡 현재 탭과 데이터 상태에 맞는 json 파일명 동적 추출 (타입 가드 겸용)
  let leftFileName = "";
  let rightFileName = "";
  if (partData) {
    if (tab === 1 && "static_front" in partData) {
      leftFileName = partData.static_front.measure_server_file_name;
    } else if (tab === 2 && "left_side" in partData) {
      leftFileName = partData.left_side.measure_server_file_name;
    } else if (tab === 3 && "back" in partData) {
      leftFileName = partData.back.measure_server_file_name;
    }
  }
  if (partData) {
    if (tab === 1 && "static_elbow" in partData) {
      rightFileName = partData.static_elbow.measure_server_file_name;
    } else if (tab === 2 && "right_side" in partData) {
      rightFileName = partData.right_side.measure_server_file_name;
    } else if (tab === 3 && "back_sit" in partData) {
      rightFileName = partData.back_sit.measure_server_file_name;
    }
  }

  let leftJsonFileName = "";
  let rightJsonFileName = "";
  if (partData) {
    if (tab === 1 && "static_front" in partData) {

      leftJsonFileName = partData.static_front.measure_server_json_name;
    } else if (tab === 2 && "left_side" in partData) {
      leftJsonFileName = partData.left_side.measure_server_json_name;
    } else if (tab === 3 && "back" in partData) {
      leftJsonFileName = partData.back.measure_server_json_name;
    }
  }
  if (partData) {
    if (tab === 1 && "static_elbow" in partData) {
      rightJsonFileName = partData.static_elbow.measure_server_json_name;
    } else if (tab === 2 && "right_side" in partData) {
      rightJsonFileName = partData.right_side.measure_server_json_name;
    } else if (tab === 3 && "back_sit" in partData) {
      rightJsonFileName = partData.back_sit.measure_server_json_name;
    }
  }

  let leftRawData : IRawDataUnit[] = [];
  let rightRawData : IRawDataUnit[] = [];
  if (partData) {
    if (tab === 1 && "static_front" in partData) {
      leftRawData = partData.static_front.detail_data;
    } else if (tab === 2 && "left_side" in partData) {
      leftRawData = partData.left_side.detail_data;
    } else if (tab === 3 && "back" in partData) {
      leftRawData = partData.back.detail_data;
    }
  }
  if (partData) {
    if (tab === 1 && "static_elbow" in partData) {
      rightRawData = partData.static_elbow.detail_data;
    } else if (tab === 2 && "right_side" in partData) {
      rightRawData = partData.right_side.detail_data;
    } else if (tab === 3 && "back_sit" in partData) {
      rightRawData = partData.back_sit.detail_data;
    }
  }
  const mergedRawData: IRawDataUnit[] = [...leftRawData, ...rightRawData];

  const cameraOrientation = data.result_summary_data.camera_orientation

  // 3. 💡 추출한 jsonFileName으로 훅 호출 (의존성 비동기 처리)
  const {
    data: leftJson,
    isLoading: isLeftJsonLoading,
    isError: isLeftJsonError,
  } = useGetJson(leftJsonFileName);
  const {
    data: rightJson,
    isLoading: isRightJsonLoading,
    isError: isRightJsonError,
  } = useGetJson(rightJsonFileName);


  // 에러 및 로딩 인터페이스 처리
  if (isPending || isLeftJsonLoading || isRightJsonLoading) return <div className="p-4 text-center">파트 데이터를 불러오는 중...</div>;
  if (isError || isLeftJsonError || isRightJsonError) return <div className="p-4 text-center text-red-500">{error?.message}</div>;
  if (!leftFileName || !rightFileName || !leftJson || !rightJson) {
    return <div className="p-4 text-center">이미지 분석 데이터를 구성 중...</div>;
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 md:gap-2">
        <div className={`flex flex-col gap-4 lg:gap-10`}>
          <MeasurementImage
            imageUrl={
              import.meta.env.VITE_PUBLIC_FILE_URL +
              leftFileName
            }
            measureJson={leftJson!}
            step={partMap[tab][0]}
            cameraOrientation={cameraOrientation}
          />
          
        </div>
        <div className={`flex flex-col gap-4 lg:gap-10`}>
          <MeasurementImage
            imageUrl={
              import.meta.env.VITE_PUBLIC_FILE_URL +
              rightFileName
            }
            measureJson={rightJson!}
            step={partMap[tab][1]}
            cameraOrientation={cameraOrientation}
          />
        </div>
      </div>
      {/* rawData */}
      <div className="flex flex-col w-full">
        {tab === 1 && (
          <div className="flex flex-col rounded-xl border border-sub-200  mx-2 my-1 md:m-2 p-2">
            <div className="pb-2 items-center text-start font-bold text-base print:text-[14px] leading-tight ">
              족압 정적 측정
            </div>
            <div className="flex flex-1 justify-around items-center gap-2 md:grid md:grid-cols-2 md:justify-items-stretch">
              <div className="flex w-full items-center justify-center">
                <div className="relative w-fit h-fit">
                  {staticSrc !== "" && staticSrc !== null && (
                    <img
                      src={staticSrc}
                      alt="정적 족압 이미지"
                      className="w-24 h-24 md:w-32 md:h-32 p-1 rounded-xl border border-sub-200 bg-transparent justify-center "
                      onError={(e) => {
                        e.currentTarget.src = "";
                      }}
                    />
                  )}
                  <div className="absolute top-1/2 left-[40%] w-1/5 h-1 bg-sub-300 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-[40%] h-1/5 w-1 bg-sub-300 -translate-x-1/2" />

                  {/* 상단 */}
                  <span className="absolute top-1 left-1/2 -translate-x-1/2 text-sub-800 text-[10px] md:text-sm font-semibold">
                    {Math.round(data.result_summary_data.mat_static_top_pressure)}%
                  </span>

                  {/* 좌측 */}
                  <span className="absolute top-1/2 left-1 -translate-y-1/2 text-sub-800 text-[10px] md:text-sm font-semibold">
                    {Math.round(data.result_summary_data.mat_static_left_pressure)}%
                  </span>

                  {/* 우측 */}
                  <span className="absolute top-1/2 right-1 -translate-y-1/2 text-sub-800 text-[10px] md:text-sm font-semibold">
                    {Math.round(data.result_summary_data.mat_static_right_pressure)}%
                  </span>

                  {/* 하단 */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sub-800 text-[10px] md:text-sm font-semibold">
                    {Math.round(data.result_summary_data.mat_static_bottom_pressure)}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col text-[11px] md:text-sm  leading-tight text-start mt-1 md:mt-2">
                <span className="font-bold text-sub-800">[좌우 무게 분석] <span className="font-bold text-sub-600">{data.static_mat_data.mat_static_horizontal_ment}</span></span>
                <span className="font-bold text-sub-800">[상하 무게 분석] <span className="font-bold text-sub-600">{data.static_mat_data.mat_static_vertical_ment}</span></span>
              </div>
            </div>

          </div>
        )}

        <RawDataContainer rawData={mergedRawData} />



      </div>
    </div>
  )
}