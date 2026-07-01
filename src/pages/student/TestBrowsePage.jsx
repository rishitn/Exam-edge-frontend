import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Btn, Input, Select, LoadingGrid, ErrorState, EmptyState } from "../../components/ui";
import { T } from "../../theme";
import * as StudentTestsApi from "../../api/student-tests";
import { ApiError } from "../../api/client";

const TYPE_LABELS = { FULL_MOCK: "Full Mock", SUBJECT_TEST: "Subject", CHAPTER_TEST: "Chapter", PREVIOUS_YEAR: "PYQ", SECTIONAL: "Sectional" };

export default function TestBrowsePage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({ exam: "", type: "", search: "" });
  const [tests, setTests] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setError(null);
    setTests(null);
    StudentTestsApi.browseTests({ exam: filter.exam, type: filter.type, search: filter.search })
      .then(({ tests }) => setTests(tests))
      .catch(err => setError(err instanceof ApiError ? err.message : "Couldn't load tests."));
  }, [filter.exam, filter.type, filter.search]);

  useEffect(() => {
    const t = setTimeout(load, 250); // light debounce on search typing
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="fade-in">
      <div style={{ background: `linear-gradient(135deg, ${T.navy} 0%, ${T.navyMid} 60%, ${T.navyLt} 100%)`, borderRadius: 20, padding: "40px 36px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: T.indigo + "20" }} />
        <h1 style={{ fontSize: 30, fontWeight: 800, color: T.white, marginBottom: 10, position: "relative" }}>
          Your next rank is<br /><span style={{ color: T.indigoLt }}>one test away.</span>
        </h1>
        <p style={{ color: T.slateLt, fontSize: 15, position: "relative" }}>NEET · JEE Main · JEE Advanced · CUET</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <Input placeholder="Search tests…" value={filter.search} onChange={v => setFilter(f => ({ ...f, search: v }))} icon="🔍" style={{ flex: 1, minWidth: 200 }} />
        <Select value={filter.exam} onChange={v => setFilter(f => ({ ...f, exam: v }))} options={[
          { value: "", label: "All Exams" }, { value: "NEET", label: "NEET" }, { value: "JEE_MAIN", label: "JEE Main" },
          { value: "JEE_ADVANCED", label: "JEE Advanced" }, { value: "CUET", label: "CUET" },
        ]} style={{ minWidth: 140 }} />
        <Select value={filter.type} onChange={v => setFilter(f => ({ ...f, type: v }))} options={[
          { value: "", label: "All Types" }, { value: "FULL_MOCK", label: "Full Mock" }, { value: "SUBJECT_TEST", label: "Subject" },
          { value: "CHAPTER_TEST", label: "Chapter" }, { value: "PREVIOUS_YEAR", label: "PYQ" },
        ]} style={{ minWidth: 140 }} />
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && tests === null && <LoadingGrid />}
      {!error && tests?.length === 0 && <EmptyState title="No tests match your filters" sub="Try adjusting the exam or type filter" />}

      {!error && tests?.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {tests.map(test => (
            <Card key={test.id} hover style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge color="indigo">{test.exam?.replace("_", " ")}</Badge>
                  <Badge color="slate">{TYPE_LABELS[test.type] || test.type}</Badge>
                  {test.isFree && <Badge color="green">Free</Badge>}
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: test.isFree ? T.green : T.navy }}>
                  {test.isFree ? "Free" : `₹${test.price}`}
                </span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: T.navy, lineHeight: 1.4 }}>{test.title}</h3>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: T.slateLt }}>
                <span>⏱ {test.durationMinutes} min</span>
                <span>📝 {test.totalQuestions} Qs</span>
              </div>
              <Btn size="sm" onClick={() => navigate(`/tests/${test.id}`)}>View Details →</Btn>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
