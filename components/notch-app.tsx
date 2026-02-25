import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════ */
const TEAMS = [
  { id: "ARS", name: "Arsenal", league: "Premier League", index: 618, change: 3.2, color: "#EF0107", logo: "/teams/arsenal.jpg", sparkline: [580,590,585,600,608,612,618], history: [540,555,548,570,562,580,575,590,585,600,595,608,602,612,610,618,615,620,618,625,618] },
  { id: "LIV", name: "Liverpool", league: "Premier League", index: 665, change: 2.7, color: "#C8102E", logo: "/teams/liverpool.jpg", sparkline: [630,640,638,650,655,660,665], history: [610,618,625,630,628,640,635,638,642,650,648,655,652,660,658,662,660,665,663,668,665] },
  { id: "MCI", name: "Man City", league: "Premier League", index: 702, change: 1.1, color: "#6CABDD", logo: "/teams/mancity.jpg", sparkline: [690,688,695,692,698,700,702], history: [710,705,700,695,690,688,692,695,690,692,698,695,700,698,702,700,705,702,700,703,702] },
  { id: "RMA", name: "Real Madrid", league: "La Liga", index: 748, change: 1.9, color: "#FEBE10", logo: "/teams/realmadrid.jpg", sparkline: [720,725,730,735,740,742,748], history: [700,710,715,720,718,725,722,730,728,735,732,740,738,742,740,745,743,748,746,750,748] },
  { id: "MUN", name: "Man United", league: "Premier League", index: 540, change: -1.4, color: "#DA291C", logo: "/teams/manutd.jpg", sparkline: [560,555,550,548,545,542,540], history: [580,575,570,565,560,558,555,552,550,548,550,548,545,548,545,542,544,540,542,538,540] },
  { id: "BAR", name: "Barcelona", league: "La Liga", index: 690, change: -0.8, color: "#A50044", logo: "/teams/barcelona.jpg", sparkline: [700,698,695,693,692,691,690], history: [710,708,705,700,702,698,700,695,697,693,695,692,694,691,693,690,692,688,690,691,690] },
  { id: "BAY", name: "Bayern", league: "Bundesliga", index: 720, change: 0.6, color: "#DC052D", logo: "/teams/bayern.jpg", sparkline: [710,712,715,714,716,718,720], history: [700,705,708,710,708,712,710,715,713,714,716,714,716,718,716,718,720,718,722,720,720] },
  { id: "CHE", name: "Chelsea", league: "Premier League", index: 590, change: 1.3, color: "#034694", logo: "/teams/chelsea.jpg", sparkline: [570,575,572,580,582,586,590], history: [555,560,558,565,570,568,575,572,576,580,578,582,580,586,584,588,586,590,588,592,590] },
  { id: "PSG", name: "PSG", league: "Ligue 1", index: 680, change: 0.9, color: "#004170", logo: "/teams/psg.jpg", sparkline: [665,668,670,672,675,678,680], history: [650,655,658,660,665,663,668,666,670,668,672,670,675,673,678,676,680,678,682,680,680] },
  { id: "JUV", name: "Juventus", league: "Serie A", index: 612, change: -2.1, color: "#FFFFFF", logo: "/teams/juventus.jpg", sparkline: [640,635,630,625,620,616,612], history: [660,655,650,645,640,638,635,632,630,628,625,622,620,618,616,618,614,612,614,610,612] },
];

const MATCHES = [
  { home: "Arsenal", away: "Man City", time: "15:00", league: "Premier League", homeOdds: 2.1, awayOdds: 2.8 },
  { home: "Barcelona", away: "Real Madrid", time: "20:00", league: "La Liga", homeOdds: 2.4, awayOdds: 2.5 },
  { home: "Liverpool", away: "Chelsea", time: "17:30", league: "Premier League", homeOdds: 1.7, awayOdds: 3.8 },
];

const FEED_ITEMS = [
  { type: "result", time: "2m", headline: "Arsenal 3–1 Tottenham", body: "Saka brace seals NLD. ARS index surges.", tag: "PL", impact: "+2.4%", up: true, teamId: "ARS" },
  { type: "news", time: "18m", headline: "Mbappé ruled out 3 weeks", body: "Hamstring injury confirmed after UCL.", tag: "RMA", impact: "-1.1%", up: false, teamId: "RMA" },
  { type: "transfer", time: "45m", headline: "Chelsea close to Olmo deal", body: "€65M agreed. Medical on Thursday.", tag: "CHE", impact: "+0.8%", up: true, teamId: "CHE" },
  { type: "result", time: "1h", headline: "Man United 0–2 Brighton", body: "Another home loss. MUN at 90-day low.", tag: "MUN", impact: "-1.8%", up: false, teamId: "MUN" },
  { type: "news", time: "2h", headline: "Pep hints at tactical shift", body: "\"We need something new for the second half.\"", tag: "MCI", impact: null, up: null, teamId: "MCI" },
  { type: "result", time: "3h", headline: "Bayern 4–0 Dortmund", body: "Kane hat-trick in Der Klassiker.", tag: "BAY", impact: "+1.5%", up: true, teamId: "BAY" },
  { type: "news", time: "8h", headline: "Salah signs new deal", body: "2-year extension confirmed at £350k/wk.", tag: "LIV", impact: "+1.2%", up: true, teamId: "LIV" },
];

const POSITIONS = [
  { team: "ARS", side: "long", entry: 605, current: 618, size: 100, leverage: 5 },
  { team: "LIV", side: "long", entry: 650, current: 665, size: 50, leverage: 2 },
  { team: "MUN", side: "short", entry: 555, current: 540, size: 75, leverage: 3 },
];

const MOCK_LEAGUES = [
  { id: "xK7m", name: "The Boys February", buyIn: "$20", status: "active", start: "Feb 1", end: "Feb 28", myRank: 2, memberCount: 6,
    members: [
      { name: "cryptogunner", balance: 142.30, pnl: 42.30, pct: 42.3, rank: 1 },
      { name: "you", balance: 131.50, pnl: 31.50, pct: 31.5, rank: 2 },
      { name: "arsenalfan_fi", balance: 118.20, pnl: 18.20, pct: 18.2, rank: 3 },
      { name: "degensam", balance: 104.60, pnl: 4.60, pct: 4.6, rank: 4 },
      { name: "premtrader", balance: 88.40, pnl: -11.60, pct: -11.6, rank: 5 },
      { name: "madridista99", balance: 72.10, pnl: -27.90, pct: -27.9, rank: 6 },
    ],
    trades: [
      { user: "cryptogunner", action: "Long ARS 5x", amount: "$30", time: "2m", profit: true },
      { user: "you", action: "Short MUN 3x", amount: "$25", time: "15m", profit: true },
      { user: "arsenalfan_fi", action: "Long LIV 2x", amount: "$50", time: "1h", profit: true },
      { user: "premtrader", action: "Long MUN 5x", amount: "$40", time: "2h", profit: false },
      { user: "degensam", action: "Short BAR 2x", amount: "$20", time: "3h", profit: false },
    ],
  },
  { id: "pQ3n", name: "Office League", buyIn: null, status: "active", start: "Feb 1", end: "Feb 28", myRank: 1, memberCount: 4,
    members: [
      { name: "you", balance: 119.80, pnl: 19.80, pct: 19.8, rank: 1 },
      { name: "chelseablue", balance: 108.50, pnl: 8.50, pct: 8.5, rank: 2 },
      { name: "munichballer", balance: 96.20, pnl: -3.80, pct: -3.8, rank: 3 },
      { name: "juventino23", balance: 81.40, pnl: -18.60, pct: -18.6, rank: 4 },
    ],
    trades: [
      { user: "you", action: "Long CHE 2x", amount: "$30", time: "30m", profit: true },
      { user: "chelseablue", action: "Long CHE 5x", amount: "$20", time: "1h", profit: true },
    ],
  },
];

/* ════════════════════════════════════════════
   THEME
   ════════════════════════════════════════════ */
const C = {
  // backgrounds
  bg: "#060B14",
  surface: "#0D1520",
  surfaceHover: "#111B2B",
  border: "#162033",
  borderLight: "#1E2D45",
  // accent
  cyan: "#22D3EE",
  cyanDim: "rgba(34,211,238,0.08)",
  cyanGlow: "rgba(34,211,238,0.15)",
  // semantic
  up: "#34D399",
  upDim: "rgba(52,211,153,0.08)",
  upBorder: "rgba(52,211,153,0.2)",
  down: "#FB7185",
  downDim: "rgba(251,113,133,0.08)",
  downBorder: "rgba(251,113,133,0.2)",
  // text
  white: "#F1F5F9",
  text: "#CBD5E1",
  mid: "#64748B",
  dim: "#475569",
  faint: "#1E293B",
  // gold (prize)
  gold: "#FCD34D",
  goldDim: "rgba(252,211,77,0.08)",
  // fonts
  display: "'Syne', sans-serif",
  body: "'Manrope', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

/* ════════════════════════════════════════════
   MICRO COMPONENTS
   ════════════════════════════════════════════ */
function Spark({ data, up, w = 64, h = 28, gradId }) {
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const col = up ? C.up : C.down;
  const gid = gradId || `sp${data[0]}${data[data.length - 1]}`;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - mn) / rng) * h}`
  ).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.25" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gid})`} />
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BigChart({ data, up, w = 350, h = 140, gradId }) {
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
  const col = up ? C.up : C.down;
  const gid = gradId || `ch${data[0]}${data[data.length - 1]}`;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - mn) / rng) * (h - 20) - 10}`
  ).join(" ");
  const last = pts.split(" ").pop().split(",");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={col} stopOpacity="0.15" />
          <stop offset="100%" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0,1,2,3].map(i => (
        <line key={i} x1="0" y1={(i/3)*h} x2={w} y2={(i/3)*h} stroke={C.faint} strokeWidth="0.5" />
      ))}
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gid})`} />
      <polyline points={pts} fill="none" stroke={col} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={col} />
      <circle cx={last[0]} cy={last[1]} r="6" fill={col} opacity="0.2" />
    </svg>
  );
}

