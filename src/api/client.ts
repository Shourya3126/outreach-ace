import axios from "axios";
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  BatchRequest,
  BatchResult,
  HealthResponse,
  KnowledgeProspect,
} from "@/types";

function getBaseUrl(): string {
  const stored = localStorage.getItem("outreachai_settings");
  if (stored) {
    try {
      const settings = JSON.parse(stored);
      if (settings.apiUrl) return settings.apiUrl;
    } catch {}
  }
  return import.meta.env.VITE_API_URL || "http://localhost:8000";
}

const api = axios.create({ timeout: 120000 });

api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});

export const checkHealth = () => api.get<HealthResponse>("/health");

export const analyzeProfile = (data: AnalyzeRequest) =>
  api.post<AnalyzeResponse>("/api/analyze", data);

export const batchProcess = (data: BatchRequest) =>
  api.post<BatchResult[]>("/api/batch", data);

export const getKnowledge = () =>
  api.get<KnowledgeProspect[]>("/api/knowledge");

export const saveKnowledge = (prospect: Omit<KnowledgeProspect, "id">) =>
  api.post<KnowledgeProspect>("/api/knowledge", prospect);

export const deleteKnowledge = (id: string) =>
  api.delete(`/api/knowledge/${id}`);

export default api;
