import axios from "axios";

export async function getJson(json_path: string) {
  const proxyPath = json_path.replace(
    "https://gym.tangoplus.co.kr/data/Results",
    "/proxy-data"
  );
  const response = await axios.get(proxyPath);
  return response.data;
}