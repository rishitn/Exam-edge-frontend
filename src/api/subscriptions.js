import { api } from "./client";

// ── Public ──
export async function listActivePlans() {
  return (await api.get("/subscriptions/plans")).data;
}
export async function getPlan(planId) {
  return (await api.get(`/subscriptions/plans/${planId}`)).data;
}

// ── Student ──
export async function getMySubscription() {
  return (await api.get("/subscriptions/me")).data.subscription;
}
export async function cancelMySubscription(input = {}) {
  return (await api.post("/subscriptions/me/cancel", input)).data;
}

// ── Admin / Super Admin ──
export async function listAllPlans() {
  return (await api.get("/subscriptions/admin/plans", { scope: "admin" })).data;
}
export async function createPlan(input) {
  return (await api.post("/subscriptions/admin/plans", input, { scope: "admin" })).data;
}
export async function updatePlan(planId, input) {
  return (await api.patch(`/subscriptions/admin/plans/${planId}`, input, { scope: "admin" })).data;
}
export async function togglePlanStatus(planId) {
  return (await api.patch(`/subscriptions/admin/plans/${planId}/toggle-status`, {}, { scope: "admin" })).data;
}
export async function listAllSubscriptions(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await api.get(`/subscriptions/admin${qs ? `?${qs}` : ""}`, { scope: "admin" });
  return { subscriptions: res.data, pagination: res.meta?.pagination };
}
export async function getSubscriptionStats() {
  return (await api.get("/subscriptions/admin/stats", { scope: "admin" })).data;
}
export async function getUserSubscription(userId) {
  return (await api.get(`/subscriptions/admin/users/${userId}`, { scope: "admin" })).data;
}
export async function grantSubscription(input) {
  return (await api.post("/subscriptions/admin/grant", input, { scope: "admin" })).data;
}
export async function revokeSubscription(userId) {
  return (await api.post(`/subscriptions/admin/users/${userId}/revoke`, {}, { scope: "admin" })).data;
}
