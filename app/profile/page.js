"use client";

const C = {
  bg: "#0A0A0A",
  panel: "#111111",
  border: "rgba(255,255,255,0.08)",
  text: "#E6E6E6",
  textDim: "rgba(230,230,230,0.45)",
  textFaint: "rgba(230,230,230,0.3)",
  silver: "#C0C0C0",
  silverBright: "#F2F2F2",
  red: "#ff6b6b",
};

// TODO: replace with real data from your bot's trade log / database
const MOCK_TRADES = [
  { date: "Jun 24, 2026", side: "Buy", zone: "Zone 1", amount: "$50.00", price: "$61,204.00", qty: "0.000817" },
  { date: "Jun 17, 2026", side: "Buy", zone: "Zone 2", amount: "$80.00", price: "$58,940.00", qty: "0.001357" },
  { date: "Jun 10, 2026", side: "Buy", zone: "Zone 1", amount: "$50.00", price: "$57,110.00", qty: "0.000876" },
  { date: "Jun 03, 2026", side: "Sell", zone: "Take profit", amount: "$120.00", price: "$60,332.00", qty: "0.001989" },
  { date: "May 27, 2026", side: "Buy", zone: "Zone 3", amount: "$110.00", price: "$55,870.00", qty: "0.001969" },
];

function StatBlock({ label, value, sub, accent }) {
  return (
    <div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: accent || C.text }}>{value}</div>
      {sub && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.textFaint, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@500;600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .pf-card { background: ${C.panel}; border: 1px solid ${C.border}; border-radius: 12px; }
      `}</style>

      <div style={{ padding: "32px 36px 60px", color: C.text }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: C.silverBright, margin: 0 }}>Profile</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>Wallet performance & DCA bot history</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, marginBottom: 16 }}>

          {/* Profile + P&L card */}
          <div className="pf-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%", background: "rgba(192,192,192,0.08)",
                  border: "1px solid rgba(192,192,192,0.25)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: C.silver,
                }}>
                  J
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: C.silverBright }}>@Jonathan</div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.silver, background: "rgba(192,192,192,0.08)", border: "1px solid rgba(192,192,192,0.25)", borderRadius: 6, padding: "2px 8px", marginTop: 4 }}>
                    ✓ Wallet
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
              Profit / Loss <span style={{ background: "rgba(192,192,192,0.08)", border: "1px solid rgba(192,192,192,0.2)", color: C.silver, borderRadius: 5, padding: "1px 6px", marginLeft: 6, fontSize: 10 }}>DCA BOT · 13 FILLS</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Newsreader', serif", fontSize: 38, fontWeight: 600, color: C.silverBright }}>+$0.93</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: C.silver }}>↑ +1.28%</span>
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: C.textFaint, marginBottom: 20 }}>
              realized +$1 · open +$0 · 1d since first fill · $73 start
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <StatBlock label="Account Value" value="$71.73" sub="$72 collateral" />
              <StatBlock label="Open P&L" value="+$0.06" sub="4 positions" accent={C.silverBright} />
              <StatBlock label="Realized · All" value="+$0.04" sub="13 fills" accent={C.silverBright} />
            </div>
          </div>

          {/* Performance & behavior card */}
          <div className="pf-card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 20 }}>
              Performance & Behavior
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <StatBlock label="Win Rate" value="50%" sub="2 closed trades" accent={C.silverBright} />
              <StatBlock label="Avg Leverage" value="1.0x" sub="spot only" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <StatBlock label="Sharpe" value="—" />
              <StatBlock label="Max DD" value="-$0" accent={C.red} />
              <StatBlock label="Maker" value="0%" />
              <StatBlock label="Buy / Sell" value="57 / 43" />
              <StatBlock label="Volume" value="$301" />
              <StatBlock label="Fills" value="13" />
              <StatBlock label="Markets" value="1" />
              <StatBlock label="Last Fill" value="2h 3m ago" />
            </div>
          </div>
        </div>

        {/* Trade history */}
        <div className="pf-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: C.silverBright }}>Bot Trade History</div>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textFaint }}>{MOCK_TRADES.length} fills</span>
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
              {MOCK_TRADES.map((t, i) => (
                <tr key={i}>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: C.text }}>{t.date}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: t.side === "Buy" ? C.silverBright : C.red, fontWeight: 600 }}>{t.side}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: C.textDim }}>{t.zone}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: C.text }}>{t.amount}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: C.text }}>{t.price}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: C.text }}>{t.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
