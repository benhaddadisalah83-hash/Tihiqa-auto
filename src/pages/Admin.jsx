import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(n) { return (n || 0).toLocaleString("fr-DZ") + " DZD"; }

const RDV_STATUS_CFG = {
  confirmed: { label: "Confirme",   color: "#10b981", bg: "#f0fdf4" },
  pending:   { label: "En attente", color: "#f59e0b", bg: "#fffbeb" },
  cancelled: { label: "Annule",     color: "#6b7280", bg: "#f9fafb" },
  done:      { label: "Termine",    color: "#3b82f6", bg: "#eff6ff" },
};

const STATUS_CFG = {
  certified:          { label: "Certifie",        color: "#10b981", bg: "#f0fdf4", dot: "#22c55e" },
  certified_reserves: { label: "Avec reserves",   color: "#f59e0b", bg: "#fffbeb", dot: "#fbbf24" },
  non_compliant:      { label: "Non conforme",    color: "#ef4444", bg: "#fef2f2", dot: "#f87171" },
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, pendingCount }) {
  const items = [
    { id: "dashboard", label: "Vue ensemble",  icon: "▦" },
    { id: "rdvs",      label: "RDV",           icon: "📅", badge: pendingCount },
    { id: "rapports",  label: "Rapports",       icon: "📄" },
    { id: "agents",    label: "Agents",         icon: "👤" },
    { id: "finances",  label: "Finances",       icon: "💰" },
  ];
  return (
    <div style={{ width: 210, flexShrink: 0, background: "#0f172a", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔍</div>
          <div>
            <div style={{ fontSize: 15, color: "#f1f5f9", fontWeight: 800, fontFamily: "sans-serif" }}>Thiqa Auto</div>
            <div style={{ fontSize: 9, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer", background: active === item.id ? "#1e293b" : "transparent", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
            <span style={{ fontSize: 14, width: 20, textAlign: "center", opacity: active === item.id ? 1 : 0.5 }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: active === item.id ? 700 : 500, color: active === item.id ? "#f1f5f9" : "#64748b", fontFamily: "sans-serif" }}>{item.label}</span>
            {item.badge > 0 && (
              <span style={{ background: "#1e40af", color: "#93c5fd", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>{item.badge}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

function StatCard({ label, value, sub, icon }) {
  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace" }}>{label}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 26, color: "#f1f5f9", fontWeight: 800, lineHeight: 1, fontFamily: "sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 6, fontFamily: "sans-serif" }}>{sub}</div>}
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ rapports, rdvs, agents }) {
  const totalCA = rapports.filter(r => r.paid).reduce((a, r) => a + (r.price || 0), 0);
  const pending = rdvs.filter(r => r.status === "pending").length;
  const activeAgents = agents.filter(a => a.status === "active").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontSize: 22, color: "#f1f5f9", fontWeight: 800, fontFamily: "sans-serif" }}>Vue ensemble</div>
        <div style={{ fontSize: 12, color: "#475569", fontFamily: "monospace", marginTop: 2 }}>Thiqa Auto · Dashboard</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <StatCard label="CA encaisse" value={fmt(totalCA)} sub="Paiements confirmes" icon="💰" />
        <StatCard label="Rapports" value={rapports.length} sub={`${rapports.filter(r => r.status === "certified").length} certifies`} icon="📄" />
        <StatCard label="RDV en attente" value={pending} sub="A confirmer" icon="📅" />
        <StatCard label="Agents actifs" value={activeAgents} sub={`sur ${agents.length} total`} icon="👤" />
      </div>
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "18px 20px" }}>
        <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Derniers rapports</div>
        {rapports.length === 0 && <div style={{ fontSize: 13, color: "#475569", fontFamily: "sans-serif" }}>Aucun rapport pour le moment.</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rapports.slice(0, 6).map(r => {
            const cfg = STATUS_CFG[r.status] || STATUS_CFG.certified;
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#0a1628", borderRadius: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 600, fontFamily: "sans-serif" }}>{r.brand} {r.model} {r.year}</div>
                  <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{r.id} · {r.wilaya}</div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: cfg.color, padding: "2px 8px", borderRadius: 20, fontFamily: "sans-serif" }}>{r.score}/100</div>
                <div style={{ fontSize: 11, color: r.paid ? "#10b981" : "#ef4444", fontWeight: 700 }}>{r.paid ? "Paye" : "Impaye"}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── RDV SCREEN ──────────────────────────────────────────────────────────────
function RDVsScreen({ rdvs, agents, onRefresh }) {
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client_name: "", client_phone: "", vehicle: "", wilaya: "", agent_id: "", date: "", time: "", formule: "Premium", price: 7900, status: "pending", notes: "" });
  const [saving, setSaving] = useState(false);

  const filtered = filter === "all" ? rdvs : rdvs.filter(r => r.status === filter);

  const saveRDV = async () => {
    setSaving(true);
    const id = "RDV-" + Date.now();
    const { error } = await supabase.from("rdvs").insert([{ ...form, id, price: Number(form.price) }]);
    setSaving(false);
    if (!error) { setShowForm(false); setForm({ client_name: "", client_phone: "", vehicle: "", wilaya: "", agent_id: "", date: "", time: "", formule: "Premium", price: 7900, status: "pending", notes: "" }); onRefresh(); }
    else alert("Erreur: " + error.message);
  };

  const updateStatus = async (id, status) => {
    await supabase.from("rdvs").update({ status }).eq("id", id);
    onRefresh();
  };

  const inputStyle = { width: "100%", padding: "10px 12px", background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, color: "#f1f5f9", fontSize: 13, fontFamily: "sans-serif", outline: "none" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 22, color: "#f1f5f9", fontWeight: 800, fontFamily: "sans-serif" }}>RDV</div>
          <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{rdvs.length} rendez-vous</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "9px 18px", background: "#1e40af", border: "none", borderRadius: 9, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
          {showForm ? "Annuler" : "+ Nouveau RDV"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "20px" }}>
          <div style={{ fontSize: 14, color: "#f1f5f9", fontWeight: 700, marginBottom: 16, fontFamily: "sans-serif" }}>Nouveau RDV</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Nom client", field: "client_name", placeholder: "M. Rahmani" },
              { label: "Telephone", field: "client_phone", placeholder: "+213 6..." },
              { label: "Vehicule", field: "vehicle", placeholder: "Mercedes C200 2016" },
              { label: "Wilaya", field: "wilaya", placeholder: "Alger" },
              { label: "Date", field: "date", type: "date" },
              { label: "Heure", field: "time", type: "time" },
              { label: "Prix DZD", field: "price", type: "number", placeholder: "7900" },
            ].map(f => (
              <div key={f.field}>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>{f.label}</div>
                <input type={f.type || "text"} placeholder={f.placeholder} value={form[f.field]} onChange={e => setForm(v => ({ ...v, [f.field]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>Formule</div>
              <select value={form.formule} onChange={e => setForm(v => ({ ...v, formule: e.target.value }))} style={inputStyle}>
                <option>Essentiel</option>
                <option>Premium</option>
                <option>Pro</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>Agent</div>
              <select value={form.agent_id} onChange={e => setForm(v => ({ ...v, agent_id: e.target.value }))} style={inputStyle}>
                <option value="">-- Choisir --</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.wilaya})</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>Notes</div>
            <textarea value={form.notes} onChange={e => setForm(v => ({ ...v, notes: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "none" }} />
          </div>
          <button onClick={saveRDV} disabled={saving} style={{ marginTop: 14, padding: "11px 24px", background: saving ? "#1e293b" : "#1e40af", border: "none", borderRadius: 9, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
            {saving ? "Enregistrement..." : "Enregistrer le RDV"}
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 6 }}>
        {["all","confirmed","pending","cancelled","done"].map(f => {
          const labels = { all: "Tous", confirmed: "Confirmes", pending: "En attente", cancelled: "Annules", done: "Termines" };
          return <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", background: filter === f ? "#1e40af" : "#1e293b", color: filter === f ? "#fff" : "#64748b", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}>{labels[f]}</button>;
        })}
      </div>

      {filtered.length === 0 && <div style={{ fontSize: 13, color: "#475569", fontFamily: "sans-serif", padding: "20px 0" }}>Aucun RDV pour le moment.</div>}

      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
        {filtered.map((r, i) => {
          const cfg = RDV_STATUS_CFG[r.status] || RDV_STATUS_CFG.pending;
          return (
            <div key={r.id} style={{ padding: "14px 16px", borderBottom: i < filtered.length - 1 ? "1px solid #0a1628" : "none", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 700, fontFamily: "sans-serif" }}>{r.client_name}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: "sans-serif" }}>{r.vehicle} · {r.wilaya}</div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{r.date} {r.time} · {r.formule} · {fmt(r.price)}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg + "33", padding: "3px 10px", borderRadius: 20, fontFamily: "sans-serif" }}>{cfg.label}</span>
              <div style={{ display: "flex", gap: 6" }}>
                {r.status === "pending" && (
                  <button onClick={() => updateStatus(r.id, "confirmed")} style={{ padding: "5px 10px", background: "#052e16", border: "none", borderRadius: 6, color: "#10b981", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Confirmer</button>
                )}
                {r.status !== "cancelled" && r.status !== "done" && (
                  <button onClick={() => updateStatus(r.id, "cancelled")} style={{ padding: "5px 10px", background: "#1e293b", border: "none", borderRadius: 6, color: "#ef4444", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Annuler</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── RAPPORTS SCREEN ──────────────────────────────────────────────────────────
function RapportsScreen({ rapports, onRefresh }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? rapports : rapports.filter(r => r.status === filter);

  const markPaid = async (id) => {
    await supabase.from("rapports").update({ paid: true, paid_at: new Date().toISOString() }).eq("id", id);
    onRefresh();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 22, color: "#f1f5f9", fontWeight: 800, fontFamily: "sans-serif" }}>Rapports</div>
        <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{rapports.length} rapports generes</div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {["all","certified","certified_reserves","non_compliant"].map(f => {
          const labels = { all: "Tous", certified: "Certifies", certified_reserves: "Avec reserves", non_compliant: "Non conformes" };
          return <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", background: filter === f ? "#1e40af" : "#1e293b", color: filter === f ? "#fff" : "#64748b", fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}>{labels[f]}</button>;
        })}
      </div>
      {filtered.length === 0 && <div style={{ fontSize: 13, color: "#475569", fontFamily: "sans-serif", padding: "20px 0" }}>Aucun rapport pour le moment.</div>}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
        {filtered.map((r, i) => {
          const cfg = STATUS_CFG[r.status] || STATUS_CFG.certified;
          const scoreCol = r.score >= 80 ? "#10b981" : r.score >= 55 ? "#f59e0b" : "#ef4444";
          return (
            <div key={r.id} style={{ padding: "12px 16px", borderBottom: i < filtered.length - 1 ? "1px solid #0a1628" : "none", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 600, fontFamily: "sans-serif" }}>{r.brand} {r.model} {r.year}</div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{r.id} · {r.wilaya}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: scoreCol, fontFamily: "sans-serif", minWidth: 40 }}>{r.score}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, padding: "2px 8px", borderRadius: 20, fontFamily: "sans-serif" }}>{cfg.label}</span>
              <div style={{ fontSize: 12, fontWeight: 700, color: r.paid ? "#10b981" : "#ef4444" }}>
                {r.paid ? "Paye" : (
                  <button onClick={() => markPaid(r.id)} style={{ padding: "4px 10px", background: "#1e293b", border: "none", borderRadius: 6, color: "#10b981", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Marquer paye</button>
                )}
              </div>
              <a href={`/r/${r.id}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#60a5fa", fontFamily: "sans-serif" }}>Voir →</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AGENTS SCREEN ───────────────────────────────────────────────────────────
function AgentsScreen({ agents, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", status: "active" });
  const [saving, setSaving] = useState(false);

  const saveAgent = async () => {
    setSaving(true);
    const id = "AGT-" + Math.floor(Math.random() * 900 + 100);
    const avatar = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const { error } = await supabase.from("agents").insert([{ ...form, id, avatar, rating: 5.0 }]);
    setSaving(false);
    if (!error) { setShowForm(false); setForm({ name: "", phone: "", wilaya: "", status: "active" }); onRefresh(); }
    else alert("Erreur: " + error.message);
  };

  const toggleStatus = async (agent) => {
    const newStatus = agent.status === "active" ? "inactive" : "active";
    await supabase.from("agents").update({ status: newStatus }).eq("id", agent.id);
    onRefresh();
  };

  const inputStyle = { width: "100%", padding: "10px 12px", background: "#0a1628", border: "1px solid #1e293b", borderRadius: 8, color: "#f1f5f9", fontSize: 13, fontFamily: "sans-serif", outline: "none" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 22, color: "#f1f5f9", fontWeight: 800, fontFamily: "sans-serif" }}>Agents</div>
          <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{agents.length} agents · {agents.filter(a => a.status === "active").length} actifs</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "9px 18px", background: "#1e40af", border: "none", borderRadius: 9, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
          {showForm ? "Annuler" : "+ Ajouter agent"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "20px" }}>
          <div style={{ fontSize: 14, color: "#f1f5f9", fontWeight: 700, marginBottom: 16, fontFamily: "sans-serif" }}>Nouvel agent</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Nom complet", field: "name", placeholder: "Karim Bensalem" },
              { label: "Telephone", field: "phone", placeholder: "+213 6..." },
              { label: "Wilaya", field: "wilaya", placeholder: "Alger" },
            ].map(f => (
              <div key={f.field}>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace", textTransform: "uppercase", marginBottom: 4 }}>{f.label}</div>
                <input placeholder={f.placeholder} value={form[f.field]} onChange={e => setForm(v => ({ ...v, [f.field]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
          </div>
          <button onClick={saveAgent} disabled={saving || !form.name || !form.wilaya} style={{ marginTop: 14, padding: "11px 24px", background: saving ? "#1e293b" : "#1e40af", border: "none", borderRadius: 9, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>
            {saving ? "Enregistrement..." : "Ajouter l agent"}
          </button>
        </div>
      )}

      {agents.length === 0 && <div style={{ fontSize: 13, color: "#475569", fontFamily: "sans-serif" }}>Aucun agent. Ajoutez-en un avec le bouton ci-dessus.</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {agents.map(a => (
          <div key={a.id} style={{ background: "#0f172a", border: "1.5px solid #1e293b", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: a.status === "active" ? "#1e3a8a" : "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: a.status === "active" ? "#93c5fd" : "#475569", fontWeight: 800, fontFamily: "sans-serif", flexShrink: 0 }}>{a.avatar || a.name?.slice(0, 2).toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 700, fontFamily: "sans-serif" }}>{a.name}</div>
                <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{a.id} · {a.wilaya}</div>
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: "sans-serif" }}>{a.phone}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "#fbbf24", fontWeight: 800 }}>★ {a.rating}</div>
                <button onClick={() => toggleStatus(a)} style={{ marginTop: 4, padding: "4px 10px", background: a.status === "active" ? "#1e293b" : "#052e16", border: "none", borderRadius: 6, color: a.status === "active" ? "#ef4444" : "#10b981", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                  {a.status === "active" ? "Desactiver" : "Activer"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FINANCES SCREEN ─────────────────────────────────────────────────────────
function FinancesScreen({ rapports, onRefresh }) {
  const totalCA = rapports.filter(r => r.paid).reduce((a, r) => a + (r.price || 0), 0);
  const unpaid = rapports.filter(r => !r.paid).reduce((a, r) => a + (r.price || 0), 0);
  const paidCount = rapports.filter(r => r.paid).length;
  const avgTicket = paidCount > 0 ? Math.round(totalCA / paidCount) : 0;

  const markPaid = async (id) => {
    await supabase.from("rapports").update({ paid: true, paid_at: new Date().toISOString() }).eq("id", id);
    onRefresh();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 22, color: "#f1f5f9", fontWeight: 800, fontFamily: "sans-serif" }}>Finances</div>
        <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>Suivi CA offline · paiement cash uniquement</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <StatCard label="CA encaisse" value={fmt(totalCA)} sub="Confirmes" icon="✅" />
        <StatCard label="Non encaisse" value={fmt(unpaid)} sub={`${rapports.filter(r => !r.paid).length} rapport(s)`} icon="⏳" />
        <StatCard label="Ticket moyen" value={fmt(avgTicket)} sub="Par inspection" icon="📊" />
      </div>
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", textTransform: "uppercase" }}>Rapports non encaisses</span>
          <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 700 }}>{fmt(unpaid)}</span>
        </div>
        {rapports.filter(r => !r.paid).length === 0 && (
          <div style={{ padding: "16px 18px", fontSize: 13, color: "#475569", fontFamily: "sans-serif" }}>Tous les rapports sont encaisses.</div>
        )}
        {rapports.filter(r => !r.paid).map((r, i, arr) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: i < arr.length - 1 ? "1px solid #0a1628" : "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 600, fontFamily: "sans-serif" }}>{r.brand} {r.model} {r.year}</div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "monospace" }}>{r.id} · {r.wilaya}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#fca5a5", fontWeight: 800 }}>{fmt(r.price)}</div>
              <button onClick={() => markPaid(r.id)} style={{ marginTop: 4, padding: "4px 10px", background: "#1e293b", border: "none", borderRadius: 6, color: "#10b981", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Marquer paye</button>
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
  const [agents, setAgents] = useState([]);
  const [rdvs, setRdvs] = useState([]);
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [a, r, ra] = await Promise.all([
      supabase.from("agents").select("*").order("name"),
      supabase.from("rdvs").select("*").order("created_at", { ascending: false }),
      supabase.from("rapports").select("*").order("created_at", { ascending: false }),
    ]);
    setAgents(a.data || []);
    setRdvs(r.data || []);
    setRapports(ra.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const pendingCount = rdvs.filter(r => r.status === "pending").length;

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#080e1a", color: "#60a5fa", fontSize: 16, fontFamily: "sans-serif" }}>
      Chargement...
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080e1a" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e293b; }`}</style>
      <Sidebar active={active} setActive={setActive} pendingCount={pendingCount} />
      <main style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
        {active === "dashboard" && <Dashboard rapports={rapports} rdvs={rdvs} agents={agents} />}
        {active === "rdvs"      && <RDVsScreen rdvs={rdvs} agents={agents} onRefresh={fetchAll} />}
        {active === "rapports"  && <RapportsScreen rapports={rapports} onRefresh={fetchAll} />}
        {active === "agents"    && <AgentsScreen agents={agents} onRefresh={fetchAll} />}
        {active === "finances"  && <FinancesScreen rapports={rapports} onRefresh={fetchAll} />}
      </main>
    </div>
  );
}