function Tag({ children, style }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
      textTransform: "uppercase", fontFamily: C.mono,
      color: C.mid, ...style,
    }}>{children}</span>
  );
}

function Sheet({ children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(6,11,20,0.85)", backdropFilter: "blur(20px)",
      }} />
      <div style={{
        position: "relative", width: "100%", maxWidth: 430,
        background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`,
        borderRadius: "24px 24px 0 0",
        padding: "12px 22px 36px", zIndex: 201,
        animation: "rise 0.32s cubic-bezier(.16,1,.3,1)",
        maxHeight: "92vh", overflowY: "auto",
        borderTop: `1px solid ${C.borderLight}`,
        boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{ width: 32, height: 3, background: C.border, borderRadius: 3, margin: "0 auto 20px" }} />
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   ORACLE SHEET
   ════════════════════════════════════════════ */
function OracleSheet({ onClose, initialTab = "price" }: { onClose: () => void; initialTab?: "price" | "trade" }) {
  const [tab, setTab] = useState<"price" | "trade">(initialTab);

  const factors = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" /><polyline points="16,7 22,7 22,13" />
        </svg>
      ),
      label: "Betting Markets",
      color: C.cyan,
      text: "Bookmaker odds represent millions of pounds from analysts and sharp bettors. When the market prices a team higher than our model expects, their index moves up.",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
      label: "Squad & Injuries",
      color: C.up,
      text: "Key players injured? Index drops. Star striker back? Index ticks up. We track squad fitness and availability across every team in real time.",
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1.5" fill="currentColor" />
        </svg>
      ),
      label: "News & Transfers",
      color: C.gold,
      text: "Manager sacked, dressing room fallout, blockbuster signing — we factor breaking news and transfer activity into every price update.",
    },
  ];

  const tradeItems = [
    {
      label: "Long",
      tag: "BUY",
      tagColor: C.up,
      tagBg: C.upDim,
      tagBorder: C.upBorder,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /><polyline points="17,6 23,6 23,12" />
        </svg>
      ),
      color: C.up,
      bg: C.upDim,
      border: C.upBorder,
      headline: "You think the team will rise",
      text: "You open a long on Arsenal at $618. If the price goes to $650, you profit the difference. If it drops, you lose.",
      example: { left: "Entry $618", right: "Exit $650 = +$32" },
    },
    {
      label: "Short",
      tag: "SELL",
      tagColor: C.down,
      tagBg: C.downDim,
      tagBorder: C.downBorder,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" /><polyline points="17,18 23,18 23,12" />
        </svg>
      ),
      color: C.down,
      bg: C.downDim,
      border: C.downBorder,
      headline: "You think the team will fall",
      text: "You short Man United at $540. If the price falls to $510, you keep the drop. If it rises, you lose.",
      example: { left: "Entry $540", right: "Exit $510 = +$30" },
    },
  ];

  return (
    <Sheet onClose={onClose}>
      {/* Title */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ color: C.white, fontWeight: 800, fontSize: 20, fontFamily: C.display, letterSpacing: "-0.02em" }}>
          How team prices are calculated
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", background: C.surface, borderRadius: 12, padding: 4,
        marginBottom: 20, border: `1px solid ${C.border}`,
      }}>
        {(["price", "trade"] as const).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 9, border: "none", cursor: "pointer",
                fontFamily: C.display, fontWeight: 700, fontSize: 13,
                background: active ? C.cyan : "transparent",
                color: active ? C.bg : C.mid,
                transition: "all 0.18s ease",
              }}
            >
              {t === "price" ? "Pricing" : "How to Trade"}
            </button>
          );
        })}
      </div>

      {/* PRICING TAB */}
      {tab === "price" && (
        <>
          <div style={{
            background: C.surface, borderRadius: 14, padding: "14px 16px",
            marginBottom: 18, border: `1px solid ${C.border}`,
          }}>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.65, fontFamily: C.body, margin: 0 }}>
              Every club has a live index price — a number representing how strong that team is <em style={{ color: C.white }}>right now</em>. Arsenal trades at <span style={{ color: C.up, fontWeight: 700, fontFamily: C.mono }}>$618</span>. Burnley at <span style={{ color: C.down, fontWeight: 700, fontFamily: C.mono }}>$142</span>. Win more, price goes up. Lose, it drops.
            </p>
          </div>

          <div style={{ color: C.mid, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: C.mono, marginBottom: 12 }}>What moves the price</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            {factors.map((f, i) => (
              <div key={i} style={{
                background: C.surface, borderRadius: 14, padding: "13px 15px",
                border: `1px solid ${C.border}`,
                display: "flex", gap: 13, alignItems: "flex-start",
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: `${f.color}12`, border: `1px solid ${f.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: f.color,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ color: C.white, fontWeight: 700, fontSize: 13, fontFamily: C.display, marginBottom: 4 }}>{f.label}</div>
                  <div style={{ color: C.mid, fontSize: 12, lineHeight: 1.6, fontFamily: C.body }}>{f.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: C.cyanDim, borderRadius: 14, padding: "13px 15px",
            border: `1px solid ${C.cyan}20`,
          }}>
            <div style={{ color: C.cyan, fontWeight: 700, fontSize: 12, fontFamily: C.display, marginBottom: 5 }}>We are the oracle</div>
            <div style={{ color: C.mid, fontSize: 12, lineHeight: 1.6, fontFamily: C.body }}>
              We crunch results, markets, injuries and news — and the price we publish is the official index. Every trade on Notch uses this price.
            </div>
          </div>
        </>
      )}

      {/* HOW TO TRADE TAB */}
      {tab === "trade" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
            {tradeItems.map((item, i) => (
              <div key={i} style={{
                background: C.surface, borderRadius: 16, padding: "16px",
                border: `1px solid ${C.border}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: item.bg, border: `1px solid ${item.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: item.color, flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: C.white, fontWeight: 800, fontSize: 16, fontFamily: C.display }}>{item.label}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, fontFamily: C.mono,
                      color: item.tagColor, background: item.tagBg,
                      border: `1px solid ${item.tagBorder}`,
                      padding: "2px 7px", borderRadius: 5, letterSpacing: "0.08em",
                    }}>{item.tag}</span>
                  </div>
                </div>
                <div style={{ color: C.white, fontWeight: 600, fontSize: 13, fontFamily: C.body, marginBottom: 6 }}>{item.headline}</div>
                <div style={{ color: C.mid, fontSize: 12, lineHeight: 1.6, fontFamily: C.body, marginBottom: 10 }}>{item.text}</div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  background: `${item.color}08`, borderRadius: 8,
                  padding: "8px 12px", border: `1px solid ${item.color}18`,
                }}>
                  <span style={{ color: C.mid, fontSize: 11, fontFamily: C.mono }}>{item.example.left}</span>
                  <span style={{ color: item.color, fontSize: 11, fontWeight: 700, fontFamily: C.mono }}>{item.example.right}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Leverage */}
          <div style={{ color: C.mid, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: C.mono, marginBottom: 12 }}>Leverage</div>
          <div style={{
            background: C.surface, borderRadius: 16, padding: "16px",
            border: `1px solid ${C.border}`, marginBottom: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
              </svg>
              <span style={{ color: C.white, fontWeight: 700, fontSize: 13, fontFamily: C.display }}>Multiply your position</span>
            </div>
            <div style={{ color: C.mid, fontSize: 12, lineHeight: 1.65, fontFamily: C.body, marginBottom: 12 }}>
              Leverage lets you control a bigger position with less cash. <span style={{ color: C.white }}>5x leverage means a $10 trade acts like $50</span> — your profits and losses are both multiplied.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["1x", "2x", "3x", "5x"].map((lv) => (
                <div key={lv} style={{
                  flex: 1, textAlign: "center", padding: "7px 0",
                  background: lv === "5x" ? C.goldDim : C.surfaceHover,
                  border: `1px solid ${lv === "5x" ? C.gold + "40" : C.border}`,
                  borderRadius: 8,
                }}>
                  <div style={{ color: lv === "5x" ? C.gold : C.mid, fontWeight: 700, fontSize: 13, fontFamily: C.mono }}>{lv}</div>
                  <div style={{ color: C.dim, fontSize: 9, fontFamily: C.mono, marginTop: 2 }}>
                    {lv === "1x" ? "no boost" : lv === "2x" ? "2× gains/loss" : lv === "3x" ? "3× gains/loss" : "max risk"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: C.downDim, borderRadius: 12, padding: "11px 14px",
            border: `1px solid ${C.downBorder}`,
            display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.down} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span style={{ color: C.down, fontSize: 11, lineHeight: 1.55, fontFamily: C.body }}>
              Higher leverage = higher risk. You can lose your full stake if the price moves against you. Start with 1x or 2x.
            </span>
          </div>
        </>
      )}
    </Sheet>
  );
}

/* ════════════════════════════════════════════
   TEAM SLIP
   ════════════════════════════════════════════ */
