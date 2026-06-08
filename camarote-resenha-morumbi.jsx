import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// MOCK DATA & FIREBASE SIMULATION
// ─────────────────────────────────────────────
const MOCK_EVENTS = [
  { id: "1", name: "São Paulo FC vs Corinthians", date: "2025-07-12", time: "16:00", local: "Neo Química Arena", banner: "", value: 850, status: "active", description: "O clássico mais esperado do ano no maior camarote do Morumbi.", category: "Futebol" },
  { id: "2", name: "Show: Ana Castela", date: "2025-08-03", time: "20:00", local: "Allianz Parque", banner: "", value: 1200, status: "active", description: "A rainha do agro em uma noite inesquecível com open bar completo.", category: "Show" },
  { id: "3", name: "Final Paulistão 2025", date: "2025-09-20", time: "18:30", local: "MorumBIS", banner: "", value: 1500, status: "active", description: "Viva a grande final com toda a experiência premium do Resenha.", category: "Futebol" },
];
const MOCK_TICKETS = [
  { id: "t1", eventId: "1", type: "VIP", name: "Camarote VIP", value: 850, qty: 100, sold: 67, lote: "1º Lote", status: "active" },
  { id: "t2", eventId: "1", type: "PREMIUM", name: "Mesa Premium", value: 1200, qty: 30, sold: 28, lote: "1º Lote", status: "active" },
  { id: "t3", eventId: "2", type: "VIP", name: "Camarote VIP", value: 1200, qty: 80, sold: 45, lote: "1º Lote", status: "active" },
];
const MOCK_CUSTOMERS = [
  { id: "c1", name: "Ricardo Almeida", email: "ricardo@email.com", phone: "(11) 99999-0001", purchases: 3, total: 3550 },
  { id: "c2", name: "Fernanda Costa", email: "fernanda@email.com", phone: "(11) 99999-0002", purchases: 1, total: 1200 },
  { id: "c3", name: "Bruno Souza", email: "bruno@email.com", phone: "(11) 99999-0003", purchases: 5, total: 6250 },
  { id: "c4", name: "Mariana Lima", email: "mariana@email.com", phone: "(11) 99999-0004", purchases: 2, total: 2400 },
];
const MOCK_COUPONS = [
  { id: "cp1", code: "VIPMORUMBI10", discount: 10, type: "percent", limit: 50, used: 12, expiry: "2025-12-31", status: "active" },
  { id: "cp2", code: "RESENHA100", discount: 100, type: "fixed", limit: 20, used: 5, expiry: "2025-08-31", status: "active" },
];
const MOCK_SALES = [
  { id: "s1", customer: "Ricardo Almeida", event: "São Paulo FC vs Corinthians", ticket: "Camarote VIP", value: 850, date: "2025-06-10", status: "confirmed" },
  { id: "s2", customer: "Fernanda Costa", event: "Show: Ana Castela", ticket: "Camarote VIP", value: 1200, date: "2025-06-11", status: "confirmed" },
  { id: "s3", customer: "Bruno Souza", event: "Final Paulistão 2025", ticket: "Mesa Premium", value: 1500, date: "2025-06-12", status: "confirmed" },
  { id: "s4", customer: "Mariana Lima", event: "São Paulo FC vs Corinthians", ticket: "Camarote VIP", value: 850, date: "2025-06-13", status: "pending" },
];
const MOCK_SETTINGS = {
  whatsapp: "5511999990000",
  instagram: "@camaroteresenha",
  facebook: "camaroteresenha",
  tiktok: "@camaroteresenha",
  email: "contato@camaroteresenha.com.br",
  phone: "(11) 9999-0000",
  address: "Praça Roberto Gomes Pedrosa, 1 - Morumbi, São Paulo - SP, 05653-070",
  mapsEmbed: "https://maps.google.com/?q=-23.600,-46.719",
};
const MOCK_GALLERY = [
  { id: "g1", url: "", caption: "Vista do camarote", category: "Espaço" },
  { id: "g2", url: "", caption: "Open bar premium", category: "Gastronomia" },
  { id: "g3", url: "", caption: "Área VIP", category: "Espaço" },
  { id: "g4", url: "", caption: "Jogo ao vivo", category: "Eventos" },
  { id: "g5", url: "", caption: "Gastronomia exclusiva", category: "Gastronomia" },
  { id: "g6", url: "", caption: "Networking premium", category: "Pessoas" },
];

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const G = {
  black: "#0A0A0A",
  gold: "#D4AF37",
  goldLight: "#E8C84A",
  goldDark: "#B8952A",
  white: "#FFFFFF",
  darkBg: "#111111",
  card: "#1A1A1A",
  cardBorder: "#2A2A2A",
  textMuted: "#888888",
  textSub: "#BBBBBB",
};

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #0A0A0A; color: #fff; font-family: 'Outfit', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 3px; }
  .gold { color: #D4AF37; }
  .btn-gold { background: linear-gradient(135deg, #D4AF37, #E8C84A); color: #0A0A0A; border: none; padding: 14px 32px; border-radius: 4px; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 14px; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; gap: 8px; }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,175,55,0.4); background: linear-gradient(135deg, #E8C84A, #D4AF37); }
  .btn-outline { background: transparent; color: #D4AF37; border: 1px solid #D4AF37; padding: 12px 28px; border-radius: 4px; font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; }
  .btn-outline:hover { background: rgba(212,175,55,0.1); }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px,5vw,64px); font-weight: 300; color: #fff; line-height: 1.1; }
  .section-title span { color: #D4AF37; }
  .divider-gold { width: 60px; height: 2px; background: linear-gradient(90deg, #D4AF37, transparent); margin: 20px 0; }
  input, textarea, select { background: #1A1A1A; border: 1px solid #2A2A2A; color: #fff; padding: 10px 14px; border-radius: 4px; font-family: 'Outfit', sans-serif; font-size: 14px; width: 100%; outline: none; transition: border 0.2s; }
  input:focus, textarea:focus, select:focus { border-color: #D4AF37; }
  label { font-size: 12px; color: #888; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; display: block; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .fade-up { animation: fadeUp 0.7s ease forwards; }
  .shimmer { background: linear-gradient(90deg, #1A1A1A 25%, #252525 50%, #1A1A1A 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
  .toast { position: fixed; bottom: 24px; right: 24px; z-index: 9999; padding: 14px 20px; border-radius: 6px; font-size: 14px; font-weight: 500; animation: fadeUp 0.3s ease; max-width: 320px; }
  .toast-success { background: #1a3a1a; border: 1px solid #4ade80; color: #4ade80; }
  .toast-error { background: #3a1a1a; border: 1px solid #f87171; color: #f87171; }
  .tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
  .tag-gold { background: rgba(212,175,55,0.15); color: #D4AF37; border: 1px solid rgba(212,175,55,0.3); }
  .tag-green { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
  .tag-red { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
  .tag-blue { background: rgba(96,165,250,0.1); color: #60a5fa; border: 1px solid rgba(96,165,250,0.3); }
`;

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast toast-${type}`}>{msg}</div>;
}

// ─────────────────────────────────────────────
// LOGO SVG
// ─────────────────────────────────────────────
function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="19" stroke="#D4AF37" strokeWidth="1.5" />
      <path d="M10 24L20 10L30 24H23L20 18L17 24H10Z" fill="#D4AF37" />
      <rect x="13" y="25" width="14" height="2.5" fill="#D4AF37" opacity="0.6" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// PUBLIC WEBSITE
// ─────────────────────────────────────────────
function PublicSite({ onAdminClick }) {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [faqOpen, setFaqOpen] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, []);

  const testimonials = [
    { name: "Ricardo Almeida", role: "Empresário", text: "A experiência mais premium que já tive em um jogo. Open bar impecável, vista privilegiada e atendimento de alto nível. Só recomendo!", stars: 5 },
    { name: "Fernanda Costa", role: "Advogada", text: "Fui no camarote para o show da Ana Castela e foi surreal. A estrutura, a gastronomia, o networking... superou todas as expectativas.", stars: 5 },
    { name: "Bruno Souza", role: "Diretor de Marketing", text: "Já fui 5 vezes e cada evento é melhor que o anterior. O Camarote Resenha Morumbi é uma experiência à parte.", stars: 5 },
    { name: "Mariana Lima", role: "CEO", text: "Levei minha equipe para comemorar uma meta batida. Foi inesquecível. O espaço, a comida, o serviço... absolutamente perfeito.", stars: 5 },
  ];
  const faqs = [
    { q: "O que está incluso no ingresso?", a: "O ingresso inclui acesso ao camarote, open bar completo (drinks premium, cervejas, vinhos, espumantes), open food (gastronomia selecionada), estacionamento e atendimento personalizado." },
    { q: "Como funciona o open bar?", a: "O open bar é 100% liberado durante todo o evento. Você encontrará bartenders exclusivos servindo drinques clássicos e autorais, além de cerveja gelada, vinhos e espumantes nacionais e importados." },
    { q: "Qual é a política de cancelamento?", a: "Cancelamentos com mais de 7 dias de antecedência recebem reembolso integral. Entre 3 e 7 dias, 50% de reembolso. Menos de 72h não há reembolso, mas o ingresso pode ser transferido." },
    { q: "O camarote é coberto?", a: "Sim. O Camarote Resenha Morumbi é totalmente coberto e climatizado, com vista privilegiada para o campo e área lounge interna." },
    { q: "Posso comprar ingresso para meia entrada?", a: "Não. Os ingressos do camarote são de inteira por se tratar de um serviço premium com buffet incluso. Consulte nossas políticas completas." },
    { q: "Como faço para comprar?", a: "Clique em 'Comprar Ingressos' ou entre em contato via WhatsApp. Aceitamos cartões de crédito (até 12x) e Pix." },
  ];
  const benefits = [
    { icon: "🥂", title: "Open Bar Premium", desc: "Cerveja, vinhos, espumantes e drinques exclusivos durante todo o evento." },
    { icon: "🍽️", title: "Open Food", desc: "Buffet completo com gastronomia selecionada e pratos assinados." },
    { icon: "👁️", title: "Vista Privilegiada", desc: "Camarote com a melhor vista do estádio, sem obstáculos." },
    { icon: "✦", title: "Área VIP", desc: "Espaço exclusivo, climatizado e com design sofisticado." },
    { icon: "🤝", title: "Networking", desc: "Ambiente ideal para conectar-se com empresários e líderes." },
    { icon: "⭐", title: "Experiência Premium", desc: "Atendimento personalizado do início ao fim do evento." },
  ];

  const GalleryImgPlaceholder = ({ caption, idx }) => {
    const colors = ["#1c1200", "#0a1a0a", "#0a0a1c", "#1a0a0a", "#001a1a", "#1a001a"];
    return (
      <div onClick={() => setLightbox({ caption, idx })} style={{ position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: "2px", aspectRatio: "4/3", background: colors[idx % colors.length], border: "1px solid #2A2A2A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "transform 0.3s" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.querySelector(".overlay").style.opacity = "1"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.querySelector(".overlay").style.opacity = "0"; }}>
        <div style={{ fontSize: 48, opacity: 0.3 }}>📸</div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 8 }}>{caption}</div>
        <div className="overlay" style={{ position: "absolute", inset: 0, background: "rgba(212,175,55,0.2)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s" }}>
          <div style={{ width: 48, height: 48, border: "2px solid #D4AF37", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔍</div>
        </div>
      </div>
    );
  };

  const navLinks = ["Sobre", "Benefícios", "Eventos", "Galeria", "Depoimentos", "Contato"];

  return (
    <div style={{ background: G.black, minHeight: "100vh" }}>
      {/* ── NAVBAR ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.4s", background: navScrolled ? "rgba(10,10,10,0.97)" : "transparent", borderBottom: navScrolled ? "1px solid #1A1A1A" : "none", backdropFilter: navScrolled ? "blur(20px)" : "none", padding: navScrolled ? "12px 40px" : "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={36} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: G.gold, letterSpacing: 2, lineHeight: 1 }}>RESENHA</div>
            <div style={{ fontSize: 9, color: G.textMuted, letterSpacing: 3, textTransform: "uppercase" }}>Morumbi</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="desktop-nav">
          {navLinks.map(l => (
            <a key={l} href={`#${l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} style={{ color: G.textSub, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = G.gold} onMouseLeave={e => e.target.style.color = G.textSub}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn-gold" style={{ padding: "10px 20px", fontSize: 11 }}>Comprar Ingressos</button>
          <button onClick={onAdminClick} style={{ background: "transparent", border: "1px solid #333", color: "#666", padding: "9px 14px", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>Admin</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #0A0A0A 0%, #111111 100%)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(212,175,55,0.02) 80px, rgba(212,175,55,0.02) 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(212,175,55,0.02) 80px, rgba(212,175,55,0.02) 81px)" }} />
        <div style={{ textAlign: "center", padding: "0 20px", position: "relative", zIndex: 1, animation: "fadeUp 1s ease" }}>
          <div style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}><Logo size={72} /></div>
          <div style={{ fontSize: 11, letterSpacing: 6, color: G.gold, marginBottom: 20, textTransform: "uppercase" }}>Camarote Resenha Morumbi</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 7vw, 96px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 24, color: G.white }}>
            A Experiência Mais<br /><span style={{ color: G.gold, fontStyle: "italic" }}>Exclusiva</span> do Morumbi
          </h1>
          <p style={{ color: G.textMuted, fontSize: 16, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Open bar premium, gastronomia selecionada e a melhor vista do estádio. Cada evento é uma memória que dura para sempre.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-gold" style={{ fontSize: 13, padding: "16px 36px" }}>🎟 Comprar Ingressos</button>
            <button className="btn-outline" onClick={() => document.getElementById("eventos")?.scrollIntoView({ behavior: "smooth" })}>Ver Eventos</button>
          </div>
          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 72, flexWrap: "wrap" }}>
            {[["200+", "Eventos"], ["15K+", "Clientes VIP"], ["5★", "Avaliação"], ["10 Anos", "Tradição"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: G.gold, fontWeight: 600 }}>{n}</div>
                <div style={{ fontSize: 11, color: G.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "pulse 2s infinite" }}>
          <div style={{ fontSize: 11, color: G.textMuted, letterSpacing: 2 }}>SCROLL</div>
          <div style={{ width: 1, height: 40, background: "linear-gradient(180deg, #D4AF37, transparent)" }} />
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section id="sobre" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: G.gold, marginBottom: 16, textTransform: "uppercase" }}>Nossa História</div>
            <h2 className="section-title">Dez Anos de <span>Excelência</span></h2>
            <div className="divider-gold" />
            <p style={{ color: G.textSub, lineHeight: 1.9, marginBottom: 20 }}>O Camarote Resenha Morumbi nasceu em 2015 com um objetivo claro: transformar a experiência de assistir a um jogo de futebol ou show em algo muito além do esperado.</p>
            <p style={{ color: G.textMuted, lineHeight: 1.9, marginBottom: 32 }}>Com espaço projetado para o máximo conforto, atendimento personalizado e uma curadoria gastronômica impecável, nos tornamos referência em entretenimento premium em São Paulo.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[["Fundado em", "2015"], ["Área total", "800m²"], ["Capacidade", "250 pessoas"], ["Parceiros", "50+"]].map(([l, v]) => (
                <div key={l} style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 4, padding: "18px 20px" }}>
                  <div style={{ fontSize: 11, color: G.textMuted, marginBottom: 4, letterSpacing: 1 }}>{l}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: G.gold, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {["Espaço Lounge", "Bar Premium", "Mesa VIP", "Vista Campo"].map((c, i) => (
              <div key={c} style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 2, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, fontSize: 32, color: G.gold, opacity: 0.8 }}>
                {["🛋️", "🍹", "🪑", "⚽"][i]}
                <div style={{ fontSize: 11, color: G.textMuted }}>{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section id="beneficios" style={{ padding: "100px 40px", background: G.darkBg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: G.gold, marginBottom: 16, textTransform: "uppercase" }}>Por que nos escolher</div>
            <h2 className="section-title">Benefícios <span>Exclusivos</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {benefits.map((b) => (
              <div key={b.title} style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 4, padding: "36px 28px", transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = G.gold; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = G.cardBorder; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{b.icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: G.white, marginBottom: 10 }}>{b.title}</div>
                <div style={{ color: G.textMuted, fontSize: 14, lineHeight: 1.7 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTOS ── */}
      <section id="eventos" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: G.gold, marginBottom: 16, textTransform: "uppercase" }}>Próximos Eventos</div>
            <h2 className="section-title">Não Perca <span>Nenhum</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
            {MOCK_EVENTS.map((ev) => {
              const d = new Date(ev.date);
              const day = d.toLocaleDateString("pt-BR", { day: "2-digit" });
              const month = d.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase();
              return (
                <div key={ev.id} style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 6, overflow: "hidden", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = G.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = G.cardBorder; }}>
                  <div style={{ background: "linear-gradient(135deg, #1A1200, #0A0A0A)", height: 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <div style={{ fontSize: 60 }}>⚽</div>
                    <span className="tag tag-gold" style={{ position: "absolute", top: 16, left: 16 }}>{ev.category}</span>
                  </div>
                  <div style={{ padding: "24px 24px 28px" }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
                      <div style={{ textAlign: "center", background: G.black, border: "1px solid " + G.cardBorder, borderRadius: 4, padding: "8px 14px", minWidth: 56 }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: G.gold, lineHeight: 1 }}>{day}</div>
                        <div style={{ fontSize: 10, color: G.textMuted, letterSpacing: 1 }}>{month}</div>
                      </div>
                      <div>
                        <h3 style={{ fontSize: 17, color: G.white, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{ev.name}</h3>
                        <div style={{ fontSize: 12, color: G.textMuted }}>🕐 {ev.time} · 📍 {ev.local}</div>
                      </div>
                    </div>
                    <p style={{ color: G.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>{ev.description}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 11, color: G.textMuted }}>A partir de</div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: G.gold, fontWeight: 600 }}>R$ {ev.value.toLocaleString("pt-BR")}</div>
                      </div>
                      <button className="btn-gold" style={{ padding: "10px 20px", fontSize: 12 }}>Comprar</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GALERIA ── */}
      <section id="galeria" style={{ padding: "100px 40px", background: G.darkBg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: G.gold, marginBottom: 16, textTransform: "uppercase" }}>Galeria</div>
            <h2 className="section-title">Nossa <span>Experiência</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {MOCK_GALLERY.map((item, i) => <GalleryImgPlaceholder key={item.id} caption={item.caption} idx={i} />)}
          </div>
          {lightbox && (
            <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: 40, textAlign: "center", maxWidth: 600 }}>
                <div style={{ fontSize: 80, marginBottom: 20 }}>📸</div>
                <div style={{ color: G.white, fontSize: 18, fontFamily: "'Cormorant Garamond', serif" }}>{lightbox.caption}</div>
                <div style={{ color: G.textMuted, fontSize: 12, marginTop: 12 }}>Clique fora para fechar</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section id="depoimentos" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: G.gold, marginBottom: 16, textTransform: "uppercase" }}>Depoimentos</div>
          <h2 className="section-title" style={{ marginBottom: 60 }}>O Que Dizem <span>Nossos Clientes</span></h2>
          <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: "52px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 20, left: 28, fontFamily: "serif", fontSize: 80, color: G.gold, opacity: 0.15, lineHeight: 1 }}>"</div>
            <div style={{ color: "gold", fontSize: 20, marginBottom: 24 }}>{"★".repeat(testimonials[activeTestimonial].stars)}</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: G.white, lineHeight: 1.7, marginBottom: 32, fontStyle: "italic" }}>
              "{testimonials[activeTestimonial].text}"
            </p>
            <div style={{ borderTop: "1px solid " + G.cardBorder, paddingTop: 24 }}>
              <div style={{ fontWeight: 600, color: G.white }}>{testimonials[activeTestimonial].name}</div>
              <div style={{ fontSize: 12, color: G.textMuted, marginTop: 4 }}>{testimonials[activeTestimonial].role}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 28 : 8, height: 8, borderRadius: 4, background: i === activeTestimonial ? G.gold : "#333", border: "none", cursor: "pointer", transition: "all 0.3s" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCALIZAÇÃO ── */}
      <section id="localizacao" style={{ padding: "100px 40px", background: G.darkBg }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: G.gold, marginBottom: 16, textTransform: "uppercase" }}>Localização</div>
            <h2 className="section-title">Como <span>Chegar</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40, alignItems: "start" }}>
            <div>
              <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 6, padding: 28, marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: G.gold, fontWeight: 600, marginBottom: 16, letterSpacing: 1 }}>📍 ENDEREÇO</div>
                <p style={{ color: G.textSub, fontSize: 15, lineHeight: 1.7 }}>Praça Roberto Gomes Pedrosa, 1<br />Morumbi, São Paulo - SP<br />CEP: 05653-070</p>
              </div>
              <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 6, padding: 28 }}>
                <div style={{ fontSize: 13, color: G.gold, fontWeight: 600, marginBottom: 16, letterSpacing: 1 }}>🚇 TRANSPORTE</div>
                <div style={{ color: G.textMuted, fontSize: 13, lineHeight: 1.9 }}>
                  Metro: Linha 4 (Amarela) - Estação AACD/Servidor<br />
                  Ônibus: 476R, 709R<br />
                  Estacionamento: Disponível no local
                </div>
              </div>
            </div>
            <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 6, overflow: "hidden", height: 360, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: G.textMuted }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>🗺️</div>
                <div style={{ fontSize: 14 }}>Mapa Interativo</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>Praça Roberto Gomes Pedrosa, 1 - Morumbi</div>
                <a href="https://maps.google.com/?q=Praça Roberto Gomes Pedrosa, 1, Morumbi, São Paulo" target="_blank" rel="noreferrer" style={{ color: G.gold, fontSize: 12, marginTop: 16, display: "block" }}>Abrir no Google Maps →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "100px 40px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: G.gold, marginBottom: 16, textTransform: "uppercase" }}>Dúvidas Frequentes</div>
            <h2 className="section-title">Temos as <span>Respostas</span></h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ background: G.card, border: `1px solid ${faqOpen === i ? G.gold : G.cardBorder}`, borderRadius: 4, overflow: "hidden", transition: "border 0.3s" }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", background: "transparent", border: "none", padding: "20px 24px", color: G.white, fontSize: 15, textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Outfit', sans-serif" }}>
                  <span style={{ fontWeight: 500 }}>{f.q}</span>
                  <span style={{ color: G.gold, fontSize: 20, transition: "transform 0.3s", transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                </button>
                {faqOpen === i && <div style={{ padding: "0 24px 20px", color: G.textMuted, fontSize: 14, lineHeight: 1.8 }}>{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section id="contato" style={{ padding: "100px 40px", background: G.darkBg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: G.gold, marginBottom: 16, textTransform: "uppercase" }}>Fale Conosco</div>
            <h2 className="section-title">Entre em <span>Contato</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 60, alignItems: "start" }}>
            <div>
              <p style={{ color: G.textMuted, lineHeight: 1.8, marginBottom: 36 }}>Nossa equipe está pronta para atender você e garantir a melhor experiência no Camarote Resenha Morumbi.</p>
              {[
                { icon: "📱", label: "WhatsApp", value: "(11) 9 9999-0000", href: "https://wa.me/5511999990000" },
                { icon: "📸", label: "Instagram", value: "@camaroteresenha", href: "https://instagram.com/camaroteresenha" },
                { icon: "✉️", label: "E-mail", value: "contato@camaroteresenha.com.br", href: "mailto:contato@camaroteresenha.com.br" },
              ].map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid " + G.cardBorder, textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "0.7"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <div style={{ width: 44, height: 44, background: G.card, border: "1px solid " + G.cardBorder, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: G.textMuted, letterSpacing: 1 }}>{c.label}</div>
                    <div style={{ color: G.white, fontSize: 14, fontWeight: 500 }}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
            <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: 36 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label>Nome</label><input value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} placeholder="Seu nome" /></div>
                <div><label>E-mail</label><input value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} placeholder="seu@email.com" /></div>
              </div>
              <div style={{ marginBottom: 16 }}><label>Telefone</label><input value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))} placeholder="(11) 9 9999-9999" /></div>
              <div style={{ marginBottom: 24 }}><label>Mensagem</label><textarea value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} placeholder="Como podemos ajudar?" rows={4} style={{ resize: "vertical" }} /></div>
              <button className="btn-gold" style={{ width: "100%", justifyContent: "center", padding: "14px" }} onClick={() => { setToast({ msg: "Mensagem enviada! Em breve entraremos em contato.", type: "success" }); setContactForm({ name: "", email: "", phone: "", message: "" }); }}>Enviar Mensagem</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── RODAPÉ ── */}
      <footer style={{ background: "#050505", borderTop: "1px solid " + G.cardBorder, padding: "60px 40px 30px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}><Logo size={32} /><div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: G.gold, fontWeight: 600 }}>Resenha Morumbi</div></div>
              <p style={{ color: G.textMuted, fontSize: 13, lineHeight: 1.8 }}>O camarote mais exclusivo de São Paulo. Uma experiência premium para quem valoriza o melhor em entretenimento esportivo.</p>
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {["📸", "📘", "▶️", "🎵"].map((ic, i) => (
                  <div key={i} style={{ width: 36, height: 36, background: G.card, border: "1px solid " + G.cardBorder, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = G.gold} onMouseLeave={e => e.currentTarget.style.borderColor = G.cardBorder}>{ic}</div>
                ))}
              </div>
            </div>
            {[
              { title: "Links Rápidos", items: ["Sobre", "Eventos", "Benefícios", "Galeria", "Contato"] },
              { title: "Políticas", items: ["Cancelamento", "Privacidade", "Termos de Uso", "Cookies"] },
              { title: "Contato", items: ["(11) 9 9999-0000", "@camaroteresenha", "contato@camaroteresenha.com.br"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 12, color: G.gold, fontWeight: 600, letterSpacing: 2, marginBottom: 20, textTransform: "uppercase" }}>{col.title}</div>
                {col.items.map(item => <div key={item} style={{ color: G.textMuted, fontSize: 13, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = G.white} onMouseLeave={e => e.target.style.color = G.textMuted}>{item}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid " + G.cardBorder, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ color: G.textMuted, fontSize: 12 }}>© 2025 Camarote Resenha Morumbi. Todos os direitos reservados.</div>
            <div style={{ color: G.textMuted, fontSize: 12 }}>Desenvolvido com ❤️ para a melhor experiência</div>
          </div>
        </div>
      </footer>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────
function AdminLogin({ onLogin, onBack }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState("login"); // login | recover

  const handleLogin = () => {
    setErr("");
    if (!form.email || !form.password) { setErr("Preencha todos os campos."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (form.email === "admin@resenha.com" && form.password === "admin123") onLogin({ name: "Administrador", email: form.email, role: "admin" });
      else setErr("E-mail ou senha incorretos. Tente: admin@resenha.com / admin123");
    }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: G.black, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Logo size={56} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: G.white, marginTop: 16, marginBottom: 6 }}>Painel Administrativo</div>
          <div style={{ fontSize: 12, color: G.textMuted, letterSpacing: 1 }}>Camarote Resenha Morumbi</div>
        </div>
        <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: "36px 32px" }}>
          {mode === "login" ? (
            <>
              <div style={{ marginBottom: 16 }}><label>E-mail</label><input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="admin@resenha.com" type="email" /></div>
              <div style={{ marginBottom: 20 }}><label>Senha</label><input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" type="password" onKeyDown={e => e.key === "Enter" && handleLogin()} /></div>
              {err && <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "10px 14px", borderRadius: 4, fontSize: 13, marginBottom: 16 }}>{err}</div>}
              <button className="btn-gold" style={{ width: "100%", justifyContent: "center", padding: 14 }} onClick={handleLogin} disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
              <button onClick={() => setMode("recover")} style={{ background: "none", border: "none", color: G.textMuted, fontSize: 12, cursor: "pointer", marginTop: 16, width: "100%", textAlign: "center" }}>Esqueci minha senha</button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 8, color: G.white, fontSize: 15, fontWeight: 500 }}>Recuperar Senha</div>
              <div style={{ marginBottom: 20, color: G.textMuted, fontSize: 13 }}>Informe seu e-mail para receber o link.</div>
              <div style={{ marginBottom: 16 }}><label>E-mail</label><input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="seu@email.com" /></div>
              <button className="btn-gold" style={{ width: "100%", justifyContent: "center", padding: 14 }} onClick={() => { alert("E-mail de recuperação enviado (simulação)."); setMode("login"); }}>Enviar Link</button>
              <button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: G.textMuted, fontSize: 12, cursor: "pointer", marginTop: 16, width: "100%", textAlign: "center" }}>← Voltar</button>
            </>
          )}
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", color: G.textMuted, fontSize: 12, cursor: "pointer", marginTop: 20, width: "100%", textAlign: "center" }}>← Voltar ao site</button>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "#444" }}>Demo: admin@resenha.com / admin123</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────
function AdminPanel({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => setToast({ msg, type });

  // State for each section
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [customers] = useState(MOCK_CUSTOMERS);
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [settings, setSettings] = useState(MOCK_SETTINGS);
  const [gallery, setGallery] = useState(MOCK_GALLERY);
  const [sales] = useState(MOCK_SALES);

  // Modal state
  const [modal, setModal] = useState(null); // { type, data }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "events", label: "Eventos", icon: "🎪" },
    { id: "tickets", label: "Ingressos", icon: "🎟" },
    { id: "customers", label: "Clientes", icon: "👥" },
    { id: "coupons", label: "Cupons", icon: "🏷" },
    { id: "gallery", label: "Galeria", icon: "🖼" },
    { id: "location", label: "Localização", icon: "📍" },
    { id: "settings", label: "Configurações", icon: "⚙️" },
    { id: "users", label: "Usuários", icon: "🔑" },
    { id: "reports", label: "Relatórios", icon: "📈" },
  ];

  const totalRevenue = sales.filter(s => s.status === "confirmed").reduce((a, s) => a + s.value, 0);
  const totalSold = tickets.reduce((a, t) => a + t.sold, 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0D0D0D", fontFamily: "'Outfit', sans-serif" }}>
      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? 240 : 64, background: G.card, borderRight: "1px solid " + G.cardBorder, transition: "width 0.3s", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid " + G.cardBorder, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setSidebarOpen(p => !p)}>
          <Logo size={28} />
          {sidebarOpen && <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: G.gold, fontWeight: 600, letterSpacing: 1, lineHeight: 1 }}>RESENHA</div>
            <div style={{ fontSize: 9, color: G.textMuted, letterSpacing: 2 }}>MORUMBI</div>
          </div>}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{ width: "100%", background: page === item.id ? "rgba(212,175,55,0.1)" : "transparent", border: page === item.id ? "1px solid rgba(212,175,55,0.3)" : "1px solid transparent", color: page === item.id ? G.gold : G.textMuted, padding: "10px 12px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 4, textAlign: "left", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: page === item.id ? 600 : 400, transition: "all 0.2s", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 8px", borderTop: "1px solid " + G.cardBorder }}>
          <button onClick={onLogout} style={{ width: "100%", background: "transparent", border: "1px solid #333", color: G.textMuted, padding: "10px 12px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: "'Outfit', sans-serif", fontSize: 13, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = G.textMuted; }}>
            <span>🚪</span>{sidebarOpen && "Sair"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {/* TOPBAR */}
        <div style={{ background: G.card, borderBottom: "1px solid " + G.cardBorder, padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
          <div>
            <div style={{ fontWeight: 600, color: G.white, fontSize: 16 }}>{navItems.find(n => n.id === page)?.icon} {navItems.find(n => n.id === page)?.label}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
            <div style={{ background: "#1A1A1A", border: "1px solid " + G.cardBorder, borderRadius: 6, padding: "8px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: G.gold, fontWeight: 600 }}>A</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: G.white }}>{user.name}</div>
                <div style={{ fontSize: 10, color: G.textMuted }}>Administrador</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 28 }}>
          {page === "dashboard" && <AdminDashboard totalRevenue={totalRevenue} totalSold={totalSold} events={events} customers={customers} sales={sales} />}
          {page === "events" && <AdminEvents events={events} setEvents={setEvents} showToast={showToast} />}
          {page === "tickets" && <AdminTickets tickets={tickets} setTickets={setTickets} events={events} showToast={showToast} />}
          {page === "customers" && <AdminCustomers customers={customers} />}
          {page === "coupons" && <AdminCoupons coupons={coupons} setCoupons={setCoupons} showToast={showToast} />}
          {page === "gallery" && <AdminGallery gallery={gallery} setGallery={setGallery} showToast={showToast} />}
          {page === "location" && <AdminLocation settings={settings} setSettings={setSettings} showToast={showToast} />}
          {page === "settings" && <AdminSettings settings={settings} setSettings={setSettings} showToast={showToast} />}
          {page === "users" && <AdminUsers />}
          {page === "reports" && <AdminReports sales={sales} events={events} tickets={tickets} />}
        </div>
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── DASHBOARD ──
function AdminDashboard({ totalRevenue, totalSold, events, customers, sales }) {
  const stats = [
    { label: "Receita Total", value: `R$ ${totalRevenue.toLocaleString("pt-BR")}`, icon: "💰", color: G.gold },
    { label: "Ingressos Vendidos", value: totalSold, icon: "🎟", color: "#60a5fa" },
    { label: "Eventos Ativos", value: events.filter(e => e.status === "active").length, icon: "🎪", color: "#4ade80" },
    { label: "Clientes", value: customers.length, icon: "👥", color: "#c084fc" },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: "24px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, color: G.textMuted, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>{s.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: s.color, fontWeight: 600 }}>{s.value}</div>
              </div>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: 24 }}>
          <div style={{ fontWeight: 600, color: G.white, marginBottom: 20, fontSize: 14 }}>Últimas Vendas</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ borderBottom: "1px solid " + G.cardBorder }}>
              {["Cliente", "Evento", "Valor", "Status"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 0", color: G.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 }}>{h}</th>)}
            </tr></thead>
            <tbody>{sales.slice(0, 6).map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid rgba(42,42,42,0.5)" }}>
                <td style={{ padding: "12px 0", color: G.white }}>{s.customer}</td>
                <td style={{ padding: "12px 0", color: G.textMuted, fontSize: 12 }}>{s.event}</td>
                <td style={{ padding: "12px 0", color: G.gold, fontWeight: 600 }}>R$ {s.value.toLocaleString("pt-BR")}</td>
                <td style={{ padding: "12px 0" }}><span className={`tag ${s.status === "confirmed" ? "tag-green" : "tag-blue"}`}>{s.status === "confirmed" ? "Confirmado" : "Pendente"}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: 24 }}>
          <div style={{ fontWeight: 600, color: G.white, marginBottom: 20, fontSize: 14 }}>Eventos</div>
          {events.map(ev => {
            const tks = MOCK_TICKETS.filter(t => t.eventId === ev.id);
            const sold = tks.reduce((a, t) => a + t.sold, 0);
            const total = tks.reduce((a, t) => a + t.qty, 0);
            const pct = total ? Math.round((sold / total) * 100) : 0;
            return (
              <div key={ev.id} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontSize: 13, color: G.white, fontWeight: 500 }}>{ev.name}</div>
                  <div style={{ fontSize: 12, color: G.textMuted }}>{sold}/{total}</div>
                </div>
                <div style={{ height: 6, background: "#222", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: `linear-gradient(90deg, ${G.gold}, ${G.goldLight})`, borderRadius: 3, transition: "width 0.5s" }} />
                </div>
                <div style={{ fontSize: 11, color: G.textMuted, marginTop: 4 }}>{pct}% vendido</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── EVENTS ──
function AdminEvents({ events, setEvents, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const empty = { name: "", description: "", date: "", time: "", local: "", value: "", status: "active", category: "Futebol" };
  const [form, setForm] = useState(empty);

  const openNew = () => { setForm(empty); setEditItem(null); setShowForm(true); };
  const openEdit = (ev) => { setForm({ ...ev }); setEditItem(ev.id); setShowForm(true); };
  const save = () => {
    if (!form.name) { showToast("Nome é obrigatório.", "error"); return; }
    if (editItem) setEvents(p => p.map(e => e.id === editItem ? { ...form, id: editItem } : e));
    else setEvents(p => [...p, { ...form, id: Date.now().toString() }]);
    showToast(editItem ? "Evento atualizado!" : "Evento criado!"); setShowForm(false);
  };
  const del = (id) => { if (window.confirm("Excluir este evento?")) { setEvents(p => p.filter(e => e.id !== id)); showToast("Evento excluído."); } };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ color: G.textMuted, fontSize: 13 }}>{events.length} evento(s)</div>
        <button className="btn-gold" onClick={openNew} style={{ padding: "10px 20px", fontSize: 12 }}>+ Novo Evento</button>
      </div>
      {showForm && (
        <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: 28, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, color: G.white, marginBottom: 20 }}>{editItem ? "Editar Evento" : "Novo Evento"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div><label>Nome do Evento</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: São Paulo FC vs Corinthians" /></div>
            <div><label>Categoria</label><select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}><option>Futebol</option><option>Show</option><option>Outros</option></select></div>
            <div><label>Data</label><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
            <div><label>Horário</label><input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} /></div>
            <div><label>Local</label><input value={form.local} onChange={e => setForm(p => ({ ...p, local: e.target.value }))} placeholder="Ex: Allianz Parque" /></div>
            <div><label>Valor (R$)</label><input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="850" /></div>
          </div>
          <div style={{ marginBottom: 16 }}><label>Descrição</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
          <div style={{ marginBottom: 20 }}><label>Status</label><select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}><option value="active">Ativo</option><option value="draft">Rascunho</option><option value="finished">Encerrado</option></select></div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-gold" onClick={save} style={{ padding: "10px 24px", fontSize: 13 }}>Salvar</button>
            <button className="btn-outline" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", fontSize: 13 }}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={{ display: "grid", gap: 12 }}>
        {events.map(ev => (
          <div key={ev.id} style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, background: G.black, border: "1px solid " + G.cardBorder, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚽</div>
              <div>
                <div style={{ color: G.white, fontWeight: 600, marginBottom: 4 }}>{ev.name}</div>
                <div style={{ fontSize: 12, color: G.textMuted }}>📅 {ev.date} · 🕐 {ev.time} · 📍 {ev.local} · R$ {Number(ev.value).toLocaleString("pt-BR")}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className={`tag ${ev.status === "active" ? "tag-green" : ev.status === "draft" ? "tag-blue" : "tag-red"}`}>{ev.status === "active" ? "Ativo" : ev.status === "draft" ? "Rascunho" : "Encerrado"}</span>
              <button onClick={() => openEdit(ev)} style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", color: G.gold, padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>Editar</button>
              <button onClick={() => del(ev.id)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TICKETS ──
function AdminTickets({ tickets, setTickets, events, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const empty = { eventId: events[0]?.id || "", type: "VIP", name: "", value: "", qty: "", sold: 0, lote: "1º Lote", status: "active" };
  const [form, setForm] = useState(empty);

  const save = () => {
    if (!form.name || !form.value) { showToast("Preencha os campos obrigatórios.", "error"); return; }
    if (editItem) setTickets(p => p.map(t => t.id === editItem ? { ...form, id: editItem } : t));
    else setTickets(p => [...p, { ...form, id: Date.now().toString(), sold: 0 }]);
    showToast(editItem ? "Ingresso atualizado!" : "Ingresso criado!"); setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ color: G.textMuted, fontSize: 13 }}>{tickets.length} lote(s)</div>
        <button className="btn-gold" onClick={() => { setForm(empty); setEditItem(null); setShowForm(true); }} style={{ padding: "10px 20px", fontSize: 12 }}>+ Novo Lote</button>
      </div>
      {showForm && (
        <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: 28, marginBottom: 24 }}>
          <div style={{ fontWeight: 600, color: G.white, marginBottom: 20 }}>Novo Lote de Ingressos</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div><label>Evento</label><select value={form.eventId} onChange={e => setForm(p => ({ ...p, eventId: e.target.value }))}>{events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}</select></div>
            <div><label>Tipo</label><select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}><option>VIP</option><option>PREMIUM</option><option>STANDARD</option></select></div>
            <div><label>Nome do Ingresso</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Camarote VIP" /></div>
            <div><label>Valor (R$)</label><input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="850" /></div>
            <div><label>Quantidade</label><input type="number" value={form.qty} onChange={e => setForm(p => ({ ...p, qty: e.target.value }))} placeholder="100" /></div>
            <div><label>Lote</label><select value={form.lote} onChange={e => setForm(p => ({ ...p, lote: e.target.value }))}><option>1º Lote</option><option>2º Lote</option><option>3º Lote</option></select></div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-gold" onClick={save} style={{ padding: "10px 24px", fontSize: 13 }}>Salvar</button>
            <button className="btn-outline" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", fontSize: 13 }}>Cancelar</button>
          </div>
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ background: "#141414" }}>
          {["Evento", "Nome", "Tipo", "Valor", "Vendidos/Total", "Lote", "Status", "Ações"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: G.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, borderBottom: "1px solid " + G.cardBorder }}>{h}</th>)}
        </tr></thead>
        <tbody>{tickets.map(t => {
          const ev = events.find(e => e.id === t.eventId);
          const pct = Math.round((t.sold / Number(t.qty || 1)) * 100);
          return (
            <tr key={t.id} style={{ borderBottom: "1px solid rgba(42,42,42,0.5)" }}>
              <td style={{ padding: "14px 16px", color: G.textMuted, fontSize: 12 }}>{ev?.name || "–"}</td>
              <td style={{ padding: "14px 16px", color: G.white, fontWeight: 500 }}>{t.name}</td>
              <td style={{ padding: "14px 16px" }}><span className="tag tag-gold">{t.type}</span></td>
              <td style={{ padding: "14px 16px", color: G.gold, fontWeight: 600 }}>R$ {Number(t.value).toLocaleString("pt-BR")}</td>
              <td style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 80, height: 5, background: "#222", borderRadius: 3 }}><div style={{ height: "100%", width: pct + "%", background: G.gold, borderRadius: 3 }} /></div>
                  <span style={{ color: G.textMuted }}>{t.sold}/{t.qty}</span>
                </div>
              </td>
              <td style={{ padding: "14px 16px", color: G.textMuted }}>{t.lote}</td>
              <td style={{ padding: "14px 16px" }}><span className={`tag ${t.status === "active" ? "tag-green" : "tag-red"}`}>{t.status === "active" ? "Ativo" : "Encerrado"}</span></td>
              <td style={{ padding: "14px 16px" }}>
                <button onClick={() => { setForm({ ...t }); setEditItem(t.id); setShowForm(true); }} style={{ background: "transparent", border: "none", color: G.gold, cursor: "pointer", fontSize: 12 }}>Editar</button>
              </td>
            </tr>
          );
        })}</tbody>
      </table>
    </div>
  );
}

