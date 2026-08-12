import { useId } from "react";

interface FootprintIconProps {
  // 공통 색상 (좌/우 개별 값이 지정되지 않았을 때 기본값)
  startColor?: string;
  endColor?: string;

  // 좌/우 개별 색상
  leftStartColor?: string;
  leftEndColor?: string;
  rightStartColor?: string;
  rightEndColor?: string;

  startOpacity?: number;
  endOpacity?: number;
  strokeColor?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export default function FootPrintIcon({
  startColor = "#EDEDED",
  endColor = "#EDEDED",
  leftStartColor,
  leftEndColor,
  rightStartColor,
  rightEndColor,
  startOpacity = 0.8,
  endOpacity = 0.15,
  strokeColor = "#CCC8C8",
  width = 56,
  height = 42,
  className,
}: FootprintIconProps) {
  const baseId = useId();
  const leftGradId = `${baseId}-left`;
  const rightGradId = `${baseId}-right`;

  // 개별 색상이 없으면 공통 색상(startColor/endColor) 적용
  const lStart = leftStartColor ?? startColor;
  const lEnd = leftEndColor ?? endColor;
  const rStart = rightStartColor ?? startColor;
  const rEnd = rightEndColor ?? endColor;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 56 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* 왼발 그라데이션 */}
        <linearGradient id={leftGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lStart} stopOpacity={startOpacity} />
          <stop offset="100%" stopColor={lEnd} stopOpacity={endOpacity} />
        </linearGradient>

        {/* 오른발 그라데이션 */}
        <linearGradient id={rightGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={rStart} stopOpacity={startOpacity} />
          <stop offset="100%" stopColor={rEnd} stopOpacity={endOpacity} />
        </linearGradient>
      </defs>

      {/* 왼발 */}
      <path
        d="M10.8948 0C7.74743 0 5.14479 1.38242 3.08689 4.14727C1.029 6.91211 4.76837e-05 10.3718 4.76837e-05 14.5263C4.76837e-05 17.3105 0.322855 19.7421 0.96847 21.821C1.39222 23.1855 1.80728 24.3539 2.21366 25.3262C2.55736 26.1486 3.44668 26.5718 4.32069 26.397L19.0096 23.4592C19.6848 23.3241 20.2482 22.8528 20.4631 22.1986C20.7593 21.2972 21.0295 20.3134 21.2739 19.2474C21.616 17.7544 21.7879 16.1807 21.7895 14.5263C21.7895 10.9351 20.8308 7.61664 18.9133 4.57095C16.9959 1.52526 14.323 0.00161404 10.8948 0ZM14.2237 41.1579C16.4027 41.1579 18.2088 40.3913 19.6421 38.8579C21.0753 37.3246 21.7912 35.4079 21.7895 33.1079C21.7895 32.1799 21.6483 31.2825 21.3659 30.4157C21.2665 30.1108 21.1647 29.817 21.0603 29.5343C20.7411 28.6694 19.8221 28.2129 18.9184 28.3957L6.63578 30.8809C5.64606 31.0812 4.94316 31.9929 5.14863 32.9815C5.5462 34.8946 6.35194 36.6217 7.56585 38.1631C9.13953 40.1613 11.3588 41.1596 14.2237 41.1579Z"
        fill={`url(#${leftGradId})`}
        stroke={strokeColor}
        strokeWidth="0.5"
      />

      {/* 오른발 */}
      <path
        d="M44.6843 0C47.8317 0 50.4343 1.38242 52.4922 4.14727C54.5501 6.91211 55.5791 10.3718 55.5791 14.5263C55.5791 17.3105 55.2562 19.7421 54.6106 21.821C54.1869 23.1855 53.7718 24.3539 53.3654 25.3262C53.0217 26.1486 52.1324 26.5718 51.2584 26.397L36.5695 23.4592C35.8943 23.3241 35.3309 22.8528 35.116 22.1986C34.8198 21.2972 34.5496 20.3134 34.3052 19.2474C33.9631 17.7544 33.7912 16.1807 33.7896 14.5263C33.7896 10.9351 34.7483 7.61664 36.6658 4.57095C38.5832 1.52526 41.2561 0.00161404 44.6843 0ZM41.3554 41.1579C39.1764 41.1579 37.3703 40.3913 35.937 38.8579C34.5038 37.3246 33.7879 35.4079 33.7896 33.1079C33.7896 32.1799 33.9308 31.2825 34.2132 30.4157C34.3126 30.1108 34.4144 29.817 34.5188 29.5343C34.838 28.6694 35.757 28.2129 36.6607 28.3957L48.9433 30.8809C49.933 31.0812 50.6359 31.9929 50.4305 32.9815C50.0329 34.8946 49.2272 36.6217 48.0133 38.1631C46.4396 40.1613 44.2203 41.1596 41.3554 41.1579Z"
        fill={`url(#${rightGradId})`}
        stroke={strokeColor}
        strokeWidth="0.5"
      />
    </svg>
  );
}