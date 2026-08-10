import { useState, useEffect } from "react";
import {
  Bell, Search, TrendingUp, ArrowLeft, Bookmark, Share2,
  ChevronRight, Shield, Home, BarChart3, FileText, User,
  DollarSign, Eye, Plus, Settings
} from "lucide-react";
import {
  LineChart, Line, XAxis, ResponsiveContainer, Area, AreaChart, Tooltip
} from "recharts";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const sparklineData = [
  { v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }, { v: 28 }, { v: 35 }, { v: 40 }
];

const performanceData = [
  { month: "Jan", value: 19500 }, { month: "Feb", value: 19800 },
  { month: "Mar", value: 20200 }, { month: "Apr", value: 20500 },
  { month: "May", value: 21000 }, { month: "Jun", value: 21300 },
];

const portfolioReturnData = [
  { year: "1Y", value: 5 }, { year: "2Y", value: 7 },
  { year: "3Y", value: 6.5 }, { year: "4Y", value: 8 }, { year: "5Y", value: 8.2 },
];

const portfolioData = [
  { name: "Stable Income Basket", returns: "8.2%", risk: "Low Risk", duration: "2.5 yrs", minInvest: "₹5,000", id: "stable-income" },
  { name: "High Yield Opportunities", returns: "9.6%", risk: "Moderate Risk", duration: "3.2 yrs", minInvest: "₹5,000", id: "high-yield" },
];

const holdings = [
  { name: "G-Sec 2028", type: "Government Bond", percentage: "40%", yield: "7.1%", icon: "🔵", color: "#3b82f6" },
  { name: "REC Limited Bond", type: "PSU Bond", percentage: "30%", yield: "8.5%", icon: "🟠", color: "#f97316" },
  { name: "HDFC Bank Bond", type: "Corporate Bond", percentage: "30%", yield: "8.2%", icon: "🔷", color: "#06b6d4" },
];

const portfolioTypes = [
  { id: "safe-income", name: "Safe Income", returns: "6–7%", risk: "Lowest", description: "Highest credit quality bonds (AAA/A1+)", Icon: Shield, color: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/30" },
  { id: "stable-income", name: "Balanced Yield", returns: "7–8%", risk: "Low", description: "Mix of AAA and AA rated bonds", Icon: TrendingUp, color: "from-green-500/20 to-green-600/20", border: "border-green-500/30" },
  { id: "high-yield", name: "High Yield", returns: "8–10%", risk: "Moderate", description: "Includes AA and A rated bonds", Icon: DollarSign, color: "from-orange-500/20 to-orange-600/20", border: "border-orange-500/30" },
];

const comparisonData = [
  { feature: "Returns", ours: "8.0–10.0% p.a.", fd: "5.5–7.0% p.a." },
  { feature: "Liquidity", ours: "Medium (Easy Exit)", fd: "Low (Lock-in)" },
  { feature: "Transparency", ours: "High (Know what you own)", fd: "Low (No visibility)" },
  { feature: "Diversification", ours: "High (Multiple bonds)", fd: "None (Single instrument)" },
  { feature: "Min. Investment", ours: "₹5,000", fd: "₹25,000+" },
  { feature: "Tax Efficiency", ours: "Better (Indexation)", fd: "Lower (Fully taxable)" },
];

const menuItems = [
  { icon: "💳", label: "Transactions", desc: "" },
  { icon: "📊", label: "Tax Reports", desc: "FY 2025–26" },
  { icon: "🏦", label: "Bank Accounts", desc: "2 Linked" },
  { icon: "📄", label: "Documents", desc: "KYC, Reports" },
  { icon: "⚙️", label: "Settings", desc: "Security, Preferences" },
];

const categories = ["All", "Low Risk", "Monthly Income", "Tax Saving"];
const quickAmounts = [5000, 10000, 25000, 50000];

// ─── STYLES ───────────────────────────────────────────────────────────────────

const BG = "#0a0e1a";
const CARD = "#0f1420";
const BORDER = "#1f2937";
const GREEN = "#4ade80";
const GRAY = "#9ca3af";
const DIM = "#6b7280";

const s = {
  screen: {
    background: BG, color: "#fff", minHeight: "100%", paddingBottom: 80,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    background: CARD, padding: "16px", borderBottom: `1px solid ${BORDER}`,
  },
  statusBar: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },
  statusText: { fontSize: 11, color: DIM },
  card: {
    background: CARD, borderRadius: 16, padding: 16,
    border: `1px solid ${BORDER}`,
  },
  greenBtn: {
    background: GREEN, color: "#000", width: "100%", padding: "14px",
    borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14,
    fontWeight: 600, display: "block", textAlign: "center",
  },
  tag: (active) => ({
    padding: "6px 14px", borderRadius: 8, fontSize: 13,
    background: active ? GREEN : CARD, color: active ? "#000" : GRAY,
    border: `1px solid ${active ? GREEN : BORDER}`,
    cursor: "pointer", whiteSpace: "nowrap",
  }),
  holdingRow: {
    background: CARD, borderRadius: 12, padding: 14,
    border: `1px solid ${BORDER}`,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 8,
  },
  iconCircle: (bg = "#1a2332") => ({
    width: 40, height: 40, borderRadius: "50%", background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, flexShrink: 0,
  }),
  navItem: (active) => ({
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 3, padding: "8px 12px", cursor: "pointer", minWidth: 52,
    color: active ? GREEN : DIM,
  }),
  px4: { padding: "0 16px" },
  mb4: { marginBottom: 16 },
  mb6: { marginBottom: 24 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={s.statusBar}>
      <span style={s.statusText}>9:41</span>
      <span style={{ fontSize: 12 }}>📶 📡 🔋</span>
    </div>
  );
}

