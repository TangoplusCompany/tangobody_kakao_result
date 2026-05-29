import React from "react";
import { cn } from "../../lib/utils";
import type { IMeasureJson } from "../../types/landmark";
import { drawSkeleton, drawTrailSegment, midPoint, setupHiDPICanvas } from "../../util/canvas";
import type { PoseLandmarks } from "../Measure/DynamicContainer";
import { useVideoPlayer } from "../../hooks/landmark/useVideoPlayer";

interface VideoPlayerProps {
  videoSrc: string | undefined;
  isRotated: boolean;
  isCompare: boolean;
  measureJson: IMeasureJson[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onFrameChange?: (frame: number) => void;
  customCanvasTransform?: string; // 커스텀 canvas transform (선택적)
  videoClassName?: string; // 커스텀 video className (선택적)
  stageClassName?: string; // 커스텀 stage className (선택적)
  containerClassName?: string; // 커스텀 container className (선택적)
  children?: React.ReactNode; // 추가 컨텐츠 (예: DynamicDataContainer)
  romType ?: number;
}
export const compareCropScale = 2.35; 
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  isRotated,
  isCompare,
  measureJson,
  isLoading,
  isError,
  onFrameChange,
  customCanvasTransform,
  videoClassName,
  stageClassName,
  containerClassName,
  children,
  romType,
}) => {
  const {
    stageRef,
    videoRef,
    canvasWhiteRef,
    canvasRedRef,
    canvasTrailRef,
    fit,
    canvasTransform,
    frame,
    duration,
    currentTime,
    setIsSeeking,
    setCurrentTime,
    isSeekingRef,
    trailPrevRef,
    toScreen,
  } = useVideoPlayer({
    videoSrc,
    isRotated,
    isCompare,
    measureJson,
    onFrameChange,
  });

  // Update canvas size when fit changes
  React.useEffect(() => {
    const cw = canvasWhiteRef.current;
    const cr = canvasRedRef.current;
    const ct = canvasTrailRef.current;
    if (!cw || !cr || !ct || fit.stageW === 0 || fit.stageH === 0) return;

    // Update canvas size when fit changes
    setupHiDPICanvas(cw, fit.stageW, fit.stageH);
    setupHiDPICanvas(cr, fit.stageW, fit.stageH);
    setupHiDPICanvas(ct, fit.stageW, fit.stageH);
  }, [fit.stageW, fit.stageH, fit.dpr, canvasWhiteRef, canvasRedRef, canvasTrailRef]);


  React.useEffect(() => {
    if (!measureJson) return;

    const item = measureJson[frame];
    if (!item || !item.pose_landmark) return;

    const lm: PoseLandmarks = item.pose_landmark;

    const cw = canvasWhiteRef.current;
    const cr = canvasRedRef.current;
    const ct = canvasTrailRef.current;
    if (!cw || !cr || !ct || fit.stageW === 0 || fit.stageH === 0) return;

    const ctxW = cw.getContext("2d");
    const ctxR = cr.getContext("2d");
    const ctxT = ct.getContext("2d");
    if (!ctxW || !ctxR || !ctxT) return;

    // Trail
    ctxT.lineWidth = 1;
    ctxT.strokeStyle = "#00FF00";
    if (romType) {
      ctxW.clearRect(0, 0, fit.stageW, fit.stageH);
      ctxR.clearRect(0, 0, fit.stageW, fit.stageH);

      switch (romType) {
        case 13: {
          const p15 = toScreen(lm[7].sx, lm[7].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        case 14: {
          const p15 = toScreen(lm[8].sx, lm[8].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        case 15: {
          const p15 = toScreen(lm[15].sx, lm[15].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        case 16: {
          const p15 = toScreen(lm[16].sx, lm[16].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        case 17:
        case 18: {
          const mid = midPoint(lm[11], lm[12]);
          const pMid = toScreen(mid.sx, mid.sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.pMid, pMid);
          trailPrevRef.current = { ...prev, pMid };
          break;
        }
        case 19: {
          const p15 = toScreen(lm[27].sx, lm[27].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        case 20: {
          const p15 = toScreen(lm[28].sx, lm[28].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        case 21:
        case 22: {
          const p15 = toScreen(lm[7].sx, lm[7].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }

        case 23:
        case 24:
        case 25:
        case 26:
        case 27: {
          const p15 = toScreen(lm[15].sx, lm[15].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        case 28:
        case 29: {
          const p15 = toScreen(lm[11].sx, lm[11].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        case 30:
        case 31: {
          const p15 = toScreen(lm[27].sx, lm[27].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }

        case 32: {
          const p15 = toScreen(lm[25].sx, lm[25].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }

        case 33:
        case 34: {
          const p15 = toScreen(lm[31].sx, lm[31].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }

        case 35:
        case 36: {
          const p15 = toScreen(lm[8].sx, lm[8].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }

        case 37:
        case 38:
        case 39:
        case 40:
        case 41: {
          const p15 = toScreen(lm[16].sx, lm[16].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        case 42:
        case 43: {
          const p15 = toScreen(lm[12].sx, lm[12].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        case 44:
        case 45: {
          const p15 = toScreen(lm[28].sx, lm[28].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }

        case 46: {
          const p15 = toScreen(lm[26].sx, lm[26].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }
        
        case 47:
        case 48: {
          const p15 = toScreen(lm[32].sx, lm[32].sy);
          const prev = trailPrevRef.current;
          drawTrailSegment(ctxT, prev.p15, p15);
          trailPrevRef.current = { ...prev, p15 };
          break;
        }

      }
      drawSkeleton(ctxW, ctxR, lm, toScreen, romType);

    } else {
      const p15 = toScreen(lm[15].sx, lm[15].sy);
      const p16 = toScreen(lm[16].sx, lm[16].sy);
      const mid = midPoint(lm[23], lm[24]);
      const pMid = toScreen(mid.sx, mid.sy);
      const p25 = toScreen(lm[25].sx, lm[25].sy);
      const p26 = toScreen(lm[26].sx, lm[26].sy);

      const prev = trailPrevRef.current;
      drawTrailSegment(ctxT, prev.p15, p15);
      drawTrailSegment(ctxT, prev.p16, p16);
      drawTrailSegment(ctxT, prev.pMid, pMid);
      drawTrailSegment(ctxT, prev.p25, p25);
      drawTrailSegment(ctxT, prev.p26, p26);

      trailPrevRef.current = { p15, p16, pMid, p25, p26 };

      // Clear
      ctxW.clearRect(0, 0, fit.stageW, fit.stageH);
      ctxR.clearRect(0, 0, fit.stageW, fit.stageH);

      // Draw skeleton
      drawSkeleton(ctxW, ctxR, lm, toScreen);
    }
    
  }, [measureJson, frame, fit, toScreen, canvasWhiteRef, canvasRedRef, canvasTrailRef, trailPrevRef, romType]);

  const handlePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    isSeekingRef.current = true;
  };

  const handleSeekEnd = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value;
    setIsSeeking(false);
    isSeekingRef.current = false;
  };
  const isSymmetryRange = romType && (romType >= 21 && romType <= 48);
  const finalCanvasTransform = React.useMemo(() => {
  const baseTransform = customCanvasTransform ?? canvasTransform;
  // isRotated이고 대칭 범위일 때만 scaleX(-1) 추가
  if (isRotated && isSymmetryRange) {
    return `${baseTransform} scaleX(-1)`;
  }
  return baseTransform;
}, [customCanvasTransform, canvasTransform, isRotated, isSymmetryRange]);
  const isCompareCrop = isCompare && !isRotated;
  // 기본 video className과 커스텀 className 병합 (cn 사용으로 tailwind 충돌 방지)

  const defaultVideoBaseClasses = isRotated 
    ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" 
    : isCompareCrop
      ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 h-full w-auto scale-[2.35]" // 좌우 crop을 위한 확대
      : "w-full h-full";
  const defaultVideoRotatedClasses = isRotated 
    ? ` h-full w-auto ${isSymmetryRange ? "rotate-90 scale-x-[-1.75] scale-y-[1.75]" : "-rotate-90 scale-[1.75]"}` 
    : "w-full h-full";
  const finalVideoClassName = cn(
    defaultVideoBaseClasses,
    videoClassName ?? defaultVideoRotatedClasses
  );
  // 기본 stage className과 커스텀 className 병합
  const defaultStageClasses = "relative mx-auto w-full h-[480px] md:h-[560px] lg:h-[680px] overflow-hidden";
  const finalStageClassName = cn(defaultStageClasses, stageClassName);
  
  // 기본 container className과 커스텀 className 병합
  const defaultContainerClasses = "flex flex-col justify-between gap-2 lg:gap-4";
  const finalContainerClassName = cn(defaultContainerClasses, containerClassName);

  return (
    <div className={finalContainerClassName}>
      <div
        ref={stageRef}
        className={finalStageClassName}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          webkit-playsinline="true"
          src={videoSrc ? videoSrc : undefined}
          className={finalVideoClassName}
        />

        <canvas
          ref={canvasTrailRef}
          className="absolute inset-0 z-9 origin-center pointer-events-none"
          style={{ transform: finalCanvasTransform }}
          // style={isRotated ? { transform: finalCanvasTransform } : {}}
        />
        <canvas
          ref={canvasWhiteRef}
          className="absolute inset-0 z-9 origin-center pointer-events-none"
          style={{ transform: finalCanvasTransform }}
        />
        <canvas
          ref={canvasRedRef}
          className="absolute inset-0 z-10 origin-center pointer-events-none"
          style={{ transform: finalCanvasTransform }}
        />

        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
            <p className="text-white">로딩중...</p>
          </div>
        )}

        {isError && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
            <p className="text-white">오류가 발생했습니다</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="px-3 py-2 rounded-xl bg-sub100 hover:bg-sub300 transition"
          onClick={handlePlayPause}
        >
          ▶❚❚
        </button>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={Math.min(currentTime, duration || 0)}
          className="flex-1 bg-sub700"
          onMouseDown={handleSeekStart}
          onTouchStart={handleSeekStart}
          onChange={(e) => {
            setCurrentTime(Number(e.target.value));
          }}
          onMouseUp={(e) => {
            handleSeekEnd(Number(e.currentTarget.value));
          }}
          onTouchEnd={(e) => {
            handleSeekEnd(Number(e.currentTarget.value));
          }}
        />
      </div>
      {children}
    </div>
  );
};

export default VideoPlayer;
