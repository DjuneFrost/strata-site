"use client";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Lock, ChevronDown, ChevronUp } from "lucide-react";

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

const CEXES = [
  {
    id: "bybit",
    name: "Bybit",
    logo: "https://www.bybit.com/favicon.ico",
    color: "#F7A600",
    colorDim: "rgba(247,166,0,0.08)",
    colorBorder: "rgba(247,166,0,0.25)",
    fields: [
      { key: "apiKey", label: "API Key", placeholder: "Enter your Bybit API Key" },
      { key: "secretKey", label: "Secret Key", placeholder: "Enter your Bybit Secret Key" },
    ],
    docsUrl: "https://www.bybit.com/app/user/api-management",
  },
  {
    id: "backpack",
    name: "Backpack",
    logo: "https://backpack.exchange/coins/bp.svg",
    color: "#E33B3B",
    colorDim: "rgba(227,59,59,0.08)",
    colorBorder: "rgba(227,59,59,0.25)",
    fields: [
      { key: "apiKey", label: "API Key", placeholder: "Enter your Backpack API Key" },
      { key: "secretKey", label: "Secret Key", placeholder: "Enter your Backpack Secret Key" },
    ],
    docsUrl: "https://backpack.exchange/portfolio/settings",
  },
];

function CexCard({ cex }) {
  const [connected, setConnected] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSave = () => {
    const allFilled = cex.fields.every(f => values[f.key]?.trim());
    if (!allFilled) { showToast("Please fill all fields."); return; }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setConnected(true);
      setExpanded(false);
      showToast("Connected to " + cex.name + "!");
    }, 800);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setValues({});
    setExpanded(false);
    showToast("Disconnected from " + cex.name + ".");
  };

  return (
    <div style={{
      background: C.panel,
      border: `1px solid ${connected ? "rgba(111,207,151,0.25)" : C.border}`,
      borderRadius: 16,
      overflow: "hidden",
      transition: "border-color .2s",
    }}>
      {/* Header */}
      <div style={{
        background: cex.colorDim,
        borderBottom: `1px solid ${cex.colorBorder}`,
        padding: "20px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <img
              src={cex.logo}
              alt={cex.name}
              style={{ width: 26, height: 26, objectFit: "contain" }}
              onError={e => { e.target.style.display = "none"; }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 20, fontWeight: 600, color: C.silverBright }}>
              {cex.name}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.textFaint, marginTop: 2 }}>
              Centralized Exchange
            </div>
          </div>
        </div>

        {connected && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
            color: C.green, background: "rgba(111,207,151,0.08)",
            border: "1px solid rgba(111,207,151,0.25)", borderRadius: 20, padding: "5px 12px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block" }} />
            Connected
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "0 24px 20px" }}>
        {connected ? (
          <div style={{ paddingTop: 20 }}>
            <div style={{
              background: "rgba(111,207,151,0.05)", border: "1px solid rgba(111,207,151,0.15)",
              borderRadius: 10, padding: "14px 16px", marginBottom: 16,
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.textDim, lineHeight: 1.6,
            }}>
              Your API keys are saved and encrypted. The bot can now execute trades on {cex.name}.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setConnected(false); setExpanded(true); }}
                style={{
                  flex: 1, padding: "11px", borderRadius: 8,
                  background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                  color: C.textDim, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Edit Keys
              </button>
              <button
                onClick={handleDisconnect}
                style={{
                  flex: 1, padding: "11px", borderRadius: 8,
                  background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)",
                  color: C.red, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Toggle button */}
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 0", background: "transparent", border: "none",
                borderTop: `1px solid ${C.border}`, color: C.textDim,
                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                cursor: "pointer", marginTop: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Lock size={13} color="rgba(192,192,192,0.6)" />
                Connect API Keys
              </div>
              {expanded
                ? <ChevronUp size={14} color="rgba(192,192,192,0.6)" />
                : <ChevronDown size={14} color="rgba(192,192,192,0.6)" />
              }
            </button>

            {/* Collapsible form */}
            {expanded && (
              <div>
                {/* Security notice */}
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10, padding: "12px 14px", marginBottom: 18,
                }}>
                  <Lock size={13} color="rgba(192,192,192,0.5)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, lineHeight: 1.6 }}>
                    Enable <strong style={{ color: C.text }}>Read + Trade permissions only</strong> — never enable withdrawals. Your keys are encrypted and stored securely.{" "}
                    <a href={cex.docsUrl} target="_blank" rel="noreferrer" style={{ color: C.silver, textDecoration: "underline" }}>
                      Get your API keys →
                    </a>
                  </div>
                </div>

                {/* Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
                  {cex.fields.map(field => (
                    <div key={field.key}>
                      <label style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 11,
                        textTransform: "uppercase", letterSpacing: "0.06em",
                        color: C.textFaint, display: "block", marginBottom: 7,
                      }}>
                        {field.label}
                      </label>
                      <input
                        type={showKeys ? "text" : "password"}
                        placeholder={field.placeholder}
                        value={values[field.key] || ""}
                        onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                        style={{
                          width: "100%", background: "#0a0a0a",
                          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                          color: C.silverBright, fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: 13, padding: "11px 14px", outline: "none", boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
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
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 8,
                    background: saving ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#E8E8E8,#B0B0B0)",
                    border: "none",
                    color: saving ? C.textFaint : "#0A0A0A",
                    fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  {saving ? "Connecting..." : `Connect to ${cex.name}`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
          color: C.text, padding: "12px 20px", borderRadius: 10,
          fontSize: 13, fontFamily: "'Inter', sans-serif", zIndex: 9999,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

export default function CexPage() {
  const { authenticated } = usePrivy();

  if (!authenticated) {
    return (
      <div style={{ padding: "32px 4vw 60px", maxWidth: 1400, margin: "0 auto", color: "#E6E6E6" }}>
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, textAlign: "center" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textFaint }}>
            Sign in to manage your CEX connections.
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
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: C.silverBright, margin: 0 }}>CEX Connection</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>
            Connect your exchange API keys to enable live bot trading
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16, maxWidth: 860 }}>
          {CEXES.map(cex => (
            <CexCard key={cex.id} cex={cex} />
          ))}
        </div>

        {/* Security tips */}
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginTop: 24, maxWidth: 860 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: C.silverBright, marginBottom: 12 }}>
            <Lock size={14} color={C.silver} />
            Security best practices
          </div>
          {[
            "Enable Spot Trading permissions only — never enable withdrawals.",
            "Restrict API access to Zilla Engine's IP address if your exchange allows it.",
            "Rotate your API keys every 90 days.",
            "Never share your Secret Key with anyone.",
          ].map((tip, i) => (
            <div key={i} style={{
              display: "flex", gap: 10,
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
