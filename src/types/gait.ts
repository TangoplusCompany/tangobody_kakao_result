import type { I2DPoseLandmark, I3DPoseLandmark } from "./landmark";

// 🪷🪷🪷🪷 GAIT 🪷🪷🪷🪷
export interface IMeasureGaitResponse {
  data : IMeasureGaitDetail,
  stepData : IGaitStep[],
  strideData: IGaitStride[],
}
export interface IMeasureGaitMeta {
  sn : number;
  local_sn: number;
  device_sn: number;
  measure_sn	: number;
  measure_server_sn: number;
  user_uuid	 : string;
  user_sn: number;
  user_name : string;
  measure_date : string;
}
export interface IMeasureGaitDetail {
  gait_measure_info :IGaitInfo;
  gait_sequence_result: IGaitSeqDetail[];
  gait_step_data: IGaitStep[];
  gait_stride_data: IGaitStride[];
}
export interface IGaitInfo extends IMeasureGaitMeta {
  file_server_video_name : string;
  file_server_gait_frame_name : string;
  totalSequenceCount	: number;
  averageStepLength	: number;
  avgLeftStepLength	: number;
  avgRightStepLength: number;
  averageStrideLength	: number;
  avgLeftStrideLength	: number;
  avgRightStrideLength	: number;
  averageStepWidth	: number;
  overallGaitSpeed	: number;
  cadence: number;
  avgStancePhaseRatio	: number;
  avgSwingPhaseRatio: number;
  avgDoubleSupportRatio: number;
  averageToeClearance: number;
  avgLeftSingleSupportRatio: number;
  avgRightSingleSupportRatio: number;
  avgDoubleSupportTime: number;
  avgLeftSingleSupportTime: number;
  avgRightSingleSupportTime: number;
  avgLeftStanceRatio: number;
  avgLeftSwingRatio: number;
  avgRightStanceRatio: number;
  avgRightSwingRatio: number;
  overallDataQualityScore: number;
  avgMaxShoulderTilt	: number;
  avgMaxTrunkFlexion	: number;
  avgMaxTrunkSway	: number;
  avgMaxPevisDrop: number;
  avgArmSwingSymmetry	: number;
  avgLeftArmSwingRange	: number;
  avgRightArmSwingRange	: number;
  avgMaxLeftKneeFlexion	: number;
  avgMaxRightKneeFlexion	: number;
  avgLeftStepSpeed	: number;
  avgRightStepSpeed	: number;
  avgOverallStepSpeed	: number;
  avgLeftStrideSpeed	: number;
  avgRightStrideSpeed	: number;
  avgOverallStrideSpeed	: number;
  resultToeClearanceRisk	: number;
  resultDoubleSupportRisk	: number;
  resultSpeedRisk	: number;
  resultStepWidthRisk	: number;
  resultLeftKneeFlexionRisk	: number;
  resultRightKneeFlexionRisk	: number;
  resultKneeFlexionRisk	: number;
  resultSpeedDiffRatio	: number;
  resultFallRiskScore	: number;
  resultIsAsymmetric	: number;
  resultGaitTypeGrade	: number;
  resultGaitTypeTitle	: string;
  resultGaitPatternGrade	: number;
  resultGaitPatternTitle	: string;
  resultGaitPatternDescription	: string;
  resultGaitBalanceGrade	: number;
  resultGaitBalanceTitle	: string;
  resultGaitBalanceDescription	: string;
  resultGaitEfficiencyGrade	: number;
  resultGaitEfficiencyTitle	: string;
  resultGaitEfficiencyDescription	: string;
  resultGaitTotalCommentTitle	: string;
  resultGaitTotalCommentDescription	: string;
  resultGaitTotalCommentGrade	: number;
  resultGaitRhythmTitle	: string;
  resultGaitRhythmDescription	: string;
  resultGaitRhythmGrade	: number;
  resultFallRiskTitle	: string;
  resultFallRiskDescription	: string;
  resultFallRiskGrade	: number;
  resultRecommendCommentTitle	: string;
  resultRecommendCommentDescription	: string;
  resultRecommendCommentGrade	: number;
  resultLeftSingleSupportRisk	: number;
  resultRightSingleSupportRisk	: number;
  resultSingleRiskSupportDescription: string;
  resultDoubleSupportRiskDescription	: string;
  resultLeftStanceRisk	: number;
  resultRightStanceRisk	: number;
  resultStanceRiskDescription	: string;
  resultSymmetryRisk	: number;
  resultSymmetryDescription	: string;
  resultPhaseMaxRisk	: number;
  resultStepLengthRisk	: number;
  resultStrideLengthRisk	: number;
  resultStepLengthAsymmetry	: number;
  resultStepLenthDescirption	: string;
  ersultStrideLengthDescription: string;
}

