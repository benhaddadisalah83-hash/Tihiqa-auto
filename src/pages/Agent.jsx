import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CHECKLIST = [
  {
    id: "carrosserie", label: "Carrosserie", icon: "🚗",
    points: [
      { id: "c1", label: "Peinture uniforme — sans retouche visible" },
      { id: "c2", label: "Aile avant gauche — état général" },
      { id: "c3", label: "Aile avant droite — état général" },
      { id: "c4", label: "Aile arrière gauche — état général" },
      { id: "c5", label: "Aile arrière droite — état général" },
      { id: "c6", label: "Capot — alignement et état" },
      { id: "c7", label: "Coffre — fermeture et état" },
      { id: "c8", label: "Portes — alignement des joints" },
      { id: "c9", label: "Pare-brise — sans fissure ni impact" },
      { id: "c10", label: "Vitres latérales — sans éclat" },
      { id: "c11", label: "Lunette arrière — sans fissure" },
      { id: "c12", label: "Soubassement — corrosion" },
      { id: "c13", label: "Bas de caisse gauche" },
      { id: "c14", label: "Bas de caisse droit" },
    ],
  },
  {
    id: "mecanique", label: "Mécanique", icon: "⚙️",
    points: [
      { id: "m1", label: "Fuite moteur — huile, eau, carburant" },
      { id: "m2", label: "Courroie de distribution — état" },
      { id: "m3", label: "Niveau huile moteur" },
      { id: "m4", label: "Liquide de refroidissement" },
      { id: "m5", label: "Liquide de frein — couleur" },
      { id: "m6", label: "Liquide direction assistée" },
      { id: "m7", label: "Batterie — état et charge" },
      { id: "m8", label: "Filtre à air — encrassement" },
      { id: "m9", label: "Courroie accessoires" },
      { id: "m10", label: "Boîte de vitesse — fuite" },
      { id: "m11", label: "Pont — fuite différentiel" },
      { id: "m12", label: "Silencieux — état et fixation" },
    ],
  },
  {
    id: "securite", label: "Sécurité", icon: "🛡️",
    points: [
      { id: "s1", label: "Freins avant — épaisseur disques" },
      { id: "s2", label: "Freins arrière — épaisseur disques" },
      { id: "s3", label: "Frein à main — efficacité" },
      { id: "s4", label: "Pneu avant gauche — usure et état" },
      { id: "s5", label: "Pneu avant droit — usure et état" },
      { id: "s6", label: "Pneu arrière gauche — usure et état" },
      { id: "s7", label: "Pneu arrière droit — usure et état" },
      { id: "s8", label: "Roue de secours présente" },
      { id: "s9", label: "Ceintures de sécurité x5" },
      { id: "s10", label: "Airbags — témoins éteints" },
      { id: "s11", label: "Feux avant — fonctionnement" },
      { id: "s12", label: "Feux arrière et stop" },
      { id: "s13", label: "Clignotants avant/arrière" },
      { id: "s14", label: "Feux de recul" },
    ],
  },
  {
    id: "interieur", label: "Intérieur", icon: "💺",
    points: [
      { id: "i1", label: "Siège conducteur — état et réglage" },
      { id: "i2", label: "Sièges passagers — état général" },
      { id: "i3", label: "Revêtement plafond" },
      { id: "i4", label: "Moquette — état" },
      { id: "i5", label: "Climatisation — froid et chaud" },
      { id: "i6", label: "Tableau de bord — sans témoin allumé" },
      { id: "i7", label: "Compteur — fonctionnement" },
      { id: "i8", label: "Autoradio / écran tactile" },
      { id: "i9", label: "Vitres électriques x4" },
      { id: "i10", label: "Rétroviseurs électriques" },
      { id: "i11", label: "Klaxon" },
      { id: "i12", label: "Essuie-glaces avant/arrière" },
    ],
  },
  {
    id: "essai", label: "Essai Routier", icon: "🛣️",
    points: [
      { id: "e1", label: "Démarrage à froid — facilité" },
      { id: "e2", label: "Ralenti moteur — régulier" },
      { id: "e3", label: "Boîte vitesses — passages nets" },
      { id: "e4", label: "Embrayage — progressivité" },
      { id: "e5", label: "Direction — sans jeu ni vibration" },
      { id: "e6", label: "Tenue de route — pas de tirage" },
      { id: "e7", label: "Freinage — efficace et linéaire" },
      { id: "e8", label: "Bruits suspects — accélération" },
      { id: "e9", label: "Bruits suspects — virage" },
      { id: "e10", label: "Climatisation — en roulant" },
    ],
  },
  {
    id: "documents", label: "Documents", icon: "📄",
    points: [
      { id: "d1", label: "Carte grise présente et conforme" },
      { id: "d2", label: "Contrôle technique valide" },
      { id: "d3", label: "N° châssis — concordance plaque/doc" },
      { id: "d4", label: "Assurance en cours de validité" },
      { id: "d5", label: "Carnet d'entretien présent" },
    ],
  },
];

