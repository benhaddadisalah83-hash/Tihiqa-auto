import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function fmt(n) { return (n || 0).toLocaleString() + " DZD"; }

const RDV_CFG = {
  confirmed: { label: "Confirme",   color: "#10b981", bg: "#f0fdf4" },
  pending:   { label: "En attente", color: "#f59e0b", bg: "#fffbeb" },
  cancelled: { label: "Annule",     color: "#6b7280", bg: "#f9fafb" },
  done:      { label: "Termine",    color: "#3b82f6", bg: "#eff6ff" },
};

const RPT_CFG = {
  certified:          { label: "Certifie",      color: "#10b981", dot: "#22c55e" },
  certified_reserves: { label: "Avec reserves", color: "#f59e0b", dot: "#fbbf24" },
  non_compliant:      { label: "Non conforme",  color: "#ef4444", dot: "#f87171" },
};

function Sidebar({ active, setActive, badge }) {
  const nav = [
    { id: "dashboard", label: "Vue ensemble", icon: "◼" },
    { id: "rdvs",      label: "RDV",          icon: "📅", badge },
    { id: "rapports",  label: "Rapports",      icon: "📄" },
    { id: "agents",    label: "Agents",        icon: "👤" },
    { id: "finances",  label: "Finances",      icon: "💰" },
  ];
  return (
    <div style={{ width: 200, flexShrink: 0, background: "#0f172a", borderRight: "1px solid #1e293b", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 16px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔍</div>
        <span style={{ fontSize: 14, color: "#f1f5f9", fontWeight: 800 }}>Thiqa Admin</span>
      </div>
      <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: active === item.id ? "#1e293b" : "transparent", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
            <span style={{ fontSize: 14, opacity: active === item.id ? 1 : 0.5 }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: active === item.id ? 700 : 400, color: active === item.id ? "#f1f5f9" : "#64748b" }}>{item.label}</span>
            {item.badge > 0 && <span style={{ background: "#1e40af", color: "#93c5fd", fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 20 }}>{item.badge}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Card({ label, value, sub, icon }) {
  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span>{icon}</span>
      </div>
      <div style={{ fontSize: 24, color: "#f1f5f9", fontWeight: 800 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Dashboard({ rapports, rdvs, agents }) {
  const ca = rapports.filter(r => r.paid).reduce((a, r) => a + (r.price || 0), 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ fontSize: 20, color: "#f1f5f9", fontWeight: 800 }}>Vue ensemble</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <Card label="CA encaisse"    value={fmt(ca)}                sub="Cash confirme"  icon="💰" />
        <Card label="Rapports"       value={rapports.length}        sub="Generes"         icon="📄" />
        <Card label="RDV en attente" value={rdvs.filter(r => r.status === "pending").length} sub="A confirmer" icon="📅" />
        <Card label="Agents actifs"  value={agents.filter(a => a.status === "active").length} sub={"sur " + agents.length} icon="👤" />
      </div>
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Derniers rapports</div>
        {rapports.length === 0 && <div style={{ fontSize: 13, color: "#475569" }}>Aucun rapport pour le moment.</div>}
        {rapports.slice(0, 6).map(r => {
          const cfg = RPT_CFG[r.status] || RPT_CFG.certified;
          return (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", background: "#0a1628", borderRadius: 7, marginBottom: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 600 }}>{r.brand} {r.model} {r.year}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{r.id} - {r.wilaya}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color }}>{r.score}/100</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: r.paid ? "#10b981" : "#ef4444" }}>{r.paid ? "Paye" : "Impaye"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RDVs({ rdvs, agents, refresh }) {
  const [filter, setFilter] = useState("all");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ client_name: "", client_phone: "", vehicle: "", wilaya: "", agent_id: "", date: "", time: "", formule: "Premium", price: "7900", notes: "", status: "pending" });

  const list = filter === "all" ? rdvs : rdvs.filter(r => r.status === "pending");

  const F = (label, field, ph, type) => (
    <div key={field}>
      <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <input type={type || "text"} placeholder={ph} value={form[field]} onChange={e => setForm(v => ({ ...v, [field]: e.target.value }))}
        style={{ width: "100%", padding: "9px 11px", background: "#0a1628", border: "1px solid #1e293b", borderRadius: 7, color: "#f1f5f9", fontSize: 13, outline: "none" }} />
    </div>
  );

  const save = async () => {
    if (!form.client_name || !form.vehicle || !form.date) return alert("Nom, vehicule et date requis");
    setSaving(true);
    const { error } = await supabase.from("rdvs").insert([{ ...form, id: "RDV-" + Date.now(), price: Number(form.price) }]);
    setSaving(false);
    if (!error) { setShow(false); setForm({ client_name: "", client_phone: "", vehicle: "", wilaya: "", agent_id: "", date: "", time: "", formule: "Premium", price: "7900", notes: "", status: "pending" }); refresh(); }
    else alert("Erreur: " + error.message);
  };

  const update = async (id, status) => {
    await supabase.from("rdvs").update({ status }).eq("id", id);
    refresh();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, color: "#f1f5f9", fontWeight: 800 }}>RDV</div>
          <div style={{ fontSize: 11, color: "#475569" }}>{rdvs.length} rendez-vous</div>
        </div>
        <button onClick={() => setShow(!show)} style={{ padding: "8px 16px", background: "#1e40af", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {show ? "Fermer" : "+ Nouveau RDV"}
        </button>
      </div>

      {show && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "18px" }}>
          <div style={{ fontSize: 14, color: "#f1f5f9", fontWeight: 700, marginBottom: 14 }}>Nouveau RDV</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {F("Nom client",  "client_name",  "M. Rahmani")}
            {F("Telephone",   "client_phone", "+213 6...")}
            {F("Vehicule",    "vehicle",      "Mercedes 2016")}
            {F("Wilaya",      "wilaya",       "Alger")}
            {F("Date",        "date",         "", "date")}
            {F("Heure",       "time",         "", "time")}
            {F("Prix DZD",    "price",        "7900", "number")}
            <div>
              <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", marginBottom: 4 }}>Formule</div>
              <select value={form.formule} onChange={e => setForm(v => ({ ...v, formule: e.target.value }))} style={{ width: "100%", padding: "9px 11px", background: "#0a1628", border: "1px solid #1e293b", borderRadius: 7, color: "#f1f5f9", fontSize: 13 }}>
                <option>Essentiel</option><option>Premium</option><option>Pro</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", marginBottom: 4 }}>Agent</div>
              <select value={form.agent_id} onChange={e => setForm(v => ({ ...v, agent_id: e.target.value }))} style={{ width: "100%", padding: "9px 11px", background: "#0a1628", border: "1px solid #1e293b", borderRadius: 7, color: "#f1f5f9", fontSize: 13 }}>
                <option value="">-- Choisir --</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.wilaya})</option>)}
              </select>
            </div>
          </div>
          <button onClick={save} disabled={saving} style={{ marginTop: 12, padding: "10px 22px", background: saving ? "#334155" : "#1e40af", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 6 }}>
        {["all","pending","confirmed","cancelled","done"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: filter === f ? "#1e40af" : "#1e293b", color: filter === f ? "#fff" : "#64748b", fontSize: 11, fontWeight: 700 }}>
            {f === "all" ? "Tous" : f === "pending" ? "En attente" : f === "confirmed" ? "Confirmes" : f === "cancelled" ? "Annules" : "Termines"}
          </button>
        ))}
      </div>

      {list.length === 0 && <div style={{ fontSize: 13, color: "#475569" }}>Aucun RDV.</div>}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
        {list.map((r, i) => {
          const cfg = RDV_CFG[r.status] || RDV_CFG.pending;
          return (
            <div key={r.id} style={{ padding: "12px 14px", borderBottom: i < list.length - 1 ? "1px solid #0a1628" : "none", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 700 }}>{r.client_name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{r.vehicle} - {r.wilaya} - {r.formule}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{r.date} {r.time} - {fmt(r.price)}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg + "44", padding: "2px 8px", borderRadius: 20 }}>{cfg.label}</span>
              <div style={{ display: "flex", gap: 5 }}>
                {r.status === "pending" && <button onClick={() => update(r.id, "confirmed")} style={{ padding: "4px 9px", background: "#052e16", border: "none", borderRadius: 5, color: "#10b981", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Confirmer</button>}
                {r.status !== "cancelled" && r.status !== "done" && <button onClick={() => update(r.id, "cancelled")} style={{ padding: "4px 9px", background: "#1e293b", border: "none", borderRadius: 5, color: "#ef4444", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Annuler</button>}
                {r.status === "confirmed" && <button onClick={() => update(r.id, "done")} style={{ padding: "4px 9px", background: "#1e293b", border: "none", borderRadius: 5, color: "#60a5fa", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Termine</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Rapports({ rapports, refresh }) {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? rapports : rapports.filter(r => r.status === filter);

  const markPaid = async (id) => {
    await supabase.from("rapports").update({ paid: true, paid_at: new Date().toISOString() }).eq("id", id);
    refresh();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontSize: 20, color: "#f1f5f9", fontWeight: 800 }}>Rapports</div>
      <div style={{ display: "flex", gap: 6 }}>
        {["all","certified","certified_reserves","non_compliant"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: filter === f ? "#1e40af" : "#1e293b", color: filter === f ? "#fff" : "#64748b", fontSize: 11, fontWeight: 700 }}>
            {f === "all" ? "Tous" : f === "certified" ? "Certifies" : f === "certified_reserves" ? "Reserves" : "Non conformes"}
          </button>
        ))}
      </div>
      {list.length === 0 && <div style={{ fontSize: 13, color: "#475569" }}>Aucun rapport.</div>}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
        {list.map((r, i) => {
          const cfg = RPT_CFG[r.status] || RPT_CFG.certified;
          const sc = r.score >= 80 ? "#10b981" : r.score >= 55 ? "#f59e0b" : "#ef4444";
          return (
            <div key={r.id} style={{ padding: "11px 14px", borderBottom: i < list.length - 1 ? "1px solid #0a1628" : "none", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 600 }}>{r.brand} {r.model} {r.year}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{r.id} - {r.wilaya}</div>
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: sc }}>{r.score}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
              {r.paid
                ? <span style={{ fontSize: 10, fontWeight: 700, color: "#10b981" }}>Paye</span>
                : <button onClick={() => markPaid(r.id)} style={{ padding: "4px 9px", background: "#1e293b", border: "none", borderRadius: 5, color: "#10b981", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Marquer paye</button>
              }
              <a href={"/r/" + r.id} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#60a5fa" }}>Voir</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Agents({ agents, refresh }) {
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "" });

  const save = async () => {
    if (!form.name || !form.wilaya) return alert("Nom et wilaya requis");
    setSaving(true);
    const id = "AGT-" + Math.floor(Math.random() * 900 + 100);
    const avatar = form.name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2);
    const { error } = await supabase.from("agents").insert([{ ...form, id, avatar, status: "active", rating: 5.0 }]);
    setSaving(false);
    if (!error) { setShow(false); setForm({ name: "", phone: "", wilaya: "" }); refresh(); }
    else alert("Erreur: " + error.message);
  };

  const toggle = async (a) => {
    await supabase.from("agents").update({ status: a.status === "active" ? "inactive" : "active" }).eq("id", a.id);
    refresh();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 20, color: "#f1f5f9", fontWeight: 800 }}>Agents</div>
          <div style={{ fontSize: 11, color: "#475569" }}>{agents.length} agents - {agents.filter(a => a.status === "active").length} actifs</div>
        </div>
        <button onClick={() => setShow(!show)} style={{ padding: "8px 16px", background: "#1e40af", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {show ? "Fermer" : "+ Ajouter agent"}
        </button>
      </div>

      {show && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "18px" }}>
          <div style={{ fontSize: 14, color: "#f1f5f9", fontWeight: 700, marginBottom: 14 }}>Nouvel agent</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["Nom complet", "name", "Karim Bensalem"], ["Telephone", "phone", "+213 6..."], ["Wilaya", "wilaya", "Alger"]].map(([lbl, fld, ph]) => (
              <div key={fld}>
                <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", marginBottom: 4 }}>{lbl}</div>
                <input placeholder={ph} value={form[fld]} onChange={e => setForm(v => ({ ...v, [fld]: e.target.value }))}
                  style={{ width: "100%", padding: "9px 11px", background: "#0a1628", border: "1px solid #1e293b", borderRadius: 7, color: "#f1f5f9", fontSize: 13, outline: "none" }} />
              </div>
            ))}
          </div>
          <button onClick={save} disabled={saving} style={{ marginTop: 12, padding: "10px 22px", background: saving ? "#334155" : "#1e40af", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            {saving ? "Enregistrement..." : "Ajouter"}
          </button>
        </div>
      )}

      {agents.length === 0 && <div style={{ fontSize: 13, color: "#475569" }}>Aucun agent. Ajoutez-en un ci-dessus.</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
        {agents.map(a => (
          <div key={a.id} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: a.status === "active" ? "#1e3a8a" : "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: a.status === "active" ? "#93c5fd" : "#475569", fontWeight: 800, flexShrink: 0 }}>
                {a.avatar || (a.name || "").slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 700 }}>{a.name}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>{a.id} - {a.wilaya}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{a.phone}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <span style={{ fontSize: 12, color: a.status === "active" ? "#10b981" : "#6b7280", fontWeight: 700 }}>
                {a.status === "active" ? "Actif" : "Inactif"}
              </span>
              <button onClick={() => toggle(a)} style={{ padding: "4px 10px", background: "#1e293b", border: "none", borderRadius: 6, color: a.status === "active" ? "#ef4444" : "#10b981", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                {a.status === "active" ? "Desactiver" : "Activer"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Finances({ rapports, refresh }) {
  const ca = rapports.filter(r => r.paid).reduce((a, r) => a + (r.price || 0), 0);
  const unpaid = rapports.filter(r => !r.paid).reduce((a, r) => a + (r.price || 0), 0);
  const n = rapports.filter(r => r.paid).length;

  const markPaid = async (id) => {
    await supabase.from("rapports").update({ paid: true, paid_at: new Date().toISOString() }).eq("id", id);
    refresh();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontSize: 20, color: "#f1f5f9", fontWeight: 800 }}>Finances</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        <Card label="CA encaisse"  value={fmt(ca)}                          sub="Confirme"    icon="✅" />
        <Card label="Non encaisse" value={fmt(unpaid)}                       sub="A encaisser" icon="⏳" />
        <Card label="Ticket moyen" value={fmt(n > 0 ? Math.round(ca / n) : 0)} sub="Par inspection" icon="📊" />
      </div>
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Rapports non encaisses</span>
          <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 700 }}>{fmt(unpaid)}</span>
        </div>
        {rapports.filter(r => !r.paid).length === 0 && <div style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>Tout est encaisse.</div>}
        {rapports.filter(r => !r.paid).map((r, i, arr) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: i < arr.length - 1 ? "1px solid #0a1628" : "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 600 }}>{r.brand} {r.model} {r.year}</div>
              <div style={{ fontSize: 10, color: "#475569" }}>{r.id} - {r.wilaya}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#fca5a5", fontWeight: 800 }}>{fmt(r.price)}</div>
              <button onClick={() => markPaid(r.id)} style={{ marginTop: 3, padding: "3px 9px", background: "#1e293b", border: "none", borderRadius: 5, color: "#10b981", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Marquer paye</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ThiqaAdmin() {
  const [active, setActive]   = useState("dashboard");
  const [agents, setAgents]   = useState([]);
  const [rdvs, setRdvs]       = useState([]);
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [a, r, rp] = await Promise.all([
      supabase.from("agents").select("*").order("name"),
      supabase.from("rdvs").select("*").order("created_at", { ascending: false }),
      supabase.from("rapports").select("*").order("created_at", { ascending: false }),
    ]);
    setAgents(a.data || []);
    setRdvs(r.data || []);
    setRapports(rp.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080e1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", fontSize: 16 }}>
      Chargement...
    </div>
  );

  const badge = rdvs.filter(r => r.status === "pending").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080e1a", fontFamily: "system-ui, sans-serif" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e293b; } select option { background: #1f2937; }`}</style>
      <Sidebar active={active} setActive={setActive} badge={badge} />
      <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        {active === "dashboard" && <Dashboard rapports={rapports} rdvs={rdvs} agents={agents} />}
        {active === "rdvs"      && <RDVs rapports={rapports} rdvs={rdvs} agents={agents} refresh={load} />}
        {active === "rapports"  && <Rapports rapports={rapports} refresh={load} />}
        {active === "agents"    && <Agents agents={agents} refresh={load} />}
        {active === "finances"  && <Finances rapports={rapports} refresh={load} />}
      </main>
    </div>
  );
}
