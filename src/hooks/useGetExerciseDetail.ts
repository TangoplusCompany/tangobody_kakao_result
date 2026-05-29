import { useMutation } from "@tanstack/react-query";
import { getExerciseDetail } from "../services/getExerciseDetail";

export const useGetExerciseDetail = () => {
  const mutation = useMutation({
    mutationFn: getExerciseDetail,
  });

  const basicDetail = mutation.data ? mutation.data : undefined;

  return {
    ...mutation,
    basicDetail,
    isPending: mutation.isPending || mutation.isIdle, // isIdle 추가
  };
};