import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const WILAYAS_COVERED = [
  "Alger","Oran","Constantine","Annaba","Blida","Sétif","Batna","Sidi Bel Abbès",
  "Tlemcen","Béjaïa","Tizi Ouzou","Boumerdès","Tipaza","Médéa","Mostaganem",
  "Bouira","Jijel","Skikda","Guelma","Souk Ahras","Mila","Ain Defla","Chlef",
  "Relizane","Mascara","Saïda","Tiaret","Tissemsilt","Ghardaïa","Ouargla",
  "El Oued","Biskra","Laghouat","Djelfa","M'Sila","Bordj Bou Arréridj","El Tarf",
  "Khenchela","Tébessa",
];

const WILAYAS_SOON = [
  "Adrar","Béchar","Tamanrasset","Illizi","El Bayadh","Naâma",
  "Tindouf","Aïn Témouchent","Ain Defla","Oum El Bouaghi",
  "Bordj Badji Mokhtar","In Salah","In Guezzam","Touggourt","Djanet",
  "El M'Ghair","El Menia","Timimoun","Ouled Djellal",
];

const TARIFS = [
  {
    id: "essential",
    name: "Essentiel",
    price: "4 900",
    tag: null,
    color: "#1a1a1a",
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
    id: "premium",
    name: "Premium",
    price: "7 900",
    tag: "Le plus choisi",
    color: "#c8a96e",
    features: [
      "Inspection complète 150 points",
      "Rapport digital + PDF imprimable",
      "QR code + badge téléchargeable",
      "Gage Thiqa valable 60 jours",
      "Photos HD de tous les défauts",
      "Essai routier inclus",
      "Prise de RDV sous 24h",
    ],
    cta: "Prendre RDV",
  },
  {
    id: "pro",
    name: "Pro Vendeur",
    price: "Sur devis",
    tag: "Négociants & Showrooms",
    color: "#374151",
    features: [
      "Tarif dégressif dès 5 véhicules",
      "Agent dédié déplacement showroom",
      "Tableau de bord vendeur",
      "Badge co-brandé",
      "Facturation mensuelle",
    ],
    cta: "Nous contacter",
  },
];

const STEPS_VENDEUR = [
  { n: "01", title: "Prenez RDV", desc: "Par téléphone ou WhatsApp. Un agent se déplace chez vous ou au lieu de votre choix dans votre wilaya.", icon: "📞" },
  { n: "02", title: "Inspection sur place", desc: "L'agent réalise le contrôle complet en 20 à 30 minutes. Vous signez le rapport sur place.", icon: "🔍" },
  { n: "03", title: "Partagez le rapport", desc: "Vous recevez le lien et le QR code. Ajoutez-les à votre annonce. Les acheteurs consultent en 30 secondes.", icon: "📲" },
];

const STEPS_ACHETEUR = [
  { n: "01", title: "Scannez le QR", desc: "Sur l'annonce, scannez le QR code ou ouvrez le lien partagé par le vendeur.", icon: "📷" },
  { n: "02", title: "Lisez le rapport", desc: "Score, catégories, photos des défauts, documents vérifiés. Tout en un coup d'œil.", icon: "📄" },
  { n: "03", title: "Achetez serein", desc: "Vous savez exactement dans quel état est le véhicule avant même de le voir.", icon: "✅" },
];

