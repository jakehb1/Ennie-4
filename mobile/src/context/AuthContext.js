import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // "patient" | "healer"

  /* ── Bootstrap: load persisted token and fetch user ── */
  useEffect(() => {
    (async () => {
      try {
        const stored = await api.getToken();
        if (stored) {
          setToken(stored);
          const me = await api.getMe();
          setUser(me.user || me);
          setRole(me.user?.role || me.role || "patient");
        }
      } catch {
        await api.clearToken();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Sign up ── */
  const signUp = useCallback(async (email, password, userRole, dob) => {
    setLoading(true);
    try {
      const data = await api.signup(email, password, userRole, dob);
      const tkn = data.token;
      await api.setToken(tkn);
      setToken(tkn);
      setUser(data.user || data);
      setRole(userRole || "patient");
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Sign in ── */
  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      const tkn = data.token;
      await api.setToken(tkn);
      setToken(tkn);
      setUser(data.user || data);
      setRole(data.user?.role || data.role || "patient");
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Sign out ── */
  const signOut = useCallback(async () => {
    await api.clearToken();
    setToken(null);
    setUser(null);
    setRole(null);
  }, []);

  /* ── Switch role (patient <-> healer) ── */
  const switchRole = useCallback(
    (newRole) => {
      if (newRole === "patient" || newRole === "healer") {
        setRole(newRole);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      role,
      signUp,
      signIn,
      signOut,
      switchRole,
      isAuthenticated: !!token,
    }),
    [user, token, loading, role, signUp, signIn, signOut, switchRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
