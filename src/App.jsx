import { useState, useEffect, useRef } from "react";

// ─── THEME COLORS ───────────────────────────────────────────────
const C = {
  red: "#E8002A",
  redDark: "#B0001F",
  redGlow: "rgba(232,0,42,0.18)",
  bg: "#0A0A0A",
  bg2: "#111111",
  bg3: "#181818",
  card: "#141414",
  border: "rgba(255,255,255,0.07)",
  borderHot: "rgba(232,0,42,0.4)",
  text: "#F5F5F5",
  muted: "#888",
  gold: "#D4AF37",
};

// ─── GLOBAL STYLES ───────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,600;0,700;1,300&family=Barlow+Condensed:wght@300;400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'Barlow', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.red}; border-radius: 2px; }
  ::selection { background: ${C.red}; color: #fff; }
  input, select, textarea { font-family: 'Barlow', sans-serif; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; font-family: 'Barlow', sans-serif; }
  .fade-in { animation: fadeInUp 0.7s ease forwards; }
  @keyframes fadeInUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 ${C.redGlow}; } 50% { box-shadow: 0 0 0 12px transparent; } }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes barFill { from{width:0} to{width:var(--w)} }
  @keyframes countUp { from{opacity:0} to{opacity:1} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
`;

// ─── UTILITY HOOKS ───────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useCountUp(target, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────
function RedLine({ w = 60 }) {
  return <div style={{ width: w, height: 3, background: C.red, borderRadius: 2, margin: "12px 0 20px" }} />;
}

function Tag({ children }) {
  return (
    <span style={{ display:"inline-block", padding:"4px 14px", border:`1px solid ${C.red}`, color:C.red, fontSize:11, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:3, textTransform:"uppercase", borderRadius:2, marginBottom:10 }}>
      {children}
    </span>
  );
}

function Btn({ children, variant="primary", onClick, style={} }) {
  const base = { padding:"14px 32px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, letterSpacing:3, textTransform:"uppercase", fontWeight:700, border:"none", borderRadius:2, cursor:"pointer", transition:"all 0.25s", ...style };
  if (variant === "primary") return (
    <button onClick={onClick} style={{ ...base, background:C.red, color:"#fff" }}
      onMouseEnter={e=>e.target.style.background=C.redDark}
      onMouseLeave={e=>e.target.style.background=C.red}>
      {children}
    </button>
  );
  return (
    <button onClick={onClick} style={{ ...base, background:"transparent", color:C.text, border:`1px solid rgba(255,255,255,0.25)` }}
      onMouseEnter={e=>e.target.style.borderColor=C.red}
      onMouseLeave={e=>e.target.style.borderColor="rgba(255,255,255,0.25)"}>
      {children}
    </button>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────
function Navbar({ page, setPage, darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { label:"About", section:"about" },
    { label:"Transformations", section:"transformations" },
    { label:"Programs", section:"programs" },
    { label:"Gallery", section:"gallery" },
    { label:"Contact", section:"contact" },
  ];
  const tools = [
    { label:"BMI", p:"bmi" },
    { label:"BMR", p:"bmr" },
       { label:"Heart Rate Zones", p:"heartrate" },
    { label:"Ideal Weight", p:"idealweight" },
    { label:"Workout Planner", p:"workout" },
    { label:"Diet Plan", p:"diet" },
  
  ];
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, transition:"all 0.3s",
      background: scrolled ? "rgba(10,10,10,0.96)" : "transparent",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      backdropFilter: scrolled ? "blur(20px)" : "none", padding:"0 4vw" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:70 }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:4, color:C.text, cursor:"pointer" }}
          onClick={()=>setPage("home")}>
          <span style={{ color:C.red }}>IRON</span>WILL
        </div>
        <div style={{ display:"flex", gap:28, alignItems:"center" }} className="desktop-nav">
          {links.map(l => (
            <a key={l.label} href={`#${l.section}`} onClick={()=>setPage("home")}
              style={{ fontSize:12, letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif", textTransform:"uppercase", color:C.muted, transition:"color 0.2s" }}
              onMouseEnter={e=>e.target.style.color=C.text}
              onMouseLeave={e=>e.target.style.color=C.muted}>
              {l.label}
            </a>
          ))}
          <div style={{ position:"relative", display:"inline-block" }}
            onMouseEnter={e=>e.currentTarget.querySelector(".dropdown").style.display="block"}
            onMouseLeave={e=>e.currentTarget.querySelector(".dropdown").style.display="none"}>
            <span style={{ fontSize:12, letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif", textTransform:"uppercase", color:C.red, cursor:"pointer" }}>
              Tools ▾
            </span>
            <div className="dropdown" style={{ display:"none", position:"absolute", top:"100%", left:0, background:C.bg3, border:`1px solid ${C.border}`, borderRadius:4, minWidth:160, overflow:"hidden" }}>
              {tools.map(t => (
                <div key={t.p} onClick={()=>setPage(t.p)}
                  style={{ padding:"10px 18px", fontSize:13, cursor:"pointer", color:C.muted, transition:"all 0.2s", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}
                  onMouseEnter={e=>{e.currentTarget.style.color=C.text;e.currentTarget.style.background=C.bg2}}
                  onMouseLeave={e=>{e.currentTarget.style.color=C.muted;e.currentTarget.style.background="transparent"}}>
                  {t.label}
                </div>
              ))}
            </div>
          </div>
          <Btn onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"10px 22px", fontSize:12 }}>
            Free Consult
          </Btn>
        </div>
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{ display:"none", background:"none", border:"none", color:C.text, fontSize:22 }} className="mobile-menu-btn">☰</button>
      </div>
      {menuOpen && (
        <div style={{ background:C.bg3, borderTop:`1px solid ${C.border}`, padding:"20px 4vw" }}>
          {links.map(l => (
            <div key={l.label} style={{ padding:"12px 0", fontSize:14, letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif", textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>
              <a href={`#${l.section}`} onClick={()=>{setPage("home");setMenuOpen(false)}} style={{ color:C.muted }}>{l.label}</a>
            </div>
          ))}
          {tools.map(t => (
            <div key={t.p} style={{ padding:"12px 0", fontSize:14, letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif", textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}
              onClick={()=>{setPage(t.p);setMenuOpen(false)}}>
              <span style={{ color:C.red }}>{t.label}</span>
            </div>
          ))}
        </div>
      )}
      <style>{`@media(max-width:768px){.desktop-nav{display:none!important}.mobile-menu-btn{display:block!important}}`}</style>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────
function StatCounter({ value, label, suffix="" }) {
  const [ref, vis] = useInView();
  const n = useCountUp(value, 1600, vis);
  return (
    <div ref={ref} style={{ textAlign:"center" }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:C.text, lineHeight:1 }}>
        {n}{suffix}
      </div>
      <div style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:C.muted, marginTop:4 }}>{label}</div>
    </div>
  );
}

function Hero({ setPage }) {
  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", overflow:"hidden", background:`linear-gradient(135deg, ${C.bg} 0%, #0f0000 100%)` }}>
      {/* Background pattern */}
      <div style={{ position:"absolute", inset:0, backgroundImage:`
        repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(232,0,42,0.04) 80px, rgba(232,0,42,0.04) 81px),
        repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(232,0,42,0.04) 80px, rgba(232,0,42,0.04) 81px)`, pointerEvents:"none" }} />
      {/* Cinematic red glow */}
      <div style={{ position:"absolute", top:"50%", right:"15%", transform:"translateY(-50%)", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle, rgba(232,0,42,0.12) 0%, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"relative", maxWidth:1200, margin:"0 auto", padding:"0 4vw", paddingTop:100, display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"center" }}>
        {/* LEFT */}
        <div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(232,0,42,0.1)", border:`1px solid ${C.borderHot}`, padding:"6px 16px", borderRadius:2, marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.red, animation:"pulse 2s infinite" }} />
            <span style={{ fontSize:11, letterSpacing:3, color:C.red, fontFamily:"'Barlow Condensed',sans-serif", textTransform:"uppercase" }}>Certified Fitness Coach</span>
          </div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(52px,7vw,96px)", lineHeight:0.95, color:C.text, marginBottom:16 }}>
            Transform<br />Your Body.<br /><span style={{ color:C.red }}>Transform</span><br />Your Life.
          </h1>
          <p style={{ fontSize:17, color:C.muted, lineHeight:1.7, maxWidth:460, marginBottom:36, fontWeight:300 }}>
          Personal training with science-based programs, individualized nutrition, and relentless accountability. Your transformation starts today.
          </p>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
            <Btn onClick={()=>document.getElementById("programs")?.scrollIntoView({behavior:"smooth"})}>
              Start Your Transformation
            </Btn>
            <Btn variant="outline" onClick={()=>document.getElementById("transformations")?.scrollIntoView({behavior:"smooth"})}>
              View Client Results
            </Btn>
          </div>
        </div>
        {/* RIGHT — Trainer visual */}
     {/* RIGHT — Trainer visual */}
<div
  style={{
    position: "relative",
    display: "flex",
    justifyContent: "center",
  }}
>
  <div
    style={{
      position: "relative",
      width: 360,
      height: 480,
    }}
  >
    {/* Background */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, #1a0000, #0a0a0a)`,
        borderRadius: 4,
        border: `1px solid rgba(232,0,42,0.2)`,
        overflow: "hidden",
      }}
    >
      {/* Coach Image */}
      <img
        src="/coach/coach.jpeg"
        alt="Coach"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
        }}
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.15))",
        }}
      />
    </div>

    {/* Decorative Number */}
    <div
      style={{
        position: "absolute",
        top: -20,
        right: -20,
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: 180,
        color: "rgba(232,0,42,0.08)",
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      01
    </div>

    {/* Bottom Info Card */}
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 3,
        background: "rgba(10,10,10,0.75)",
        backdropFilter: "blur(10px)",
        padding: "16px 20px",
        borderRadius: 4,
        border: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: 3,
          color: C.red,
          fontFamily: "'Barlow Condensed',sans-serif",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        Coach Anupam Sharma
      </div>

      <div
        style={{
          fontSize: 13,
          color: C.muted,
        }}
      >
        Ereps Level 4 Certified · 8 Years Experience
      </div>
    </div>
  </div>
</div>
      </div>
      {/* Stats bar */}
      <div style={{ position:"relative", maxWidth:1200, margin:"60px auto 0", padding:"0 4vw", width:"100%" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.border, borderRadius:2, overflow:"hidden", border:`1px solid ${C.border}` }}>
          {[
            { v:200, s:"+", l:"Clients Trained" },
            { v:4000, s:"lbs", l:"Total Weight Lost" },
            { v:8, s:"yrs", l:"Experience" },
            { v:23, s:"", l:"Clients Competition Wins" },
          ].map(s => (
            <div key={s.l} style={{ background:C.bg3, padding:"28px 20px", textAlign:"center", borderRight:`1px solid ${C.border}` }}>
              <StatCounter value={s.v} label={s.l} suffix={s.s} />
            </div>
          ))}
        </div>
      </div>
      {/* Scroll indicator */}
      <div style={{ position:"absolute", bottom:30, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      
        <div style={{ width:1, height:40, background:`linear-gradient(${C.red}, transparent)` }} />
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────
function About() {
  const [ref, vis] = useInView();
  const certs = ["Ereps Level 4 Certified Personal Trainer","Skill India Certified Fitness Coach","First Aid & CPR Certified"];
  const achievements = ["IIT Coach","NIT Coach","200+ transformation clients"];
  return (
    <section id="about" ref={ref} style={{ padding:"100px 4vw", background:C.bg }}>
      <div style={{ maxWidth:1200, margin:"0 auto", opacity:vis?1:0, transform:vis?"none":"translateY(30px)", transition:"all 0.8s ease" }}>
        <Tag>About the Coach</Tag>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }}>
          <div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:58, lineHeight:0.95, marginBottom:20 }}>
              Built From <span style={{ color:C.red }}>Passion.</span><br />Driven By <span style={{ color:C.red }}>Results.</span>
            </h2>
            <RedLine />
            <p style={{ color:C.muted, lineHeight:1.8, fontSize:15, marginBottom:16 }}>
              I was a skinny kid who got bullied in school. At 17, I walked into a gym for the first time and never looked back. Eight years, hundreds of clients, and countless personal records later — fitness isn't what I do. It's who I am.
            </p>
            <p style={{ color:C.muted, lineHeight:1.8, fontSize:15, marginBottom:30 }}>
              My philosophy is simple: <span style={{ color:C.text }}>science over hype, discipline over motivation.</span> I don't promise shortcuts — I deliver systems that create lifelong change.
            </p>
            <div style={{ display:"flex", gap:16, marginBottom:40, flexWrap:"wrap" }}>
           {[
  {
    name: "Instagram",
    link: "https://www.instagram.com/anupams957?igsh=MXI5enc5eW95NWFoaw=="
  },
  {
    name: "WhatsApp",
    link: "https://wa.me/7018888636"
  }
].map((s) => (
  <a
    key={s.name}
    href={s.link}
    target="_blank"
    rel="noopener noreferrer"
    style={{ textDecoration: "none" }}
  >
    <Btn
      variant="outline"
      style={{ padding: "10px 20px", fontSize: 11 }}
    >
      {s.name}
    </Btn>
  </a>
))}
            </div>
            {/* Coaching philosophy */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {["Evidence-Based Training","Personalized Nutrition","Daily Accountability","Progressive Overload","Mental Fortitude","Long-term Lifestyle"].map(p => (
                <div key={p} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.muted }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:C.red, flexShrink:0 }} />{p}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {/* Certifications */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"24px 28px" }}>
              <div style={{ fontSize:12, letterSpacing:3, color:C.red, fontFamily:"'Barlow Condensed',sans-serif", textTransform:"uppercase", marginBottom:16 }}>Certifications</div>
              {certs.map(c => (
                <div key={c} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}`, fontSize:14, color:C.muted }}>
                  <span style={{ color:C.red }}>✓</span> {c}
                </div>
              ))}
            </div>
            {/* Achievements */}
            <div style={{ background:C.card, border:`1px solid ${C.borderHot}`, borderRadius:4, padding:"24px 28px" }}>
              <div style={{ fontSize:12, letterSpacing:3, color:C.gold, fontFamily:"'Barlow Condensed',sans-serif", textTransform:"uppercase", marginBottom:16 }}>Achievements</div>
              {achievements.map(a => (
                <div key={a} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}`, fontSize:14, color:C.muted }}>
                  <span style={{ color:C.gold }}>★</span> {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TRANSFORMATIONS ─────────────────────────────────────────────

const transformations = [
  {
    name: "Yogesh Jat",
    goal: "Fat Loss and Muscle Building",
    lost: "17kg",
    time: "5 months",
    beforeImg: "/clients/yogesh-before.jpeg",
    afterImg: "/clients/yogesh-after.jpeg",
    cat: "Fat Loss",
    before: 97,
    after: 80,
    rating: 5,
    quote:
      "Anupam's program completely changed my relationship with food and training.",
    color: "#E8002A",
  },

  {
    name: "Shivansh",
    goal: "Fat Loss",
    lost: "+22kg Fat Loss",
    time: "12 months",
    beforeImg: "/clients/shivansh-before1.jpeg",
    afterImg: "/clients/shivansh-after.jpeg",
    cat: "Fat Loss",
    before: 90,
    after: 68,
    rating: 5,
    quote:
      "I went from being embarrassed at the gym to competing in my first show.",
    color: "#D4AF37",
  },

  {
    name: "Aryan",
    goal: "Body Recomposition",
    lost: "+18kg",
    time: "8 months",
    beforeImg: "/clients/aryan-before.jpeg",
    afterImg: "/clients/aryan-after.PNG",
    cat: "Body Recomposition",
    before: 78,
    after: 83,
    rating: 5,
    quote:
      "Gained 12kg of lean muscle and loss 7kg of fat. The structured diet plan was a game changer.",
    color: "#00A884",
  },
  {
  name: "Aryan",
  goal: "Strength",
  lost: "2X Strength",
  time: "10 months",
  video: "",
  cat: "Strength",
  before: 60,
  after: 95,
  rating: 5,
  quote:
    "My squat and deadlift doubled with proper coaching and programming.",
  color: "#7B5EA7",
},
];

const cats = [
  "All",
  "Fat Loss",
  "Muscle Gain",
  "Strength",
  "Body Recomposition",
];

function TransformCard({ t }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.card,
        border: `1px solid ${hover ? t.color : C.border}`,
        borderRadius: 4,
        overflow: "hidden",
        transition: "all 0.3s",
        transform: hover ? "translateY(-6px)" : "none",
        boxShadow: hover
          ? `0 16px 40px rgba(0,0,0,0.5)`
          : undefined,
      }}
    >
      {/* Before After Images */}
     {/* Media Section */}

{t.cat === "Strength" && t.video ? (

  <div
    style={{
      height: 260,
      position: "relative",
      overflow: "hidden",
      background: "#000",
    }}
  >
    <video
      src={t.video}
      autoPlay
      muted
      loop
      playsInline
      controls
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />

    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        background: "rgba(0,0,0,0.7)",
        padding: "6px 12px",
        borderRadius: 4,
        color: "#fff",
        fontSize: 11,
        letterSpacing: 2,
        textTransform: "uppercase",
      }}
    >
      Strength Training
    </div>
  </div>

) : (

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      height: 260,
    }}
  >
        {/* BEFORE */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={t.beforeImg}
            alt="Before"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s",
              transform: hover ? "scale(1.05)" : "scale(1)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
            }}
          />

          <span
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              fontSize: 11,
              letterSpacing: 2,
              color: "#fff",
              fontFamily: "'Barlow Condensed',sans-serif",
              textTransform: "uppercase",
              zIndex: 2,
            }}
          >
            Before
          </span>
        </div>

        {/* AFTER */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderLeft: `1px solid ${C.border}`,
          }}
        >
          <img
            src={t.afterImg}
            alt="After"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s",
              transform: hover ? "scale(1.05)" : "scale(1)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
            }}
          />

          <span
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              fontSize: 11,
              letterSpacing: 2,
              color: t.color,
              fontFamily: "'Barlow Condensed',sans-serif",
              textTransform: "uppercase",
              zIndex: 2,
              fontWeight: 700,
            }}
          >
            After
          </span>
        </div>
      </div>
      )}

      {/* Content */}
      <div style={{ padding: "20px 22px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 10,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Barlow Condensed',sans-serif",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              {t.name}
            </div>

            <div
              style={{
                fontSize: 11,
                color: t.color,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {t.goal}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 30,
                color: t.color,
              }}
            >
              {t.lost}
            </div>

            <div
              style={{
                fontSize: 11,
                color: C.muted,
              }}
            >
              {t.time}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div
          style={{
            height: 4,
            background: C.bg3,
            borderRadius: 2,
            marginBottom: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: t.color,
              width: `${t.after}%`,
              transition: "width 1s",
            }}
          />
        </div>

        <p
          style={{
            fontSize: 13,
            color: C.muted,
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          "{t.quote}"
        </p>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 2,
          }}
        >
          {"★★★★★".split("").map((s, i) => (
            <span
              key={i}
              style={{
                color: C.gold,
                fontSize: 12,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Transformations() {
  const [ref, vis] = useInView();
  const [active, setActive] = useState("All");
const filtered =
  active === "All"
    ? transformations
    : transformations.filter((t) => t.cat === active);
  return (
    <section id="transformations" ref={ref} style={{ padding:"100px 4vw", background:`linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)` }}>
      <div style={{ maxWidth:1200, margin:"0 auto", opacity:vis?1:0, transition:"opacity 0.8s" }}>
        <Tag>Proof in Results</Tag>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:20, marginBottom:40 }}>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:58, lineHeight:0.95 }}>
            Real People.<br /><span style={{ color:C.red }}>Real Results.</span>
          </h2>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {cats.map(c => (
              <button key={c} onClick={()=>setActive(c)}
                style={{ padding:"8px 18px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:2, textTransform:"uppercase", background: active===c ? C.red : "transparent", color: active===c ? "#fff" : C.muted, border:`1px solid ${active===c ? C.red : C.border}`, borderRadius:2, cursor:"pointer", transition:"all 0.2s" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {filtered.map(t => <TransformCard key={t.name} t={t} />)}
        </div>
      </div>
    </section>
  );
}

// ─── PROGRAMS / SERVICES ─────────────────────────────────────────
const programs = [
  { name:"Online Coaching", icon:"🎯", price:"₹3,000/mo", duration:"3 months min", features:["Custom workout plan","Weekly check-ins","WhatsApp support","Diet tracking","Progress photos review"], hot:false, color:C.red },
  { name:"Personal Training", icon:"💪", price:"₹5,000/mo", duration:"Flexible sessions", features:["1-on-1 gym sessions","Real-time correction","Monthly assessments","Custom nutrition","Priority support"], hot:true, color:C.red },
  { name:"Fat Loss Program", icon:"🔥", price:"₹5000/mo", duration:"8 weeks", features:["HIIT + weights plan","Caloric deficit diet","Weekly weigh-ins","Supplement guide","PDF workout sheets"], hot:false, color:"#FF6B35" },
  { name:"Muscle Building", icon:"⚡", price:"₹5,500/mo", duration:"12 weeks", features:["Progressive overload plan","High-protein diet","Periodization cycles","Supplement stack","Recovery protocol"], hot:false, color:C.red },
  { name:"Home Workout Plan", icon:"🏠", price:"₹999 one-time", duration:"Lifetime access", features:["No equipment needed","4-day split","Bodyweight progressive","Nutrition guide","Video references"], hot:false, color:"#00A884" },
];

function ProgramCard({ p }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ position:"relative", background:C.card, border:`1px solid ${hover||p.hot ? p.color : C.border}`, borderRadius:4, padding:"28px 24px", transition:"all 0.3s", transform:hover?"translateY(-4px)":"none" }}>
      {p.hot && <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:C.red, color:"#fff", fontSize:10, letterSpacing:2, padding:"4px 16px", borderRadius:2, textTransform:"uppercase", fontFamily:"'Barlow Condensed',sans-serif", whiteSpace:"nowrap" }}>Most Popular</div>}
      <div style={{ fontSize:32, marginBottom:12 }}>{p.icon}</div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:700, letterSpacing:1, marginBottom:4 }}>{p.name}</div>
      <div style={{ fontSize:11, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:20 }}>{p.duration}</div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, color:p.color, marginBottom:20 }}>{p.price}</div>
      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16, marginBottom:20 }}>
        {p.features.map(f => (
          <div key={f} style={{ display:"flex", gap:8, alignItems:"center", fontSize:13, color:C.muted, padding:"5px 0" }}>
            <span style={{ color:p.color }}>→</span> {f}
          </div>
        ))}
      </div>
      <Btn style={{ width:"100%", textAlign:"center", background: p.hot ? p.color : "transparent", color: p.hot ? "#fff" : C.text, border:`1px solid ${p.color}`, padding:"12px 20px" }}>
        Get Started
      </Btn>
    </div>
  );
}

