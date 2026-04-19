import { useState } from "react";

const reportData = {
  id: "INS-2026-04-7891",
  date: "19 avril 2026",
  status: "certified_reserves", // certified | certified_reserves | non_compliant
  score: 74,
  vehicle: {
    brand: "Volkswagen",
    model: "Golf 7",
    year: 2017,
    energy: "Diesel",
    color: "Gris Métallisé",
    chassis: "WVWZZZ1KZXW123456",
    mileage_declared: "123 000 km",
  },
  agent: {
    name: "Karim B.",
    id: "AGT-044",
    wilaya: "Alger",
  },
  categories: [
    {
      id: "carrosserie",
      label: "Carrosserie",
      icon: "🚗",
      status: "warning",
      points_ok: 11,
      points_warning: 3,
      points_critical: 0,
      details: [
        { label: "Peinture uniforme", status: "ok" },
        { label: "Aile avant droite — retouche visible", status: "warning", photo: true, note: "Légère différence de teinte, retouche amateur" },
        { label: "Pare-chocs arrière — micro-impact", status: "warning", photo: true, note: "Petite déformation sans gravité structurelle" },
        { label: "Vitres sans fissures", status: "ok" },
        { label: "Alignement des panneaux", status: "ok" },
        { label: "Joints de portes", status: "ok" },
        { label: "Plancher — pas de corrosion", status: "warning", photo: true, note: "Légère oxydation sous-caisse à surveiller" },
      ],
    },
    {
      id: "mecanique",
      label: "Mécanique",
      icon: "⚙️",
      status: "ok",
      points_ok: 18,
      points_warning: 1,
      points_critical: 0,
      details: [
        { label: "Moteur sans fuite", status: "ok" },
        { label: "Courroie de distribution", status: "ok" },
        { label: "Niveau huile moteur", status: "ok" },
        { label: "Liquide de refroidissement", status: "ok" },
        { label: "Batterie — charge correcte", status: "ok" },
        { label: "Liquide de frein", status: "warning", note: "À remplacer sous 6 mois (couleur foncée)" },
        { label: "Filtre à air", status: "ok" },
      ],
    },
    {
      id: "securite",
      label: "Sécurité",
      icon: "🛡️",
      status: "ok",
      points_ok: 14,
      points_warning: 0,
      points_critical: 0,
      details: [
        { label: "Freins avant — disques OK", status: "ok" },
        { label: "Freins arrière — disques OK", status: "ok" },
        { label: "Pneus avant — usure normale", status: "ok" },
        { label: "Pneus arrière — usure normale", status: "ok" },
        { label: "Ceintures de sécurité x5", status: "ok" },
        { label: "Airbags — témoins éteints", status: "ok" },
        { label: "Feux avant/arrière", status: "ok" },
      ],
    },
    {
      id: "interieur",
      label: "Intérieur",
      icon: "💺",
      status: "ok",
      points_ok: 12,
      points_warning: 1,
      points_critical: 0,
      details: [
        { label: "Sièges avant — bon état", status: "ok" },
        { label: "Climatisation — fonctionne", status: "ok" },
        { label: "Tableau de bord — sans témoin allumé", status: "ok" },
        { label: "Vitres électriques x4", status: "ok" },
        { label: "Autoradio / écran", status: "ok" },
        { label: "Revêtement plafond", status: "warning", note: "Légère décoloration côté conducteur" },
      ],
    },
    {
      id: "essai",
      label: "Essai Routier",
      icon: "🛣️",
      status: "ok",
      points_ok: 8,
      points_warning: 0,
      points_critical: 0,
      details: [
        { label: "Démarrage à froid", status: "ok" },
        { label: "Boîte de vitesse — passages nets", status: "ok" },
        { label: "Direction — sans vibration", status: "ok" },
        { label: "Tenue de route", status: "ok" },
        { label: "Freinage — efficace", status: "ok" },
      ],
    },
    {
      id: "documents",
      label: "Documents",
      icon: "📄",
      status: "ok",
      points_ok: 5,
      points_warning: 0,
      points_critical: 0,
      details: [
        { label: "Carte grise présente et conforme", status: "ok" },
        { label: "Contrôle technique valide", status: "ok" },
        { label: "N° de série concordant", status: "ok" },
      ],
    },
  ],
};

