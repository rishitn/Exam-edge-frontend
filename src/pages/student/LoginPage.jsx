import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, Input, Btn, Spinner, Divider } from "../../components/ui";
import { useStudentAuth } from "../../context/StudentAuthContext";
import { ApiError } from "../../api/client";

export default function LoginPage() {
  const { login } = useStudentAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // ApiError carries the backend's structured { code, message } —
      // INVALID_CREDENTIALS / ACCOUNT_LOCKED / ACCOUNT_SUSPENDED are the
      // ones a student is likely to actually hit here.
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }} className="fade-in">
      <Card>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📐</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F1729" }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "#8892AA", marginTop: 6 }}>Sign in to continue your preparation</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Email" type="email" value={email} onChange={setEmail} icon="✉️" />
          <Input label="Password" type="password" value={password} onChange={setPassword} icon="🔒" />
          {error && <div style={{ fontSize: 13, color: "#EF4444", background: "#FEE2E2", padding: "10px 12px", borderRadius: 8 }}>{error}</div>}
          <Btn type="submit" disabled={loading || !email || !password} style={{ width: "100%", justifyContent: "center" }}>
            {loading ? <Spinner size={16} /> : "Sign in →"}
          </Btn>
          <Divider />
          <div style={{ textAlign: "center", fontSize: 14, color: "#8892AA" }}>
            No account? <Link to="/register" style={{ color: "#4F62FF", fontWeight: 600 }}>Create one free</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
