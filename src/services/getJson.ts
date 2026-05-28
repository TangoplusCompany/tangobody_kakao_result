"use server";

import axios from "axios";


export async function getJson(json_path: string) {
  console.log(json_path)
  const response = await axios.get(json_path);
  return await response.data;
}
