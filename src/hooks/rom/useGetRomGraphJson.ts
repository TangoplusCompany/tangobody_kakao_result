import { getJson } from "@/services/getJson";
import type { IRomGraph } from "@/types/rom";
import { useEffect, useState } from "react";

export const useGetRomGraphJson = (jsonPath?: string) => {
  const [data, setData] = useState<IRomGraph>();
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
