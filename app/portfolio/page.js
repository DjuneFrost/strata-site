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
  green: "#6fcf97",
};

// TODO: replace with real data from your bot's database
const MOCK_HOLDINGS = [];

const HEADERS = ["Asset", "Network", "Quantity", "Avg Entry", "Current Price", "Value", "P&L", "P&L %"];

export default function PortfolioPage() {
  const { authenticated } = usePrivy();

  const totalValue = MOCK_HOLDINGS.reduce((s, h) => s + h.value, 0);
  const totalPnl = MOCK_HOLDINGS.reduce((s, h) => s + h.pnl, 0);
  const totalPnlPct = totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0;

  if (!authenticated) {
    return (
      <div style={{ padding: "32px 4vw 60px", maxWidth: 1400, margin: "0 auto", color: C.text }}>
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, textAlign: "center" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textFaint }}>
            Sign in to view your portfolio.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@500;600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        tr:hover td { background: rgba(255,255,255,0.02); }
      `}</style>

      <div style={{ padding: "32px 4vw 60px", color: C.text, maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: C.silverBright, margin: 0 }}>Portfolio</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>
            Assets accumulated by your DCA bot
          </p>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total Value", value: `$${totalValue.toFixed(2)}`, sub: "across all strategies" },
            { label: "Total P&L", value: totalPnl >= 0 ? `+$${totalPnl.toFixed(2)}` : `-$${Math.abs(totalPnl).toFixed(2)}`, sub: `${totalPnlPct >= 0 ? "+" : ""}${totalPnlPct.toFixed(2)}% overall`, accent: totalPnl >= 0 ? C.silverBright : C.red },
            { label: "Assets Held", value: MOCK_HOLDINGS.length.toString(), sub: "from DCA strategies" },
          ].map((s, i) => (
            <div key={i} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 22px" }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: s.accent || C.textDim, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: C.textFaint }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Holdings table */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: C.silverBright }}>Holdings</div>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textFaint }}>{MOCK_HOLDINGS.length} assets</span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {HEADERS.map(h => (
                  <th key={h} style={{
                    textAlign: "left", fontFamily: "'Inter', sans-serif",
                    fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em",
                    color: C.textFaint, padding: "12px 22px",
                    borderBottom: `1px solid ${C.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_HOLDINGS.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px 22px", textAlign: "center" }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textFaint, marginBottom: 8 }}>
                      No assets yet
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint }}>
                      Your DCA bot holdings will appear here once it executes its first trades.
                    </div>
                  </td>
                </tr>
              ) : (
                MOCK_HOLDINGS.map((h, i) => (
                  <tr key={i}>
                    <td style={{ padding: "14px 22px", borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={h.logo} alt={h.name} style={{ width: 28, height: 28, borderRadius: "50%" }} />
                        <div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: C.silverBright }}>{h.symbol}</div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.textFaint }}>{h.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 22px", borderBottom: `1px solid rgba(255,255,255,0.04)`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.textDim }}>{h.network}</td>
                    <td style={{ padding: "14px 22px", borderBottom: `1px solid rgba(255,255,255,0.04)`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.text }}>{h.qty}</td>
                    <td style={{ padding: "14px 22px", borderBottom: `1px solid rgba(255,255,255,0.04)`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.text }}>${h.avgEntry.toFixed(2)}</td>
                    <td style={{ padding: "14px 22px", borderBottom: `1px solid rgba(255,255,255,0.04)`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.text }}>${h.currentPrice.toFixed(2)}</td>
                    <td style={{ padding: "14px 22px", borderBottom: `1px solid rgba(255,255,255,0.04)`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.silverBright, fontWeight: 600 }}>${h.value.toFixed(2)}</td>
                    <td style={{ padding: "14px 22px", borderBottom: `1px solid rgba(255,255,255,0.04)`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: h.pnl >= 0 ? C.green : C.red, fontWeight: 600 }}>
                      {h.pnl >= 0 ? "+" : ""}${h.pnl.toFixed(2)}
                    </td>
                    <td style={{ padding: "14px 22px", borderBottom: `1px solid rgba(255,255,255,0.04)`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: h.pnlPct >= 0 ? C.green : C.red }}>
                      {h.pnlPct >= 0 ? "+" : ""}{h.pnlPct.toFixed(2)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
