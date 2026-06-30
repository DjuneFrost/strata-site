"use client";

export default function HomePage() {
  const layers = [
    { pct: 3, label: "Zone 1" },
    { pct: 7, label: "Zone 2" },
    { pct: 15, label: "Zone 3" },
    { pct: 28, label: "Zone 4" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .st-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #C0C0C0; }
        .st-btn-primary { background: linear-gradient(135deg,#E8E8E8,#B0B0B0); color: #0A0A0A; border: none; font-family: 'Inter', sans-serif; font-weight: 600; cursor: pointer; }
        .st-btn-primary:hover { background: linear-gradient(135deg,#F5F5F5,#C5C5C5); }
        .st-btn-ghost { background: transparent; border: 1px solid rgba(192,192,192,0.3); color: #E6E6E6; font-family: 'Inter', sans-serif; font-weight: 600; cursor: pointer; }
        .st-btn-ghost:hover { border-color: #C0C0C0; }
        .st-layer { opacity: 0; transform: translateY(8px); animation: settle .7s cubic-bezier(.2,.8,.2,1) forwards; }
        @keyframes settle { to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .st-layer { animation: none; opacity: 1; transform: none; } }
        @media (max-width: 820px) {
          .st-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ color: "#E6E6E6", padding: "40px 36px 60px" }}>

        {/* Hero */}
        <section className="st-hero-grid" style={{
          display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 50, alignItems: "center",
          marginBottom: 70,
        }}>
          <div>
            <div className="st-eyebrow" style={{ marginBottom: 16 }}>Automated accumulation</div>
            <h1 style={{
              fontFamily: "'Newsreader', serif", fontStyle: "italic", fontWeight: 500,
              fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, margin: "0 0 18px", color: "#F2F2F2",
            }}>
              Build your position,<br />layer by layer.
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 15.5, lineHeight: 1.65,
              color: "rgba(230,230,230,0.55)", maxWidth: 440, margin: "0 0 28px",
            }}>
              Zilla Engine runs your DCA strategy across price zones, relentlessly
              and without emotion. Every pullback becomes another layer in your position.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="/bot" className="st-btn-primary" style={{ padding: "12px 24px", borderRadius: 8, fontSize: 14, textDecoration: "none", display: "inline-block" }}>
                Configure the bot
              </a>
              <a href="#how" className="st-btn-ghost" style={{ padding: "12px 24px", borderRadius: 8, fontSize: 14, textDecoration: "none", display: "inline-block" }}>
                How it works
              </a>
            </div>
          </div>

          <div style={{
            background: "#111111", border: "1px solid rgba(192,192,192,0.1)",
            borderRadius: 10, padding: "26px 24px",
          }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(230,230,230,0.4)", marginBottom: 18 }}>
              Accumulation zones — cross-section
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {layers.map((l, i) => (
                <div key={i} className="st-layer" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: `linear-gradient(90deg, rgba(192,192,192,${0.1 + i * 0.08}) 0%, rgba(192,192,192,${0.03 + i * 0.04}) 100%)`,
                    border: "1px solid rgba(192,192,192,0.18)",
                    borderRadius: 6, padding: "13px 15px",
                  }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#F2F2F2" }}>{l.label}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#C0C0C0" }}>pullback ≥ {l.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(230,230,230,0.35)", marginTop: 14, lineHeight: 1.5 }}>
              The deeper the pullback, the thicker the layer — capital concentrates where price has historically offered the best entry.
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" style={{ borderTop: "1px solid rgba(192,192,192,0.1)", paddingTop: 48 }}>
          <div className="st-eyebrow" style={{ marginBottom: 12 }}>The principle</div>
          <h2 style={{ fontFamily: "'Newsreader', serif", fontWeight: 600, fontSize: 24, marginBottom: 34, color: "#F2F2F2" }}>
            Three decisions, made once.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 26 }}>
            {[
              { t: "Set the zones", d: "You decide how deep a pullback needs to be before each layer of capital steps in." },
              { t: "Protect your capital", d: "Trend filters and volatility guards keep the bot from buying into the wrong move." },
              { t: "Let it run", d: "The bot executes, logs every buy, and stops itself once your exit conditions are met." },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#C0C0C0", marginBottom: 9 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14.5, marginBottom: 7, color: "#F2F2F2" }}>{s.t}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(230,230,230,0.5)", lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