function Programs() {
  const [ref, vis] = useInView();
  return (
    <section id="programs" ref={ref} style={{ padding:"100px 4vw", background:C.bg }}>
      <div style={{ maxWidth:1200, margin:"0 auto", opacity:vis?1:0, transition:"opacity 0.8s" }}>
        <Tag>Programs & Pricing</Tag>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:58, marginBottom:8 }}>Choose Your <span style={{ color:C.red }}>Battle Plan</span></h2>
        <RedLine />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20, marginTop:40 }}>
          {programs.map(p => <ProgramCard key={p.name} p={p} />)}
        </div>
      </div>
    </section>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────

function Gallery() {
  const [ref, vis] = useInView();

  const items = [
    {
      type: "image",
      src: "/gallery/2.jpeg",
      label: "Competition Stage",
      accent: C.red,
      h: 320,
    },

    {
      type: "video",
      src: "/gallery/5.mp4",
      label: "Excersice",
      accent: "#7B5EA7",
      h: 220,
    },

    {
      type: "image",
      src: "/gallery/1.jpeg",
      label: "Client Training",
      accent: C.gold,
      h: 220,
    },

    {
      type: "video",
      src: "/gallery/6.mp4",
      label: "Posing Practice",
      accent: "#00A884",
      h: 340,
    },

    {
      type: "image",
      src: "/gallery/3.jpeg",
      label: "Cutting",
      accent: "#7B5EA7",
      h: 240,
    },

    {
      type: "video",
      src: "/gallery/6.mp4",
      label: "Excersice",
      accent: C.red,
      h: 260,
    },
  ];

  return (
    <section
      id="gallery"
      ref={ref}
      style={{
        padding: "100px 4vw",
        background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.bg} 100%)`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          opacity: vis ? 1 : 0,
          transition: "opacity 0.8s",
        }}
      >
        <Tag>Trainer Gallery</Tag>

        <h2
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 58,
            marginBottom: 40,
            lineHeight: 0.95,
          }}
        >
          Life In <span style={{ color: C.red }}>The Iron</span>
        </h2>

        {/* Masonry Layout */}
        <div
          style={{
            columns: "3 300px",
            columnGap: 16,
          }}
        >
          {items.map((item, i) => (
            <GalleryItem key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryItem({ item }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        breakInside: "avoid",
        marginBottom: 16,
        position: "relative",
        borderRadius: 6,
        overflow: "hidden",
        height: item.h,
        border: `1px solid ${hover ? item.accent : C.border}`,
        cursor: "pointer",
        transition: "all 0.3s",
        background: "#000",
      }}
    >
      {/* IMAGE */}
      {item.type === "image" && (
        <img
          src={item.src}
          alt={item.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: hover ? "scale(1.06)" : "scale(1)",
          }}
        />
      )}

      {/* VIDEO */}
      {item.type === "video" && (
        <video
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          controls={hover}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.15))",
        }}
      />

      {/* Center Icon */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            border: `2px solid ${item.accent}`,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hover ? 1 : 0.7,
            transition: "all 0.3s",
            transform: hover ? "scale(1.1)" : "scale(1)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span
            style={{
              color: item.accent,
              fontSize: 26,
            }}
          >
            {item.type === "video" ? "▶" : "📸"}
          </span>
        </div>
      </div>

      {/* Bottom Label */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 16px",
          background:
            "linear-gradient(transparent, rgba(0,0,0,0.95))",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: 2,
            color: item.accent,
            fontFamily: "'Barlow Condensed',sans-serif",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {item.type === "video"
            ? "Workout Video"
            : "Gallery"}
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "'Barlow Condensed',sans-serif",
          }}
        >
          {item.label}
        </div>
      </div>
    </div>
  );
}


// ─── FAQ ──────────────────────────────────────────────────────────
const faqs = [
  { q:"How do I get started?", a:"Book a free 30-minute consultation call through the contact form. We'll discuss your goals, assess your current fitness level, and design the perfect program for you." },
  { q:"Do you offer online coaching outside India?", a:"Yes! I work with clients across India, UAE, USA, Canada, and the UK. My online coaching is completely remote and location-independent." },
  { q:"What results can I realistically expect?", a:"Most clients lose 3–5kg per month on fat loss programs, or gain 2–3kg of lean muscle per month on muscle gain programs, when following the plan consistently." },
  { q:"Are the diet plans suitable for vegetarians?", a:"Absolutely. I have extensive experience with vegetarian Indian diets rich in paneer, dal, curd, nuts, and legumes that easily meet protein requirements." },
  { q:"How is your training different from others?", a:"I combine evidence-based programming, individualized nutrition, and weekly accountability check-ins. No cookie-cutter plans — everything is tailored specifically to you." },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding:"80px 4vw", background:C.bg }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        <Tag>FAQ</Tag>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, marginBottom:30 }}>Common <span style={{ color:C.red }}>Questions</span></h2>
        {faqs.map((f,i) => (
          <div key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
            <button onClick={()=>setOpen(open===i?null:i)} style={{ width:"100%", textAlign:"left", background:"none", border:"none", padding:"20px 0", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
              <span style={{ fontSize:16, color:C.text, fontWeight:600 }}>{f.q}</span>
              <span style={{ color:C.red, fontSize:20, transform:open===i?"rotate(45deg)":"none", transition:"transform 0.3s" }}>+</span>
            </button>
            {open===i && <div style={{ paddingBottom:20, fontSize:14, color:C.muted, lineHeight:1.8 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────
function Contact() {
  const [ref, vis] = useInView();
  const [form, setForm] = useState({ name:"", email:"", phone:"", goal:"", message:"" });
  const [sent, setSent] = useState(false);
  const handleSubmit = () => {
    if (form.name && form.email) { setSent(true); setTimeout(()=>setSent(false),3000); setForm({ name:"", email:"", phone:"", goal:"", message:"" }); }
  };
  const inputStyle = { width:"100%", background:C.bg3, border:`1px solid ${C.border}`, color:C.text, padding:"12px 16px", borderRadius:2, fontSize:14, outline:"none", marginTop:6 };
  return (
    <section id="contact" ref={ref} style={{ padding:"100px 4vw", background:C.bg2 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", opacity:vis?1:0, transition:"opacity 0.8s", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60 }}>
        <div>
          <Tag>Get In Touch</Tag>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:58, lineHeight:0.95, marginBottom:20 }}>
            Ready to <span style={{ color:C.red }}>Start?</span>
          </h2>
          <RedLine />
          <p style={{ color:C.muted, lineHeight:1.8, marginBottom:36 }}>Take the first step. Book a free consultation and let's build the best version of you — together.</p>
          {[
            { icon:"📞", label:"Phone / WhatsApp", val:"+91 70188 88636" },
            { icon:"📧", label:"Email", val:"anupamsharmaas3@gmail.com" },
            { icon:"📍", label:"Location", val:"Hamirpur, Himachal Pardesh" },
            { icon:"⏰", label:"Hours", val:"Mon–Sat: 6AM – 9PM" },
          ].map(c => (
            <div key={c.label} style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:20 }}>
              <div style={{ width:44, height:44, background:C.card, border:`1px solid ${C.border}`, borderRadius:2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase", fontFamily:"'Barlow Condensed',sans-serif" }}>{c.label}</div>
                <div style={{ fontSize:15, color:C.text, marginTop:2 }}>{c.val}</div>
              </div>
            </div>
          ))}
  
        </div>
        {/* Form */}
        {/*
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"36px 32px" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, letterSpacing:2, marginBottom:24, textTransform:"uppercase" }}>Book Free Consultation</div>
          {[
            { id:"name", placeholder:"Your Full Name", type:"text" },
            { id:"email", placeholder:"Email Address", type:"email" },
            { id:"phone", placeholder:"WhatsApp Number", type:"tel" },
          ].map(f => (
            <div key={f.id} style={{ marginBottom:16 }}>
              <input type={f.type} placeholder={f.placeholder} value={form[f.id]} onChange={e=>setForm({...form,[f.id]:e.target.value})} style={inputStyle} />
            </div>
          ))}
          <div style={{ marginBottom:16 }}>
            <select value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})} style={{ ...inputStyle, color:form.goal?C.text:C.muted }}>
              <option value="">Select Your Goal</option>
              <option>Fat Loss</option>
              <option>Muscle Gain</option>
              <option>Strength Training</option>
              <option>Body Recomposition</option>
              <option>Competition Prep</option>
            </select>
          </div>
          <div style={{ marginBottom:24 }}>
            <textarea placeholder="Tell me about yourself and your goals..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={4} style={{ ...inputStyle, resize:"vertical" }} />
          </div>
          <Btn onClick={handleSubmit} style={{ width:"100%", textAlign:"center" }}>
            {sent ? "✓ Message Sent!" : "Send Message"}
          </Btn>
        </div>
        */}
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background:"#060606", borderTop:`1px solid ${C.border}`, padding:"60px 4vw 30px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:4, marginBottom:12 }}>
              <span style={{ color:C.red }}>IRON</span>WILL
            </div>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.8, maxWidth:280 }}>Elite personal training for those who refuse to settle. Transform your body, transform your life.</p>
          </div>
          {[
            { title:"Quick Links", items:[{l:"About",s:"about"},{l:"Transformations",s:"transformations"},{l:"Programs",s:"programs"},{l:"Contact",s:"contact"}] },
            { title:"Tools", items:[{l:"BMI Calculator",p:"bmi"},{l:"BMR Calculator",p:"bmr"},{l:"Ideal Weight",p:"idealweight"},{l:"Workout Planner",p:"workout"}] },
            { title:"Social", items:[{l:"Instagram"},{l:"YouTube"},{l:"WhatsApp"},{l:"Email"}] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize:11, letterSpacing:3, color:C.red, textTransform:"uppercase", fontFamily:"'Barlow Condensed',sans-serif", marginBottom:16 }}>{col.title}</div>
              {col.items.map(item => (
                <div key={item.l} style={{ padding:"5px 0" }}>
                  <span style={{ fontSize:13, color:C.muted, cursor:"pointer" }}
                    onClick={()=>item.p?setPage(item.p):item.s?document.getElementById(item.s)?.scrollIntoView({behavior:"smooth"}):null}
                    onMouseEnter={e=>e.target.style.color=C.text}
                    onMouseLeave={e=>e.target.style.color=C.muted}>
                    {item.l}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div style={{ fontSize:12, color:C.muted }}>© 2025 IronWill Fitness. All rights reserved.</div>
          <div style={{ fontSize:12, color:C.muted }}>Designed for champions.</div>
        </div>
      </div>
    </footer>
  );
}

// ─── FLOATING BUTTONS ─────────────────────────────────────────────
function FloatingButtons() {
  return (
    <div style={{ position:"fixed", bottom:30, right:24, display:"flex", flexDirection:"column", gap:12, zIndex:999 }}>
      <button style={{ width:52, height:52, borderRadius:"50%", background:"#25D366", border:"none", cursor:"pointer", fontSize:24, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(37,211,102,0.4)", animation:"pulse 2.5s infinite" }}>
        💬
      </button>
      <button style={{ width:52, height:52, borderRadius:"50%", background:C.red, border:"none", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 16px ${C.redGlow}` }}
        onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>
        📅
      </button>
    </div>
  );
}

