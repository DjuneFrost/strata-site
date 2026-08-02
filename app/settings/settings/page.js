"use client";
import { useState } from "react";

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
  green: "#6fcf97",
};

const EXCHANGES = [
  {
    id: "binance",
    name: "Binance",
    logo: "https://cryptologos.cc/logos/binance-bnb-logo.png",
    fields: ["API Key", "Secret Key"],
    passphrase: false,
    color: "#F3BA2F",
  },
  {
    id: "bybit",
    name: "Bybit",
    logo: "https://cryptologos.cc/logos/bybit-logo.png",
    fields: ["API Key", "Secret Key"],
    passphrase: false,
    color: "#F7A600",
  },
  {
    id: "coinbase",
    name: "Coinbase Advanced",
    logo: "https://cryptologos.cc/logos/coinbase-coin-logo.png",
    fields: ["API Key", "Secret Key", "Passphrase"],
    passphrase: true,
    color: "#0052FF",
  },
  {
    id: "kraken",
    name: "Kraken",
    logo: "https://cryptologos.cc/logos/kraken-logo.png",
    fields: ["API Key", "Private Key"],
    passphrase: false,
    color: "#5741D9",
  },
  {
    id: "okx",
    name: "OKX",
    logo: "https://cryptologos.cc/logos/okb-okb-logo.png",
    fields: ["API Key", "Secret Key", "Passphrase"],
    passphrase: true,
    color: "#FFFFFF",
  },
];

function ExchangeCard({ exchange }) {
  const [expanded, setExpanded] = useState(false);
  const [connected, setConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [values, setValues] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = () => {
    const allFilled = exchange.fields.every(f => values[f]?.trim());
    if (!allFilled) { showToast("⚠️ Please fill all fields."); return; }
    setSaving(true);
    // TODO: send API keys securely to your backend / encrypt & store in DB
    setTimeout(() => {
      setSaving(false);
      setConnected(true);
      setExpanded(false);
      showToast("✅ Connected successfully!");
    }, 800);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setValues({});
    showToast("🔌 Disconnected.");
  };

  return (
    <div style={{
      background: C.panel,
      border: `1px solid ${connected ? "rgba(111,207,151,0.25)" : C.border}`,
      borderRadius: 12,
      marginBottom: 10,
      overflow: "hidden",
      transition: "border-color .2s",
    }}>
      {/* Header row */}
      <div
        onClick={() => !connected && setExpanded(!expanded)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px", cursor: connected ? "default" : "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
          }}>
            <img
              src={exchange.logo}
              alt={exchange.name}
              style={{ width: 22, height: 22, objectFit: "contain" }}
              onError={e => { e.target.style.display = "none"; }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: C.silverBright }}>
              {exchange.name}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: C.textFaint, marginTop: 2 }}>
              {exchange.passphrase ? "API Key · Secret Key · Passphrase" : "API Key · Secret Key"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {connected ? (
            <>
              <span style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                color: C.green, background: "rgba(111,207,151,0.08)",
                border: "1px solid rgba(111,207,151,0.25)", borderRadius: 20, padding: "4px 10px",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block" }} />
                Connected
              </span>
              <button
                onClick={handleDisconnect}
                style={{
                  background: "transparent", border: "1px solid rgba(255,107,107,0.3)",
                  color: C.red, fontFamily: "'Inter', sans-serif", fontSize: 12,
                  fontWeight: 600, padding: "5px 12px", borderRadius: 8, cursor: "pointer",
                }}
              >
                Disconnect
              </button>
            </>
          ) : (
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: 12,
              color: C.textFaint, display: "flex", alignItems: "center", gap: 6,
            }}>
              {expanded ? "▲ Close" : "▼ Connect"}
            </span>
          )}
        </div>
      </div>

      {/* Expanded form */}
      {expanded && !connected && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "10px 14px", margin: "14px 0 18px",
          }}>
            <span style={{ fontSize: 14 }}>🔒</span>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, lineHeight: 1.6 }}>
              Your API keys are stored securely and never shared. Use <strong style={{ color: C.text }}>read + trade permissions only</strong> — never enable withdrawals.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {exchange.fields.map(field => (
              <div key={field} style={{ gridColumn: field === "Passphrase" && exchange.fields.length === 3 ? "1 / -1" : "auto" }}>
                <label style={{
                  display: "block", fontFamily: "'Inter', sans-serif", fontSize: 11,
                  textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, marginBottom: 6,
                }}>
                  {field}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showKeys ? "text" : "password"}
                    placeholder={`Enter your ${field.toLowerCase()}...`}
                    value={values[field] || ""}
                    onChange={e => setValues(v => ({ ...v, [field]: e.target.value }))}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                      padding: "10px 14px", color: C.text,
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{
              display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
              fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint,
            }}>
              <input
                type="checkbox"
                checked={showKeys}
                onChange={e => setShowKeys(e.target.checked)}
                style={{ accentColor: C.silver }}
              />
              Show keys
            </label>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: saving ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#E8E8E8,#B0B0B0)",
                border: "none", color: saving ? C.textFaint : "#0A0A0A",
                fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
                padding: "10px 22px", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Connecting..." : "Save & Connect"}
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
          color: C.text, padding: "12px 20px", borderRadius: 10,
          fontSize: 13, fontWeight: 500, zIndex: 9999,
          fontFamily: "'Inter', sans-serif",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@500;600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      <div style={{ padding: "32px 36px 60px", color: C.text, maxWidth: 860 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: C.silverBright, margin: 0 }}>Settings</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>
            Connect your exchange API keys to enable live bot trading
          </p>
        </div>

        {/* API Keys section */}
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase",
          letterSpacing: "0.1em", color: C.textFaint, fontWeight: 600, marginBottom: 12,
        }}>
          Exchange Connections
        </div>

        {EXCHANGES.map(ex => (
          <ExchangeCard key={ex.id} exchange={ex} />
        ))}

        {/* Security notice */}
        <div style={{
          marginTop: 24, background: C.panel, border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "18px 20px",
        }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: C.silverBright, marginBottom: 10 }}>
            🔐 Security best practices
          </div>
          {[
            "Enable only Spot Trading permissions — never enable withdrawals.",
            "Restrict API access to Zilla Engine's IP address if your exchange allows it.",
            "Rotate your API keys every 90 days.",
            "Never share your Secret Key or Passphrase with anyone.",
          ].map((tip, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.textDim,
              lineHeight: 1.6, marginBottom: i < 3 ? 6 : 0,
            }}>
              <span style={{ color: C.silver, flexShrink: 0 }}>·</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
