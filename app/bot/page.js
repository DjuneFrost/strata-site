"use client";
import { useState, useEffect, useRef } from "react";
import { Target, Zap, Save, BarChart2, Play, Settings, TrendingDown, TrendingUp, Hash, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

// ---- Chains & tokens ----
const CHAINS = [
  {
    id: "solana",
    label: "Solana",
    logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    color: "#9945FF",
    tokens: [
      { label: "SOL", full: "Solana (SOL)", logo: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
      { label: "PUMP", full: "Pump.fun (PUMP)", logo: "https://app.pacifica.fi/imgs/tokens/PUMP.svg" },
    ],
    comingSoon: false,
    dexOnly: false,
  },
  {
    id: "bitcoin",
    label: "Bitcoin",
    logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    color: "#F7931A",
    tokens: [
      { label: "BTC", full: "Bitcoin (BTC)", logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
    ],
    comingSoon: false,
    cexOnly: true,
  },
  {
    id: "ethereum",
    label: "Ethereum",
    logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    color: "#627EEA",
    tokens: [
      { label: "ETH", full: "Ethereum (ETH)", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
    ],
    comingSoon: false,
    cexOnly: true,
  },
  {
    id: "hyperliquid",
    label: "Hyperliquid",
    logo: "https://app.pacifica.fi/imgs/tokens/HYPE.svg",
    color: "#14F195",
    tokens: [
      { label: "HYPE", full: "Hyperliquid (HYPE)", logo: "https://app.pacifica.fi/imgs/tokens/HYPE.svg" },
    ],
    comingSoon: false,
    cexOnly: true,
  },
];

async function fetchPrice(coinId) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`);
    const data = await res.json();
    const key = Object.keys(data)[0];
    return { price: data[key]?.usd || 0, change24h: data[key]?.usd_24h_change || 0 };
  } catch { return { price: 0, change24h: 0 }; }
}

const COIN_IDS = { SOL: "solana", HYPE: "hyperliquid" };

async function fetchSolHistory() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=60&interval=daily");
    const data = await res.json();
    return (data.prices || []).map(([ts, price]) => ({ date: new Date(ts), price }));
  } catch { return []; }
}

function runBacktest(prices, zones, capital, exposure) {
  if (!prices.length) return null;
  const maxDeploy = (capital * exposure) / 100;
  let deployed = 0, orders = [], totalBought = 0, totalSpent = 0;
  const refPrice = Math.max(...prices.slice(0, 5).map(p => p.price));
  prices.forEach((point, i) => {
    if (i === 0) return;
    const pct = ((refPrice - point.price) / refPrice) * 100;
    zones.forEach(zone => {
      if (pct >= zone.pullback) {
        const zoneAlloc = (maxDeploy * zone.alloc) / 100;
        const lastOrder = orders.filter(o => o.zone === zone.pullback).slice(-1)[0];
        if (!lastOrder || (point.date - lastOrder.date) > 7 * 24 * 60 * 60 * 1000) {
          if (deployed + zoneAlloc <= maxDeploy) {
            const units = zoneAlloc / point.price;
            deployed += zoneAlloc; totalBought += units; totalSpent += zoneAlloc;
            orders.push({ date: point.date, price: point.price, amount: zoneAlloc, units, zone: zone.pullback });
          }
        }
      }
    });
  });
  const finalPrice = prices[prices.length - 1].price;
  const currentValue = totalBought * finalPrice;
  const pnl = currentValue - totalSpent;
  const pnlPct = totalSpent > 0 ? (pnl / totalSpent) * 100 : 0;
  const avgEntry = totalBought > 0 ? totalSpent / totalBought : 0;
  return { orders, deployed, totalBought, totalSpent, currentValue, pnl, pnlPct, avgEntry, finalPrice };
}

const C = {
  silver: "#C0C0C0",
  silverBright: "#F2F2F2",
  bg: "#0A0A0A",
  panel: "rgba(17,17,17,0.97)",
  panelInner: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
  text: "#E6E6E6",
  textDim: "rgba(230,230,230,0.4)",
  textFaint: "rgba(230,230,230,0.25)",
  red: "#ff6b6b",
};

export default function BotPage() {
  const [price, setPrice] = useState(0);
  const [change24h, setChange24h] = useState(0);
  const [priceDir, setPriceDir] = useState(null);
  const prevPrice = useRef(0);

  const [showConfigurator, setShowConfigurator] = useState(false);
  const [showBacktest, setShowBacktest] = useState(false);
  const [backtestLoading, setBacktestLoading] = useState(false);
  const [backtestResult, setBacktestResult] = useState(null);
  const [savedStrategies, setSavedStrategies] = useState([]);
  const [saving, setSaving] = useState(false);

  // Chain & token selectors
  const [selectedChain, setSelectedChain] = useState(CHAINS[0]);
  const [selectedToken, setSelectedToken] = useState(CHAINS[0].tokens[0]);
  const [chainDropdownOpen, setChainDropdownOpen] = useState(false);
  const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false);
  const chainRef = useRef(null);
  const tokenRef = useRef(null);

  const [triggerMode, setTriggerMode] = useState(0);
  const [toggleDynamic, setToggleDynamic] = useState(false);
  const [toggleExit, setToggleExit] = useState(false);
  const [toast, setToast] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [strategyName, setStrategyName] = useState("");
  const [capital, setCapital] = useState(1000);
  const [exposure, setExposure] = useState(80);
  const [zones, setZones] = useState([{ pullback: 3, alloc: 20 }, { pullback: 7, alloc: 30 }, { pullback: 15, alloc: 30 }]);
  const [trendFilter, setTrendFilter] = useState("Above MA50");
  const [atrGuard, setAtrGuard] = useState(2.5);
  const [cooldown, setCooldown] = useState(4);
  const [minOrder, setMinOrder] = useState(10.5);
  const [triggers, setTriggers] = useState([false, false, false, false]);
  const [rsiThreshold, setRsiThreshold] = useState(35);
  const [volumeMultiplier, setVolumeMultiplier] = useState(2);
  const [supportIndicators, setSupportIndicators] = useState(2);
  const [dynMode, setDynMode] = useState("volatility");
  const [dynVolatilityReduction, setDynVolatilityReduction] = useState(50);
  const [dynUptrendBoost, setDynUptrendBoost] = useState(50);
  const [takeProfit, setTakeProfit] = useState(0);
  const [trailingStop, setTrailingStop] = useState(0);
  const [exitIndicator, setExitIndicator] = useState(false);
  const [exitIndicatorType, setExitIndicatorType] = useState("RSI (Daily)");
  const [exitCondition, setExitCondition] = useState("Above (>)");
  const [exitThreshold, setExitThreshold] = useState(0);
  const [exitDrop, setExitDrop] = useState(false);
  const [exitDropValue, setExitDropValue] = useState(0);
  const [exitMaxBuys, setExitMaxBuys] = useState(false);
  const [exitMaxBuysValue, setExitMaxBuysValue] = useState(0);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [exchangeDropdownOpen, setExchangeDropdownOpen] = useState(false);

  const showToast = (msg) => { setToast(msg); setToastVisible(true); setTimeout(() => setToastVisible(false), 3000); };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (chainRef.current && !chainRef.current.contains(e.target)) setChainDropdownOpen(false);
      if (tokenRef.current && !tokenRef.current.contains(e.target)) setTokenDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Price polling
  useEffect(() => {
    if (!showConfigurator) return;
    const coinId = COIN_IDS[selectedToken.label] || "solana";
    const poll = async () => {
      const { price: p, change24h: c } = await fetchPrice(coinId);
      if (p > 0) {
        setPriceDir(p > prevPrice.current ? "up" : p < prevPrice.current ? "down" : null);
        prevPrice.current = p;
        setPrice(p);
        setChange24h(c);
        setTimeout(() => setPriceDir(null), 1200);
      }
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [showConfigurator, selectedToken]);

  const activeZones = zones.map(z => {
    if (!price) return false;
    const refHigh = price * 1.25;
    const pctFromHigh = ((refHigh - price) / refHigh) * 100;
    return pctFromHigh >= z.pullback;
  });

  const handleSaveStrategy = () => {
    if (!strategyName) { showToast("Please enter a strategy name first."); return; }
    setSaving(true);
    const payload = { name: strategyName, chain: selectedChain.label, token: selectedToken.label, capital: Number(capital), exposure: Number(exposure), zones, status: "preview", created_at: new Date().toISOString() };
    setTimeout(() => {
      setSavedStrategies(prev => [payload, ...prev]);
      showToast("✅ Strategy saved!");
      setSaving(false);
    }, 400);
  };

  const handleBacktest = async () => {
    setBacktestLoading(true); setShowBacktest(true); setBacktestResult(null);
    const history = await fetchSolHistory();
    const result = runBacktest(history, zones, Number(capital), Number(exposure));
    setBacktestResult(result); setBacktestLoading(false);
  };

  const activatePreset = () => {
    setStrategyName("Balanced Accumulator");
    setExposure(70);
    setZones([{ pullback: 5, alloc: 20 }, { pullback: 12, alloc: 30 }, { pullback: 25, alloc: 20 }]);
    setTrendFilter("Above MA50"); setAtrGuard(2.5); setCooldown(6); setMinOrder(10.5);
    setTriggerMode(2); setTriggers([true, false, false, true]);
    setRsiThreshold(30); setSupportIndicators(1);
    showToast("<Zap size={14} /> Preset applied!");
  };

  const totalAlloc = zones.reduce((s, z) => s + Number(z.alloc), 0);
  const maxDeploy = ((capital * exposure) / 100).toFixed(0);
  const anyTriggerActive = triggers.some(Boolean);

  const Toggle = ({ val, set }) => (
    <div onClick={() => set(!val)} style={{ width: 44, height: 24, background: val ? "rgba(192,192,192,0.5)" : "rgba(255,255,255,0.1)", borderRadius: 12, cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s", border: `1px solid ${val ? "rgba(192,192,192,0.6)" : "rgba(255,255,255,0.1)"}` }}>
      <div style={{ width: 18, height: 18, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: val ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
    </div>
  );

  // ---- DASHBOARD VIEW ----
  if (!showConfigurator) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@500;600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ padding: "32px 4vw 60px", color: C.text, maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
            <div>
              <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: C.silverBright, margin: 0 }}>DCA Bot</h1>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: C.textDim, margin: "4px 0 0" }}>Intelligent accumulation engine</p>
            </div>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, padding: "5px 12px", borderRadius: 20, background: "rgba(192,192,192,0.08)", border: "1px solid rgba(192,192,192,0.25)", color: C.silver, fontWeight: 600 }}>● Idle</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Strategies", value: `${savedStrategies.length} / ${savedStrategies.length}`, sub: "active / total" },
              { label: "Deployed Capital", value: "$0", sub: "of $0 total" },
              { label: "Orders Executed", value: "0", sub: "total DCA orders" },
              { label: "Realized PnL", value: "+$0.00", sub: "since the beginning" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#111111", border: "1px solid rgba(192,192,192,0.1)", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textDim, marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 700, color: C.silverBright }}>{s.value}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: C.textFaint, marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#111111", border: "1px solid rgba(192,192,192,0.1)", borderRadius: 10, padding: "24px 22px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textDim, marginBottom: 14 }}>
              {savedStrategies.length === 0 ? "No strategy configured yet." : `${savedStrategies.length} strategy(ies) saved.`}
            </div>
            <button onClick={() => setShowConfigurator(true)} style={{ background: "linear-gradient(135deg,#E8E8E8,#B0B0B0)", border: "none", color: "#0A0A0A", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, padding: "11px 24px", borderRadius: 8, cursor: "pointer" }}>
              Create a strategy
            </button>
          </div>

          {savedStrategies.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textFaint, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>Saved Strategies</div>
              {savedStrategies.map((s, i) => (
                <div key={i} style={{ background: "#111111", border: "1px solid rgba(192,192,192,0.1)", borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: C.silverBright }}>{s.name}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.textDim, marginTop: 3 }}>{s.chain} · {s.token} · ${s.capital} · {s.zones?.length || 0} zones</div>
                  </div>
                  <span style={{ fontSize: 11, background: "rgba(192,192,192,0.08)", color: C.silver, border: "1px solid rgba(192,192,192,0.25)", borderRadius: 20, padding: "3px 12px", fontWeight: 600, textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // ---- CONFIGURATOR VIEW ----
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@500;600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .bot-card { background: ${C.panel}; border: 1px solid ${C.border}; border-radius: 18px; padding: 20px; box-shadow: 0 8px 40px rgba(0,0,0,0.5); margin-bottom: 10px; }
        .bot-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #fff; font-family: 'Inter',sans-serif; font-size: 13px; padding: 10px 14px; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .bot-input:focus { border-color: rgba(255,255,255,0.25); }
        .bot-select { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #fff; font-family: 'Inter',sans-serif; font-size: 13px; padding: 10px 14px; outline: none; appearance: none; box-sizing: border-box; cursor: pointer; color-scheme: dark; }
        .bot-select option { background: #1a1a1a; color: #fff; }
        .bot-label { font-size: 12px; color: rgba(255,255,255,0.5); display: block; margin-bottom: 4px; font-weight: 500; }
        .bot-sublabel { font-size: 11px; color: rgba(255,255,255,0.25); display: block; margin-bottom: 8px; line-height: 1.4; }
        .bot-section-title { font-family: 'Inter',sans-serif; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .bot-inner-box { background: ${C.panelInner}; border: 1px solid ${C.border}; border-radius: 12px; padding: 14px 16px; margin-bottom: 8px; }
        .field-group { display: flex; flex-direction: column; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .zone-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .trigger-mode-btn { border: 1px solid ${C.border}; border-radius: 10px; padding: 12px 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: flex-start; gap: 12px; margin-bottom: 6px; background: rgba(255,255,255,0.02); width: 100%; text-align: left; }
        .trigger-mode-btn.selected { border-color: rgba(192,192,192,0.45); background: rgba(192,192,192,0.06); }
        .bot-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 14px -20px; }
        .dropdown-item { width: 100%; padding: 10px 14px; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(230,230,230,0.7); font-family: 'Inter',sans-serif; font-size: 13px; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 10px; transition: background .15s; }
        .dropdown-item:hover { background: rgba(255,255,255,0.05); }
        .dropdown-item.active { background: rgba(192,192,192,0.1); color: #F2F2F2; font-weight: 600; }
        .dropdown-item.coming-soon { opacity: 0.4; cursor: not-allowed; }
        @keyframes pulse-silver { 0%,100%{box-shadow:0 0 0 0 rgba(192,192,192,0.35);}50%{box-shadow:0 0 0 8px rgba(192,192,192,0);} }
        .zone-active { animation: pulse-silver 1.5s infinite; border-color: rgba(192,192,192,0.5) !important; background: rgba(192,192,192,0.06) !important; }
      `}</style>

      <div style={{ padding: "28px 4vw 60px", color: C.text, maxWidth: 1400, margin: "0 auto" }}>

        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setShowConfigurator(false)} style={{ background: "none", border: "none", color: C.textDim, fontFamily: "'Inter', sans-serif", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 14 }}>
            ← Back to Dashboard
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 24, fontWeight: 600, color: C.silverBright }}>Strategy Builder</div>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: "rgba(192,192,192,0.1)", border: "1px solid rgba(192,192,192,0.3)", color: C.silver, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Draft</span>
          </div>
          <div style={{ color: C.textDim, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>Structure-based accumulation — spot only, capital-protected, volatility-aware</div>
        </div>

        {/* LIVE PRICE + CHAIN SELECTOR */}
        <div className="bot-card" style={{ marginBottom: 16, padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

              {/* Chain selector pill */}
              <div ref={chainRef} style={{ position: "relative" }}>
                <button
                  onClick={() => { setChainDropdownOpen(!chainDropdownOpen); setTokenDropdownOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px 8px 10px", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,192,192,0.25)", cursor: "pointer", outline: "none" }}
                >
                  <img src={selectedChain.logo} style={{ width: 26, height: 26, borderRadius: "50%" }} alt={selectedChain.label} />
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600, color: C.silverBright }}>{selectedChain.label}</span>
                  <span style={{ color: C.textFaint, fontSize: 10 }}>{chainDropdownOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</span>
                </button>
                {chainDropdownOpen && (
                  <div style={{ position: "absolute", top: 46, left: 0, background: "#1a1a1a", border: "1px solid rgba(192,192,192,0.2)", borderRadius: 10, overflow: "hidden", zIndex: 50, minWidth: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
                    {CHAINS.map(chain => (
                      <button
                        key={chain.id}
                        className={`dropdown-item${selectedChain.id === chain.id ? " active" : ""}${chain.comingSoon ? " coming-soon" : ""}`}
                        onClick={() => {
                          if (chain.comingSoon) return;
                          setSelectedChain(chain);
                          setSelectedToken(chain.tokens[0]);
                          setChainDropdownOpen(false);
                        }}
                      >
                        <img src={chain.logo} style={{ width: 20, height: 20, borderRadius: "50%" }} alt={chain.label} />
                        {chain.label}
                        {chain.comingSoon && <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Coming Soon</span>}
                        {selectedChain.id === chain.id && !chain.comingSoon && <span style={{ marginLeft: "auto", color: C.silver }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price display */}
              <div>
                <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 2, fontFamily: "'Inter', sans-serif" }}>{selectedToken.label} / USD — Live</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 600, color: priceDir === "up" ? C.silverBright : priceDir === "down" ? C.red : "#fff", transition: "color 0.4s" }}>
                    ${price > 0 ? price.toFixed(2) : "—"}
                  </span>
                  {change24h !== 0 && (
                    <span style={{ fontSize: 13, fontWeight: 600, color: change24h >= 0 ? C.silverBright : C.red, fontFamily: "'Inter', sans-serif" }}>
                      {change24h >= 0 ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.silver, boxShadow: "0 0 8px rgba(192,192,192,0.6)" }} />
              <span style={{ fontSize: 11, color: C.textFaint, fontFamily: "'Inter', sans-serif" }}>Updates every 5s</span>
            </div>
          </div>
        </div>

        {/* Configure Strategy */}
        <div className="bot-card">
          <div className="bot-section-title"><Settings size={14} /> Configure Strategy</div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,192,192,0.15)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 34, height: 34, background: "rgba(192,192,192,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}><Zap size={14} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#fff", marginBottom: 2, fontFamily: "'Inter', sans-serif" }}>Suggested preset</div>
              <div style={{ fontSize: 11, color: C.textFaint, fontFamily: "'Inter', sans-serif" }}>A balanced capital-protection DCA model for structured pullbacks in trending markets.</div>
            </div>
            <button onClick={activatePreset} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}><Zap size={14} /> Apply</button>
          </div>
          <div className="bot-divider" />
          <div className="row2">
            <div className="field-group">
              <label className="bot-label">Strategy Name</label>
              <input type="text" className="bot-input" placeholder="e.g. SOL Accumulator" value={strategyName} onChange={e => setStrategyName(e.target.value)} />
            </div>

            {/* Token selector */}
            <div className="field-group" style={{ position: "relative" }} ref={tokenRef}>
              <label className="bot-label">Asset</label>
              <button
                onClick={() => { setTokenDropdownOpen(!tokenDropdownOpen); setChainDropdownOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontFamily: "'Inter',sans-serif", fontSize: 13, padding: "10px 14px", outline: "none", cursor: "pointer", boxSizing: "border-box" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={selectedToken.logo} style={{ width: 18, height: 18, borderRadius: "50%" }} alt={selectedToken.label} />
                  {selectedToken.full}
                </div>
                <span style={{ color: C.textFaint, fontSize: 10 }}>{tokenDropdownOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</span>
              </button>
              {tokenDropdownOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1a1a1a", border: "1px solid rgba(192,192,192,0.2)", borderRadius: 10, overflow: "hidden", zIndex: 50, boxShadow: "0 8px 32px rgba(0,0,0,0.6)", marginTop: 4 }}>
                  {selectedChain.tokens.map(token => (
                    <button
                      key={token.label}
                      className={`dropdown-item${selectedToken.label === token.label ? " active" : ""}`}
                      onClick={() => { setSelectedToken(token); setTokenDropdownOpen(false); }}
                    >
                      <img src={token.logo} style={{ width: 18, height: 18, borderRadius: "50%" }} alt={token.label} />
                      {token.full}
                      {selectedToken.label === token.label && <span style={{ marginLeft: "auto", color: C.silver }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bot-inner-box">
            <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>Capital Management</div>
            <div className="row2">
              <div className="field-group"><label className="bot-label">Total Capital (USD)</label><span className="bot-sublabel">Total budget for this strategy</span><input type="number" className="bot-input" value={capital} onChange={e => setCapital(e.target.value)} /></div>
              <div className="field-group"><label className="bot-label">Max Exposure %</label><span className="bot-sublabel">Cap on total capital ever deployed</span><input type="number" className="bot-input" min={10} max={100} value={exposure} onChange={e => setExposure(Math.min(100, Math.max(10, Number(e.target.value))))} /></div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: C.textFaint, fontFamily: "'Inter', sans-serif" }}>
              Max deployment: <span style={{ color: C.silver, fontWeight: 600 }}>${maxDeploy}</span> · Zone allocations: <span style={{ color: C.silver, fontWeight: 600 }}>{exposure}% ({maxDeploy} USD)</span>
            </div>
          </div>
        </div>

        {/* Accumulation Zones */}
        <div className="bot-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div className="bot-section-title" style={{ marginBottom: 0 }}>Accumulation Zones</div>
            <span style={{ fontSize: 12, color: totalAlloc > 100 ? C.red : C.silverBright, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{totalAlloc}% allocated</span>
          </div>
          {price > 0 && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: C.textFaint, display: "flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.silver, flexShrink: 0, display: "inline-block" }} />
              {selectedToken.label} at <span style={{ color: "#fff", fontWeight: 600, margin: "0 4px" }}>${price.toFixed(2)}</span> — zones marked <Target size={14} /> are currently within pullback range
            </div>
          )}
          {zones.map((z, i) => (
            <div key={i} className={`bot-inner-box${activeZones[i] ? " zone-active" : ""}`}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "'Inter', sans-serif" }}>Zone {i + 1}</span>
                  {activeZones[i] && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(192,192,192,0.15)", border: "1px solid rgba(192,192,192,0.4)", color: C.silver, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}><Target size={14} /> Active</span>}
                </div>
                <span style={{ fontSize: 11, color: C.textFaint, fontFamily: "'Inter', sans-serif" }}>Deploy when pullback ≥ {z.pullback}%</span>
              </div>
              <div className="zone-row">
                <div className="field-group"><label className="bot-label">Pullback Depth %</label><input type="number" className="bot-input" min={0.5} max={50} step={0.5} value={z.pullback} onChange={e => { const nz = [...zones]; nz[i] = { ...nz[i], pullback: Math.min(50, Math.max(0.5, Number(e.target.value))) }; setZones(nz); }} /></div>
                <div className="field-group"><label className="bot-label">Capital Allocation %</label><input type="number" className="bot-input" min={1} max={100} value={z.alloc} onChange={e => { const nz = [...zones]; nz[i] = { ...nz[i], alloc: Math.min(100, Math.max(1, Number(e.target.value))) }; setZones(nz); }} /></div>
              </div>
            </div>
          ))}
        </div>

        {/* Protection Filters */}
        <div className="bot-card">
          <div className="bot-section-title">Protection Filters</div>
          <div className="row2">
            <div className="field-group"><label className="bot-label">Trend Filter (MA)</label><span className="bot-sublabel">Only accumulate if price is above this MA</span><select className="bot-select" value={trendFilter} onChange={e => setTrendFilter(e.target.value)}><option>Above MA50</option><option>Above MA20</option><option>Above MA100</option><option>Above MA200</option><option>No Filter</option></select></div>
            <div className="field-group"><label className="bot-label">Volatility Spike Guard (ATR ×)</label><span className="bot-sublabel">Pause buying when volatility exceeds this threshold</span><input type="number" className="bot-input" min={1} max={10} value={atrGuard} step="0.1" onChange={e => setAtrGuard(Math.min(10, Math.max(1, Number(e.target.value))))} /></div>
            <div className="field-group"><label className="bot-label">Cooldown Between Orders (hours)</label><span className="bot-sublabel">Minimum wait between buys</span><input type="number" className="bot-input" min={1} value={cooldown} onChange={e => setCooldown(Math.max(1, Number(e.target.value)))} /></div>
            <div className="field-group"><label className="bot-label">Min Order Size (USD)</label><span className="bot-sublabel">Exchange minimum order size</span><input type="number" className="bot-input" min={1} step="0.5" value={minOrder} onChange={e => setMinOrder(Math.max(1, Number(e.target.value)))} /></div>
          </div>
        </div>

        {/* Triggers */}
        <div className="bot-card">
          <div className="bot-section-title">Accumulation Triggers</div>
          <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>Add indicator-based conditions beyond price pullbacks</div>
          <div style={{ fontSize: 11, color: C.textDim, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Inter', sans-serif" }}>How to combine with zone logic</div>
          {[{ title: "Any trigger fires (OR)", desc: "Buy when at least one condition is met" }, { title: "All triggers must fire (AND)", desc: "Buy only when every condition is met simultaneously" }, { title: "Zone hit + any trigger", desc: "Price must be in a zone AND at least one indicator trigger fires" }].map((m, i) => (
            <button key={i} onClick={() => setTriggerMode(i)} className={`trigger-mode-btn${triggerMode === i ? " selected" : ""}`}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${triggerMode === i ? C.silver : "rgba(255,255,255,0.2)"}`, background: triggerMode === i ? C.silver : "transparent", flexShrink: 0, marginTop: 2 }} />
              <div><div style={{ fontSize: 13, fontWeight: 600, color: triggerMode === i ? "#fff" : "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif" }}>{m.title}</div><div style={{ fontSize: 11, color: C.textFaint, marginTop: 2, fontFamily: "'Inter', sans-serif" }}>{m.desc}</div></div>
            </button>
          ))}
          <div className="bot-divider" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { key: 0, title: "RSI Dip Below", desc: "Buy when RSI falls under a threshold" },
              { key: 1, title: "MACD Bullish Cross", desc: "Buy when MACD crosses above signal line" },
              { key: 2, title: "Volume Surge", desc: "Buy when volume exceeds X times the average" },
              { key: 3, title: "Support Zone Confirmed", desc: "Buy only when near a support zone" },
            ].map(t => {
              const active = triggers[t.key];
              return (
                <div key={t.key} style={{ background: active ? "rgba(192,192,192,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${active ? "rgba(192,192,192,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 5 }}><span style={{ fontSize: 11, fontWeight: 600, color: active ? C.silverBright : "rgba(255,255,255,0.55)", background: active ? "rgba(192,192,192,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${active ? "rgba(192,192,192,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 6, padding: "2px 9px", fontFamily: "'Inter', sans-serif" }}>{t.title}</span></div>
                      <div style={{ fontSize: 11, color: C.textFaint, lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{t.desc}</div>
                    </div>
                    <button onClick={() => { const nt = [...triggers]; nt[t.key] = !nt[t.key]; setTriggers(nt); }} style={{ width: 24, height: 24, borderRadius: 6, background: active ? "rgba(192,192,192,0.1)" : "transparent", border: `1px solid ${active ? "rgba(192,192,192,0.3)" : "rgba(255,255,255,0.1)"}`, color: active ? C.silverBright : "rgba(255,255,255,0.25)", cursor: "pointer", fontSize: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{active ? "✕" : "+"}</button>
                  </div>
                </div>
              );
            })}
          </div>
          {anyTriggerActive && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>Configure Active Triggers</div>
              {triggers[0] && <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "2px 9px", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>RSI Dip Below</span><div style={{ flex: 1 }} /><input type="number" className="bot-input" min={10} max={50} value={rsiThreshold} onChange={e => setRsiThreshold(Math.min(50, Math.max(10, Number(e.target.value))))} style={{ width: 76, textAlign: "center", flexShrink: 0 }} /><span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Inter', sans-serif" }}>RSI</span><button onClick={() => { const nt = [...triggers]; nt[0] = false; setTriggers(nt); }} style={{ background: "transparent", border: "none", color: C.textFaint, cursor: "pointer", fontSize: 14 }}>✕</button></div>}
              {triggers[1] && <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "2px 9px", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>MACD Bullish Cross</span><div style={{ flex: 1 }} /><span style={{ fontSize: 11, color: C.textFaint, fontStyle: "italic", fontFamily: "'Inter', sans-serif" }}>No additional config needed</span><button onClick={() => { const nt = [...triggers]; nt[1] = false; setTriggers(nt); }} style={{ background: "transparent", border: "none", color: C.textFaint, cursor: "pointer", fontSize: 14 }}>✕</button></div>}
              {triggers[2] && <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "2px 9px", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>Volume Surge</span><div style={{ flex: 1 }} /><input type="number" className="bot-input" min={1.2} max={10} step={0.1} value={volumeMultiplier} onChange={e => setVolumeMultiplier(Math.min(10, Math.max(1.2, Number(e.target.value))))} style={{ width: 76, textAlign: "center", flexShrink: 0 }} /><span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Inter', sans-serif" }}>x avg vol</span><button onClick={() => { const nt = [...triggers]; nt[2] = false; setTriggers(nt); }} style={{ background: "transparent", border: "none", color: C.textFaint, cursor: "pointer", fontSize: 14 }}>✕</button></div>}
              {triggers[3] && <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "2px 9px", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>Support Zone Confirmed</span><div style={{ flex: 1 }} /><input type="number" className="bot-input" min={1} max={3} value={supportIndicators} onChange={e => setSupportIndicators(Math.min(3, Math.max(1, Number(e.target.value))))} style={{ width: 76, textAlign: "center", flexShrink: 0 }} /><span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Inter', sans-serif" }}>indicators</span><button onClick={() => { const nt = [...triggers]; nt[3] = false; setTriggers(nt); }} style={{ background: "transparent", border: "none", color: C.textFaint, cursor: "pointer", fontSize: 14 }}>✕</button></div>}
            </div>
          )}
        </div>

        {/* Dynamic Allocation */}
        <div className="bot-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: "#fff", marginBottom: 2, fontFamily: "'Inter', sans-serif" }}>Dynamic Allocation</div><div style={{ fontSize: 12, color: C.textFaint, fontFamily: "'Inter', sans-serif" }}>Automatically scale zone allocations based on market conditions</div></div>
            <Toggle val={toggleDynamic} set={setToggleDynamic} />
          </div>
          {toggleDynamic && (
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
                {[{ key: "volatility", icon: "↓", title: "Volatility-Based", desc: "Reduces allocation during high ATR spikes" }, { key: "trend", icon: "↑", title: "Trend-Based", desc: "Boosts allocation during confirmed uptrends" }, { key: "combined", icon: "⚡", title: "Combined", desc: "Boosts in uptrends AND reduces during volatility" }].map(m => (
                  <div key={m.key} onClick={() => setDynMode(m.key)} style={{ border: `1px solid ${dynMode === m.key ? "rgba(192,192,192,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: 12, cursor: "pointer", background: dynMode === m.key ? "rgba(192,192,192,0.06)" : "rgba(255,255,255,0.02)" }}>
                    <div style={{ fontSize: 14, marginBottom: 5 }}></div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: dynMode === m.key ? C.silverBright : "rgba(255,255,255,0.7)", marginBottom: 3, fontFamily: "'Inter', sans-serif" }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: C.textFaint, lineHeight: 1.4, fontFamily: "'Inter', sans-serif" }}>{m.desc}</div>
                  </div>
                ))}
              </div>
              <div className="row2" style={{ marginBottom: 12 }}>
                {(dynMode === "trend" || dynMode === "combined") && <div className="field-group"><label className="bot-label">Uptrend Boost %</label><input type="number" className="bot-input" min={10} max={100} value={dynUptrendBoost} onChange={e => setDynUptrendBoost(Math.min(100, Math.max(10, Number(e.target.value))))} /></div>}
                {(dynMode === "volatility" || dynMode === "combined") && <div className="field-group"><label className="bot-label">Volatility Reduction %</label><input type="number" className="bot-input" min={10} max={90} value={dynVolatilityReduction} onChange={e => setDynVolatilityReduction(Math.min(90, Math.max(10, Number(e.target.value))))} /></div>}
              </div>
            </div>
          )}
        </div>

        {/* Exit Strategy */}
        <div className="bot-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: "#fff", marginBottom: 2, fontFamily: "'Inter', sans-serif" }}>Exit Strategy</div><div style={{ fontSize: 12, color: C.textFaint, fontFamily: "'Inter', sans-serif" }}>Configure conditions that will pause accumulation</div></div>
            <Toggle val={toggleExit} set={setToggleExit} />
          </div>
          {toggleExit && (
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div className="bot-inner-box"><div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><span><Target size={14} /></span><span style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "'Inter', sans-serif" }}>Take Profit</span></div><div className="field-group"><label className="bot-label">% above avg entry</label><input type="number" className="bot-input" min={1} value={takeProfit} onChange={e => setTakeProfit(Math.max(1, Number(e.target.value)))} /></div></div>
                <div className="bot-inner-box"><div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><span><TrendingDown size={14} /></span><span style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "'Inter', sans-serif" }}>Trailing Stop-Loss</span></div><div className="field-group"><label className="bot-label">Drop % from all-time peak</label><input type="number" className="bot-input" min={0} max={90} value={trailingStop} onChange={e => setTrailingStop(Math.min(90, Math.max(0, Number(e.target.value))))} /></div></div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px" }}>
                <span><AlertTriangle size={14} /></span>
                <div style={{ fontSize: 11, color: C.textFaint, lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>All exit triggers <span style={{ color: "#fff", fontWeight: 600 }}>pause accumulation</span>. They do not automatically sell your assets.</div>
              </div>
            </div>
          )}
        </div>
        
{/* Exchange Selector */}
<div className="bot-card" style={{ marginBottom: 10 }}>
  <div className="bot-section-title">
    <Settings size={14} /> Execution — Choose your Exchange
  </div>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>

{/* DEX */}
<div>
  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 10 }}>DEX</div>
  {[
    { id: "jupiter", name: "Jupiter", logo: "https://jup.ag/favicon.ico", chain: "Solana", chains: ["solana"] },
    { id: "uniswap", name: "Uniswap", logo: "https://app.uniswap.org/favicon.png", chain: "Ethereum", chains: ["ethereum"] },
    { id: "pancakeswap", name: "PancakeSwap", logo: "https://pancakeswap.finance/favicon.ico", chain: "BNB Chain", chains: ["bnb"] },
  ].map(ex => {
    const available = !selectedChain.cexOnly && ex.chains.includes(selectedChain.id);
    return (
      <div
        key={ex.id}
        onClick={() => available && setSelectedExchange(selectedExchange?.id === ex.id ? null : ex)}
        style={{
          display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
          borderRadius: 10, marginBottom: 6,
          cursor: available ? "pointer" : "not-allowed",
          opacity: available ? 1 : 0.35,
          background: selectedExchange?.id === ex.id ? "rgba(192,192,192,0.08)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${selectedExchange?.id === ex.id ? "rgba(192,192,192,0.35)" : "rgba(255,255,255,0.07)"}`,
          transition: "all .15s",
        }}
      >
        <img src={ex.logo} style={{ width: 24, height: 24, borderRadius: 6, objectFit: "contain" }} alt={ex.name} onError={e => { e.target.style.display = "none"; }} />
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: selectedExchange?.id === ex.id ? C.silverBright : C.textDim }}>{ex.name}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.textFaint }}>{ex.chain}</div>
        </div>
        {!available && <span style={{ marginLeft: "auto", fontSize: 10, color: C.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>N/A</span>}
        {selectedExchange?.id === ex.id && available && <span style={{ marginLeft: "auto", color: C.silver, fontSize: 12 }}>✓</span>}
      </div>
    );
  })}
</div>

{/* CEX */}
<div>
  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 10 }}>CEX</div>
  {[
    { id: "bybit", name: "Bybit", logo: "https://www.bybit.com/favicon.ico", chain: "CEX", chains: ["solana", "hyperliquid", "bitcoin", "ethereum"] },
{ id: "backpack", name: "Backpack", logo: "https://backpack.exchange/coins/bp.svg", chain: "CEX", chains: ["solana", "hyperliquid", "bitcoin", "ethereum"] },
  ].map(ex => {
    const available = ex.chains.includes(selectedChain.id);
    return (
      <div
        key={ex.id}
        onClick={() => available && setSelectedExchange(selectedExchange?.id === ex.id ? null : ex)}
        style={{
          display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
          borderRadius: 10, marginBottom: 6,
          cursor: available ? "pointer" : "not-allowed",
          opacity: available ? 1 : 0.35,
          background: selectedExchange?.id === ex.id ? "rgba(192,192,192,0.08)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${selectedExchange?.id === ex.id ? "rgba(192,192,192,0.35)" : "rgba(255,255,255,0.07)"}`,
          transition: "all .15s",
        }}
      >
        <img src={ex.logo} style={{ width: 24, height: 24, borderRadius: 6, objectFit: "contain" }} alt={ex.name} onError={e => { e.target.style.display = "none"; }} />
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: selectedExchange?.id === ex.id ? C.silverBright : C.textDim }}>{ex.name}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.textFaint }}>{ex.chain}</div>
        </div>
        {!available && <span style={{ marginLeft: "auto", fontSize: 10, color: C.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>N/A</span>}
        {selectedExchange?.id === ex.id && available && <span style={{ marginLeft: "auto", color: C.silver, fontSize: 12 }}>✓</span>}
      </div>
    );
  })}
