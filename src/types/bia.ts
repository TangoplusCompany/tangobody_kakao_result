export interface IBiaData extends IBiaInfo, IComposition, IMainAnalysis, IBodyPart, IRecommend, IBodyBenchmark, IBiaPreviousData, IHistoryDatas {}


export interface IPrevious {
  measure_date: string;
  measure_server_sn: number;
  weight: number;
  weight_std_min: number;
  weight_std_max: number;

  moisture_content: number;
  moisture_content_std_min: number;
  moisture_content_std_max: number;
  body_fat_mass: number;
  body_fat_mass_std_min: number;
  body_fat_mass_std_max: number;
  protein_mass: number;
  protein_mass_std_min: number;
  protein_mass_std_max: number;
  amount_of_inorganic_salt: number;
  amount_of_inorganic_salt_std_min: number;
  amount_of_inorganic_salt_std_max: number;
  skeletal_muscle_mass_index: number;

  right_hand_fat_mass: number;
  left_hand_fat_mass: number;
  trunk_fat_mass: number;
  right_foot_fat_mass: number;
  left_foot_fat_mass: number;
  
  right_hand_fat_percentage: number;
  left_hand_fat_percentage: number;
  trunk_fat_percentage: number;
  right_foot_fat_percentage: number;
  left_foot_fat_percentage: number;

  right_hand_muscle_mass: number;
  left_hand_muscle_mass: number;
  trunk_muscle_mass: number;
  right_foot_muscle_mass: number;	
  left_foot_muscle_mass: number;	
  right_hand_muscle_ratio: number;
  left_hand_muscle_ratio: number;
  trunk_muscle_ratio: number;
  right_foot_muscle_ratio: number;
  left_foot_muscle_ratio: number;
  
}

export interface IBiaPreviousData {
  most_previous_data: IPrevious
}

export interface IBiaInfo {
  user_sn: number;
  user_name: string;
  bia_version: number;
  ws_stable_weight_kg: number;
  br_input_height: number;
  br_input_age: number;
  br_input_gender: number;
  measure_date: string;
  history_data_count: number;
}

export interface IComposition {
    // 체중
  weight: number;
  weight_std_min: number;
  weight_std_max: number;

  moisture_content: number;
  moisture_content_std_min: number;
  moisture_content_std_max: number;
  body_fat_mass: number;
  body_fat_mass_std_min: number;
  body_fat_mass_std_max: number;
  protein_mass: number;
  protein_mass_std_min: number;
  protein_mass_std_max: number;
  amount_of_inorganic_salt: number;
  amount_of_inorganic_salt_std_min: number;
  amount_of_inorganic_salt_std_max: number;

  result_body_composition_description: string;
  result_body_fat_mass_grade: string;
  result_weight_grade:string;

}

export interface IHistoryDatas {
  history_data: IHistoryData[]
}

// 하단 잔디 그래프를 위해 재선언 
export interface IHistoryData {
  body_score: number;
  skeletal_muscle_mass_index: number;
  weight: number;
  skeletal_muscle_mass: number;
  lean_body_weight: number;
  measure_date: string;
}


export interface IMainAnalysis {
  result_cid_type: number;
  result_cid_comment: string;

  result_skeletal_muscle_mass_grade: number;
  result_body_fat_percentage_grade: number;
  result_extracellular_water_grade: number;
  result_basal_metabolism_kcal_grade: number;
  skeletal_muscle_mass_index: number;
  result_smi_grade: number;

  skeletal_muscle_mass: number;
  skeletal_muscle_mass_std_min: number;
  skeletal_muscle_mass_std_max: number;
  
  result_body_water_grade: number;
  result_protein_grade: number;
  result_mineral_grade: number;

  // 내장지방 위험지수
  visceral_fat_level: number;
  visceral_fat_level_std_min: number;
  visceral_fat_level_std_max: number;
  result_visceral_fat_level_grade: number;

