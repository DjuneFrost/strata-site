"use client";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

const C = {
  panel: "#161616",
  border: "rgba(255,255,255,0.08)",
  text: "#E6E6E6",
  textDim: "rgba(230,230,230,0.45)",
  textFaint: "rgba(230,230,230,0.25)",
  silver: "#C0C0C0",
  silverBright: "#F2F2F2",
  red: "#ff6b6b",
  green: "#6fcf97",
};

const SECTIONS = [
  { id: "account", label: "Account", icon: "◔" },
  { id: "settings", label: "Account Settings", icon: "⚙" },
  { id: "history", label: "Deposit & Withdraw History", icon: "↕" },
  { id: "subscriptions", label: "Subscriptions", icon: "★" },
  { id: "billing", label: "Billing History", icon: "▤" },
  { id: "payment", label: "Payment Method", icon: "◈" },
];

// Mock history data — replace with real Supabase data later
const MOCK_HISTORY = [];

function AccountSection({ user }) {
  const displayName = user?.email?.address?.split("@")[0] || user?.wallet?.address?.slice(0, 6) || "User";
  const [username, setUsername] = useState(displayName);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(192,192,192,0.1)", border: "2px dashed rgba(192,192,192,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: C.silver, cursor: "pointer", overflow: "hidden" }}>
            {user?.google?.picture || user?.twitter?.profilePictureUrl ? (
              <img src={user?.google?.picture || user?.twitter?.profilePictureUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />
            ) : (
              username[0]?.toUpperCase()
            )}
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: "#1a1a1a", border: "1px solid rgba(192,192,192,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer", color: C.silver }}>✎</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Newsreader', serif", fontSize: 20, fontWeight: 600, color: C.silverBright }}>{username}</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, marginTop: 3 }}>
            Joined {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* General */}
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 14 }}>General</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div>
          <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, display: "block", marginBottom: 7 }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: "100%", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: C.silverBright, fontFamily: "'Inter', sans-serif", fontSize: 13, padding: "10px 12px", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, display: "block", marginBottom: 7 }}>Email address</label>
          <input
            type="email"
            defaultValue={user?.email?.address || "—"}
            readOnly
            style={{ width: "100%", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, color: C.textDim, fontFamily: "'Inter', sans-serif", fontSize: 13, padding: "10px 12px", outline: "none", boxSizing: "border-box", cursor: "not-allowed" }}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        style={{ padding: "9px 20px", borderRadius: 8, background: saved ? "rgba(111,207,151,0.15)" : "linear-gradient(135deg,#E8E8E8,#B0B0B0)", border: saved ? "1px solid rgba(111,207,151,0.3)" : "none", color: saved ? C.green : "#0A0A0A", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 28 }}
      >
        {saved ? "✓ Saved" : "Save changes"}
      </button>

      {/* Delete account */}
      <div style={{ paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: C.silverBright, marginBottom: 4 }}>Delete account</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, marginBottom: 14 }}>This action is irreversible and will delete your account and all data.</div>
        <button style={{ padding: "8px 18px", borderRadius: 8, background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", color: C.red, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          Delete
        </button>
      </div>
    </div>
  );
}

