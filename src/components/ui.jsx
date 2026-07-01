import { T } from "../theme";

export const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, style = {}, icon, type = "button" }) => {
  const styles = {
    primary:   { background: T.indigo, color: T.white, border: "none" },
    secondary: { background: T.white,  color: T.indigo, border: `1.5px solid ${T.indigo}` },
    ghost:     { background: "transparent", color: T.slate, border: `1.5px solid ${T.border}` },
    danger:    { background: T.red, color: T.white, border: "none" },
    dark:      { background: T.navy, color: T.white, border: "none" },
    success:   { background: T.green, color: T.white, border: "none" },
  };
  const sizes = {
    sm: { padding: "6px 14px", fontSize: 13, borderRadius: 8 },
    md: { padding: "10px 20px", fontSize: 14, borderRadius: 10 },
    lg: { padding: "13px 28px", fontSize: 15, borderRadius: 12 },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1, transition: "all 0.15s ease",
        ...styles[variant], ...sizes[size], ...style,
      }}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.opacity = "0.87"; }}
      onMouseOut={e => { e.currentTarget.style.opacity = "1"; }}
    >
      {icon && <span style={{ fontSize: size === "sm" ? 14 : 16 }}>{icon}</span>}
      {children}
    </button>
  );
};

export const Badge = ({ children, color = "indigo", dot }) => {
  const colors = {
    indigo: { bg: T.indigoPl, text: T.indigo },
    green:  { bg: "#D1FAE5",  text: "#065F46" },
    red:    { bg: T.redLt,    text: T.red },
    amber:  { bg: "#FEF3C7",  text: "#92400E" },
    slate:  { bg: "#F1F3F8",  text: T.slate },
    navy:   { bg: T.navyMid,  text: T.white },
  };
  const c = colors[color] || colors.slate;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 99, fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.text,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.text }} />}
      {children}
    </span>
  );
};

export const Card = ({ children, style = {}, onClick, hover }) => (
  <div
    onClick={onClick}
    style={{
      background: T.white, borderRadius: 16, border: `1px solid ${T.border}`,
      padding: 24, transition: "all 0.18s ease",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}
    onMouseOver={e => { if (hover || onClick) { e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,98,255,0.10)"; e.currentTarget.style.borderColor = T.indigoLt; } }}
    onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = T.border; }}
  >
    {children}
  </div>
);

export const Input = ({ label, type = "text", value, onChange, placeholder, error, icon, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: T.slate }}>{label}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: T.slateLt }}>{icon}</span>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: "100%", padding: icon ? "10px 12px 10px 38px" : "10px 12px",
          border: `1.5px solid ${error ? T.red : T.border}`, borderRadius: 10, fontSize: 14,
          background: T.white, color: T.slate, outline: "none", transition: "border-color 0.15s",
        }}
        onFocus={e => e.target.style.borderColor = T.indigo}
        onBlur={e => e.target.style.borderColor = error ? T.red : T.border}
      />
    </div>
    {error && <span style={{ fontSize: 12, color: T.red }}>{error}</span>}
  </div>
);

export const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: T.slate }}>{label}</label>}
    <select
      value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: "10px 12px", border: `1.5px solid ${T.border}`, borderRadius: 10, fontSize: 14, background: T.white, color: T.slate, outline: "none" }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export const Spinner = ({ size = 20 }) => (
  <div style={{ width: size, height: size, border: `2.5px solid ${T.border}`, borderTop: `2.5px solid ${T.indigo}`, borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
);

export const Divider = ({ style }) => <div style={{ height: 1, background: T.border, ...style }} />;

export const ProgressBar = ({ value, max, color = T.indigo }) => (
  <div style={{ height: 6, background: T.border, borderRadius: 99, overflow: "hidden" }}>
    <div style={{ height: "100%", width: `${Math.min(100, (value / max) * 100)}%`, background: color, borderRadius: 99, transition: "width 0.3s ease" }} />
  </div>
);

export const StatCard = ({ label, value, sub, icon, color = T.indigo, trend }) => (
  <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 12, color: T.slateLt, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.navy, marginTop: 4 }}>{value}</div>
        {sub && <div style={{ fontSize: 13, color: T.slateLt, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
    </div>
    {trend !== undefined && (
      <div style={{ fontSize: 13, color: trend >= 0 ? T.green : T.red, fontWeight: 600 }}>
        {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last month
      </div>
    )}
  </Card>
);

export const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,41,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} className="fade-in" style={{ background: T.white, borderRadius: 20, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${T.border}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.navy }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: T.slateLt, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

export const Toast = ({ message, type = "success", onDone }) => {
  if (typeof window !== "undefined") {
    setTimeout(onDone, 3000);
  }
  const colors = { success: T.green, error: T.red, info: T.indigo };
  return (
    <div className="fade-in" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: T.navy, color: T.white, borderLeft: `4px solid ${colors[type]}`, padding: "14px 20px", borderRadius: 12, maxWidth: 340, fontSize: 14, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
      {type === "success" ? "✓ " : type === "error" ? "✕ " : "ℹ "}{message}
    </div>
  );
};

// Generic empty/error/loading states for data-bearing views — used so
// every page that hits the API has a consistent, honest way to show
// "nothing here yet" vs "something went wrong" vs "still loading".

export const LoadingGrid = ({ count = 4, height = 200 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
    {Array.from({ length: count }).map((_, i) => <div key={i} className="skeleton" style={{ height, borderRadius: 16 }} />)}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div style={{ textAlign: "center", padding: "60px 20px" }}>
    <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
    <div style={{ fontSize: 15, fontWeight: 600, color: T.navy, marginBottom: 6 }}>Something went wrong</div>
    <div style={{ fontSize: 14, color: T.slateLt, marginBottom: 16 }}>{message}</div>
    {onRetry && <Btn size="sm" onClick={onRetry}>Try again</Btn>}
  </div>
);

export const EmptyState = ({ icon = "🔍", title, sub }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: T.slateLt }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 600, color: T.slate }}>{title}</div>
    {sub && <div style={{ fontSize: 14, marginTop: 6 }}>{sub}</div>}
  </div>
);
