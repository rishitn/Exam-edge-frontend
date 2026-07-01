import { api } from "./client";

// Matches src/modules/attempts/attempt.routes.ts — all routes require
// student auth. This is the live test-taking flow: every answer save and
// review toggle is its own network call so progress survives a refresh
// or dropped connection mid-test.

export async function startAttempt(testId) {
  const res = await api.post("/attempts", { testId });
  return res.data;
}

export async function saveAnswer(attemptId, input) {
  // input shape depends on question type — see attempt.schema.ts on the
  // backend for the exact union (selectedOptionIds / numericAnswer / etc.)
  const res = await api.post(`/attempts/${attemptId}/answers`, input);
  return res.data;
}

export async function toggleMarkReview(attemptId, input) {
  const res = await api.patch(`/attempts/${attemptId}/answers/review`, input);
  return res.data;
}

export async function recordTabSwitch(attemptId, input) {
  const res = await api.post(`/attempts/${attemptId}/tab-switch`, input);
  return res.data;
}

export async function submitAttempt(attemptId, input = {}) {
  const res = await api.post(`/attempts/${attemptId}/submit`, input);
  return res.data;
}

export async function getAttemptResult(attemptId) {
  const res = await api.get(`/attempts/${attemptId}/result`);
  return res.data;
}

export async function listMyAttempts() {
  const res = await api.get("/attempts/me");
  return res.data;
}
