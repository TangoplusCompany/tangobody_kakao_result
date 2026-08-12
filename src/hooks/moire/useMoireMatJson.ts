// hooks/useMeasureJson.ts
"use client";

import { useEffect, useState } from "react";
import type { IMoireMatJson } from "../../types/moire";
import { getJson } from "@/services/getJson";

/**
 * 동적 JSON 로딩 Hooks
 * @param jsonPath 측정 JSON 경로
 * @returns 측정 JSON 데이터, 로딩중, 에러상태
 */
export const useMeasureMoireMatJson = (jsonPath?: string) => {
  const [data, setData] = useState<IMoireMatJson>();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!jsonPath) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getJson(jsonPath);
        setData(res);
      } catch (err) {
        setError(err as Error);
        console.error("측정 JSON 로딩 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [jsonPath]);

  return { data, isLoading, isError };
};
