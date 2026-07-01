import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { T } from "../theme";
import { useAdminAuth } from "../context/AdminAuthContext";

export function AdminShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin, logout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);

  const links = isSuperAdmin
    ? [
        { icon: "⚡", label: "Dashboard",     to: "/admin/super/dashboard" },
        { icon: "💰", label: "Revenue",       to: "/admin/super/revenue" },
        { icon: "💎", label: "Subscriptions", to: "/admin/super/subscriptions" },
        { icon: "🎟️", label: "Coupons",       to: "/admin/super/coupons" },
        { icon: "📋", label: "Tests",         to: "/admin/tests" },
        { icon: "📐", label: "Questions",     to: "/admin/questions" },
      ]
    : [
        { icon: "📊", label: "Dashboard", to: "/admin/dashboard" },
        { icon: "📋", label: "Tests",     to: "/admin/tests" },
        { icon: "📐", label: "Questions", to: "/admin/questions" },
        { icon: "📈", label: "Analytics", to: "/admin/analytics" },
      ];

  const sidebarW = collapsed ? 64 : 220;

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: T.chalk }}>
      <div style={{ width: sidebarW, flexShrink: 0, background: T.navy, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflow: "hidden", transition: "width 0.2s ease" }}>
        <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.navyLt}` }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>📐</span>
          {!collapsed && <span style={{ fontWeight: 800, color: T.white, fontSize: 15, letterSpacing: "-0.02em" }}>ExamEdge</span>}
        </div>
        {!collapsed && (
          <div style={{ padding: "8px 16px 4px", fontSize: 11, fontWeight: 700, color: T.navyLt, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 12 }}>
            {isSuperAdmin ? "Super Admin" : "Admin"}
          </div>
        )}

        <nav style={{ padding: "8px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
              background: location.pathname === l.to ? T.indigo : "transparent",
              color: location.pathname === l.to ? T.white : T.slateLt,
              fontWeight: location.pathname === l.to ? 600 : 400, fontSize: 14,
            }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>{l.icon}</span>
              {!collapsed && <span>{l.label}</span>}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "12px 10px", borderTop: `1px solid ${T.navyLt}`, display: "flex", flexDirection: "column", gap: 6 }}>
          <div onClick={() => setCollapsed(!collapsed)} style={{ padding: "8px 12px", cursor: "pointer", color: T.slateLt, fontSize: 20, textAlign: collapsed ? "center" : "right" }}>
            {collapsed ? "→" : "←"}
          </div>
          <div onClick={() => { logout(); navigate("/admin/login"); }} style={{ padding: "8px 12px", cursor: "pointer", color: T.slateLt, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🚪</span>{!collapsed && "Sign out"}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "32px 32px", maxWidth: 1200, margin: "0 auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
