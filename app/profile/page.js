"use client";
import { usePrivy } from "@privy-io/react-auth";

const C = {
  panel: "#111111",
  border: "rgba(255,255,255,0.08)",
  text: "#E6E6E6",
  textDim: "rgba(230,230,230,0.45)",
  textFaint: "rgba(230,230,230,0.25)",
  silver: "#C0C0C0",
  silverBright: "#F2F2F2",
  red: "#ff6b6b",
};

function StatBlock({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: C.textDim }}>{value}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, authenticated } = usePrivy();

  const displayName = user?.email?.address || user?.wallet?.address || "—";
  const initials = displayName[0]?.toUpperCase() || "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@500;600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .pf-card { background: ${C.panel}; border: 1px solid ${C.border}; border-radius: 12px; }
      `}</style>

      <div style={{ padding: "32px 4vw 60px", color: C.text, maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: C.silverBright, margin: 0 }}>Profile</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>
            Your account & DCA bot history
          </p>
        </div>

        {!authenticated ? (
          <div className="pf-card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textFaint }}>
              Sign in to view your profile.
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, marginBottom: 16 }}>

              {/* Profile + P&L card */}
              <div className="pf-card" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "rgba(192,192,192,0.08)", border: "1px solid rgba(192,192,192,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 16, color: C.silver,
                    }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: C.silverBright }}>{displayName}</div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.silver, background: "rgba(192,192,192,0.08)", border: "1px solid rgba(192,192,192,0.2)", borderRadius: 6, padding: "2px 8px", marginTop: 4 }}>
                        ✓ {user?.wallet?.address ? "Wallet" : "Email"}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["24H", "7D", "30D", "ALL"].map((p, i) => (
                      <button key={p} style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, padding: "5px 10px", borderRadius: 6,
                        border: `1px solid ${i === 3 ? "rgba(192,192,192,0.4)" : "rgba(255,255,255,0.1)"}`,
                        background: i === 3 ? "rgba(192,192,192,0.12)" : "transparent",
                        color: i === 3 ? C.silverBright : C.textFaint, cursor: "pointer",
                      }}>{p}</button>
                    ))}
                  </div>
                </div>

                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 6 }}>
                  Profit / Loss <span style={{ background: "rgba(192,192,192,0.08)", border: "1px solid rgba(192,192,192,0.15)", color: C.silver, borderRadius: 5, padding: "1px 6px", marginLeft: 6, fontSize: 10 }}>DCA BOT</span>
                </div>
                <div style={{ fontFamily: "'Newsreader', serif", fontSize: 36, fontWeight: 600, color: C.textDim, marginBottom: 4 }}>—</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: C.textFaint, marginBottom: 20 }}>
                  No trades executed yet
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <StatBlock label="Account Value" value="—" />
                  <StatBlock label="Open P&L" value="—" />
                  <StatBlock label="Realized · All" value="—" />
                </div>
              </div>

              {/* Performance card */}
              <div className="pf-card" style={{ padding: 24 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 20 }}>
                  Performance & Behavior
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                  <StatBlock label="Win Rate" value="—" />
                  <StatBlock label="Avg Leverage" value="—" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <StatBlock label="Sharpe" value="—" />
                  <StatBlock label="Max DD" value="—" />
                  <StatBlock label="Maker" value="—" />
                  <StatBlock label="Buy / Sell" value="—" />
                  <StatBlock label="Volume" value="—" />
                  <StatBlock label="Fills" value="—" />
                  <StatBlock label="Markets" value="—" />
                  <StatBlock label="Last Fill" value="—" />
                </div>
              </div>
            </div>

            {/* Trade history */}
            <div className="pf-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: C.silverBright }}>Bot Trade History</div>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textFaint }}>0 fills</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
                <thead>
                  <tr>
                    {["Date", "Side", "Trigger", "Amount", "Price", "Quantity"].map(h => (
                      <th key={h} style={{ textAlign: "left", fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} style={{ padding: "32px 12px", textAlign: "center", color: C.textFaint, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                      Empty — your trades will appear here once the bot is active.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