function HistorySection() {
  return (
    <div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 16 }}>
        Deposit & Withdraw History
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Date", "Type", "Asset", "Amount", "Network", "Status"].map(h => (
              <th key={h} style={{ textAlign: "left", fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, padding: "10px 10px", borderBottom: `1px solid ${C.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MOCK_HISTORY.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "40px 10px", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.textFaint }}>
                No transactions yet — your deposit & withdraw history will appear here.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function SecuritySection() {
  return (
    <div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 16 }}>Security</div>
      {[
        { label: "Two-Factor Authentication", desc: "Add an extra layer of security to your account.", action: "Enable", done: false },
        { label: "Active Sessions", desc: "Manage devices currently logged into your account.", action: "View", done: false },
        { label: "Login History", desc: "See all recent login activity.", action: "View", done: false },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: C.silverBright, marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint }}>{item.desc}</div>
          </div>
          <button style={{ padding: "7px 16px", borderRadius: 8, background: "transparent", border: "1px solid rgba(192,192,192,0.25)", color: C.textDim, fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, marginLeft: 16 }}>
            {item.action}
          </button>
        </div>
      ))}
    </div>
  );
}

function PreferencesSection() {
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const Toggle = ({ val, set }) => (
    <div onClick={() => set(!val)} style={{ width: 40, height: 22, background: val ? "rgba(192,192,192,0.5)" : "rgba(255,255,255,0.1)", borderRadius: 11, cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s", border: `1px solid ${val ? "rgba(192,192,192,0.6)" : "rgba(255,255,255,0.1)"}` }}>
      <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: val ? 20 : 2, transition: "left 0.2s" }} />
    </div>
  );

  return (
    <div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 16 }}>Preferences</div>
      {[
        { label: "Trade notifications", desc: "Get notified before each DCA order executes.", val: notifications, set: setNotifications },
        { label: "Weekly report", desc: "Receive a weekly summary of your bot activity by email.", val: weeklyReport, set: setWeeklyReport },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: C.silverBright, marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint }}>{item.desc}</div>
          </div>
          <Toggle val={item.val} set={item.set} />
        </div>
      ))}
    </div>
  );
}

function AccountSettingsSection() {
  return (
    <div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 16 }}>Account Settings</div>
      {[
        { label: "Language", value: "English" },
        { label: "Timezone", value: "UTC" },
        { label: "Currency display", value: "USD" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: C.silverBright }}>{item.label}</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.textDim }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function SubscriptionsSection() {
  return (
    <div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 16 }}>Subscriptions</div>
      <div style={{ background: "#0d0d0d", border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px", marginBottom: 16 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: C.silverBright, marginBottom: 4 }}>Current Plan</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 700, color: C.textDim, marginBottom: 8 }}>Free</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint }}>No active subscription</div>
      </div>
      <a href="/pricing" style={{ display: "inline-block", padding: "10px 20px", borderRadius: 8, background: "linear-gradient(135deg,#E8E8E8,#B0B0B0)", color: "#080808", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
        ✦ Upgrade plan
      </a>
    </div>
  );
}

function BillingSection() {
  return (
    <div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 16 }}>Billing History</div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Date", "Plan", "Amount", "Status"].map(h => (
              <th key={h} style={{ textAlign: "left", fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textFaint, padding: "10px", borderBottom: `1px solid ${C.border}` }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} style={{ padding: "40px 10px", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.textFaint }}>
              No billing history yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PaymentSection() {
  return (
    <div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textFaint, marginBottom: 16 }}>Payment Method</div>
      <div style={{ background: "#0d0d0d", border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px", marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.textFaint, marginBottom: 12 }}>No payment method added yet.</div>
        <button style={{ padding: "9px 20px", borderRadius: 8, background: "transparent", border: "1px solid rgba(192,192,192,0.3)", color: C.silverBright, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          + Add payment method
        </button>
      </div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, lineHeight: 1.6 }}>
        💳 We accept credit cards, debit cards and crypto payments via Stripe.
      </div>
    </div>
  );
}

export default function AccountModal({ onClose }) {
  const { user } = usePrivy();
  const [activeSection, setActiveSection] = useState("account");

const renderContent = () => {
  switch (activeSection) {
    case "account": return <AccountSection user={user} />;
    case "history": return <HistorySection />;
    case "security": return <SecuritySection />;
    case "preferences": return <PreferencesSection />;
    case "settings": return <AccountSettingsSection />;
    case "subscriptions": return <SubscriptionsSection />;
    case "billing": return <BillingSection />;
    case "payment": return <PaymentSection />;
    default: return null;
  }
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 500 }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        zIndex: 501, width: "min(860px, 95vw)", height: "min(580px, 90vh)",
        background: C.panel, border: `1px solid ${C.border}`,
        borderRadius: 16, overflow: "hidden", display: "flex",
        boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
      }}>

        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0, background: "#111111", borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px", marginBottom: 20 }}>
            <img src="/logozillaengine.png" alt="Zilla Engine" style={{ width: 22, height: 22, objectFit: "contain" }} />
            <span style={{ fontFamily: "'Newsreader', serif", fontSize: 15, fontWeight: 600, color: C.silverBright }}>Zilla Engine</span>
          </div>

          <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8,
                  background: activeSection === s.id ? "rgba(192,192,192,0.08)" : "transparent",
                  border: "none", color: activeSection === s.id ? C.silverBright : C.textDim,
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
                  cursor: "pointer", textAlign: "left", width: "100%",
                  borderLeft: activeSection === s.id ? "2px solid rgba(192,192,192,0.5)" : "2px solid transparent",
                }}
              >
                <span style={{ fontSize: 13, flexShrink: 0 }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
            <a href="mailto:contact@zillaengine.xyz" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.textFaint, textDecoration: "none" }}>
              ↗ Get help
            </a>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px 28px", position: "relative" }}>
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 16, right: 16, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: C.textDim, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
          {renderContent()}
        </div>
      </div>
    </>
  );
}
