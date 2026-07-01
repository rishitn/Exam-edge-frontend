import { api } from "./client";

// ── Student ──
export async function validateCoupon(input) {
  // input: { code, testId? | planId? }
  return (await api.post("/coupons/validate", input)).data;
}

// ── Admin / Super Admin ──
export async function getCouponStats() {
  return (await api.get("/coupons/admin/stats", { scope: "admin" })).data;
}
export async function listCoupons(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
  ).toString();
  const res = await api.get(`/coupons/admin${qs ? `?${qs}` : ""}`, { scope: "admin" });
  return { coupons: res.data, pagination: res.meta?.pagination };
}
export async function createCoupon(input) {
  return (await api.post("/coupons/admin", input, { scope: "admin" })).data;
}
export async function getCoupon(couponId) {
  return (await api.get(`/coupons/admin/${couponId}`, { scope: "admin" })).data;
}
export async function updateCoupon(couponId, input) {
  return (await api.patch(`/coupons/admin/${couponId}`, input, { scope: "admin" })).data;
}
export async function toggleCouponStatus(couponId) {
  return (await api.patch(`/coupons/admin/${couponId}/toggle-status`, {}, { scope: "admin" })).data;
}
export async function deleteCoupon(couponId) {
  return api.delete(`/coupons/admin/${couponId}`, { scope: "admin" });
}
export async function getCouponUsages(couponId, page = 1, pageSize = 20) {
  const res = await api.get(`/coupons/admin/${couponId}/usages?page=${page}&pageSize=${pageSize}`, { scope: "admin" });
  return { usages: res.data, pagination: res.meta?.pagination };
}
