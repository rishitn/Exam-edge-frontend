import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Btn, Spinner } from "../../components/ui";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { ApiError } from "../../api/client";

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { admin } = await login({ email, password });
      // One login endpoint serves both roles — the backend's Admin.role
      // column (ADMIN | SUPER_ADMIN) decides which shell to land in.
      navigate(admin.role === "SUPER_ADMIN" ? "/admin/super/dashboard" : "/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F1729" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 20 }} className="fade-in">
        <Card style={{ background: "#fff" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🛠️</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F1729" }}>Admin sign in</h1>
            <p style={{ fontSize: 14, color: "#8892AA", marginTop: 6 }}>ExamEdge staff access only</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Email" type="email" value={email} onChange={setEmail} icon="✉️" />
            <Input label="Password" type="password" value={password} onChange={setPassword} icon="🔒" />
            {error && <div style={{ fontSize: 13, color: "#EF4444", background: "#FEE2E2", padding: "10px 12px", borderRadius: 8 }}>{error}</div>}
            <Btn type="submit" disabled={loading || !email || !password} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? <Spinner size={16} /> : "Sign in →"}
            </Btn>
          </form>
        </Card>
      </div>
    </div>
  );
}
