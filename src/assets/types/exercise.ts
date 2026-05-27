export interface IExerciseDetail {
  exercise_program: IProgram[],
  risk_part: IRiskPart[],
}

export interface IProgram {
  exercise_ids: string;
  exercise_list : IExercise[];
  exercise_program_description: string;
  exercise_program_title: string;
  exercise_stage: number;
  exercise_type_id: number;
}

export interface IExercise {
  duration: number;
  exercise_id: number;
  exercise_name: string;
  exercise_stage: string;
  image_filepath: string;
  related_symptom: string;
}

export interface IRiskPart {
  risk_part: number[];
}