function BottomNav({ active, navigate }) {
  const items = [
    { icon: Home, label: "Home", id: "home" },
    { icon: Search, label: "Explore", id: "explore" },
    { icon: BarChart3, label: "Portfolio", id: "tracking" },
    { icon: FileText, label: "Orders", id: "orders" },
    { icon: User, label: "Account", id: "account" },
  ];
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, background: CARD,
      borderTop: `1px solid ${BORDER}`, zIndex: 50,
    }}>
      <div style={{ display: "flex", justifyContent: "space-around", padding: "4px 0" }}>
        {items.map(({ icon: Icon, label, id }) => (
          <button key={id} onClick={() => navigate(id)} style={{ ...s.navItem(active === id), background: "none", border: "none" }}>
            <Icon size={20} strokeWidth={active === id ? 2.5 : 2} />
            <span style={{ fontSize: 10 }}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function BackHeader({ title, subtitle, onBack, extra }) {
  return (
    <div style={s.header}>
      <StatusBar />
      <div style={s.row}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "4px 4px 4px 0" }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: 18 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: GRAY }}>{subtitle}</div>}
          </div>
        </div>
        {extra}
      </div>
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function HomeScreen({ navigate }) {
  const [activeCat, setActiveCat] = useState(0);
  return (
    <div style={s.screen}>
      <div style={s.header}>
        <StatusBar />
        <div style={s.row}>
          <div>
            <div style={{ fontSize: 12, color: GRAY }}>Good Evening,</div>
            <div style={{ fontSize: 18 }}>Manasa 👋</div>
            <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>Here's your portfolio overview</div>
          </div>
          <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Net Worth */}
      <div style={{ ...s.px4, paddingTop: 16, ...s.mb4 }}>
        <div style={s.card}>
          <div style={s.row}>
            <div>
              <div style={{ fontSize: 12, color: GRAY }}>Net Worth</div>
              <div style={{ fontSize: 32, marginTop: 4 }}>₹25,400</div>
              <div style={{ fontSize: 11, color: GREEN, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <TrendingUp size={12} /> ₹540 today (+2.16%)
              </div>
            </div>
            <div style={{ ...s.iconCircle("#1a2332"), width: 48, height: 48 }}>
              <TrendingUp size={22} color={GREEN} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ ...s.px4, ...s.mb4 }}>
        <div style={{ position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: DIM }} />
          <input placeholder="Search portfolios, bonds…" style={{
            width: "100%", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10,
            padding: "12px 12px 12px 36px", color: "#fff", fontSize: 13, outline: "none",
            boxSizing: "border-box",
          }} />
        </div>
      </div>

      {/* Categories */}
      <div style={{ ...s.mb4, paddingLeft: 16 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingRight: 16, paddingBottom: 4 }}>
          {categories.map((c, i) => (
            <button key={c} onClick={() => setActiveCat(i)} style={s.tag(activeCat === i)}>{c}</button>
          ))}
        </div>
      </div>

      {/* Featured Portfolios */}
      <div style={{ ...s.px4, ...s.mb4 }}>
        <div style={{ ...s.row, ...s.mb4 }}>
          <div style={{ fontSize: 17 }}>Featured Portfolios</div>
          <button style={{ background: "none", border: "none", color: GREEN, fontSize: 13, cursor: "pointer" }}>See All</button>
        </div>
        {portfolioData.map((p) => (
          <div key={p.id} style={{ ...s.card, marginBottom: 12, cursor: "pointer" }} onClick={() => navigate("portfolio-detail", { id: p.id })}>
            <div style={{ ...s.row, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: GRAY, display: "flex", gap: 6 }}>
                  <span style={{ color: GREEN }}>{p.returns} p.a.</span>
                  <span>•</span>
                  <span>{p.risk}</span>
                </div>
              </div>
              <div style={{ width: 64, height: 40 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="v" stroke={GREEN} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ fontSize: 11, color: DIM, marginBottom: 12, display: "flex", gap: 16 }}>
              <span>{p.duration} avg. duration</span>
              <span>Min. Invest {p.minInvest}</span>
            </div>
            <button style={s.greenBtn}>View Details</button>
          </div>
        ))}
      </div>

      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}

function PortfolioDetailScreen({ navigate, params }) {
  const id = params?.id || "stable-income";
  const isStable = id === "stable-income";
  return (
    <div style={s.screen}>
      <BackHeader
        title={isStable ? "Stable Income Basket" : "High Yield Opportunities"}
        onBack={() => navigate("home")}
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><Bookmark size={20} /></button>
            <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><Share2 size={20} /></button>
          </div>
        }
      />

      <div style={{ ...s.px4, paddingTop: 20, ...s.mb4 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <span style={{ background: GREEN + "22", color: GREEN, padding: "4px 12px", borderRadius: 20, fontSize: 11 }}>
            {isStable ? "Low Risk" : "Moderate Risk"}
          </span>
          <span style={{ background: "#ef444422", color: "#f87171", padding: "4px 12px", borderRadius: 20, fontSize: 11 }}>
            Diversified
          </span>
        </div>
        <p style={{ fontSize: 13, color: GRAY }}>
          {isStable ? "Highest credit quality bonds for stable and predictable returns" : "Strategic mix of high-rated bonds for stable returns"}
        </p>
      </div>

      {/* Key Stats */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={s.grid2}>
          <div style={s.card}>
            <div style={{ fontSize: 24, color: GREEN }}>{isStable ? "8.2%" : "9.6%"} <span style={{ fontSize: 13, color: GRAY }}>p.a.</span></div>
            <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>Expected Yield</div>
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 24, color: GREEN }}>{isStable ? "2.5" : "3.2"} <span style={{ fontSize: 13, color: GRAY }}>yrs</span></div>
            <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>Avg. Duration</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{ fontSize: 15, marginBottom: 10 }}>Expected Returns Over Time</div>
        <div style={s.card}>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioReturnData}>
                <XAxis dataKey="year" stroke={BORDER} tick={{ fill: GRAY, fontSize: 11 }} axisLine={{ stroke: BORDER }} />
                <Line type="monotone" dataKey="value" stroke={GREEN} strokeWidth={3} dot={{ fill: GREEN, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 11, color: GRAY, textAlign: "center", marginTop: 6 }}>
            {isStable ? "8.2%" : "9.6%"} at {isStable ? "2.5" : "3.2"} yrs
          </div>
        </div>
      </div>

      {/* Allocation */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{ ...s.row, marginBottom: 10 }}>
          <div style={{ fontSize: 15 }}>Allocation</div>
          <button style={{ background: "none", border: "none", color: GREEN, fontSize: 13, cursor: "pointer" }}>View Details</button>
        </div>
        <div style={s.card}>
          <div style={{ display: "flex", gap: 4, marginBottom: 10, borderRadius: 6, overflow: "hidden", height: 10 }}>
            <div style={{ flex: 40, background: "#3b82f6" }} />
            <div style={{ flex: 30, background: "#f97316" }} />
            <div style={{ flex: 30, background: "#06b6d4" }} />
          </div>
          <div style={s.grid3}>
            {[["40%", "Govt Bonds"], ["30%", "PSU Bonds"], ["30%", "Bonds"]].map(([pct, lbl]) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13 }}>{pct}</div>
                <div style={{ fontSize: 11, color: GRAY }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{ ...s.row, marginBottom: 10 }}>
          <div style={{ fontSize: 15 }}>Top Holdings</div>
          <div style={{ fontSize: 11, color: GRAY }}>Yield (p.a.)</div>
        </div>
        {holdings.map((h, i) => (
          <div key={i} style={s.holdingRow}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={s.iconCircle()}>{h.icon}</div>
              <div>
                <div style={{ fontSize: 13 }}>{h.name}</div>
                <div style={{ fontSize: 11, color: GRAY }}>{h.type}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13 }}>{h.yield}</div>
              <div style={{ fontSize: 11, color: GRAY }}>{h.percentage} of portfolio</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <button style={s.greenBtn} onClick={() => navigate("invest", { id })}>
          Invest Now
          <div style={{ fontSize: 11, opacity: 0.8 }}>Min. ₹5,000</div>
        </button>
      </div>

      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}

function InvestScreen({ navigate, params }) {
  const id = params?.id || "stable-income";
  const isStable = id === "stable-income";
  const expectedYield = isStable ? 8.2 : 9.6;
  const [amount, setAmount] = useState(10000);
  const [payment, setPayment] = useState("upi");
  const [invested, setInvested] = useState(false);

  const yearly = Math.round((amount * expectedYield) / 100);
  const monthly = Math.round(yearly / 12);

  if (invested) {
    return (
      <div style={{ ...s.screen, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 24, marginBottom: 8 }}>Investment Placed!</div>
        <div style={{ fontSize: 14, color: GRAY, marginBottom: 32 }}>
          ₹{amount.toLocaleString("en-IN")} invested in {isStable ? "Stable Income Basket" : "High Yield Opportunities"}
        </div>
        <button style={{ ...s.greenBtn, maxWidth: 240 }} onClick={() => navigate("tracking")}>
          View Portfolio
        </button>
        <button style={{ background: "none", border: "none", color: GRAY, marginTop: 16, cursor: "pointer", fontSize: 13 }} onClick={() => navigate("home")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={s.screen}>
      <BackHeader
        title="Invest in"
        subtitle={isStable ? "Stable Income Basket" : "High Yield Opportunities"}
        onBack={() => navigate("portfolio-detail", { id })}
      />

      <div style={{ ...s.px4, paddingTop: 12, ...s.mb4 }}>
        <p style={{ fontSize: 13, color: GRAY }}>You're one step away from stable returns</p>
      </div>

      {/* Amount */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={s.card}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 36 }}>₹{amount.toLocaleString("en-IN")}</div>
            <div style={{ fontSize: 11, color: GRAY }}>Minimum ₹5,000</div>
          </div>
          <input type="range" min={5000} max={100000} step={1000} value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            style={{ width: "100%", marginBottom: 12, accentColor: GREEN, cursor: "pointer" }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            {quickAmounts.map(a => (
              <button key={a} onClick={() => setAmount(a)}
                style={{ flex: 1, padding: "8px 0", background: amount === a ? GREEN : "#1a2332", color: amount === a ? "#000" : "#fff", borderRadius: 8, border: "none", fontSize: 12, cursor: "pointer", fontWeight: amount === a ? 600 : 400 }}>
                ₹{a >= 1000 ? (a / 1000) + "K" : a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Returns preview */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{ fontSize: 15, marginBottom: 10 }}>Returns Preview</div>
        <div style={s.card}>
          <div style={{ fontSize: 11, color: GRAY, textAlign: "center", marginBottom: 10 }}>At {expectedYield}% p.a. expected yield</div>
          <div style={s.grid2}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, color: GREEN }}>₹{yearly.toLocaleString("en-IN")}</div>
              <div style={{ fontSize: 11, color: GRAY }}>Est. Yearly Return</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, color: GREEN }}>₹{monthly.toLocaleString("en-IN")}</div>
              <div style={{ fontSize: 11, color: GRAY }}>Est. Monthly Payout</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{ ...s.row, marginBottom: 10 }}>
          <div style={{ fontSize: 15 }}>Payment Method</div>
          <span style={{ background: GREEN + "22", color: GREEN, fontSize: 11, padding: "3px 8px", borderRadius: 6 }}>Recommended</span>
        </div>
        {[
          { id: "upi", icon: "📱", label: "UPI", sub: "Pay using any UPI app" },
          { id: "netbanking", icon: "🏦", label: "Net Banking", sub: "All major banks supported" },
        ].map(pm => (
          <div key={pm.id} onClick={() => setPayment(pm.id)} style={{
            ...s.card, display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 8, cursor: "pointer",
            borderColor: payment === pm.id ? GREEN : BORDER,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ ...s.iconCircle(payment === pm.id ? GREEN + "33" : "#1a2332") }}>{pm.icon}</div>
              <div>
                <div style={{ fontSize: 13 }}>{pm.label}</div>
                <div style={{ fontSize: 11, color: GRAY }}>{pm.sub}</div>
              </div>
            </div>
            {payment === pm.id && (
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#000" }}>✓</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ ...s.px4, marginBottom: 12, textAlign: "center", fontSize: 13, color: GRAY, display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
        <Shield size={14} /> 100% Secure Transactions
      </div>

      <div style={{ ...s.px4, ...s.mb6 }}>
        <button style={s.greenBtn} onClick={() => setInvested(true)}>
          Swipe to Invest →
        </button>
        <p style={{ fontSize: 11, color: DIM, textAlign: "center", marginTop: 8 }}>
          By investing, you agree to our <span style={{ color: GREEN }}>T&C</span>
        </p>
      </div>

      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}

function TrackingScreen({ navigate }) {
  const [period, setPeriod] = useState("6M");
  return (
    <div style={s.screen}>
      <div style={s.header}>
        <StatusBar />
        <div style={s.row}>
          <div style={{ fontSize: 20 }}>My Portfolio</div>
          <div style={{ display: "flex", gap: 4 }}>
            <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><Eye size={20} /></button>
            <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><Plus size={20} /></button>
          </div>
        </div>
      </div>

      <div style={{ ...s.px4, paddingTop: 20, ...s.mb6 }}>
        <div style={s.grid2}>
          <div style={s.card}>
            <div style={{ fontSize: 11, color: GRAY, marginBottom: 4 }}>Invested</div>
            <div style={{ fontSize: 22 }}>₹20,000</div>
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 11, color: GRAY, marginBottom: 4 }}>Current Value</div>
            <div style={{ fontSize: 22, color: GREEN }}>₹21,300</div>
            <div style={{ fontSize: 11, color: GREEN }}>+6.5%</div>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={s.card}>
          <div style={{ ...s.row, marginBottom: 14 }}>
            <div style={{ fontSize: 15 }}>Performance</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["6M", "1Y", "3Y"].map(p => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11,
                  background: period === p ? GREEN : "#1a2332",
                  color: period === p ? "#000" : GRAY,
                }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GREEN} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke={BORDER} tick={{ fill: GRAY, fontSize: 10 }} axisLine={{ stroke: BORDER }} />
                <Tooltip contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: "#fff", fontSize: 12 }} formatter={v => [`₹${v.toLocaleString("en-IN")}`, "Value"]} />
                <Area type="monotone" dataKey="value" stroke={GREEN} strokeWidth={2.5} fill="url(#grad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly income */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{
          background: "linear-gradient(135deg, #4ade8033, #22c55e22)",
          borderRadius: 16, padding: 20, border: `1px solid ${GREEN}44`,
        }}>
          <div style={s.row}>
            <div>
              <div style={{ fontSize: 11, color: "#d1fae5", marginBottom: 4 }}>Monthly Income</div>
              <div style={{ fontSize: 32 }}>₹167</div>
              <div style={{ fontSize: 11, color: GRAY, marginTop: 4 }}>
                Next Payout: <span style={{ color: GREEN }}>Apr 12, 2025</span>
              </div>
            </div>
            <div style={{ fontSize: 32 }}>💰</div>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{ ...s.row, marginBottom: 10 }}>
          <div style={{ fontSize: 15 }}>Holdings</div>
          <button style={{ background: "none", border: "none", color: GREEN, fontSize: 13, cursor: "pointer" }}>View All</button>
        </div>
        {holdings.map((h, i) => (
          <div key={i} style={s.holdingRow}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={s.iconCircle()}>{h.icon}</div>
              <div>
                <div style={{ fontSize: 13 }}>{h.name}</div>
                <div style={{ fontSize: 11, color: GRAY }}>{h.type}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13 }}>{h.yield}</div>
              <div style={{ fontSize: 11, color: GRAY }}>{h.percentage}</div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="tracking" navigate={navigate} />
    </div>
  );
}

