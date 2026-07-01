import { api } from "./client";

// Matches src/modules/questions/question.routes.ts — admin scope.

export async function getSubjects(exam) {
  const qs = exam ? `?exam=${exam}` : "";
  return (await api.get(`/admin/questions/subjects${qs}`, { scope: "admin" })).data.subjects;
}

export async function getChapters(subjectId) {
  return (await api.get(`/admin/questions/subjects/${subjectId}/chapters`, { scope: "admin" })).data.chapters;
}

export async function getTopics(chapterId) {
  return (await api.get(`/admin/questions/chapters/${chapterId}/topics`, { scope: "admin" })).data.topics;
}

export async function getQuestionStats(exam) {
  const qs = exam ? `?exam=${exam}` : "";
  return (await api.get(`/admin/questions/stats${qs}`, { scope: "admin" })).data.stats;
}

export async function listQuestions(params = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
  ).toString();
  const res = await api.get(`/admin/questions${qs ? `?${qs}` : ""}`, { scope: "admin" });
  return { questions: res.data, pagination: res.meta?.pagination };
}

export async function createQuestion(input) {
  return (await api.post("/admin/questions", input, { scope: "admin" })).data.question;
}

export async function getQuestion(id) {
  return (await api.get(`/admin/questions/${id}`, { scope: "admin" })).data.question;
}

export async function updateQuestion(id, input) {
  return (await api.patch(`/admin/questions/${id}`, input, { scope: "admin" })).data.question;
}

export async function deleteQuestion(id) {
  return (await api.delete(`/admin/questions/${id}`, { scope: "admin" })).data;
}

export async function bulkDeleteQuestions(questionIds) {
  return (await api.post("/admin/questions/bulk-delete", { questionIds }, { scope: "admin" })).data;
}

export async function verifyQuestion(id, isVerified) {
  return (await api.patch(`/admin/questions/${id}/verify`, { isVerified }, { scope: "admin" })).data;
}

// File uploads (image, bulk-upload template, bulk-upload) use multipart
// form data, not JSON — they bypass the shared `api` client and call
// fetch directly with the right auth header instead.

import { auth, API_URL } from "./client";

function authHeader() {
  const { access } = auth.getTokens("admin");
  return access ? { Authorization: `Bearer ${access}` } : {};
}

export async function uploadQuestionImage(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/admin/questions/upload-image`, {
    method: "POST",
    headers: authHeader(),
    body: form,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json?.error?.message || "Upload failed");
  return json.data;
}

export async function downloadBulkUploadTemplate() {
  const res = await fetch(`${API_URL}/admin/questions/bulk-upload/template`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to download template");
  return res.blob();
}

export async function bulkUploadQuestions(file, exam) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/admin/questions/bulk-upload?exam=${exam}`, {
    method: "POST",
    headers: authHeader(),
    body: form,
  });
  const json = await res.json();
  if (!res.ok && res.status !== 422) throw new Error(json?.error?.message || "Bulk upload failed");
  return json.data; // includes partial success info even on 422
}

export async function getBulkUploadStatus(id) {
  return (await api.get(`/admin/questions/bulk-upload/${id}`, { scope: "admin" })).data.upload;
}

export async function listBulkUploads() {
  return (await api.get("/admin/questions/bulk-uploads", { scope: "admin" })).data.uploads;
}
