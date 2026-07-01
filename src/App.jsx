import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudentAuthProvider } from "./context/StudentAuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { RequireStudent, RequireAdmin, RequireSuperAdmin } from "./components/guards";
import { StudentShell } from "./components/StudentShell";
import { AdminShell } from "./components/AdminShell";

import TestBrowsePage from "./pages/student/TestBrowsePage";
import LoginPage from "./pages/student/LoginPage";
import RegisterPage from "./pages/student/RegisterPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

// NOTE: This file wires up the routes that are fully built out (browse,
// student auth, admin auth, admin dashboard). The remaining pages
// (test detail, test-taking, results, leaderboard, pricing, admin tests/
// questions/analytics, super admin revenue/subscriptions/coupons) follow
// the exact same pattern — see src/api/*.js for the matching API calls
// and src/pages/student/TestBrowsePage.jsx / AdminDashboard.jsx as the
// template (fetch in useEffect, render loading/error/empty, then data).
// Stub routes below render a "coming soon" placeholder so the app never
// 404s on a nav link while you fill them in.

const Stub = ({ label }) => (
  <div style={{ textAlign: "center", padding: "80px 20px", color: "#8892AA" }}>
    <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
    <div style={{ fontSize: 16, fontWeight: 600, color: "#3D4A6B" }}>{label}</div>
    <div style={{ fontSize: 14, marginTop: 6 }}>Wire this page to its API module in src/api/ — the pattern is the same as Test Browse.</div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <StudentAuthProvider>
        <AdminAuthProvider>
          <Routes>
            {/* ── Student portal ── */}
            <Route path="/" element={<StudentShell><TestBrowsePage /></StudentShell>} />
            <Route path="/login" element={<StudentShell><LoginPage /></StudentShell>} />
            <Route path="/register" element={<StudentShell><RegisterPage /></StudentShell>} />
            <Route path="/tests/:testId" element={<StudentShell><Stub label="Test Detail" /></StudentShell>} />
            <Route path="/my-tests" element={<RequireStudent><StudentShell><Stub label="My Tests" /></StudentShell></RequireStudent>} />
            <Route path="/leaderboard" element={<RequireStudent><StudentShell><Stub label="Leaderboard" /></StudentShell></RequireStudent>} />
            <Route path="/pricing" element={<StudentShell><Stub label="Pricing" /></StudentShell>} />
            <Route path="/attempts/:attemptId" element={<RequireStudent><Stub label="Test Taking" /></RequireStudent>} />
            <Route path="/results/:attemptId" element={<RequireStudent><StudentShell><Stub label="Results" /></StudentShell></RequireStudent>} />

            {/* ── Admin portal ── */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<RequireAdmin><AdminShell><AdminDashboard /></AdminShell></RequireAdmin>} />
            <Route path="/admin/tests" element={<RequireAdmin><AdminShell><Stub label="Tests" /></AdminShell></RequireAdmin>} />
            <Route path="/admin/questions" element={<RequireAdmin><AdminShell><Stub label="Question Bank" /></AdminShell></RequireAdmin>} />
            <Route path="/admin/analytics" element={<RequireAdmin><AdminShell><Stub label="Analytics" /></AdminShell></RequireAdmin>} />

            {/* ── Super Admin portal ── */}
            <Route path="/admin/super/dashboard" element={<RequireSuperAdmin><AdminShell><Stub label="Platform Overview" /></AdminShell></RequireSuperAdmin>} />
            <Route path="/admin/super/revenue" element={<RequireSuperAdmin><AdminShell><Stub label="Revenue" /></AdminShell></RequireSuperAdmin>} />
            <Route path="/admin/super/subscriptions" element={<RequireSuperAdmin><AdminShell><Stub label="Subscriptions" /></AdminShell></RequireSuperAdmin>} />
            <Route path="/admin/super/coupons" element={<RequireSuperAdmin><AdminShell><Stub label="Coupons" /></AdminShell></RequireSuperAdmin>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminAuthProvider>
      </StudentAuthProvider>
    </BrowserRouter>
  );
}
