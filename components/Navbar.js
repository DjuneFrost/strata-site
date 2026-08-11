"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bot", label: "DCA Bot" },
  { href: "/wallet", label: "Wallet" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const avatarLetter = (
    user?.email?.address?.[0] ||
    user?.wallet?.address?.[0] ||
    "?"
  ).toUpperCase();

  const avatarPicture =
    user?.google?.picture ||
    user?.twitter?.profilePictureUrl ||
    null;

  const displayName =
    user?.google?.name ||
    user?.twitter?.name ||
    user?.email?.address?.split("@")[0] ||
    user?.wallet?.address?.slice(0, 6) + "..." ||
    "Account";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
              {/* Upgrade button */}
              <Link
                href="/pricing"
                style={{
                  padding: "7px 16px", borderRadius: 8,
                  background: "linear-gradient(135deg,#9945FF,#7a35cc)",
                  color: "#fff", fontFamily: "'Inter', sans-serif",
                  fontWeight: 700, fontSize: 13, textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Upgrade
              </Link>

              {/* Avatar + Dropdown */}
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "rgba(192,192,192,0.12)",
                    border: "1px solid rgba(192,192,192,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Inter', sans-serif", fontWeight: 700,
                    fontSize: 14, color: "#F2F2F2", cursor: "pointer",
                    overflow: "hidden", flexShrink: 0,
                  }}
                >
                  {avatarPicture ? (
                    <img
                      src={avatarPicture}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      alt="avatar"
                    />
                  ) : (
                    avatarLetter
                  )}
                </div>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div style={{
                    position: "absolute", top: 44, right: 0,
                    background: "#1a1a1a",
                    border: "1px solid rgba(192,192,192,0.15)",
                    borderRadius: 12, overflow: "hidden",
                    minWidth: 200,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    zIndex: 200,
                  }}>
                    {/* User info */}
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(192,192,192,0.12)", border: "1px solid rgba(192,192,192,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#F2F2F2", overflow: "hidden", flexShrink: 0 }}>
                        {avatarPicture ? <img src={avatarPicture} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" /> : avatarLetter}
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#F2F2F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {displayName}
                      </span>
                    </div>

                    {/* Menu items */}
                    {[
{ label: "Account", href: "/account", icon: "◔" },
{ label: "Portfolio", href: "/dashboard", icon: "▦" },
{ label: "Referral", href: "/referral", icon: "◈" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "12px 16px",
                          fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
                          color: "rgba(230,230,230,0.7)", textDecoration: "none",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          transition: "background .15s",
                        }}
                      >
                        <span style={{ fontSize: 14, color: "rgba(192,192,192,0.6)" }}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}

                    {/* Sign Out */}
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      style={{
                        width: "100%", padding: "12px 16px",
                        display: "flex", alignItems: "center", gap: 10,
                        background: "transparent", border: "none",
                        fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
                        color: "#ff6b6b", cursor: "pointer", textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 14 }}>→</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
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
