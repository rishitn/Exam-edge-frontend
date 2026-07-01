import { api } from "./client";

// Matches src/modules/tests/test.routes.ts — admin scope throughout.

export async function listTests(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
  ).toString();
  const res = await api.get(`/admin/tests${qs ? `?${qs}` : ""}`, { scope: "admin" });
  return { tests: res.data, pagination: res.meta?.pagination };
}

export async function createTest(input) {
  return (await api.post("/admin/tests", input, { scope: "admin" })).data;
}

export async function getTest(testId) {
  return (await api.get(`/admin/tests/${testId}`, { scope: "admin" })).data;
}

export async function updateTest(testId, input) {
  return (await api.patch(`/admin/tests/${testId}`, input, { scope: "admin" })).data;
}

export async function deleteTest(testId) {
  return api.delete(`/admin/tests/${testId}`, { scope: "admin" });
}

export async function publishTest(testId) {
  return (await api.post(`/admin/tests/${testId}/publish`, {}, { scope: "admin" })).data;
}

export async function unpublishTest(testId) {
  return (await api.post(`/admin/tests/${testId}/unpublish`, {}, { scope: "admin" })).data;
}

export async function createSection(testId, input) {
  return (await api.post(`/admin/tests/${testId}/sections`, input, { scope: "admin" })).data;
}

export async function updateSection(testId, sectionId, input) {
  return (await api.patch(`/admin/tests/${testId}/sections/${sectionId}`, input, { scope: "admin" })).data;
}

export async function deleteSection(testId, sectionId) {
  return api.delete(`/admin/tests/${testId}/sections/${sectionId}`, { scope: "admin" });
}

export async function reorderSections(testId, input) {
  return api.put(`/admin/tests/${testId}/sections/reorder`, input, { scope: "admin" });
}

export async function addQuestionsToSection(testId, sectionId, input) {
  return (await api.post(`/admin/tests/${testId}/sections/${sectionId}/questions`, input, { scope: "admin" })).data;
}

export async function removeQuestionFromSection(testId, sectionId, testQuestionId) {
  return api.delete(`/admin/tests/${testId}/sections/${sectionId}/questions/${testQuestionId}`, { scope: "admin" });
}

export async function reorderQuestions(testId, sectionId, input) {
  return api.put(`/admin/tests/${testId}/sections/${sectionId}/questions/reorder`, input, { scope: "admin" });
}