export interface IGaitSeqDetail extends IMeasureGaitMeta {
  file_name_kinematics_frame: string;
  file_server_kinematics_frame: string;
  sequenceIndex: string;
  direction: string;
  globalStartFrameIndex: string;
  globalEndFrameIndex: string;
  validStepCount: string;
  validStrideCount: string;
  sequenceTime: string;
  gaitSpeed: string;
  cadence: string;
  doubleSupportTime: string;
  leftSingleSupportTime: string;
  rightSingleSupportTime: string;
  avgLeftStanceTime: string;
  avgLeftSwingTime: string;
  avgRightStanceTime: string;
  avgRightSwingTime: string;
  doubleSupportRatio: string;
  leftSingleSupportRatio: string;
  rightSingleSupportRatio: string;
  leftStanceRatio: string;
  leftSwingRatio: string;
  rightStanceRatio: string;
  rightSwingRatio: string;
  maxShoulderTilt: string;
  maxTrunkFlexion: string;
  maxTrunkSway: string;
  maxPelvisDrop: string;
  armSwingAsymmetry: string;
  leftArmSwingRange: string;
  rightArmSwingRange: string;
}

export interface IGaitSeqFrame {
  sequenceIndex: number;
  frameIndex: number;
  timestamp: number;
  headLateralTilt: number;
  headForwardTilt: number;
  trunkSway: number;
  trunkFlexion: number;
  shoulderTilt: number;
  leftArmAngle: number;
  rightArmAngle: number;
  pelvicDrop: number;
  leftKneeAngle: number;
  rightKneeAngle: number;
}
export interface IGaitStep extends IMeasureGaitMeta {
  sn : number;
  local_sn: number;
  device_sn: number;
  measure_sn	: number;
  measure_server_sn: number;
  user_uuid	 : string;
  user_sn: number;
  user_name : string;
  measure_date : string;
  sequenceIndex: 1 | 2;
  direction: "Towards" | "Away";
  stepIndex: 1 | 2;
  startFrameIndex: number;
  endFrameIndex: number;
  foot: "Left" | "Right";
  startTime: number;
  endTime: number;
  stepLength: number;
  stepWidth: number;
  stepTime: number;
  stepSpeed: number;
}

export interface IGaitStride extends IMeasureGaitMeta {
  sn : number;
  local_sn: number;
  device_sn: number;
  measure_sn	: number;
  measure_server_sn: number;
  user_uuid	 : string;
  user_sn: number;
  user_name : string;
  measure_date : string;
  sequenceIndex: 1 | 2;
  direction: "Towards" | "Away";
  strideIndex: number;
  startFrameIndex: number;
  endFrameIndex: number;
  foot: "Left" | "Right";
  startTime: number;
  endTime: number;
  strideLength: number;
  strideTime: number;
  stanceRatio: number;
  swingRatio: number;
  stanceTime: number;
  swingTime: number;
  maxToeClearance: number;
  strideSpeed: number;
}

export interface IGaitMeasureJson {
  landmarks: I3DPoseLandmark[];
  timestamp: number;
  screen_landmarks: I2DPoseLandmark[];
}