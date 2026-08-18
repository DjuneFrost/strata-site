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

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 8.99,
    annualPrice: 7.49,
    annualTotal: 89.99,
    features: [
      "1 active DCA strategy",
      "Up to 2 accumulation zones",
      "Solana only",
      "Email support",
    ],
    featured: false,
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 15.99,
    annualPrice: 12.99,
    annualTotal: 155.99,
    features: [
      "3 active DCA strategies",
      "Up to 4 accumulation zones",
      "Live backtest (60 days)",
      "Jupiter, Uniswap, PancakeSwap",
      "Email support",
    ],
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: null,
    annualPrice: null,
    annualTotal: 99.99,
    yearOnly: true,
    features: [
      "Unlimited DCA strategies",
      "Unlimited accumulation zones",
      "Live backtest (60 days)",
      "All DEX integrations",
      "Dynamic allocation",
      "Smart exit rules",
      "Priority support",
      "Early access to new features",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    custom: true,
    features: [
      "Everything in Pro",
      "Custom DEX integration",
      "Dedicated infrastructure",
      "White-label option",
      "SLA & uptime guarantee",
      "Direct access to the team",
      "Custom onboarding",
    ],
    featured: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .plan-card { background: #111111; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 28px; display: flex; flex-direction: column; }
        .plan-card.featured { background: #1a1a1a; border-color: rgba(192,192,192,0.3); }
        .feature-item { display: flex; align-items: center; gap: 10px; font-family: 'Inter', sans-serif; font-size: 13px; color: rgba(230,230,230,0.7); margin-bottom: 9px; }
        .feature-check { color: #C0C0C0; font-size: 12px; flex-shrink: 0; }
        .toggle-pill { display: flex; align-items: center; gap: 0; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; }
        .toggle-opt { padding: 8px 20px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all .15s; }
        .toggle-opt.active { background: rgba(192,192,192,0.15); color: #F2F2F2; }
        .toggle-opt.inactive { background: transparent; color: rgba(230,230,230,0.4); }
      `}</style>

      <div style={{ padding: "32px 4vw 80px", color: C.text, maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.textFaint, marginBottom: 14 }}>
            Pricing
          </div>
          <h1 style={{ fontFamily: "'Newsreader', serif", fontStyle: "italic", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500, color: C.silverBright, margin: "0 0 16px" }}>
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
                Save up to 20%
              </span>
            )}
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 1200, margin: "0 auto" }}>
          {PLANS.map(plan => (
            <div key={plan.id} className={`plan-card${plan.featured ? " featured" : ""}`} style={{ position: "relative" }}>
              {plan.featured && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.silverBright, color: "#080808", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.08em" }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: C.textFaint, marginBottom: 16 }}>{plan.name}</div>

              <div style={{ marginBottom: 24 }}>
                {plan.custom ? (
                  <>
                    <span style={{ fontFamily: "'Newsreader', serif", fontSize: 38, fontWeight: 600, color: C.silverBright }}>Custom</span>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, marginTop: 4 }}>Tailored to your needs</div>
                  </>
                ) : plan.yearOnly ? (
                  <>
                    <span style={{ fontFamily: "'Newsreader', serif", fontSize: 38, fontWeight: 600, color: C.silverBright }}>${plan.annualTotal}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textDim, marginLeft: 6 }}>/year</span>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, marginTop: 4 }}>≈ $8.33/month</div>
                  </>
                ) : (
                  <>
                    <span style={{ fontFamily: "'Newsreader', serif", fontSize: 38, fontWeight: 600, color: C.silverBright }}>
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textDim, marginLeft: 6 }}>/month</span>
                    {annual && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, marginTop: 4 }}>Billed ${plan.annualTotal}/year</div>}
                  </>
                )}
              </div>

              <div style={{ flex: 1, marginBottom: 24 }}>
                {plan.features.map((f, i) => (
                  <div key={i} className="feature-item">
                    <span className="feature-check">✓</span>
                    {f}
                  </div>
                ))}
              </div>

              {plan.custom ? (
                <a
                  href="mailto:contact@zillaengine.xyz"
                  style={{ width: "100%", padding: "12px", borderRadius: 10, background: "transparent", border: "1px solid rgba(192,192,192,0.3)", color: C.silverBright, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", textAlign: "center", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}
                >
                  Contact Us
                </a>
              ) : (
                <button style={{ width: "100%", padding: "12px", borderRadius: 10, background: plan.featured ? "linear-gradient(135deg,#E8E8E8,#B0B0B0)" : "transparent", border: plan.featured ? "none" : "1px solid rgba(192,192,192,0.3)", color: plan.featured ? "#080808" : C.silverBright, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  Get Started
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40, fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.textFaint }}>
          All plans include a 7-day free trial. No credit card required to start.
        </div>
      </div>
    </>
  );
}
