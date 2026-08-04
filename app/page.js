"use client";
import { useState, useEffect } from "react";

const FEATURES = [
  {
    icon: "◈",
    title: "Zone-Based Accumulation",
    desc: "Set price zones and let the bot deploy capital exactly when the market pulls back — not before, not after.",
  },
  {
    icon: "⬡",
    title: "Multi-Exchange Support",
    desc: "Connect Binance, Bybit, Coinbase, Kraken or OKX via API. One strategy, any exchange.",
  },
  {
    icon: "◎",
    title: "Protection Filters",
    desc: "Trend filters, volatility guards and cooldown periods prevent the bot from buying into the wrong moves.",
  },
  {
    icon: "⟳",
    title: "Live Backtest",
    desc: "Simulate your strategy on 60 days of real price data before putting a single dollar at risk.",
  },
  {
    icon: "◐",
    title: "Dynamic Allocation",
    desc: "Scale position size up in uptrends, down during volatility spikes — automatically.",
  },
  {
    icon: "⊘",
    title: "Smart Exit Rules",
    desc: "Take profit targets, trailing stops, indicator exits. The bot knows when to step back.",
  },
];

const STEPS = [
  { n: "01", title: "Connect your exchange", desc: "Paste your API keys in Settings. Read + trade permissions only — no withdrawals ever needed." },
  { n: "02", title: "Configure your zones", desc: "Define at what pullback depth each layer of capital steps in. Save and name your strategy." },
  { n: "03", title: "Run a backtest", desc: "Simulate 60 days of real price history. Adjust zones until the numbers make sense to you." },
  { n: "04", title: "Activate and monitor", desc: "The bot runs continuously. Check your Profile page for fills, P&L and behavior stats." },
];

export default function LandingPage() {
  const [ticker, setTicker] = useState(null);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,solana,ethereum&vs_currencies=usd&include_24hr_change=true")
      .then(r => r.json())
      .then(d => setTicker([
        { sym: "BTC", price: d.bitcoin?.usd, chg: d.bitcoin?.usd_24h_change },
        { sym: "ETH", price: d.ethereum?.usd, chg: d.ethereum?.usd_24h_change },
        { sym: "SOL", price: d.solana?.usd, chg: d.solana?.usd_24h_change },
      ]))
      .catch(() => {});
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080808; }

        /* Hide the layout navbar on landing page */
        header, nav:not(.lp-nav) { display: none !important; }
