import axios from "axios"

export const getExerciseDetail = async ({exercise_sn, t_r}: {exercise_sn: number, t_r : string}) => {

  const { data } = await axios.get(`/exercises/${exercise_sn}?t_r=${t_r}`)
  return data.data;
}