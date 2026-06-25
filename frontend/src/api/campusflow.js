/**
 * CampusFlow API Integration Layer
 * All calls follow the standard API contracts defined in the project spec.
 * Base URL reads from environment so teammates can override for local dev.
 */

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request/Response interceptors ──────────────────────────────────────────
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ── Tasks ──────────────────────────────────────────────────────────────────
/**
 * POST /task
 * @param {{ title: string, subject: string, deadline: string }} payload
 */
export const createTask = (payload) => api.post("/task", payload);

/**
 * POST /deadline-plan
 * @param {{ title: string, deadline: string }} payload
 * @returns {{ plan: string[] }}
 */
export const getDeadlinePlan = (payload) => api.post("/deadline-plan", payload);

// ── Attendance ─────────────────────────────────────────────────────────────
/**
 * POST /attendance-risk
 * @param {{ subject: string, attendance: number }} payload
 * @returns {{ risk: string, classesNeeded: number, recommendation: string }}
 */
export const getAttendanceRisk = (payload) =>
  api.post("/attendance-risk", payload);

// ── AI Assistant ───────────────────────────────────────────────────────────
/**
 * POST /ask
 * @param {{ question: string }} payload
 * @returns AI-generated RAG answer
 */
export const askAI = (payload) => api.post("/ask", payload);

export default api;