// ─── CALCULATOR PAGES ─────────────────────────────────────────────
function CalcLayout({ title, tag, children }) {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, paddingTop:100, padding:"100px 4vw 60px" }}>
      <div style={{ maxWidth:700, margin:"0 auto" }}>
        <Tag>{tag}</Tag>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:64, lineHeight:0.9, marginBottom:6 }}>
          {title.split(" ").map((w,i,arr) => i===arr.length-1 ? <span key={i} style={{ color:C.red }}>{w}</span> : w+" ")}
        </h1>
        <RedLine />
        {children}
      </div>
    </div>
  );
}

function BMIPage() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const bmi = +(weight / ((height/100)**2)).toFixed(1);
  const cat = bmi < 18.5 ? { label:"Underweight", color:"#3B82F6" }
    : bmi < 25 ? { label:"Normal Weight", color:"#22C55E" }
    : bmi < 30 ? { label:"Overweight", color:"#F59E0B" }
    : { label:"Obese", color:C.red };
  const gaugeAngle = Math.min(Math.max((bmi - 10) / 30, 0), 1) * 180;
  const inputStyle = { width:"100%", background:C.bg3, border:`1px solid ${C.border}`, color:C.text, padding:"12px 16px", borderRadius:2, fontSize:16, outline:"none" };
  return (
    <CalcLayout title="BMI Calculator" tag="Health Tool">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:30 }}>
        <div>
          <label style={{ fontSize:12, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>Height (cm)</label>
          <input type="number" value={height} onChange={e=>setHeight(+e.target.value)} style={{ ...inputStyle, marginTop:8 }} min={100} max={250} />
          <input type="range" min={100} max={250} value={height} onChange={e=>setHeight(+e.target.value)} style={{ width:"100%", marginTop:8, accentColor:C.red }} />
        </div>
        <div>
          <label style={{ fontSize:12, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>Weight (kg)</label>
          <input type="number" value={weight} onChange={e=>setWeight(+e.target.value)} style={{ ...inputStyle, marginTop:8 }} min={30} max={250} />
          <input type="range" min={30} max={250} value={weight} onChange={e=>setWeight(+e.target.value)} style={{ width:"100%", marginTop:8, accentColor:C.red }} />
        </div>
      </div>
      {/* Gauge */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"36px 28px", textAlign:"center", marginBottom:20 }}>
        <svg viewBox="0 0 300 160" style={{ width:"100%", maxWidth:280, margin:"0 auto", display:"block" }}>
          {/* Arc background */}
          {["#3B82F6","#22C55E","#F59E0B",C.red].map((col,i) => {
            const start = i*45; const sweep = 44;
            const r = 110; const cx=150; const cy=140;
            const startRad=(start-180)*Math.PI/180; const endRad=(start+sweep-180)*Math.PI/180;
            return <path key={i} d={`M ${cx+r*Math.cos(startRad)} ${cy+r*Math.sin(startRad)} A ${r} ${r} 0 0 1 ${cx+r*Math.cos(endRad)} ${cy+r*Math.sin(endRad)}`} stroke={col} strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.4}/>;
          })}
          {/* Needle */}
          <line x1={150} y1={140} x2={150+95*Math.cos((gaugeAngle-180)*Math.PI/180)} y2={140+95*Math.sin((gaugeAngle-180)*Math.PI/180)} stroke={cat.color} strokeWidth={3} strokeLinecap="round"/>
          <circle cx={150} cy={140} r={8} fill={cat.color}/>
          {/* Labels */}
          <text x={28} y={145} fill="#3B82F6" fontSize={11} textAnchor="middle">15</text>
          <text x={150} y={25} fill="#22C55E" fontSize={11} textAnchor="middle">25</text>
          <text x={272} y={145} fill={C.red} fontSize={11} textAnchor="middle">40</text>
        </svg>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:72, color:cat.color, lineHeight:1 }}>{bmi}</div>
        <div style={{ fontSize:14, letterSpacing:3, color:cat.color, textTransform:"uppercase", fontFamily:"'Barlow Condensed',sans-serif" }}>{cat.label}</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
        {[{r:"< 18.5",l:"Underweight",c:"#3B82F6"},{r:"18.5–24.9",l:"Normal",c:"#22C55E"},{r:"25–29.9",l:"Overweight",c:"#F59E0B"},{r:"> 30",l:"Obese",c:C.red}].map(b => (
          <div key={b.l} style={{ background:C.card, border:`1px solid ${b.r===cat.label?b.c:C.border}`, borderRadius:4, padding:"12px", textAlign:"center" }}>
            <div style={{ fontSize:13, color:b.c, fontWeight:700 }}>{b.r}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{b.l}</div>
          </div>
        ))}
      </div>
    </CalcLayout>
  );
}

