/* eslint-disable no-useless-assignment */
import type { IRomDetail, IRomPair } from "../types/rom";

export const transformToRomPairs = (details: IRomDetail[]): IRomPair[] => {
  const groupMap: Record<string, { left?: IRomDetail; right?: IRomDetail }> = {};

  details.forEach((item) => {
    let groupKey = item.title;
    let isLeft = true;

    // 1. [왼측면 / 오른측면] 접두사가 있는 경우 (발 포함 모든 케이스)
    // 제목 내부의 '왼쪽/오른쪽' 단어보다 접두사 [왼측면]을 최우선으로 믿습니다.
    if (item.title.startsWith("[왼측면]") || item.title.startsWith("[오른측면]")) {
      groupKey = item.title
        .replace(/^\[(왼측면|오른측면)\]\s*/, "") // 접두사 제거
        .replace(/(왼쪽|오른쪽)\s*/g, "")        // 내부의 중복된 '왼쪽/오른쪽' 제거
        .trim();
      isLeft = item.title.startsWith("[왼측면]");
    } 
    // 2. [측면] 특수 케이스: 목/몸통 (굽힘 vs 폄을 한 쌍으로)
    else if (item.title.includes("[측면]") && (item.title.includes("굽힘") || item.title.includes("폄"))) {
      groupKey = item.title.replace(/(굽힘|폄)\s*검사/, "검사").trim();
      isLeft = item.title.includes("굽힘");
    }
    // 3. [정면] 케이스
    else if (item.title.startsWith("[정면]")) {
      groupKey = item.title
        .replace(/\s*-\s*(왼쪽|오른쪽)$/, "")
        .replace(/(왼쪽|오른쪽)\s*/g, "")
        .trim();
      isLeft = item.title.includes("왼쪽");
    }
    // 4. 기타 패턴 (접두사 없이 '왼쪽/오른쪽'만 있는 경우)
    else {
      groupKey = item.title.replace(/(왼쪽|오른쪽)\s*/g, "").trim();
      isLeft = item.title.includes("왼쪽");
    }

    if (!groupMap[groupKey]) groupMap[groupKey] = {};
    
    if (isLeft) {
      groupMap[groupKey].left = item;
    } else {
      groupMap[groupKey].right = item;
    }
  });

  return Object.values(groupMap).map((curr) => {
    if (!curr.left && curr.right) return { left: curr.right };
    return { 
      left: curr.left as IRomDetail, 
      right: curr.right 
    };
  });
};