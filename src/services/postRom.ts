import axios from "axios";
import type { IRomDetail } from "../types/rom";

export const postROMData = async (encryptedData: string): Promise<IRomDetail[]> => {
  const { data } = await axios.post(`/admin_api/rom-report`, { 
    t_r: encryptedData 
  });
  
  return data.data;
};