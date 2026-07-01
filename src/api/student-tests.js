import { api } from "./client";

// Matches src/modules/student-tests/student-test.routes.ts:
//   GET /tests              (?exam=&type=&search=&page=&pageSize=) — public, optional auth
//   GET /tests/my           — auth required
//   GET /tests/:testId      — public, optional auth
//   GET /tests/:testId/attempts — auth required

export async function browseTests(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
  ).toString();
  const res = await api.get(`/tests${qs ? `?${qs}` : ""}`);
  return { tests: res.data, pagination: res.meta?.pagination };
}

export async function getMyTests() {
  const res = await api.get("/tests/my");
  return res.data;
}

export async function getTestDetail(testId) {
  const res = await api.get(`/tests/${testId}`);
  return res.data;
}

export async function getTestAttemptSummary(testId) {
  const res = await api.get(`/tests/${testId}/attempts`);
  return res.data;
}