function BMRPage() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [activity, setActivity] = useState(1.55);
  const bmr = gender==="male" ? Math.round(88.362+(13.397*weight)+(4.799*height)-(5.677*age)) : Math.round(447.593+(9.247*weight)+(3.098*height)-(4.330*age));
  const tdee = Math.round(bmr * activity);
  const inputStyle = { width:"100%", background:C.bg3, border:`1px solid ${C.border}`, color:C.text, padding:"12px 16px", borderRadius:2, fontSize:14, outline:"none" };
  return (
    <CalcLayout title="BMR Calculator" tag="Nutrition Tool">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
        <div>
          <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>Gender</label>
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            {["male","female"].map(g => (
              <button key={g} onClick={()=>setGender(g)} style={{ flex:1, padding:"12px", background:gender===g?C.red:"transparent", border:`1px solid ${gender===g?C.red:C.border}`, color:gender===g?"#fff":C.muted, borderRadius:2, cursor:"pointer", textTransform:"capitalize", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, letterSpacing:1 }}>{g}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>Age</label>
          <input type="number" value={age} min={15} max={80} onChange={e=>setAge(+e.target.value)} style={{ ...inputStyle, marginTop:8 }} />
        </div>
        <div>
          <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>Height (cm)</label>
          <input type="number" value={height} min={120} max={230} onChange={e=>setHeight(+e.target.value)} style={{ ...inputStyle, marginTop:8 }} />
        </div>
        <div>
          <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>Weight (kg)</label>
          <input type="number" value={weight} min={30} max={200} onChange={e=>setWeight(+e.target.value)} style={{ ...inputStyle, marginTop:8 }} />
        </div>
      </div>
      <div style={{ marginBottom:24 }}>
        <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>Activity Level</label>
        <select value={activity} onChange={e=>setActivity(+e.target.value)} style={{ ...inputStyle, marginTop:8 }}>
          <option value={1.2}>Sedentary (little/no exercise)</option>
          <option value={1.375}>Lightly Active (1–3 days/week)</option>
          <option value={1.55}>Moderately Active (3–5 days/week)</option>
          <option value={1.725}>Very Active (6–7 days/week)</option>
          <option value={1.9}>Extra Active (physical job + training)</option>
        </select>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[
          { label:"Base BMR", val:bmr, sub:"calories/day", color:C.muted },
          { label:"Maintenance", val:tdee, sub:"calories/day", color:C.text },
          { label:"Fat Loss", val:tdee-500, sub:"calories/day", color:"#22C55E" },
          { label:"Aggressive Cut", val:tdee-750, sub:"calories/day", color:C.red },
          { label:"Lean Bulk", val:tdee+250, sub:"calories/day", color:C.gold },
          { label:"Muscle Gain", val:tdee+500, sub:"calories/day", color:"#7B5EA7" },
        ].map(r => (
          <div key={r.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"20px 16px", textAlign:"center" }}>
            <div style={{ fontSize:11, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>{r.label}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:38, color:r.color }}>{r.val.toLocaleString()}</div>
            <div style={{ fontSize:11, color:C.muted }}>{r.sub}</div>
          </div>
        ))}
      </div>
    </CalcLayout>
  );
}

