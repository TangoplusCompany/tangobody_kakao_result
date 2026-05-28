import React, { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import ic_grid from "../../assets/ic_grid.svg";
import ic_skeleton from "../../assets/ic_skeleton.svg";


interface MeasurementImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  step: "first" | "second" | "third" | "fourth" | "fifth" | "sixth";
  showGrid: boolean;
  onGridToggle: (show: boolean) => void;
  showLine: boolean;
  onLineToggle: (show: boolean) => void;
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
  step,
  showGrid,
  onGridToggle,
  showLine,
  onLineToggle
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const RadialGradientShadow = 'inset 0 0 12px rgba(255, 255, 255, 0.75)'
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
      
      // 컨테이너와 이미지의 원본 크기
      // const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imageRef.current.getBoundingClientRect();
      
      // 원본 이미지 크기 (transform 적용 전)
      const originalWidth = imgRect.width / scale;
      const originalHeight = imgRect.height / scale;
      
      // 확대된 이미지 크기
      const scaledWidth = originalWidth * scale;
      const scaledHeight = originalHeight * scale;
      
      // 드래그 가능한 최대 범위 (확대된 크기와 컨테이너 크기의 차이 / 2)
      const maxX = Math.max(0, (scaledWidth - originalWidth) / 2);
      const maxY = Math.max(0, (scaledHeight - originalHeight) / 2);
      
      // 위치 제한
      const clampedX = Math.max(-maxX, Math.min(maxX, newX));
      const clampedY = Math.max(-maxY, Math.min(maxY, newY));
      
      setPosition({
        x: clampedX,
        y: clampedY,
      }
    );
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
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
            <div className="px-4 py-2 rounded-full text-white bg-white/10 backdrop-blur-sm pointer-events-auto">
              {stepLabels[step]}
            </div>
            
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors pointer-events-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div 
            style= {{boxShadow: RadialGradientShadow}}
            className="absolute bottom-0 left-0 z-10 mb-4 ml-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/10 backdrop-blur-sm pointer-events-auto"
          >
            <button
              onClick={handleZoomOut}
              disabled={scale <= 1}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <span className="text-white text-sm font-medium min-w-15 text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={handleZoomIn}
              disabled={scale >= 2}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2 absolute bottom-4 right-4 z-10">
            <Button
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
              color="white"
              variant="secondary"
              onClick={() => onGridToggle(!showGrid)}
              style={{boxShadow: RadialGradientShadow}}
            >
              <img
                 src={ic_grid}
                alt="그리드 라디오버튼"
                className="w-4 h-4"
              />
              <span className="hidden sm:inline">{showGrid ? '그리드 끄기' : '그리드 켜기'}</span>
            </Button>
            <Button
              className="z-5 bg-white/10 backdrop-blur-sm hover:bg-white/20"
              color="white"
              variant="secondary"
              onClick={() => onLineToggle(!showLine)}
              style={{boxShadow: RadialGradientShadow}}
            >
              <img
                 src={ic_skeleton}
                alt="랜드마크 라디오버튼"
                className="w-4 h-4"
              />
              <span className="hidden sm:inline">{showLine ? '랜드마크 끄기' : '랜드마크 켜기'}</span>
            </Button>
          </div>

          <div 
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="측정 이미지 상세보기"
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
            
            {/* 그리드 오버레이 */}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementImageDialog;