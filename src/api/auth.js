import { api, auth } from "./client";

// Matches src/modules/auth/auth.routes.ts exactly:
//   POST /auth/register   { name, email, password, targetExams? }
//   POST /auth/login      { email, password }
//   POST /auth/otp/send   { mobile, purpose }
//   POST /auth/otp/verify { mobile, otp, purpose, name? }
//   POST /auth/logout
//   GET  /auth/me

export async function register({ name, email, password, targetExams }) {
  const res = await api.post("/auth/register", { name, email, password, targetExams });
  auth.setTokens("student", res.data.tokens);
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  auth.setTokens("student", res.data.tokens);
  return res.data;
}

export async function sendOtp({ mobile, purpose = "LOGIN" }) {
  const res = await api.post("/auth/otp/send", { mobile, purpose });
  return res.data;
}

export async function verifyOtp({ mobile, otp, purpose = "LOGIN", name }) {
  const res = await api.post("/auth/otp/verify", { mobile, otp, purpose, name });
  auth.setTokens("student", res.data.tokens);
  return res.data;
}

export async function logout() {
  const { refresh } = auth.getTokens("student");
  try {
    await api.post("/auth/logout", { refreshToken: refresh }, { scope: "student" });
  } finally {
    auth.clearTokens("student");
  }
}

export async function me() {
  const res = await api.get("/auth/me", { scope: "student" });
  return res.data.user;
}
