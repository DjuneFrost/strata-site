"use client";
import { useState } from "react";

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

const DEXES = [
  {
    id: "jupiter",
    name: "Jupiter",
    logo: "https://jup.ag/favicon.ico",
    chain: "Solana",
    color: "#C7F284",
  },
  {
    id: "uniswap",
    name: "Uniswap",
    logo: "https://app.uniswap.org/favicon.png",
    chain: "Ethereum",
    color: "#FF007A",
  },
  {
    id: "pancakeswap",
    name: "PancakeSwap",
    logo: "https://pancakeswap.finance/favicon.ico",
    chain: "BNB Chain",
    color: "#1FC7D4",
  },
];

function DexCard({ dex }) {
  const [connected, setConnected] = useState(false);

  return (
    <div style={{
      background: "#1a1a1a",
      border: `1px solid ${connected ? "rgba(111,207,151,0.25)" : "rgba(255,255,255,0.1)"}`,
      borderRadius: 20,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 20,
      transition: "border-color .2s",
       width: 320,
flexShrink: 0,
    }}>
      {/* Top: logo + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 16,
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <img
            src={dex.logo}
            alt={dex.name}
            style={{ width: 44, height: 44, objectFit: "contain" }}
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: C.silverBright }}>
            {dex.name}
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textFaint, marginTop: 4 }}>
            {dex.chain}
          </div>
        </div>
        {connected && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.green, background: "rgba(111,207,151,0.08)", border: "1px solid rgba(111,207,151,0.25)", borderRadius: 20, padding: "4px 12px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block" }} />
            Connected
          </div>
        )}
      </div>

      {/* Bottom: connect button */}
      <button
        onClick={() => setConnected(!connected)}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 12,
          border: "none",
          background: connected ? "rgba(255,107,107,0.1)" : "#0a0a0a",
          color: connected ? C.red : C.silverBright,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          transition: "all .2s",
        }}
      >
        {connected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      <div style={{ padding: "32px 4vw 60px", color: C.text, maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, color: C.silverBright, margin: 0 }}>Settings</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>
            Connect your DEX to enable live bot trading
          </p>
        </div>

        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.textFaint, fontWeight: 600, marginBottom: 16 }}>
          DEX Connections
        </div>

         <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          {DEXES.map(dex => (
            <DexCard key={dex.id} dex={dex} />
          ))}
        </div>
      </div>
    </>
  );
}
