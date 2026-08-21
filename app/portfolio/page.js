"use client";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Lock } from "lucide-react";

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

const NETWORKS = [
  { id: "solana", name: "Solana", color: "#9945FF", logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png", locked: false },
  { id: "bnb", name: "BNB", color: "#F3BA2F", logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png", locked: true },
  { id: "ethereum", name: "Ethereum", color: "#627EEA", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", locked: true },
  { id: "hyperliquid", name: "Hyperliquid", color: "#14F195", logo: "https://app.pacifica.fi/imgs/tokens/HYPE.svg", locked: true },
];

const MOCK_HOLDINGS = [];
const HEADERS = ["Asset", "Network", "Quantity", "Avg Entry", "Current Price", "Value", "P&L", "P&L %"];

function NetworkSelector({ selected, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
      {NETWORKS.map(network => (
        <button
          key={network.id}
          onClick={() => !network.locked && onSelect(network)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px", borderRadius: 99,
            background: selected.id === network.id ? `${network.color}22` : "rgba(255,255,255,0.04)",
            border: `1.5px solid ${selected.id === network.id ? network.color : "rgba(255,255,255,0.1)"}`,
            color: network.locked ? C.textFaint : selected.id === network.id ? C.silverBright : C.textDim,
            fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14,
            cursor: network.locked ? "not-allowed" : "pointer",
            opacity: network.locked ? 0.5 : 1,
            transition: "all .15s",
          }}
        >
          <img src={network.logo} style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "contain" }} alt={network.name} onError={e => { e.target.style.display = "none"; }} />
          {network.name}
          {network.locked && <Lock size={11} />}
        </button>
      ))}
    </div>
  );
}

function DepositModal({ onClose, user }) {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 500 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 501, width: "min(500px, 95vw)", background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,0.9)" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: 20, fontWeight: 600, color: C.silverBright }}>Deposit on</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: C.textDim, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <NetworkSelector selected={selectedNetwork} onSelect={setSelectedNetwork} />

        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, marginBottom: 8 }}>
            Your {selectedNetwork.name} deposit address
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.silver, wordBreak: "break-all", lineHeight: 1.6 }}>
            {user?.wallet?.address || "— Sign in with a wallet to see your address —"}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>
            Only send <strong style={{ color: C.silverBright }}>SOL</strong> or <strong style={{ color: C.silverBright }}>USDC</strong> on the <strong style={{ color: C.silverBright }}>{selectedNetwork.name}</strong> network to this address. Sending other assets or using a different network may result in <strong style={{ color: C.red }}>permanent loss of funds</strong>.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 12, padding: "12px 14px" }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,107,107,0.8)", lineHeight: 1.6 }}>
            Always double-check the network before sending. Transactions on blockchain are irreversible.
          </div>
        </div>
      </div>
    </>
  );
}

function WithdrawModal({ onClose, user }) {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 500 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 501, width: "min(500px, 95vw)", background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,0.9)" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: 20, fontWeight: 600, color: C.silverBright }}>Withdraw from</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: C.textDim, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <NetworkSelector selected={selectedNetwork} onSelect={setSelectedNetwork} />

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, display: "block", marginBottom: 7 }}>Amount</label>
          <input
            type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
            style={{ width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: C.silverBright, fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, padding: "11px 14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, display: "block", marginBottom: 7 }}>Destination address</label>
          <input
            type="text" placeholder={`Your ${selectedNetwork.name} address...`} value={address} onChange={e => setAddress(e.target.value)}
            style={{ width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: C.silverBright, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, padding: "11px 14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,107,107,0.8)", lineHeight: 1.6 }}>
            Always double-check the destination address. Transactions on blockchain are irreversible.
          </div>
        </div>

        <button style={{ width: "100%", padding: "13px", borderRadius: 10, background: "transparent", border: "1px solid rgba(192,192,192,0.3)", color: C.silverBright, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Withdraw from {selectedNetwork.name}
        </button>
      </div>
    </>
  );
}

export default function PortfolioPage() {
  const { authenticated, user } = usePrivy();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const totalValue = MOCK_HOLDINGS.reduce((s, h) => s + h.value, 0);
  const totalPnl = MOCK_HOLDINGS.reduce((s, h) => s + h.pnl, 0);
  const totalPnlPct = totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0;

  if (!authenticated) {
    return (
      <div style={{ padding: "32px 4vw 60px", maxWidth: 1400, margin: "0 auto", color: C.text }}>
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, textAlign: "center" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textFaint }}>Sign in to view your portfolio.</div>
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
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: C.silverBright, margin: 0 }}>Portfolio</h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>Assets accumulated by your DCA bot</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setDepositOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, background: "linear-gradient(135deg,#E8E8E8,#B0B0B0)", color: "#0A0A0A", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}
            >
              ↓ Deposit
            </button>
            <button
              onClick={() => setWithdrawOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, background: "transparent", border: "1px solid rgba(192,192,192,0.3)", color: C.silverBright, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              ↑ Withdraw
            </button>
          </div>
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
                  <th key={h} style={{ textAlign: "left", fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, padding: "12px 22px", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} style={{ padding: "48px 22px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textFaint, marginBottom: 8 }}>No assets yet</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint }}>Your DCA bot holdings will appear here once it executes its first trades.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {depositOpen && <DepositModal onClose={() => setDepositOpen(false)} user={user} />}
      {withdrawOpen && <WithdrawModal onClose={() => setWithdrawOpen(false)} user={user} />}
    </>
  );
}
