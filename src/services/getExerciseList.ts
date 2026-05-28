import axios from "axios";
import type { IExerciseDetail } from "../types/exercise";

export const getExerciseList = async (t_r: string) : Promise<IExerciseDetail> => {
  const { data } = await axios.get(`/admin_api/exercise-recommendation?t_r=${t_r}`)
  return data.data
};