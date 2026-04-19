import { useState } from "react";

const WILAYAS_COVERED = [
  "Alger","Oran","Constantine","Annaba","Blida","Setif","Batna","Sidi Bel Abbes",
  "Tlemcen","Bejaia","Tizi Ouzou","Boumerdes","Tipaza","Medea","Mostaganem",
  "Bouira","Jijel","Skikda","Guelma","Souk Ahras","Mila","Ain Defla","Chlef",
  "Relizane","Mascara","Saida","Tiaret","Tissemsilt","Ghardaia","Ouargla",
  "El Oued","Biskra","Laghouat","Djelfa","MSila","Bordj Bou Arreridj","El Tarf",
  "Khenchela","Tebessa",
];

const WILAYAS_SOON = [
  "Adrar","Bechar","Tamanrasset","Illizi","El Bayadh","Naama",
  "Tindouf","Ain Temouchent","Oum El Bouaghi",
  "Bordj Badji Mokhtar","In Salah","In Guezzam","Touggourt","Djanet",
  "El MGhair","El Menia","Timimoun","Ouled Djellal",
];

const TARIFS = [
  {
    id: "essential", name: "Essentiel", price: "4 900", tag: null,
    features: [
      "Inspection 80 points",
      "Rapport digital partageable",
      "QR code unique",
      "Gage Thiqa valable 30 jours",
      "Prise de RDV sous 48h",
    ],
    cta: "Prendre RDV",
  },
  {
    id: "premium", name: "Premium", price: "7 900", tag: "Le plus choisi",
    features: [
      "Inspection complete 150 points",
      "Rapport digital + PDF imprimable",
      "QR code + badge telechargeable",
      "Gage Thiqa valable 60 jours",
      "Photos HD de tous les defauts",
      "Essai routier inclus",
      "Prise de RDV sous 24h",
    ],
    cta: "Prendre RDV",
  },
  {
    id: "pro", name: "Pro Vendeur", price: "Sur devis", tag: "Negociants et Showrooms",
    features: [
      "Tarif degressif des 5 vehicules",
      "Agent dedie deplacement showroom",
      "Tableau de bord vendeur",
      "Badge co-brande",
      "Facturation mensuelle",
    ],
    cta: "Nous contacter",
  },
];

const STEPS_VENDEUR = [
  { n: "01", title: "Prenez RDV", desc: "Par telephone ou WhatsApp. Un agent se deplace chez vous dans votre wilaya.", icon: "📞" },
  { n: "02", title: "Inspection sur place", desc: "L agent realise le controle complet en 20 a 30 minutes. Vous signez le rapport sur place.", icon: "🔍" },
  { n: "03", title: "Partagez le rapport", desc: "Vous recevez le lien et le QR code. Ajoutez-les a votre annonce.", icon: "📲" },
];

const STEPS_ACHETEUR = [
  { n: "01", title: "Scannez le QR", desc: "Sur l annonce, scannez le QR code ou ouvrez le lien partage par le vendeur.", icon: "📷" },
  { n: "02", title: "Lisez le rapport", desc: "Score, categories, photos des defauts, documents verifies. Tout en un coup d oeil.", icon: "📄" },
  { n: "03", title: "Achetez serein", desc: "Vous savez exactement dans quel etat est le vehicule avant de le voir.", icon: "✅" },
];

const FAQS = [
  { q: "Thiqa Auto certifie-t-il le kilometrage ?", a: "Non. Le kilometrage est declare par le vendeur et affiche en clair sur le rapport avec la mention non certifie par Thiqa Auto. Nous inspectons uniquement les elements verifiables physiquement." },
  { q: "Combien de temps dure une inspection ?", a: "Entre 20 et 30 minutes sur place. L agent se deplace a l adresse de votre choix dans la wilaya couverte." },
  { q: "Comment le rapport est-il infalsifiable ?", a: "Chaque rapport recoit un identifiant unique horodate et signe numeriquement. Toute modification invalide automatiquement le lien public." },
  { q: "Le paiement se fait comment ?", a: "Aucun paiement en ligne. Tout se regle en cash aupres de l agent le jour de l inspection, apres confirmation du RDV." },
  { q: "Le rapport est-il visible gratuitement pour l acheteur ?", a: "Oui, totalement gratuit. L acheteur scanne le QR ou ouvre le lien sans creer de compte ni payer quoi que ce soit." },
];

