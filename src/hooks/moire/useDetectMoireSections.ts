import { useState, useEffect } from "react";

export interface IMoireSectionData {
  lineXPercent: number;
  lineYPercents: number[];
  labels: string[];
}
export const DUMMY_SECTION_DATA: IMoireSectionData = {
  lineXPercent: 50,
  lineYPercents: [16, 28, 40, 55], 
  labels: ["횡단면1(어깨,흉부)", "횡단면2(허리)", "횡단면3(골반)"],
};
export function useDetectMoireSections(imageUrl: string | null) {
  const [sectionData, setSectionData] = useState<IMoireSectionData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!imageUrl) return;

    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    const img = new Image();

    const isDataUrl = imageUrl.startsWith("data:");
    if (!isDataUrl) {
      img.crossOrigin = "Anonymous";
      img.src = `/api/proxy?url=${encodeURIComponent(imageUrl)}`;
    } else {
      img.src = imageUrl;
    }

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsLoading(false);
        return;
      }

      const w = img.width;
      const h = img.height;
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      let topY = -1;
      let bottomY = -1;

      // 1. 머리 끝(topY) 스캔
      for (let y = 0; y < h; y++) {
        let hasPixel = false;
        for (let x = 0; x < w; x++) {
          if (data[(y * w + x) * 4 + 3] > 10) {
            hasPixel = true;
            break;
          }
        }
        if (hasPixel) {
          topY = y;
          break;
        }
      }

      // 2. 발 끝(bottomY) 스캔
      for (let y = h - 1; y >= 0; y--) {
        let hasPixel = false;
        for (let x = 0; x < w; x++) {
          if (data[(y * w + x) * 4 + 3] > 10) {
            hasPixel = true;
            break;
          }
        }
        if (hasPixel) {
          bottomY = y;
          break;
        }
      }

      // 인식을 못 한 경우 기본값(50% 중앙) 반환
      if (topY === -1 || bottomY === -1 || bottomY <= topY) {
        if (isMounted) {
          setSectionData({
            lineXPercent: 50,
            lineYPercents: [16, 28, 40, 55],
            labels: ["목~명치 영역", "명치~배꼽 영역", "배꼽~허벅지 영역"],
          });
          setIsLoading(false);
        }
        return;
      }

      const bodyHeight = bottomY - topY;

      // 3. 발목 Y 위치 계산 (하단에서 신체 높이의 10% 위)
      const ankleY = Math.round(bottomY - bodyHeight * 0.10);

      // 4. 발목 Y 위치에서 좌/우 외곽 X 좌표 탐색
      let leftAnkleX = -1;
      let rightAnkleX = -1;

      // 왼쪽에서 오른쪽으로 스캔
      for (let x = 0; x < w; x++) {
        if (data[(ankleY * w + x) * 4 + 3] > 10) {
          leftAnkleX = x;
          break;
        }
      }

      // 오른쪽에서 왼쪽으로 스캔
      for (let x = w - 1; x >= 0; x--) {
        if (data[(ankleY * w + x) * 4 + 3] > 10) {
          rightAnkleX = x;
          break;
        }
      }

      // 발목 좌/우 중앙 X 및 % 계산
      let pX = 50; // 기본 중앙값
      if (leftAnkleX !== -1 && rightAnkleX !== -1) {
        const centerAnkleX = (leftAnkleX + rightAnkleX) / 2;
        pX = Math.round((centerAnkleX / w) * 100);
      }

      // 5. Y 구간 백분율(%) 계산
      const neckY = topY + bodyHeight * 0.14;
      const epigastriumY = topY + bodyHeight * 0.30;
      const navelY = topY + bodyHeight * 0.42;
      const thighY = topY + bodyHeight * 0.62;

      const p1 = Math.round((neckY / h) * 100);
      const p2 = Math.round((epigastriumY / h) * 100);
      const p3 = Math.round((navelY / h) * 100);
      const p4 = Math.round((thighY / h) * 100);

      if (isMounted) {
        setSectionData({
          lineXPercent: pX,
          lineYPercents: [p1, p2, p3, p4],
          labels: ["상체 상부(목~명치)", "상체 하부(명치~배꼽)", "하체 상부(배꼽~허벅지)"],
        });
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      if (isMounted) {
        setSectionData(DUMMY_SECTION_DATA);
        setIsLoading(false);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return { sectionData, isLoading };
}