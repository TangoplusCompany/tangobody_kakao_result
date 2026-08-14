import { useStaticLandmark } from "@/hooks/landmark/useStaticLandmark";
import { DUMMY_SECTION_DATA, useDetectMoireSections, type IMoireSectionData } from "@/hooks/moire/useDetectMoireSections";
import { useMeasureMoireMatJson } from "@/hooks/moire/useMoireMatJson";
import type { IMoireSeq } from "@/types/moire";
import { useState } from "react";
import { Button } from "../ui/Button";
import FootStatic from "./FootStatic";
import MeasurementImageDialog from "../basic/ImageDialog";
import ic_grid from "../../assets/ic_grid.svg";

export function SectionOverlay({isFront, sectionData = DUMMY_SECTION_DATA }: {isFront: boolean, sectionData : IMoireSectionData}) {
  const { lineYPercents, labels } = sectionData;

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* 1. 중앙 수직 레드 라인 */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10 -translate-x-1/2"
        style={{ left: `${sectionData.lineXPercent}%` }}
      />

      {/* 2. 상단 좌측/우측 뱃지 */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex w-full max-w-75 justify-between px-2 z-10">
        <span className="bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full backdrop-blur-sm">
          {isFront ? "좌측" : "우측"}
        </span>
        <span className="bg-white/10 text-white text-xs px-2.5 py-0.5 rounded-full backdrop-blur-sm">
          {isFront ? "우측" : "좌측"}
        </span>
      </div>

      {/* 3. 횡단면 점선 4개 (양끝 원 포함) */}
      {lineYPercents.map((yPercent, idx) => (
        <div
          key={`line-${idx}`}
          className="absolute left-3 right-3 flex items-center z-10"
          style={{ top: `${yPercent}%` }}
        >
          {/* 좌측 점 */}
          <div className="w-1 h-1 rounded-full bg-white/80 shrink-0" />
          
          {/* 중앙 점선: h-0으로 박스 높이를 없애고 border-b로 1px 단일 하단선만 적용 */}
          <div className="flex-1 h-0 border-b border-dashed border-white/60" />
          
          {/* 우측 점 */}
          <div className="w-1 h-1 rounded-full bg-white/80 shrink-0" />
        </div>
      ))}

      {/* 4. 점선 사이 텍스트 라벨 (두 점선의 중간 위치) */}
      {labels.map((label, idx) => {
        const topY = lineYPercents[idx];
        const bottomY = lineYPercents[idx + 1];
        const midY = (topY + bottomY) / 2; // 두 선의 중앙 Y 위치

        return (
          <div
            key={`label-${idx}`}
            className="absolute left-5 -translate-y-1/2 bg-white/10 backdrop-blur-sm z-20 rounded-full px-2 py-0.5"
            style={{ top: `${midY}%` }}
          >
            <span className="text-white text-xs sm:text-sm text-center">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export interface IMoireImageProps {
  isFront: boolean;
  data: IMoireSeq
}

export default function MoireImage({ imageData }: { imageData: IMoireImageProps }) {
  const fileBaseUrl = import.meta.env.VITE_PUBLIC_FILE_URL ?? "";
  const rgbFileName = imageData.data.server_file_name;
  const cleanRgbName = rgbFileName ? rgbFileName.replace(/^\//, "") : "";
  const rgbUrl = `${fileBaseUrl.replace(/\/$/, "")}/${cleanRgbName}`;

  const moireFileName = imageData.data.server_file_name_moire;
  const cleanMoireName = moireFileName ? moireFileName.replace(/^\//, "") : "";
  const moireUrl = `${fileBaseUrl.replace(/\/$/, "")}/${cleanMoireName}`;

  const matFileName = imageData.data.server_file_name_mat_json;
  const { data: matJson, isLoading: jsonLoading, isError: jsonError } = useMeasureMoireMatJson(matFileName);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showLine, setShowLine] = useState(true);
  const [moireOpacity, setMoireOpacity] = useState<number>(100);

  const { resultUrl: rgbResultUrl, loading: rgbLoading } = useStaticLandmark(rgbUrl, 1, showLine);
  const { resultUrl: moireResultUrl, loading: moireLoading } = useStaticLandmark(moireUrl, 1, false);
  const { sectionData, isLoading: isSectionLoading } = useDetectMoireSections(moireResultUrl);
  const RadialGradientShadow = 'inset 0 0 12px rgba(255, 255, 255, 0.75)';

  const loadingPlaceholder = (
    <div className="w-full h-180 rounded-2xl bg-sub100 animate-pulse flex flex-col items-center justify-center gap-4">
      <div
        className="w-12 h-12 rounded-full border-4 border-sub200 border-t-mainBlue-300 animate-spin"
        aria-hidden
      />
      <p className="text-sub400 dark:text-sub300 text-sm font-medium animate-pulse">
        로딩중입니다
      </p>
    </div>
  );

  // 💡 1. 모든 로딩 상태 하나로 통합 (빨간 에러 문구 깜빡임 방지)
  const isTotalLoading = jsonLoading || isSectionLoading || rgbLoading || moireLoading;

  if (isTotalLoading) {
    return loadingPlaceholder;
  }
  // 💡 3. 이미지 생성 실패 시 처리 (!sectionData 제거하여 무한 로딩 방지)
  if (!rgbResultUrl || !moireResultUrl) {
    return loadingPlaceholder;
  }
  if (jsonError || !matJson) {
    return <div className="text-red-500">오류가 발생했습니다. Moire 데이터 데이터 누락</div>;
  }
  const pressures = {
    leftTopPressure: matJson.left_top_weight_pct,
    leftBottomPressure: matJson.left_bottom_weight_pct,
    rightTopPressure: matJson.right_top_weight_pct,
    rightBottomPressure: matJson.right_bottom_weight_pct,
    leftPressure: Math.round(matJson.left_weight_pct),
    rightPressure: Math.round(matJson.right_weight_pct),
    topPressure: Math.round(matJson.fore_weight_pct),
    bottomPressure: Math.round(matJson.heel_weight_pct),
  };

  return (
    <div className="relative flex flex-col w-full mt-4">
      <div className='flex gap-1 pl-1 pt-1 items-center'>
        <div className='w-3 h-3 rounded-[3px] bg-mainBlue-300' />
        <span className='text-mainBlue-300 font-bold text-sm'>{imageData.isFront ? "모아레 측정(전면)" : "모아레 측정(후면)"}</span>
      </div>

      <div className="flex flex-1 justify-center w-full rounded-xl mt-2">
        <div className="relative flex justify-center items-center">
          <div className="relative w-full mx-auto overflow-hidden rounded-2xl">
            <img
              src={rgbResultUrl}
              alt="측정 RGB 이미지"
              className="w-full rounded-2xl cursor-pointer block"
              onClick={() => setDialogOpen(true)}
            />
            <img
              src={moireResultUrl}
              alt="모아레 오버레이"
              className="absolute inset-0 w-full h-full rounded-2xl cursor-pointer pointer-events-none transition-opacity duration-150"
              style={{ opacity: moireOpacity / 100 }}
            />

            {/* 그리드 오버레이 */}
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
              />
            )}

            {/* 하단 컨트롤러 */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
              <div
                style={{ boxShadow: RadialGradientShadow }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white pointer-events-auto"
              >
                <span className="text-xs sm:text-sm whitespace-nowrap">
                  모아레 투명도
                </span>
                <div className="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={moireOpacity}
                    onChange={(e) => setMoireOpacity(Number(e.target.value))}
                    className="w-20 sm:w-28 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer mainBlue-300-mainBlue-300 relative z-10"
                  />
                  
                  <div className="absolute inset-x-1.5 flex justify-between pointer-events-none z-0">
                    {[0, 25, 50, 75, 100].map((val) => (
                      <span
                        key={val}
                        className={`w-0.5 h-0.5 rounded-full ${
                          val <= moireOpacity ? "bg-white/75" : "bg-white/25"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="w-6 text-xs whitespace-nowrap">
                  {moireOpacity}%
                </span>
              </div>

              <Button
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                color="white"
                variant="secondary"
                onClick={() => setShowGrid(!showGrid)}
                style={{ boxShadow: RadialGradientShadow }}
              >
                <img
                  src={ic_grid}
                  alt="그리드 라디오버튼"
                  className="w-4 h-4"
                />
                <span className="hidden sm:inline text-sub200">
                  {showGrid ? "그리드 끄기" : "그리드 켜기"}
                </span>
              </Button>
            </div>

            <MeasurementImageDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              imageUrl={rgbResultUrl}
              showGrid={showGrid}
              onGridToggle={setShowGrid}
              showLine={showLine}
              onLineToggle={setShowLine}
              moireUrl={moireResultUrl}
              moireOpacity={moireOpacity}
              moireSection={sectionData}
              onMoireOpacityChange={setMoireOpacity}
              step={`${imageData.isFront ? "first": "fifth"}`}
            />
          </div>

          {/* sectionData가 없어도 DUMMY_SECTION_DATA로 안전하게 대체 */}
          <SectionOverlay isFront={imageData.isFront} sectionData={sectionData ?? DUMMY_SECTION_DATA} />
        </div>

        {imageData.isFront && (
          <div className="absolute bottom-16 right-4 w-28 h-28 sm:w-30 sm:h-30 bg-white/10 backdrop-blur-sm rounded-xl p-1.5">
            <FootStatic fileName={imageData.data.server_file_name_mat} matStatics={pressures} />
          </div>
        )}
      </div>
    </div>
  );
}