// ── CUSTOMERS ──
function AdminCustomers({ customers }) {
  const [search, setSearch] = useState("");
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ marginBottom: 20 }}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar cliente..." style={{ maxWidth: 360 }} /></div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead><tr style={{ background: "#141414" }}>
          {["Nome", "E-mail", "Telefone", "Compras", "Total Gasto"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: G.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, borderBottom: "1px solid " + G.cardBorder }}>{h}</th>)}
        </tr></thead>
        <tbody>{filtered.map(c => (
          <tr key={c.id} style={{ borderBottom: "1px solid rgba(42,42,42,0.5)" }}>
            <td style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: G.gold, fontWeight: 600 }}>{c.name[0]}</div>
                <span style={{ color: G.white, fontWeight: 500 }}>{c.name}</span>
              </div>
            </td>
            <td style={{ padding: "14px 16px", color: G.textMuted }}>{c.email}</td>
            <td style={{ padding: "14px 16px", color: G.textMuted }}>{c.phone}</td>
            <td style={{ padding: "14px 16px", color: G.white }}>{c.purchases}x</td>
            <td style={{ padding: "14px 16px", color: G.gold, fontWeight: 600 }}>R$ {c.total.toLocaleString("pt-BR")}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ── COUPONS ──
function AdminCoupons({ coupons, setCoupons, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const empty = { code: "", discount: "", type: "percent", limit: "", expiry: "", status: "active", used: 0 };
  const [form, setForm] = useState(empty);
  const save = () => {
    if (!form.code || !form.discount) { showToast("Código e desconto são obrigatórios.", "error"); return; }
    setCoupons(p => [...p, { ...form, id: Date.now().toString(), used: 0 }]);
    showToast("Cupom criado!"); setShowForm(false); setForm(empty);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ color: G.textMuted, fontSize: 13 }}>{coupons.length} cupom(ns)</div>
        <button className="btn-gold" onClick={() => setShowForm(p => !p)} style={{ padding: "10px 20px", fontSize: 12 }}>+ Novo Cupom</button>
      </div>
      {showForm && (
        <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: 28, marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div><label>Código</label><input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="VIPMORUMBI10" /></div>
            <div><label>Tipo</label><select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}><option value="percent">Percentual (%)</option><option value="fixed">Fixo (R$)</option></select></div>
            <div><label>Desconto</label><input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} placeholder={form.type === "percent" ? "10" : "100"} /></div>
            <div><label>Limite de Uso</label><input type="number" value={form.limit} onChange={e => setForm(p => ({ ...p, limit: e.target.value }))} placeholder="50" /></div>
            <div><label>Validade</label><input type="date" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))} /></div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-gold" onClick={save} style={{ padding: "10px 24px", fontSize: 13 }}>Criar Cupom</button>
            <button className="btn-outline" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", fontSize: 13 }}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={{ display: "grid", gap: 12 }}>
        {coupons.map(cp => (
          <div key={cp.id} style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ background: "rgba(212,175,55,0.1)", border: "1px dashed rgba(212,175,55,0.4)", borderRadius: 4, padding: "8px 16px", fontFamily: "monospace", color: G.gold, fontWeight: 700, fontSize: 15, letterSpacing: 2 }}>{cp.code}</div>
              <div>
                <div style={{ color: G.white, fontWeight: 600, marginBottom: 4 }}>{cp.type === "percent" ? `${cp.discount}% de desconto` : `R$ ${cp.discount} de desconto`}</div>
                <div style={{ fontSize: 12, color: G.textMuted }}>Usado: {cp.used}/{cp.limit} · Válido até: {cp.expiry}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span className={`tag ${cp.status === "active" ? "tag-green" : "tag-red"}`}>{cp.status === "active" ? "Ativo" : "Inativo"}</span>
              <button onClick={() => { setCoupons(p => p.filter(c => c.id !== cp.id)); showToast("Cupom excluído."); }} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GALLERY ──
function AdminGallery({ gallery, setGallery, showToast }) {
  const [dragging, setDragging] = useState(false);
  const [caption, setCaption] = useState("");
  const addPhoto = () => {
    if (!caption) { showToast("Adicione uma legenda.", "error"); return; }
    setGallery(p => [...p, { id: Date.now().toString(), url: "", caption, category: "Espaço" }]);
    showToast("Foto adicionada!"); setCaption("");
  };
  return (
    <div>
      <div style={{ background: G.card, border: dragging ? "2px dashed " + G.gold : "2px dashed #333", borderRadius: 8, padding: "40px", textAlign: "center", marginBottom: 24, transition: "border 0.2s", cursor: "pointer" }}
        onDragEnter={() => setDragging(true)} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); showToast("Upload simulado com sucesso!"); }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📤</div>
        <div style={{ color: G.white, fontWeight: 500, marginBottom: 8 }}>Arraste fotos aqui</div>
        <div style={{ color: G.textMuted, fontSize: 13 }}>ou clique para selecionar (simulado)</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Legenda da foto" style={{ flex: 1 }} />
        <button className="btn-gold" onClick={addPhoto} style={{ padding: "10px 20px", fontSize: 12, whiteSpace: "nowrap" }}>Adicionar</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {gallery.map((item, i) => (
          <div key={item.id} style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ aspectRatio: "4/3", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>📸</div>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontSize: 12, color: G.textSub, marginBottom: 8 }}>{item.caption}</div>
              <button onClick={() => { setGallery(p => p.filter(g => g.id !== item.id)); showToast("Removida."); }} style={{ background: "transparent", border: "none", color: "#f87171", fontSize: 11, cursor: "pointer" }}>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LOCATION ──
function AdminLocation({ settings, setSettings, showToast }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: 28 }}>
        <div style={{ marginBottom: 16 }}><label>Endereço Completo</label><input value={settings.address} onChange={e => setSettings(p => ({ ...p, address: e.target.value }))} /></div>
        <div style={{ marginBottom: 16 }}><label>Link do Google Maps</label><input value={settings.mapsEmbed} onChange={e => setSettings(p => ({ ...p, mapsEmbed: e.target.value }))} placeholder="https://maps.google.com/..." /></div>
        <button className="btn-gold" onClick={() => showToast("Localização salva!")} style={{ padding: "11px 24px", fontSize: 13 }}>Salvar</button>
      </div>
    </div>
  );
}

