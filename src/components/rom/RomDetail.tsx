import { useGetRomGraphJson } from "@/hooks/rom/useGetRomGraphJson";
import arrowLeft from "../../assets/ic_arrow_left.svg"
import type { IRomDetail } from "../../types/rom"
import { Shimmer } from "../ui/Shimmer";
import VideoPlayer from "../ui/VideoPlayer";
import RomDetailGraph from "./RomDetailGraph";
import { useGetDynamicJson } from "@/hooks/landmark/useGetDynamicJson";

export default function RomDetail ({
  left,
  right,
  onBack
}: {
  left: IRomDetail | undefined,
  right: IRomDetail | undefined,
  onBack : () => void
}) {
  
  
  const { data: romGraphJson0, isLoading: romGraphLoading0, isError: romGraphError0 } = useGetRomGraphJson(
    left?.measure_server_data_json_name
  );
  const { data: romJson0, isLoading: romLoading0, isError: romError0 } = useGetDynamicJson(
    left?.measure_server_json_name
  );
  const { data: romGraphJson1, isLoading: romGraphLoading1, isError: romGraphError1 } = useGetRomGraphJson(
    right?.measure_server_data_json_name
  );
  const { data: romJson1, isLoading: romLoading1, isError: romError1 } = useGetDynamicJson(
    right?.measure_server_json_name
  );
  
  if (left === undefined) {
    return (
      <div className="p-2 rounded-xl border border-sub-200">
        <Shimmer className="h-40 md:h-50 rounded-xl"/>
      </div>
    );
  }

  // 💡 4. 데이터 패칭 로딩 상태 처리 분기를 한곳으로 통합
  if (romGraphLoading0 || romLoading0 || romGraphLoading1 || romLoading1) {
    return (
      <div className="flex flex-col p-2 gap-4">
        <div className="p-2 rounded-xl border border-sub-200"><Shimmer className="h-40 md:h-50 rounded-xl"/></div>
        <div className="p-2 rounded-xl border border-sub-200"><Shimmer className="h-20 md:h-50 rounded-xl"/></div>
        <div className="p-2 rounded-xl border border-sub-200"><Shimmer className="h-20 md:h-50 rounded-xl"/></div>
        <div className="p-2 rounded-xl border border-sub-200"><Shimmer className="h-20 md:h-50 rounded-xl"/></div>
        <div className="p-2 rounded-xl border border-sub-200"><Shimmer className="h-20 md:h-50 rounded-xl"/></div>
      </div>
    );
  }

  // 💡 5. 에러 핸들러 분기
  if (romGraphError0 || romError0 || romGraphError1 || romError1) {
    return <div className="p-4 text-center text-red-500">error occurred</div>;
  }

  // 💡 6. 데이터가 무조건 보장되는 안전한 시점에 파생 변수들을 렌더링 중에 단순 계산 (setState 쓰지 않음!)
  const romStateMap: Record<number, string> = {
    0: "위험",
    1: "주의",
    2: "정상",
    3: "매우 양호"
  };

  const romLeftState = romStateMap[left.score] ?? "정상";
  const romLeftValue = Math.abs(left.value_1_max).toFixed(1);
  const romRightState = romStateMap[right?.score ?? 0] ?? "정상";
  const romRightValue = Math.abs(right?.value_1_max ?? 0).toFixed(1);
  const fullLeftUrl = `${import.meta.env.VITE_PUBLIC_FILE_URL}/${left.measure_server_file_name}`;
  const fullRightUrl = `${import.meta.env.VITE_PUBLIC_FILE_URL}/${right?.measure_server_file_name}`;
  const rangeComponent = (
    <div className="grid grid-cols-4 w-full rounded-xl bg-sub100 items-center divide-x divide-sub-200 text-xs sm:text-sm">
      <div className="flex flex-col gap-1 w-full items-center py-2">
        <span>매우 양호</span>
        <span>{left.normal_normal}º 이상</span>
      </div>
      <div className="flex flex-col gap-1 w-full items-center py-2">
        <span>정상</span>
        <span>{left.normal_warning}º~{left.normal_normal}º</span>
      </div>
      <div className="flex flex-col gap-1 w-full items-center py-2">
        <span>주의</span>
        <span>{left.normal_bad}º~{left.normal_warning}º</span>
      </div>
      <div className="flex flex-col gap-1 w-full items-center py-2">
        <span>위험</span>
        <span>{left.normal_bad}º 미만</span>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-2 w-full h-full flex flex-col gap-2">
      <div className="w-fit rounded-xl px-0 md:px-2 py-1 flex gap-2 items-center hover:bg-sub-150 transition-colors text-sm md:text-base cursor-pointer" onClick={onBack}>
        <img src={arrowLeft} className="w-2.5 h-2.5 md:w-4 md:h-4"/>
        목록으로
      </div>
      
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-1 pb-8 md:pb-16">
        <div>
          <VideoPlayer
            videoSrc={fullLeftUrl} // 현재 ROM으로 들어오는건 url이 없고 그냥 엔드포인트만 있음 (url 붙여야함)
            isRotated={true}
            isCompare={true}
            measureJson={romJson0}
            isLoading={romLoading0}
            isError={!!(romError0)}
            romType={left?.measure_type}
            
          />

          <div className="flex flex-col w-full gap-1 mt-2 ">
            <div className="">
              <div className="flex flex-col border-b border-sub-200 shadow-xl rounded-t-xl ">
                <div className="text-base font-semibold bg-white/30 text-start p-2 border-b border-sub-200">{left?.title}</div>
                
                <div className="grid grid-cols-[25%_25%_50%] items-center divide-x bg-white/50 divide-sub-200">
                  <div className="h-full flex items-center justify-center py-2 ">최대 각도</div>
                  <div className="h-full flex items-center justify-center py-2 ">단계</div>
                  <div className="h-full flex py-2 pl-2">설명</div>
                </div>
                
              </div>

              <div className="grid grid-cols-[25%_25%_50%] items-center bg-white dark:border dark:bg-muted divide-x divide-sub-200">
                <div className="h-full flex items-center justify-center">{romLeftValue}º</div>
                <div className="h-full flex items-center justify-center">{romLeftState}</div>
                <div className="h-full flex items-center px-2 py-1 text-start">{left?.description}</div>
              </div>
            </div>
            <div className="flex flex-col rounded-b-xl bg-white/50 w-full ">
              {rangeComponent}
              <div className="p-2 flex flex-col gap-2">
                <RomDetailGraph graphType={0} data={romGraphJson0?.values ?? []} maxMinValue={left} />
                <RomDetailGraph graphType={1} data={romGraphJson0?.values2 ?? []} maxMinValue={left} />    
              </div>
            </div>
          </div>
        </div>


        {right && (
          <div>
            <VideoPlayer
              videoSrc={fullRightUrl} // 현재 ROM으로 들어오는건 url이 없고 그냥 엔드포인트만 있음 (url 붙여야함)
              isRotated={true}
              isCompare={true}
              measureJson={romJson1}
              isLoading={romLoading1}
              isError={!!(romError1)}
              romType={right?.measure_type}
              
            />

            <div className="flex flex-col w-full gap-2 mt-2">
              <div className="">
                <div className="flex flex-col border-b border-sub-200 shadow-xl rounded-t-xl ">
                <div className="text-base font-semibold bg-white/30 text-start p-2 border-b border-sub-200">{right?.title}</div>
                
                <div className="grid grid-cols-[25%_25%_50%] items-center divide-x bg-white/50 divide-sub-200">
                  <div className="h-full flex items-center justify-center py-2 ">최대 각도</div>
                  <div className="h-full flex items-center justify-center py-2 ">단계</div>
                  <div className="h-full flex py-2 pl-2">설명</div>
                </div>
                
              </div>

                <div className="grid grid-cols-[25%_25%_50%] items-center bg-white dark:border dark:bg-muted divide-x divide-sub-200">
                  <div className="h-full flex items-center justify-center">{romRightValue}º</div>
                  <div className="h-full flex items-center justify-center">{romRightState}</div>
                  <div className="h-full flex items-center px-2 py-1 text-start">{right?.description}</div>
                </div>
              </div>
              <div className="flex flex-col rounded-b-xl bg-white/50 w-full ">
                {rangeComponent}
                <div className="p-2 flex flex-col gap-2">
                  <RomDetailGraph graphType={0} data={romGraphJson1?.values ?? []} maxMinValue={right} />
                  <RomDetailGraph graphType={1} data={romGraphJson1?.values2 ?? []} maxMinValue={right} />    
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  )
}