</div>

  </div>
  {selectedExchange && (
    <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(192,192,192,0.05)", border: "1px solid rgba(192,192,192,0.15)", borderRadius: 10, fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textDim }}>
      Strategy will execute via <span style={{ color: C.silverBright, fontWeight: 600 }}>{selectedExchange.name}</span>
    </div>
  )}
</div>

        {/* Backtest */}
        <button onClick={handleBacktest} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,192,192,0.3)", borderRadius: 12, color: C.silverBright, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, padding: 14, cursor: "pointer", marginBottom: 10 }}>
<BarChart2 size={14} /> Run Backtest — Last 60 Days
        </button>

        {showBacktest && (
          <div className="bot-card" style={{ marginBottom: 10 }}>
            <div className="bot-section-title"><BarChart2 size={14} />
 Backtest Results — Last 60 Days</div>
            {backtestLoading && <div style={{ textAlign: "center", padding: "32px", color: C.textFaint, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>⟳ Running simulation...</div>}
            {!backtestLoading && backtestResult && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "Orders Triggered", value: backtestResult.orders.length.toString() },
                    { label: "Capital Deployed", value: `$${backtestResult.deployed.toFixed(0)}` },
                    { label: "Avg Entry Price", value: backtestResult.avgEntry > 0 ? `$${backtestResult.avgEntry.toFixed(2)}` : "—" },
                    { label: `${selectedToken.label} Accumulated`, value: backtestResult.totalBought > 0 ? `${backtestResult.totalBought.toFixed(4)}` : "—" },
                    { label: "Current Value", value: `$${backtestResult.currentValue.toFixed(0)}` },
                    { label: "Est. PnL", value: `${backtestResult.pnl >= 0 ? "+" : ""}$${backtestResult.pnl.toFixed(0)} (${backtestResult.pnlPct.toFixed(1)}%)`, color: backtestResult.pnl >= 0 ? C.silverBright : C.red },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{s.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: s.color || "#fff", fontFamily: "'Inter', sans-serif" }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                {backtestResult.orders.length === 0 && (
                  <div style={{ textAlign: "center", padding: "24px", color: C.textFaint, fontSize: 13, fontFamily: "'Inter', sans-serif" }}>No zones triggered. Try reducing the pullback depth.</div>
                )}
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 11, color: C.textFaint, fontFamily: "'Inter', sans-serif" }}>
                  <AlertTriangle size={14} /> Simulated results. Not financial advice.
                </div>
              </>
            )}
          </div>
        )}

        {/* Save / Activate */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <button onClick={handleSaveStrategy} disabled={saving} style={{ background: saving ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)", border: "1px solid rgba(192,192,192,0.3)", borderRadius: 12, color: saving ? C.textFaint : C.silverBright, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, padding: 14, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "⟳ Saving..." : "Save Strategy"}
          </button>
          <button onClick={() => showToast("Strategy activated!")} style={{ background: "linear-gradient(135deg,#E8E8E8,#B0B0B0)", border: "none", borderRadius: 12, color: "#0A0A0A", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, padding: 14, cursor: "pointer" }}>
            <Play size={14} /> Activate Strategy
          </button>
        </div>
      </div>

      {toastVisible && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: C.panel, border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>
          {toast}
        </div>
      )}
    </>
  );
}