function ExploreScreen({ navigate }) {
  return (
    <div style={s.screen}>
      <div style={s.header}>
        <StatusBar />
        <div style={{ fontSize: 20 }}>Explore Portfolios</div>
        <div style={{ fontSize: 13, color: GRAY, marginTop: 2 }}>Choose your risk profile</div>
      </div>
      <div style={{ padding: "20px 16px 0" }}>
        {portfolioTypes.map((p) => {
          const Icon = p.Icon;
          return (
            <div key={p.id} style={{
              background: `linear-gradient(135deg, var(--a), var(--b))`,
              backgroundImage: `linear-gradient(135deg, ${p.color.includes("blue") ? "#3b82f622" : p.color.includes("green") ? "#4ade8022" : "#f9731622"}, ${p.color.includes("blue") ? "#2563eb22" : p.color.includes("green") ? "#22c55e22" : "#ea580c22"})`,
              borderRadius: 16, padding: 20, border: `1px solid ${p.color.includes("blue") ? "#3b82f644" : p.color.includes("green") ? "#4ade8044" : "#f9731644"}`,
              marginBottom: 14,
            }}>
              <div style={{ ...s.row, marginBottom: 14, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: "#d1d5db", marginBottom: 10 }}>{p.description}</div>
                  <div style={{ fontSize: 13, display: "flex", gap: 16 }}>
                    <span><span style={{ color: GRAY }}>Returns: </span><span style={{ color: GREEN }}>{p.returns}</span></span>
                    <span><span style={{ color: GRAY }}>Risk: </span>{p.risk}</span>
                  </div>
                </div>
                <div style={{ ...s.iconCircle("#ffffff1a"), width: 48, height: 48 }}>
                  <Icon size={22} color={GREEN} />
                </div>
              </div>
              <button style={s.greenBtn} onClick={() => navigate("portfolio-detail", { id: p.id })}>View Details</button>
            </div>
          );
        })}
      </div>
      <BottomNav active="explore" navigate={navigate} />
    </div>
  );
}

