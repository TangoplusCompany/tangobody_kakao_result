import { removeBlackBackground } from "@/util/removeBlackBackground";
import { useEffect, useState } from "react";

export interface FootStaticProps {
  fileName: string;
  matStatics: IMatStaticPressure;
}
export interface IMatStaticPressure {
  leftTopPressure: number;
  leftBottomPressure: number;
  rightTopPressure: number;
  rightBottomPressure: number;
  leftPressure: number;
  rightPressure: number;
  topPressure: number;
  bottomPressure: number;
}
const FootStatic = ({ 
    fileName,
    matStatics,
  }: FootStaticProps) => {
    // lCase 0일 때 결과요약 Intro /  1 일 떄 frontMeasurement
  // 또는 환경변수에서 가져오기
  const baseUrl = import.meta.env.VITE_PUBLIC_FILE_URL || '';
  const imageUrl = `${baseUrl}/${fileName}`;
  const [processedImageSrc, setProcessedImageSrc] = useState<string>("");
  useEffect(() => {
    removeBlackBackground(imageUrl)
      .then((result) => {
        setProcessedImageSrc(result);
      })
      .catch(() => {
        setProcessedImageSrc("/images/measure_default.png");
      });
  }, [imageUrl]);
    return (
      <div className="relative w-full h-full">
        {processedImageSrc !== "" && processedImageSrc !== null && (
          <img
            src={processedImageSrc}
            alt="정적 족압 이미지"
            className="w-full h-full p-1 rounded-md border bg-sub-200"
            onError={(e) => {
              e.currentTarget.src = "/images/measure_default.png";
            }}
          />
        )}
        <div className="absolute top-1/2 left-[40%] w-1/5 h-[1px] bg-sub300 -translate-y-1/2" />
        <div className="absolute left-1/2 top-[40%] h-1/5 w-[1px] bg-sub300 -translate-x-1/2" />

        {/* 상단 */}
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-sub200 text-sm print:text-xs font-semibold">
          {matStatics.topPressure}%
        </span>

        {/* 좌측 */}
        <span className="absolute top-1/2 left-1 -translate-y-1/2 text-sub200 text-sm print:text-xs font-semibold">
          {matStatics.leftPressure}%
        </span>

        {/* 우측 */}
        <span className="absolute top-1/2 right-1 -translate-y-1/2 text-sub200 text-sm print:text-xs font-semibold">
          {matStatics.rightPressure}%
        </span>

        {/* 하단 */}
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sub200 text-sm print:text-xs font-semibold">
          {matStatics.bottomPressure}%
        </span>
      </div>
    );
};

export default FootStatic;