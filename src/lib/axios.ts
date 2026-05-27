import axios from "axios";

/**
 * JSON 파일 전용 Axios 인스턴스
 */
export const customJsonAxios = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_FILE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
