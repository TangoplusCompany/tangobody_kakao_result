export interface IReportDetail {
  result_summary_data: IBasicInfo
  result_history_data: IBasicHistory
  static_mat_data: IBasicStaticMat
  dynamic_mat_data: IBasicDynamicMat
  detail_data: IBasicCards
}

export interface IBasicInfo {
  sn: number;
  measure_date: string;
  user_uuid: string;
  user_sn: number;
  user_name: string;
  gender: string;
  mobile: string,
  camera_orientation: 0 | 1;
  mat_ohs_bottom_pressure: number;
  mat_ohs_left_bottom: number;
  mat_ohs_left_pressure: number;
  mat_ohs_left_top: number;
  mat_ohs_right_bottom: number;
  mat_ohs_right_pressure: number;
  mat_ohs_right_top: number;
  mat_ohs_top_pressure: number;
  mat_static_bottom_pressure: number;
  mat_static_left_bottom : number; 
  mat_static_left_pressure: number;
  mat_static_left_top: number;
  mat_static_range_level: number;
  mat_static_right_bottom: number;
  mat_static_right_pressure: number;
  mat_static_right_top: number;
  mat_static_risk_level: number;
  mat_static_top_pressure: number;
  range_level_ankle: number;
  range_level_elbow: number;
  range_level_hip: number;
  range_level_knee: number;
  range_level_neck: number;
  range_level_shoulder: number;


  risk_level_ankle: number;
  risk_level_elbow: number;
  risk_level_hip: number;
  risk_level_knee: number;
  risk_level_neck: number;
  risk_level_shoulder: number;

  risk_lower_ment: string
  risk_lower_range_level: number;
  risk_lower_risk_level: number;
  risk_upper_ment: string;
  risk_upper_range_level: number;
  risk_upper_risk_level: number;

  risk_neck: string;
  risk_shoulder_left: string;
  risk_shoulder_right: string;
  risk_elbow_left: string;
  risk_elbow_right: string;
  risk_wrist_left: string;
  risk_wrist_right: string;
  risk_hip_left: string;
  risk_hip_right: string;
  risk_knee_left: string;
  risk_knee_right: string;
  risk_ankle_left: string;
  risk_ankle_right: string;
  risk_result_ment: string;
}

export interface IBasicStaticMat {
  mat_static_horizontal_ment: string;
  mat_static_vertical_ment: string;
  measure_server_mat_image_name: string;
  measure_server_mat_json_name: string;
}

export interface IBasicDynamicMat {
  mat_hip_down_image_name: string;
  mat_hip_trajectory_image_name: string;
  mat_left_knee_trajectory_image_name: string;
  mat_right_knee_trajectory_image_name: string;
  mat_ohs_horizontal_ment: string;
  mat_ohs_vertical_ment: string;
  mat_ohs_knee_ment: string;
}



export interface IBasicHistory {
  count : number;
  history_data: IBasicHistoryUnit[];
}
export interface IBasicHistoryUnit {
  measure_date: string;
  range_level_ankle: number;
  range_level_elbow: number;
  range_level_hip: number;
  range_level_knee: number;
  range_level_neck: number;
  range_level_shoulder: number;
  risk_level_ankle: number;
  risk_level_elbow: number;
  risk_level_hip: number;
  risk_level_knee: number;
  risk_level_neck: number;
  risk_level_shoulder: number;
}

export interface IBasicCards {
  neck: IBasicCardNeck;
  shoulder: IBasicCardShoulder;
  elbow: IBasicCardElbow;
  hip: IBasicCardHip;
  knee: IBasicCardKnee;
  ankle: IBasicCardAnkle;
}


export interface IBasicCardUnit {
  measure_type: number;
  landmark: number;
  data: number;
  risk_level: number;
  range_level: number;
  measure_unit: string;
}

export interface IBasicCardNeck {
  turtle_neck: IBasicCardUnit;
  scoliosis: IBasicCardUnit;
  side_neck_balance: IBasicCardUnit;
}

export interface IBasicCardShoulder {
  shoulder_tilit: IBasicCardUnit;
  forzen_shoulder: IBasicCardUnit;
  shoulder_impingement: IBasicCardUnit;
}

export interface IBasicCardElbow {
  bicep_tension: IBasicCardUnit;
  elbow_disorder: IBasicCardUnit;
  elbow_muscle_tension: IBasicCardUnit;
}

export interface IBasicCardHip {
  hip_tilit: IBasicCardUnit;
  hip_disorder: IBasicCardUnit;
  hip_knee_tilit: IBasicCardUnit;
}
export interface IBasicCardKnee {
  knee_angle: IBasicCardUnit;
  knee_disorder: IBasicCardUnit;
  hip_knee_ankle_tilit: IBasicCardUnit;
}
export interface IBasicCardAnkle {
  ankle_angle: IBasicCardUnit;
  left_right_balance: IBasicCardUnit;
  uppper_lower_balance: IBasicCardUnit;
}

export interface IFront {
  static_front: IStatic,
  static_elbow: IStatic,
}

export interface ISide {
  left_side: IStatic,
  right_side: IStatic,
}

export interface IBack {
  back: IStatic,
  back_sit: IStatic,
}

export interface ISquart {
  squart: IDynamic
}

export interface IDynamic  extends IBasicDynamicMat {
  mat_ohs_bottom_pressure: number;
  mat_ohs_left_bottom: number;
  mat_ohs_left_pressure: number;
  mat_ohs_left_top: number;
  mat_ohs_right_bottom: number;
  mat_ohs_right_pressure: number;
  mat_ohs_right_top: number;
  mat_ohs_top_pressure: number;
  measure_server_file_name: string;
  measure_server_json_name: string;
  measure_type: number;
  server_sn: number;
}


export interface IStatic {
  detail_data: IRawDataUnit[],
  measure_overlay_height: number;
  measure_overlay_width: number;
  measure_seq: number;
  measure_server_file_name: string;
  measure_server_json_name: string;
  measure_server_mat_image_name: string;
  measure_server_mat_json_name: string;
}

export interface IRawDataUnit {
  data: number;
  landmark: number;
  left_right: number;
  measure_type: number;
  measure_unit: string;
  ment: string;
  ment_all: string;
  range_level: string;
  risk_level: string;
}