export interface IMoireDetail {
  front : IMoireSeq
  back : IMoireSeq
}
export interface IMoireSeq {
  sn : number;
  local_sn: number;
  device_sn: number;
  measure_sn	: number;
  measure_server_sn: number;
  user_uuid	 : string;
  user_sn: number;
  user_name : string;
  measure_date : string;
  measure_seq: number;
  measure_type: number;
  measure_photo_file_name: string;
  measure_overlay_width : number;
  measure_overlay_height: number;
  measure_overlay_scale_factor_x: number;
  measure_overlay_scale_factor_y: number;
  server_file_name : string;
  server_file_name_moire: string;
  server_file_name_moire_json: string;
  server_file_name_mat: string;
  server_file_name_mat_json: string;
  shoulder_left_peak_depth: number;
  shoulder_left_peak_index: number;
  shoulder_left_peak_x: number;
  shoulder_left_peak_y: number;
  shoulder_left_sx: number;
  shoulder_left_sy: number;
  shoulder_right_peak_depth: number;
  shoulder_right_peak_index: number;
  shoulder_right_peak_x: number;
  shoulder_right_peak_y: number;
  shoulder_right_sx: number;
  shoulder_right_sy: number;
  shoulder_peak_diff: number;
  shoulder_left_depth: number;
  shoulder_right_depth: number;
  shoulder_landmark_diff: number;
  waist_left_peak_depth: number;
  waist_left_peak_index: number;
  waist_left_peak_x: number;
  waist_left_peak_y: number;
  waist_left_sx: number;
  waist_left_sy: number;
  waist_right_peak_depth: number;
  waist_right_peak_index: number;
  waist_right_peak_x: number;
  waist_right_peak_y: number;
  waist_right_sx: number;
  waist_right_sy: number;
  waist_peak_diff: number;
  waist_left_depth: number;
  waist_right_depth: number;
  waist_landmark_diff: number;
  hip_left_peak_depth: number;
  hip_left_peak_index: number;
  hip_left_peak_x: number;
  hip_left_peak_y: number;
  hip_left_sx: number;
  hip_left_sy: number;
  hip_right_peak_depth: number;
  hip_right_peak_index: number;
  hip_right_peak_x: number;
  hip_right_peak_y: number;
  hip_right_sx: number;
  hip_right_sy: number;
  hip_peak_diff: number;
  hip_left_depth: number;
  hip_right_depth: number;
  hip_landmark_diff: number;
}

export interface IMoireMeasureJson {
  ProfileName: string;
  DepthArray: number[];
}

export interface IMoireMatJson {
  time :number; 
  angle_left_foot :number; 
  angle_right_foot :number; 
  max_pressure_foot_front_x_left :number; 
  max_pressure_foot_front_y_left :number; 
  max_pressure_foot_front_value_left :number; 
  max_pressure_foot_back_x_left :number; 
  max_pressure_foot_back_y_left :number; 
  max_pressure_foot_back_value_left :number; 
  max_pressure_foot_front_x_right :number; 
  max_pressure_foot_front_y_right :number; 
  max_pressure_foot_front_value_right :number; 
  max_pressure_foot_back_x_right :number; 
  max_pressure_foot_back_y_right :number; 
  max_pressure_foot_back_value_right :number; 
  battery_pct :number; 
  cop_left_x :number; 
  cop_left_y :number; 
  cop_right_x :number; 
  cop_right_y :number; 
  cop_combine_x :number; 
  cop_combine_y :number; 
  left_weight_pct :number; 
  right_weight_pct :number; 
  fore_weight_pct :number; 
  heel_weight_pct :number; 
  left_top_weight_pct :number; 
  right_top_weight_pct :number; 
  left_bottom_weight_pct :number; 
  right_bottom_weight_pct :number; 
}