main { padding-top: 0 !important; }
        main { padding-top: 0 !important; }

        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 6vw;
          transition: background .3s, border-color .3s, backdrop-filter .3s;
        }
        .lp-nav.scrolled {
          background: rgba(8,8,8,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .lp-hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 130px 6vw 80px;
          text-align: center;
          position: relative;
        }

        .lp-grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
        }

        .lp-glow {
          position: absolute; top: -120px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(192,192,192,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .lp-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(192,192,192,0.6);
          margin-bottom: 24px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .lp-eyebrow::before, .lp-eyebrow::after {
          content: ""; display: block;
          width: 28px; height: 1px; background: rgba(192,192,192,0.3);
        }

        .lp-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 7vw, 88px);
          font-weight: 800;
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: #F2F2F2;
          margin-bottom: 24px;
          max-width: 900px;
        }
        .lp-h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #fff 0%, #909090 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .lp-sub {
          font-family: 'Inter', sans-serif;
          font-size: clamp(15px, 2vw, 17px);
          color: rgba(230,230,230,0.5);
          max-width: 520px;
          line-height: 1.7;
          margin: 0 auto 36px;
        }

        .lp-cta-row {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; flex-wrap: wrap;
        }

        .lp-btn-primary {
          background: #F2F2F2; color: #080808;
          font-family: 'Inter', sans-serif; font-weight: 700;
          font-size: 14px; padding: 14px 30px;
          border-radius: 8px; border: none;
          cursor: pointer; text-decoration: none;
          display: inline-block;
          transition: background .15s, transform .12s;
        }
        .lp-btn-primary:hover { background: #fff; transform: translateY(-1px); }
        .lp-btn-primary:active { transform: translateY(0); }

        .lp-btn-ghost {
          background: transparent; color: rgba(230,230,230,0.7);
          font-family: 'Inter', sans-serif; font-weight: 600;
          font-size: 14px; padding: 13px 24px;
          border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);
          cursor: pointer; text-decoration: none;
          display: inline-block;
          transition: border-color .15s, color .15s;
        }
        .lp-btn-ghost:hover { border-color: rgba(255,255,255,0.35); color: #F2F2F2; }

        .lp-ticker {
          display: flex; align-items: center; justify-content: center;
          gap: 28px; flex-wrap: wrap;
          margin-top: 52px; padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.07);
          width: 100%;
        }
        .lp-ticker-item {
          display: flex; align-items: center; gap: 10px;
          font-family: 'IBM Plex Mono', monospace;
        }

        .lp-section {
          position: relative; z-index: 1;
          max-width: 1120px; margin: 0 auto;
          padding: 80px 6vw;
        }

        .lp-section-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(192,192,192,0.5); margin-bottom: 14px;
        }

        .lp-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 700; letter-spacing: -0.02em;
          color: #F2F2F2; margin-bottom: 48px;
        }

        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; overflow: hidden;
        }

        .lp-feature {
          background: #0D0D0D;
          padding: 28px 26px;
          transition: background .2s;
        }
        .lp-feature:hover { background: #111; }

        .lp-feature-icon {
          font-size: 20px; color: rgba(192,192,192,0.7);
          margin-bottom: 14px; display: block;
        }

        .lp-feature-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #F2F2F2; margin-bottom: 8px;
        }

        .lp-feature-desc {
          font-family: 'Inter', sans-serif;
          font-size: 13.5px; color: rgba(230,230,230,0.45);
          line-height: 1.65;
        }

        .lp-steps {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0; position: relative;
        }
        .lp-steps::before {
          content: ""; position: absolute;
          top: 22px; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(192,192,192,0.2), transparent);
        }

        .lp-step { padding: 0 20px; }

        .lp-step-n {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px; color: rgba(192,192,192,0.5);
          margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
        }
        .lp-step-n::before {
          content: ""; width: 8px; height: 8px; border-radius: 50%;
          background: #C0C0C0; display: block; flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(192,192,192,0.15);
        }

        .lp-step-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #F2F2F2; margin-bottom: 8px;
        }

        .lp-step-desc {
          font-family: 'Inter', sans-serif;
          font-size: 13px; color: rgba(230,230,230,0.45);
          line-height: 1.65;
        }

        .lp-cta-section {
          position: relative; z-index: 1;
          margin: 0 6vw 80px;
          background: #111111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 64px 8vw;
          text-align: center;
          overflow: hidden;
        }
        .lp-cta-section::before {
          content: "";
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 0%, rgba(192,192,192,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .lp-footer {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 24px 6vw;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px; color: rgba(230,230,230,0.25);
        }

        @media (max-width: 900px) {
          .lp-features-grid { grid-template-columns: 1fr 1fr !important; }
          .lp-steps { grid-template-columns: 1fr 1fr !important; gap: 32px; }
          .lp-steps::before { display: none; }
          .lp-step { padding: 0; }
        }
        @media (max-width: 600px) {
          .lp-features-grid { grid-template-columns: 1fr !important; }
          .lp-steps { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lp-btn-primary, .lp-btn-ghost { transition: none; }
        }
      `}</style>

      <div style={{ background: "#080808", minHeight: "100vh", color: "#E6E6E6" }}>

        {/* Grid background */}
        <div className="lp-grid-bg" />

        {/* Landing Navbar */}
        <nav className="lp-nav">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logozillaengine.png" alt="Zilla Engine" style={{ width: 28, height: 28, objectFit: "contain" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: "#F2F2F2", letterSpacing: "-0.01em" }}>
              Zilla Engine
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <a href="#features" style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(230,230,230,0.6)", textDecoration: "none" }}>Features</a>
            <a href="#how" style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(230,230,230,0.6)", textDecoration: "none" }}>How it works</a>
            <a href="/dashboard" className="lp-btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>Get Started</a>
          </div>
        </nav>

        {/* Hero */}
        <section className="lp-hero" style={{ position: "relative", zIndex: 1 }}>
          <div className="lp-glow" />
          <div className="lp-eyebrow">Automated DCA Bot</div>
          <h1 className="lp-h1">
            Buy the dip.<br />
            <em>Every time.</em>
          </h1>
          <p className="lp-sub">
            Zilla Engine executes your DCA strategy across price zones, 24/7, without emotion.
            Connect your exchange, set your zones, and let the bot handle the rest.
          </p>
          <div className="lp-cta-row">
            <a href="/dashboard" className="lp-btn-primary">Get Started</a>
            <a href="#how" className="lp-btn-ghost">See how it works</a>
          </div>

          {/* Live ticker */}
          {ticker && (
            <div className="lp-ticker">
              {ticker.map(t => (
                <div key={t.sym} className="lp-ticker-item">
                  <span style={{ fontSize: 11, color: "rgba(192,192,192,0.4)", letterSpacing: "0.08em" }}>{t.sym}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#F2F2F2" }}>${t.price?.toLocaleString()}</span>
                  <span style={{ fontSize: 12, color: t.chg >= 0 ? "#C0C0C0" : "#ff6b6b", fontWeight: 500 }}>
                    {t.chg >= 0 ? "▲" : "▼"} {Math.abs(t.chg).toFixed(2)}%
                  </span>
                </div>
              ))}
              <span style={{ fontSize: 11, color: "rgba(192,192,192,0.3)", fontFamily: "'IBM Plex Mono', monospace" }}>live prices</span>
            </div>
          )}
        </section>

        {/* Features */}
        <section id="features" className="lp-section">
          <div className="lp-section-label">What it does</div>
          <h2 className="lp-h2">Built for disciplined accumulation.</h2>
          <div className="lp-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="lp-feature">
                <span className="lp-feature-icon">{f.icon}</span>
                <div className="lp-feature-title">{f.title}</div>
                <div className="lp-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 6vw" }}>
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* How it works */}
        <section id="how" className="lp-section">
          <div className="lp-section-label">The process</div>
          <h2 className="lp-h2">Up and running in four steps.</h2>
          <div className="lp-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="lp-step">
                <div className="lp-step-n">{s.n}</div>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="lp-cta-section">
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(192,192,192,0.5)", marginBottom: 18 }}>
            Start accumulating today
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", color: "#F2F2F2", marginBottom: 14 }}>
            The market doesn't wait.<br />Neither should you.
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(230,230,230,0.45)", marginBottom: 32, maxWidth: 420, margin: "0 auto 32px" }}>
            Set your strategy once. Zilla Engine handles the rest — every dip, every zone, around the clock.
          </p>
          <a href="/dashboard" className="lp-btn-primary" style={{ fontSize: 15, padding: "15px 36px" }}>
            Get Started
          </a>
        </div>

        {/* Footer */}
        <footer className="lp-footer">
          <span>© 2026 Zilla Engine. All rights reserved.</span>
          <span>Not financial advice. Trade responsibly.</span>
        </footer>

      </div>
    </>
  );
}
