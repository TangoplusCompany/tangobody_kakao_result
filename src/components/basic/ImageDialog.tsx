import React, { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { DUMMY_SECTION_DATA, type IMoireSectionData } from '@/hooks/moire/useDetectMoireSections';
import { Button } from '../ui/Button';
import { SectionOverlay } from '../moire/Image';
import ic_grid from "../../assets/ic_grid.svg";


interface MeasurementImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  step?: "first" | "second" | "third" | "fourth" | "fifth" | "sixth";
  showGrid: boolean;
  onGridToggle: (show: boolean) => void;
  showLine: boolean;
  onLineToggle: (show: boolean) => void;

  moireUrl?: string | null;
  moireOpacity?: number;
  moireSection ?: IMoireSectionData;
  onMoireOpacityChange?: (opacity: number) => void;
}

const stepLabels = {
  first: "정면 측정",
  second: "팔꿉 측정",
  third: "왼쪽 측정",
  fourth: "오른쪽 측정",
  fifth: "후면 측정",
  sixth: "앉은 후면",
};

export const MeasurementImageDialog: React.FC<MeasurementImageDialogProps> = ({
  open,
  onOpenChange,
  imageUrl,
  step = "first",
  showGrid,
  onGridToggle,
  showLine,
  onLineToggle,

  moireUrl,
  moireOpacity = 100,
  moireSection,
  onMoireOpacityChange,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const RadialGradientShadow = 'inset 0 0 12px rgba(255, 255, 255, 0.75)';

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 1));
    if (scale <= 1.25) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleClose = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onOpenChange(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1 || !imageRef.current || !containerRef.current) return;
    
    e.preventDefault();
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const imgRect = imageRef.current.getBoundingClientRect();
    const originalWidth = imgRect.width / scale;
    const originalHeight = imgRect.height / scale;
    
    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;
    
    const maxX = Math.max(0, (scaledWidth - originalWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - originalHeight) / 2);
    
    const clampedX = Math.max(-maxX, Math.min(maxX, newX));
    const clampedY = Math.max(-maxY, Math.min(maxY, newY));
    
    setPosition({
      x: clampedX,
      y: clampedY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (scale <= 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 border-none bg-transparent w-fit h-fit [&>button]:hidden" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{stepLabels[step]} 이미지 확대</DialogTitle>
        <div className="relative">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 pointer-events-none">
            {!moireUrl && (
              <div className="px-4 py-2 rounded-full text-white bg-white/10 backdrop-blur-sm pointer-events-auto">
                {stepLabels[step]}
              </div>
            )}
            
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors pointer-events-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls Bar (하단) */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between pointer-events-none">
            {/* 좌측: Zoom & Moire 슬라이더 */}
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div 
                style={{ boxShadow: RadialGradientShadow }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/20 backdrop-blur-sm pointer-events-auto"
              >
                <button
                  onClick={handleZoomOut}
                  disabled={scale <= 1}
                  className="p-1 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                
                <span className="text-white text-xs font-medium min-w-[45px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                
                <button
                  onClick={handleZoomIn}
                  disabled={scale >= 2}
                  className="p-1 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* 💡 모아레 투명도 슬라이더 (onMoireOpacityChange 전달 시 표시) */}
              {onMoireOpacityChange && (
                <div
                  style={{ boxShadow: RadialGradientShadow }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white pointer-events-auto"
                >
                  <span className="text-xs sm:text-sm whitespace-nowrap">
                    모아레 투명도
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={moireOpacity}
                    onChange={(e) => onMoireOpacityChange(Number(e.target.value))}
                    className="w-20 sm:w-28 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer mainBlue-300-mainBlue-300"
                  />
                  <span className="w-6 text-xs whitespace-nowrap">
                    {moireOpacity}%
                  </span>
                </div>
              )}
            </div>

            {/* 우측: 그리드 및 랜드마크 버튼 */}
            <div className="flex flex-col gap-2 pointer-events-auto">
              <Button
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                color="white"
                variant="secondary"
                onClick={() => onGridToggle(!showGrid)}
                style={{ boxShadow: RadialGradientShadow }}
              >
                <img
                  src={ic_grid}
                  alt="그리드 라디오버튼"
                  className="w-4 h-4"
                />
                <span className="hidden sm:inline">{showGrid ? '그리드 끄기' : '그리드 켜기'}</span>
              </Button>
              {!moireUrl && (
                <Button
                  className="z-5 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  color="white"
                  variant="secondary"
                  onClick={() => onLineToggle(!showLine)}
                  style={{ boxShadow: RadialGradientShadow }}
                >
                  <img
                    src="/icons/ic_skeleton.svg"
                    alt="랜드마크 라디오버튼"
                    className="w-4 h-4"
                  />
                  <span className="hidden sm:inline">{showLine ? '랜드마크 끄기' : '랜드마크 켜기'}</span>
              </Button>
              )}
            </div>
          </div>

          {/* 이미지 컨테이너 */}
          <div 
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {/* 1. 기본 RGB/랜드마크 이미지 */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt="측정 이미지 상세보r기"
              className={`block w-auto h-auto max-w-[90vw] max-h-[90vh] select-none ${
                scale > 1 ? 'cursor-grab' : 'cursor-default'
              } ${isDragging ? 'cursor-grabbing' : ''} ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transformOrigin: 'center center',
              }}
              onMouseDown={handleMouseDown}
              draggable={false}
            />

            {/* 2. 💡 모아레 오버레이 이미지 */}
            {moireUrl && (
              <img
                src={moireUrl}
                alt="모아레 오버레이"
                className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none ${
                  isDragging ? '' : 'transition-transform duration-300 ease-out'
                }`}
                style={{
                  opacity: moireOpacity / 100,
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transformOrigin: 'center center',
                }}
                draggable={false}
              />
            )}
            
            {/* 3. 그리드 오버레이 */}
            {showGrid && (
              <div 
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transformOrigin: 'center center',
                }}
              />
            )}
            <SectionOverlay isFront={step === "first"} sectionData={moireSection ?? DUMMY_SECTION_DATA} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementImageDialog;