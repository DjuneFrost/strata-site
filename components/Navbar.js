"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bot", label: "DCA Bot" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { ready, authenticated, login, logout, user } = usePrivy();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      background: "rgba(8,8,8,0.92)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(192,192,192,0.1)",
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      padding: "0 32px",
      gap: 16,
    }}>

      {/* Left — Logo + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src="/logozillaengine.png"
          alt="Zilla Engine"
          style={{ width: 28, height: 28, objectFit: "contain" }}
        />
        <span style={{
          fontFamily: "'Newsreader', serif", fontSize: 18,
          fontWeight: 600, color: "#F2F2F2", whiteSpace: "nowrap",
        }}>
          Zilla Engine
        </span>
      </div>

      {/* Center — Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
                textDecoration: "none",
                padding: "8px 14px", borderRadius: 8,
                color: active ? "#F2F2F2" : "rgba(230,230,230,0.55)",
                background: active ? "rgba(192,192,192,0.08)" : "transparent",
                transition: "color .15s, background .15s",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right — Auth */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
        {ready && (
          authenticated ? (
            <>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: 12,
                color: "rgba(230,230,230,0.45)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                maxWidth: 140,
              }}>
                {user?.email?.address || (user?.wallet?.address?.slice(0, 6) + "..." + user?.wallet?.address?.slice(-4)) || "Connected"}
              </span>
              <button
                onClick={logout}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  background: "transparent",
                  border: "1px solid rgba(255,107,107,0.3)",
                  color: "#ff6b6b", cursor: "pointer",
                  fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 600,
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={login}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  background: "transparent",
                  border: "1px solid rgba(192,192,192,0.3)",
                  color: "#E6E6E6", cursor: "pointer",
                  fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 600,
                }}
              >
                Sign In
              </button>
              <button
                onClick={login}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  background: "linear-gradient(135deg,#E8E8E8,#B0B0B0)",
                  border: "none", color: "#0A0A0A", cursor: "pointer",
                  fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 700,
                }}
              >
                Sign Up
              </button>
            </>
          )
        )}
      </div>
    </nav>
  );
}
