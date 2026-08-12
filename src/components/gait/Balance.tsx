import type { GaitContainerProps } from "./Container";
import FootPrintIcon from "./FootPrintIcon";
import GaitGaugeChart from "./GuageChart";

export default function GaitBalance({data}: GaitContainerProps) {
  const iData = data.gait_measure_info
  return (
    <div className="flex flex-col flex-1 min-h-80 h-full border-2 border-sub200 rounded-xl p-4 gap-2">

      <div className="text-lg font-semibold mb-2 text-sub700">
        보행 밸런스(Single, Double Support)
      </div>


      <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 ">
            <div className="w-3 h-3 rounded-sm bg-mainBlue-300" />
            <div className="text-mainBlue-300 text-sm sm:text-base font-bold ">
              보행 좌우 균형
            </div>
          </div>
          <div className="flex flex-1 w-full justify-center">
            <GaitGaugeChart
              left={{
                label: "왼발",
                percent: iData.avgLeftSingleSupportRatio,
                time: `${iData.avgDoubleSupportTime.toFixed(1)}초`,
                color: { id: "leftGrad", start: "#5B93FF00", end: "#5B93FF" },
              }}
              both={{
                label: "양발 지지",
                percent: iData.avgDoubleSupportRatio,
                time: `${iData.avgLeftSingleSupportTime.toFixed(1)}초`,
                color: { id: "bothGrad", start: "#7E7E7E00", end: "#7E7E7E" },
              }}
              right={{
                label: "오른발 지지",
                percent: iData.avgRightSingleSupportRatio,
                time: `${iData.avgRightSingleSupportTime.toFixed(1)}초`,
                color: { id: "rightGrad", start: "#49D68F00", end: "#49D68F" },
              }}
            />
          </div>

          <div className="flex text-sub700 text-sm sm:text-base">
            {iData.resultDoubleSupportRiskDescription}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 ">
            <div className="w-3 h-3 rounded-sm bg-mainBlue-300" />
            <div className="text-mainBlue-300 text-sm sm:text-base font-bold ">
              보행 주기 균형
            </div>
          </div>

          

          {/* ⬆️ 양발  |  ⬇️ 왼발 오른발 */}
          <div className="flex flex-col">
            <div className="grid grid-cols-[20%_80%] w-full rounded-xl border border-sub100 p-2">
              <div className="flex gap-2 border-2 border-sub200 rounded-xl items-center p-2 mr-1">
                <div className="flex flex-col  text-sub700 font-semibold">
                  <span>L</span>
                  <span className="opacity-10">R</span>
                </div>
                <FootPrintIcon leftStartColor="#454545" leftEndColor="#454545" />
              </div>

              <div className="flex w-full rounded-xl overflow-hidden bg-sub100 border-2 border-sub200 items-center justify-between">
                <div 
                  className="h-full bg-linear-to-r from-mainBlue-300/90 to-mainBlue-300/30 rounded-xl flex items-center justify-between px-4 text-white font-bold shrink-0"
                  style={{ width: `${iData.avgLeftStanceRatio}%` }}
                >
                  <span className="text-sm">왼발 보행 입각기</span>
                  <span className="bg-sub100/20 text-sub700 px-2.5 py-1 rounded-full text-xs">{iData.avgLeftStanceRatio.toFixed(1)}%</span>
                </div>
                <div className="flex-1 flex items-center justify-between px-4 text-sub700 font-bold">
                  <span className="text-sm">유각기</span>
                  <span className="bg-sub100/20 px-2.5 py-1 rounded-full text-xs">{iData.avgLeftSwingRatio.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>


          <div className="flex flex-col">
            <div className="grid grid-cols-[20%_80%] w-full rounded-xl border border-sub100 p-2">
              <div className="flex gap-2 border-2 border-sub200 rounded-xl items-center p-2 mr-1">
                <div className="flex flex-col  text-sub700 font-semibold">
                  <span className="opacity-10">L</span>
                  <span >R</span>
                </div>
                <FootPrintIcon rightStartColor="#454545" rightEndColor="#454545" />
              </div>

              <div className="flex w-full rounded-xl overflow-hidden bg-sub100 border-2 border-sub200 items-center justify-between">
                <div 
                  className="h-full bg-linear-to-r from-mainGreen-600/90 to-mainGreen-600/30 rounded-xl flex items-center justify-between px-4 text-white font-bold shrink-0"
                  style={{ width: `${iData.avgRightStanceRatio}%` }}
                >
                  <span className="text-sm">오른발 보행 입각기</span>
                  <span className="bg-sub100/20 text-sub700 px-2.5 py-1 rounded-full text-xs">{iData.avgRightStanceRatio.toFixed(1)}%</span>
                </div>
                <div className="flex-1 flex items-center justify-between px-4 text-sub700 font-bold">
                  <span className="text-sm">유각기</span>
                  <span className="bg-sub100/20 px-2.5 py-1 rounded-full text-xs">{iData.avgRightSwingRatio.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-1 rounded-full bg-sub200 mx-4"/>
          <div className="flex flex-col">
            <div className="grid grid-cols-[20%_80%] w-full rounded-xl border border-sub100 p-2">
              <div className="flex gap-2 border-2 border-sub200 rounded-xl items-center p-2 mr-1">
                <div className="flex flex-col  text-sub700 font-semibold">
                  <span>L</span>
                  <span>R</span>
                </div>
                <FootPrintIcon leftStartColor="#454545" leftEndColor="#454545" rightStartColor="#454545" rightEndColor="#454545" />
              </div>

              <div className="flex w-full rounded-xl overflow-hidden bg-sub100 border-2 border-sub200 items-center justify-between">
                <div 
                  className="h-full bg-linear-to-r from-sub600/90 to-sub600/30 rounded-xl flex items-center justify-between px-2 text-white font-bold shrink-0"
                  style={{ width: `${iData.avgStancePhaseRatio}%` }}
                >
                  <span className="text-sm">양발 보행 입각기</span>
                  <span className="bg-sub100/20 text-white px-2.5 py-1 rounded-full text-xs">{iData.avgStancePhaseRatio.toFixed(1)}%</span>
                </div>
                <div className="flex-1 flex items-center justify-between px-4 text-sub700 font-bold">
                  <span className="text-sm">유각기</span>
                  <span className="bg-sub100/20 px-2.5 py-1 rounded-full text-xs">{iData.avgSwingPhaseRatio.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          
          <div className="text-sub700 text-sm sm:text-base">
            {iData.resultSingleRiskSupportDescription}
          </div>
        </div>

      </div>
    </div>
  )
}