const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar",
  "Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger",
  "Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma",
  "Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Oran","El Bayadh",
  "Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt",
  "El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma",
  "Aïn Témouchent","Ghardaïa","Relizane","El M'Ghair","El Menia","Ouled Djellal",
  "Bordj Badji Mokhtar","In Salah","In Guezzam","Touggourt","Djanet","M'Ghair","Timimoun",
];

// ─── STEP CONFIG ─────────────────────────────────────────────────────────────
const STEPS = ["login", "vehicle", "checklist", "photos", "sign", "done"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function statusColor(s) {
  if (s === "ok") return { bg: "#16a34a", light: "#dcfce7", text: "#15803d" };
  if (s === "warning") return { bg: "#f59e0b", light: "#fef3c7", text: "#b45309" };
  if (s === "critical") return { bg: "#ef4444", light: "#fee2e2", text: "#dc2626" };
  return { bg: "#374151", light: "#f3f4f6", text: "#6b7280" };
}

function countByStatus(results) {
  const ok = Object.values(results).filter(v => v.status === "ok").length;
  const warning = Object.values(results).filter(v => v.status === "warning").length;
  const critical = Object.values(results).filter(v => v.status === "critical").length;
  return { ok, warning, critical };
}

function computeScore(results) {
  const total = Object.keys(results).length;
  if (total === 0) return 0;
  const { ok, warning } = countByStatus(results);
  return Math.round(((ok + warning * 0.5) / total) * 100);
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function ProgressBar({ step }) {
  const idx = STEPS.indexOf(step);
  const pct = ((idx) / (STEPS.length - 1)) * 100;
  return (
    <div style={{ height: 3, background: "#1f2937", borderRadius: 2, overflow: "hidden", margin: "0 0 0 0" }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: "linear-gradient(90deg, #10b981, #34d399)",
        borderRadius: 2, transition: "width 0.4s cubic-bezier(.4,0,.2,1)",
      }} />
    </div>
  );
}

function Chip({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 30, border: "none",
      background: active ? color : "#1f2937",
      color: active ? "#fff" : "#9ca3af",
      fontSize: 12, fontWeight: 700, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      transition: "all 0.15s",
      letterSpacing: "0.04em",
    }}>{label}</button>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [id, setId] = useState("AGT-044");
  const [pin, setPin] = useState("••••");

  return (
    <div style={{ padding: "48px 24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, background: "#10b981",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 30, margin: "0 auto 16px",
          boxShadow: "0 0 40px #10b98155",
        }}>🔍</div>
        <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 26, color: "#f9fafb" }}>
          Thiqa Agent
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
          Application Inspecteur
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          ID Agent
        </label>
        <input
          value={id} onChange={e => setId(e.target.value)}
          style={{
            padding: "14px 16px", background: "#1f2937", border: "1.5px solid #374151",
            borderRadius: 12, color: "#f9fafb", fontSize: 16, fontFamily: "'DM Sans', sans-serif",
            outline: "none",
          }}
        />
        <label style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          Code PIN
        </label>
        <input
          type="password" value={pin} onChange={e => setPin(e.target.value)}
          style={{
            padding: "14px 16px", background: "#1f2937", border: "1.5px solid #374151",
            borderRadius: 12, color: "#f9fafb", fontSize: 16, fontFamily: "'DM Sans', sans-serif",
            outline: "none",
          }}
        />
      </div>

      <button onClick={onLogin} style={{
        padding: "16px", background: "#10b981", border: "none", borderRadius: 14,
        color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em",
        boxShadow: "0 4px 20px #10b98144",
      }}>
        Connexion →
      </button>

      <div style={{
        display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
        padding: "10px 16px", background: "#1f2937", borderRadius: 10,
      }}>
        <span style={{ fontSize: 12 }}>📶</span>
        <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>
          Mode hors-ligne disponible
        </span>
      </div>
    </div>
  );
}

