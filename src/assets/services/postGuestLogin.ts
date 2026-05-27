import axios from "axios";
import type { IReportDetail } from "../types/basic";

export const postGuestLogin = async ({ mobile, encryptedData }: { mobile: string; encryptedData: string }): Promise<IReportDetail> => {
  const { data } = await axios.post(`/kakako-results`, {
    mobile: mobile,
    t_r: encryptedData
  });

  return data.data;
};