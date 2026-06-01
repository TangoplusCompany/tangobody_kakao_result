import { useState } from "react";
import type { IPoseLandmark } from "../../types/landmark";
import { useStaticLandmark } from "../../hooks/landmark/useStaticLandmark";
import { Button } from "../ui/Button";
import MeasurementImageDialog from "./ImageDialog";
import ic_grid from "../../assets/ic_grid.svg";
import ic_skeleton from "../../assets/ic_skeleton.svg";
import { Shimmer } from "../ui/Shimmer";

export type Step = "first" | "second" | "third" | "fourth" | "fifth" | "sixth";
interface MeasurementImageProps {
  imageUrl: string;
  measureJson: { pose_landmark: IPoseLandmark[] };
  step: Step;
  cameraOrientation: 0 | 1;
  compareSlot?: 0 | 1;
}
export const MeasurementImage = ({
  imageUrl,
  measureJson,
  step,
  cameraOrientation,
  compareSlot,
}: MeasurementImageProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showLine, setShowLine] = useState(true);

  const { resultUrl, loading } = useStaticLandmark(imageUrl, measureJson, step, cameraOrientation, showLine);
  const RadialGradientShadow = 'inset 0 0 12px rgba(255, 255, 255, 0.75)'

  const loadingPlaceholder = (
    <div className="">
      <Shimmer className="h-105 md:h-200 rounded-xl"/>
    </div>
  );

  if (loading) return loadingPlaceholder;
  if (!resultUrl) return loadingPlaceholder;
  
  return (
    <div className="relative w-full mx-auto">
      <img
        src={resultUrl} 
        alt="측정 이미지" 
        className="w-full  shadow-inner cursor-pointer md:rounded-xl" 
        onClick={() => setDialogOpen(true)}
      />
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.10) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.10) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px'
          }}
        />
      )}
      {compareSlot !== undefined && (
        <div className="absolute top-0 left-0 -translate-x-1/2 z-5 mx-8 my-4">
          <p className="px-1 py-1 rounded-full text-xl  md:text-3xl text-white bg-white/10 backdrop-blur-sm">
            {compareSlot === 0 ? '①' : '②'}
          </p>
        </div>
      )}

      {step === "third" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-5 mt-4">
          <p className="px-3 py-1 rounded-full text-xs md:text-base text-white bg-white/10 backdrop-blur-sm whitespace-nowrap w-fit">
            왼쪽
          </p>
        </div>
      )}
      
      {step === "fourth" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-5 mt-4">
          <p className="px-3 py-1 rounded-full text-xs  md:text-base text-white bg-white/10 backdrop-blur-sm whitespace-nowrap w-fit">
            오른쪽
          </p>
        </div>
        )}
      {/* 그리드 토글 버튼 - 우측 하단 */}
      <div className="flex flex-col gap-2 absolute bottom-4 right-4 z-5">
        <Button
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          color="white"
          variant="secondary"
          onClick={() => setShowGrid(!showGrid)}
          style={{boxShadow: RadialGradientShadow}}
        >
            <img
              src={ic_grid}
              alt="그리드 라디오버튼"
              className="xs:w-2 xs:h-2 w-4 h-4"
            />
          <span className="hidden sm:inline text-white">{showGrid ? '그리드 끄기' : '그리드 켜기'}</span>
        </Button>
        <Button
          className="z-5 bg-white/10 backdrop-blur-sm hover:bg-white/20"
          color="white"
          variant="secondary"
          onClick={() => setShowLine(!showLine)}
          style={{boxShadow: RadialGradientShadow}}
        >
          <img
            src={ic_skeleton}
            alt="랜드마크 라디오버튼"
            className="w-4 h-4"
          />
          <span className="hidden sm:inline text-white">{showLine ? '랜드마크 끄기' : '랜드마크 켜기'}</span>
        </Button>
      </div>

      <MeasurementImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        imageUrl={resultUrl}
        step={step}
        showGrid={showGrid}
        onGridToggle={setShowGrid}
        showLine={showLine}
        onLineToggle={setShowLine}
      />
    </div>
  );
};