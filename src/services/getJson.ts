import axios from "axios";

export async function getJson(json_path: string) {
  // eslint-disable-next-line no-useless-assignment
  let proxyPath = json_path;

  // 1. 만약 https:// 로 시작하는 전체 URL이 들어온 경우
  if (json_path.startsWith("https://")) {
    proxyPath = json_path.replace(
      "https://gym.tangoplus.co.kr/data/Results",
      "/proxy-data"
    );
  } 
  // 2. 마지막 엔드포인트(예: "rom/data.json" 또는 "/rom/data.json")만 들어온 경우
  else {
    // 슬래시(/) 중복 방지를 처리하며 프록시 경로와 결합
    const cleanPath = json_path.startsWith("/") ? json_path : `/${json_path}`;
    proxyPath = `/proxy-data${cleanPath}`;
  }

  const response = await axios.get(proxyPath);
  return response.data;
}