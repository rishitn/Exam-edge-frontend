import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Input, Select, Btn, Spinner } from "../../components/ui";
import { useStudentAuth } from "../../context/StudentAuthContext";
import { ApiError } from "../../api/client";

export default function RegisterPage() {
  const { register } = useStudentAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", exam: "NEET" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        targetExams: [form.exam],
      });
      navigate("/", { replace: true });
    } catch (err) {
      // Zod validation errors land here too (e.g. password missing an
      // uppercase letter) — the backend's message is specific enough to
      // show directly rather than writing our own copy of the same rules.
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 460, margin: "60px auto" }} className="fade-in">
      <Card>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0F1729" }}>Start your journey</h1>
          <p style={{ fontSize: 14, color: "#8892AA", marginTop: 6 }}>Free account · No credit card needed</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Full name" value={form.name} onChange={set("name")} placeholder="Arjun Verma" />
          <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="8+ chars, upper, lower, number" />
          <Select label="Target exam" value={form.exam} onChange={set("exam")} options={[
            { value: "NEET", label: "NEET" }, { value: "JEE_MAIN", label: "JEE Main" },
            { value: "JEE_ADVANCED", label: "JEE Advanced" }, { value: "CUET", label: "CUET" },
          ]} />
          {error && <div style={{ fontSize: 13, color: "#EF4444", background: "#FEE2E2", padding: "10px 12px", borderRadius: 8 }}>{error}</div>}
          <Btn type="submit" disabled={loading || !form.name || !form.email || !form.password} style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
            {loading ? <Spinner size={16} /> : "Create account →"}
          </Btn>
          <div style={{ textAlign: "center", fontSize: 13, color: "#8892AA" }}>
            Already registered? <Link to="/login" style={{ color: "#4F62FF", fontWeight: 600 }}>Sign in</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