const statusConfig = {
  certified: { label: "Certifié", color: "#16a34a", bg: "#f0fdf4", accent: "#bbf7d0", dot: "#22c55e" },
  certified_reserves: { label: "Certifié avec réserves", color: "#b45309", bg: "#fffbeb", accent: "#fde68a", dot: "#f59e0b" },
  non_compliant: { label: "Non conforme", color: "#dc2626", bg: "#fef2f2", accent: "#fecaca", dot: "#ef4444" },
};

const pointStatus = {
  ok: { label: "OK", color: "#16a34a", bg: "#f0fdf4" },
  warning: { label: "À surveiller", color: "#b45309", bg: "#fffbeb" },
  critical: { label: "Critique", color: "#dc2626", bg: "#fef2f2" },
};

const catStatus = {
  ok: { icon: "✓", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  warning: { icon: "!", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
  critical: { icon: "✕", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

function ScoreGauge({ score }) {
  const color = score >= 80 ? "#16a34a" : score >= 55 ? "#f59e0b" : "#ef4444";
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
        <text x="65" y="60" textAnchor="middle" fontSize="30" fontWeight="800" fill={color} fontFamily="'DM Serif Display', Georgia, serif">{score}</text>
        <text x="65" y="78" textAnchor="middle" fontSize="11" fill="#6b7280" fontFamily="'DM Sans', sans-serif">/100</text>
      </svg>
      <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Score Thiqa</span>
    </div>
  );
}

function CategoryCard({ cat, expanded, onToggle }) {
  const st = catStatus[cat.status];
  const total = cat.points_ok + cat.points_warning + cat.points_critical;

  return (
    <div style={{
      border: `1.5px solid ${expanded ? st.border : "#e5e7eb"}`,
      borderRadius: 14,
      overflow: "hidden",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxShadow: expanded ? `0 4px 20px ${st.border}66` : "0 1px 4px #0000000a",
      background: "#fff",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 14,
          padding: "16px 20px", background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 24 }}>{cat.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 17, color: "#111827", fontWeight: 700 }}>{cat.label}</div>
          <div style={{ fontSize: 12, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
            {total} points — {cat.points_warning > 0 ? `${cat.points_warning} à surveiller` : "aucun défaut majeur"}
          </div>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: st.bg, border: `1.5px solid ${st.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: st.color, fontWeight: 800,
          flexShrink: 0,
        }}>
          {st.icon}
        </div>
        <span style={{ color: "#9ca3af", fontSize: 18, marginLeft: 4, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}>
          ▾
        </span>
      </button>

      {expanded && (
        <div style={{ borderTop: "1px solid #f3f4f6", padding: "0 20px 16px" }}>
          {cat.details.map((d, i) => {
            const s = pointStatus[d.status];
            return (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 0",
                borderBottom: i < cat.details.length - 1 ? "1px solid #f9fafb" : "none",
              }}>
                <span style={{
                  marginTop: 1, width: 20, height: 20, borderRadius: 6,
                  background: s.bg, color: s.color,
                  fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, fontFamily: "'DM Sans', sans-serif",
                }}>
                  {d.status === "ok" ? "✓" : d.status === "warning" ? "!" : "✕"}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: "#374151", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{d.label}</div>
                  {d.note && (
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>
                      {d.note}
                    </div>
                  )}
                  {d.photo && (
                    <div style={{
                      marginTop: 8, padding: "8px 12px", background: "#f8fafc",
                      borderRadius: 8, fontSize: 12, color: "#6b7280",
                      border: "1px dashed #cbd5e1", display: "inline-flex", alignItems: "center", gap: 6,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      📸 Photo disponible dans le rapport complet
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: s.color,
                  background: s.bg, padding: "2px 8px", borderRadius: 20,
                  flexShrink: 0, fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ThiqaRapport() {
  const [expanded, setExpanded] = useState(null);
  const [contactRevealed, setContactRevealed] = useState(false);
  const d = reportData;
  const cfg = statusConfig[d.status];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .thiqa-fade-in { animation: fadeUp 0.5s ease both; }
        .thiqa-fade-in:nth-child(2) { animation-delay: 0.08s; }
        .thiqa-fade-in:nth-child(3) { animation-delay: 0.16s; }
        .thiqa-fade-in:nth-child(4) { animation-delay: 0.24s; }
        .thiqa-fade-in:nth-child(5) { animation-delay: 0.32s; }
        .thiqa-fade-in:nth-child(6) { animation-delay: 0.40s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .contact-btn {
          width: 100%; padding: 15px; border: none; border-radius: 12px;
          background: #111827; color: #fff; font-size: 15px; font-weight: 700;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em; transition: background 0.2s, transform 0.1s;
        }
        .contact-btn:hover { background: #1f2937; transform: translateY(-1px); }
        .contact-btn:active { transform: translateY(0); }

        .qr-placeholder {
          width: 80px; height: 80px; border: 2px solid #e5e7eb;
          border-radius: 10px; display: flex; align-items: center;
          justify-content: center; font-size: 32px; background: #fff;
          flex-shrink: 0;
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 1px 8px #0000000d",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "#111827", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>🔍</div>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: "#111827", letterSpacing: "-0.02em" }}>
                Thiqa Auto
              </div>
              <div style={{ fontSize: 10, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: -1 }}>
                Inspection certifiée
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", textAlign: "right" }}>
            <div style={{ fontWeight: 600, color: "#374151" }}>{d.id}</div>
            <div>{d.date}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 60px" }}>

        {/* STATUS HERO */}
        <div className="thiqa-fade-in" style={{
          background: cfg.bg,
          border: `1.5px solid ${cfg.accent}`,
          borderRadius: 20,
          padding: "24px 20px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 16,
        }}>
          <ScoreGauge score={d.score} />
          <div style={{ flex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", border: `1.5px solid ${cfg.accent}`,
              borderRadius: 30, padding: "5px 14px 5px 8px", marginBottom: 10,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color, fontFamily: "'DM Sans', sans-serif" }}>
                {cfg.label}
              </span>
            </div>
            <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#111827", lineHeight: 1.2 }}>
              {d.vehicle.brand} {d.vehicle.model}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
              {d.vehicle.year} · {d.vehicle.energy} · {d.vehicle.color}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}>
              Châssis : {d.vehicle.chassis.slice(0, 5)}XXXXXX{d.vehicle.chassis.slice(-4)}
            </div>
          </div>
        </div>

        {/* KILOMÉTRAGE WARNING */}
        <div className="thiqa-fade-in" style={{
          background: "#fffbeb",
          border: "1.5px solid #fde68a",
          borderRadius: 14,
          padding: "14px 18px",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e", fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>
              Kilométrage non certifié
            </div>
            <div style={{ fontSize: 13, color: "#78350f", fontFamily: "'DM Sans', sans-serif" }}>
              Valeur déclarée par le vendeur : <strong>{d.vehicle.mileage_declared}</strong>.
              Thiqa Auto ne certifie pas le kilométrage et ne peut en garantir l'exactitude.
            </div>
          </div>
        </div>

        {/* SUMMARY GRID */}
        <div className="thiqa-fade-in" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20,
        }}>
          {d.categories.map(cat => {
            const st = catStatus[cat.status];
            return (
              <button
                key={cat.id}
                onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                style={{
                  padding: "14px 10px", borderRadius: 14,
                  background: expanded === cat.id ? st.bg : "#fff",
                  border: `1.5px solid ${expanded === cat.id ? st.border : "#e5e7eb"}`,
                  cursor: "pointer", textAlign: "center",
                  transition: "all 0.18s",
                  boxShadow: expanded === cat.id ? `0 2px 12px ${st.border}88` : "none",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>
                  {cat.label}
                </div>
                <div style={{
                  marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4,
                  background: st.bg, color: st.color,
                  fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {st.icon} {cat.status === "ok" ? "OK" : cat.status === "warning" ? "Réserves" : "Critique"}
                </div>
              </button>
            );
          })}
        </div>

        {/* CATEGORY DETAILS */}
        <div className="thiqa-fade-in" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
            Détail par catégorie
          </div>
          {d.categories.map(cat => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              expanded={expanded === cat.id}
              onToggle={() => setExpanded(expanded === cat.id ? null : cat.id)}
            />
          ))}
        </div>

        {/* GAGE THIQA */}
        <div className="thiqa-fade-in" style={{
          background: "#111827",
          borderRadius: 18,
          padding: "22px 20px",
          marginBottom: 16,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <div className="qr-placeholder">🔲</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 17, marginBottom: 4 }}>
              Gage Thiqa Auto
            </div>
            <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
              Véhicule inspecté par <strong style={{ color: "#fff" }}>Agent {d.agent.name}</strong>
              <br />le {d.date} · Wilaya d'Alger
            </div>
            <button style={{
              marginTop: 12, padding: "8px 16px", background: "#fff",
              color: "#111827", border: "none", borderRadius: 8, cursor: "pointer",
              fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
            }}>
              ↓ Télécharger le badge
            </button>
          </div>
        </div>

        {/* CONTACT */}
        <div className="thiqa-fade-in" style={{
          background: "#fff", border: "1.5px so