function Nav({ active, setActive }) {
  const links = ["Accueil", "Comment ca marche", "Tarifs", "Wilayas", "FAQ"];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,247,240,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e8e0d0", padding: "0 24px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setActive("Accueil")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔍</div>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#1a1a1a", fontWeight: 700 }}>Thiqa Auto</span>
        </button>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {links.map(l => (
            <button key={l} onClick={() => setActive(l)} style={{ padding: "7px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: active === l ? 700 : 500, color: active === l ? "#1a1a1a" : "#6b5d4f", borderBottom: active === l ? "2px solid #c8a96e" : "2px solid transparent" }}>{l}</button>
          ))}
        </div>
        <button onClick={() => setActive("Tarifs")} style={{ padding: "9px 20px", background: "#1a1a1a", border: "none", borderRadius: 30, color: "#faf7f0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Faire inspecter
        </button>
      </div>
    </nav>
  );
}

function Hero({ setActive }) {
  return (
    <section style={{ background: "#1a1a1a", minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "60px 24px" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, #c8a96e18 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#c8a96e20", border: "1px solid #c8a96e44", borderRadius: 30, padding: "6px 16px", marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e" }} />
              <span style={{ fontSize: 11, color: "#c8a96e", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Nouveau en Algerie</span>
            </div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 5vw, 58px)", color: "#faf7f0", lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.03em" }}>
              Achetez occasion<br /><em style={{ color: "#c8a96e" }}>en toute confiance.</em>
            </h1>
            <p style={{ fontSize: 17, color: "#9d8e7f", lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
              Thiqa Auto inspecte physiquement le vehicule et genere un rapport digital infalsifiable. Le vendeur le partage. L acheteur achete serein.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => setActive("Tarifs")} style={{ padding: "15px 28px", background: "#c8a96e", border: "none", borderRadius: 12, color: "#1a1a1a", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 30px #c8a96e44" }}>
                Faire inspecter mon vehicule
              </button>
              <button onClick={() => setActive("Comment ca marche")} style={{ padding: "15px 24px", background: "transparent", border: "1.5px solid #3a3a3a", borderRadius: 12, color: "#9d8e7f", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Comment ca marche ?
              </button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid #2a2a2a" }}>
              {[{ val: "150", label: "Points controles" }, { val: "39", label: "Wilayas couvertes" }, { val: "0 DA", label: "Pour l acheteur" }].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#faf7f0", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#6b5d4f", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 320, background: "#faf7f0", borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 80px #00000066", transform: "rotate(2deg)" }}>
              <div style={{ background: "#1a1a1a", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#faf7f0" }}>🔍 Thiqa Auto</span>
                <div style={{ background: "#c8a96e22", border: "1px solid #c8a96e55", borderRadius: 20, padding: "3px 10px", fontSize: 10, color: "#c8a96e", fontWeight: 700 }}>CERTIFIE</div>
              </div>
              <div style={{ padding: "20px", borderBottom: "1px solid #e8e0d0", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid #16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#15803d", fontWeight: 700 }}>87</span>
                </div>
                <div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#1a1a1a" }}>Volkswagen Golf 7</div>
                  <div style={{ fontSize: 12, color: "#6b5d4f" }}>2017 · Diesel · Gris</div>
                </div>
              </div>
              <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
                {[{ icon: "🚗", label: "Carrosserie", s: "warning" }, { icon: "⚙️", label: "Mecanique", s: "ok" }, { icon: "🛡️", label: "Securite", s: "ok" }, { icon: "💺", label: "Interieur", s: "ok" }].map(c => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14 }}>{c.icon}</span>
                    <span style={{ flex: 1, fontSize: 12, color: "#374151", fontWeight: 500 }}>{c.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: c.s === "ok" ? "#f0fdf4" : "#fffbeb", color: c.s === "ok" ? "#16a34a" : "#b45309" }}>{c.s === "ok" ? "OK" : "A surveiller"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const [tab, setTab] = useState("vendeur");
  const steps = tab === "vendeur" ? STEPS_VENDEUR : STEPS_ACHETEUR;
  return (
    <section style={{ padding: "80px 24px", background: "#faf7f0" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: "#c8a96e", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Le processus</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", color: "#1a1a1a" }}>Comment ca marche ?</h2>
        </div>
        <div style={{ display: "flex", background: "#ede8de", borderRadius: 14, padding: 4, marginBottom: 48, maxWidth: 320, margin: "0 auto 48px" }}>
          {["vendeur", "acheteur"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 10, background: tab === t ? "#1a1a1a" : "transparent", color: tab === t ? "#faf7f0" : "#6b5d4f", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {t === "vendeur" ? "Je suis vendeur" : "Je suis acheteur"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#1a1a1a", border: "3px solid #c8a96e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                {i < steps.length - 1 && <div style={{ width: 2, height: 56, background: "#e8e0d0", margin: "6px 0" }} />}
              </div>
              <div style={{ paddingBottom: i < steps.length - 1 ? 40 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#c8a96e", letterSpacing: "0.1em" }}>{s.n}</span>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#1a1a1a", margin: 0 }}>{s.title}</h3>
                </div>
                <p style={{ fontSize: 15, color: "#6b5d4f", lineHeight: 1.65, margin: 0, maxWidth: 460 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tarifs() {
  return (
    <section style={{ padding: "80px 24px", background: "#111827" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: "#c8a96e", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Tarification</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", color: "#faf7f0", marginBottom: 12 }}>Nos formules</h2>
          <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 440, margin: "0 auto" }}>Paiement cash aupres de l agent le jour de l inspection. Aucun paiement en ligne.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {TARIFS.map((t) => {
            const isPremium = t.id === "premium";
            return (
              <div key={t.id} style={{ background: isPremium ? "#c8a96e" : "#1f2937", borderRadius: 20, padding: "28px 24px", border: isPremium ? "none" : "1.5px solid #374151", position: "relative", boxShadow: isPremium ? "0 20px 60px #c8a96e44" : "none", transform: isPremium ? "scale(1.03)" : "scale(1)" }}>
                {t.tag && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: isPremium ? "#1a1a1a" : "#374151", color: isPremium ? "#c8a96e" : "#9ca3af", fontSize: 10, fontWeight: 800, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>{t.tag}</div>
                )}
                <div style={{ fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: isPremium ? "#7a5c2e" : "#6b7280", marginBottom: 8 }}>{t.name}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: t.price === "Sur devis" ? 28 : 36, color: isPremium ? "#1a1a1a" : "#faf7f0", lineHeight: 1, marginBottom: 4 }}>{t.price}</div>
                {t.price !== "Sur devis" && <div style={{ fontSize: 12, color: isPremium ? "#7a5c2e" : "#6b7280", marginBottom: 20 }}>DZD · paiement cash</div>}
                {t.price === "Sur devis" && <div style={{ marginBottom: 20 }} />}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {t.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ fontSize: 14, color: isPremium ? "#1a1a1a" : "#10b981", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 13.5, color: isPremium ? "#2a1a00" : "#d1d5db", lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", padding: "13px", border: "none", borderRadius: 12, background: isPremium ? "#1a1a1a" : "#374151", color: isPremium ? "#c8a96e" : "#faf7f0", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>{t.cta} →</button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Wilayas() {
  const [showSoon, setShowSoon] = useState(false);
  return (
    <section style={{ padding: "80px 24px", background: "#faf7f0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: "#c8a96e", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Couverture geographique</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", color: "#1a1a1a" }}>Wilayas couvertes</h2>
          <p style={{ fontSize: 15, color: "#6b5d4f", marginTop: 12 }}>{WILAYAS_COVERED.length} wilayas disponibles</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, justifyContent: "center" }}>
          {WILAYAS_COVERED.map(w => (
            <div key={w} style={{ padding: "7px 16px", background: "#1a1a1a", borderRadius: 30, fontSize: 12, fontWeight: 700, color: "#faf7f0", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />{w}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginBottom: showSoon ? 20 : 0 }}>
          <button onClick={() => setShowSoon(s => !s)} style={{ padding: "9px 20px", background: "transparent", border: "1.5px solid #d4c9b8", borderRadius: 30, color: "#6b5d4f", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {showSoon ? "Masquer" : `+ ${WILAYAS_SOON.length} wilayas bientot disponibles`}
          </button>
        </div>
        {showSoon && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 12 }}>
            {WILAYAS_SOON.map(w => (
              <div key={w} style={{ padding: "7px 16px", background: "#f3ede2", borderRadius: 30, border: "1px dashed #c8a96e", fontSize: 12, color: "#9d8e7f", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e" }} />{w}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "80px 24px", background: "#1a1a1a" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: "#c8a96e", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Questions frequentes</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 38px)", color: "#faf7f0" }}>Tout ce qu il faut savoir</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ background: "#1f2937", borderRadius: 14, border: `1.5px solid ${open === i ? "#c8a96e44" : "#2a2a2a"}`, overflow: "hidden" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "18px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#c8a96e", flexShrink: 0, width: 28 }}>{open === i ? "-" : "+"}</span>
                <span style={{ fontSize: 14.5, color: "#faf7f0", fontWeight: 600, lineHeight: 1.4 }}>{f.q}</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 20px 18px 62px" }}>
                  <p style={{ fontSize: 14, color: "#9d8e7f", lineHeight: 1.7, margin: 0 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAFooter({ setActive }) {
  return (
    <section style={{ padding: "80px 24px", background: "#c8a96e", textAlign: "center" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", color: "#1a1a1a", marginBottom: 16 }}>Votre vehicule merite la confiance.</h2>
        <p style={{ fontSize: 16, color: "#4a3520", lineHeight: 1.65, marginBottom: 32 }}>Un Gage Thiqa valorise votre annonce et rassure l acheteur des le premier regard.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setActive("Tarifs")} style={{ padding: "15px 28px", background: "#1a1a1a", border: "none", borderRadius: 12, color: "#c8a96e", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Faire inspecter mon vehicule</button>
          <a href="https://wa.me/213600000000" style={{ padding: "15px 24px", background: "#25d366", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            💬 WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#0d0d0d", padding: "32px 24px", borderTop: "1px solid #1f1f1f" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔍</div>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#9d8e7f" }}>Thiqa Auto</span>
        </div>
        <div style={{ fontSize: 12, color: "#4b5563", textAlign: "center", lineHeight: 1.6 }}>
          Thiqa Auto est un avis technique independant. Ne remplace pas un essai ni une garantie legale.
        </div>
        <div style={{ fontSize: 12, color: "#4b5563" }}>2026 Thiqa Auto · Algerie</div>
      </div>
    </footer>
  );
}

export default function ThiqaVitrine() {
  const [active, setActive] = useState("Accueil");
  const renderContent = () => {
    switch (active) {
      case "Accueil": return <><Hero setActive={setActive} /><HowItWorks /><Tarifs /><Wilayas /><FAQ /><CTAFooter setActive={setActive} /></>;
      case "Comment ca marche": return <><div style={{ background: "#faf7f0", paddingTop: 40 }}><HowItWorks /></div><CTAFooter setActive={setActive} /></>;
      case "Tarifs": return <><div style={{ paddingTop: 40 }}><Tarifs /></div><CTAFooter setActive={setActive} /></>;
      case "Wilayas": return <><div style={{ background: "#faf7f0", paddingTop: 40 }}><Wilayas /></div><CTAFooter setActive={setActive} /></>;
      case "FAQ": return <><div style={{ paddingTop: 40 }}><FAQ /></div><CTAFooter setActive={setActive} /></>;
      default: return null;
    }
  };
  return (
    <div style={{ minHeight: "100vh", background: "#faf7f0" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } html { scroll-behavior: smooth; }`}</style>
      <Nav active={active} setActive={setActive} />
      {renderContent()}
      <Footer />
    </div>
  );
}
