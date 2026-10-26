import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.phuddubase.online";
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

const defaultHeaders = {
  "Content-Type": "application/json",
};

if (API_TOKEN) {
  defaultHeaders.Authorization = `Token ${API_TOKEN}`;
}

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: defaultHeaders,
});