  extracellular_water_volume: number;
  extracellular_water_volume_std_min: number;
  extracellular_water_volume_std_max: number;
  body_fat_percentage: number;
  body_fat_percentage_std_min: number;
  body_fat_percentage_std_max: number;
  basal_metabolism_kcal: number;
  basal_metabolism_kcal_std_min: number;
  basal_metabolism_kcal_std_max: number;
  bmi:number;
  bmi_std_min:number;
  bmi_std_max: number;
}

export interface IBodyPart {
  right_hand_fat_mass: number;
  left_hand_fat_mass: number;
  trunk_fat_mass: number;
  right_foot_fat_mass: number;
  left_foot_fat_mass: number;
  
  right_hand_fat_percentage: number;
  left_hand_fat_percentage: number;
  trunk_fat_percentage: number;
  right_foot_fat_percentage: number;
  left_foot_fat_percentage: number;

  right_hand_muscle_mass: number;
  left_hand_muscle_mass: number;
  trunk_muscle_mass: number;
  right_foot_muscle_mass: number;	
  left_foot_muscle_mass: number;	
  right_hand_muscle_ratio: number;
  left_hand_muscle_ratio: number;
  trunk_muscle_ratio: number;
  right_foot_muscle_ratio: number;
  left_foot_muscle_ratio: number;

  fat_std_right_hand: number;
  fat_std_left_hand: number;
  fat_std_trunk: number;
  fat_std_right_foot: number;
  fat_std_left_foot: number;
  muscle_std_right_hand: number;
  muscle_std_left_hand: number;
  muscle_std_trunk: number;
  muscle_std_right_foot: number;
  muscle_std_left_foot: number;

}

export interface IRecommend {
  exer_kcal_walk: number;
  exer_kcal_golf: number;
  exer_kcal_croquet: number;
  exer_kcal_tennis_cycling_basketball: number;
  exer_kcal_squash_bouncyball_taekwondo_fencing: number;
  exer_kcal_climb_mountains: number;
  exer_kcal_swimming_aerobics_jogging_football_skippingrope: number;
  exer_kcal_badminton_tabletennis: number;

  result_nutrition_title: string;
  result_nutrition_description: string;
  result_nutrition_grade: number;
  result_exercise_title: string;
  result_exercise_description: string;
  result_exercise_grade: number;
  result_habits_title: string;
  result_habits_description: string;
  result_habits_grade: number;

}
// 주요 건강 지표 + 바디타입 세부 분석
export interface IBodyBenchmark {
  body_score: number;
  physical_age: number;
  body_type	: number;
  result_body_type_description: string;
  recommended_intake_kcal: number;
  ideal_weight: number;
  target_weight: number;
  weight_control: number;
  muscle_control: number;
  fat_control_amount: number;

  
  // 제지방
  lean_body_weight: number;
  lean_body_weight_std_min: number;
  lean_body_weight_std_max: number;
  // 근육량
  muscle_mass: number;
  muscle_mass_std_min: number;
  muscle_mass_std_max: number;
  // 골량
  bone_mass: number;
  bone_mass_std_min: number;
  bone_mass_std_max: number;
  // 세포질량
  body_cell_mass: number;
  body_cell_mass_std_min: number;
  body_cell_mass_std_max: number;
  subcutaneous_fat_mass: number;
  
  // 복부/내장지방 관련
  waist_to_hip_ratio: number;
  waist_to_hip_ratio_std_min: number;
  waist_to_hip_ratio_std_max: number;
  // 세포내수분비
  intracellular_water_volume: number;
  intracellular_water_volume_std_min: number;
  intracellular_water_volume_std_max: number;
  // 표준 체중 대비 체중 비율 
  obesity_percentage: number;
  obesity_percentage_std_min: number;
  obesity_percentage_std_max: number;
  // 피하지방
  subcutaneous_fat_rate: number;
  subcutaneous_fat_rate_std_min: number;
  subcutaneous_fat_rate_std_max: number;
  

}
