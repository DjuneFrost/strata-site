"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/bot", label: "DCA Bot", icon: "⟳" },
  { href: "/profile", label: "Profile", icon: "◔" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: collapsed ? 72 : 220,
        flexShrink: 0,
        background: "#0A0A0A",
        borderRight: "1px solid rgba(192,192,192,0.1)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width .2s ease",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
      }}
    >
      <div>
        {/* Brand */}
<div style={{ display: "flex", alignItems: "center", gap: 10, padding: "22px 20px", overflow: "hidden" }}>
  <img
    src="/logozillaengine.png"
    alt="Zilla Engine"
    style={{ width: 28, height: 28, objectFit: "contain", flexShrink: 0 }}
  />
  {!collapsed && (
    <span style={{ fontFamily: "'Newsreader', serif", fontSize: 19, fontWeight: 600, color: "#F2F2F2", whiteSpace: "nowrap" }}>
      Zilla Engine
    </span>
  )}
</div>

        {/* Nav */}
        <nav style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: active ? "#F2F2F2" : "rgba(230,230,230,0.55)",
                  background: active ? "rgba(192,192,192,0.08)" : "transparent",
                  borderLeft: active ? "2px solid #C0C0C0" : "2px solid transparent",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <span style={{ fontSize: 16, width: 18, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Collapse toggle */}
      <div style={{ padding: 12, borderTop: "1px solid rgba(192,192,192,0.08)" }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            borderRadius: 8,
            background: "rgba(192,192,192,0.05)",
            border: "1px solid rgba(192,192,192,0.12)",
            color: "rgba(230,230,230,0.6)",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>
    </aside>
  );
}