import { useMutation } from "@tanstack/react-query";
import { getExerciseList } from "../services/getExerciseList";

export const useGetExerciseList = () => {
  const mutation = useMutation({
    mutationFn: getExerciseList,
  });

  const exercises = mutation.data ? mutation.data : undefined;

  return {
    ...mutation,
    exercises,
  };
};