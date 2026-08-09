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
};

const FEATURES_MONTHLY = [
  "1 active DCA strategy",
  "Up to 3 accumulation zones",
  "Live backtest (60 days)",
  "Jupiter, Uniswap, PancakeSwap",
  "Email support",
];

const FEATURES_ANNUAL = [
  "Unlimited DCA strategies",
  "Unlimited accumulation zones",
  "Live backtest (60 days)",
  "All DEX integrations",
  "Dynamic allocation",
  "Smart exit rules",
  "Priority support",
  "Early access to new features",
];

const FEATURES_ENTERPRISE = [
  "Everything in Annual",
  "Custom DEX integration",
  "Dedicated infrastructure",
  "White-label option",
  "SLA & uptime guarantee",
  "Direct access to the team",
  "Custom onboarding",
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .plan-card { background: #111111; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; display: flex; flex-direction: column; }
        .plan-card.featured { background: #1a1a1a; border-color: rgba(192,192,192,0.3); }
        .feature-item { display: flex; align-items: center; gap: 10px; font-family: 'Inter', sans-serif; font-size: 13.5px; color: rgba(230,230,230,0.7); margin-bottom: 10px; }
        .feature-check { color: #C0C0C0; font-size: 12px; flex-shrink: 0; }
        .toggle-pill { display: flex; align-items: center; gap: 0; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; }
        .toggle-opt { padding: 8px 20px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all .15s; }
        .toggle-opt.active { background: rgba(192,192,192,0.15); color: #F2F2F2; }
        .toggle-opt.inactive { background: transparent; color: rgba(230,230,230,0.4); }
      `}</style>

      <div style={{ padding: "48px 4vw 80px", color: C.text, maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textFaint, marginBottom: 14 }}>
            Pricing
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: C.silverBright, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            Simple, transparent pricing.
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: C.textDim, maxWidth: 480, margin: "0 auto 32px" }}>
            Start accumulating smarter. Upgrade or cancel anytime.
          </p>

          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div className="toggle-pill">
              <button className={`toggle-opt ${!annual ? "active" : "inactive"}`} onClick={() => setAnnual(false)}>Monthly</button>
              <button className={`toggle-opt ${annual ? "active" : "inactive"}`} onClick={() => setAnnual(true)}>Annual</button>
            </div>
            {annual && (
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.silver, background: "rgba(192,192,192,0.08)", border: "1px solid rgba(192,192,192,0.2)", borderRadius: 20, padding: "3px 10px" }}>
                Save $89.89
              </span>
            )}
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, maxWidth: 1000, margin: "0 auto" }}>

          {/* Monthly */}
          <div className="plan-card">
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.textFaint, marginBottom: 16 }}>Starter</div>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: C.silverBright }}>
                ${annual ? "12.49" : "19.99"}
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textDim, marginLeft: 6 }}>/month</span>
              {annual && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, marginTop: 4 }}>Billed $149.99/year</div>}
            </div>
            <div style={{ flex: 1, marginBottom: 28 }}>
              {FEATURES_MONTHLY.map((f, i) => (
                <div key={i} className="feature-item">
                  <span className="feature-check">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button style={{ width: "100%", padding: "13px", borderRadius: 10, background: "transparent", border: "1px solid rgba(192,192,192,0.3)", color: C.silverBright, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Get Started
            </button>
          </div>

          {/* Annual */}
          <div className="plan-card featured" style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.silverBright, color: "#080808", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.08em" }}>
              MOST POPULAR
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.textFaint, marginBottom: 16 }}>Pro</div>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: C.silverBright }}>
                $149.99
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textDim, marginLeft: 6 }}>/year</span>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, marginTop: 4 }}>≈ $12.49/month</div>
            </div>
            <div style={{ flex: 1, marginBottom: 28 }}>
              {FEATURES_ANNUAL.map((f, i) => (
                <div key={i} className="feature-item">
                  <span className="feature-check">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button style={{ width: "100%", padding: "13px", borderRadius: 10, background: "linear-gradient(135deg,#E8E8E8,#B0B0B0)", border: "none", color: "#080808", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Get Started
            </button>
          </div>

          {/* Enterprise */}
          <div className="plan-card">
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.textFaint, marginBottom: 16 }}>Enterprise</div>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: C.silverBright }}>
                Custom
              </span>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textDim, marginTop: 4 }}>Tailored to your needs</div>
            </div>
            <div style={{ flex: 1, marginBottom: 28 }}>
              {FEATURES_ENTERPRISE.map((f, i) => (
                <div key={i} className="feature-item">
                  <span className="feature-check">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <a
              href="mailto:contact@zillaengine.xyz"
              style={{ width: "100%", padding: "13px", borderRadius: 10, background: "transparent", border: "1px solid rgba(192,192,192,0.3)", color: C.silverBright, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", textAlign: "center", textDecoration: "none", display: "block" }}
            >
              Contact Us
            </a>
          </div>

        </div>

        {/* Bottom note */}
        <div style={{ textAlign: "center", marginTop: 40, fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.textFaint }}>
          All plans include a 7-day free trial. No credit card required to start.
        </div>

      </div>
    </>
  );
}
