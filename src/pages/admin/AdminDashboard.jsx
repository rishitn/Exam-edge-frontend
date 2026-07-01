import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Btn, StatCard, ErrorState } from "../../components/ui";
import { T } from "../../theme";
import * as AdminTestsApi from "../../api/admin-tests";
import * as AdminQuestionsApi from "../../api/admin-questions";
import { ApiError } from "../../api/client";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      AdminTestsApi.listTests({ pageSize: 5 }),
      AdminQuestionsApi.getQuestionStats(),
    ])
      .then(([testsRes, statsRes]) => {
        setTests(testsRes.tests);
        setStats(statsRes);
      })
      .catch(err => setError(err instanceof ApiError ? err.message : "Couldn't load dashboard data."));
  }, []);

  if (error) return <ErrorState message={error} />;

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: T.navy }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: T.slateLt, marginTop: 4 }}>Welcome back — here's what's happening today</p>
        </div>
        <Btn onClick={() => navigate("/admin/tests")} icon="➕">New Test</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Questions" value={stats?.total ?? "—"} icon="📐" color={T.indigo} />
        <StatCard label="Active Questions" value={stats?.active ?? "—"} icon="✅" color={T.green} />
        <StatCard label="Draft Questions" value={stats?.draft ?? "—"} icon="📝" color={T.amber} />
        <StatCard label="Archived" value={stats?.archived ?? "—"} icon="🗄️" color={T.slateLt} />
      </div>

      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: T.navy, marginBottom: 16 }}>Recent Tests</h3>
        {tests === null && <div style={{ color: T.slateLt, fontSize: 14 }}>Loading…</div>}
        {tests?.length === 0 && <div style={{ color: T.slateLt, fontSize: 14 }}>No tests yet — create your first one.</div>}
        {tests?.map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.navy }}>{t.title}</div>
              <div style={{ fontSize: 12, color: T.slateLt, marginTop: 2 }}>{t.exam?.replace("_", " ")} · {t.type?.replace("_", " ")}</div>
            </div>
            <Badge color={t.status === "PUBLISHED" ? "green" : "amber"}>{t.status}</Badge>
          </div>
        ))}
        <div style={{ marginTop: 14 }}>
          <Btn variant="ghost" size="sm" onClick={() => navigate("/admin/tests")}>View all tests →</Btn>
        </div>
      </Card>
    </div>
  );
}
