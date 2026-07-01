import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { T } from "../theme";
import { Btn, Divider } from "./ui";
import { useStudentAuth } from "../context/StudentAuthContext";

function useIsMobile(breakpoint = 720) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

export function StudentShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useStudentAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();

  const navLinks = [
    { label: "Tests", to: "/" },
    { label: "My Tests", to: "/my-tests" },
    { label: "Leaderboard", to: "/leaderboard" },
    { label: "Plans", to: "/pricing" },
  ];

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: T.white, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100, padding: "0 16px", display: "flex", alignItems: "center", height: 60 }}>
        <Link to="/" onClick={closeMobileNav} style={{ display: "flex", alignItems: "center", gap: 8, marginRight: isMobile ? "auto" : 40 }}>
          <span style={{ fontSize: 22 }}>📐</span>
          <span style={{ fontWeight: 800, color: T.navy, fontSize: 17, letterSpacing: "-0.02em" }}>ExamEdge</span>
        </Link>

        {!isMobile && (
          <div style={{ display: "flex", gap: 4, flex: 1 }}>
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: "6px 14px", borderRadius: 8,
                background: location.pathname === l.to ? T.indigoPl : "transparent",
                color: location.pathname === l.to ? T.indigo : T.slate,
                fontWeight: location.pathname === l.to ? 700 : 500, fontSize: 14,
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {isMobile ? (
          <button
            onClick={() => setMobileNavOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 8, lineHeight: 1 }}
          >
            {mobileNavOpen ? "✕" : "☰"}
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user ? (
              <div style={{ position: "relative" }}>
                <div onClick={() => setMenuOpen(!menuOpen)} style={{ width: 36, height: 36, borderRadius: "50%", background: T.indigo, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                {menuOpen && (
                  <div className="fade-in" style={{ position: "absolute", right: 0, top: 44, background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: 8, minWidth: 180, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 200 }}>
                    <div style={{ padding: "8px 12px", fontSize: 13, color: T.slateLt }}>Signed in as</div>
                    <div style={{ padding: "4px 12px 8px", fontWeight: 600, fontSize: 14, color: T.navy }}>{user.name}</div>
                    <Divider />
                    <div onClick={() => { logout(); navigate("/"); setMenuOpen(false); }} style={{ padding: "10px 12px", cursor: "pointer", fontSize: 14, color: T.red, borderRadius: 8, marginTop: 4 }}>Sign out</div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Btn size="sm" variant="ghost" onClick={() => navigate("/login")}>Sign in</Btn>
                <Btn size="sm" onClick={() => navigate("/register")}>Get started</Btn>
              </>
            )}
          </div>
        )}
      </nav>

      {isMobile && mobileNavOpen && (
        <div className="fade-in" style={{ background: T.white, borderBottom: `1px solid ${T.border}`, padding: 16, display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 60, zIndex: 99 }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={closeMobileNav} style={{
              padding: "12px 14px", borderRadius: 8,
              background: location.pathname === l.to ? T.indigoPl : "transparent",
              color: location.pathname === l.to ? T.indigo : T.slate,
              fontWeight: location.pathname === l.to ? 700 : 500, fontSize: 15,
            }}>
              {l.label}
            </Link>
          ))}
          <Divider />
          {user ? (
            <>
              <div style={{ padding: "8px 14px", fontSize: 13, color: T.slateLt }}>Signed in as <strong style={{ color: T.navy }}>{user.name}</strong></div>
              <div onClick={() => { logout(); navigate("/"); closeMobileNav(); }} style={{ padding: "12px 14px", cursor: "pointer", fontSize: 15, color: T.red, borderRadius: 8 }}>Sign out</div>
            </>
          ) : (
            <div style={{ display: "flex", gap: 8, padding: "8px 14px 0" }}>
              <Btn size="sm" variant="ghost" onClick={() => { navigate("/login"); closeMobileNav(); }} style={{ flex: 1 }}>Sign in</Btn>
              <Btn size="sm" onClick={() => { navigate("/register"); closeMobileNav(); }} style={{ flex: 1 }}>Get started</Btn>
            </div>
          )}
        </div>
      )}

      <main style={{ flex: 1, padding: isMobile ? "20px 16px" : "32px 24px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {children}
      </main>

      <footer style={{ background: T.navy, color: T.slateLt, textAlign: "center", padding: "20px 24px", fontSize: 13 }}>
        © 2026 ExamEdge · NEET · JEE · CUET
      </footer>
    </div>
  );
}