// ── SETTINGS ──
function AdminSettings({ settings, setSettings, showToast }) {
  const fields = [
    { key: "whatsapp", label: "WhatsApp (com DDI)", placeholder: "5511999990000" },
    { key: "instagram", label: "Instagram", placeholder: "@camaroteresenha" },
    { key: "facebook", label: "Facebook", placeholder: "camaroteresenha" },
    { key: "tiktok", label: "TikTok", placeholder: "@camaroteresenha" },
    { key: "email", label: "E-mail", placeholder: "contato@email.com.br" },
    { key: "phone", label: "Telefone", placeholder: "(11) 9999-0000" },
  ];
  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: 28 }}>
        <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
          {fields.map(f => <div key={f.key}><label>{f.label}</label><input value={settings[f.key] || ""} onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} /></div>)}
        </div>
        <button className="btn-gold" onClick={() => showToast("Configurações salvas!")} style={{ padding: "11px 24px", fontSize: 13 }}>Salvar Configurações</button>
      </div>
    </div>
  );
}

// ── USERS ──
function AdminUsers() {
  const users = [
    { id: "u1", name: "Administrador", email: "admin@resenha.com", role: "admin", status: "active" },
    { id: "u2", name: "Operador Padrão", email: "operador@resenha.com", role: "operator", status: "active" },
    { id: "u3", name: "Editor de Conteúdo", email: "editor@resenha.com", role: "editor", status: "active" },
  ];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ color: G.textMuted, fontSize: 13 }}>{users.length} usuário(s)</div>
        <button className="btn-gold" style={{ padding: "10px 20px", fontSize: 12 }}>+ Novo Usuário</button>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {users.map(u => (
          <div key={u.id} style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: G.gold, fontWeight: 700 }}>{u.name[0]}</div>
              <div>
                <div style={{ color: G.white, fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: G.textMuted }}>{u.email}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span className={`tag ${u.role === "admin" ? "tag-gold" : u.role === "operator" ? "tag-blue" : "tag-green"}`}>{u.role === "admin" ? "Admin" : u.role === "operator" ? "Operador" : "Editor"}</span>
              <span className="tag tag-green">Ativo</span>
              <button style={{ background: "transparent", border: "1px solid #333", color: G.textMuted, padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── REPORTS ──
function AdminReports({ sales, events, tickets }) {
  const totalRev = sales.filter(s => s.status === "confirmed").reduce((a, s) => a + s.value, 0);
  const totalSold = tickets.reduce((a, t) => a + t.sold, 0);
  const confirmed = sales.filter(s => s.status === "confirmed").length;
  const pending = sales.filter(s => s.status === "pending").length;

  const downloadCSV = () => {
    const rows = [["Cliente", "Evento", "Ingresso", "Valor", "Data", "Status"], ...sales.map(s => [s.customer, s.event, s.ticket, s.value, s.date, s.status])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "relatorio-vendas.csv"; a.click();
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Receita Confirmada", value: `R$ ${totalRev.toLocaleString("pt-BR")}`, color: G.gold },
          { label: "Ingressos Vendidos", value: totalSold, color: "#60a5fa" },
          { label: "Vendas Confirmadas", value: confirmed, color: "#4ade80" },
          { label: "Vendas Pendentes", value: pending, color: "#fbbf24" },
        ].map(s => (
          <div key={s.label} style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: "24px 20px" }}>
            <div style={{ fontSize: 11, color: G.textMuted, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: s.color, fontWeight: 600 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button className="btn-gold" onClick={downloadCSV} style={{ padding: "10px 20px", fontSize: 13 }}>⬇ Exportar CSV</button>
        <button className="btn-outline" onClick={() => window.print()} style={{ padding: "10px 20px", fontSize: 13 }}>🖨 Imprimir PDF</button>
      </div>
      <div style={{ background: G.card, border: "1px solid " + G.cardBorder, borderRadius: 8, padding: 24 }}>
        <div style={{ fontWeight: 600, color: G.white, marginBottom: 20 }}>Todas as Vendas</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "#141414" }}>
            {["Cliente", "Evento", "Ingresso", "Valor", "Data", "Status"].map(h => <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: G.textMuted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, borderBottom: "1px solid " + G.cardBorder }}>{h}</th>)}
          </tr></thead>
          <tbody>{sales.map(s => (
            <tr key={s.id} style={{ borderBottom: "1px solid rgba(42,42,42,0.5)" }}>
              <td style={{ padding: "12px 16px", color: G.white }}>{s.customer}</td>
              <td style={{ padding: "12px 16px", color: G.textMuted, fontSize: 12 }}>{s.event}</td>
              <td style={{ padding: "12px 16px", color: G.textMuted, fontSize: 12 }}>{s.ticket}</td>
              <td style={{ padding: "12px 16px", color: G.gold, fontWeight: 600 }}>R$ {s.value.toLocaleString("pt-BR")}</td>
              <td style={{ padding: "12px 16px", color: G.textMuted }}>{s.date}</td>
              <td style={{ padding: "12px 16px" }}><span className={`tag ${s.status === "confirmed" ? "tag-green" : "tag-blue"}`}>{s.status === "confirmed" ? "Confirmado" : "Pendente"}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("site"); // site | adminLogin | admin
  const [adminUser, setAdminUser] = useState(null);

  const handleLogin = (user) => { setAdminUser(user); setView("admin"); };
  const handleLogout = () => { setAdminUser(null); setView("site"); };

  return (
    <>
      <style>{globalStyle}</style>
      {view === "site" && <PublicSite onAdminClick={() => setView("adminLogin")} />}
      {view === "adminLogin" && <AdminLogin onLogin={handleLogin} onBack={() => setView("site")} />}
      {view === "admin" && adminUser && <AdminPanel user={adminUser} onLogout={handleLogout} />}
    </>
  );
}
