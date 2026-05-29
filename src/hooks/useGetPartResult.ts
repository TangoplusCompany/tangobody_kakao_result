import { useMutation } from "@tanstack/react-query";
import { getPartResult } from "../services/getPartResult";

export const useGetPartResult = <T, >() => {
  const mutation = useMutation<
  T,
  Error,
  {seq: 'front' | 'side' | 'back' | 'squat'; t_r:string }>
  ({
    mutationFn: getPartResult,
  });

  const basicDetail = mutation.data ? mutation.data : undefined;

  return {
    ...mutation,
    basicDetail,
    isPending: mutation.isPending || mutation.isIdle, // isIdle 추가
  };
};