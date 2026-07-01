import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as AdminAuthApi from "../api/admin-auth";
import { auth as authStore } from "../api/client";

const AdminAuthCtx = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!authStore.isSignedIn("admin")) {
      setAdmin(null);
      setLoading(false);
      return;
    }
    try {
      const me = await AdminAuthApi.adminMe();
      setAdmin(me);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (creds) => {
    const data = await AdminAuthApi.adminLogin(creds);
    setAdmin(data.admin);
    return data;
  };

  const logout = async () => {
    await AdminAuthApi.adminLogout().catch(() => {});
    setAdmin(null);
  };

  // `role` comes straight from the Admin DB row — "ADMIN" | "SUPER_ADMIN".
  // This is the single source of truth for which shell/nav to render;
  // there's no separate super-admin login endpoint or token type.
  const isSuperAdmin = admin?.role === "SUPER_ADMIN";

  return (
    <AdminAuthCtx.Provider value={{ admin, loading, isSuperAdmin, login, logout, refresh }}>
      {children}
    </AdminAuthCtx.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthCtx);
