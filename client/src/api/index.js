import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Leads
export async function getLeads() {
  const res = await api.get("/api/leads");
  return res.data.data;
}

// Callers
export async function getCallers() {
  const res = await api.get("/api/callers");
  return res.data.data;
}

export async function createCaller(payload) {
  const res = await api.post("/api/callers", payload);
  return res.data.data;
}

export async function updateCaller(id, payload) {
  const res = await api.put(`/api/callers/${id}`, payload);
  return res.data.data;
}

export async function deleteCaller(id) {
  const res = await api.delete(`/api/callers/${id}`);
  return res.data;
}

