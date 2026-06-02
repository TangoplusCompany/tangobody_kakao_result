import axios from "axios";
import type { IBiaData } from "../types/bia";


export const postBiaData = async (encryptedData: string): Promise<IBiaData> => {
  // BASE_URL을 무시하고 vercel.json에 설정한 source 경로를 직접 입력
  const { data } = await axios.post(`/admin_api/bia-report`, { 
    t_r: encryptedData 
  });
  
  return data.data;
};