import { useMutation } from "@tanstack/react-query";
import { getExerciseList } from "../services/getExerciseList";

export const useGetExerciseList = () => {
  const mutation = useMutation({
    mutationFn: getExerciseList,
  });

  const basicDetail = mutation.data ? mutation.data : undefined;

  return {
    ...mutation,
    basicDetail,
  };
};