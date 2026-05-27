import { useMutation } from "@tanstack/react-query";
import { getPartResult } from "../services/getPartResult";

export const useGetPartResult = <T, >() => {
  const mutation = useMutation<
  T,
  Error,
  {seq: 'front' | 'side' | 'back' | 'squart'; t_r:string }>
  ({
    mutationFn: getPartResult,
  });

  // 단일 IReportDetail 객체로 취급 (필요 시 변환 함수 적용)
  const basicDetail = mutation.data ? mutation.data : undefined;

  return {
    ...mutation,
    basicDetail,
  };
};