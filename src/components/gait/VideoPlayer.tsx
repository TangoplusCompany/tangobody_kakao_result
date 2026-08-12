'use client';

import React from "react";
import { cn } from "@/lib/utils";
import type { IGaitMeasureJson } from "@/types/gait";
import { useVideoPlayer } from "@/hooks/landmark/useVideoPlayer";
import { setupHiDPICanvas } from "@/util/canvas";
import type { I2DPoseLandmark } from "@/types/landmark";
import { drawSkeleton } from "@/util/drawSkeleton";

interface VideoPlayerProps {
  videoSrc?: string;
  isRotated: boolean;
  isCompare: boolean ;
  measureJson?: IGaitMeasureJson[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
  onFrameChange?: (frame: number) => void;
  customCanvasTransform?: string; // 커스텀 canvas transform (선택적)
  videoClassName?: string; // 커스텀 video className (선택적)
  stageClassName?: string; // 커스텀 stage className (선택적)
  containerClassName?: string; // 커스텀 container className (선택적)
  children?: React.ReactNode; // 추가 컨텐츠 (예: DynamicDataContainer)
  romType ?: number;
  cropScale ?: number;
}

export default function VideoPlayer({
  videoSrc,
  isRotated,
  isCompare = false,
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
  cropScale = 2.35,
}: VideoPlayerProps) {
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
    onFrameChange,
    cropScale,
  });
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
    if (!item || !item.screen_landmarks) return;

    const lm: I2DPoseLandmark[] = item.screen_landmarks;

    const cw = canvasWhiteRef.current;
    const cr = canvasRedRef.current;
    if (!cw || !cr || fit.stageW === 0 || fit.stageH === 0) return;

    const ctxW = cw.getContext("2d");
    const ctxR = cr.getContext("2d");
    if (!ctxW || !ctxR ) return;

    // Clear
    ctxW.clearRect(0, 0, fit.stageW, fit.stageH);
    ctxR.clearRect(0, 0, fit.stageW, fit.stageH);

    // Draw skeleton
    drawSkeleton(ctxW, ctxR, lm, toScreen);
    
    
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
  
    const defaultVideoBaseClasses = isRotated 
      ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" 
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
          src={videoSrc ? `${import.meta.env.VITE_PUBLIC_FILE_URL}/${videoSrc}` : undefined}
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
          <div className="absolute inset-0 z-[50] flex items-center justify-center bg-black/20">
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
}