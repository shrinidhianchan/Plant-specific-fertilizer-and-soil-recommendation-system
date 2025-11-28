import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

export async function analyzeImage(file, onUploadProgress) {
  const fd = new FormData();
  fd.append("file", file);
  const resp = await api.post("/api/analyze-image", fd, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return resp.data;
}

export async function analyzeParams(payload) {
  const resp = await api.post("/api/predict-params", payload);
  return resp.data;
}
