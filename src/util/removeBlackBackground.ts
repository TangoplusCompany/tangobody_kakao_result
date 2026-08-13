export async function removeBlackBackground(originalUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // 💡 기존 도메인 주소를 vite.config.ts에 잡혀있는 프록시 경로(/proxy-data)로 변경합니다.
    // originalUrl이 "https://gym.tangoplus.co.kr/data/Results/abc.png" 형태로 온다면
    // 그 앞 도메인+경로 부분을 "/proxy-data"로 쏙 바꿔줍니다.
    const proxiedUrl = originalUrl.replace(
      "https://gym.tangoplus.co.kr/data/Results", 
      "/proxy-data"
    );

    img.crossOrigin = "anonymous"; // CORS 차단 방지를 위해 설정
    img.src = proxiedUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 💡 성능 최적화: 루프를 하나로 합쳐서 한 번에 연산합니다.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // 1. RGB 거리 기준 1차 검증
        const distToBlack = Math.sqrt(r * r + g * g + b * b);
        const HARD = 50;
        const SOFT = 200;

        if (distToBlack <= HARD) {
          data[i + 3] = 0;
          continue;
        } else if (distToBlack < SOFT) {
          const t = (distToBlack - HARD) / (SOFT - HARD);
          data[i + 3] = a * t;
        }

        // 2. 밝기(Luminance) 기준 2차 검증
        const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const BG = 35;
        const EDGE = 60;

        if (L <= BG) {
          data[i + 3] = 0;
        } else if (L < EDGE) {
          const t = (L - BG) / (EDGE - BG);
          data[i + 3] = data[i + 3] * t; // 기존 알파값에 누적 페더링
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
}



export async function preprocessTrajectoryImage(originalUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const proxiedUrl = originalUrl.replace(
      "https://gym.tangoplus.co.kr/data/Results", 
      "/proxy-data"
    );

    img.crossOrigin = "anonymous";
    img.src = proxiedUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const targetRed = { r: 255, g: 74, b: 74 };
      const targetBlue = { r: 91, g: 147, b: 255 };

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a === 0) continue;

        const maxVal = Math.max(r, g, b);
        const minVal = Math.min(r, g, b);
        const colorDiff = maxVal - minVal;

        // 1. 무채색(검은 배경, 회색 십자선) 및 너무 어두운 픽셀 제거
        if (colorDiff < 15 || maxVal < 30) {
          data[i + 3] = 0;
          continue;
        }

        // 2. 궤적 선 픽셀: 불투명화 및 색상 치환
        data[i + 3] = 255;

        if (r > b && r > g) {
          // 빨간색 계열
          data[i] = targetRed.r;
          data[i + 1] = targetRed.g;
          data[i + 2] = targetRed.b;
        } else {
          // 파란색/청록색 계열
          data[i] = targetBlue.r;
          data[i + 1] = targetBlue.g;
          data[i + 2] = targetBlue.b;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
}