function TeamSlip({ team, onClose }) {
  const [amt, setAmt] = useState("");
  const [side, setSide] = useState("long");
  const [lev, setLev] = useState(1);
  const [tf, setTf] = useState("30d");
  const [oracleTab, setOracleTab] = useState<"price" | "trade" | null>(null);
  const up = team.change >= 0;

  return (
    <Sheet onClose={onClose}>
      {oracleTab && <OracleSheet initialTab={oracleTab} onClose={() => setOracleTab(null)} />}

      {/* Quick-info pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { label: "How is price set?", tab: "price" as const, icon: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" /><polyline points="16,7 22,7 22,13" />
            </svg>
          )},
          { label: "How to trade?", tab: "trade" as const, icon: (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )},
        ].map((pill) => (
          <button
            key={pill.tab}
            onClick={() => setOracleTab(pill.tab)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 20,
              background: C.cyanDim, border: `1px solid ${C.cyan}25`,
              color: C.cyan, fontSize: 11, fontWeight: 600,
              cursor: "pointer", fontFamily: C.body,
              transition: "border-color 0.15s",
            }}
          >
            {pill.icon}
            {pill.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 50, height: 50, borderRadius: 16,
          background: `linear-gradient(135deg, ${team.color}18, ${team.color}08)`,
          border: `1px solid ${team.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          <img src={team.logo} alt={team.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.white, fontWeight: 800, fontSize: 20, fontFamily: C.display, letterSpacing: "-0.02em" }}>{team.name}</div>
          <div style={{ color: C.dim, fontSize: 12, fontFamily: C.mono, marginTop: 2 }}>{team.league}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: C.white, fontSize: 22, fontWeight: 700, fontFamily: C.mono, letterSpacing: "-0.03em" }}>${team.index.toFixed(2)}</div>
          <div style={{ color: up ? C.up : C.down, fontWeight: 600, fontSize: 13, fontFamily: C.mono }}>{up ? "▲" : "▼"} {up ? "+" : ""}{team.change}%</div>
        </div>
      </div>

      {/* Chart */}
      <div style={{
        background: C.bg, borderRadius: 16, padding: "14px 12px 10px",
        marginBottom: 18, border: `1px solid ${C.border}`, overflow: "hidden",
      }}>
        <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
          {["7d","30d","90d"].map(t => (
            <button key={t} onClick={() => setTf(t)} style={{
              padding: "4px 12px", borderRadius: 8, border: "none",
              background: tf === t ? C.borderLight : "transparent",
              color: tf === t ? C.white : C.dim,
              fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: C.mono,
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
        <div style={{ width: "100%" }}>
          <BigChart data={team.history} up={up} gradId={`bch-${team.id}`} />
        </div>
      </div>

      {/* Side toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: C.bg, borderRadius: 14, padding: 4 }}>
        {["long","short"].map(s => (
          <button key={s} onClick={() => setSide(s)} style={{
            flex: 1, padding: "12px 0", borderRadius: 11,
            fontFamily: C.display, fontWeight: 800, fontSize: 14, cursor: "pointer",
            transition: "all 0.2s", letterSpacing: "-0.01em",
            background: side === s ? (s === "long" ? C.upDim : C.downDim) : "transparent",
            color: side === s ? (s === "long" ? C.up : C.down) : C.dim,
            border: side === s ? `1px solid ${s === "long" ? C.upBorder : C.downBorder}` : "1px solid transparent",
          }}>
            {s === "long" ? "↑ Long" : "↓ Short"}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div style={{
        background: C.bg, borderRadius: 14, padding: "14px 16px",
        marginBottom: 10, display: "flex", alignItems: "center",
        border: `1px solid ${C.border}`, overflow: "hidden",
      }}>
        <span style={{ color: C.dim, fontSize: 24, fontWeight: 700, marginRight: 6, fontFamily: C.mono }}>$</span>
        <input type="number" placeholder="0.00" value={amt} onChange={e => setAmt(e.target.value)} style={{
          flex: 1, background: "none", border: "none", outline: "none",
          color: C.white, fontSize: 24, fontWeight: 700, fontFamily: C.mono,
        }} />
        <Tag style={{ color: C.cyan, background: C.cyanDim, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.08em" }}>TESTNET</Tag>
      </div>

      {/* Quick amounts */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[10,25,50,100].map(v => (
          <button key={v} onClick={() => setAmt(String(v))} style={{
            flex: 1, padding: "9px 0", borderRadius: 10,
            background: amt === String(v) ? C.borderLight : C.bg,
            border: `1px solid ${C.border}`, color: C.text,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: C.mono,
          }}>${v}</button>
        ))}
      </div>

      {/* Leverage */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <Tag>Leverage</Tag>
          <span style={{ color: C.cyan, fontSize: 13, fontWeight: 700, fontFamily: C.mono }}>{lev}×</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[1,2,5,10].map(l => (
            <button key={l} onClick={() => setLev(l)} style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              background: lev === l ? C.borderLight : C.bg,
              border: `1px solid ${lev === l ? C.cyan + "40" : C.border}`,
              color: lev === l ? C.cyan : C.dim,
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: C.mono,
              transition: "all 0.15s",
            }}>{l}×</button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button style={{
        width: "100%", padding: "16px 0", borderRadius: 16, border: "none",
        fontFamily: C.display, fontWeight: 800, fontSize: 16, cursor: "pointer",
        letterSpacing: "-0.01em",
        background: side === "long"
          ? "linear-gradient(135deg, #34D399 0%, #059669 100%)"
          : "linear-gradient(135deg, #FB7185 0%, #E11D48 100%)",
        color: "#fff",
        boxShadow: side === "long"
          ? "0 4px 20px rgba(52,211,153,0.25)"
          : "0 4px 20px rgba(251,113,133,0.25)",
      }}>
        {side === "long" ? "Long" : "Short"} {team.id} · ${amt || "0"} · {lev}×
      </button>
    </Sheet>
  );
}

/* ════════════════════════════════════════════
   MATCH SLIP
   ════════════════════════════���═══════════════ */
function MatchSlip({ match, initialSide, onClose }) {
  const [amt, setAmt] = useState("");
  const [side, setSide] = useState(initialSide || "home");
  const [lev, setLev] = useState(1);
  const isH = side === "home";
  const display = isH ? match.home : match.away;
  const odds = isH ? match.homeOdds : match.awayOdds;
  const ht = TEAMS.find(t => t.name === match.home);
  const at = TEAMS.find(t => t.name === match.away);

  return (
    <Sheet onClose={onClose}>
      {/* Fixture header */}
      <div style={{
        background: C.bg, borderRadius: 16, padding: "18px 16px",
        marginBottom: 16, border: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Tag>{match.league}</Tag>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.up, animation: "pulse 2s infinite" }} />
            <span style={{ color: C.up, fontSize: 12, fontWeight: 600, fontFamily: C.mono }}>{match.time}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: isH ? C.white : C.dim, fontWeight: 800, fontSize: 18, fontFamily: C.display, transition: "color 0.2s" }}>{match.home}</div>
            <div style={{ color: C.dim, fontSize: 12, fontFamily: C.mono, marginTop: 4 }}>{match.homeOdds}×</div>
          </div>
          <div style={{ color: C.faint, fontSize: 12, fontWeight: 800, fontFamily: C.display, padding: "6px 16px" }}>vs</div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ color: !isH ? C.white : C.dim, fontWeight: 800, fontSize: 18, fontFamily: C.display, transition: "color 0.2s" }}>{match.away}</div>
            <div style={{ color: C.dim, fontSize: 12, fontFamily: C.mono, marginTop: 4 }}>{match.awayOdds}×</div>
          </div>
        </div>
      </div>

      {/* Team charts */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[ht, at].map((team, idx) => team && (
          <div key={idx} style={{
            flex: 1, background: C.bg, borderRadius: 12, padding: "10px 8px 6px",
            border: `1px solid ${(idx === 0 ? isH : !isH) ? team.color + "35" : C.border}`,
            transition: "border-color 0.2s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, overflow: "hidden", border: `1px solid ${team.color}30` }}>
                  <img src={team.logo} alt={team.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: team.color === "#FFFFFF" ? "#94A3B8" : team.color, fontFamily: C.mono }}>{team.id}</span>
              </div>
              <span style={{ color: team.change >= 0 ? C.up : C.down, fontSize: 9, fontWeight: 600, fontFamily: C.mono }}>{team.change >= 0 ? "+" : ""}{team.change}%</span>
            </div>
            <Spark data={team.history} up={team.change >= 0} w={135} h={36} gradId={`spk-hist-${team.id}`} />
          </div>
        ))}
      </div>

      {/* Side toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: C.bg, borderRadius: 14, padding: 4 }}>
        {["home","away"].map(s => (
          <button key={s} onClick={() => setSide(s)} style={{
            flex: 1, padding: "12px 0", borderRadius: 11,
            fontFamily: C.display, fontWeight: 800, fontSize: 14, cursor: "pointer",
            background: side === s ? (s === "home" ? C.upDim : C.downDim) : "transparent",
            color: side === s ? (s === "home" ? C.up : C.down) : C.dim,
            border: side === s ? `1px solid ${s === "home" ? C.upBorder : C.downBorder}` : "1px solid transparent",
          }}>{s === "home" ? match.home : match.away}</button>
        ))}
      </div>

      {/* Amount */}
      <div style={{ background: C.bg, borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", border: `1px solid ${C.border}` }}>
        <span style={{ color: C.dim, fontSize: 24, fontWeight: 700, marginRight: 6, fontFamily: C.mono }}>$</span>
        <input type="number" placeholder="0.00" value={amt} onChange={e => setAmt(e.target.value)} style={{ flex: 1, background: "none", border: "none", outline: "none", color: C.white, fontSize: 24, fontWeight: 700, fontFamily: C.mono }} />
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[10,25,50,100].map(v => (
          <button key={v} onClick={() => setAmt(String(v))} style={{ flex: 1, padding: "9px 0", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: C.mono }}>${v}</button>
        ))}
      </div>

      {/* Payout */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: C.bg, borderRadius: 12, marginBottom: 16, border: `1px solid ${C.border}` }}>
        <Tag>Payout if {display} wins</Tag>
        <span style={{ color: C.up, fontSize: 15, fontWeight: 700, fontFamily: C.mono }}>${amt ? (parseFloat(amt) * odds * lev).toFixed(2) : "0.00"}</span>
      </div>

      {/* CTA */}
      <button style={{
        width: "100%", padding: "16px 0", borderRadius: 16, border: "none",
        fontFamily: C.display, fontWeight: 800, fontSize: 16, cursor: "pointer",
        background: isH ? "linear-gradient(135deg, #34D399, #059669)" : "linear-gradient(135deg, #FB7185, #E11D48)",
        color: "#fff", boxShadow: isH ? "0 4px 20px rgba(52,211,153,0.25)" : "0 4px 20px rgba(251,113,133,0.25)",
      }}>{display} wins · ${amt || "0"} · {lev}×</button>
    </Sheet>
  );
}

/* ════════════════════════════════════════════
   HOME VIEW
   ════════════════════════════════════════════ */
function HomeView({ loaded, onSelectTeam }) {
  const [oracleTab, setOracleTab] = useState<"price" | "trade" | null>(null);
  return (
  <div style={{ padding: "0 18px" }}>
  {oracleTab && <OracleSheet initialTab={oracleTab} onClose={() => setOracleTab(null)} />}
  {/* Explainer */}
  <div style={{
    background: C.cyanDim, borderRadius: 16, padding: "16px",
    marginBottom: 18, border: `1px solid ${C.cyan}20`,
  }}>
    <div style={{ color: C.white, fontSize: 15, fontWeight: 800, fontFamily: C.display, letterSpacing: "-0.01em", marginBottom: 5 }}>
      Trade football like stocks
    </div>
    <div style={{ color: C.mid, fontSize: 12, lineHeight: 1.55, fontFamily: C.body, marginBottom: 14 }}>
      Every club has a live index price that moves with results, injuries and news.
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      <button
        onClick={() => setOracleTab("trade")}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "9px 10px", borderRadius: 10,
          background: `${C.cyan}18`, border: `1px solid ${C.cyan}35`,
          color: C.cyan, fontSize: 11, fontWeight: 700, cursor: "pointer",
          fontFamily: C.display,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /><polyline points="17,6 23,6 23,12" />
        </svg>
        How to trade
      </button>
      <button
        onClick={() => setOracleTab("price")}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "9px 10px", borderRadius: 10,
          background: `${C.cyan}08`, border: `1px solid ${C.cyan}18`,
          color: C.mid, fontSize: 11, fontWeight: 700, cursor: "pointer",
          fontFamily: C.display,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        How pricing works
      </button>
    </div>
  </div>

      {/* Markets */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, paddingLeft: 2, paddingRight: 4 }}>
        <Tag>Markets</Tag>
        <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
          <span style={{ color: C.dim, fontSize: 10, fontFamily: C.mono, textTransform: "uppercase", letterSpacing: "0.1em", width: 64, textAlign: "center" }}>7d</span>
          <span style={{ color: C.dim, fontSize: 10, fontFamily: C.mono, textTransform: "uppercase", letterSpacing: "0.1em", width: 72, textAlign: "right" }}>Price</span>
        </div>
      </div>
      {TEAMS.map((team, i) => {
        const up = team.change >= 0;
        return (
          <div key={team.id} onClick={() => onSelectTeam(team)} className="team-row" style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 12px", borderRadius: 14, cursor: "pointer",
            marginBottom: 2, border: "1px solid transparent",
            transition: "all 0.15s ease",
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)",
            transitionDelay: `${0.03 * i}s`,
          }}
          onMouseOver={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.border; }}
          onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: `linear-gradient(135deg, ${team.color}15, ${team.color}05)`,
              border: `1px solid ${team.color}22`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              overflow: "hidden",
            }}>
              <img src={team.logo} alt={team.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 15, fontFamily: C.display, letterSpacing: "-0.01em" }}>{team.name}</div>
              <div style={{ color: C.dim, fontSize: 10, fontFamily: C.mono, marginTop: 2 }}>{team.league}</div>
            </div>
            <Spark data={team.sparkline} up={up} gradId={`spk-${team.id}`} />
            <div style={{ textAlign: "right", minWidth: 72, flexShrink: 0 }}>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 14, fontFamily: C.mono, letterSpacing: "-0.02em" }}>${team.index.toFixed(2)}</div>
              <div style={{ color: up ? C.up : C.down, fontWeight: 600, fontSize: 11, fontFamily: C.mono, marginTop: 2 }}>{up ? "+" : ""}{team.change}%</div>
            </div>
          </div>
        );
      })}

      {/* Grand Prize */}
      <div style={{
        marginTop: 24, borderRadius: 20, padding: "22px 20px",
        background: `linear-gradient(145deg, ${C.surface} 0%, rgba(252,211,77,0.03) 100%)`,
        border: `1px solid rgba(252,211,77,0.12)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -50, right: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(252,211,77,0.08) 0%, transparent 70%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 28 }}>🏆</div>
          <div>
            <div style={{ color: C.gold, fontSize: 16, fontWeight: 800, fontFamily: C.display, letterSpacing: "-0.02em" }}>Season 1</div>
            <div style={{ color: C.dim, fontSize: 11, fontFamily: C.mono, marginTop: 2 }}>Ends Mar 31 · Best PnL wins</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, background: C.bg, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.border}` }}>
            <Tag>Prize Pool</Tag>
            <div style={{ color: C.gold, fontSize: 26, fontWeight: 800, fontFamily: C.mono, marginTop: 4, letterSpacing: "-0.03em" }}>$10K</div>
          </div>
          <div style={{ flex: 1, background: C.bg, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.border}` }}>
            <Tag>Traders</Tag>
            <div style={{ color: C.white, fontSize: 26, fontWeight: 800, fontFamily: C.mono, marginTop: 4, letterSpacing: "-0.03em" }}>847</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, fontFamily: C.mono, fontSize: 10, color: C.dim }}>
          <span style={{ background: C.bg, padding: "4px 10px", borderRadius: 6 }}>🥇 $5,000</span>
          <span style={{ background: C.bg, padding: "4px 10px", borderRadius: 6 }}>🥈 $3,000</span>
          <span style={{ background: C.bg, padding: "4px 10px", borderRadius: 6 }}>🥉 $2,000</span>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={{ marginTop: 24, marginBottom: 16 }}>
        <Tag style={{ display: "block", marginBottom: 12, paddingLeft: 2 }}>Leaderboard</Tag>
        {[
          { r: 1, n: "cryptogunner", pnl: 2340, m: "🥇" },
          { r: 2, n: "arsenalfan_fi", pnl: 1890, m: "🥈" },
          { r: 3, n: "degensam", pnl: 1420, m: "🥉" },
          { r: 4, n: "premtrader", pnl: 980, m: null },
          { r: 5, n: "madridista99", pnl: 870, m: null },
        ].map((e, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 12,
            background: e.r <= 3 ? C.surface : "transparent",
            border: e.r <= 3 ? `1px solid ${C.border}` : "1px solid transparent",
            marginBottom: 2,
          }}>
            <div style={{ width: 26, textAlign: "center", fontSize: e.m ? 16 : 12, color: C.dim, fontWeight: 700, fontFamily: C.mono }}>{e.m || `#${e.r}`}</div>
            <div style={{ flex: 1, color: C.text, fontSize: 13, fontWeight: 600, fontFamily: C.mono }}>{e.n}</div>
            <div style={{ color: C.up, fontSize: 13, fontWeight: 700, fontFamily: C.mono }}>+${e.pnl.toLocaleString()}</div>
          </div>
        ))}
        {/* You */}
        <div style={{
          marginTop: 6, padding: "10px 12px", borderRadius: 12,
          background: C.cyanDim, border: `1px solid ${C.cyan}20`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 26, textAlign: "center", color: C.cyan, fontSize: 12, fontWeight: 700, fontFamily: C.mono }}>#12</div>
          <div style={{ flex: 1, color: C.cyan, fontSize: 13, fontWeight: 600, fontFamily: C.mono }}>you</div>
          <div style={{ color: C.cyan, fontSize: 13, fontWeight: 700, fontFamily: C.mono }}>+$24.80</div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MATCHES VIEW
   ══════════════════════════════��═════════════ */
