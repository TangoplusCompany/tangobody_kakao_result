import type { I2DPoseLandmark } from "@/types/landmark";

export const mid2DPoint = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
  sx: (a.x + b.x) / 2,
  sy: (a.y + b.y) / 2,
});


export const drawLine = (
  ctx: CanvasRenderingContext2D,
  lm: I2DPoseLandmark[],
  a: number,
  b: number,
  toScreen: (sx: number, sy: number) => { x: number; y: number },
  extendAx: number = 0,
  extendAy: number = 0,
  extendBx: number = 0,
  extendBy: number = 0
) => {
  const A = lm[a];
  const B = lm[b];
  if (!A || !B) return;

  const p1 = toScreen(A.x + extendAx, A.y + extendAy);
  const p2 = toScreen(B.x + extendBx, B.y + extendBy);

  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
};

export const drawSkeleton = (
  ctxW: CanvasRenderingContext2D,
  ctxR: CanvasRenderingContext2D,
  lm: I2DPoseLandmark[],
  toScreen: (sx: number, sy: number) => { x: number; y: number },
  romType ?: number
) => {
  // white skeleton
  ctxW.strokeStyle = "#FFF";
  ctxW.lineWidth = 1;

  if (romType) {
    switch (romType) {
      case 13:
      case 14: {
        drawLine(ctxW, lm, 7, 8, toScreen);
        break;
      }
      case 15: {
        drawLine(ctxW, lm, 11, 13, toScreen);
        drawLine(ctxW, lm, 13, 15, toScreen);
        break;
      }
      case 16: {
        drawLine(ctxW, lm, 12, 14, toScreen);
        drawLine(ctxW, lm, 14, 16, toScreen);
        break;
      }
      case 17:
      case 18: {
        drawLine(ctxW, lm, 7, 8, toScreen);
        drawLine(ctxW, lm, 11, 12, toScreen);
        drawLine(ctxW, lm, 23, 24, toScreen);
        break;
      }
      case 19: {
        drawLine(ctxW, lm, 23, 25, toScreen);
        drawLine(ctxW, lm, 25, 27, toScreen);
        break;
      }
      case 20: {
        drawLine(ctxW, lm, 24, 26, toScreen);
        drawLine(ctxW, lm, 26, 28, toScreen);
        break;
      }
      case 21:
      case 22: {
        drawLine(ctxW, lm, 11, 7, toScreen);
        break;
      }  
      case 23: 
      case 24: 
      case 25: 
      case 26: 
      case 27: {
        drawLine(ctxW, lm, 11, 13, toScreen);
        drawLine(ctxW, lm, 13, 15, toScreen);
        break;
      } 
      case 28: {
        drawLine(ctxW, lm, 11, 13, toScreen);
        drawLine(ctxW, lm, 13, 15, toScreen);
        drawLine(ctxW, lm, 11, 23, toScreen);
        drawLine(ctxW, lm, 23, 25, toScreen);
        drawLine(ctxW, lm, 25, 27, toScreen);
        break;
      }
      case 29: {
        drawLine(ctxW, lm, 12, 14, toScreen);
        drawLine(ctxW, lm, 14, 16, toScreen);
        drawLine(ctxW, lm, 12, 24, toScreen);
        drawLine(ctxW, lm, 24, 26, toScreen);
        drawLine(ctxW, lm, 26, 28, toScreen);
        break;
      }
      case 30: 
      case 31:
      case 32: {
        drawLine(ctxW, lm, 23, 25, toScreen);
        drawLine(ctxW, lm, 25, 27, toScreen);
        break;
      }
      case 33:
      case 34: {
        drawLine(ctxW, lm, 25, 27, toScreen);
        drawLine(ctxW, lm, 27, 31, toScreen);
        break;
      }

      case 35:
      case 36: {
        drawLine(ctxW, lm, 8, 12, toScreen);
        break;
      }  
      case 37: 
      case 38: 
      case 39: 
      case 40: 
      case 41: {
        drawLine(ctxW, lm, 12, 14, toScreen);
        drawLine(ctxW, lm, 14, 16, toScreen);
        break;
      } 
      case 42:
      case 43: {
        drawLine(ctxW, lm, 12, 14, toScreen);
        drawLine(ctxW, lm, 14, 16, toScreen);
        drawLine(ctxW, lm, 12, 24, toScreen);
        drawLine(ctxW, lm, 24, 26, toScreen);
        drawLine(ctxW, lm, 26, 28, toScreen);
        break;
      }
      case 44: 
      case 45: 
      case 46: {
        drawLine(ctxW, lm, 24, 26, toScreen);
        drawLine(ctxW, lm, 26, 28, toScreen);
        break;
      }
      case 47: 
      case 48: {
        drawLine(ctxW, lm, 26, 28, toScreen);
        drawLine(ctxW, lm, 28, 32, toScreen);
        break;
      }
    }
  } else {
    // Head
  drawLine(ctxW, lm, 7, 8, toScreen);

  // Right arm
  drawLine(ctxW, lm, 16, 18, toScreen);
  drawLine(ctxW, lm, 16, 20, toScreen);
  drawLine(ctxW, lm, 16, 22, toScreen);

  // Left arm
  drawLine(ctxW, lm, 15, 19, toScreen);
  drawLine(ctxW, lm, 15, 21, toScreen);
  drawLine(ctxW, lm, 15, 17, toScreen);

  // Torso/hip box
  drawLine(ctxW, lm, 11, 23, toScreen);
  drawLine(ctxW, lm, 23, 24, toScreen);
  drawLine(ctxW, lm, 24, 12, toScreen);
  drawLine(ctxW, lm, 12, 11, toScreen);

  // Arms
  drawLine(ctxW, lm, 11, 13, toScreen);
  drawLine(ctxW, lm, 13, 15, toScreen);
  drawLine(ctxW, lm, 12, 14, toScreen);
  drawLine(ctxW, lm, 14, 16, toScreen);

  // Legs
  drawLine(ctxW, lm, 23, 25, toScreen);
  drawLine(ctxW, lm, 25, 27, toScreen);
  drawLine(ctxW, lm, 27, 31, toScreen);
  drawLine(ctxW, lm, 27, 29, toScreen);
  drawLine(ctxW, lm, 24, 26, toScreen);
  drawLine(ctxW, lm, 26, 28, toScreen);
  drawLine(ctxW, lm, 28, 30, toScreen);
  drawLine(ctxW, lm, 28, 32, toScreen);
  // red lines
  ctxR.strokeStyle = "#FF0000";
  ctxR.lineWidth = 1;
  drawLine(ctxR, lm, 20, 19, toScreen, -100, 0, 100, 0);
  drawLine(ctxR, lm, 23, 24, toScreen);
  drawLine(ctxR, lm, 25, 26, toScreen);
  }
  
};

export const isNearStart = (v: HTMLVideoElement, eps = 0.05) => v.currentTime <= eps;
export const isNearEnd = (v: HTMLVideoElement, eps = 0.08) => v.duration > 0 && v.currentTime >= v.duration - eps;
