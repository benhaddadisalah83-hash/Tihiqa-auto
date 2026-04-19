import { useState } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const AGENTS = [
  { id: "AGT-044", name: "Karim Bensalem",   wilaya: "Alger",        phone: "+213 661 234 567", inspections: 142, rating: 4.9, status: "active",   avatar: "KB" },
  { id: "AGT-031", name: "Yacine Meziane",    wilaya: "Oran",         phone: "+213 672 345 678", inspections: 98,  rating: 4.7, status: "active",   avatar: "YM" },
  { id: "AGT-058", name: "Sofiane Aït Amar",  wilaya: "Constantine",  phone: "+213 683 456 789", inspections: 67,  rating: 4.8, status: "active",   avatar: "SA" },
  { id: "AGT-019", name: "Riad Hamzaoui",     wilaya: "Annaba",       phone: "+213 554 567 890", inspections: 54,  rating: 4.6, status: "inactive", avatar: "RH" },
  { id: "AGT-072", name: "Nassim Chérif",     wilaya: "Blida",        phone: "+213 665 678 901", inspections: 38,  rating: 4.5, status: "active",   avatar: "NC" },
  { id: "AGT-083", name: "Djamel Ouarab",     wilaya: "Sétif",        phone: "+213 676 789 012", inspections: 21,  rating: 4.7, status: "active",   avatar: "DO" },
];

const RAPPORTS = [
  { id: "INS-2026-04-7891", agent: "Karim Bensalem",  vehicle: "VW Golf 7 2017",       wilaya: "Alger",       score: 74, status: "certified_reserves", date: "19/04/2026", price: 7900, paid: true },
  { id: "INS-2026-04-7890", agent: "Yacine Meziane",   vehicle: "Renault Symbol 2019",  wilaya: "Oran",        score: 91, status: "certified",          date: "19/04/2026", price: 4900, paid: true },
  { id: "INS-2026-04-7889", agent: "Karim Bensalem",  vehicle: "Hyundai Elantra 2016", wilaya: "Alger",       score: 48, status: "non_compliant",      date: "18/04/2026", price: 7900, paid: true },
  { id: "INS-2026-04-7888", agent: "Sofiane Aït Amar", vehicle: "Toyota Corolla 2020",  wilaya: "Constantine", score: 88, status: "certified",          date: "18/04/2026", price: 7900, paid: true },
  { id: "INS-2026-04-7887", agent: "Nassim Chérif",   vehicle: "Peugeot 208 2018",     wilaya: "Blida",       score: 69, status: "certified_reserves", date: "17/04/2026", price: 4900, paid: false },
  { id: "INS-2026-04-7886", agent: "Riad Hamzaoui",   vehicle: "Kia Sportage 2015",    wilaya: "Annaba",      score: 55, status: "certified_reserves", date: "17/04/2026", price: 7900, paid: true },
  { id: "INS-2026-04-7885", agent: "Djamel Ouarab",   vehicle: "Dacia Logan 2021",     wilaya: "Sétif",       score: 95, status: "certified",          date: "16/04/2026", price: 4900, paid: true },
  { id: "INS-2026-04-7884", agent: "Yacine Meziane",   vehicle: "Citroën C3 2017",      wilaya: "Oran",        score: 72, status: "certified_reserves", date: "16/04/2026", price: 7900, paid: true },
];

const RDVS = [
  { id: "RDV-2026-0412", client: "M. Boualem Rahmani", phone: "+213 661 112 233", vehicle: "Mercedes C200 2016", wilaya: "Alger",       agent: "Karim Bensalem",   date: "20/04/2026", time: "09:00", status: "confirmed", formule: "Premium" },
  { id: "RDV-2026-0411", client: "Mme Fatima Kaci",    phone: "+213 772 223 344", vehicle: "BMW Série 3 2015",   wilaya: "Alger",       agent: "Karim Bensalem",   date: "20/04/2026", time: "11:30", status: "confirmed", formule: "Essentiel" },
  { id: "RDV-2026-0410", client: "M. Samir Ouadah",    phone: "+213 553 334 455", vehicle: "Toyota RAV4 2019",   wilaya: "Oran",        agent: "Yacine Meziane",    date: "20/04/2026", time: "10:00", status: "pending",   formule: "Premium" },
  { id: "RDV-2026-0409", client: "M. Hocine Meddah",   phone: "+213 664 445 566", vehicle: "Ford Focus 2018",    wilaya: "Constantine", agent: "Sofiane Aït Amar",  date: "21/04/2026", time: "14:00", status: "confirmed", formule: "Premium" },
  { id: "RDV-2026-0408", client: "M. Amine Ziani",     phone: "+213 775 556 677", vehicle: "Renault Clio 2020",  wilaya: "Blida",       agent: "Nassim Chérif",    date: "21/04/2026", time: "09:30", status: "cancelled", formule: "Essentiel" },
  { id: "RDV-2026-0407", client: "Mme Sara Belkacem",  phone: "+213 556 667 788", vehicle: "Seat Ibiza 2017",    wilaya: "Sétif",       agent: "Djamel Ouarab",    date: "22/04/2026", time: "11:00", status: "pending",   formule: "Essentiel" },
];

