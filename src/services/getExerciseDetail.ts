import axios from "axios"
import type { IExercise } from "../types/exercise";

export const getExerciseDetail = async ({exercise_sn, t_r}: {exercise_sn: number, t_r : string})  : Promise<IExercise> => {

  const { data } = await axios.get(`api/exercises/${exercise_sn}?t_r=${t_r}`)
  return data;
}