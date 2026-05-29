export interface IPoseLandmark {
  index: number;
  isActive: boolean;
  sx: number;
  sy: number;
  wx: number;
  wy: number;
  wz: number;
}


export interface IMeasureJson {
  hand_landmark: [];
  horizontal_angle_elbow: number;
  horizontal_angle_hip: number;
  horizontal_angle_knee: number;
  horizontal_angle_mid_finger_tip: number;
  horizontal_angle_shoulder: number;
  horizontal_angle_wrist: number;
  horizontal_distance_center_left_hip: number;
  horizontal_distance_center_left_knee: number;
  horizontal_distance_center_left_toe: number;
  horizontal_distance_center_left_wrist: number;
  horizontal_distance_center_mid_finger_tip_left: number;
  horizontal_distance_center_mid_finger_tip_right: number;
  horizontal_distance_center_right_hip: number;
  horizontal_distance_center_right_knee: number;
  horizontal_distance_center_right_toe: number;
  horizontal_distance_center_right_wrist: number;
  horizontal_distance_elbow: number;
  horizontal_distance_hip: number;
  horizontal_distance_knee: number;
  horizontal_distance_mid_finger_tip: number;
  horizontal_distance_shoulder: number;
  horizontal_distance_wrist: number;
  time: number;
  vertical_angle_ankle_toe_left: number;
  vertical_angle_ankle_toe_right: number;
  vertical_angle_elbow_shoulder_left: number;
  vertical_angle_elbow_shoulder_right: number;
  vertical_angle_hip_knee_left: number;
  vertical_angle_hip_knee_right: number;
  vertical_angle_hip_knee_toe_left: number;
  vertical_angle_hip_knee_toe_right: number;
  vertical_angle_knee_ankle_toe_left: number;
  vertical_angle_knee_ankle_toe_right: number;
  vertical_angle_knee_toe_left: number;
  vertical_angle_knee_toe_right: number;
  vertical_angle_wrist_elbow_left: number;
  vertical_angle_wrist_elbow_right: number;
  vertical_angle_wrist_elbow_shoulder_left: number;
  vertical_angle_wrist_elbow_shoulder_right: number;
  pose_landmark: IPoseLandmark[];
}