const MONTHLY_CA = [
  { month: "Nov", val: 312000 },
  { month: "Déc", val: 487000 },
  { month: "Jan", val: 561000 },
  { month: "Fév", val: 498000 },
  { month: "Mar", val: 634000 },
  { month: "Avr", val: 418000, current: true },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  certified:          { label: "Certifié",            color: "#10b981", bg: "#f0fdf4", dot: "#22c55e" },
  certified_reserves: { label: "Avec réserves",       color: "#f59e0b", bg: "#fffbeb", dot: "#fbbf24" },
  non_compliant:      { label: "Non conforme",        color: "#ef4444", bg: "#fef2f2", dot: "#f87171" },
};

const RDV_STATUS_CFG = {
  confirmed: { label: "Confirmé",  color: "#10b981", bg: "#f0fdf4" },
  pending:   { label: "En attente",color: "#f59e0b", bg: "#fffbeb" },
  cancelled: { label: "Annulé",    color: "#6b7280", bg: "#f9fafb" },
};

function fmt(n) { return n.toLocaleString("fr-DZ") + " DZD"; }

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Sidebar({ active, setActive }) {
  const items = [
    { id: "dashboard", label: "Vue d'ensemble", icon: "▦" },
    { id: "rdvs",      label: "RDV",            icon: "📅", badge: RDVS.filter(r => r.status === "pending").length },
    { id: "rapports",  label: "Rapports",        icon: "📄" },
    { id: "agents",    label: "Agents",          icon: "👤" },
    { id: "finances",  label: "Finances",        icon: "💰" },
  ];

  return (
    <div style={{
      width: 220, flexShrink: 0, background: "#0f172a",
      borderRight: "1px solid #1e293b",
      display: "flex", flexDirection: "column",
      minHeight: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔍</div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: "#f1f5f9", fontWeight: 800, letterSpacing: "-0.02em" }}>Thiqa Auto</div>
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Admin · v1.0</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            width: "100%", padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer",
            background: active === item.id ? "#1e293b" : "transparent",
            display: "flex", alignItems: "center", gap: 10, textAlign: "left",
            transition: "background 0.15s",
          }}>
            <span style={{ fontSize: 14, width: 20, textAlign: "center", opacity: active === item.id ? 1 : 0.5 }}>{item.icon}</span>
            <span style={{
              flex: 1, fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: active === item.id ? 700 : 500,
              color: active === item.id ? "#f1f5f9" : "#64748b",
            }}>{item.label}</span>
            {item.badge > 0 && (
              <span style={{ background: "#1e40af", color: "#93c5fd", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20, fontFamily: "'DM Sans', sans-serif" }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Admin info */}
      <div style={{ padding: "14px 14px 18px", borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#93c5fd", fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>AD</div>
          <div>
            <div style={{ fontSize: 12, color: "#cbd5e1", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Admin Thiqa</div>
            <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace" }}>admin@thiqa-auto.dz</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color = "#1e40af", icon }) {
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14,
      padding: "18px 20px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, color: "#f1f5f9", fontWeight: 800, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Sans', sans-serif", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function MiniChart({ data }) {
  const max = Math.max(...data.map(d => d.val));
  const barW = 36;

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
      {data.map((d, i) => {
        const h = Math.round((d.val / max) * 72);
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
            <div style={{
              width: "100%", height: h,
              background: d.current ? "#1e40af" : "#1e293b",
              borderRadius: "4px 4px 2px 2px",
              border: d.current ? "1px solid #3b82f6" : "1px solid #334155",
              transition: "height 0.4s ease",
              position: "relative",
            }}>
              {d.current && (
                <div style={{
                  position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
                  fontSize: 9, color: "#60a5fa", fontFamily: "'DM Mono', monospace",
                  whiteSpace: "nowrap", background: "#0f172a", padding: "1px 4px", borderRadius: 4,
                }}>
                  {(d.val / 1000).toFixed(0)}k
                </div>
              )}
            </div>
            <span style={{ fontSize: 9, color: d.current ? "#60a5fa" : "#334155", fontFamily: "'DM Mono', monospace" }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function Dashboard() {
  const totalCA = RAPPORTS.filter(r => r.paid).reduce((a, r) => a + r.price, 0);
  const totalRapports = RAPPORTS.length;
  const pendingRdv = RDVS.filter(r => r.status === "pending").length;
  const activeAgents = AGENTS.filter(a => a.status === "active").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, color: "#f1f5f9", fontWeight: 800 }}>Vue d'ensemble</div>
        <div style={{ fontSize: 12, color: "#475569", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>Dimanche 19 avril 2026 · Thiqa Auto Algérie</div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <StatCard label="CA ce mois" value={fmt(418000)} sub="↑ +12% vs mars" icon="💰" />
        <StatCard label="Rapports total" value={totalRapports} sub={`${RAPPORTS.filter(r=>r.status==="certified").length} certifiés`} icon="📄" />
        <StatCard label="RDV en attente" value={pendingRdv} sub="À confirmer" icon="📅" />
        <StatCard label="Agents actifs" value={activeAgents} sub={`sur ${AGENTS.length} au total`} icon="👤" />
      </div>

      {/* Chart + recent rapports */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>

        {/* CA Chart */}
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Chiffre d'affaires 6 mois</div>
          <MiniChart data={MONTHLY_CA} />
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 9, color: "#475569", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>Mois en cours</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#60a5fa", fontWeight: 800 }}>418 000 DZD</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: "#475569", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>Cumul 6 mois</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#f1f5f9", fontWeight: 800 }}>
                {fmt(MONTHLY_CA.reduce((a, m) => a + m.val, 0))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent rapports */}
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Rapports récents</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RAPPORTS.slice(0, 5).map(r => {
              const cfg = STATUS_CFG[r.status];
              return (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#0a1628", borderRadius: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: "#cbd5e1", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.vehicle}</div>
                    <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{r.id} · {r.date}</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg + "22", padding: "2px 8px", borderRadius: 20, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
                    {r.score}/100
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agents perf */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "18px 20px" }}>
        <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Performance agents</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {AGENTS.filter(a => a.status === "active").slice(0, 6).map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#0a1628", borderRadius: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#60a5fa", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
                {a.avatar}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#cbd5e1", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name.split(" ")[0]}</div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{a.inspections} insp · ★ {a.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RDVsScreen() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? RDVS : RDVS.filter(r => r.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, color: "#f1f5f9", fontWeight: 800 }}>RDV</div>
          <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{RDVS.length} rendez-vous · {RDVS.filter(r=>r.status==="pending").length} en attente</div>
        </div>
        <button style={{ padding: "9px 18px", background: "#1e40af", border: "none", borderRadius: 9, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          + Nouveau RDV
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6 }}>
        {["all","confirmed","pending","cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
            background: filter === f ? "#1e40af" : "#1e293b",
            color: filter === f ? "#fff" : "#64748b",
            fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
          }}>
            {f === "all" ? "Tous" : f === "confirmed" ? "Confirmés" : f === "pending" ? "En attente" : "Annulés"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 0.9fr 0.8fr 0.7fr 0.6fr 80px", padding: "10px 16px", borderBottom: "1px solid #1e293b" }}>
          {["ID", "Client", "Véhicule", "Agent", "Date / Heure", "Formule", "Statut"].map(h => (
            <span key={h} style={{ fontSize: 9, color: "#334155", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>
        {filtered.map((r, i) => {
          const cfg = RDV_STATUS_CFG[r.status];
          return (
            <div key={r.id} style={{
              display: "grid", gridTemplateColumns: "1fr 1.2fr 0.9fr 0.8fr 0.7fr 0.6fr 80px",
              padding: "12px 16px", alignItems: "center",
              borderBottom: i < filtered.length - 1 ? "1px solid #0a1628" : "none",
              background: i % 2 === 0 ? "transparent" : "#080e1a",
            }}>
              <span style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{r.id}</span>
              <div>
                <div style={{ fontSize: 12, color: "#cbd5e1", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{r.client}</div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{r.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>{r.vehicle}</div>
                <div style={{ fontSize: 10, color: "#334155", fontFamily: "'DM Sans', sans-serif" }}>{r.wilaya}</div>
              </div>
              <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>{r.agent.split(" ")[0]}</span>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>{r.date}</div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{r.time}</div>
              </div>
              <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>{r.formule}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, color: cfg.color,
                background: cfg.bg + "33", padding: "3px 10px", borderRadius: 20,
                fontFamily: "'DM Sans', sans-serif", textAlign: "center",
              }}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RapportsScreen() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? RAPPORTS : RAPPORTS.filter(r => r.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, color: "#f1f5f9", fontWeight: 800 }}>Rapports d'inspection</div>
        <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{RAPPORTS.length} rapports générés</div>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {["all","certified","certified_reserves","non_compliant"].map(f => {
          const labels = { all: "Tous", certified: "Certifiés", certified_reserves: "Avec réserves", non_compliant: "Non conformes" };
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              background: filter === f ? "#1e40af" : "#1e293b",
              color: filter === f ? "#fff" : "#64748b",
              fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
            }}>{labels[f]}</button>
          );
        })}
      </div>

      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 0.8fr 0.7fr 60px 80px 80px", padding: "10px 16px", borderBottom: "1px solid #1e293b" }}>
          {["ID", "Véhicule", "Agent", "Wilaya", "Score", "Statut", "Payé"].map(h => (
            <span key={h} style={{ fontSize: 9, color: "#334155", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>
        {filtered.map((r, i) => {
          const cfg = STATUS_CFG[r.status];
          const scoreCol = r.score >= 80 ? "#10b981" : r.score >= 55 ? "#f59e0b" : "#ef4444";
          return (
            <div key={r.id} style={{
              display: "grid", gridTemplateColumns: "1.2fr 1.4fr 0.8fr 0.7fr 60px 80px 80px",
              padding: "12px 16px", alignItems: "center",
              borderBottom: i < filtered.length - 1 ? "1px solid #0a1628" : "none",
              background: i % 2 === 0 ? "transparent" : "#080e1a",
            }}>
              <span style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{r.id}</span>
              <div>
                <div style={{ fontSize: 12, color: "#cbd5e1", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{r.vehicle}</div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{r.date}</div>
              </div>
              <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>{r.agent.split(" ")[0]}</span>
              <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>{r.wilaya}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: scoreCol, fontFamily: "'Syne', sans-serif" }}>{r.score}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, color: cfg.color,
                background: cfg.bg + "33", padding: "3px 8px", borderRadius: 20,
                fontFamily: "'DM Sans', sans-serif",
              }}>{cfg.label}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                color: r.paid ? "#10b981" : "#ef4444",
              }}>
                {r.paid ? "✓ Payé" : "✕ Non payé"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentsScreen() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, color: "#f1f5f9", fontWeight: 800 }}>Agents inspecteurs</div>
          <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{AGENTS.length} agents · {AGENTS.filter(a=>a.status==="active").length} actifs</div>
        </div>
        <button style={{ padding: "9px 18px", background: "#1e40af", border: "none", borderRadius: 9, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          + Ajouter agent
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {AGENTS.map(a => (
          <div key={a.id}
            onClick={() => setSelected(selected?.id === a.id ? null : a)}
            style={{
              background: selected?.id === a.id ? "#0d1e3d" : "#0f172a",
              border: `1.5px solid ${selected?.id === a.id ? "#1e40af" : "#1e293b"}`,
              borderRadius: 14, padding: "16px 18px", cursor: "pointer",
              transition: "all 0.15s",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: selected?.id === a.id ? 14 : 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: a.status === "active" ? "#1e3a8a" : "#1e293b",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, color: a.status === "active" ? "#93c5fd" : "#475569",
                fontWeight: 800, fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
              }}>{a.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  {a.name}
                  <span style={{
                    fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 20,
                    background: a.status === "active" ? "#052e16" : "#1a1a1a",
                    color: a.status === "active" ? "#10b981" : "#4b5563",
                    fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>{a.status === "active" ? "actif" : "inactif"}</span>
                </div>
                <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{a.id} · {a.wilaya}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, color: "#fbbf24", fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>★ {a.rating}</div>
                <div style={{ fontSize: 10, color: "#334155", fontFamily: "'DM Mono', monospace" }}>{a.inspections} insp.</div>
              </div>
            </div>

            {selected?.id === a.id && (
              <div style={{ borderTop: "1px solid #1e293b", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {[
                    { label: "Inspections", val: a.inspections, icon: "📄" },
                    { label: "Note", val: `★ ${a.rating}`, icon: "⭐" },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, background: "#0a1628", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: "#475569", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#60a5fa", fontWeight: 800 }}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, background: "#0a1628", borderRadius: 8, padding: "8px 12px" }}>
                    <div style={{ fontSize: 9, color: "#475569", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 2 }}>Téléphone</div>
                    <div style={{ fontSize: 12, color: "#93c5fd", fontFamily: "'DM Mono', monospace" }}>{a.phone}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button style={{
                    flex: 1, padding: "8px", background: "#1e293b", border: "none", borderRadius: 8,
                    color: "#94a3b8", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>Modifier</button>
                  <button style={{
                    flex: 1, padding: "8px", background: "#1e3a8a", border: "none", borderRadius: 8,
                    color: "#93c5fd", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}>Voir rapports</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FinancesScreen() {
  const totalCA = RAPPORTS.filter(r => r.paid).reduce((a, r) => a + r.price, 0);
  const unpaid = RAPPORTS.filter(r => !r.paid).reduce((a, r) => a + r.price, 0);
  const avgTicket = Math.round(totalCA / RAPPORTS.filter(r => r.paid).length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, color: "#f1f5f9", fontWeight: 800 }}>Finances</div>
        <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace" }}>Suivi CA offline · paiement cash uniquement</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <StatCard label="CA encaissé" value={fmt(totalCA)} sub="Paiements cash confirmés" icon="✅" />
        <StatCard label="Non encaissé" value={fmt(unpaid)} sub={`${RAPPORTS.filter(r=>!r.paid).length} rapport(s) impayé(s)`} icon="⏳" />
        <StatCard label="Ticket moyen" value={fmt(avgTicket)} sub="Par inspection" icon="📊" />
      </div>

      {/* CA mensuel */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
          Évolution CA mensuel (6 derniers mois)
        </div>
        <MiniChart data={MONTHLY_CA} />
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {MONTHLY_CA.map(m => (
            <div key={m.month} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: m.current ? "#60a5fa" : "#94a3b8", fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                {(m.val / 1000).toFixed(0)}k
              </div>
              <div style={{ fontSize: 9, color: "#334155", fontFamily: "'DM Mono', monospace" }}>{m.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rapports impayés */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Rapports non encaissés
          </span>
          <span style={{ fontSize: 10, color: "#ef4444", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
            {RAPPORTS.filter(r => !r.paid).length} · {fmt(unpaid)}
          </span>
        </div>
        {RAPPORTS.filter(r => !r.paid).map((r, i, arr) => (
          <div key={r.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 18px",
            borderBottom: i < arr.length - 1 ? "1px solid #0a1628" : "none",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#cbd5e1", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{r.vehicle}</div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{r.id} · {r.agent.split(" ")[0]} · {r.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#fca5a5", fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>{fmt(r.price)}</div>
              <button style={{
                marginTop: 4, padding: "4px 10px", background: "#1e293b", border: "none", borderRadius: 6,
                color: "#94a3b8", fontSize: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              }}>
                Marquer payé
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function ThiqaAdmin() {
  const [active, setActive] = useState("dashboard");

  const Screen = () => {
    switch (active) {
      case "dashboard": return <Dashboard />;
      case "rdvs":      return <RDVsScreen />;
      case "rapports":  return <RapportsScreen />;
      case "agents":    return <AgentsScreen />;
      case "finances":  return <FinancesScreen />;
      default:          return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080e1a", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080e1a; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        button:focus { outline: none; }
      `}</style>

      <Sidebar active={active} setActive={setActive} />

      <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>
        <Screen />
      </main>
    </div>
  );
}
