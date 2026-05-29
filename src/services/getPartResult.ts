import axios from "axios";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const getPartResult = async <T,>({ seq, t_r }: { seq: 'front' | 'side' | 'back' | 'squat'; t_r: string }): Promise<T> => {
  const { data } = await axios.get<ApiResponse<T>>(`admin_api/kakao-results/${seq}?t_r=${t_r}`);
  console.log(data)
  console.log(data.data)
  return data.data;
};