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

export default function AccountPage() {
  const { user, authenticated } = usePrivy();

  const displayName = user?.email?.address?.split("@")[0] || user?.wallet?.address?.slice(0, 6) || "User";
  const avatarLetter = displayName[0]?.toUpperCase() || "?";
  const avatarPicture = user?.google?.picture || user?.twitter?.profilePictureUrl || null;

  const [pseudo, setPseudo] = useState(displayName);
  const [savedPseudo, setSavedPseudo] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAsset, setDepositAsset] = useState("USDC");
  const [withdrawAsset, setWithdrawAsset] = useState("USDC");

  const handleSavePseudo = () => {
    setSavedPseudo(true);
    setTimeout(() => setSavedPseudo(false), 2000);
  };

  if (!authenticated) {
    return (
      <div style={{ padding: "32px 4vw 60px", maxWidth: 1400, margin: "0 auto", color: C.text }}>
        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, textAlign: "center" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textFaint }}>
            Sign in to access your account.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@500;600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .ac-input { width: 100%; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #F2F2F2; font-family: 'Inter', sans-serif; font-size: 14px; padding: 11px 14px; outline: none; box-sizing: border-box; transition: border-color .15s; }
        .ac-input:focus { border-color: rgba(192,192,192,0.35); }
        .ac-select { width: 100%; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #F2F2F2; font-family: 'Inter', sans-serif; font-size: 14px; padding: 11px 14px; outline: none; appearance: none; box-sizing: border-box; cursor: pointer; }
        .ac-label { font-family: 'Inter', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(230,230,230,0.35); margin-bottom: 7px; display: block; }
        .ac-card { background: #111111; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; }
      `}</style>

      <div style={{ padding: "32px 4vw 60px", color: C.text, maxWidth: 1400, margin: "0 auto" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: C.silverBright, margin: 0 }}>Account</h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>
            Manage your profile and wallet
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 860 }}>

          {/* Profile card */}
          <div className="ac-card" style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 20 }}>
              Profile
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
              {/* Avatar */}
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(192,192,192,0.1)",
                  border: "1px solid rgba(192,192,192,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Inter', sans-serif", fontWeight: 700,
                  fontSize: 26, color: C.silverBright, overflow: "hidden", flexShrink: 0,
                }}>
                  {avatarPicture ? (
                    <img src={avatarPicture} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />
                  ) : (
                    avatarLetter
                  )}
                </div>
                <button style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 24, height: 24, borderRadius: "50%",
                  background: "#1a1a1a", border: "1px solid rgba(192,192,192,0.3)",
                  color: C.silver, fontSize: 11, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  ✎
                </button>
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, color: C.silverBright }}>{pseudo}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, marginTop: 3 }}>
                  {user?.email?.address || user?.wallet?.address || "—"}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="ac-label">Username</label>
              <input
                type="text"
                className="ac-input"
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                placeholder="Your username"
              />
            </div>

            <button
              onClick={handleSavePseudo}
              style={{
                padding: "10px 22px", borderRadius: 8,
                background: savedPseudo ? "rgba(111,207,151,0.15)" : "linear-gradient(135deg,#E8E8E8,#B0B0B0)",
                border: savedPseudo ? "1px solid rgba(111,207,151,0.3)" : "none",
                color: savedPseudo ? C.green : "#0A0A0A",
                fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13,
                cursor: "pointer", transition: "all .2s",
              }}
            >
              {savedPseudo ? "✓ Saved" : "Save changes"}
            </button>
          </div>

          {/* Deposit card */}
          <div className="ac-card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 16 }}>↓</span>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: C.silverBright }}>Deposit</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="ac-label">Asset</label>
              <select className="ac-select" value={depositAsset} onChange={e => setDepositAsset(e.target.value)}>
                <option>USDC</option>
                <option>SOL</option>
                <option>ETH</option>
                <option>BTC</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="ac-label">Amount</label>
              <input
                type="number"
                className="ac-input"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.textFaint, marginBottom: 4 }}>Your wallet address</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.silver }}>
                {user?.wallet?.address || "Connect a wallet to deposit"}
              </div>
            </div>

            <button style={{
              width: "100%", padding: "12px", borderRadius: 8,
              background: "linear-gradient(135deg,#E8E8E8,#B0B0B0)",
              border: "none", color: "#0A0A0A",
              fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14,
              cursor: "pointer",
            }}>
              Deposit {depositAsset}
            </button>
          </div>

          {/* Withdraw card */}
          <div className="ac-card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 16 }}>↑</span>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: C.silverBright }}>Withdraw</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="ac-label">Asset</label>
              <select className="ac-select" value={withdrawAsset} onChange={e => setWithdrawAsset(e.target.value)}>
                <option>USDC</option>
                <option>SOL</option>
                <option>ETH</option>
                <option>BTC</option>
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="ac-label">Amount</label>
              <input
                type="number"
                className="ac-input"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="ac-label">Destination address</label>
              <input
                type="text"
                className="ac-input"
                placeholder="0x... or wallet address"
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
              Withdraw {withdrawAsset}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