function MatchesView({ loaded, onSelectMatch }) {
  return (
    <div style={{ padding: "0 18px" }}>
      <Tag style={{ display: "block", marginBottom: 4, paddingLeft: 2 }}>Today's Fixtures</Tag>
      <div style={{ color: C.faint, fontSize: 11, fontFamily: C.mono, marginBottom: 16, paddingLeft: 2 }}>Settles at full-time · no funding rate</div>
      {MATCHES.map((m, i) => {
        const ht = TEAMS.find(t => t.name === m.home);
        const at = TEAMS.find(t => t.name === m.away);
        return (
        <div key={i} style={{
          background: C.surface, borderRadius: 18, padding: 18,
          marginBottom: 10, border: `1px solid ${C.border}`,
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)",
          transition: `all 0.4s ease ${0.06 * i}s`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <Tag>{m.league}</Tag>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.up, animation: "pulse 2s infinite" }} />
              <span style={{ color: C.up, fontSize: 11, fontWeight: 600, fontFamily: C.mono }}>{m.time}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              {ht && <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden", border: `1px solid ${ht.color}30` }}>
                <img src={ht.logo} alt={ht.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>}
              <div style={{ color: C.white, fontWeight: 800, fontSize: 15, fontFamily: C.display }}>{m.home}</div>
            </div>
            <div style={{ color: C.faint, fontSize: 12, fontWeight: 800, padding: "5px 14px", fontFamily: C.display }}>vs</div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              {at && <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden", border: `1px solid ${at.color}30` }}>
                <img src={at.logo} alt={at.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>}
              <div style={{ color: C.white, fontWeight: 800, fontSize: 15, fontFamily: C.display }}>{m.away}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onSelectMatch(m, "home")} style={{
              flex: 1, padding: "12px 0", borderRadius: 12,
              border: `1px solid ${C.upBorder}`, background: C.upDim,
              color: C.up, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: C.mono,
}}>{m.home.split(" ").slice(-1)[0]} {m.homeOdds}×</button>
  <button onClick={() => onSelectMatch(m, "away")} style={{
  flex: 1, padding: "12px 0", borderRadius: 12,
  border: `1px solid ${C.downBorder}`, background: C.downDim,
  color: C.down, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: C.mono,
}}>{m.away.split(" ").slice(-1)[0]} {m.awayOdds}×</button>
          </div>
        </div>
      );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   FEED VIEW
   ════════════════════════════════════════════ */
function FeedView({ loaded, onSelectTeam }) {
  const [feedTab, setFeedTab] = useState<"result" | "news" | "transfer">("result");

  const FEED_TABS: { id: "result" | "news" | "transfer"; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: "result",
      label: "Results",
      color: C.up,
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
        </svg>
      ),
    },
    {
      id: "news",
      label: "News",
      color: C.cyan,
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "transfer",
      label: "Transfers",
      color: C.gold,
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      ),
    },
  ];

  const filtered = FEED_ITEMS.filter(item => item.type === feedTab);

  return (
    <div style={{ padding: "0 18px" }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 18,
      }}>
        {FEED_TABS.map((t) => {
          const active = feedTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setFeedTab(t.id)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "9px 0", borderRadius: 11, border: `1px solid ${active ? t.color + "40" : C.border}`,
                background: active ? `${t.color}12` : C.surface,
                color: active ? t.color : C.mid,
                fontFamily: C.display, fontWeight: 700, fontSize: 12,
                cursor: "pointer", transition: "all 0.15s ease",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Items */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: C.dim, fontSize: 13, fontFamily: C.body, paddingTop: 40 }}>
          Nothing here yet
        </div>
      )}
      {filtered.map((item, i) => {
        const team = TEAMS.find(t => t.id === item.teamId);
        const tab = FEED_TABS.find(t => t.id === item.type);
        return (
          <div key={i} onClick={() => team && onSelectTeam(team)} style={{
            background: C.surface, borderRadius: 14, padding: "14px 16px",
            marginBottom: 8, border: `1px solid ${C.border}`, cursor: team ? "pointer" : "default",
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(8px)",
            transition: `all 0.35s ease ${0.05 * i}s`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 9 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {team && (
                  <div style={{ width: 26, height: 26, borderRadius: 7, overflow: "hidden", border: `1px solid ${tab?.color || C.border}30`, flexShrink: 0 }}>
                    <img src={team.logo} alt={team.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <span style={{
                  fontSize: 10, fontWeight: 700, fontFamily: C.mono,
                  color: tab?.color || C.mid,
                  background: `${tab?.color || C.mid}12`,
                  border: `1px solid ${tab?.color || C.mid}25`,
                  padding: "2px 7px", borderRadius: 5, letterSpacing: "0.06em",
                }}>{item.tag}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {item.impact && (
                  <span style={{ color: item.up ? C.up : C.down, fontSize: 12, fontWeight: 700, fontFamily: C.mono }}>{item.impact}</span>
                )}
                <span style={{ color: C.dim, fontSize: 10, fontFamily: C.mono }}>{item.time}</span>
              </div>
            </div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 14, fontFamily: C.display, marginBottom: 4 }}>{item.headline}</div>
            <div style={{ color: C.mid, fontSize: 12, lineHeight: 1.5, fontFamily: C.body }}>{item.body}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   LEAGUES
   ════════════════════════════════════════════ */
function LeaguesView({ loaded, onSelect, onCreate, onJoin }) {
  return (
    <div style={{ padding: "0 18px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={onCreate} style={{
          flex: 1, padding: "13px 0", borderRadius: 14, border: "none",
          background: `linear-gradient(135deg, ${C.cyan}, #0891B2)`,
          color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: C.display,
          boxShadow: "0 4px 16px rgba(34,211,238,0.2)",
        }}>+ Create</button>
        <button onClick={onJoin} style={{
          flex: 1, padding: "13px 0", borderRadius: 14,
          border: `1px solid ${C.border}`, background: C.surface,
          color: C.text, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: C.display,
        }}>Join</button>
      </div>
      <Tag style={{ display: "block", marginBottom: 12, paddingLeft: 2 }}>My Leagues</Tag>
      {MOCK_LEAGUES.map((lg, i) => (
        <div key={lg.id} onClick={() => onSelect(lg)} style={{
          background: C.surface, borderRadius: 16, padding: 18, marginBottom: 8,
          border: `1px solid ${C.border}`, cursor: "pointer",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(10px)",
          transition: `all 0.4s ease ${0.06 * i}s`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 16, fontFamily: C.display }}>{lg.name}</div>
              <div style={{ color: C.dim, fontSize: 11, fontFamily: C.mono, marginTop: 3 }}>{lg.memberCount} traders{lg.buyIn ? ` · ${lg.buyIn}` : ""}</div>
            </div>
            <Tag style={{ background: C.upDim, color: C.up, padding: "4px 10px", borderRadius: 6, alignSelf: "flex-start" }}>{lg.status}</Tag>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: C.dim, fontSize: 12 }}>Rank</span>
              <span style={{ color: lg.myRank <= 3 ? C.gold : C.white, fontSize: 18, fontWeight: 800, fontFamily: C.mono }}>#{lg.myRank}</span>
              <span style={{ color: C.faint, fontSize: 11, fontFamily: C.mono }}>/ {lg.memberCount}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2" strokeLinecap="round"><polyline points="9,18 15,12 9,6"/></svg>
          </div>
        </div>
      ))}
    </div>
  );
}

function LeagueDetail({ league, loaded, onBack }) {
  const [tab, setTab] = useState("board");
  const you = league.members.find(m => m.name === "you");
  const medals = ["🥇","🥈","🥉"];

  return (
    <div style={{ padding: "0 18px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <button onClick={onBack} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mid} strokeWidth="2" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.white, fontWeight: 800, fontSize: 18, fontFamily: C.display }}>{league.name}</div>
          <div style={{ color: C.dim, fontSize: 10, fontFamily: C.mono, marginTop: 2 }}>{league.memberCount} traders · {league.start} – {league.end}{league.buyIn ? ` · ${league.buyIn}` : ""}</div>
        </div>
      </div>

      {/* Invite */}
      <div style={{ background: C.bg, borderRadius: 12, padding: "12px 16px", marginBottom: 14, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: C.dim, fontSize: 12, fontFamily: C.mono, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 12 }}>notch.win/join/{league.id}</span>
        <button onClick={e => { e.target.textContent = "Copied!"; setTimeout(() => e.target.textContent = "Copy", 1500); }} style={{ background: C.borderLight, border: "none", borderRadius: 8, color: C.text, fontSize: 11, fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: C.mono, flexShrink: 0 }}>Copy</button>
      </div>

      {/* Your stats */}
      {you && (
        <div style={{ background: C.cyanDim, borderRadius: 14, padding: "16px 18px", marginBottom: 16, border: `1px solid ${C.cyan}18`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Tag style={{ color: C.mid }}>Your Position</Tag>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
              <span style={{ color: C.cyan, fontSize: 24, fontWeight: 800, fontFamily: C.mono, letterSpacing: "-0.03em" }}>#{you.rank}</span>
              <span style={{ color: C.mid, fontSize: 12 }}>of {league.memberCount}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: C.white, fontSize: 20, fontWeight: 800, fontFamily: C.mono, letterSpacing: "-0.02em" }}>${you.balance.toFixed(2)}</div>
            <div style={{ color: you.pnl >= 0 ? C.up : C.down, fontSize: 12, fontWeight: 600, fontFamily: C.mono, marginTop: 2 }}>{you.pnl >= 0 ? "+" : ""}${you.pnl.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[{ id: "board", l: "Leaderboard" }, { id: "trades", l: "Trade Feed" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 18px", borderRadius: 10, border: "none",
            background: tab === t.id ? C.borderLight : "transparent",
            color: tab === t.id ? C.white : C.dim,
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: C.body,
          }}>{t.l}</button>
        ))}
      </div>

      {/* Leaderboard */}
      {tab === "board" && league.members.map((m, i) => {
        const isYou = m.name === "you";
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 12, marginBottom: 2,
            background: isYou ? C.cyanDim : (m.rank <= 3 ? C.surface : "transparent"),
            border: isYou ? `1px solid ${C.cyan}18` : (m.rank <= 3 ? `1px solid ${C.border}` : "1px solid transparent"),
          }}>
            <div style={{ width: 26, textAlign: "center", fontSize: m.rank <= 3 ? 16 : 12, color: isYou ? C.cyan : C.dim, fontWeight: 700, fontFamily: C.mono }}>{medals[m.rank - 1] || `#${m.rank}`}</div>
            <div style={{ flex: 1, color: isYou ? C.cyan : C.text, fontSize: 13, fontWeight: 600, fontFamily: C.mono }}>{m.name}</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: C.white, fontSize: 13, fontWeight: 700, fontFamily: C.mono }}>${m.balance.toFixed(2)}</div>
              <div style={{ color: m.pnl >= 0 ? C.up + "bb" : C.down + "bb", fontSize: 10, fontFamily: C.mono }}>{m.pnl >= 0 ? "+" : ""}{m.pct}%</div>
            </div>
          </div>
        );
      })}

      {/* Trade feed */}
      {tab === "trades" && league.trades.map((t, i) => (
        <div key={i} style={{ padding: "11px 12px", borderRadius: 10, background: i % 2 === 0 ? C.surface : "transparent" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: t.user === "you" ? C.cyan : C.mid, fontSize: 12, fontWeight: 600, fontFamily: C.mono }}>{t.user}</span>
              <span style={{ color: t.profit ? C.up + "cc" : C.down + "cc", fontSize: 12, fontFamily: C.mono }}>{t.action}</span>
            </div>
            <span style={{ color: C.faint, fontSize: 10, fontFamily: C.mono }}>{t.time}</span>
          </div>
          <div style={{ color: C.dim, fontSize: 11, fontFamily: C.mono, marginTop: 3 }}>{t.amount}</div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   CLOSE POSITION SHEET
   ════════════════════════════════════════════ */
function ClosePositionSheet({ pos, onClose, onConfirm }) {
  const team = TEAMS.find(t => t.id === pos.team);
  const pnl = pos.side === "long"
    ? ((pos.current - pos.entry) / pos.entry) * pos.size * pos.leverage
    : ((pos.entry - pos.current) / pos.entry) * pos.size * pos.leverage;
  const pnlPct = pos.side === "long"
    ? ((pos.current - pos.entry) / pos.entry) * 100 * pos.leverage
    : ((pos.entry - pos.current) / pos.entry) * 100 * pos.leverage;
  const profit = pnl >= 0;
  const returnAmt = pos.size + pnl;

  const rows = [
    { label: "Side", value: `${pos.side.toUpperCase()} ${pos.leverage}×`, color: pos.side === "long" ? C.up : C.down },
    { label: "Entry price", value: `$${pos.entry.toFixed(2)}`, color: C.text },
    { label: "Exit price", value: `$${pos.current.toFixed(2)}`, color: C.white },
    { label: "Position size", value: `$${pos.size.toFixed(2)}`, color: C.text },
    { label: "P&L", value: `${profit ? "+" : ""}$${pnl.toFixed(2)}`, color: profit ? C.up : C.down },
    { label: "Return", value: `$${returnAmt.toFixed(2)}`, color: C.white },
  ];

  return (
    <Sheet onClose={onClose}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, overflow: "hidden",
          border: `1px solid ${team?.color || C.border}30`, flexShrink: 0,
          background: `${team?.color || C.mid}10`,
        }}>
          {team && <img src={team.logo} alt={team.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </div>
        <div>
          <div style={{ color: C.white, fontWeight: 800, fontSize: 18, fontFamily: C.display, letterSpacing: "-0.02em" }}>
            Close Position
          </div>
          <div style={{ color: C.mid, fontSize: 12, fontFamily: C.mono, marginTop: 2 }}>
            {team?.name || pos.team} · {pos.side.toUpperCase()} {pos.leverage}×
          </div>
        </div>
      </div>

      {/* PnL hero */}
      <div style={{
        background: profit
          ? `linear-gradient(135deg, ${C.upDim}, rgba(52,211,153,0.04))`
          : `linear-gradient(135deg, ${C.downDim}, rgba(251,113,133,0.04))`,
        borderRadius: 16, padding: "20px 20px", marginBottom: 18,
        border: `1px solid ${profit ? C.upBorder : C.downBorder}`,
        textAlign: "center",
      }}>
        <div style={{ color: profit ? C.up + "88" : C.down + "88", fontSize: 11, fontFamily: C.mono, marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {profit ? "You are in profit" : "You are at a loss"}
        </div>
        <div style={{ color: profit ? C.up : C.down, fontSize: 38, fontWeight: 800, fontFamily: C.mono, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {profit ? "+" : ""}${pnl.toFixed(2)}
        </div>
        <div style={{ color: profit ? C.up + "99" : C.down + "99", fontSize: 14, fontFamily: C.mono, marginTop: 6 }}>
          {profit ? "+" : ""}{pnlPct.toFixed(1)}% on your ${pos.size} stake
        </div>
      </div>

      {/* Breakdown rows */}
      <div style={{
        background: C.surface, borderRadius: 14, marginBottom: 20,
        border: `1px solid ${C.border}`, overflow: "hidden",
      }}>
        {rows.map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 16px",
            borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none",
          }}>
            <span style={{ color: C.mid, fontSize: 12, fontFamily: C.mono }}>{r.label}</span>
            <span style={{ color: r.color, fontSize: 13, fontWeight: 700, fontFamily: C.mono }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Warning for loss */}
      {!profit && (
        <div style={{
          background: C.downDim, borderRadius: 12, padding: "11px 14px",
          border: `1px solid ${C.downBorder}`, marginBottom: 16,
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.down} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span style={{ color: C.down, fontSize: 12, lineHeight: 1.55, fontFamily: C.body }}>
            You will realise a loss of <strong>${Math.abs(pnl).toFixed(2)}</strong>. This cannot be undone once confirmed.
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{
          flex: 1, padding: "14px 0", borderRadius: 14,
          border: `1px solid ${C.border}`, background: C.surface,
          color: C.mid, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: C.display,
        }}>
          Keep Open
        </button>
        <button onClick={onConfirm} style={{
          flex: 2, padding: "14px 0", borderRadius: 14,
          border: `1px solid ${profit ? C.upBorder : C.downBorder}`,
          background: profit ? C.upDim : C.downDim,
          color: profit ? C.up : C.down,
          fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: C.display,
        }}>
          Confirm Close · {profit ? "+" : ""}${pnl.toFixed(2)}
        </button>
      </div>
    </Sheet>
  );
}

/* ════════════════════════════════════════════
   PORTFOLIO VIEW
   ════════════════════════════════════════════ */
function PortfolioView({ loaded }) {
  const [closingPos, setClosingPos] = useState<typeof POSITIONS[0] | null>(null);
  const [positions, setPositions] = useState(POSITIONS);
  const [closedPnls, setClosedPnls] = useState<number[]>([]);

  const totalPnl = positions.reduce((acc, pos) => {
    const pnl = pos.side === "long"
      ? ((pos.current - pos.entry) / pos.entry) * pos.size * pos.leverage
      : ((pos.entry - pos.current) / pos.entry) * pos.size * pos.leverage;
    return acc + pnl;
  }, 0) + closedPnls.reduce((a, b) => a + b, 0);

  const handleConfirmClose = () => {
    if (!closingPos) return;
    const pnl = closingPos.side === "long"
      ? ((closingPos.current - closingPos.entry) / closingPos.entry) * closingPos.size * closingPos.leverage
      : ((closingPos.entry - closingPos.current) / closingPos.entry) * closingPos.size * closingPos.leverage;
    setPositions(prev => prev.filter(p => p !== closingPos));
    setClosedPnls(prev => [...prev, pnl]);
    setClosingPos(null);
  };

  return (
    <div style={{ padding: "0 18px" }}>
      {closingPos && (
        <ClosePositionSheet
          pos={closingPos}
          onClose={() => setClosingPos(null)}
          onConfirm={handleConfirmClose}
        />
      )}

      {/* PnL Card */}
      <div style={{
        background: `linear-gradient(145deg, ${C.surface} 0%, rgba(34,211,238,0.03) 100%)`,
        borderRadius: 20, padding: "22px 22px", marginBottom: 18,
        border: `1px solid ${C.border}`, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)" }} />
        <Tag style={{ marginBottom: 10, color: C.mid }}>Total P&L</Tag>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
          <span style={{ fontSize: 36, fontWeight: 800, fontFamily: C.mono, color: totalPnl >= 0 ? C.up : C.down, letterSpacing: "-0.04em" }}>
            {totalPnl >= 0 ? "+" : ""}${Math.abs(totalPnl).toFixed(2)}
          </span>
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: C.mono, color: (totalPnl >= 0 ? C.up : C.down) + "aa" }}>
            {totalPnl >= 0 ? "+" : ""}{(totalPnl / 225 * 100).toFixed(2)}%
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { l: "Open", v: `${positions.length}`, c: C.white },
            { l: "Win Rate", v: "67%", c: C.up },
            { l: "Rank", v: "#12", c: C.cyan },
            { l: "Trades", v: "18", c: C.white },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: C.bg, borderRadius: 12, padding: "10px 10px", border: `1px solid ${C.border}` }}>
              <Tag style={{ fontSize: 8 }}>{s.l}</Tag>
              <div style={{ color: s.c, fontSize: 16, fontWeight: 800, fontFamily: C.mono, marginTop: 3 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Positions */}
      <Tag style={{ display: "block", marginBottom: 12, paddingLeft: 2, color: C.mid }}>Open Positions</Tag>
      {positions.length === 0 && (
        <div style={{
          textAlign: "center", padding: "40px 0",
          color: C.dim, fontSize: 13, fontFamily: C.body,
        }}>
          No open positions
        </div>
      )}
      {positions.map((pos, i) => {
        const team = TEAMS.find(t => t.id === pos.team);
        const pnl = pos.side === "long"
          ? ((pos.current - pos.entry) / pos.entry) * pos.size * pos.leverage
          : ((pos.entry - pos.current) / pos.entry) * pos.size * pos.leverage;
        const pnlPct = pos.side === "long"
          ? ((pos.current - pos.entry) / pos.entry) * 100 * pos.leverage
          : ((pos.entry - pos.current) / pos.entry) * 100 * pos.leverage;
        const profit = pnl >= 0;
        return (
          <div key={i} style={{
            background: C.surface, borderRadius: 16, padding: "16px 16px",
            marginBottom: 8, border: `1px solid ${C.border}`,
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(8px)",
            transition: `all 0.35s ease ${0.06 * i}s`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `linear-gradient(135deg, ${team?.color || "#333"}15, ${team?.color || "#333"}05)`,
                  border: `1px solid ${team?.color || "#333"}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}>
                  {team ? <img src={team.logo} alt={team.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 10, fontWeight: 800, color: C.mid, fontFamily: C.mono }}>{pos.team}</span>}
                </div>
                <div>
                  <div style={{ color: C.white, fontWeight: 700, fontSize: 14, fontFamily: C.display }}>{team?.name || pos.team}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                      background: pos.side === "long" ? C.upDim : C.downDim,
                      color: pos.side === "long" ? C.up : C.down,
                      border: `1px solid ${pos.side === "long" ? C.upBorder : C.downBorder}`,
                      fontFamily: C.mono, textTransform: "uppercase",
                    }}>{pos.side} {pos.leverage}×</span>
                    <span style={{ fontSize: 10, color: C.dim, fontFamily: C.mono }}>${pos.size}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: profit ? C.up : C.down, fontSize: 16, fontWeight: 700, fontFamily: C.mono }}>{profit ? "+" : ""}${pnl.toFixed(2)}</div>
                <div style={{ color: profit ? C.up + "88" : C.down + "88", fontSize: 11, fontFamily: C.mono, marginTop: 1 }}>{profit ? "+" : ""}{pnlPct.toFixed(1)}%</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 0", borderTop: `1px solid ${C.border}` }}>
              <span style={{ color: C.dim, fontSize: 11, fontFamily: C.mono }}>Entry ${pos.entry.toFixed(2)}</span>
              <span style={{ color: C.mid, fontSize: 11, fontFamily: C.mono }}>Now ${pos.current.toFixed(2)}</span>
              <button
                onClick={() => setClosingPos(pos)}
                style={{
                  background: C.downDim, border: `1px solid ${C.downBorder}`, borderRadius: 6,
                  color: C.down, fontSize: 11, fontWeight: 700, padding: "4px 14px", cursor: "pointer", fontFamily: C.mono,
                }}
              >
                Close
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   MODALS
   ��═══════════════════════════════════════════ */
function CreateLeagueModal({ onClose }) {
  const [name, setName] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [created, setCreated] = useState(false);

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 14,
    background: C.bg, border: `1px solid ${C.border}`, outline: "none",
    color: C.white, fontSize: 16, fontFamily: C.body,
  };

  return (
    <Sheet onClose={onClose}>
      {!created ? (
        <>
          <div style={{ color: C.white, fontSize: 22, fontWeight: 800, fontFamily: C.display, marginBottom: 22, letterSpacing: "-0.02em" }}>Create League</div>
          <div style={{ marginBottom: 16 }}>
            <Tag style={{ marginBottom: 8, display: "block" }}>League Name</Tag>
            <input type="text" placeholder="e.g. The Boys March" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <Tag style={{ marginBottom: 8, display: "block" }}>Buy-in (optional)</Tag>
            <input type="text" placeholder="e.g. $20" value={buyIn} onChange={e => setBuyIn(e.target.value)} style={inputStyle} />
            <div style={{ color: C.faint, fontSize: 11, marginTop: 6, fontFamily: C.mono, paddingLeft: 2 }}>Collect outside app (Venmo, cash)</div>
          </div>
          <button onClick={() => name && setCreated(true)} style={{
            width: "100%", padding: "16px 0", borderRadius: 16, border: "none",
            background: name ? `linear-gradient(135deg, ${C.cyan}, #0891B2)` : C.border,
            color: name ? "#000" : C.dim, fontSize: 16, fontWeight: 800,
            cursor: name ? "pointer" : "default", fontFamily: C.display,
            boxShadow: name ? "0 4px 16px rgba(34,211,238,0.2)" : "none",
          }}>Create League</button>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🎉</div>
          <div style={{ color: C.white, fontSize: 20, fontWeight: 800, fontFamily: C.display, marginBottom: 6 }}>{name}</div>
          <div style={{ color: C.dim, fontSize: 13, marginBottom: 22, fontFamily: C.body }}>Share the link to invite friends</div>
          <div style={{ background: C.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 16, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: C.cyan, fontSize: 13, fontWeight: 600, fontFamily: C.mono }}>notch.win/join/aB3x</span>
            <button onClick={e => { e.target.textContent = "Copied!"; setTimeout(() => e.target.textContent = "Copy", 1500); }} style={{ background: C.borderLight, border: "none", borderRadius: 8, color: C.text, fontSize: 11, fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: C.mono }}>Copy</button>
          </div>
          <div style={{ color: C.faint, fontSize: 11, fontFamily: C.mono, marginBottom: 22 }}>Starts Mar 1 · Ends Mar 31 · $100 balance</div>
          <button onClick={onClose} style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: C.display }}>Done</button>
        </div>
      )}
    </Sheet>
  );
}

function JoinLeagueModal({ onClose }) {
  const [code, setCode] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <Sheet onClose={onClose}>
      {!joined ? (
        <>
          <div style={{ color: C.white, fontSize: 22, fontWeight: 800, fontFamily: C.display, marginBottom: 22, letterSpacing: "-0.02em" }}>Join League</div>
          <div style={{ marginBottom: 24 }}>
            <Tag style={{ marginBottom: 8, display: "block" }}>Code or Link</Tag>
            <input type="text" placeholder="e.g. xK7m" value={code} onChange={e => setCode(e.target.value)} style={{ width: "100%", padding: "14px 16px", borderRadius: 14, background: C.bg, border: `1px solid ${C.border}`, outline: "none", color: C.white, fontSize: 16, fontFamily: C.mono }} />
          </div>
          <button onClick={() => code && setJoined(true)} style={{
            width: "100%", padding: "16px 0", borderRadius: 16, border: "none",
            background: code ? `linear-gradient(135deg, ${C.cyan}, #0891B2)` : C.border,
            color: code ? "#000" : C.dim, fontSize: 16, fontWeight: 800,
            cursor: code ? "pointer" : "default", fontFamily: C.display,
            boxShadow: code ? "0 4px 16px rgba(34,211,238,0.2)" : "none",
          }}>Join League</button>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>✅</div>
          <div style={{ color: C.white, fontSize: 20, fontWeight: 800, fontFamily: C.display, marginBottom: 6 }}>You're in!</div>
          <div style={{ color: C.dim, fontSize: 13, marginBottom: 22, fontFamily: C.body }}>Starts Mar 1 · $100 balance</div>
          <button onClick={onClose} style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: C.display }}>Done</button>
        </div>
      )}
    </Sheet>
  );
}

/* ════════════════════════════════════════════
   ONBOARDING
   ════════════════════════════════════════════ */
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const finish = () => {
    setExiting(true);
    setTimeout(onDone, 400);
  };

  const steps = [
    {
      emoji: "⚽",
      title: "Welcome to Notch",
      sub: "The sports trading terminal",
      body: "Trade football clubs like stocks. Every team has a live index price that moves with real-world results, transfers, and news.",
      visual: (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
          {[
            { id: "ARS", col: "#EF0107", val: "$618", chg: "+3.2%" },
            { id: "LIV", col: "#C8102E", val: "$665", chg: "+2.7%" },
            { id: "MUN", col: "#DA291C", val: "$540", chg: "-1.4%" },
          ].map((t, i) => (
            <div key={i} style={{
              background: C.surface, borderRadius: 14, padding: "14px 12px", flex: 1,
              border: `1px solid ${C.border}`, textAlign: "center",
              animation: `countUp 0.5s ease ${0.15 * i}s both`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: t.col, fontFamily: C.mono, marginBottom: 6 }}>{t.id}</div>
              <div style={{ color: C.white, fontSize: 14, fontWeight: 700, fontFamily: C.mono }}>{t.val}</div>
              <div style={{ color: t.chg.startsWith("+") ? C.up : C.down, fontSize: 11, fontFamily: C.mono, marginTop: 2 }}>{t.chg}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      emoji: "📈",
      title: "Long or Short",
      sub: "Bet on the direction",
      body: "Think Arsenal will dominate this month? Go long. Think Man United will keep dropping? Go short. Add leverage to amplify your gains.",
      visual: (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
          <div style={{
            flex: 1, background: C.upDim, borderRadius: 14, padding: "18px 14px",
            border: `1px solid ${C.upBorder}`, textAlign: "center",
            animation: "countUp 0.4s ease 0.1s both",
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>↑</div>
            <div style={{ color: C.up, fontSize: 16, fontWeight: 800, fontFamily: C.display }}>Long</div>
            <div style={{ color: C.mid, fontSize: 11, marginTop: 4, fontFamily: C.body }}>Price goes up, you profit</div>
          </div>
          <div style={{
            flex: 1, background: C.downDim, borderRadius: 14, padding: "18px 14px",
            border: `1px solid ${C.downBorder}`, textAlign: "center",
            animation: "countUp 0.4s ease 0.25s both",
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>↓</div>
            <div style={{ color: C.down, fontSize: 16, fontWeight: 800, fontFamily: C.display }}>Short</div>
            <div style={{ color: C.mid, fontSize: 11, marginTop: 4, fontFamily: C.body }}>Price goes down, you profit</div>
          </div>
        </div>
      ),
    },
    {
      emoji: "⚡",
      title: "Match Mode",
      sub: "Bet on live fixtures",
      body: "Pick a side before kickoff. If your team wins, you win. Positions auto-settle at full-time — no need to close manually.",
      visual: (
        <div style={{
          background: C.surface, borderRadius: 16, padding: "18px 16px", marginBottom: 28,
          border: `1px solid ${C.border}`, animation: "countUp 0.4s ease 0.1s both",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Tag>Premier League</Tag>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.up, animation: "pulse 2s infinite" }} />
              <span style={{ color: C.up, fontSize: 11, fontFamily: C.mono }}>15:00</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 16, fontFamily: C.display }}>Arsenal</div>
              <div style={{ color: C.up, fontSize: 12, fontFamily: C.mono, marginTop: 4 }}>2.1×</div>
            </div>
            <div style={{ color: C.faint, fontWeight: 800, fontFamily: C.display, fontSize: 12, padding: "0 12px" }}>vs</div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 16, fontFamily: C.display }}>Man City</div>
              <div style={{ color: C.down, fontSize: 12, fontFamily: C.mono, marginTop: 4 }}>2.8×</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      emoji: "🏆",
      title: "Compete & Win",
      sub: "Leagues and leaderboards",
      body: "Create private leagues with friends. Everyone starts with $100 — best PnL at month end wins. Top the global leaderboard to win the $10K Season 1 prize.",
      visual: (
        <div style={{
          background: C.surface, borderRadius: 16, padding: "16px 14px", marginBottom: 28,
          border: `1px solid ${C.border}`, animation: "countUp 0.4s ease 0.1s both",
        }}>
          {["🥇 cryptogunner  +$2,340", "🥈 arsenalfan_fi  +$1,890", "🥉 degensam  +$1,420"].map((line, i) => (
            <div key={i} style={{
              padding: "8px 10px", borderRadius: 8,
              background: i === 0 ? C.goldDim : "transparent",
              color: i === 0 ? C.gold : C.text,
              fontSize: 13, fontWeight: 600, fontFamily: C.mono,
              marginBottom: 2,
              animation: `countUp 0.4s ease ${0.1 + 0.1 * i}s both`,
            }}>{line}</div>
          ))}
        </div>
      ),
    },
    {
      emoji: null,
      title: null,
      sub: null,
      body: null,
      isClaim: true,
    },
  ];

  const s = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: C.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      maxWidth: 430, margin: "0 auto",
      opacity: exiting ? 0 : 1,
      transition: "opacity 0.4s ease",
    }}>
      {/* Progress dots */}
      <div style={{
        position: "absolute", top: 60,
        display: "flex", gap: 6,
      }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 6, height: 6, borderRadius: 3,
            background: i === step ? C.cyan : (i < step ? C.cyan + "60" : C.faint),
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      <div style={{
        padding: "0 32px", width: "100%",
        animation: "countUp 0.35s ease both",
        key: step,
      }}>
        {s.isClaim ? (
          /* ── Claim screen ── */
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 100, height: 100, borderRadius: 28, margin: "0 auto 24px",
              background: `linear-gradient(135deg, ${C.cyanDim}, rgba(34,211,238,0.15))`,
              border: `1px solid ${C.cyan}25`,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "countUp 0.5s ease both",
            }}>
              <span style={{ fontSize: 44 }}>💰</span>
            </div>

            <div style={{
              color: C.white, fontSize: 26, fontWeight: 800, fontFamily: C.display,
              letterSpacing: "-0.03em", marginBottom: 8,
              animation: "countUp 0.5s ease 0.1s both",
            }}>You're all set</div>

            <div style={{
              color: C.mid, fontSize: 14, lineHeight: 1.6, fontFamily: C.body,
              marginBottom: 32,
              animation: "countUp 0.5s ease 0.15s both",
            }}>
              Here's your starting balance to trade with. It's testnet money — go wild, learn the ropes, compete with friends.
            </div>

            <div style={{
              background: C.surface, borderRadius: 20, padding: "28px 20px", marginBottom: 32,
              border: `1px solid ${C.border}`, position: "relative", overflow: "hidden",
              animation: "countUp 0.5s ease 0.2s both",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(135deg, transparent 30%, ${C.cyan}08 50%, transparent 70%)`,
                backgroundSize: "200% 100%",
                animation: claimed ? "shimmer 2s ease" : "none",
              }} />
              <Tag style={{ color: C.mid, marginBottom: 10, display: "block", textAlign: "center" }}>Your Balance</Tag>
              <div style={{
                fontSize: claimed ? 52 : 52, fontWeight: 800, fontFamily: C.mono,
                letterSpacing: "-0.04em", textAlign: "center",
                color: claimed ? C.up : C.white,
                transition: "color 0.5s ease",
              }}>
                {claimed ? "$100.00" : "$0.00"}
              </div>
              {claimed && (
                <div style={{
                  color: C.up, fontSize: 13, fontFamily: C.mono, fontWeight: 600,
                  textAlign: "center", marginTop: 8,
                  animation: "countUp 0.4s ease both",
                }}>
                  +$100.00 credited ✓
                </div>
              )}
            </div>

            {!claimed ? (
              <button onClick={() => setClaimed(true)} style={{
                width: "100%", padding: "18px 0", borderRadius: 16, border: "none",
                background: `linear-gradient(135deg, ${C.cyan}, #0891B2)`,
                color: "#000", fontSize: 17, fontWeight: 800, cursor: "pointer",
                fontFamily: C.display, letterSpacing: "-0.01em",
                boxShadow: "0 4px 24px rgba(34,211,238,0.3)",
              }}>Claim $100</button>
            ) : (
              <button onClick={finish} style={{
                width: "100%", padding: "18px 0", borderRadius: 16, border: "none",
                background: `linear-gradient(135deg, ${C.up}, #059669)`,
                color: "#fff", fontSize: 17, fontWeight: 800, cursor: "pointer",
                fontFamily: C.display, letterSpacing: "-0.01em",
                boxShadow: "0 4px 24px rgba(52,211,153,0.3)",
                animation: "countUp 0.4s ease 0.3s both",
              }}>Start Trading</button>
            )}
          </div>
        ) : (
          /* ── Info screens ── */
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24, margin: "0 auto 24px",
              background: C.surface, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "countUp 0.4s ease both",
            }}>
              <span style={{ fontSize: 36 }}>{s.emoji}</span>
            </div>

            <div style={{
              color: C.white, fontSize: 24, fontWeight: 800, fontFamily: C.display,
              letterSpacing: "-0.03em", marginBottom: 4,
            }}>{s.title}</div>

            <div style={{
              color: C.cyan, fontSize: 13, fontWeight: 600, fontFamily: C.mono,
              marginBottom: 20, letterSpacing: "0.04em",
            }}>{s.sub}</div>

            {s.visual}

            <div style={{
              color: C.mid, fontSize: 14, lineHeight: 1.7, fontFamily: C.body,
              marginBottom: 36, padding: "0 4px",
            }}>{s.body}</div>

            <button onClick={() => setStep(step + 1)} style={{
              width: "100%", padding: "16px 0", borderRadius: 16, border: "none",
              background: `linear-gradient(135deg, ${C.cyan}, #0891B2)`,
              color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer",
              fontFamily: C.display, letterSpacing: "-0.01em",
              boxShadow: "0 4px 20px rgba(34,211,238,0.25)",
            }}>
              {step < steps.length - 2 ? "Next" : "Let's go"}
            </button>

            {step > 0 && (
              <button onClick={() => setStep(step - 1)} style={{
                width: "100%", padding: "12px 0", marginTop: 8,
                borderRadius: 12, border: "none", background: "transparent",
                color: C.dim, fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: C.body,
              }}>Back</button>
            )}

            <button onClick={() => { setStep(steps.length - 1); }} style={{
              position: "absolute", top: 56, right: 24,
              background: "none", border: "none", color: C.dim,
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: C.body,
            }}>Skip</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   APP
   ════════════════════════════════════════════ */
export default function NotchApp() {
  const [tab, setTab] = useState("home");
  const [selTeam, setSelTeam] = useState(null);
  const [selMatch, setSelMatch] = useState(null);
  const [selLeague, setSelLeague] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [onboarding, setOnboarding] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  const content = () => {
    switch (tab) {
      case "home": return <HomeView loaded={loaded} onSelectTeam={setSelTeam} />;
      case "matches": return <MatchesView loaded={loaded} onSelectMatch={(m, s) => setSelMatch({ match: m, side: s })} />;
      case "feed": return <FeedView loaded={loaded} onSelectTeam={setSelTeam} />;
      case "leagues": return selLeague
        ? <LeagueDetail league={selLeague} loaded={loaded} onBack={() => setSelLeague(null)} />
        : <LeaguesView loaded={loaded} onSelect={setSelLeague} onCreate={() => setShowCreate(true)} onJoin={() => setShowJoin(true)} />;
      case "portfolio": return <PortfolioView loaded={loaded} />;
      default: return null;
    }
  };

  const NAV = [
    { id: "home", l: "Trade", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/></svg> },
    { id: "matches", l: "Matches", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg> },
    { id: "feed", l: "Feed", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5" fill="currentColor"/></svg> },
    { id: "leagues", l: "Leagues", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg> },
    { id: "portfolio", l: "Portfolio", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/></svg> },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: C.body, maxWidth: 430, margin: "0 auto", position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes rise { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(34,211,238,0.2); } 50% { box-shadow: 0 0 16px rgba(34,211,238,0.4); } }
        @keyframes countUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "18px 22px 16px",
        opacity: loaded ? 1 : 0, transition: "opacity 0.5s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontSize: 24, fontWeight: 800, fontFamily: C.display,
              letterSpacing: "-0.05em",
              background: `linear-gradient(135deg, ${C.white} 0%, ${C.cyan} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>notch</span>
            <Tag style={{
              color: C.cyan, background: C.cyanDim,
              padding: "3px 8px", borderRadius: 6,
              border: `1px solid ${C.cyan}20`,
            }}>TESTNET</Tag>
          </div>
          <div style={{
            fontSize: 18, fontWeight: 700, fontFamily: C.mono,
            letterSpacing: "-0.03em", color: C.white,
          }}>
            $1,000<span style={{ color: C.dim, fontSize: 13 }}>.00</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingBottom: 100, overflow: "auto" }}>{content()}</div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: `linear-gradient(180deg, transparent 0%, ${C.bg} 30%)`,
        padding: "20px 18px 28px",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-around",
          background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`,
          borderRadius: 18, padding: "10px 0",
          border: `1px solid ${C.border}`,
          backdropFilter: "blur(20px)",
        }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); setSelLeague(null); }} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer",
              color: tab === n.id ? C.cyan : C.dim,
              transition: "color 0.15s", padding: "3px 6px",
            }}>
              {n.icon}
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.04em", fontFamily: C.mono }}>{n.l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selTeam && <TeamSlip team={selTeam} onClose={() => setSelTeam(null)} />}
      {selMatch && <MatchSlip match={selMatch.match} initialSide={selMatch.side} onClose={() => setSelMatch(null)} />}
      {showCreate && <CreateLeagueModal onClose={() => setShowCreate(false)} />}
      {showJoin && <JoinLeagueModal onClose={() => setShowJoin(false)} />}
      {onboarding && <Onboarding onDone={() => setOnboarding(false)} />}
    </div>
  );
}