const FAQS = [
  { q: "Thiqa Auto certifie-t-il le kilométrage ?", a: "Non. Le kilométrage est déclaré par le vendeur et affiché en clair sur le rapport avec la mention «non certifié par Thiqa Auto». Nous inspectons uniquement les éléments vérifiables physiquement." },
  { q: "Combien de temps dure une inspection ?", a: "Entre 20 et 30 minutes sur place. L'agent se déplace à l'adresse de votre choix dans la wilaya couverte." },
  { q: "Comment le rapport est-il infalsifiable ?", a: "Chaque rapport reçoit un identifiant unique horodaté et signé numériquement. Toute modification invalide automatiquement le lien public." },
  { q: "Le paiement se fait comment ?", a: "Aucun paiement en ligne. Tout se règle en cash auprès de l'agent le jour de l'inspection, après confirmation du RDV." },
  { q: "Le rapport est-il visible gratuitement pour l'acheteur ?", a: "Oui, totalement gratuit. L'acheteur scanne le QR ou ouvre le lien sans créer de compte ni payer quoi que ce soit." },
];

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ active, setActive }) {
  const links = ["Accueil", "Comment ça marche", "Tarifs", "Wilayas", "FAQ"];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(250,247,240,0.97)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e8e0d0",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <button onClick={() => setActive("Accueil")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: "#1a1a1a",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>🔍</div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#1a1a1a", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Thiqa Auto
          </span>
        </button>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="nav-desktop">
          {links.map(l => (
            <button key={l} onClick={() => setActive(l)} style={{
              padding: "7px 14px", background: "none", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: active === l ? 700 : 500,
              color: active === l ? "#1a1a1a" : "#6b5d4f",
              borderBottom: active === l ? "2px solid #c8a96e" : "2px solid transparent",
              fontFamily: "'Mulish', sans-serif",
              transition: "all 0.15s",
            }}>{l}</button>
          ))}
        </div>

        <button onClick={() => setActive("Tarifs")} style={{
          padding: "9px 20px", background: "#1a1a1a", border: "none", borderRadius: 30,
          color: "#faf7f0", fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "'Mulish', sans-serif", letterSpacing: "0.02em",
        }}>
          Faire inspecter →
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ setActive }) {
  return (
    <section style={{
      background: "#1a1a1a",
      minHeight: "92vh",
      display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
      padding: "60px 24px",
    }}>
      {/* Background texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, #c8a96e18 0%, transparent 60%),
                          radial-gradient(circle at 80% 20%, #c8a96e10 0%, transparent 50%)`,
        pointerEvents: "none",
      }} />
      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1080, margin: "0 auto", width: "100%", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#c8a96e20", border: "1px solid #c8a96e44",
              borderRadius: 30, padding: "6px 16px", marginBottom: 24,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e" }} />
              <span style={{ fontSize: 11, color: "#c8a96e", fontFamily: "'Mulish', sans-serif", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Nouveau en Algérie
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
< truncated lines 184-515 >
            padding: "9px 20px", background: "transparent",
            border: "1.5px solid #d4c9b8", borderRadius: 30,
            color: "#6b5d4f", fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Mulish', sans-serif",
          }}>
            {showSoon ? "Masquer" : `+ ${WILAYAS_SOON.length} wilayas bientôt disponibles`}
          </button>
        </div>

        {showSoon && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 12 }}>
            {WILAYAS_SOON.map(w => (
              <div key={w} style={{
                padding: "7px 16px", background: "#f3ede2",
                borderRadius: 30, border: "1px dashed #c8a96e",
                fontSize: 12, color: "#9d8e7f", fontFamily: "'Mulish', sans-serif",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8a96e", flexShrink: 0 }} />
                {w}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section style={{ padding: "80px 24px", background: "#1a1a1a" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: "#c8a96e", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Mulish', sans-serif", fontWeight: 700, marginBottom: 12 }}>
            Questions fréquentes
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 38px)", color: "#faf7f0", letterSpacing: "-0.02em" }}>
            Tout ce qu'il faut savoir
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{
              background: "#1f2937", borderRadius: 14,
              border: `1.5px solid ${open === i ? "#c8a96e44" : "#2a2a2a"}`,
              overflow: "hidden", transition: "border-color 0.2s",
            }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width: "100%", padding: "18px 20px", background: "none", border: "none",
                cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, color: "#c8a96e", flexShrink: 0, width: 28 }}>
                  {open === i ? "−" : "+"}
                </span>
                <span style={{ fontSize: 14.5, color: "#faf7f0", fontFamily: "'Mulish', sans-serif", fontWeight: 600, lineHeight: 1.4 }}>
                  {f.q}
                </span>
              </button>
              {open === i && (
                <div style={{ padding: "0 20px 18px 62px" }}>
                  <p style={{ fontSize: 14, color: "#9d8e7f", fontFamily: "'Mulish', sans-serif", lineHeight: 1.7, margin: 0 }}>
                    {f.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA FOOTER ───────────────────────────────────────────────────────────────
function CTAFooter({ setActive }) {
  return (
    <section style={{
      padding: "80px 24px",
      background: "#c8a96e",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(28px, 4vw, 44px)", color: "#1a1a1a",
          letterSpacing: "-0.02em", marginBottom: 16,
        }}>
          Votre véhicule mérite la confiance.
        </h2>
        <p style={{ fontSize: 16, color: "#4a3520", fontFamily: "'Mulish', sans-serif", lineHeight: 1.65, marginBottom: 32 }}>
          Un Gage Thiqa valorise votre annonce et rassure l'acheteur dès le premier regard.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setActive("Tarifs")} style={{
            padding: "15px 28px", background: "#1a1a1a", border: "none", borderRadius: 12,
            color: "#c8a96e", fontSize: 15, fontWeight: 800, cursor: "pointer",
            fontFamily: "'Mulish', sans-serif",
          }}>
            Faire inspecter mon véhicule →
          </button>
          <a href="https://wa.me/213600000000" style={{
            padding: "15px 24px", background: "#25d366", border: "none", borderRadius: 12,
            color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
            fontFamily: "'Mulish', sans-serif", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            <span>💬</span> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "#0d0d0d", padding: "32px 24px",
      borderTop: "1px solid #1f1f1f",
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔍</div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: "#9d8e7f" }}>Thiqa Auto</span>
        </div>
        <div style={{ fontSize: 12, color: "#4b5563", fontFamily: "'Mulish', sans-serif", textAlign: "center", lineHeight: 1.6 }}>
          Thiqa Auto est un avis technique indépendant. Ne remplace pas un essai ni une garantie légale. · thiqa-auto.dz
        </div>
        <div style={{ fontSize: 12, color: "#4b5563", fontFamily: "'Mulish', sans-serif" }}>
          © 2026 Thiqa Auto · Algérie
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const PAGE_MAP = {
  "Accueil": 0,
  "Comment ça marche": 1,
  "Tarifs": 2,
  "Wilayas": 3,
  "FAQ": 4,
};

export default function ThiqaVitrine() {
  const [active, setActive] = useState("Accueil");

  const renderContent = () => {
    switch (active) {
      case "Accueil":         return <><Hero setActive={setActive} /><HowItWorks /><Tarifs /><Wilayas /><FAQ /><CTAFooter setActive={setActive} /></>;
      case "Comment ça marche": return <><div style={{background:"#faf7f0",paddingTop:40}}><HowItWorks /></div><CTAFooter setActive={setActive} /></>;
      case "Tarifs":          return <><div style={{paddingTop:40}}><Tarifs /></div><CTAFooter setActive={setActive} /></>;
      case "Wilayas":         return <><div style={{background:"#faf7f0",paddingTop:40}}><Wilayas /></div><CTAFooter setActive={setActive} /></>;
      case "FAQ":             return <><div style={{paddingTop:40}}><FAQ /></div><CTAFooter setActive={setActive} /></>;
      default:                return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Mulish:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
        }
      `}</style>

      <Nav active={active} setActive={setActive} />
      {renderContent()}
      <Footer />
    </div>
  );
}
