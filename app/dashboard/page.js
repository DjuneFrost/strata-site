"use client";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

const C = {
  panel: "#111111",
  border: "rgba(255,255,255,0.08)",
  text: "#E6E6E6",
  textDim: "rgba(230,230,230,0.45)",
  textFaint: "rgba(230,230,230,0.25)",
  silver: "#C0C0C0",
  silverBright: "#F2F2F2",
};

function StatBlock({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, color: C.textDim }}>{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, authenticated } = usePrivy();

  const displayName = user?.email?.address
    ? user.email.address.split("@")[0]
    : user?.wallet?.address
    ? user.wallet.address.slice(0, 6) + "..."
    : "there";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@500;600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      <div style={{ padding: "32px 4vw 60px", color: C.text, maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: C.silverBright, margin: 0 }}>
            Welcome back{authenticated ? `, ${displayName}` : ""} 👋
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>
            Here's an overview of your DCA bot activity.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Profit & Loss card */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 20 }}>
              Profit / Loss
            </div>

            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 42, fontWeight: 600, color: C.textDim, marginBottom: 4 }}>
              —
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, marginBottom: 24 }}>
              No trades executed yet
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 18, borderTop: `1px solid rgba(255,255,255,0.06)` }}>
              <StatBlock label="Account Value" value="—" />
              <StatBlock label="Open P&L" value="—" />
              <StatBlock label="Realized" value="—" />
            </div>
          </div>

          {/* Configure Bot card */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 20 }}>
                DCA Bot
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(192,192,192,0.3)", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.textDim }}>No active strategy</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
                <StatBlock label="Strategies" value="0 / 0" />
                <StatBlock label="Deployed Capital" value="$0" />
                <StatBlock label="Orders Executed" value="0" />
                <StatBlock label="Last Order" value="—" />
              </div>
            </div>

            <Link
              href="/bot"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "12px 20px", borderRadius: 8,
                background: "linear-gradient(135deg,#E8E8E8,#B0B0B0)",
                color: "#0A0A0A", textDecoration: "none",
                fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14,
              }}
            >
              Configure your Bot →
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
