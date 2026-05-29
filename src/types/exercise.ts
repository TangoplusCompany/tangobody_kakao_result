

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
  exercise_type_id: number;
  exercise_typte_name: string;
  exercise_category_id: number;
  exercise_category_name: number;
  related_joint: string;
  related_muscle: string;
  related_symptom: string;
  exercise_stage: string;
  exercise_frequency: string;
  exercise_intensity: string;
  exercise_initial_posture: string;
  exercise_method: string;
  exercise_caution: string;
  video_filepath: string;
  image_filepath: string;
}

export interface IExerciseDetail {
  exercise_program: IProgram[],
  risk_part: IRiskPart,
}

export interface IRiskPart {
  risk_part: number[]; 
}
