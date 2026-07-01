import { api } from "./client";

// Matches src/modules/analytics/analytics.routes.ts

// ── Student ──
export async function getStudentDashboard() {
  return (await api.get("/analytics/dashboard")).data;
}
export async function getExamPercentile(exam) {
  return (await api.get(`/analytics/exam?exam=${exam}`)).data;
}
export async function getLeaderboard(testId, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return (await api.get(`/analytics/leaderboard/${testId}${qs ? `?${qs}` : ""}`)).data;
}
export async function getMyRank(testId) {
  return (await api.get(`/analytics/leaderboard/${testId}/me`)).data;
}
export async function getChapterBreakdown(attemptId) {
  return (await api.get(`/analytics/attempts/${attemptId}/chapters`)).data;
}

// ── Admin ──
export async function getTestAnalytics(testId) {
  return (await api.get(`/analytics/admin/tests/${testId}`, { scope: "admin" })).data;
}
export async function getQuestionBankAnalytics(exam) {
  const qs = exam ? `?exam=${exam}` : "";
  return (await api.get(`/analytics/admin/questions${qs}`, { scope: "admin" })).data;
}
export async function getCouponAnalytics() {
  return (await api.get("/analytics/admin/coupons", { scope: "admin" })).data;
}

// ── Super Admin ──
export async function getPlatformAnalytics(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return (await api.get(`/analytics/superadmin/platform${qs ? `?${qs}` : ""}`, { scope: "admin" })).data;
}
export async function getRevenueAnalytics(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return (await api.get(`/analytics/superadmin/revenue${qs ? `?${qs}` : ""}`, { scope: "admin" })).data;
}
