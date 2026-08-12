import FootPrintIcon from "./FootPrintIcon";

interface GaitData {
  label: string;
  percent: number;
  time: string;
  color: { id: string; start: string; end: string };
}

interface GaitGaugeChartProps {
  left: GaitData;
  both: GaitData;
  right: GaitData;
}

function describeArc(
  x: number,
  y: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
) {
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const startOuter = polarToCartesian(x, y, outerR, endAngle);
  const endOuter = polarToCartesian(x, y, outerR, startAngle);
  const startInner = polarToCartesian(x, y, innerR, endAngle);
  const endInner = polarToCartesian(x, y, innerR, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

function describeOuterArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export default function GaitGaugeChart({ left, both, right }: GaitGaugeChartProps) {
  const cx = 200;
  const cy = 200;
  const innerR = 100;
  const outerR = 170;
  const labelR = 185;
  const gapAngle = 3;

  const rawList = [left, both, right];
  const totalPercent = rawList.reduce((acc, cur) => acc + cur.percent, 0) || 100;

  let currentAngle = -90;

  const sections = rawList.map((item) => {
    const sweepAngle = (item.percent / totalPercent) * 180;
    const startAngle = currentAngle + gapAngle / 2;
    const endAngle = currentAngle + sweepAngle - gapAngle / 2;
    currentAngle += sweepAngle;

    return {
      ...item,
      startAngle,
      endAngle,
      midAngle: (startAngle + endAngle) / 2,
    };
  });

  return (
    <div className="flex flex-col items-center text-white w-[440px]">
      <svg viewBox="0 0 400 270" className="w-full">
        <defs>
          {sections.map(({ color }) => (
            <linearGradient key={color.id} id={color.id} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color.start} />
              <stop offset="100%" stopColor={color.end} />
            </linearGradient>
          ))}

          <linearGradient id="footGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EDEDED" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#EDEDED" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* 1. 부채꼴 차트 및 텍스트 */}
        {sections.map((item) => {
          const pathD = describeArc(cx, cy, innerR, outerR, item.startAngle, item.endAngle);
          const outerLineD = describeOuterArc(cx, cy, outerR, item.startAngle, item.endAngle);

          const radMid = (item.midAngle * Math.PI) / 180;
          const textRMid = (innerR + outerR) / 2;
          const txMid = cx + textRMid * Math.sin(radMid);
          const tyMid = cy - textRMid * Math.cos(radMid);

          const chars = item.label.split("");
          const charAngleGap = 3.5;
          const totalLabelSweep = (chars.length - 1) * charAngleGap;
          const labelStartAngle = item.midAngle - totalLabelSweep / 2;

          return (
            <g key={item.label}>
              <path d={pathD} fill={`url(#${item.color.id})`} />
              <path d={outerLineD} fill="none" stroke={item.color.end} strokeWidth={4} />

              {/* 외곽 라벨 */}
              {chars.map((char, index) => {
                const charAngle = labelStartAngle + index * charAngleGap;
                const charRad = (charAngle * Math.PI) / 180;
                const charX = cx + labelR * Math.sin(charRad);
                const charY = cy - labelR * Math.cos(charRad);

                return (
                  <text
                    key={index}
                    x={charX}
                    y={charY}
                    className="text-[13px] font-bold"
                    style={{ fill: item.color.end }}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${charAngle}, ${charX}, ${charY})`}
                  >
                    {char}
                  </text>
                );
              })}

              {/* 수치 정보 */}
              <text x={txMid} y={tyMid - 4} textAnchor="middle" className="fill-white text-[18px] font-bold">
                {item.percent.toFixed(1)}%
              </text>
              <text x={txMid} y={tyMid + 16} textAnchor="middle" className="fill-white text-[12px] px-2 py-1 bg-sub100/80">
                {item.time}
              </text>
            </g>
          );
        })}

        {/* 2. 중앙 캡슐 (좌우 균형 분석) */}
        <g transform={`translate(${cx - 55}, ${cy - 35})`}>
          <rect x="0" y="0" width="110" height="26" rx="13" fill="#EDEDED" stroke="#EDEDED" strokeWidth="1.5" />
          <text x="55" y="13" textAnchor="middle" dominantBaseline="central" className="text-sub700 text-[11px] font-medium">
            좌우 균형 분석
          </text>
        </g>

        {/* 3. 중앙 하단 발바닥 SVG (클린 버전) */}
        <g transform={`translate(${cx - 28}, ${cy + 5})`}>
          <FootPrintIcon startColor="#EDEDED" endColor="#EDEDED" />
        </g>

        {/* 4. 좌우 하단 Left / Right 라벨 */}
        <text
          x={cx - innerR + 10}
          y={cy + 25}
          textAnchor="middle"
          style={{ fill: left.color.end }}
          className="text-[18px] font-bold"
        >
          &lt;&lt; Left
        </text>
        <text
          x={cx + innerR - 10}
          y={cy + 25}
          textAnchor="middle"
          style={{ fill: right.color.end }}
          className="text-[18px] font-bold"
        >
          Right &gt;&gt;
        </text>
      </svg>
    </div>
  );
}