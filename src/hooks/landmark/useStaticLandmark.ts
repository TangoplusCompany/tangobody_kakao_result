// hooks/usePoseCroppedImage.ts
"use client";

import { useState, useEffect } from "react";
import type { IPoseLandmark } from "../../types/landmark";
import { drawLineStepFifth, drawLineStepFirst, drawLineStepFourth, drawLineStepSecond, drawLineStepSixth, drawLineStepThird } from "../../util/drawLineStep";
import { useLoadImage } from "./useLoadImage";


/**
 * 랜드마크 별 DrawMap 생성 함수.
 * 
 * 각 부위마다 존재하는 DrawLine을 별도 함수로 관리하고 해당 함수를 값으로 가진 Map 객체 생성.
 * 
 * 이후 해당 함수를 호출하여 해당 순번에 맞는 랜드마크 그리기 함수 호출.
 */
const drawMap: Record<
  "first" | "second" | "third" | "fourth" | "fifth" | "sixth",
  (
    ctx: CanvasRenderingContext2D,
    measureJson: { pose_landmark: IPoseLandmark[] },
  ) => void
> = {
  first: drawLineStepFirst,
  second: drawLineStepSecond,
  third: drawLineStepThird,
  fourth: drawLineStepFourth,
  fifth: drawLineStepFifth,
  sixth: drawLineStepSixth,
};

/**
 * 정적 랜드마크 처리 Hooks.
 * 
 * JSON형식의 랜드마크의 데이터중 pose_landmark 키를 기반으로 랜더링 후 canvas로 그려내 새로운 ImageURL로 변환시켜 리턴.
 * @param imageUrl 이미지 URL
 * @param measureJson 랜드마크 데이터
 * @param step 랜드마크 순번
 * @returns 랜드마크 처리 결과
 */
export function useStaticLandmark(
  imageUrl: string,
  measureJson: { pose_landmark: IPoseLandmark[] },
  step: "first" | "second" | "third" | "fourth" | "fifth" | "sixth",
  cameraOrientation: 0 | 1,
  showLine: boolean = true, // 기본값 true
): {
  resultUrl: string | null;
  loading: boolean;
} {
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const loadImage = useLoadImage;

  useEffect(() => {
    if (!imageUrl) return;

    const draw = async () => {
      setLoading(true);

      try {
        const urlParts = imageUrl.split("/");
        const fileName = urlParts[urlParts.length - 1]; // "57-1810-1-1-1770620771.jpg" 만 쏙 추출

        // 💡 추출한 파일명을 로컬 프록시 경로와 깨끗하게 조립합니다.
        const proxiedUrl = `/proxy-data/${fileName}`;

        // 정돈된 주소로 이미지 로드 실행
        const image = await loadImage(proxiedUrl);

        const srcW = image.width;   // 1280
        const srcH = image.height;  // 720

        const dstW = cameraOrientation === 1 ? srcH : srcW; // 720 or 1280
        const dstH = cameraOrientation === 1 ? srcW : srcH; // 1280 or 720

        const canvas = document.createElement("canvas");
        canvas.width = dstW;
        canvas.height = dstH;
        const ctx = canvas.getContext("2d")!;

        ctx.save();
        if (cameraOrientation === 1) {
          ctx.translate(0, dstH);
          ctx.rotate(-Math.PI / 2);
        }
        ctx.drawImage(image, 0, 0, srcW, srcH);
        ctx.restore(); 

        // showLine이 true일 때만 랜드마크 그리기
        if (showLine && measureJson && measureJson.pose_landmark) {
          ctx.save();

          // 미러링 처리
          ctx.translate(dstW, 0);
          ctx.scale(-1, 1);
          
          try {
            // 💡 맵 함수를 호출하기 전에 한 번 더 예외 체크
            if (drawMap[step]) {
              drawMap[step](ctx, measureJson);
            }
          } catch (drawError) {
            console.error("선 그리기 도중 에러 발생 (drawLineStep):", drawError);
          }

          ctx.restore();
        } else if (showLine) {
          // 💡 데이터가 없는데 선을 그리라고 요청이 들어온 상황 로그 통제
        }
        
        // ✅ crop to 3:4 (정방향 기준으로 수행)
        let cropX = 0;
        let cropY = 0;
        let cropWidth = dstW;
        let cropHeight = dstH;
        const targetAspect = 3 / 4;

        if (cameraOrientation === 0) {
          // 16:9(가로) -> 3:4 만들기: 좌우 크롭 (기존)
          cropHeight = dstH;
          cropWidth = cropHeight * targetAspect;
          cropX = (dstW - cropWidth) / 2;
          cropY = 0;
        } else {
          // 9:16(세로) -> 3:4 만들기: 위아래 크롭
          cropWidth = dstW;
          cropHeight = cropWidth / targetAspect; // = dstW * 4/3
          cropX = 0;
          cropY = (dstH - cropHeight) / 2;
        }

        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;
        const croppedCtx = croppedCanvas.getContext("2d")!;
        croppedCtx.drawImage(
          canvas,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight,
        );

        const result = croppedCanvas.toDataURL("image/png");
        setResultUrl(result);
      } catch (err) {
        console.error("Image processing failed", err);
        setResultUrl(null);
      }

      setLoading(false);
    };

    draw();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, step, cameraOrientation, showLine]);

  return { resultUrl, loading };
}
