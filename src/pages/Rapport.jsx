import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const STATUS_CFG = {
  certified:          { label: "Certifie",             color: "#16a34a", bg: "#f0fdf4", accent: "#bbf7d0", dot: "#22c55e" },
  certified_reserves: { label: "Certifie avec reserves", color: "#b45309", bg: "#fffbeb", accent: "#fde68a", dot: "#f59e0b" },
  non_compliant:      { label: "Non conforme",          color: "#dc2626", bg: "#fef2f2", accent: "#fecaca", dot: "#ef4444" },
};

const POINT_STATUS = {
  ok:       { label: "OK",          color: "#16a34a", bg: "#f0fdf4" },
  warning:  { label: "A surveiller", color: "#b45309", bg: "#fffbeb" },
  critical: { label: "Critique",    color: "#dc2626", bg: "#fef2f2" },
};

const CAT_STATUS = {
  ok:       { icon: "✓", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  warning:  { icon: "!", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  critical: { icon: "✕", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

function ScoreGauge({ score }) {
  const color = score >= 80 ? "#16a34a" : score >= 55 ? "#f59e0b" : "#ef4444";
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width="120" height="120" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4} strokeLinecap="round" />
        <text x="65" y="60" textAnchor="middle" fontSize="28" fontWeight="800" fill={color} fontFamily="Georgia, serif">{score}</text>
        <text x="65" y="78" textAnchor="middle" fontSize="11" fill="#6b7280">/100</text>
      </svg>
      <span style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase" }}>Score Thiqa</span>
    </div>
  );
}

export default function ThiqaRapport() {
  const { id } = useParams();
  const [rapport, setRapport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [contactRevealed, setContactRevealed] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!id) { setNotFound(true); setLoading(false); return; }
      const { data, error } = await supabase.from("rapports").select("*").eq("id", id).single();
      if (error || !data) { setNotFound(true); } else { setRapport(data); }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 16, color: "#6b7280", fontFamily: "sans-serif" }}>Chargement du rapport...</div>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <div style={{ fontSize: 40 }}>🔍</div>
      <div style={{ fontSize: 20, color: "#111827", fontWeight: 700, fontFamily: "Georgia, serif" }}>Rapport introuvable</div>
      <div style={{ fontSize: 14, color: "#6b7280", fontFamily: "sans-serif" }}>Le rapport {id} n existe pas ou a expire.</div>
    </div>
  );

  const d = rapport;
  const cfg = STATUS_CFG[d.status] || STATUS_CFG.certified;
  const checklist = d.checklist || [];

  const categories = [
    { id: "carrosserie", label: "Carrosserie", icon: "🚗" },
    { id: "mecanique",   label: "Mecanique",   icon: "⚙️" },
    { id: "securite",    label: "Securite",    icon: "🛡️" },
    { id: "interieur",   label: "Interieur",   icon: "💺" },
    { id: "essai",       label: "Essai",       icon: "🛣️" },
    { id: "documents",   label: "Documents",   icon: "📄" },
  ].map(cat => {
    const points = checklist.filter(p => p.category === cat.id);
    const hasCritical = points.some(p => p.status === "critical");
    const hasWarning  = points.some(p => p.status === "warning");
    return { ...cat, points, status: hasCritical ? "critical" : hasWarning ? "warning" : "ok" };
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } .fade { animation: fadeUp 0.4s ease both; } @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* HEADER */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px #0000000d" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔍</div>
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#111827" }}>Thiqa Auto</div>
              <div style={{ fontSize: 10, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Inspection certifiee</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "right" }}>
            <div style={{ fontWeight: 600, color: "#374151" }}>{d.id}</div>
            <div>{d.created_at ? new Date(d.created_at).toLocaleDateString("fr-DZ") : ""}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 60px" }}>

        {/* HERO */}
        <div className="fade" style={{ background: cfg.bg, border: `1.5px solid ${cfg.accent}`, borderRadius: 20, padding: "24px 20px", display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
          <ScoreGauge score={d.score || 0} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: `1.5px solid ${cfg.accent}`, borderRadius: 30, padding: "5px 14px 5px 8px", marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#111827", lineHeight: 1.2 }}>{d.brand} {d.model}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{d.year} · {d.energy} · {d.color}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Wilaya : {d.wilaya}</div>
          </div>
        </div>

        {/* KILOMETRAGE */}
        <div className="fade" style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 14, padding: "14px 18px", display: "flex", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 2 }}>Kilometrage non certifie</div>
            <div style={{ fontSize: 13, color: "#78350f" }}>Valeur declaree : <strong>{d.mileage_declared || "Non renseigne"}</strong>. Thiqa Auto ne certifie pas le kilometrage.</div>
          </div>
        </div>

        {/* CATEGORIES GRID */}
        <div className="fade" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {categories.map(cat => {
            const st = CAT_STATUS[cat.status];
            return (
              <button key={cat.id} onClick={() => setExpanded(expanded === cat.id ? null : cat.id)} style={{ padding: "14px 10px", borderRadius: 14, background: expanded === cat.id ? st.bg : "#fff", border: `1.5px solid ${expanded === cat.id ? st.border : "#e5e7eb"}`, cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", lineHeight: 1.3 }}>{cat.label}</div>
                <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4, background: st.bg, color: st.color, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>
                  {st.icon} {cat.status === "ok" ? "OK" : cat.status === "warning" ? "Reserves" : "Critique"}
                </div>
              </button>
            );
          })}
        </div>

        {/* DETAILS */}
        <div className="fade" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Detail par categorie</div>
          {categories.map(cat => {
            const st = CAT_STATUS[cat.status];
            const isOpen = expanded === cat.id;
            return (
              <div key={cat.id} style={{ border: `1.5px solid ${isOpen ? st.border : "#e5e7eb"}`, borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                <button onClick={() => setExpanded(isOpen ? null : cat.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 24 }}>{cat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, color: "#111827", fontWeight: 700 }}>{cat.label}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{cat.points.length} points inspectes</div>
                  </div>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: st.bg, border: `1.5px solid ${st.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: st.color, fontWeight: 800 }}>{st.icon}</div>
                  <span style={{ color: "#9ca3af", fontSize: 18, display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </button>
                {isOpen && cat.points.length > 0 && (
                  <div style={{ borderTop: "1px solid #f3f4f6", padding: "0 20px 16px" }}>
                    {cat.points.map((p, i) => {
                      const s = POINT_STATUS[p.status] || POINT_STATUS.ok;
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: i < cat.points.length - 1 ? "1px solid #f9fafb" : "none" }}>
                          <span style={{ width: 20, height: 20, borderRadius: 6, background: s.bg, color: s.color, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            {p.status === "ok" ? "✓" : p.status === "warning" ? "!" : "✕"}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{p.label}</div>
                            {p.note && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, fontStyle: "italic" }}>{p.note}</div>}
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, padding: "2px 8px", borderRadius: 20, flexShrink: 0 }}>{s.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {isOpen && cat.points.length === 0 && (
                  <div style={{ borderTop: "1px solid #f3f4f6", padding: "14px 20px", fontSize: 13, color: "#9ca3af" }}>Aucun point enregistre pour cette categorie.</div>
                )}
              </div>
            );
          })}
        </div>

        {/* GAGE */}
        <div className="fade" style={{ background: "#111827", borderRadius: 18, padding: "22px 20px", marginBottom: 16, color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 70, height: 70, border: "2px solid #e5e7eb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: "#fff" }}>🔲</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 17, marginBottom: 4 }}>Gage Thiqa Auto</div>
            <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.5 }}>
              Vehicule inspecte par Thiqa Auto<br />
              Wilaya : {d.wilaya}
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div className="fade" style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 18, padding: "20px", marginBottom: 16 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 17, color: "#111827", marginBottom: 6 }}>Contacter le vendeur</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Le numero est masque pour proteger la vie privee.</div>
          {!contactRevealed ? (
            <button onClick={() => setContactRevealed(true)} style={{ width: "100%", padding: "14px", border: "none", borderRadius: 12, background: "#111827", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Afficher le numero
            </button>
          ) : (
            <div style={{ padding: "14px 18px", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#15803d" }}>+213 6XX XXX XXX</span>
              <a href="https://wa.me/213542465055" style={{ padding: "8px 14px", background: "#25d366", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>WhatsApp</a>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="fade" style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", lineHeight: 1.7, padding: "0 10px" }}>
          <div style={{ marginBottom: 6, fontWeight: 600, color: "#6b7280" }}>{d.id} · thiqa-auto.dz</div>
          Thiqa Auto est un avis technique independant. Ne remplace pas un essai routier ni une garantie legale.
        </div>
      </div>
    </div>
  );
}
