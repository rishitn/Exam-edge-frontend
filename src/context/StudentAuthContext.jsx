import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as AuthApi from "../api/auth";
import { auth as authStore } from "../api/client";

const StudentAuthCtx = createContext(null);

export function StudentAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!authStore.isSignedIn("student")) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await AuthApi.me();
      setUser(me);
    } catch {
      // Token invalid/expired and refresh failed — client.js already
      // cleared it; just reflect signed-out state.
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (creds) => {
    const data = await AuthApi.login(creds);
    setUser(data.user);
    return data;
  };

  const register = async (input) => {
    const data = await AuthApi.register(input);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await AuthApi.logout().catch(() => {});
    setUser(null);
  };

  return (
    <StudentAuthCtx.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </StudentAuthCtx.Provider>
  );
}

export const useStudentAuth = () => useContext(StudentAuthCtx);