function VehicleScreen({ vehicle, setVehicle, onNext }) {
  const Field = ({ label, field, type = "text", placeholder }) => (
    <div>
      <label style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </label>
      <input
        type={type}
        value={vehicle[field] || ""}
        onChange={e => setVehicle(v => ({ ...v, [field]: e.target.value }))}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "13px 14px", background: "#1f2937",
          border: "1.5px solid #374151", borderRadius: 12, color: "#f9fafb",
          fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none",
        }}
      />
    </div>
  );

  const ready = vehicle.brand && vehicle.model && vehicle.year && vehicle.wilaya;

  return (
    <div style={{ padding: "20px 20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#f9fafb" }}>Nouveau véhicule</div>
        <div style={{ fontSize: 13, color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>Saisie ou scan plaque</div>
      </div>

      {/* Scan plaque */}
      <button style={{
        padding: "16px", background: "#1f2937", border: "1.5px dashed #374151",
        borderRadius: 14, color: "#9ca3af", fontSize: 14, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>📷</span>
        Scanner la plaque d'immatriculation
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Marque" field="brand" placeholder="Volkswagen" />
        <Field label="Modèle" field="model" placeholder="Golf 7" />
        <Field label="Année" field="year" type="number" placeholder="2017" />
        <div>
          <label style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
            Énergie
          </label>
          <select
            value={vehicle.energy || ""}
            onChange={e => setVehicle(v => ({ ...v, energy: e.target.value }))}
            style={{
              width: "100%", padding: "13px 14px", background: "#1f2937",
              border: "1.5px solid #374151", borderRadius: 12, color: vehicle.energy ? "#f9fafb" : "#6b7280",
              fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none",
            }}
          >
            <option value="">—</option>
            <option>Essence</option>
            <option>Diesel</option>
            <option>GPL</option>
            <option>Hybride</option>
            <option>Électrique</option>
          </select>
        </div>
      </div>

      <Field label="Couleur" field="color" placeholder="Gris Métallisé" />
      <Field label="N° châssis (VIN)" field="chassis" placeholder="WVWZZZ1KZXW123456" />

      {/* Kilométrage déclaré */}
      <div style={{
        padding: "14px 16px", background: "#1c1a10", border: "1.5px solid #92400e",
        borderRadius: 12,
      }}>
        <div style={{ fontSize: 11, color: "#d97706", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
          ⚠️ Kilométrage déclaré — non certifié
        </div>
        <input
          value={vehicle.mileage || ""}
          onChange={e => setVehicle(v => ({ ...v, mileage: e.target.value }))}
          placeholder="123 000 km"
          style={{
            width: "100%", padding: "11px 14px", background: "#111827",
            border: "1px solid #374151", borderRadius: 10, color: "#f9fafb",
            fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none",
          }}
        />
      </div>

      {/* Wilaya */}
      <div>
        <label style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
          Wilaya d'inspection
        </label>
        <select
          value={vehicle.wilaya || ""}
          onChange={e => setVehicle(v => ({ ...v, wilaya: e.target.value }))}
          style={{
            width: "100%", padding: "13px 14px", background: "#1f2937",
            border: "1.5px solid #374151", borderRadius: 12, color: vehicle.wilaya ? "#f9fafb" : "#6b7280",
            fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none",
          }}
        >
          <option value="">Sélectionner la wilaya</option>
          {WILAYAS.map(w => <option key={w}>{w}</option>)}
        </select>
      </div>

      <button
        onClick={onNext}
        disabled={!ready}
        style={{
          padding: "16px", background: ready ? "#10b981" : "#1f2937",
          border: "none", borderRadius: 14, color: ready ? "#fff" : "#4b5563",
          fontSize: 16, fontWeight: 800, cursor: ready ? "pointer" : "default",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: ready ? "0 4px 20px #10b98144" : "none",
          transition: "all 0.2s",
          marginTop: 4,
        }}
      >
        Démarrer l'inspection →
      </button>
    </div>
  );
}

function ChecklistScreen({ results, setResults, onNext }) {
  const [activeCat, setActiveCat] = useState(CHECKLIST[0].id);
  const [activePoint, setActivePoint] = useState(null);
  const cat = CHECKLIST.find(c => c.id === activeCat);
  const { ok, warning, critical } = countByStatus(results);
  const total = CHECKLIST.reduce((a, c) => a + c.points.length, 0);
  const done = Object.keys(results).length;

  const setStatus = (pointId, status) => {
    setResults(r => ({ ...r, [pointId]: { ...r[pointId], status } }));
    setActivePoint(null);
  };

  const allDone = done === total;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Stats bar */}
      <div style={{
        display: "flex", gap: 8, padding: "12px 16px",
        background: "#111827", borderBottom: "1px solid #1f2937",
        flexShrink: 0,
      }}>
        {[
          { label: "OK", val: ok, col: "#10b981" },
          { label: "Surveiller", val: warning, col: "#f59e0b" },
          { label: "Critique", val: critical, col: "#ef4444" },
          { label: "Restants", val: total - done, col: "#4b5563" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.col, fontFamily: "'DM Serif Display', Georgia, serif" }}>{s.val}</div>
            <div style={{ fontSize: 9, color: "#6b7280", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category tabs */}
      <div style={{
        display: "flex", gap: 6, padding: "10px 16px", overflowX: "auto",
        background: "#111827", flexShrink: 0,
        scrollbarWidth: "none",
      }}>
        {CHECKLIST.map(c => {
          const catDone = c.points.filter(p => results[p.id]?.status).length;
          const catTotal = c.points.length;
          const isActive = activeCat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              style={{
                flexShrink: 0, padding: "7px 14px", borderRadius: 30, border: "none",
                background: isActive ? "#10b981" : "#1f2937",
                color: isActive ? "#fff" : "#9ca3af",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {c.icon} {c.label}
              <span style={{
                fontSize: 10, background: isActive ? "#fff3" : "#374151",
                color: isActive ? "#fff" : "#6b7280", padding: "1px 6px", borderRadius: 10,
              }}>{catDone}/{catTotal}</span>
            </button>
          );
        })}
      </div>

      {/* Points list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {cat.points.map((point) => {
          const res = results[point.id];
          const status = res?.status;
          const col = statusColor(status);
          const isOpen = activePoint === point.id;

          return (
            <div key={point.id} style={{
              background: "#1f2937",
              border: `1.5px solid ${status ? col.bg : "#374151"}`,
              borderRadius: 14,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}>
              <button
                onClick={() => setActivePoint(isOpen ? null : point.id)}
                style={{
                  width: "100%", padding: "14px 16px", background: "none",
                  border: "none", cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 12,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: status ? col.bg : "#374151",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13,
                }}>
                  {status === "ok" ? "✓" : status === "warning" ? "!" : status === "critical" ? "✕" : "·"}
                </div>
                <span style={{ fontSize: 13.5, color: "#e5e7eb", fontFamily: "'DM Sans', sans-serif", flex: 1, lineHeight: 1.35 }}>
                  {point.label}
                </span>
                {status && (
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: col.text,
                    background: col.light + "22", padding: "2px 8px", borderRadius: 20,
                    flexShrink: 0, fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {status === "ok" ? "OK" : status === "warning" ? "À surveiller" : "CRITIQUE"}
                  </span>
                )}
              </button>

              {isOpen && (
                <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { s: "ok", label: "✓ OK", col: "#10b981" },
                      { s: "warning", label: "! Surveiller", col: "#f59e0b" },
                      { s: "critical", label: "✕ Critique", col: "#ef4444" },
                    ].map(btn => (
                      <button
                        key={btn.s}
                        onClick={() => setStatus(point.id, btn.s)}
                        style={{
                          flex: 1, padding: "10px 6px", border: "none", borderRadius: 10,
                          background: status === btn.s ? btn.col : "#374151",
                          color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                          transition: "background 0.15s",
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Commentaire */}
                  <textarea
                    placeholder="Commentaire (optionnel)..."
                    value={results[point.id]?.note || ""}
                    onChange={e => setResults(r => ({ ...r, [point.id]: { ...r[point.id], note: e.target.value } }))}
                    rows={2}
                    style={{
                      width: "100%", padding: "10px 12px", background: "#111827",
                      border: "1px solid #374151", borderRadius: 10, color: "#e5e7eb",
                      fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "none",
                    }}
                  />

                  {/* Photo */}
                  {(status === "warning" || status === "critical") && (
                    <button style={{
                      padding: "10px", background: "#111827", border: "1.5px dashed #374151",
                      borderRadius: 10, color: "#6b7280", fontSize: 13, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{ fontSize: 18 }}>📷</span>
                      {status === "critical" ? "Photo OBLIGATOIRE" : "Ajouter une photo"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ padding: "14px 16px", background: "#111827", borderTop: "1px solid #1f2937", flexShrink: 0 }}>
        <button
          onClick={onNext}
          disabled={!allDone}
          style={{
            width: "100%", padding: "15px", border: "none", borderRadius: 14,
            background: allDone ? "#10b981" : "#1f2937",
            color: allDone ? "#fff" : "#4b5563",
            fontSize: 15, fontWeight: 800, cursor: allDone ? "pointer" : "default",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: allDone ? "0 4px 20px #10b98144" : "none",
            transition: "all 0.2s",
          }}
        >
          {allDone ? "Photos obligatoires →" : `Compléter la checklist (${done}/${total})`}
        </button>
      </div>
    </div>
  );
}

function PhotosScreen({ onNext }) {
  const [taken, setTaken] = useState({});

  const required = [
    { id: "ext_front", label: "Avant", icon: "🚗" },
    { id: "ext_left", label: "Côté gauche", icon: "◀" },
    { id: "ext_right", label: "Côté droit", icon: "▶" },
    { id: "ext_rear", label: "Arrière", icon: "🔙" },
    { id: "interior", label: "Intérieur", icon: "💺" },
    { id: "engine", label: "Moteur", icon: "⚙️" },
    { id: "undercarriage", label: "Soubassement", icon: "🔧" },
  ];

  const allTaken = required.every(r => taken[r.id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "16px 20px", flexShrink: 0 }}>
        <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#f9fafb" }}>Photos obligatoires</div>
        <div style={{ fontSize: 13, color: "#6b7280", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
          {Object.keys(taken).length}/{required.length} photos prises
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {required.map(r => (
          <button
            key={r.id}
            onClick={() => setTaken(t => ({ ...t, [r.id]: true }))}
            style={{
              padding: "20px 10px", border: `1.5px ${taken[r.id] ? "solid #10b981" : "dashed #374151"}`,
              borderRadius: 14, background: taken[r.id] ? "#052e16" : "#1f2937",
              cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            }}
          >
            <span style={{ fontSize: 28 }}>{taken[r.id] ? "✅" : r.icon}</span>
            <span style={{ fontSize: 12, color: taken[r.id] ? "#10b981" : "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              {r.label}
            </span>
            {!taken[r.id] && (
              <span style={{ fontSize: 10, color: "#4b5563", fontFamily: "'DM Sans', sans-serif" }}>Appuyer pour simuler</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: "14px 16px", background: "#111827", borderTop: "1px solid #1f2937", flexShrink: 0 }}>
        <button
          onClick={onNext}
          disabled={!allTaken}
          style={{
            width: "100%", padding: "15px", border: "none", borderRadius: 14,
            background: allTaken ? "#10b981" : "#1f2937",
            color: allTaken ? "#fff" : "#4b5563",
            fontSize: 15, fontWeight: 800, cursor: allTaken ? "pointer" : "default",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: allTaken ? "0 4px 20px #10b98144" : "none",
            transition: "all 0.2s",
          }}
        >
          {allTaken ? "Signature vendeur →" : "Photos manquantes"}
        </button>
      </div>
    </div>
  );
}

function SignScreen({ vehicle, results, onDone }) {
  const [signed, setSigned] = useState(false);
  const score = computeScore(results);
  const { ok, warning, critical } = countByStatus(results);
  const statusLabel = critical > 0 ? "Non conforme" : warning > 0 ? "Certifié avec réserves" : "Certifié";
  const statusCol = critical > 0 ? "#ef4444" : warning > 0 ? "#f59e0b" : "#10b981";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#f9fafb" }}>
          Récapitulatif
        </div>

        {/* Score */}
        <div style={{
          background: "#1f2937", borderRadius: 16, padding: "20px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            border: `3px solid ${statusCol}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: statusCol }}>
              {score}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: statusCol, fontFamily: "'DM Sans', sans-serif" }}>{statusLabel}</div>
            <div style={{ fontSize: 13, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
              {ok} OK · {warning} à surveiller · {critical} critique(s)
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>
              {vehicle.brand} {vehicle.model} {vehicle.year}
            </div>
          </div>
        </div>

        {/* Mileage warning */}
        <div style={{
          background: "#1c1a10", border: "1.5px solid #92400e",
          borderRadius: 12, padding: "12px 14px",
          fontSize: 12, color: "#d97706", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
          fontWeight: 700,
        }}>
          ⚠️ KILOMÉTRAGE DÉCLARÉ : {vehicle.mileage || "—"} — NON GARANTI PAR THIQA AUTO
        </div>

        {/* Signature zone */}
        <div>
          <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
            Signature du vendeur
          </div>
          <div
            onClick={() => setSigned(true)}
            style={{
              height: 120, background: "#1f2937",
              border: `1.5px ${signed ? "solid #10b981" : "dashed #374151"}`,
              borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {signed ? (
              <span style={{ fontFamily: "cursive", fontSize: 28, color: "#10b981" }}>✍ Karim Bensalem</span>
            ) : (
              <span style={{ fontSize: 13, color: "#4b5563", fontFamily: "'DM Sans', sans-serif" }}>
                Appuyer pour signer
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px", background: "#111827", borderTop: "1px solid #1f2937", flexShrink: 0 }}>
        <button
          onClick={onDone}
          disabled={!signed}
          style={{
            width: "100%", padding: "15px", border: "none", borderRadius: 14,
            background: signed ? "#10b981" : "#1f2937",
            color: signed ? "#fff" : "#4b5563",
            fontSize: 15, fontWeight: 800, cursor: signed ? "pointer" : "default",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: signed ? "0 4px 20px #10b98144" : "none",
            transition: "all 0.2s",
          }}
        >
          {signed ? "🔒 Clôturer & Générer le rapport" : "Signature requise"}
        </button>
      </div>
    </div>
  );
}

function DoneScreen({ vehicle, results }) {
  const reportId = "INS-2026-04-7891";
  const url = `thiqa-auto.dz/r/${reportId}`;
  const score = computeScore(results);
  const { warning, critical } = countByStatus(results);
  const statusLabel = critical > 0 ? "Non conforme" : warning > 0 ? "Certifié avec réserves" : "Certifié";
  const statusCol = critical > 0 ? "#ef4444" : warning > 0 ? "#f59e0b" : "#10b981";

  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20, alignItems: "center", textAlign: "center" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "#052e16", border: "3px solid #10b981",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36,
        boxShadow: "0 0 40px #10b98155",
        animation: "pop 0.5s cubic-bezier(.34,1.56,.64,1) both",
      }}>✓</div>

      <div>
        <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 26, color: "#f9fafb" }}>
          Rapport généré !
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
          {vehicle.brand} {vehicle.model} {vehicle.year}
        </div>
      </div>

      <div style={{
        background: "#1f2937", borderRadius: 16, padding: "16px 20px",
        width: "100%", display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          border: `2px solid ${statusCol}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 20, color: statusCol }}>{score}</span>
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: statusCol, fontFamily: "'DM Sans', sans-serif" }}>{statusLabel}</div>
          <div style={{ fontSize: 12, color: "#6b7280", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{reportId}</div>
        </div>
      </div>

      {/* QR placeholder */}
      <div style={{
        width: 120, height: 120, background: "#fff",
        borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 52, border: "2px solid #1f2937",
      }}>🔲</div>

      <div style={{
        width: "100%", background: "#1f2937", borderRadius: 12, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "'DM Mono', monospace", flex: 1, textAlign: "left" }}>
          {url}
        </span>
        <button style={{
          padding: "6px 14px", background: "#374151", border: "none", borderRadius: 8,
          color: "#e5e7eb", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
        }}>
          Copier
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        <button style={{
          flex: 1, padding: "13px", background: "#25d366", border: "none", borderRadius: 12,
          color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>
          WhatsApp
        </button>
        <button style={{
          flex: 1, padding: "13px", background: "#1f2937", border: "none", borderRadius: 12,
          color: "#e5e7eb", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>
          ↓ PDF
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const STEP_LABELS = {
  login: "Connexion",
  vehicle: "Véhicule",
  checklist: "Checklist",
  photos: "Photos",
  sign: "Signature",
  done: "Terminé",
};

export default function ThiqaAgent() {
  const [step, setStep] = useState("login");
  const [vehicle, setVehicle] = useState({});
  const [results, setResults] = useState({});

  const next = () => setStep(s => STEPS[STEPS.indexOf(s) + 1]);

  return (
    <div style={{
      minHeight: "100vh", background: "#111827", color: "#f9fafb",
      display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111827; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        input::placeholder, textarea::placeholder { color: #4b5563; }
        select option { background: #1f2937; color: #f9fafb; }
        @keyframes pop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      {/* TOP BAR */}
      {step !== "login" && step !== "done" && (
        <div style={{
          padding: "14px 16px 10px",
          background: "#0d1117",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🔍</span>
              <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 15, color: "#10b981" }}>Thiqa Agent</span>
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>
              {STEP_LABELS[step]}
            </div>
          </div>
          <ProgressBar step={step} />
        </div>
      )}

      {/* SCREEN */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {step === "login"     && <LoginScreen onLogin={next} />}
        {step === "vehicle"   && <VehicleScreen vehicle={vehicle} setVehicle={setVehicle} onNext={next} />}
        {step === "checklist" && <ChecklistScreen results={results} setResults={setResults} onNext={next} />}
        {step === "photos"    && <PhotosScreen onNext={next} />}
        {step === "sign"      && <SignScreen vehicle={vehicle} results={results} onDone={next} />}
        {step === "done"      && <DoneScreen vehicle={vehicle} results={results} />}
      </div>
    </div>
  );
}
