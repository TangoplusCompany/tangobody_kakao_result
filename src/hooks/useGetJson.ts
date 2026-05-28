import { useEffect, useState } from "react";
import type { IPoseLandmark } from "../types/landmark";
import { getJson } from "../services/getJson";

export const useGetJson = (jsonPath?: string) => {
  const [data, setData] = useState<{ pose_landmark: IPoseLandmark[] }>();
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