function OrdersScreen({ navigate }) {
  const orders = [
    { name: "Stable Income Basket", date: "Mar 15, 2025", amount: "₹10,000", status: "Active", icon: "🟢" },
    { name: "High Yield Opportunities", date: "Feb 02, 2025", amount: "₹15,000", status: "Active", icon: "🟢" },
    { name: "Safe Income", date: "Jan 10, 2025", amount: "₹5,000", status: "Matured", icon: "⚪" },
  ];
  return (
    <div style={s.screen}>
      <div style={s.header}>
        <StatusBar />
        <div style={{ fontSize: 20 }}>Orders</div>
      </div>
      <div style={{ padding: "20px 16px 0" }}>
        {orders.map((o, i) => (
          <div key={i} style={{ ...s.card, marginBottom: 10 }}>
            <div style={s.row}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={s.iconCircle()}>{o.icon}</div>
                <div>
                  <div style={{ fontSize: 13 }}>{o.name}</div>
                  <div style={{ fontSize: 11, color: GRAY }}>{o.date}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13 }}>{o.amount}</div>
                <div style={{ fontSize: 11, color: o.status === "Active" ? GREEN : GRAY }}>{o.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="orders" navigate={navigate} />
    </div>
  );
}

function AccountScreen({ navigate }) {
  return (
    <div style={s.screen}>
      <div style={s.header}>
        <StatusBar />
        <div style={s.row}>
          <div style={{ fontSize: 20 }}>Account</div>
          <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><Settings size={20} /></button>
        </div>
      </div>

      {/* Profile */}
      <div style={{ ...s.px4, paddingTop: 20, ...s.mb6 }}>
        <div style={s.card}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>👤</div>
            <div>
              <div style={{ fontSize: 17 }}>Manasa K</div>
              <div style={{ fontSize: 12, color: GRAY }}>manasa.k@email.com</div>
            </div>
          </div>
          <div style={{ background: GREEN + "22", color: GREEN, padding: "4px 12px", borderRadius: 20, fontSize: 11, display: "inline-block" }}>KYC Verified ✓</div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={s.grid3}>
          {[["₹30,000", "Total Invested", null], ["3", "Portfolios", null], ["₹1,300", "Total Returns", "+6.2%"]].map(([val, lbl, sub]) => (
            <div key={lbl} style={{ ...s.card, textAlign: "center" }}>
              <div style={{ fontSize: 18, color: sub ? GREEN : "#fff" }}>{val}</div>
              <div style={{ fontSize: 10, color: GRAY, marginTop: 2 }}>{lbl}</div>
              {sub && <div style={{ fontSize: 10, color: GREEN }}>{sub}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[["➕", "Add Money", GREEN + "33"], ["💸", "Withdraw", "#3b82f633"], ["🎁", "Invite & Earn", "#8b5cf633"], ["❓", "Help", "#f9731633"]].map(([ic, lbl, bg]) => (
            <button key={lbl} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "10px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ ...s.iconCircle(bg), width: 44, height: 44, fontSize: 22 }}>{ic}</div>
              <div style={{ fontSize: 10, color: GRAY }}>{lbl}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        {menuItems.map((m, i) => (
          <div key={i} style={{ ...s.holdingRow, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ ...s.iconCircle("#1a2332"), borderRadius: 10 }}>{m.icon}</div>
              <div>
                <div style={{ fontSize: 13 }}>{m.label}</div>
                {m.desc && <div style={{ fontSize: 11, color: GRAY }}>{m.desc}</div>}
              </div>
            </div>
            <ChevronRight size={16} color={DIM} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <button style={s.greenBtn} onClick={() => navigate("why-debt")}>
          Why Choose Us?
          <div style={{ fontSize: 11, opacity: 0.8 }}>See how we beat FDs</div>
        </button>
      </div>

      <BottomNav active="account" navigate={navigate} />
    </div>
  );
}

function WhyDebtScreen({ navigate }) {
  return (
    <div style={s.screen}>
      <BackHeader title="Why Choose Us?" onBack={() => navigate("account")} />

      <div style={{ ...s.px4, paddingTop: 20, ...s.mb4 }}>
        <div style={{ fontSize: 22 }}>Compared to Fixed Deposits (FD)</div>
      </div>

      {/* Table */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", padding: "12px 14px", background: "#1a2332", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 11, color: GRAY }}>Feature</div>
            <div style={{ fontSize: 11, color: GREEN, textAlign: "center" }}>Our Portfolios</div>
            <div style={{ fontSize: 11, color: GRAY, textAlign: "center" }}>FD</div>
          </div>
          {comparisonData.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", padding: "12px 14px", borderBottom: i < comparisonData.length - 1 ? `1px solid ${BORDER}` : "none" }}>
              <div style={{ fontSize: 12 }}>{r.feature}</div>
              <div style={{ fontSize: 12, color: GREEN, textAlign: "center" }}>{r.ours}</div>
              <div style={{ fontSize: 12, color: GRAY, textAlign: "center" }}>{r.fd}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{ fontSize: 17, marginBottom: 14 }}>Key Benefits</div>
        {[
          ["📈", "Higher Returns", "Earn 8–10% p.a. compared to 5.5–7% in FDs", "#4ade8022"],
          ["💎", "Full Transparency", "See exactly which bonds you own and their performance", "#3b82f622"],
          ["🎯", "Better Liquidity", "Exit anytime without penalties, unlike FDs with lock-in", "#8b5cf622"],
          ["🏆", "Diversification", "Spread risk across multiple high-quality bonds", "#f9731622"],
        ].map(([ic, title, desc, bg]) => (
          <div key={title} style={{ ...s.card, marginBottom: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ ...s.iconCircle(bg), borderRadius: 10, flexShrink: 0 }}>{ic}</div>
            <div>
              <div style={{ fontSize: 13, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 11, color: GRAY }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Promise */}
      <div style={{ ...s.px4, ...s.mb6 }}>
        <div style={{ background: "linear-gradient(135deg,#4ade8033,#22c55e22)", borderRadius: 16, padding: 20, border: `1px solid ${GREEN}44`, display: "flex", gap: 12 }}>
          <div style={{ ...s.iconCircle(GREEN + "33"), borderRadius: 10, flexShrink: 0, fontSize: 26 }}>🛡️</div>
          <div>
            <div style={{ fontSize: 14, marginBottom: 4 }}>Our Promise</div>
            <div style={{ fontSize: 13, color: "#d1d5db" }}>We help you build wealth with safe, transparent and high-yield bond investments.</div>
          </div>
        </div>
      </div>

      <div style={{ ...s.px4, ...s.mb6 }}>
        <button style={s.greenBtn} onClick={() => navigate("home")}>
          Start Investing Today
          <div style={{ fontSize: 11, opacity: 0.8 }}>Min. ₹5,000</div>
        </button>
      </div>

      <BottomNav active="account" navigate={navigate} />
    </div>
  );
}

// ─── ROUTER / SHELL ───────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("home");
  const [params, setParams] = useState({});
  const [history, setHistory] = useState([]);

  function navigate(to, p = {}) {
    setHistory(h => [...h, { screen, params }]);
    setScreen(to);
    setParams(p);
    window.scrollTo(0, 0);
  }

  const screenMap = {
    home: <HomeScreen navigate={navigate} />,
    explore: <ExploreScreen navigate={navigate} />,
    tracking: <TrackingScreen navigate={navigate} />,
    orders: <OrdersScreen navigate={navigate} />,
    account: <AccountScreen navigate={navigate} />,
    "portfolio-detail": <PortfolioDetailScreen navigate={navigate} params={params} />,
    invest: <InvestScreen navigate={navigate} params={params} />,
    "why-debt": <WhyDebtScreen navigate={navigate} />,
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      minHeight: "100vh", background: "#050810", padding: "20px 0",
    }}>
      {/* Phone frame */}
      <div style={{
        width: 390, minHeight: 844, maxHeight: "calc(100vh - 40px)",
        background: BG, borderRadius: 44, overflow: "hidden",
        boxShadow: "0 0 0 8px #1a1a2e, 0 0 0 10px #2a2a3e, 0 30px 80px rgba(0,0,0,0.8)",
        position: "relative", overflowY: "auto",
      }}>
        {/* Notch */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100, display: "flex", justifyContent: "center", pointerEvents: "none",
        }}>
          <div style={{ width: 120, height: 28, background: "#000", borderRadius: "0 0 18px 18px", marginTop: 0 }} />
        </div>
        <div style={{ marginTop: -28 }}>
          {screenMap[screen] || screenMap.home}
        </div>
      </div>
    </div>
  );
}
