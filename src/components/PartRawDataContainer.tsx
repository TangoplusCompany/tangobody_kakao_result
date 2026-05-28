import type {  IReportDetail } from "../types/basic";
import { PartRawData } from "./PartRawData";

export function PartRawDataContainer({data}: {data: IReportDetail}) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] rounded-xl border border-sub-200 overflow-hidden bg-white text-sub-800 m-2">
      <div className="flex flex-col">

        <div className="grid grid-cols-[1fr_3fr] items-center text-center border-b border-sub-200 text-sm h-fit">
          {/* 왼쪽: 상체분석 */}
          <div className="flex h-8 print:h-6 bg-sub-200 font-bold items-center justify-center text-sub-800 text-[12px] md:text-base leading-tight ">
            상체분석
          </div>

          <div className="grid grid-cols-[30%_70%] items-center">
            <span className="text-sub-800 md:text-base  font-medium">측정 기준</span>
            
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center w-full text-sub-300">
                <span className="md:text-base  mx-auto font-bold">정상</span>
                <span className="md:text-base  text-gray-400 pl-1">▶</span>
              </div>
              
              <div className="flex items-center  w-full text-orangee-600">
                <span className="md:text-base  font-bold mx-auto">주의</span>
                <span className="md:text-base  text-gray-400 translate-x-1">▶</span>
              </div>
              
              <div className="flex items-center justify-start w-full text-redd-600">
                <span className="md:text-base  font-bold mx-auto">위험</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-rows-3 h-full">
          <PartRawData data={"neck"} rawData={data.detail_data} summaryData={data} />
          <PartRawData data={"shoulder"} rawData={data.detail_data} summaryData={data} />
          <PartRawData data={"neck"} rawData={data.detail_data} summaryData={data} />
        </div>

      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-[1fr_3fr] items-center text-center border-y md:border-b border-sub-200 text-sm h-fit">
          {/* 오른쪽: 하체분석 */}
          <div className="flex h-8 print:h-6 bg-sub-200 font-bold items-center justify-center text-sub-800 text-[12px] md:text-base leading-tight ">
            하체분석
          </div>

          <div className="grid grid-cols-[30%_70%] items-center">
            <span className="text-sub-800 text-[12px] md:text-base font-medium">측정 기준</span>
            
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center w-full text-sub-300 relative justify-center">
                <span className="text-[12px] md:text-base font-bold">정상</span>
                <span className="text-[12px] md:text-base text-gray-400 absolute right-0">▶</span>
              </div>
              
              <div className="flex items-center w-full text-orangee-600 relative justify-center">
                <span className="text-[12px] md:text-base font-bold mx-auto">주의</span>
                <span className="text-[12px] md:text-base text-gray-400 absolute right-0">▶</span>
              </div>
              
              <div className="flex items-center w-full text-redd-600 relative justify-center">
                <span className="text-[12px] md:text-base font-bold">위험</span>
              </div>

            </div>
          </div>
        </div>

        <div className=" grid grid-rows-3 h-full">
          <PartRawData data={"hip"} rawData={data.detail_data} summaryData={data} />
          <PartRawData data={"knee"} rawData={data.detail_data} summaryData={data} />
          <PartRawData data={"ankle"} rawData={data.detail_data} summaryData={data} />
        </div>


      </div>
    </div>
  );
};