import { useEffect } from "react";
import { useGetJson } from "../../hooks/useGetJson";
import { useGetPartResult } from "../../hooks/useGetPartResult";
import type { IBack, IFront, IReportDetail, ISide } from "../../types/basic";
import { MeasurementImage } from "./LandmarkImage";

const tabToSeqMap: Record<number, 'front' | 'side' | 'back' > = {
  1: "front",
  2: "side",
  3: "back",
};


export default function StaticContainer ({data, tab}: {data: IReportDetail, tab: 1| 2 | 3}) {
  const params = new URLSearchParams(window.location.search);
  const t_r = params.get("t_r") || "";

  // 1. 파트 데이터 호출 (Mutation)
  const { mutate, data: partData, isPending, isError, error } = useGetPartResult<IFront | ISide | IBack>();

  useEffect(() => {
    const seq = tabToSeqMap[tab];
    if (seq && t_r) {
      mutate({ seq, t_r });
    }
  }, [tab, t_r, mutate]);

  // 2. 💡 현재 탭과 데이터 상태에 맞는 json 파일명 동적 추출 (타입 가드 겸용)
  let leftFileName = "";
  let rightFileName = "";
  if (partData) {
    if (tab === 1 && "static_front" in partData) {
      // 정면일 때는 기본적으로 static_front의 json을 타겟팅
      leftFileName = partData.static_front.measure_server_file_name;
    } else if (tab === 2 && "left_side" in partData) {
      // 측면일 때는 left_side의 json을 타겟팅
      leftFileName = partData.left_side.measure_server_file_name;
    } else if (tab === 3 && "back" in partData) {
      // 후면일 때는 back의 json을 타겟팅
      leftFileName = partData.back.measure_server_file_name;
    }
  }
  if (partData) {
    if (tab === 1 && "static_elbow" in partData) {
      // 정면일 때는 기본적으로 static_front의 json을 타겟팅
      rightFileName = partData.static_elbow.measure_server_file_name;
    } else if (tab === 2 && "right_side" in partData) {
      // 측면일 때는 left_side의 json을 타겟팅
      rightFileName = partData.right_side.measure_server_file_name;
    } else if (tab === 3 && "back_sit" in partData) {
      // 후면일 때는 back의 json을 타겟팅
      rightFileName = partData.back_sit.measure_server_file_name;
    }
  }

  let leftJsonFileName = "";
  let rightJsonFileName = "";
  if (partData) {
    if (tab === 1 && "static_front" in partData) {
      // 정면일 때는 기본적으로 static_front의 json을 타겟팅
      leftJsonFileName = partData.static_front.measure_server_json_name;
    } else if (tab === 2 && "left_side" in partData) {
      // 측면일 때는 left_side의 json을 타겟팅
      leftJsonFileName = partData.left_side.measure_server_json_name;
    } else if (tab === 3 && "back" in partData) {
      // 후면일 때는 back의 json을 타겟팅
      leftJsonFileName = partData.back.measure_server_json_name;
    }
  }
  if (partData) {
    if (tab === 1 && "static_elbow" in partData) {
      // 정면일 때는 기본적으로 static_front의 json을 타겟팅
      rightJsonFileName = partData.static_elbow.measure_server_json_name;
    } else if (tab === 2 && "right_side" in partData) {
      // 측면일 때는 left_side의 json을 타겟팅
      rightJsonFileName = partData.right_side.measure_server_json_name;
    } else if (tab === 3 && "back_sit" in partData) {
      // 후면일 때는 back의 json을 타겟팅
      rightJsonFileName = partData.back_sit.measure_server_json_name;
    }
  }
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
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2">
        <div className={`flex flex-col gap-4 lg:gap-10`}>
          <MeasurementImage
            imageUrl={
              import.meta.env.VITE_PUBLIC_FILE_URL +
              leftFileName
            }
            measureJson={leftJson!}
            step="first"
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
            step="first"
            cameraOrientation={cameraOrientation}
          />
          
        </div>

      </div>
    </div>
  )
}