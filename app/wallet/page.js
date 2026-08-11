"use client";
import { useState } from "react";
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

const NETWORKS = [
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    token: "USDC",
    color: "#9945FF",
    colorDim: "rgba(153,69,255,0.12)",
    colorBorder: "rgba(153,69,255,0.3)",
    logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  },
  {
    id: "bnb",
    name: "BNB Chain",
    symbol: "BNB",
    token: "USDC",
    color: "#F3BA2F",
    colorDim: "rgba(243,186,47,0.1)",
    colorBorder: "rgba(243,186,47,0.3)",
    logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  },
  {
    id: "hyperliquid",
    name: "Hyperliquid",
    symbol: "HYPE",
    token: "USDC",
    color: "#14F195",
    colorDim: "rgba(20,241,149,0.08)",
    colorBorder: "rgba(20,241,149,0.25)",
    logo: "https://assets.coingecko.com/coins/images/35809/small/hyperliquid.png",
  },
];

function NetworkCard({ network }) {
  const [tab, setTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div style={{
      background: C.panel,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        background: network.colorDim,
        borderBottom: `1px solid ${network.colorBorder}`,
        padding: "20px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={network.logo}
            alt={network.name}
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "contain" }}
            onError={e => { e.target.style.display = "none"; }}
          />
          <div>
            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 18, fontWeight: 600, color: C.silverBright }}>
              {network.name}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textFaint, marginTop: 2 }}>
              {network.token} · {network.symbol}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textFaint, marginBottom: 4 }}>Balance</div>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 600, color: C.textDim }}>$0.00</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
        {["deposit", "withdraw"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "12px",
              background: "transparent", border: "none",
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
              color: tab === t ? network.color : C.textFaint,
              borderBottom: tab === t ? `2px solid ${network.color}` : "2px solid transparent",
              cursor: "pointer", transition: "all .15s",
              textTransform: "capitalize",
            }}
          >
            {t === "deposit" ? "↓ Deposit" : "↑ Withdraw"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px" }}>
        {tab === "deposit" ? (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, display: "block", marginBottom: 7 }}>
                Amount (USDC)
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                style={{ width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: C.silverBright, fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, padding: "11px 14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.textFaint, marginBottom: 4 }}>
                Send {network.token} to this address on {network.name}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.silver, wordBreak: "break-all" }}>
                — Connect wallet to see address —
              </div>
            </div>
            <button style={{
              width: "100%", padding: "12px", borderRadius: 8,
              background: `linear-gradient(135deg, ${network.color}, ${network.color}cc)`,
              border: "none", color: "#080808",
              fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14,
              cursor: "pointer",
            }}>
              Deposit USDC on {network.name}
            </button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, display: "block", marginBottom: 7 }}>
                Amount (USDC)
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                style={{ width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: C.silverBright, fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, padding: "11px 14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, display: "block", marginBottom: 7 }}>
                Destination address
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder={`${network.symbol} address...`}
                style={{ width: "100%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: C.silverBright, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, padding: "11px 14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <button style={{
              width: "100%", padding: "12px", borderRadius: 8,
              background: "transparent",
              border: "1px solid rgba(192,192,192,0.3)",
              color: C.silverBright,
              fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14,
              cursor: "pointer",
            }}>
              Withdraw USDC from {network.name}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { authenticated } = usePrivy();

  if (!authenticated) {
    return (
      <div style={{ padding: "32px 4vw 60px", maxWidth: 1400, margin: "0 auto", color: C.text }}>
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, textAlign: "center" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textFaint }}>
            Sign in to access your wallet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@500;600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      <div style={{ padding: "32px 4vw 60px", color: C.text, maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: C.silverBright, margin: 0 }}>Wallet</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>
            Manage your funds across networks
          </p>
        </div>

        {/* Total balance */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 6 }}>Total Balance</div>
            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 36, fontWeight: 600, color: C.textDim }}>$0.00</div>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textFaint }}>
            3 networks
          </div>
        </div>

        {/* Network cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {NETWORKS.map(network => (
            <NetworkCard key={network.id} network={network} />
          ))}
        </div>
      </div>
    </>
  );
}