function IdealWeightPage() {
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState("male");
  const h = height - 100;
  const devine = gender==="male" ? +(50 + 2.3*(height/2.54 - 60)).toFixed(1) : +(45.5 + 2.3*(height/2.54 - 60)).toFixed(1);
  const robinson = gender==="male" ? +(52 + 1.9*(height/2.54 - 60)).toFixed(1) : +(49 + 1.7*(height/2.54 - 60)).toFixed(1);
  const miller = gender==="male" ? +(56.2 + 1.41*(height/2.54 - 60)).toFixed(1) : +(53.1 + 1.36*(height/2.54 - 60)).toFixed(1);
  const avg = +((devine+robinson+miller)/3).toFixed(1);
  const inputStyle = { width:"100%", background:C.bg3, border:`1px solid ${C.border}`, color:C.text, padding:"12px 16px", borderRadius:2, fontSize:14, outline:"none" };
  return (
    <CalcLayout title="Ideal Weight" tag="Body Metric Tool">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
        <div>
          <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>Gender</label>
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            {["male","female"].map(g => (
              <button key={g} onClick={()=>setGender(g)} style={{ flex:1, padding:"12px", background:gender===g?C.red:"transparent", border:`1px solid ${gender===g?C.red:C.border}`, color:gender===g?"#fff":C.muted, borderRadius:2, cursor:"pointer", textTransform:"capitalize", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, letterSpacing:1 }}>{g}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>Height (cm)</label>
          <input type="number" value={height} min={140} max={220} onChange={e=>setHeight(+e.target.value)} style={{ ...inputStyle, marginTop:8 }} />
          <input type="range" min={140} max={220} value={height} onChange={e=>setHeight(+e.target.value)} style={{ width:"100%", marginTop:8, accentColor:C.red }} />
        </div>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.borderHot}`, borderRadius:4, padding:"28px", textAlign:"center", marginBottom:20 }}>
        <div style={{ fontSize:12, letterSpacing:3, color:C.muted, textTransform:"uppercase", marginBottom:8 }}>Your Ideal Weight Range</div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:64, color:C.red }}>{(avg-3).toFixed(1)} – {(avg+3).toFixed(1)} kg</div>
        <div style={{ fontSize:14, color:C.muted }}>Based on average of 3 scientific formulas</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[{l:"Devine Formula",v:devine},{l:"Robinson Formula",v:robinson},{l:"Miller Formula",v:miller}].map(f => (
          <div key={f.l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>{f.l}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:C.text }}>{f.v} kg</div>
          </div>
        ))}
      </div>
    </CalcLayout>
  );
}

// ─── WORKOUT DATABASE ─────────────────────────────────────────────

// ─── DIET PLAN PAGE ───────────────────────────────────────────────
const dietPlans = {
  "fat-loss-veg": {
    cals:1600, protein:130, carbs:150, fat:50,
    meals:[
      { time:"7:00 AM", label:"Breakfast", items:["2 Egg whites + 1 whole egg scrambled","1 cup Oats with banana","1 cup Black coffee/green tea"], cals:380, protein:28 },
      { time:"10:30 AM", label:"Mid-Morning Snack", items:["100g Paneer cubes","10 Almonds","1 small apple"], cals:220, protein:15 },
      { time:"1:00 PM", label:"Lunch", items:["2 Multigrain rotis","1 cup Dal (moong/masoor)","1 cup Sabzi (low oil)","100g Curd (plain)","Salad"], cals:420, protein:22 },
      { time:"4:30 PM", label:"Pre-Workout Snack", items:["1 Banana","1 tbsp Peanut butter","1 cup Buttermilk"], cals:180, protein:6 },
      { time:"8:00 PM", label:"Dinner", items:["2 Rotis","1 cup Rajma/Chole","Baingan bharta","Salad with lemon"], cals:380, protein:18 },
    ]
  },
  "muscle-nonveg": {
    cals:2800, protein:210, carbs:280, fat:80,
    meals:[
      { time:"7:00 AM", label:"Breakfast", items:["6 Egg whites + 2 yolks","2 cups Oats with milk","2 bananas","1 tbsp Peanut butter"], cals:650, protein:52 },
      { time:"10:30 AM", label:"Mid-Morning", items:["200g Chicken breast (boiled)","1 cup Brown rice","Cucumber salad"], cals:480, protein:48 },
      { time:"1:00 PM", label:"Lunch", items:["3 Multigrain rotis","150g Paneer curry","1 cup Dal","100g Curd","Salad"], cals:680, protein:45 },
      { time:"4:00 PM", label:"Pre-Workout", items:["2 Bananas","30g Whey protein","20 Almonds"], cals:370, protein:32 },
      { time:"8:30 PM", label:"Dinner", items:["200g Chicken (grilled)","1 cup Rice","Mixed sabzi","1 cup Dal"], cals:620, protein:55 },
    ]
  },
};

function DietPage() {
  const [goal, setGoal] = useState("fat-loss");
  const [pref, setPref] = useState("veg");
  const [generated, setGenerated] = useState(false);
  const key = `${goal}-${pref}`;
  const plan = dietPlans[key] || dietPlans["fat-loss-veg"];
  const macroBar = (label, val, max, color) => (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
        <span style={{ color:C.muted, letterSpacing:1 }}>{label}</span>
        <span style={{ color, fontWeight:700 }}>{val}g</span>
      </div>
      <div style={{ height:6, background:C.bg3, borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", background:color, width:`${Math.min(val/max*100,100)}%`, borderRadius:3, transition:"width 0.8s" }} />
      </div>
    </div>
  );
  return (
    <CalcLayout title="Indian Diet Plan" tag="Nutrition">
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        <div>
          <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase", display:"block", marginBottom:8 }}>Your Goal</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[{v:"fat-loss",l:"Fat Loss"},{v:"lean-bulk",l:"Lean Bulk"},{v:"muscle",l:"Muscle Gain"},{v:"recomp",l:"Recomp"}].map(g => (
              <button key={g.v} onClick={()=>setGoal(g.v)} style={{ padding:"10px 8px", background:goal===g.v?C.red:"transparent", border:`1px solid ${goal===g.v?C.red:C.border}`, color:goal===g.v?"#fff":C.muted, borderRadius:2, cursor:"pointer", fontSize:12, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:"uppercase" }}>{g.l}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase", display:"block", marginBottom:8 }}>Diet Preference</label>
          <div style={{ display:"flex", gap:8 }}>
            {[{v:"veg",l:"Vegetarian"},{v:"nonveg",l:"Non-Veg"}].map(p => (
              <button key={p.v} onClick={()=>setPref(p.v)} style={{ flex:1, padding:"12px 8px", background:pref===p.v?C.red:"transparent", border:`1px solid ${pref===p.v?C.red:C.border}`, color:pref===p.v?"#fff":C.muted, borderRadius:2, cursor:"pointer", fontSize:12, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:"uppercase" }}>{p.l}</button>
            ))}
          </div>
        </div>
      </div>
      <Btn onClick={()=>setGenerated(true)} style={{ width:"100%", marginBottom:24 }}>Generate My Diet Plan</Btn>
      {generated && (
        <>
          {/* Macro overview */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"24px", marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:12, letterSpacing:3, color:C.red, textTransform:"uppercase" }}>Daily Macros</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:C.text }}>{plan.cals} <span style={{ fontSize:16, color:C.muted }}>kcal</span></div>
            </div>
            {macroBar("Protein", plan.protein, 250, C.red)}
            {macroBar("Carbohydrates", plan.carbs, 400, "#F59E0B")}
            {macroBar("Fats", plan.fat, 120, "#7B5EA7")}
          </div>
          {/* Meals */}
          {plan.meals.map((meal,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"20px 24px", marginBottom:10, display:"grid", gridTemplateColumns:"auto 1fr auto", gap:16, alignItems:"start" }}>
              <div style={{ textAlign:"center", minWidth:60 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, color:C.red, letterSpacing:1 }}>{meal.time}</div>
              </div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:700, letterSpacing:1, marginBottom:8 }}>{meal.label}</div>
                {meal.items.map(item => (
                  <div key={item} style={{ fontSize:13, color:C.muted, padding:"3px 0", display:"flex", gap:8 }}>
                    <span style={{ color:C.red }}>•</span> {item}
                  </div>
                ))}
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:C.text }}>{meal.cals}</div>
                <div style={{ fontSize:10, color:C.muted }}>kcal</div>
                <div style={{ fontSize:12, color:C.red, marginTop:4 }}>{meal.protein}g P</div>
              </div>
            </div>
          ))}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:16 }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"16px 20px" }}>
              <div style={{ fontSize:11, letterSpacing:2, color:C.gold, textTransform:"uppercase", marginBottom:10 }}>Supplements</div>
              {["Whey Protein (post-workout)","Creatine 5g/day","Multivitamin (morning)","Omega-3 (2 caps/day)","Vitamin D3 (2000 IU)"].map(s => (
                <div key={s} style={{ fontSize:12, color:C.muted, padding:"4px 0", borderBottom:`1px solid ${C.border}` }}>{s}</div>
              ))}
            </div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"16px 20px" }}>
              <div style={{ fontSize:11, letterSpacing:2, color:"#3B82F6", textTransform:"uppercase", marginBottom:10 }}>Hydration Tips</div>
              {["3–4L water daily","1 glass pre-meal","2 glasses post-workout","Coconut water post-gym","Avoid soda & juice"].map(s => (
                <div key={s} style={{ fontSize:12, color:C.muted, padding:"4px 0", borderBottom:`1px solid ${C.border}` }}>{s}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </CalcLayout>
  );
}
// ─── HEART RATE ZONES PAGE ───────────────────────────────────────
function HeartRatePage() {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [calculated, setCalculated] = useState(false);
 
  // Max HR formulas — Tanaka is most validated for general population
  // Gellish formula is gender-adjusted
  const maxHR_tanaka = Math.round(208 - 0.7 * age);
  const maxHR_gellish = gender === "male"
    ? Math.round(207 - 0.7 * age)
    : Math.round(206 - 0.88 * age);
  const maxHR = Math.round((maxHR_tanaka + maxHR_gellish) / 2);
 
  // Resting HR estimate by age/gender (average population values)
  const restingHR = gender === "male"
    ? age < 30 ? 64 : age < 40 ? 65 : age < 50 ? 66 : 68
    : age < 30 ? 67 : age < 40 ? 68 : age < 50 ? 69 : 71;
 
  // Heart Rate Reserve (Karvonen method — more accurate for fat loss targeting)
  const hrr = maxHR - restingHR;
 
  // BMI for context
  const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);
 
  // All 5 HR zones (% of HRR + resting HR via Karvonen)
  const zones = [
    { id:1, name:"Active Recovery", pctLow:50, pctHigh:60, color:"#3B82F6", desc:"Light activity, warm-up/cool-down. Burns calories but low intensity.", benefit:"Recovery & base fitness" },
    { id:2, name:"Fat Burn Zone", pctLow:60, pctHigh:70, color:"#22C55E", desc:"The sweet spot for maximum fat oxidation. Body uses fat as primary fuel source.", benefit:"Maximum fat loss ★", highlight:true },
    { id:3, name:"Aerobic Zone", pctLow:70, pctHigh:80, color:"#F59E0B", desc:"Improves cardiovascular fitness. Still burns significant fat but shifts toward carbs.", benefit:"Cardio endurance" },
    { id:4, name:"Anaerobic Zone", pctLow:80, pctHigh:90, color:"#F97316", desc:"High-intensity training. Burns carbs primarily. Improves speed and power.", benefit:"HIIT & performance" },
    { id:5, name:"VO2 Max Zone", pctLow:90, pctHigh:100, color:C.red, desc:"Maximum effort. Sprint intervals only. Not sustainable for fat loss.", benefit:"Peak performance" },
  ];
 
  const getZoneHR = (zone) => ({
    low: Math.round(restingHR + hrr * zone.pctLow / 100),
    high: Math.round(restingHR + hrr * zone.pctHigh / 100),
  });
 
  const fatBurnZone = getZoneHR(zones[1]);
 
  // Calories burned estimate at fat burn zone (MET-based)
  const metFatBurn = 5.5; // moderate cardio MET
  const calPerMin = Math.round(metFatBurn * 3.5 * weight / 200);
 
  const inputStyle = {
    width: "100%", background: C.bg3, border: `1px solid ${C.border}`,
    color: C.text, padding: "12px 16px", borderRadius: 2, fontSize: 14, outline: "none"
  };
 
  return (
    <CalcLayout title="Heart Rate Zones" tag="Cardio & Fat Loss Tool">
      <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
        Enter your details to discover your precise fat-burning heart rate zone. Training within this window maximises fat oxidation while preserving muscle.
      </p>
 
      {/* Inputs */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "28px", marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Gender */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 11, letterSpacing: 2, color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Gender</label>
            <div style={{ display: "flex", gap: 10 }}>
              {["male", "female"].map(g => (
                <button key={g} onClick={() => setGender(g)}
                  style={{ flex: 1, padding: "13px", background: gender === g ? C.red : "transparent", border: `1px solid ${gender === g ? C.red : C.border}`, color: gender === g ? "#fff" : C.muted, borderRadius: 2, cursor: "pointer", textTransform: "capitalize", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, letterSpacing: 2, transition: "all 0.2s" }}>
                  {g === "male" ? "♂ Male" : "♀ Female"}
                </button>
              ))}
            </div>
          </div>
 
          {/* Age */}
          <div>
            <label style={{ fontSize: 11, letterSpacing: 2, color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Age — <span style={{ color: C.text }}>{age} yrs</span>
            </label>
            <input type="range" min={15} max={75} value={age} onChange={e => setAge(+e.target.value)}
              style={{ width: "100%", accentColor: C.red, marginBottom: 6 }} />
            <input type="number" value={age} min={15} max={75} onChange={e => setAge(+e.target.value)} style={inputStyle} />
          </div>
 
          {/* Weight */}
          <div>
            <label style={{ fontSize: 11, letterSpacing: 2, color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Weight — <span style={{ color: C.text }}>{weight} kg</span>
            </label>
            <input type="range" min={35} max={200} value={weight} onChange={e => setWeight(+e.target.value)}
              style={{ width: "100%", accentColor: C.red, marginBottom: 6 }} />
            <input type="number" value={weight} min={35} max={200} onChange={e => setWeight(+e.target.value)} style={inputStyle} />
          </div>
 
          {/* Height */}
          <div>
            <label style={{ fontSize: 11, letterSpacing: 2, color: C.muted, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Height — <span style={{ color: C.text }}>{height} cm</span>
            </label>
            <input type="range" min={140} max={220} value={height} onChange={e => setHeight(+e.target.value)}
              style={{ width: "100%", accentColor: C.red, marginBottom: 6 }} />
            <input type="number" value={height} min={140} max={220} onChange={e => setHeight(+e.target.value)} style={inputStyle} />
          </div>
 
          {/* Est. Resting HR display */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 2, padding: "12px 16px", fontSize: 13, color: C.muted }}>
              <span style={{ color: C.text }}>Estimated resting HR:</span> ~{restingHR} bpm
              <div style={{ fontSize: 11, marginTop: 4 }}>Based on age &amp; gender averages</div>
            </div>
          </div>
        </div>
 
        <div style={{ marginTop: 20 }}>
          <Btn onClick={() => setCalculated(true)} style={{ width: "100%", fontSize: 14, padding: "15px" }}>
            Calculate My Heart Rate Zones
          </Btn>
        </div>
      </div>
 
      {calculated && (
        <>
          {/* Hero result — Fat Burn Zone */}
          <div style={{ background: "linear-gradient(135deg, #0a1a0a, #001200)", border: `2px solid #22C55E`, borderRadius: 4, padding: "32px 28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(34,197,94,0.06)", pointerEvents: "none" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#22C55E", textTransform: "uppercase", fontFamily: "'Barlow Condensed',sans-serif", marginBottom: 8 }}>
                  ★ Optimal Fat Burn Zone for You
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 72, color: "#22C55E", lineHeight: 1 }}>
                  {fatBurnZone.low} – {fatBurnZone.high}
                </div>
                <div style={{ fontSize: 16, color: C.muted, marginTop: 4, letterSpacing: 1 }}>beats per minute (bpm)</div>
                <p style={{ fontSize: 13, color: C.muted, marginTop: 12, lineHeight: 1.7, maxWidth: 400 }}>
                  Keep your heart rate in this window during cardio for maximum fat oxidation. Your body primarily burns stored fat as fuel in this zone — ideal for sustained weight loss without muscle breakdown.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 160 }}>
                {[
                  { label: "Max Heart Rate", val: `${maxHR} bpm`, color: C.red },
                  { label: "Resting HR (est.)", val: `${restingHR} bpm`, color: C.muted },
                  { label: "HR Reserve", val: `${hrr} bpm`, color: C.gold },
                  { label: "Fat burn cal/min", val: `~${calPerMin} kcal`, color: "#22C55E" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(0,0,0,0.4)", border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 2, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: C.muted, textTransform: "uppercase" }}>{s.label}</div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, color: s.color, fontWeight: 700, marginTop: 2 }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
          {/* Visual HR zone bar */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "24px 28px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: C.muted, textTransform: "uppercase", marginBottom: 20 }}>All Heart Rate Zones — Visual Overview</div>
 
            {/* Horizontal stacked bar */}
            <div style={{ display: "flex", height: 28, borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
              {zones.map(z => (
                <div key={z.id} style={{ flex: z.pctHigh - z.pctLow, background: z.color, opacity: z.highlight ? 1 : 0.45, transition: "opacity 0.3s", position: "relative" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={e => e.currentTarget.style.opacity = z.highlight ? "1" : "0.45"} />
              ))}
            </div>
            {/* Percentage labels */}
            <div style={{ display: "flex", marginBottom: 24 }}>
              {[50, 60, 70, 80, 90, 100].map(p => (
                <div key={p} style={{ flex: p === 50 ? 0 : 10, fontSize: 10, color: C.muted, textAlign: p === 50 ? "left" : "right" }}>{p}%</div>
              ))}
            </div>
 
            {/* Zone rows */}
            {zones.map(z => {
              const zHR = getZoneHR(z);
              const barW = z.pctHigh - z.pctLow; // relative width out of 50 points
              return (
                <div key={z.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center", padding: "14px 0", borderTop: `1px solid ${C.border}` }}>
                  {/* Zone pill */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 200 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: z.color, flexShrink: 0, boxShadow: z.highlight ? `0 0 8px ${z.color}` : "none" }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: z.highlight ? z.color : C.text }}>{z.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{z.pctLow}–{z.pctHigh}% Max HR</div>
                    </div>
                  </div>
                  {/* Bar */}
                  <div style={{ height: 6, background: C.bg3, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${barW * 2}%`, background: z.color, borderRadius: 3, opacity: z.highlight ? 1 : 0.6 }} />
                  </div>
                  {/* BPM range */}
                  <div style={{ textAlign: "right", minWidth: 110 }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, fontWeight: 700, color: z.highlight ? z.color : C.text, letterSpacing: 1 }}>
                      {zHR.low}–{zHR.high}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>bpm</div>
                  </div>
                </div>
              );
            })}
          </div>
 
          {/* Science explainer cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "20px" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "#22C55E", textTransform: "uppercase", marginBottom: 10 }}>Why This Zone Burns Fat</div>
              {[
                "At 60–70% max HR your body uses ~85% fat as fuel",
                "Lower intensity = longer sustainable sessions",
                "Spares glycogen — preserves muscle mass",
                "Boosts mitochondrial density over time",
                "Ideal: 30–60 min steady-state cardio sessions",
              ].map(t => (
                <div key={t} style={{ display: "flex", gap: 8, fontSize: 13, color: C.muted, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: "#22C55E", flexShrink: 0 }}>✓</span> {t}
                </div>
              ))}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: "20px" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: C.red, textTransform: "uppercase", marginBottom: 10 }}>Fat Loss Cardio Protocol</div>
              {[
                `Warm-up: 5 min below ${fatBurnZone.low} bpm`,
                `Work zone: ${fatBurnZone.low}–${fatBurnZone.high} bpm for 30–50 min`,
                `Cool-down: 5 min, let HR drop naturally`,
                "Frequency: 4–5 sessions per week",
                "Best time: fasted morning or post-weights",
              ].map(t => (
                <div key={t} style={{ display: "flex", gap: 8, fontSize: 13, color: C.muted, padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.red, flexShrink: 0 }}>→</span> {t}
                </div>
              ))}
            </div>
          </div>
 
          {/* BMI context */}
          <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 4, padding: "16px 20px", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
            <span style={{ color: C.gold }}>Your context:</span> With a BMI of {bmi} and being {gender}, your estimated resting HR is ~{restingHR} bpm. Using the Karvonen Heart Rate Reserve method (more accurate than simple % of max HR), your personalised fat-burn zone is <span style={{ color: "#22C55E", fontWeight: 700 }}>{fatBurnZone.low}–{fatBurnZone.high} bpm</span>. At this intensity, you burn approximately <span style={{ color: C.red }}>{calPerMin} kcal/minute</span> — roughly {calPerMin * 30}–{calPerMin * 45} kcal per 30–45 min session.
          </div>
        </>
      )}
    </CalcLayout>
  );
}
// ─── HOME PAGE ────────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <>
      <Hero setPage={setPage} />
      <About />
      <Transformations />
      <Programs />
      <Gallery />
      <FAQ />
      <Contact />
    </>
  );
}


// ─── APP ──────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  useEffect(() => { window.scrollTo(0,0); }, [page]);
  const renderPage = () => {
    switch(page) {
      case "heartrate": return <HeartRatePage />;
      case "bmi": return <BMIPage />;
      case "bmr": return <BMRPage />;
      case "idealweight": return <IdealWeightPage />;
      // case "workout": return <WorkoutPage />;
      case "diet": return <DietPage />;
      default: return <HomePage setPage={setPage} />;
    }
  };
  return (
    <>
      <style>{globalCSS}</style>
      <Navbar page={page} setPage={setPage} />
      {renderPage()}
      <Footer setPage={setPage} />
      <FloatingButtons />
    </>
  );
}
