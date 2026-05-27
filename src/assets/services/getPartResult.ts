import axios from "axios";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const getPartResult = async <T,>({ seq, t_r }: { seq: 'front' | 'side' | 'back' | 'squart'; t_r: string }): Promise<T> => {
  // ⚠️ 반드시 백틱(``)으로 감싸야 ${seq}와 ${t_r}이 변수로 변환됩니다.
  const { data } = await axios.get<ApiResponse<T>>(`/kakao-results/${seq}?t_r=${t_r}`);

  return data.data;
};