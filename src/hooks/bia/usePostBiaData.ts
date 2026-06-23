import { postBiaData } from "@/services/postBiaData";
import { useMutation } from "@tanstack/react-query";

export const usePostBiaData = () => {
  const mutation = useMutation({
    mutationFn: postBiaData,
  });

  // 단일 IBiaDetail 객체로 취급 (필요 시 변환 함수 적용)
  const biaDetail = mutation.data ? mutation.data : undefined;

  return {
    ...mutation,
    biaDetail,
  };
};