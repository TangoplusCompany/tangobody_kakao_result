// hooks/useLoadImage.ts
export function useLoadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error("Image source is required"));
      return;
    }

    // 원본 외부 서버 주소를 Vite 프록시(/proxy-data) 상대 경로로 변환
    let finalSrc = src.replace(
      /^https?:\/\/gym\.tangoplus\.co\.kr\/data\/Results\/?/,
      "/proxy-data/"
    );

    // 슬래시 중복(//) 방지
    finalSrc = finalSrc.replace(/([^:]\/)\/+/g, "$1");

    const img = new Image();

    // /proxy-data 프록시 경로는 same-origin이라 crossOrigin 설정하면 안 됨
    if (!finalSrc.startsWith("data:") && !finalSrc.startsWith("/")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => resolve(img);
    img.onerror = (err) => {
      console.error("이미지 로딩 실패:", finalSrc, err);
      reject(err);
    };
    img.src = finalSrc;
  });
}