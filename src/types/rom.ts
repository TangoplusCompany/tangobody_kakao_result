export interface IRomPair {
  left: IRomDetail;
  right?: IRomDetail;
}


export interface IRomCard extends IRomRange {
  score: number;
  description: string;
  value_1_min: number;
  value_1_max: number;
  value_2_min: number;
  value_2_max: number;
}

export interface IRomRange {
  normal_bad: number;
  normal_warning: number;
  normal_normal: number;
  max_value: number;
}

export interface IRomGraph {
  values : number[];
  values2 : number[];
}

export interface IRomHistory {
  history_by_measure_type: Record<string, number>;
}

export interface IRomDetail extends IRomCard, IRomHistory {
  sn: number;
  measure_sn: number;
  user_sn: number;
  user_name: string;
  gender: string; 
  measure_seq: number;
  measure_type: number;
  reg_date: string;
  measure_overlay_scale_factor_x: number;
  measure_overlay_scale_factor_y: number;
  measure_server_file_name: string;
  measure_server_json_name: string;
  measure_server_mat_json_name: string;
  measure_server_data_json_name: string;
  result_index: number;
  title: string;
  howto: string;
}


export type titles = 
  '[정면] 목 가쪽 굽힘 검사 - 왼쪽' |
  '[정면] 목 가쪽 굽힘 검사 - 오른쪽' |
  '[측면] 목 굽힘 검사' | 
  '[측면] 목 폄 검사' | 
  '[정면] 어깨 벌림 검사 - 왼쪽' | 
  '[정면] 어깨 벌림 검사 - 오른쪽' | 
  '[왼측면] 어깨 굽힘 검사' | 
  '[오른측면] 어깨 굽힘 검사' | 
  '[왼측면] 어깨 폄검사' | 
  '[오른측면] 어깨 폄검사' | 
  '[왼측면] 어깨 가쪽 돌림 검사' | 
  '[오른측면] 어깨 가쪽 돌림 검사' | 
  '[왼측면] 어깨 안쪽 돌림 검사' | 
  '[오른측면] 어깨 안쪽 돌림 검사' | 
  '[왼측면] 팔꿉 관절 굽힘 검사' | 
  '[오른측면] 팔꿉 관절 굽힘 검사' | 
  '[정면] 몸통 왼쪽 가쪽 굽힘' | 
  '[정면] 몸통 오른쪽 가쪽 굽힘' | 
  '[측면] 몸통 굽힘 검사' | 
  '[측면] 몸통 폄 검사' | 
  '[정면] 왼쪽 엉덩관절 벌림 검사' | 
  '[정면] 오른쪽 엉덩관절 벌림 검사' | 
  '[왼측면] 엉덩관절 굽힘 검사' | 
  '[오른측면] 엉덩관절 굽힘 검사' | 
  '[왼측면] 엉덩관절 폄검사' | 
  '[오른측면] 엉덩관절 폄검사' |

    
  '[왼측면] 무릎관절 굽힘 검사' |
  '[오른측면] 무릎관절 굽힘 검사' |
  '[왼측면] 왼쪽 발등 굽힘 검사' |
  '[왼측면] 왼쪽 발바닥 굽힘 검사' |
  '[오른측면] 왼쪽 발등 굽힘 검사' |
  '[오른측면] 왼쪽 발바닥 굽힘 검사';
  