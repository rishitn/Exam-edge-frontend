// =============================================================================
// API Client
//
// Matches the backend's actual response envelope (see src/utils/response.ts
// and src/utils/errors.ts in the backend repo):
//
//   Success:   { success: true, data: T, meta?: M }
//   Error:     { success: false, error: { code, message, details? } }
//
// Two independent token pairs exist because students and admins are
// different identities in the schema (User vs Admin) with separate
// endpoints (/auth/* vs /admin/auth/*) — they are NOT interchangeable.
// =============================================================================

const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

const STUDENT_KEYS = { access: "ee_student_access", refresh: "ee_student_refresh" };
const ADMIN_KEYS   = { access: "ee_admin_access",   refresh: "ee_admin_refresh" };

function getTokens(scope) {
  const keys = scope === "admin" ? ADMIN_KEYS : STUDENT_KEYS;
  return {
    access: localStorage.getItem(keys.access),
    refresh: localStorage.getItem(keys.refresh),
  };
}

function setTokens(scope, tokens) {
  const keys = scope === "admin" ? ADMIN_KEYS : STUDENT_KEYS;
  if (tokens?.accessToken) localStorage.setItem(keys.access, tokens.accessToken);
  if (tokens?.refreshToken) localStorage.setItem(keys.refresh, tokens.refreshToken);
}

function clearTokens(scope) {
  const keys = scope === "admin" ? ADMIN_KEYS : STUDENT_KEYS;
  localStorage.removeItem(keys.access);
  localStorage.removeItem(keys.refresh);
}

export class ApiError extends Error {
  constructor(code, message, details, status) {
    super(message);
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

// Tracks an in-flight refresh so concurrent 401s don't each trigger their
// own refresh call (which would race and likely invalidate each other's
// new refresh token, since most rotate-on-use refresh strategies do).
const refreshInFlight = { student: null, admin: null };

async function doRefresh(scope) {
  const { refresh } = getTokens(scope);
  if (!refresh) throw new ApiError("UNAUTHORIZED", "Not signed in", null, 401);

  if (!refreshInFlight[scope]) {
    const path = scope === "admin" ? "/admin/auth/refresh" : "/auth/refresh";
    refreshInFlight[scope] = fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok || !body?.success) {
          clearTokens(scope);
          throw new ApiError("TOKEN_EXPIRED", "Session expired — please sign in again", null, 401);
        }
        setTokens(scope, body.data.tokens);
        return body.data.tokens;
      })
      .finally(() => {
        refreshInFlight[scope] = null;
      });
  }
  return refreshInFlight[scope];
}

/**
 * Core request function.
 * scope: "student" (default) or "admin" — picks which token pair to attach
 *        and which refresh endpoint to use on a 401.
 */
async function request(path, { method = "GET", body, scope = "student", retry = true } = {}) {
  const { access } = getTokens(scope);

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Empty body on 204 No Content (e.g. DELETE endpoints)
  if (res.status === 204) return null;

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const code = json?.error?.code || "UNKNOWN_ERROR";
    const message = json?.error?.message || `Request failed (${res.status})`;

    // Auto-refresh once on a 401 from an expired/invalid access token,
    // then retry the original request. Anything other than a token problem
    // (wrong password, forbidden role, etc.) should surface immediately —
    // retrying those would just mask the real error.
    const isTokenProblem = res.status === 401 && ["TOKEN_EXPIRED", "TOKEN_INVALID", "UNAUTHORIZED"].includes(code);
    if (isTokenProblem && retry && getTokens(scope).refresh) {
      await doRefresh(scope);
      return request(path, { method, body, scope, retry: false });
    }

    throw new ApiError(code, message, json?.error?.details, res.status);
  }

  return json; // { success, data, meta? }
}

// ─── Public helpers ───────────────────────────────────────────────────────────

export const api = {
  get:    (path, opts) => request(path, { ...opts, method: "GET" }),
  post:   (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch:  (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  put:    (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export const auth = {
  scope: { student: "student", admin: "admin" },
  setTokens,
  clearTokens,
  getTokens,
  isSignedIn(scope = "student") {
    return Boolean(getTokens(scope).access);
  },
};

export { API_URL };
