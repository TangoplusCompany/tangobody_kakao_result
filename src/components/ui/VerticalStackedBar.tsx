export interface SegmentData {
  label: string;
  percentage: number;
  color: string; // HEX (#5D8DFF) 또는 Tailwind 클래스명
}

interface VerticalStackedBarProps {
  data: SegmentData[];
  width?: number;
  gap?: number;
}

export default function VerticalStackedBar({
  data,
  width = 30,
  gap = 2,
}: VerticalStackedBarProps) {
  return (
    <div 
      className="flex flex-col h-full" 
      style={{ 
        width: `${width}px`, 
        gap: `${gap}px` 
      }}
    >
      {data.map((segment, index) => {
        const isFirst = index === 0;
        const isLast = index === data.length - 1;

        return (
          <div
            key={index}
            style={{ 
              flex: segment.percentage, 
              backgroundColor: segment.color.startsWith('#') ? segment.color : undefined 
            }}
            // group 클래스를 추가하여 자식 툴팁이 hover를 감지하도록 합니다.
            className={`
              relative group cursor-pointer
              ${isFirst ? 'rounded-t-sm' : ''} 
              ${isLast ? 'rounded-b-sm' : ''}
              ${!segment.color.startsWith('#') ? segment.color : ''}
            `}
          >
            {/* 커스텀 툴팁 박스 */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-10 hidden group-hover:block bg-white/50 text-sub800 text-xs rounded py-1 px-2 whitespace-nowrap shadow-md pointer-events-none">
              {segment.label}: {segment.percentage.toFixed(1)}%
              {/* 말풍선 화살표 */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-sub800" />
            </div>
          </div>
        );
      })}
    </div>
  );
}