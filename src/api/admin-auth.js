import { api, auth } from "./client";

// Matches src/modules/admin-auth/admin-auth.routes.ts exactly:
//   POST /admin/auth/login   { email, password }
//   POST /admin/auth/logout
//   GET  /admin/auth/me      -> { admin: { role: "ADMIN" | "SUPER_ADMIN", ... } }
//
// `role` on the returned admin object is what decides whether the user
// lands in the Admin or Super Admin shell — there is no separate
// super-admin login endpoint.

export async function adminLogin({ email, password }) {
  const res = await api.post("/admin/auth/login", { email, password }, { scope: "admin" });
  auth.setTokens("admin", res.data.tokens);
  return res.data;
}

export async function adminLogout() {
  const { refresh } = auth.getTokens("admin");
  try {
    await api.post("/admin/auth/logout", { refreshToken: refresh }, { scope: "admin" });
  } finally {
    auth.clearTokens("admin");
  }
}

export async function adminMe() {
  const res = await api.get("/admin/auth/me", { scope: "admin" });
  return res.data.admin;
}
