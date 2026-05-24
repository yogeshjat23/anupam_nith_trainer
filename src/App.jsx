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
// Each plan entry: { split: [...7 day names], days: { "DayName": { focus, cardio, exercises:[{name,sets,reps,rest,muscle,tip}] } } }

const WDB = {
  // ══════════════════════════════════════════════════════
  // FAT LOSS
  // ══════════════════════════════════════════════════════
  "fat-loss|beginner|3|gym": {
    split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
    days:{
      "Full Body":{
        focus:"Full Body Circuit",
        cardio:"20 min brisk treadmill walk after workout",
        exercises:[
          {name:"Goblet Squat",sets:3,reps:"12-15",rest:"60s",muscle:"Quads/Glutes",tip:"Keep chest tall, push knees out"},
          {name:"Dumbbell Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings/Glutes",tip:"Hinge at hips, soft knee bend"},
          {name:"Incline Push-ups / Bench Push-ups",sets:3,reps:"10-15",rest:"60s",muscle:"Chest/Triceps",tip:"Full range of motion"},
          {name:"Seated Cable Row",sets:3,reps:"12",rest:"60s",muscle:"Back/Biceps",tip:"Squeeze shoulder blades together"},
          {name:"Dumbbell Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Don't flare elbows wide"},
          {name:"Plank Hold",sets:3,reps:"30-40s",rest:"45s",muscle:"Core",tip:"Straight line from head to heel"},
          {name:"Jumping Jacks",sets:3,reps:"45s",rest:"30s",muscle:"Cardio/Full Body",tip:"Keep rhythm consistent"},
        ]
      }
    }
  },
  "fat-loss|beginner|3|dumbbells": {
    split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
    days:{
      "Full Body":{
        focus:"Full Body Dumbbell Circuit",
        cardio:"25 min walk/jog outdoors",
        exercises:[
          {name:"DB Goblet Squat",sets:3,reps:"15",rest:"60s",muscle:"Quads/Glutes",tip:"Heels shoulder-width apart"},
          {name:"DB Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Slow eccentric, 3 seconds down"},
          {name:"DB Chest Press (Floor)",sets:3,reps:"12",rest:"60s",muscle:"Chest",tip:"Elbows 45° from torso"},
          {name:"DB Bent-Over Row",sets:3,reps:"12/side",rest:"60s",muscle:"Back",tip:"Keep back flat, row to hip"},
          {name:"DB Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Shoulders",tip:"Slight bend in elbows"},
          {name:"DB Bicep Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Controlled, don't swing"},
          {name:"DB Tricep Kickback",sets:3,reps:"12/side",rest:"45s",muscle:"Triceps",tip:"Upper arm parallel to floor"},
          {name:"Mountain Climbers",sets:3,reps:"40s",rest:"30s",muscle:"Core/Cardio",tip:"Drive knees to chest fast"},
        ]
      }
    }
  },
  "fat-loss|beginner|3|home": {
    split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
    days:{
      "Full Body":{
        focus:"Bodyweight Fat Burn Circuit",
        cardio:"20 min jog in place or outdoor walk",
        exercises:[
          {name:"Bodyweight Squat",sets:3,reps:"20",rest:"45s",muscle:"Quads/Glutes",tip:"Chest up, knees track toes"},
          {name:"Push-ups (knees if needed)",sets:3,reps:"10-15",rest:"45s",muscle:"Chest/Triceps",tip:"Body straight as a plank"},
          {name:"Glute Bridge",sets:3,reps:"20",rest:"45s",muscle:"Glutes/Hamstrings",tip:"Squeeze at top for 1 sec"},
          {name:"Superman Hold",sets:3,reps:"15",rest:"40s",muscle:"Lower Back",tip:"Lift arms and legs together"},
          {name:"Reverse Lunges",sets:3,reps:"12/leg",rest:"45s",muscle:"Quads/Glutes",tip:"Back knee nearly touches floor"},
          {name:"Plank",sets:3,reps:"40s",rest:"30s",muscle:"Core",tip:"Breathe steadily, don't sag"},
          {name:"Burpees",sets:3,reps:"10",rest:"60s",muscle:"Full Body/Cardio",tip:"Chest to floor each rep"},
          {name:"High Knees",sets:3,reps:"45s",rest:"30s",muscle:"Cardio/Core",tip:"Pump arms, drive knees high"},
        ]
      }
    }
  },
  "fat-loss|beginner|3|bands": {
    split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
    days:{
      "Full Body":{
        focus:"Resistance Band Full Body",
        cardio:"20 min brisk walk",
        exercises:[
          {name:"Band Squat",sets:3,reps:"15",rest:"45s",muscle:"Quads/Glutes",tip:"Stand on band, hold at shoulders"},
          {name:"Band Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings/Back",tip:"Keep band taut at bottom"},
          {name:"Band Push-up (band across back)",sets:3,reps:"10-12",rest:"60s",muscle:"Chest/Triceps",tip:"Adds extra resistance at top"},
          {name:"Band Seated Row",sets:3,reps:"12",rest:"60s",muscle:"Back/Biceps",tip:"Loop around feet, sit tall"},
          {name:"Band Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Shoulders",tip:"Control the return"},
          {name:"Band Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"Full extension at bottom"},
          {name:"Band Tricep Overhead Press",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Elbow stays pointing up"},
          {name:"Jumping Jacks",sets:3,reps:"45s",rest:"30s",muscle:"Cardio",tip:"Keep it rhythmic"},
        ]
      }
    }
  },
  // ================= FAT LOSS — BEGINNER =================

// -----------------------------------------------------
// FAT LOSS | BEGINNER | 4 DAYS | GYM
// -----------------------------------------------------
"fat-loss|beginner|4|gym": {
  split:["Upper","Rest","Lower","Rest","Upper","Rest","Lower"],
  days:{
    "Upper":{
      focus:"Upper Body Fat Loss",
      cardio:"15 min incline treadmill walk",
      exercises:[
        {name:"Machine Chest Press",sets:3,reps:"12",rest:"60s",muscle:"Chest",tip:"Control the lowering phase"},
        {name:"Lat Pulldown",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Pull elbows to ribs"},
        {name:"Seated DB Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Brace core"},
        {name:"Cable Row",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Squeeze shoulder blades"},
        {name:"DB Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Avoid swinging"},
        {name:"Cable Tricep Pushdown",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Lock elbows by sides"},
        {name:"Battle Rope",sets:3,reps:"30s",rest:"30s",muscle:"Cardio",tip:"Explosive movement"},
      ]
    },
    "Lower":{
      focus:"Lower Body Fat Burn",
      cardio:"15 min cycling",
      exercises:[
        {name:"Goblet Squat",sets:3,reps:"15",rest:"60s",muscle:"Quads/Glutes",tip:"Chest tall"},
        {name:"Leg Press",sets:3,reps:"12",rest:"60s",muscle:"Quads",tip:"Push through heels"},
        {name:"Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Hip hinge movement"},
        {name:"Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Long controlled steps"},
        {name:"Standing Calf Raise",sets:3,reps:"15",rest:"45s",muscle:"Calves",tip:"Pause at top"},
        {name:"Plank",sets:3,reps:"40s",rest:"30s",muscle:"Core",tip:"Keep body straight"},
        {name:"Jump Rope",sets:3,reps:"45s",rest:"30s",muscle:"Cardio",tip:"Stay light on feet"},
      ]
    }
  }
},

// -----------------------------------------------------
// FAT LOSS | BEGINNER | 5 DAYS | GYM
// -----------------------------------------------------
"fat-loss|beginner|5|gym": {
  split:["Push","Pull","Legs","Rest","Upper","Lower","Rest"],
  days:{
    "Push":{
      focus:"Push Fat Loss",
      cardio:"10 min incline walk",
      exercises:[
        {name:"Bench Press",sets:3,reps:"12",rest:"60s",muscle:"Chest",tip:"Control every rep"},
        {name:"Incline DB Press",sets:3,reps:"12",rest:"60s",muscle:"Upper Chest",tip:"Don't lock elbows"},
        {name:"Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Brace core"},
        {name:"Cable Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Shoulders",tip:"Raise to shoulder level"},
        {name:"Tricep Pushdown",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Elbows fixed"},
      ]
    },
    "Pull":{
      focus:"Pull Fat Burn",
      cardio:"10 min rowing",
      exercises:[
        {name:"Lat Pulldown",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Chest up"},
        {name:"Seated Cable Row",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Pull to waist"},
        {name:"Face Pull",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Pull toward forehead"},
        {name:"DB Hammer Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Neutral grip"},
        {name:"Mountain Climbers",sets:3,reps:"40s",rest:"30s",muscle:"Cardio/Core",tip:"Fast pace"},
      ]
    },
    "Legs":{
      focus:"Leg Fat Burn",
      cardio:"15 min cycling",
      exercises:[
        {name:"Squat",sets:3,reps:"12",rest:"60s",muscle:"Legs",tip:"Depth below parallel"},
        {name:"Leg Press",sets:3,reps:"15",rest:"60s",muscle:"Quads",tip:"Don't lock knees"},
        {name:"Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Slow lowering"},
        {name:"Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Stay balanced"},
        {name:"Standing Calf Raise",sets:3,reps:"15",rest:"45s",muscle:"Calves",tip:"Full stretch"},
      ]
    },
    "Upper":{
      focus:"Upper Conditioning",
      cardio:"15 min treadmill",
      exercises:[
        {name:"Push-ups",sets:3,reps:"15",rest:"45s",muscle:"Chest",tip:"Full range"},
        {name:"Cable Row",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Controlled reps"},
        {name:"DB Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"No momentum"},
        {name:"EZ Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Control lowering"},
        {name:"Battle Rope",sets:3,reps:"30s",rest:"30s",muscle:"Cardio",tip:"Explosive waves"},
      ]
    },
    "Lower":{
      focus:"Lower Conditioning",
      cardio:"15 min incline walk",
      exercises:[
        {name:"Goblet Squat",sets:3,reps:"15",rest:"60s",muscle:"Legs",tip:"Chest tall"},
        {name:"Step-ups",sets:3,reps:"12/leg",rest:"45s",muscle:"Legs",tip:"Drive through heel"},
        {name:"Hip Thrust",sets:3,reps:"12",rest:"60s",muscle:"Glutes",tip:"Pause at top"},
        {name:"Leg Curl",sets:3,reps:"12",rest:"45s",muscle:"Hamstrings",tip:"Slow reps"},
        {name:"Plank",sets:3,reps:"45s",rest:"30s",muscle:"Core",tip:"Tight core"},
      ]
    }
  }
},

// -----------------------------------------------------
// FAT LOSS | BEGINNER | 6 DAYS | GYM
// -----------------------------------------------------
"fat-loss|beginner|6|gym": {
  split:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
  days:{
    "Push":{
      focus:"Push Hypertrophy + Fat Loss",
      cardio:"10 min treadmill",
      exercises:[
        {name:"Bench Press",sets:4,reps:"10-12",rest:"60s",muscle:"Chest",tip:"Control reps"},
        {name:"Incline DB Press",sets:3,reps:"12",rest:"60s",muscle:"Upper Chest",tip:"Stretch fully"},
        {name:"Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Brace core"},
        {name:"Cable Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Slow lowering"},
        {name:"Tricep Pushdown",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Elbows tucked"},
      ]
    },
    "Pull":{
      focus:"Pull Hypertrophy + Fat Loss",
      cardio:"10 min rowing",
      exercises:[
        {name:"Lat Pulldown",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Chest up"},
        {name:"Cable Row",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Pull elbows back"},
        {name:"Face Pull",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"High elbows"},
        {name:"DB Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Slow eccentric"},
        {name:"Hammer Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Neutral grip"},
      ]
    },
    "Legs":{
      focus:"Leg Fat Burn",
      cardio:"15 min cycling",
      exercises:[
        {name:"Squat",sets:4,reps:"10-12",rest:"60s",muscle:"Legs",tip:"Push knees out"},
        {name:"Leg Press",sets:3,reps:"15",rest:"60s",muscle:"Quads",tip:"Don't lock knees"},
        {name:"Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Hip hinge"},
        {name:"Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Stay upright"},
        {name:"Standing Calf Raise",sets:3,reps:"20",rest:"45s",muscle:"Calves",tip:"Pause at top"},
        {name:"Hanging Knee Raise",sets:3,reps:"15",rest:"30s",muscle:"Core",tip:"Control movement"},
      ]
    }
  }
}, 
 // =====================================================
// FAT LOSS | BEGINNER | 4 DAYS | DUMBBELLS
// =====================================================
"fat-loss|beginner|4|dumbbells": {
  split:["Upper","Rest","Lower","Rest","Upper","Rest","Lower"],
  days:{
    "Upper":{
      focus:"Upper Body Dumbbell Fat Loss",
      cardio:"20 min brisk walk",
      exercises:[
        {name:"DB Floor Press",sets:3,reps:"12",rest:"60s",muscle:"Chest",tip:"Control lowering"},
        {name:"DB Bent Over Row",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Back flat"},
        {name:"DB Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Brace core"},
        {name:"DB Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Shoulders",tip:"Small controlled reps"},
        {name:"DB Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"No swinging"},
        {name:"DB Overhead Tricep Extension",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Keep elbows fixed"},
      ]
    },
    "Lower":{
      focus:"Lower Body Dumbbell Fat Burn",
      cardio:"15 min jogging",
      exercises:[
        {name:"DB Goblet Squat",sets:3,reps:"15",rest:"60s",muscle:"Quads/Glutes",tip:"Chest upright"},
        {name:"DB Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Slow lowering"},
        {name:"DB Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Long stride"},
        {name:"DB Step-ups",sets:3,reps:"12/leg",rest:"45s",muscle:"Legs",tip:"Drive through heel"},
        {name:"Standing Calf Raise",sets:3,reps:"20",rest:"30s",muscle:"Calves",tip:"Pause at top"},
        {name:"Plank",sets:3,reps:"45s",rest:"30s",muscle:"Core",tip:"Tight core"},
      ]
    }
  }
},

// =====================================================
// FAT LOSS | BEGINNER | 5 DAYS | DUMBBELLS
// =====================================================
"fat-loss|beginner|5|dumbbells": {
  split:["Push","Pull","Legs","Rest","Upper","Lower","Rest"],
  days:{
    "Push":{
      focus:"Push Dumbbell Workout",
      cardio:"10 min walk",
      exercises:[
        {name:"DB Floor Press",sets:3,reps:"12",rest:"60s",muscle:"Chest",tip:"Full range"},
        {name:"Incline DB Press",sets:3,reps:"12",rest:"60s",muscle:"Upper Chest",tip:"Controlled reps"},
        {name:"DB Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"No momentum"},
        {name:"DB Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Lift to shoulder height"},
        {name:"DB Skull Crusher",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Elbows stable"},
      ]
    },
    "Pull":{
      focus:"Pull Dumbbell Workout",
      cardio:"10 min jog",
      exercises:[
        {name:"DB Bent Over Row",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Flat back"},
        {name:"Single Arm DB Row",sets:3,reps:"12/side",rest:"60s",muscle:"Lats",tip:"Pull to hip"},
        {name:"DB Rear Delt Fly",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Light weight"},
        {name:"DB Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Slow eccentric"},
        {name:"Hammer Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Neutral grip"},
      ]
    },
    "Legs":{
      focus:"Dumbbell Leg Fat Burn",
      cardio:"15 min cycling",
      exercises:[
        {name:"DB Goblet Squat",sets:4,reps:"12",rest:"60s",muscle:"Legs",tip:"Depth below parallel"},
        {name:"DB Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Hip hinge"},
        {name:"DB Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Stay balanced"},
        {name:"DB Step-up",sets:3,reps:"12/leg",rest:"45s",muscle:"Quads",tip:"Control descent"},
        {name:"Standing Calf Raise",sets:3,reps:"20",rest:"30s",muscle:"Calves",tip:"Pause at top"},
      ]
    },
    "Upper":{
      focus:"Upper Conditioning",
      cardio:"15 min brisk walk",
      exercises:[
        {name:"Push-ups",sets:3,reps:"15",rest:"45s",muscle:"Chest",tip:"Body straight"},
        {name:"DB Row",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Squeeze lats"},
        {name:"DB Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Controlled reps"},
        {name:"DB Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"No swinging"},
        {name:"Mountain Climbers",sets:3,reps:"40s",rest:"30s",muscle:"Core/Cardio",tip:"Fast pace"},
      ]
    },
    "Lower":{
      focus:"Lower Conditioning",
      cardio:"15 min jog",
      exercises:[
        {name:"DB Squat",sets:3,reps:"15",rest:"60s",muscle:"Legs",tip:"Chest tall"},
        {name:"DB Lunges",sets:3,reps:"12/leg",rest:"45s",muscle:"Legs",tip:"Controlled reps"},
        {name:"DB Hip Thrust",sets:3,reps:"12",rest:"60s",muscle:"Glutes",tip:"Pause at top"},
        {name:"Glute Bridge",sets:3,reps:"15",rest:"45s",muscle:"Glutes",tip:"Squeeze hard"},
        {name:"Plank",sets:3,reps:"45s",rest:"30s",muscle:"Core",tip:"Keep hips level"},
      ]
    }
  }
},

// =====================================================
// FAT LOSS | BEGINNER | 6 DAYS | DUMBBELLS
// =====================================================
"fat-loss|beginner|6|dumbbells": {
  split:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
  days:{
    "Push":{
      focus:"Push Dumbbell Hypertrophy",
      cardio:"10 min walk",
      exercises:[
        {name:"DB Floor Press",sets:4,reps:"10-12",rest:"60s",muscle:"Chest",tip:"Slow eccentric"},
        {name:"Incline DB Press",sets:3,reps:"12",rest:"60s",muscle:"Chest",tip:"Deep stretch"},
        {name:"DB Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Brace core"},
        {name:"DB Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Controlled motion"},
        {name:"DB Tricep Extension",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Elbows stable"},
      ]
    },
    "Pull":{
      focus:"Pull Dumbbell Hypertrophy",
      cardio:"10 min jogging",
      exercises:[
        {name:"DB Bent Over Row",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Back neutral"},
        {name:"Single Arm DB Row",sets:3,reps:"12/side",rest:"60s",muscle:"Lats",tip:"Row to hip"},
        {name:"DB Rear Delt Fly",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Light weight"},
        {name:"DB Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Slow lowering"},
        {name:"Hammer Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Neutral grip"},
      ]
    },
    "Legs":{
      focus:"Leg Fat Burn",
      cardio:"15 min cycling",
      exercises:[
        {name:"DB Goblet Squat",sets:4,reps:"12",rest:"60s",muscle:"Legs",tip:"Push knees out"},
        {name:"DB Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Hip hinge"},
        {name:"DB Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Stay upright"},
        {name:"DB Step-up",sets:3,reps:"12/leg",rest:"45s",muscle:"Quads",tip:"Drive through heel"},
        {name:"Standing Calf Raise",sets:3,reps:"20",rest:"30s",muscle:"Calves",tip:"Pause at top"},
        {name:"Plank",sets:3,reps:"45s",rest:"30s",muscle:"Core",tip:"Tight core"},
      ]
    }
  }
},  

  "fat-loss|intermediate|4|gym": {
    split:["Upper Body","Lower Body","Rest","Upper Body","Lower Body","Rest","Rest"],
    days:{
      "Upper Body":{
        focus:"Upper Body Superset Circuit",
        cardio:"15 min HIIT treadmill (1min sprint / 2min walk)",
        exercises:[
          {name:"Barbell Bench Press",sets:4,reps:"10-12",rest:"75s",muscle:"Chest",tip:"Control descent 2 seconds"},
          {name:"Cable Row (Superset with Bench)",sets:4,reps:"10-12",rest:"75s",muscle:"Back",tip:"Superset for max calorie burn"},
          {name:"Incline DB Press",sets:3,reps:"12",rest:"60s",muscle:"Upper Chest",tip:"30–45° incline"},
          {name:"Lat Pulldown",sets:3,reps:"12",rest:"60s",muscle:"Back/Lats",tip:"Pull to upper chest"},
          {name:"Dumbbell Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Neutral grip for shoulder health"},
          {name:"Cable Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Unilateral for focus"},
          {name:"EZ-Bar Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Don't swing"},
          {name:"Tricep Rope Pushdown",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Spread rope at bottom"},
        ]
      },
      "Lower Body":{
        focus:"Lower Body Fat Blaster",
        cardio:"20 min stairmill or cycling",
        exercises:[
          {name:"Barbell Back Squat",sets:4,reps:"10-12",rest:"90s",muscle:"Quads/Glutes",tip:"Break parallel for full glute activation"},
          {name:"Romanian Deadlift",sets:4,reps:"10",rest:"90s",muscle:"Hamstrings/Glutes",tip:"Feel the hamstring stretch"},
          {name:"Leg Press",sets:3,reps:"15",rest:"75s",muscle:"Quads",tip:"High foot placement targets glutes"},
          {name:"Leg Curl (Machine)",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Full contraction at top"},
          {name:"Walking Lunges",sets:3,reps:"20 steps",rest:"60s",muscle:"Quads/Glutes",tip:"Long stride for glutes"},
          {name:"Calf Raise (Smith Machine)",sets:4,reps:"20",rest:"45s",muscle:"Calves",tip:"Full range, pause at top"},
          {name:"Cable Kickback",sets:3,reps:"15/side",rest:"45s",muscle:"Glutes",tip:"Keep hips square"},
          {name:"Hanging Leg Raise",sets:3,reps:"15",rest:"45s",muscle:"Core/Lower Abs",tip:"Control the swing"},
        ]
      }
    }
  },

  "fat-loss|intermediate|4|dumbbells": {
    split:["Upper Body","Lower Body","Rest","Upper Body","Lower Body","Rest","Rest"],
    days:{
      "Upper Body":{
        focus:"DB Upper Body Superset",
        cardio:"15 min HIIT intervals (30s on / 30s off)",
        exercises:[
          {name:"DB Bench Press",sets:4,reps:"10-12",rest:"75s",muscle:"Chest",tip:"Full stretch at bottom"},
          {name:"DB Bent-Over Row",sets:4,reps:"10-12",rest:"75s",muscle:"Back",tip:"Superset with bench press"},
          {name:"DB Incline Press",sets:3,reps:"12",rest:"60s",muscle:"Upper Chest",tip:"Controlled tempo"},
          {name:"DB Single Arm Row",sets:3,reps:"12/side",rest:"60s",muscle:"Back",tip:"Rotate torso slightly"},
          {name:"DB Arnold Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Full rotation movement"},
          {name:"DB Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Thumbs slightly down"},
          {name:"DB Hammer Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps/Brachialis",tip:"Neutral grip throughout"},
          {name:"DB Skull Crusher",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Elbows stay fixed"},
        ]
      },
      "Lower Body":{
        focus:"DB Lower Body Burn",
        cardio:"20 min jump rope or stair climbing",
        exercises:[
          {name:"DB Goblet Squat",sets:4,reps:"15",rest:"75s",muscle:"Quads/Glutes",tip:"Elbows inside knees at bottom"},
          {name:"DB Romanian Deadlift",sets:4,reps:"12",rest:"75s",muscle:"Hamstrings",tip:"Hip hinge, not a squat"},
          {name:"DB Reverse Lunge",sets:3,reps:"12/leg",rest:"60s",muscle:"Quads/Glutes",tip:"Front shin stays vertical"},
          {name:"DB Sumo Squat",sets:3,reps:"15",rest:"60s",muscle:"Inner Thigh/Glutes",tip:"Wide stance, toes out 45°"},
          {name:"DB Step-ups",sets:3,reps:"12/leg",rest:"60s",muscle:"Quads/Glutes",tip:"Drive through heel"},
          {name:"Single-Leg DB Deadlift",sets:3,reps:"10/leg",rest:"60s",muscle:"Hamstrings/Balance",tip:"Keep hips level"},
          {name:"Calf Raise (DB)",sets:4,reps:"20",rest:"45s",muscle:"Calves",tip:"Hold DBs at sides"},
          {name:"Ab Crunch",sets:3,reps:"20",rest:"30s",muscle:"Core",tip:"Exhale at top"},
        ]
      }
    }
  },
// =====================================================
// FAT LOSS | BEGINNER | 4 DAYS | BANDS
// =====================================================
"fat-loss|beginner|4|bands": {
  split:["Upper","Rest","Lower","Rest","Upper","Rest","Lower"],
  days:{
    "Upper":{
      focus:"Upper Body Resistance Band Fat Loss",
      cardio:"20 min brisk walk",
      exercises:[
        {name:"Band Chest Press",sets:3,reps:"12-15",rest:"60s",muscle:"Chest",tip:"Press explosively, return slowly"},
        {name:"Band Seated Row",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Squeeze shoulder blades"},
        {name:"Band Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Keep core tight"},
        {name:"Band Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Shoulders",tip:"Control the lowering"},
        {name:"Band Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"Full extension at bottom"},
        {name:"Band Overhead Tricep Extension",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Keep elbows pointing up"},
      ]
    },
    "Lower":{
      focus:"Lower Body Band Fat Burn",
      cardio:"15 min jogging",
      exercises:[
        {name:"Band Squat",sets:3,reps:"15",rest:"60s",muscle:"Quads/Glutes",tip:"Push knees outward"},
        {name:"Band Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Hinge from hips"},
        {name:"Band Reverse Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Controlled movement"},
        {name:"Band Glute Bridge",sets:3,reps:"15",rest:"45s",muscle:"Glutes",tip:"Pause at top"},
        {name:"Band Standing Calf Raise",sets:3,reps:"20",rest:"30s",muscle:"Calves",tip:"Slow tempo"},
        {name:"Plank",sets:3,reps:"45s",rest:"30s",muscle:"Core",tip:"Maintain straight body line"},
      ]
    }
  }
},

// =====================================================
// FAT LOSS | BEGINNER | 5 DAYS | BANDS
// =====================================================
"fat-loss|beginner|5|bands": {
  split:["Push","Pull","Legs","Rest","Upper","Lower","Rest"],
  days:{
    "Push":{
      focus:"Push Resistance Band Workout",
      cardio:"10 min brisk walk",
      exercises:[
        {name:"Band Chest Press",sets:3,reps:"12-15",rest:"60s",muscle:"Chest",tip:"Keep tension throughout"},
        {name:"Band Incline Press",sets:3,reps:"12",rest:"60s",muscle:"Upper Chest",tip:"Press upward angle"},
        {name:"Band Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Brace core"},
        {name:"Band Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Lift to shoulder height"},
        {name:"Band Tricep Pushdown",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Elbows fixed"},
      ]
    },
    "Pull":{
      focus:"Pull Resistance Band Workout",
      cardio:"10 min jog",
      exercises:[
        {name:"Band Seated Row",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Pull elbows back"},
        {name:"Single Arm Band Row",sets:3,reps:"12/side",rest:"60s",muscle:"Lats",tip:"Row toward hip"},
        {name:"Band Face Pull",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Pull toward forehead"},
        {name:"Band Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"Control eccentric"},
        {name:"Hammer Band Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Neutral wrist position"},
      ]
    },
    "Legs":{
      focus:"Band Leg Fat Burn",
      cardio:"15 min cycling or jogging",
      exercises:[
        {name:"Band Squat",sets:4,reps:"15",rest:"60s",muscle:"Legs",tip:"Drive through heels"},
        {name:"Band Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Keep spine neutral"},
        {name:"Band Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Long controlled steps"},
        {name:"Band Glute Bridge",sets:3,reps:"15",rest:"45s",muscle:"Glutes",tip:"Squeeze hard at top"},
        {name:"Band Standing Calf Raise",sets:3,reps:"20",rest:"30s",muscle:"Calves",tip:"Pause at top"},
      ]
    },
    "Upper":{
      focus:"Upper Body Conditioning",
      cardio:"15 min brisk walk",
      exercises:[
        {name:"Band Push-up",sets:3,reps:"12",rest:"45s",muscle:"Chest",tip:"Full range of motion"},
        {name:"Band Row",sets:3,reps:"12",rest:"60s",muscle:"Back",tip:"Squeeze lats"},
        {name:"Band Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Controlled reps"},
        {name:"Band Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"No momentum"},
        {name:"Mountain Climbers",sets:3,reps:"40s",rest:"30s",muscle:"Core/Cardio",tip:"Fast pace"},
      ]
    },
    "Lower":{
      focus:"Lower Body Conditioning",
      cardio:"15 min jogging",
      exercises:[
        {name:"Band Squat",sets:3,reps:"15",rest:"60s",muscle:"Legs",tip:"Chest tall"},
        {name:"Band Reverse Lunges",sets:3,reps:"12/leg",rest:"45s",muscle:"Legs",tip:"Slow reps"},
        {name:"Band Hip Thrust",sets:3,reps:"15",rest:"60s",muscle:"Glutes",tip:"Pause at top"},
        {name:"Band Glute Bridge",sets:3,reps:"15",rest:"45s",muscle:"Glutes",tip:"Maintain tension"},
        {name:"Plank",sets:3,reps:"45s",rest:"30s",muscle:"Core",tip:"Keep hips level"},
      ]
    }
  }
},

// =====================================================
// FAT LOSS | BEGINNER | 6 DAYS | BANDS
// =====================================================
"fat-loss|beginner|6|bands": {
  split:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
  days:{
    "Push":{
      focus:"Push Band Hypertrophy",
      cardio:"10 min brisk walk",
      exercises:[
        {name:"Band Chest Press",sets:4,reps:"12",rest:"60s",muscle:"Chest",tip:"Control return"},
        {name:"Band Incline Press",sets:3,reps:"12",rest:"60s",muscle:"Upper Chest",tip:"Stretch fully"},
        {name:"Band Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Brace core"},
        {name:"Band Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Slow lowering"},
        {name:"Band Overhead Tricep Extension",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Elbows stable"},
      ]
    },
    "Pull":{
      focus:"Pull Band Hypertrophy",
      cardio:"10 min jogging",
      exercises:[
        {name:"Band Seated Row",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Pull elbows back"},
        {name:"Single Arm Band Row",sets:3,reps:"12/side",rest:"60s",muscle:"Lats",tip:"Row to hip"},
        {name:"Band Face Pull",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"High elbows"},
        {name:"Band Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"Controlled movement"},
        {name:"Hammer Band Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps",tip:"Neutral grip"},
      ]
    },
    "Legs":{
      focus:"Band Leg Fat Burn",
      cardio:"15 min cycling or jogging",
      exercises:[
        {name:"Band Squat",sets:4,reps:"15",rest:"60s",muscle:"Legs",tip:"Push knees outward"},
        {name:"Band Romanian Deadlift",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Hip hinge properly"},
        {name:"Band Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Stay upright"},
        {name:"Band Hip Thrust",sets:3,reps:"15",rest:"45s",muscle:"Glutes",tip:"Pause at top"},
        {name:"Band Standing Calf Raise",sets:3,reps:"20",rest:"30s",muscle:"Calves",tip:"Full stretch"},
        {name:"Plank",sets:3,reps:"45s",rest:"30s",muscle:"Core",tip:"Keep abs tight"},
      ]
    }
  }
},


// =====================================================
// FAT LOSS | BEGINNER | 4 DAYS | HOME
// =====================================================
"fat-loss|beginner|4|home": {
  split:["Upper","Rest","Lower","Rest","Upper","Rest","Lower"],
  days:{
    "Upper":{
      focus:"Upper Body Home Fat Loss",
      cardio:"20 min brisk walk or jog",
      exercises:[
        {name:"Push-ups (knees if needed)",sets:3,reps:"10-15",rest:"45s",muscle:"Chest/Triceps",tip:"Body straight like plank"},
        {name:"Pike Push-ups",sets:3,reps:"10-12",rest:"45s",muscle:"Shoulders",tip:"Push head toward floor"},
        {name:"Superman Hold",sets:3,reps:"15",rest:"40s",muscle:"Lower Back",tip:"Lift arms and legs together"},
        {name:"Chair Dips",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Lower slowly"},
        {name:"Arm Circles",sets:3,reps:"40s",rest:"30s",muscle:"Shoulders",tip:"Maintain constant motion"},
        {name:"Plank Shoulder Taps",sets:3,reps:"20",rest:"30s",muscle:"Core",tip:"Keep hips stable"},
      ]
    },
    "Lower":{
      focus:"Lower Body Home Fat Burn",
      cardio:"15 min jogging or stair climbing",
      exercises:[
        {name:"Bodyweight Squat",sets:3,reps:"20",rest:"45s",muscle:"Quads/Glutes",tip:"Chest up"},
        {name:"Reverse Lunges",sets:3,reps:"12/leg",rest:"45s",muscle:"Legs",tip:"Control each rep"},
        {name:"Glute Bridge",sets:3,reps:"20",rest:"45s",muscle:"Glutes",tip:"Pause at top"},
        {name:"Wall Sit",sets:3,reps:"40s",rest:"30s",muscle:"Quads",tip:"Keep thighs parallel"},
        {name:"Calf Raises",sets:3,reps:"20",rest:"30s",muscle:"Calves",tip:"Full stretch"},
        {name:"Mountain Climbers",sets:3,reps:"40s",rest:"30s",muscle:"Core/Cardio",tip:"Fast pace"},
      ]
    }
  }
},

// =====================================================
// FAT LOSS | BEGINNER | 5 DAYS | HOME
// =====================================================
"fat-loss|beginner|5|home": {
  split:["Push","Pull","Legs","Rest","Upper","Lower","Rest"],
  days:{
    "Push":{
      focus:"Push Bodyweight Workout",
      cardio:"10 min brisk walk",
      exercises:[
        {name:"Push-ups",sets:3,reps:"12-15",rest:"45s",muscle:"Chest",tip:"Full range of motion"},
        {name:"Incline Push-ups",sets:3,reps:"15",rest:"45s",muscle:"Upper Chest",tip:"Controlled reps"},
        {name:"Pike Push-ups",sets:3,reps:"10-12",rest:"45s",muscle:"Shoulders",tip:"Push vertically"},
        {name:"Chair Dips",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Lower slowly"},
        {name:"Burpees",sets:3,reps:"10",rest:"60s",muscle:"Full Body/Cardio",tip:"Explosive movement"},
      ]
    },
    "Pull":{
      focus:"Pull Bodyweight Workout",
      cardio:"10 min jogging",
      exercises:[
        {name:"Superman Hold",sets:3,reps:"15",rest:"40s",muscle:"Lower Back",tip:"Lift chest and legs"},
        {name:"Reverse Snow Angels",sets:3,reps:"15",rest:"40s",muscle:"Upper Back",tip:"Controlled motion"},
        {name:"Towel Rows",sets:3,reps:"12",rest:"45s",muscle:"Back",tip:"Pull elbows back"},
        {name:"Doorway Rows",sets:3,reps:"10-12",rest:"45s",muscle:"Lats",tip:"Lean back carefully"},
        {name:"Mountain Climbers",sets:3,reps:"40s",rest:"30s",muscle:"Core/Cardio",tip:"Maintain speed"},
      ]
    },
    "Legs":{
      focus:"Leg Fat Burn",
      cardio:"15 min stair climbing",
      exercises:[
        {name:"Bodyweight Squat",sets:4,reps:"20",rest:"45s",muscle:"Legs",tip:"Push knees outward"},
        {name:"Walking Lunges",sets:3,reps:"12/leg",rest:"45s",muscle:"Legs",tip:"Long steps"},
        {name:"Glute Bridge",sets:3,reps:"20",rest:"45s",muscle:"Glutes",tip:"Squeeze hard"},
        {name:"Wall Sit",sets:3,reps:"45s",rest:"30s",muscle:"Quads",tip:"Stay low"},
        {name:"Calf Raises",sets:3,reps:"20",rest:"30s",muscle:"Calves",tip:"Pause at top"},
      ]
    },
    "Upper":{
      focus:"Upper Body Conditioning",
      cardio:"15 min brisk walk",
      exercises:[
        {name:"Push-ups",sets:3,reps:"15",rest:"45s",muscle:"Chest",tip:"Controlled movement"},
        {name:"Pike Push-ups",sets:3,reps:"12",rest:"45s",muscle:"Shoulders",tip:"Keep hips high"},
        {name:"Chair Dips",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Slow eccentric"},
        {name:"Superman Hold",sets:3,reps:"15",rest:"40s",muscle:"Back",tip:"Lift fully"},
        {name:"High Knees",sets:3,reps:"45s",rest:"30s",muscle:"Cardio",tip:"Drive knees high"},
      ]
    },
    "Lower":{
      focus:"Lower Body Conditioning",
      cardio:"15 min jogging",
      exercises:[
        {name:"Squats",sets:3,reps:"20",rest:"45s",muscle:"Legs",tip:"Chest upright"},
        {name:"Reverse Lunges",sets:3,reps:"12/leg",rest:"45s",muscle:"Legs",tip:"Controlled reps"},
        {name:"Single Leg Glute Bridge",sets:3,reps:"12/leg",rest:"45s",muscle:"Glutes",tip:"Squeeze at top"},
        {name:"Wall Sit",sets:3,reps:"45s",rest:"30s",muscle:"Quads",tip:"Maintain tension"},
        {name:"Plank",sets:3,reps:"45s",rest:"30s",muscle:"Core",tip:"Straight body line"},
      ]
    }
  }
},

// =====================================================
// FAT LOSS | BEGINNER | 6 DAYS | HOME
// =====================================================
"fat-loss|beginner|6|home": {
  split:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
  days:{
    "Push":{
      focus:"Push Bodyweight Hypertrophy",
      cardio:"10 min brisk walk",
      exercises:[
        {name:"Push-ups",sets:4,reps:"12-15",rest:"45s",muscle:"Chest",tip:"Slow eccentric"},
        {name:"Incline Push-ups",sets:3,reps:"15",rest:"45s",muscle:"Upper Chest",tip:"Full stretch"},
        {name:"Pike Push-ups",sets:3,reps:"12",rest:"45s",muscle:"Shoulders",tip:"Vertical pressing motion"},
        {name:"Chair Dips",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Elbows close"},
        {name:"Burpees",sets:3,reps:"12",rest:"60s",muscle:"Full Body/Cardio",tip:"Explosive reps"},
      ]
    },
    "Pull":{
      focus:"Pull Bodyweight Hypertrophy",
      cardio:"10 min jogging",
      exercises:[
        {name:"Superman Hold",sets:4,reps:"15",rest:"40s",muscle:"Lower Back",tip:"Lift fully"},
        {name:"Reverse Snow Angels",sets:3,reps:"15",rest:"40s",muscle:"Upper Back",tip:"Slow controlled reps"},
        {name:"Towel Rows",sets:3,reps:"12",rest:"45s",muscle:"Back",tip:"Pull elbows behind body"},
        {name:"Doorway Rows",sets:3,reps:"12",rest:"45s",muscle:"Lats",tip:"Maintain body tension"},
        {name:"Mountain Climbers",sets:3,reps:"45s",rest:"30s",muscle:"Core/Cardio",tip:"Fast controlled pace"},
      ]
    },
    "Legs":{
      focus:"Bodyweight Leg Fat Burn",
      cardio:"15 min stair climbing",
      exercises:[
        {name:"Bodyweight Squat",sets:4,reps:"20",rest:"45s",muscle:"Legs",tip:"Push knees outward"},
        {name:"Walking Lunges",sets:3,reps:"12/leg",rest:"45s",muscle:"Legs",tip:"Stay upright"},
        {name:"Bulgarian Split Squat",sets:3,reps:"10/leg",rest:"60s",muscle:"Quads/Glutes",tip:"Control descent"},
        {name:"Glute Bridge",sets:3,reps:"20",rest:"45s",muscle:"Glutes",tip:"Pause at top"},
        {name:"Calf Raises",sets:3,reps:"20",rest:"30s",muscle:"Calves",tip:"Full stretch"},
        {name:"Plank",sets:3,reps:"45s",rest:"30s",muscle:"Core",tip:"Keep abs tight"},
      ]
    }
  }
},


  "fat-loss|intermediate|4|home": {
    split:["Upper Body","Lower Body","Rest","Upper Body","Lower Body","Rest","Rest"],
    days:{
      "Upper Body":{
        focus:"Bodyweight Upper Body AMRAP",
        cardio:"15 min HIIT: 30s burpees / 30s rest × 15",
        exercises:[
          {name:"Push-ups",sets:4,reps:"15-20",rest:"60s",muscle:"Chest/Triceps",tip:"Perfect form beats speed"},
          {name:"Diamond Push-ups",sets:3,reps:"10-12",rest:"60s",muscle:"Triceps/Inner Chest",tip:"Hands form a diamond"},
          {name:"Wide Push-ups",sets:3,reps:"12",rest:"60s",muscle:"Outer Chest",tip:"Elbows flared wide"},
          {name:"Pike Push-ups",sets:3,reps:"10",rest:"60s",muscle:"Shoulders",tip:"Hips high, head between arms"},
          {name:"Tricep Dips (Chair)",sets:3,reps:"15",rest:"60s",muscle:"Triceps",tip:"Elbows point back, not wide"},
          {name:"Inverted Row (Table)",sets:3,reps:"12",rest:"60s",muscle:"Back/Biceps",tip:"Pull chest to table edge"},
          {name:"Plank Up-Downs",sets:3,reps:"10/side",rest:"45s",muscle:"Core/Shoulders",tip:"Keep hips level"},
          {name:"Burpee",sets:3,reps:"10",rest:"60s",muscle:"Full Body/Cardio",tip:"Explosive jump at top"},
        ]
      },
      "Lower Body":{
        focus:"Bodyweight Lower Body Blast",
        cardio:"20 min jump rope or jog",
        exercises:[
          {name:"Jump Squat",sets:4,reps:"15",rest:"60s",muscle:"Quads/Glutes/Cardio",tip:"Soft landing, absorb impact"},
          {name:"Bulgarian Split Squat",sets:3,reps:"12/leg",rest:"75s",muscle:"Quads/Glutes",tip:"Rear foot elevated on chair"},
          {name:"Glute Bridge",sets:4,reps:"20",rest:"45s",muscle:"Glutes",tip:"Single leg = harder version"},
          {name:"Wall Sit",sets:3,reps:"45s",rest:"45s",muscle:"Quads",tip:"Thighs parallel to floor"},
          {name:"Lateral Lunges",sets:3,reps:"12/side",rest:"60s",muscle:"Glutes/Inner Thigh",tip:"Keep grounded foot flat"},
          {name:"Single-Leg Calf Raise",sets:4,reps:"20/leg",rest:"30s",muscle:"Calves",tip:"Use wall for balance"},
          {name:"Reverse Crunch",sets:3,reps:"15",rest:"30s",muscle:"Lower Abs",tip:"Lift hips off floor"},
          {name:"Superman",sets:3,reps:"15",rest:"30s",muscle:"Lower Back",tip:"Hold 2 seconds at top"},
        ]
      }
    }
  },
"fat-loss|intermediate|3|home": {
  split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
  days:{
    "Full Body":{
      focus:"Bodyweight Fat Burn Circuit",
      cardio:"20 min HIIT: mountain climbers + jumping jacks",
      exercises:[
        {name:"Push-ups",sets:4,reps:"15-20",rest:"45s",muscle:"Chest/Triceps",tip:"Control every rep"},
        {name:"Jump Squat",sets:4,reps:"15",rest:"45s",muscle:"Legs/Cardio",tip:"Land softly"},
        {name:"Pike Push-ups",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Keep hips high"},
        {name:"Bulgarian Split Squat",sets:3,reps:"12/leg",rest:"60s",muscle:"Glutes/Quads",tip:"Use chair for balance"},
        {name:"Inverted Row (Table)",sets:3,reps:"12",rest:"60s",muscle:"Back/Biceps",tip:"Pull chest upward"},
        {name:"Burpees",sets:3,reps:"12",rest:"45s",muscle:"Full Body",tip:"Explode upward"},
        {name:"Mountain Climbers",sets:3,reps:"30s",rest:"30s",muscle:"Core/Cardio",tip:"Fast controlled pace"},
        {name:"Plank",sets:3,reps:"60s",rest:"30s",muscle:"Core",tip:"Keep body straight"},
      ]
    }
  }
},

"fat-loss|intermediate|5|home": {
  split:["Upper Body","Lower Body","HIIT + Core","Upper Body","Lower Body","Rest","Rest"],
  days:{
    "Upper Body":{
      focus:"Bodyweight Upper Burn",
      cardio:"15 min burpee intervals",
      exercises:[
        {name:"Push-ups",sets:4,reps:"20",rest:"45s",muscle:"Chest",tip:"Full ROM"},
        {name:"Diamond Push-ups",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Keep elbows close"},
        {name:"Pike Push-ups",sets:4,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Head between hands"},
        {name:"Chair Dips",sets:4,reps:"15",rest:"45s",muscle:"Triceps",tip:"Lower slowly"},
        {name:"Inverted Row",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Chest to table"},
        {name:"Burpees",sets:3,reps:"15",rest:"45s",muscle:"Full Body",tip:"Stay explosive"},
      ]
    },

    "Lower Body":{
      focus:"Lower Body Conditioning",
      cardio:"20 min jump rope",
      exercises:[
        {name:"Jump Squats",sets:4,reps:"15",rest:"45s",muscle:"Quads",tip:"Explode upward"},
        {name:"Walking Lunges",sets:4,reps:"14/leg",rest:"60s",muscle:"Legs",tip:"Long stride"},
        {name:"Bulgarian Split Squat",sets:3,reps:"12",rest:"60s",muscle:"Glutes",tip:"Knee stable"},
        {name:"Glute Bridge",sets:4,reps:"20",rest:"45s",muscle:"Glutes",tip:"Pause at top"},
        {name:"Wall Sit",sets:3,reps:"60s",rest:"45s",muscle:"Quads",tip:"Back flat"},
        {name:"Single-Leg Calf Raise",sets:4,reps:"20",rest:"30s",muscle:"Calves",tip:"Full stretch"},
      ]
    },

    "HIIT + Core":{
      focus:"Fat Burn Core Circuit",
      cardio:"25 min HIIT",
      exercises:[
        {name:"Mountain Climbers",sets:4,reps:"40s",rest:"20s",muscle:"Core/Cardio",tip:"Fast pace"},
        {name:"High Knees",sets:4,reps:"40s",rest:"20s",muscle:"Cardio",tip:"Drive knees high"},
        {name:"Plank Up-Downs",sets:3,reps:"12",rest:"30s",muscle:"Core/Shoulders",tip:"Avoid hip rotation"},
        {name:"Russian Twists",sets:3,reps:"20",rest:"30s",muscle:"Obliques",tip:"Twist fully"},
        {name:"Reverse Crunch",sets:3,reps:"15",rest:"30s",muscle:"Lower Abs",tip:"Lift hips"},
        {name:"Burpees",sets:3,reps:"15",rest:"45s",muscle:"Full Body",tip:"Explosive movement"},
      ]
    }
  }
},

"fat-loss|intermediate|6|home": {
  split:["Push","Pull","Legs","HIIT + Core","Upper","Lower","Rest"],
  days:{
    "Push":{
      focus:"Push Fat Burn",
      cardio:"15 min jump rope",
      exercises:[
        {name:"Push-ups",sets:4,reps:"20",rest:"45s",muscle:"Chest",tip:"Controlled reps"},
        {name:"Diamond Push-ups",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Hands close"},
        {name:"Pike Push-ups",sets:4,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Keep hips elevated"},
        {name:"Chair Dips",sets:4,reps:"15",rest:"45s",muscle:"Triceps",tip:"Elbows backward"},
      ]
    },

    "Pull":{
      focus:"Back & Biceps",
      cardio:"10 min HIIT",
      exercises:[
        {name:"Inverted Row",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Pull chest upward"},
        {name:"Superman",sets:4,reps:"15",rest:"30s",muscle:"Lower Back",tip:"Pause at top"},
        {name:"Towel Rows",sets:3,reps:"15",rest:"45s",muscle:"Lats",tip:"Pull hard"},
        {name:"Reverse Snow Angels",sets:3,reps:"15",rest:"30s",muscle:"Rear Delts",tip:"Slow movement"},
      ]
    },

    "Legs":{
      focus:"Leg Conditioning",
      cardio:"20 min jog",
      exercises:[
        {name:"Jump Squats",sets:4,reps:"15",rest:"45s",muscle:"Legs",tip:"Soft landing"},
        {name:"Bulgarian Split Squat",sets:4,reps:"12",rest:"60s",muscle:"Glutes",tip:"Stable balance"},
        {name:"Wall Sit",sets:3,reps:"60s",rest:"45s",muscle:"Quads",tip:"Parallel thighs"},
        {name:"Walking Lunges",sets:4,reps:"14/leg",rest:"60s",muscle:"Legs",tip:"Long controlled stride"},
      ]
    },

    "HIIT + Core":{
      focus:"Conditioning",
      cardio:"25 min full HIIT",
      exercises:[
        {name:"Burpees",sets:4,reps:"15",rest:"45s",muscle:"Full Body",tip:"Stay explosive"},
        {name:"Mountain Climbers",sets:4,reps:"40s",rest:"20s",muscle:"Core",tip:"Fast pace"},
        {name:"Plank",sets:4,reps:"60s",rest:"30s",muscle:"Core",tip:"Neutral spine"},
        {name:"Russian Twists",sets:3,reps:"20",rest:"30s",muscle:"Obliques",tip:"Full twist"},
      ]
    },

    "Upper":{
      focus:"Upper Body Volume",
      cardio:"15 min brisk cardio",
      exercises:[
        {name:"Wide Push-ups",sets:4,reps:"15",rest:"45s",muscle:"Chest",tip:"Wide hand position"},
        {name:"Pike Push-ups",sets:3,reps:"12",rest:"45s",muscle:"Shoulders",tip:"Controlled lowering"},
        {name:"Inverted Row",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Chest to edge"},
        {name:"Chair Dips",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Slow negative"},
      ]
    },

    "Lower":{
      focus:"Lower Body Burn",
      cardio:"20 min jump rope",
      exercises:[
        {name:"Glute Bridge",sets:4,reps:"20",rest:"45s",muscle:"Glutes",tip:"Squeeze hard"},
        {name:"Lateral Lunges",sets:3,reps:"12",rest:"45s",muscle:"Inner Thigh",tip:"Stay low"},
        {name:"Single-Leg Calf Raise",sets:4,reps:"20",rest:"30s",muscle:"Calves",tip:"Full ROM"},
        {name:"Reverse Crunch",sets:3,reps:"15",rest:"30s",muscle:"Abs",tip:"Lift hips"},
      ]
    }
  }
},
"fat-loss|intermediate|3|dumbbells": {
  split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
  days:{
    "Full Body":{
      focus:"Dumbbell Fat Burn",
      cardio:"20 min incline walk",
      exercises:[
        {name:"DB Goblet Squat",sets:4,reps:"15",rest:"60s",muscle:"Quads/Glutes",tip:"Keep chest upright"},
        {name:"DB Bench Press",sets:4,reps:"12",rest:"60s",muscle:"Chest",tip:"Control negative"},
        {name:"DB Bent Over Row",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Flat back"},
        {name:"DB Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Do not arch lower back"},
        {name:"DB Romanian Deadlift",sets:4,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Stretch hamstrings"},
        {name:"DB Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Long stride"},
        {name:"DB Russian Twist",sets:3,reps:"20",rest:"30s",muscle:"Core",tip:"Rotate fully"},
      ]
    }
  }
},

"fat-loss|intermediate|4|dumbbells": {
  split:["Upper","Lower","Rest","Upper","Lower","Rest","Rest"],
  days:{
    "Upper":{
      focus:"Upper Body Fat Loss",
      cardio:"15 min HIIT bike",
      exercises:[
        {name:"DB Bench Press",sets:4,reps:"12",rest:"60s",muscle:"Chest",tip:"Control reps"},
        {name:"DB Incline Press",sets:3,reps:"12",rest:"60s",muscle:"Upper Chest",tip:"Do not lock elbows"},
        {name:"DB Row",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Pull elbow back"},
        {name:"DB Shoulder Press",sets:4,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Brace core"},
        {name:"DB Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"Avoid swinging"},
        {name:"DB Skull Crusher",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Elbows fixed"},
      ]
    },

    "Lower":{
      focus:"Lower Body Burn",
      cardio:"20 min treadmill walk",
      exercises:[
        {name:"DB Goblet Squat",sets:4,reps:"15",rest:"60s",muscle:"Quads",tip:"Go deep"},
        {name:"DB Romanian Deadlift",sets:4,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Hip hinge"},
        {name:"DB Reverse Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Glutes",tip:"Push through heel"},
        {name:"DB Step-ups",sets:3,reps:"12",rest:"60s",muscle:"Legs",tip:"Drive knee up"},
        {name:"Standing Calf Raise",sets:4,reps:"20",rest:"30s",muscle:"Calves",tip:"Pause at top"},
        {name:"Leg Raise",sets:3,reps:"15",rest:"30s",muscle:"Abs",tip:"Lower slowly"},
      ]
    }
  }
},

"fat-loss|intermediate|5|dumbbells": {
  split:["Push","Pull","Legs","Upper","Lower","Rest","Rest"],
  days:{
    "Push":{
      focus:"Push Hypertrophy",
      cardio:"15 min incline walk",
      exercises:[
        {name:"DB Bench Press",sets:4,reps:"12",rest:"60s",muscle:"Chest",tip:"Controlled tempo"},
        {name:"DB Shoulder Press",sets:4,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Core tight"},
        {name:"DB Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Raise to shoulder level"},
        {name:"DB Skull Crusher",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Slow negative"},
      ]
    },

    "Pull":{
      focus:"Back & Biceps",
      cardio:"10 min rowing",
      exercises:[
        {name:"DB Row",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Squeeze lats"},
        {name:"DB Rear Delt Fly",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Light weight"},
        {name:"DB Hammer Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"Neutral grip"},
        {name:"DB Shrugs",sets:4,reps:"15",rest:"45s",muscle:"Traps",tip:"Pause at top"},
      ]
    },

    "Legs":{
      focus:"Leg Conditioning",
      cardio:"20 min treadmill",
      exercises:[
        {name:"DB Goblet Squat",sets:4,reps:"15",rest:"60s",muscle:"Quads",tip:"Chest up"},
        {name:"DB Romanian Deadlift",sets:4,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Hip hinge"},
        {name:"DB Walking Lunges",sets:3,reps:"12",rest:"60s",muscle:"Legs",tip:"Controlled stride"},
        {name:"DB Calf Raise",sets:4,reps:"20",rest:"30s",muscle:"Calves",tip:"Stretch fully"},
      ]
    },

    "Upper":{
      focus:"Upper Body Volume",
      cardio:"15 min HIIT",
      exercises:[
        {name:"DB Incline Press",sets:4,reps:"12",rest:"60s",muscle:"Chest",tip:"Full ROM"},
        {name:"DB Row",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Squeeze back"},
        {name:"DB Arnold Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Rotate smoothly"},
        {name:"DB Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"No swinging"},
      ]
    },

    "Lower":{
      focus:"Lower Burn",
      cardio:"20 min bike",
      exercises:[
        {name:"DB Sumo Squat",sets:4,reps:"15",rest:"60s",muscle:"Inner Thigh",tip:"Wide stance"},
        {name:"DB Step-ups",sets:3,reps:"12",rest:"60s",muscle:"Legs",tip:"Drive through heel"},
        {name:"Glute Bridge",sets:4,reps:"20",rest:"45s",muscle:"Glutes",tip:"Pause at top"},
        {name:"Reverse Crunch",sets:3,reps:"15",rest:"30s",muscle:"Abs",tip:"Lift hips"},
      ]
    }
  }
},

"fat-loss|intermediate|6|dumbbells": {
  split:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
  days:{
    "Push":{
      focus:"Chest Shoulders Triceps",
      cardio:"15 min incline walk",
      exercises:[
        {name:"DB Bench Press",sets:4,reps:"12"},
        {name:"DB Incline Press",sets:4,reps:"12"},
        {name:"DB Shoulder Press",sets:4,reps:"12"},
        {name:"DB Lateral Raise",sets:3,reps:"15"},
        {name:"DB Skull Crusher",sets:3,reps:"15"},
      ]
    },

    "Pull":{
      focus:"Back Biceps",
      cardio:"15 min rower",
      exercises:[
        {name:"DB Row",sets:4,reps:"12"},
        {name:"DB Rear Delt Fly",sets:3,reps:"15"},
        {name:"DB Shrugs",sets:4,reps:"15"},
        {name:"DB Curl",sets:3,reps:"15"},
        {name:"DB Hammer Curl",sets:3,reps:"15"},
      ]
    },

    "Legs":{
      focus:"Leg Fat Burn",
      cardio:"20 min cycling",
      exercises:[
        {name:"DB Goblet Squat",sets:4,reps:"15"},
        {name:"DB Romanian Deadlift",sets:4,reps:"12"},
        {name:"DB Walking Lunges",sets:3,reps:"12/leg"},
        {name:"DB Step-ups",sets:3,reps:"12"},
        {name:"DB Calf Raise",sets:4,reps:"20"},
      ]
    }
  }
},

"fat-loss|intermediate|3|bands": {
  split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
  days:{
    "Full Body":{
      focus:"Resistance Band Fat Burn",
      cardio:"20 min jump rope",
      exercises:[
        {name:"Band Squat",sets:4,reps:"15"},
        {name:"Band Chest Press",sets:4,reps:"15"},
        {name:"Band Row",sets:4,reps:"15"},
        {name:"Band Shoulder Press",sets:3,reps:"15"},
        {name:"Band Deadlift",sets:4,reps:"15"},
        {name:"Band Curl",sets:3,reps:"15"},
        {name:"Band Tricep Pushdown",sets:3,reps:"15"},
      ]
    }
  }
},

"fat-loss|intermediate|4|bands": {
  split:["Upper","Lower","Rest","Upper","Lower","Rest","Rest"],
  days:{
    "Upper":{
      focus:"Upper Band Workout",
      cardio:"15 min HIIT",
      exercises:[
        {name:"Band Chest Press",sets:4,reps:"15"},
        {name:"Band Row",sets:4,reps:"15"},
        {name:"Band Shoulder Press",sets:4,reps:"15"},
        {name:"Band Lateral Raise",sets:3,reps:"15"},
        {name:"Band Curl",sets:3,reps:"15"},
        {name:"Band Tricep Pushdown",sets:3,reps:"15"},
      ]
    },

    "Lower":{
      focus:"Lower Body Bands",
      cardio:"20 min brisk walk",
      exercises:[
        {name:"Band Squat",sets:4,reps:"15"},
        {name:"Band Romanian Deadlift",sets:4,reps:"15"},
        {name:"Band Lunges",sets:3,reps:"12/leg"},
        {name:"Band Glute Bridge",sets:4,reps:"20"},
        {name:"Band Calf Raise",sets:4,reps:"20"},
        {name:"Leg Raise",sets:3,reps:"15"},
      ]
    }
  }
},

"fat-loss|intermediate|5|bands": {
  split:["Push","Pull","Legs","Upper","Lower","Rest","Rest"],
  days:{
    "Push":{
      focus:"Band Push Day",
      cardio:"15 min HIIT",
      exercises:[
        {name:"Band Chest Press",sets:4,reps:"15"},
        {name:"Band Shoulder Press",sets:4,reps:"15"},
        {name:"Band Lateral Raise",sets:3,reps:"15"},
        {name:"Band Tricep Extension",sets:3,reps:"15"},
      ]
    },

    "Pull":{
      focus:"Band Pull Day",
      cardio:"15 min rower",
      exercises:[
        {name:"Band Row",sets:4,reps:"15"},
        {name:"Band Face Pull",sets:3,reps:"15"},
        {name:"Band Curl",sets:3,reps:"15"},
        {name:"Band Shrugs",sets:4,reps:"15"},
      ]
    },

    "Legs":{
      focus:"Band Legs",
      cardio:"20 min walk",
      exercises:[
        {name:"Band Squat",sets:4,reps:"15"},
        {name:"Band RDL",sets:4,reps:"15"},
        {name:"Band Lunges",sets:3,reps:"12"},
        {name:"Band Glute Bridge",sets:4,reps:"20"},
      ]
    }
  }
},

"fat-loss|intermediate|6|bands": {
  split:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
  days:{
    "Push":{
      focus:"Push Bands",
      exercises:[
        {name:"Band Chest Press",sets:4,reps:"15"},
        {name:"Band Shoulder Press",sets:4,reps:"15"},
        {name:"Band Lateral Raise",sets:3,reps:"15"},
        {name:"Band Tricep Extension",sets:3,reps:"15"},
      ]
    },

    "Pull":{
      focus:"Pull Bands",
      exercises:[
        {name:"Band Row",sets:4,reps:"15"},
        {name:"Band Face Pull",sets:3,reps:"15"},
        {name:"Band Curl",sets:3,reps:"15"},
        {name:"Band Shrugs",sets:4,reps:"15"},
      ]
    },

    "Legs":{
      focus:"Legs Bands",
      exercises:[
        {name:"Band Squat",sets:4,reps:"15"},
        {name:"Band RDL",sets:4,reps:"15"},
        {name:"Band Lunges",sets:3,reps:"12"},
        {name:"Band Calf Raise",sets:4,reps:"20"},
      ]
    }
  }
},
"fat-loss|intermediate|3|gym": {
  split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
  days:{
    "Full Body":{
      focus:"Full Body Fat Burn",
      cardio:"20 min incline treadmill walk",
      exercises:[
        {name:"Barbell Squat",sets:4,reps:"10-12",rest:"75s",muscle:"Quads/Glutes",tip:"Keep core tight"},
        {name:"Bench Press",sets:4,reps:"10-12",rest:"75s",muscle:"Chest",tip:"Control bar path"},
        {name:"Lat Pulldown",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Pull elbows down"},
        {name:"Romanian Deadlift",sets:4,reps:"12",rest:"75s",muscle:"Hamstrings",tip:"Hip hinge movement"},
        {name:"Seated Shoulder Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Avoid arching back"},
        {name:"Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Long controlled stride"},
        {name:"Cable Crunch",sets:3,reps:"15",rest:"45s",muscle:"Abs",tip:"Crunch fully"},
      ]
    }
  }
},

"fat-loss|intermediate|4|gym": {
  split:["Upper","Lower","Rest","Upper","Lower","Rest","Rest"],
  days:{
    "Upper":{
      focus:"Upper Body Fat Loss",
      cardio:"15 min HIIT bike",
      exercises:[
        {name:"Bench Press",sets:4,reps:"10-12",rest:"75s",muscle:"Chest",tip:"Controlled tempo"},
        {name:"Incline Dumbbell Press",sets:3,reps:"12",rest:"60s",muscle:"Upper Chest",tip:"Full range"},
        {name:"Barbell Row",sets:4,reps:"10-12",rest:"75s",muscle:"Back",tip:"Squeeze shoulder blades"},
        {name:"Lat Pulldown",sets:3,reps:"12",rest:"60s",muscle:"Lats",tip:"Avoid swinging"},
        {name:"Seated Shoulder Press",sets:4,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Brace core"},
        {name:"Cable Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"No momentum"},
        {name:"Tricep Rope Pushdown",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Extend fully"},
      ]
    },

    "Lower":{
      focus:"Lower Body Conditioning",
      cardio:"20 min incline treadmill",
      exercises:[
        {name:"Barbell Squat",sets:4,reps:"10",rest:"75s",muscle:"Quads",tip:"Go below parallel"},
        {name:"Romanian Deadlift",sets:4,reps:"12",rest:"75s",muscle:"Hamstrings",tip:"Stretch hamstrings"},
        {name:"Leg Press",sets:4,reps:"15",rest:"60s",muscle:"Quads",tip:"Do not lock knees"},
        {name:"Walking Lunges",sets:3,reps:"12/leg",rest:"60s",muscle:"Glutes",tip:"Push through heel"},
        {name:"Leg Curl",sets:3,reps:"15",rest:"45s",muscle:"Hamstrings",tip:"Control lowering"},
        {name:"Standing Calf Raise",sets:4,reps:"20",rest:"30s",muscle:"Calves",tip:"Pause at top"},
        {name:"Hanging Leg Raise",sets:3,reps:"15",rest:"30s",muscle:"Abs",tip:"Avoid swinging"},
      ]
    }
  }
},

"fat-loss|intermediate|5|gym": {
  split:["Push","Pull","Legs","Upper","Lower","Rest","Rest"],
  days:{
    "Push":{
      focus:"Push Hypertrophy",
      cardio:"15 min stair climber",
      exercises:[
        {name:"Bench Press",sets:4,reps:"10",rest:"75s",muscle:"Chest",tip:"Drive through chest"},
        {name:"Incline Dumbbell Press",sets:4,reps:"12",rest:"60s",muscle:"Upper Chest",tip:"Slow eccentric"},
        {name:"Seated Shoulder Press",sets:4,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Do not arch"},
        {name:"Cable Lateral Raise",sets:3,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Raise to shoulder height"},
        {name:"Dips",sets:3,reps:"12",rest:"60s",muscle:"Triceps",tip:"Lean slightly forward"},
        {name:"Tricep Rope Pushdown",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Full extension"},
      ]
    },

    "Pull":{
      focus:"Back & Biceps",
      cardio:"15 min rowing machine",
      exercises:[
        {name:"Deadlift",sets:4,reps:"6-8",rest:"90s",muscle:"Posterior Chain",tip:"Keep spine neutral"},
        {name:"Pull-ups",sets:4,reps:"10",rest:"75s",muscle:"Lats",tip:"Chest to bar"},
        {name:"Barbell Row",sets:4,reps:"10",rest:"75s",muscle:"Back",tip:"Pull toward waist"},
        {name:"Seated Cable Row",sets:3,reps:"12",rest:"60s",muscle:"Mid Back",tip:"Squeeze shoulder blades"},
        {name:"Face Pull",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Pull toward forehead"},
        {name:"EZ Bar Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"Elbows fixed"},
      ]
    },

    "Legs":{
      focus:"Leg Fat Burn",
      cardio:"20 min cycling",
      exercises:[
        {name:"Barbell Squat",sets:4,reps:"10",rest:"75s",muscle:"Quads",tip:"Chest up"},
        {name:"Romanian Deadlift",sets:4,reps:"12",rest:"75s",muscle:"Hamstrings",tip:"Hip hinge"},
        {name:"Leg Press",sets:4,reps:"15",rest:"60s",muscle:"Quads",tip:"Controlled reps"},
        {name:"Bulgarian Split Squat",sets:3,reps:"12",rest:"60s",muscle:"Glutes",tip:"Stay balanced"},
        {name:"Leg Curl",sets:3,reps:"15",rest:"45s",muscle:"Hamstrings",tip:"Slow lowering"},
        {name:"Seated Calf Raise",sets:4,reps:"20",rest:"30s",muscle:"Calves",tip:"Pause at top"},
      ]
    },

    "Upper":{
      focus:"Upper Volume Day",
      cardio:"15 min HIIT treadmill",
      exercises:[
        {name:"Incline Bench Press",sets:4,reps:"10",rest:"75s",muscle:"Chest",tip:"Controlled motion"},
        {name:"Lat Pulldown",sets:4,reps:"12",rest:"60s",muscle:"Back",tip:"Elbows down"},
        {name:"Arnold Press",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Rotate smoothly"},
        {name:"Cable Fly",sets:3,reps:"15",rest:"45s",muscle:"Chest",tip:"Squeeze chest"},
        {name:"Hammer Curl",sets:3,reps:"15",rest:"45s",muscle:"Biceps",tip:"Neutral grip"},
        {name:"Overhead Rope Extension",sets:3,reps:"15",rest:"45s",muscle:"Triceps",tip:"Stretch fully"},
      ]
    },

    "Lower":{
      focus:"Lower Conditioning",
      cardio:"20 min incline walk",
      exercises:[
        {name:"Front Squat",sets:4,reps:"10",rest:"75s",muscle:"Quads",tip:"Elbows high"},
        {name:"Walking Lunges",sets:4,reps:"12/leg",rest:"60s",muscle:"Legs",tip:"Long stride"},
        {name:"Hip Thrust",sets:4,reps:"12",rest:"60s",muscle:"Glutes",tip:"Pause at top"},
        {name:"Leg Extension",sets:3,reps:"15",rest:"45s",muscle:"Quads",tip:"Controlled squeeze"},
        {name:"Standing Calf Raise",sets:4,reps:"20",rest:"30s",muscle:"Calves",tip:"Full ROM"},
        {name:"Cable Crunch",sets:3,reps:"15",rest:"30s",muscle:"Abs",tip:"Crunch fully"},
      ]
    }
  }
},

"fat-loss|intermediate|6|gym": {
  split:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
  days:{
    "Push":{
      focus:"Chest Shoulders Triceps",
      cardio:"15 min stair climber",
      exercises:[
        {name:"Bench Press",sets:4,reps:"10",rest:"75s"},
        {name:"Incline Dumbbell Press",sets:4,reps:"12",rest:"60s"},
        {name:"Overhead Press",sets:4,reps:"10",rest:"60s"},
        {name:"Cable Lateral Raise",sets:3,reps:"15",rest:"45s"},
        {name:"Dips",sets:3,reps:"12",rest:"60s"},
        {name:"Tricep Pushdown",sets:3,reps:"15",rest:"45s"},
      ]
    },

    "Pull":{
      focus:"Back Biceps",
      cardio:"15 min rowing machine",
      exercises:[
        {name:"Deadlift",sets:4,reps:"6-8",rest:"90s"},
        {name:"Pull-ups",sets:4,reps:"10",rest:"75s"},
        {name:"Barbell Row",sets:4,reps:"10",rest:"75s"},
        {name:"Seated Cable Row",sets:3,reps:"12",rest:"60s"},
        {name:"Face Pull",sets:3,reps:"15",rest:"45s"},
        {name:"EZ Bar Curl",sets:3,reps:"15",rest:"45s"},
      ]
    },

    "Legs":{
      focus:"Leg Conditioning",
      cardio:"20 min incline treadmill",
      exercises:[
        {name:"Squat",sets:4,reps:"10",rest:"75s"},
        {name:"Romanian Deadlift",sets:4,reps:"12",rest:"75s"},
        {name:"Leg Press",sets:4,reps:"15",rest:"60s"},
        {name:"Walking Lunges",sets:3,reps:"12/leg",rest:"60s"},
        {name:"Leg Curl",sets:3,reps:"15",rest:"45s"},
        {name:"Standing Calf Raise",sets:4,reps:"20",rest:"30s"},
      ]
    }
  }
},
  "fat-loss|advanced|5|gym": {
    split:["Push","Pull","Legs","Push","Pull","Rest","Rest"],
    days:{
      "Push":{
        focus:"Push Day — Chest / Shoulders / Triceps",
        cardio:"10 min HIIT cycle sprint post-workout",
        exercises:[
          {name:"Flat Barbell Bench Press",sets:5,reps:"8-10",rest:"90s",muscle:"Chest",tip:"Arch back slightly, feet flat"},
          {name:"Incline DB Press",sets:4,reps:"10",rest:"75s",muscle:"Upper Chest",tip:"Touch DBs at top"},
          {name:"Cable Fly",sets:3,reps:"12-15",rest:"60s",muscle:"Chest",tip:"Keep slight bend in elbows"},
          {name:"Seated DB Shoulder Press",sets:4,reps:"10",rest:"75s",muscle:"Shoulders",tip:"Don't lock out at top"},
          {name:"Cable Lateral Raise",sets:4,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Unilateral, cross-body cable"},
          {name:"Rear Delt Fly (Pec Deck Reverse)",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Slight forward lean"},
          {name:"Skull Crushers",sets:4,reps:"10-12",rest:"60s",muscle:"Triceps",tip:"Bar to forehead, elbows fixed"},
          {name:"Tricep V-Bar Pushdown",sets:3,reps:"12-15",rest:"45s",muscle:"Triceps",tip:"Lean slightly forward"},
        ]
      },
      "Pull":{
        focus:"Pull Day — Back / Biceps",
        cardio:"15 min rowing machine",
        exercises:[
          {name:"Weighted Pull-ups",sets:5,reps:"6-8",rest:"120s",muscle:"Lats/Back",tip:"Full dead hang each rep"},
          {name:"Barbell Row",sets:4,reps:"8-10",rest:"90s",muscle:"Mid Back",tip:"45° torso angle, row to belly"},
          {name:"Seated Cable Row (Wide Grip)",sets:4,reps:"10-12",rest:"75s",muscle:"Upper Back",tip:"Elbows flared wide"},
          {name:"Single-Arm Cable Row",sets:3,reps:"12/side",rest:"60s",muscle:"Back/Biceps",tip:"Full rotation at bottom"},
          {name:"Face Pull",sets:4,reps:"15",rest:"45s",muscle:"Rear Delt/Rotator Cuff",tip:"Pull to face, thumbs back"},
          {name:"Barbell Curl",sets:4,reps:"10",rest:"60s",muscle:"Biceps",tip:"Squeeze hard at top"},
          {name:"Incline DB Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps Long Head",tip:"Full stretch at bottom"},
          {name:"Hammer Curl",sets:3,reps:"12",rest:"45s",muscle:"Brachialis",tip:"Neutral wrist, slow tempo"},
        ]
      },
      "Legs":{
        focus:"Leg Day — Quads / Hamstrings / Glutes / Calves",
        cardio:"20 min stairmill at moderate pace",
        exercises:[
          {name:"Barbell Back Squat",sets:5,reps:"8-10",rest:"120s",muscle:"Quads/Glutes",tip:"Brace core, big breath before descent"},
          {name:"Romanian Deadlift",sets:4,reps:"10",rest:"90s",muscle:"Hamstrings",tip:"Bar drags down shins"},
          {name:"Leg Press",sets:4,reps:"12-15",rest:"75s",muscle:"Quads",tip:"Don't lock knees at top"},
          {name:"Walking Lunges (Barbell)",sets:3,reps:"16 steps",rest:"75s",muscle:"Quads/Glutes",tip:"Long powerful strides"},
          {name:"Leg Curl",sets:4,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Point toes slightly inward"},
          {name:"Hip Thrust (Barbell)",sets:4,reps:"12",rest:"75s",muscle:"Glutes",tip:"Drive hips to ceiling"},
          {name:"Standing Calf Raise",sets:5,reps:"20",rest:"30s",muscle:"Calves",tip:"Pause 2s at top"},
          {name:"Ab Wheel Rollout",sets:3,reps:"10-12",rest:"45s",muscle:"Core",tip:"Brace hard, slow return"},
        ]
      }
    }
  },
  "fat-loss|advanced|5|dumbbells": {
    split:["Push","Pull","Legs","Push","Pull","Rest","Rest"],
    days:{
      "Push":{
        focus:"Advanced DB Push",
        cardio:"15 min AMRAP burpees/jump squats",
        exercises:[
          {name:"DB Bench Press",sets:5,reps:"8-10",rest:"90s",muscle:"Chest",tip:"Full stretch at bottom"},
          {name:"DB Incline Press",sets:4,reps:"10",rest:"75s",muscle:"Upper Chest",tip:"Slow 3-sec descent"},
          {name:"DB Fly",sets:3,reps:"12",rest:"60s",muscle:"Chest",tip:"Arc motion, squeeze at top"},
          {name:"DB Arnold Press",sets:4,reps:"10",rest:"75s",muscle:"Shoulders",tip:"Start with palms facing you"},
          {name:"DB Lateral Raise",sets:4,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Slight forward lean helps"},
          {name:"DB Front Raise",sets:3,reps:"12",rest:"45s",muscle:"Front Delts",tip:"Alternate arms"},
          {name:"DB Skull Crusher",sets:4,reps:"10",rest:"60s",muscle:"Triceps",tip:"Elbows don't flare"},
          {name:"DB Kickback",sets:3,reps:"15/side",rest:"45s",muscle:"Triceps",tip:"Extend fully, squeeze hard"},
        ]
      },
      "Pull":{
        focus:"Advanced DB Pull",
        cardio:"15 min jump rope intervals",
        exercises:[
          {name:"DB Pullover",sets:4,reps:"12",rest:"75s",muscle:"Lats/Chest",tip:"Arch back slightly on bench"},
          {name:"DB Bent-Over Row",sets:4,reps:"10",rest:"75s",muscle:"Back",tip:"Pause 1s at top"},
          {name:"DB Single Arm Row",sets:4,reps:"10/side",rest:"60s",muscle:"Back",tip:"Full retraction"},
          {name:"DB Reverse Fly",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Bent 90° at hips"},
          {name:"DB Shrug",sets:4,reps:"15",rest:"45s",muscle:"Traps",tip:"Straight up, not circular"},
          {name:"DB Bicep Curl",sets:4,reps:"10",rest:"60s",muscle:"Biceps",tip:"Supinate at top"},
          {name:"DB Incline Curl",sets:3,reps:"12",rest:"45s",muscle:"Biceps Long Head",tip:"Arms hang straight down"},
          {name:"DB Zottman Curl",sets:3,reps:"10",rest:"45s",muscle:"Biceps/Brachialis",tip:"Pronate on way down"},
        ]
      },
      "Legs":{
        focus:"Advanced DB Legs",
        cardio:"20 min hill walk or jump rope",
        exercises:[
          {name:"DB Goblet Squat",sets:5,reps:"12-15",rest:"90s",muscle:"Quads/Glutes",tip:"Pause 2s at bottom"},
          {name:"DB Romanian Deadlift",sets:4,reps:"12",rest:"75s",muscle:"Hamstrings",tip:"Feel the hamstring pull"},
          {name:"DB Bulgarian Split Squat",sets:4,reps:"10/leg",rest:"90s",muscle:"Quads/Glutes",tip:"Hardest single-leg exercise"},
          {name:"DB Step-up",sets:3,reps:"12/leg",rest:"60s",muscle:"Glutes/Quads",tip:"Drive through front heel"},
          {name:"DB Sumo Deadlift",sets:3,reps:"12",rest:"75s",muscle:"Inner Thigh/Glutes",tip:"Toes out 45°"},
          {name:"DB Single-Leg Deadlift",sets:3,reps:"10/leg",rest:"60s",muscle:"Hamstrings/Balance",tip:"Hinge, don't squat"},
          {name:"DB Calf Raise",sets:5,reps:"20",rest:"30s",muscle:"Calves",tip:"Step edge for full range"},
          {name:"Plank with DB Row",sets:3,reps:"8/side",rest:"60s",muscle:"Core/Back",tip:"Hips stay level"},
        ]
      }
    }
  },
  "fat-loss|advanced|3|gym": {
  split:["Push","Pull","Legs","Rest","Rest","Rest","Rest"],
  days:{
    "Push":{
      focus:"Heavy Push + HIIT",
      cardio:"20 min stair climber HIIT",
      exercises:[
        {name:"Barbell Bench Press",sets:5,reps:"6-8"},
        {name:"Incline Dumbbell Press",sets:4,reps:"10"},
        {name:"Seated Shoulder Press",sets:4,reps:"10"},
        {name:"Cable Fly",sets:3,reps:"15"},
        {name:"Tricep Pushdown",sets:4,reps:"15"},
        {name:"Burpees",sets:3,reps:"15"},
      ]
    },

    "Pull":{
      focus:"Back Thickness + Conditioning",
      cardio:"15 min rowing intervals",
      exercises:[
        {name:"Deadlift",sets:5,reps:"5"},
        {name:"Pull-ups",sets:4,reps:"10-12"},
        {name:"Barbell Row",sets:4,reps:"8-10"},
        {name:"Lat Pulldown",sets:3,reps:"12"},
        {name:"Face Pull",sets:3,reps:"15"},
        {name:"Hammer Curl",sets:3,reps:"15"},
      ]
    },

    "Legs":{
      focus:"Leg Destruction",
      cardio:"20 min incline treadmill",
      exercises:[
        {name:"Barbell Squat",sets:5,reps:"6-8"},
        {name:"Romanian Deadlift",sets:4,reps:"10"},
        {name:"Walking Lunges",sets:4,reps:"14/leg"},
        {name:"Leg Press",sets:4,reps:"15"},
        {name:"Leg Curl",sets:4,reps:"12"},
        {name:"Standing Calf Raise",sets:5,reps:"20"},
      ]
    }
  }
},

"fat-loss|advanced|4|gym": {
  split:["Upper","Lower","Upper","Lower","Rest","Rest","Rest"],
  days:{
    "Upper":{
      focus:"Advanced Upper Burn",
      cardio:"15 min battle ropes",
      exercises:[
        {name:"Bench Press",sets:5,reps:"6-8"},
        {name:"Weighted Pull-ups",sets:4,reps:"8"},
        {name:"Incline DB Press",sets:4,reps:"10"},
        {name:"Barbell Row",sets:4,reps:"10"},
        {name:"Arnold Press",sets:4,reps:"12"},
        {name:"Cable Curl",sets:3,reps:"15"},
        {name:"Rope Pushdown",sets:3,reps:"15"},
      ]
    },

    "Lower":{
      focus:"Athletic Lower Body",
      cardio:"20 min sled push",
      exercises:[
        {name:"Back Squat",sets:5,reps:"6"},
        {name:"Romanian Deadlift",sets:4,reps:"10"},
        {name:"Bulgarian Split Squat",sets:4,reps:"12"},
        {name:"Hack Squat",sets:4,reps:"12"},
        {name:"Leg Curl",sets:4,reps:"12"},
        {name:"Seated Calf Raise",sets:5,reps:"20"},
      ]
    }
  }
},

"fat-loss|advanced|6|gym": {
  split:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
  days:{
    "Push":{
      focus:"Strength Push",
      cardio:"15 min HIIT",
      exercises:[
        {name:"Bench Press",sets:5,reps:"5"},
        {name:"Incline Press",sets:4,reps:"8"},
        {name:"Overhead Press",sets:4,reps:"8"},
        {name:"Cable Fly",sets:4,reps:"15"},
        {name:"Dips",sets:4,reps:"15"},
      ]
    },

    "Pull":{
      focus:"Back Width + Density",
      cardio:"15 min rower",
      exercises:[
        {name:"Deadlift",sets:5,reps:"5"},
        {name:"Weighted Pull-ups",sets:4,reps:"8"},
        {name:"Barbell Row",sets:4,reps:"8"},
        {name:"Cable Row",sets:4,reps:"12"},
        {name:"EZ Curl",sets:4,reps:"12"},
      ]
    },

    "Legs":{
      focus:"Explosive Legs",
      cardio:"20 min incline treadmill",
      exercises:[
        {name:"Squat",sets:5,reps:"5"},
        {name:"Romanian Deadlift",sets:4,reps:"10"},
        {name:"Walking Lunges",sets:4,reps:"12"},
        {name:"Leg Press",sets:4,reps:"15"},
        {name:"Leg Extension",sets:4,reps:"15"},
      ]
    }
  }
},

"fat-loss|advanced|3|home": {
  split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
  days:{
    "Full Body":{
      focus:"Extreme Bodyweight Conditioning",
      cardio:"25 min HIIT",
      exercises:[
        {name:"Burpees",sets:5,reps:"20"},
        {name:"Plyo Push-ups",sets:4,reps:"15"},
        {name:"Jump Squats",sets:5,reps:"20"},
        {name:"Bulgarian Split Squat",sets:4,reps:"15/leg"},
        {name:"Pike Push-ups",sets:4,reps:"15"},
        {name:"Mountain Climbers",sets:5,reps:"45s"},
        {name:"Plank",sets:4,reps:"90s"},
      ]
    }
  }
},

"fat-loss|advanced|4|home": {
  split:["Upper","Lower","Upper","Lower","Rest","Rest","Rest"],
  days:{
    "Upper":{
      focus:"Bodyweight Upper Challenge",
      cardio:"20 min HIIT",
      exercises:[
        {name:"Plyo Push-ups",sets:5,reps:"15"},
        {name:"Diamond Push-ups",sets:4,reps:"20"},
        {name:"Pike Push-ups",sets:4,reps:"15"},
        {name:"Chair Dips",sets:4,reps:"20"},
        {name:"Inverted Row",sets:4,reps:"15"},
        {name:"Burpees",sets:4,reps:"15"},
      ]
    },

    "Lower":{
      focus:"Explosive Legs",
      cardio:"20 min jump rope",
      exercises:[
        {name:"Jump Squat",sets:5,reps:"20"},
        {name:"Walking Lunges",sets:4,reps:"15"},
        {name:"Wall Sit",sets:4,reps:"75s"},
        {name:"Single Leg Glute Bridge",sets:4,reps:"20"},
        {name:"Calf Raise",sets:5,reps:"25"},
      ]
    }
  }
},

"fat-loss|advanced|6|home": {
  split:["Push","Pull","Legs","HIIT","Upper","Lower","Rest"],
  days:{
    "Push":{
      exercises:[
        {name:"Plyo Push-ups",sets:5,reps:"15"},
        {name:"Diamond Push-ups",sets:4,reps:"20"},
        {name:"Pike Push-ups",sets:4,reps:"15"},
      ]
    },

    "Pull":{
      exercises:[
        {name:"Inverted Row",sets:5,reps:"15"},
        {name:"Superman",sets:4,reps:"20"},
        {name:"Reverse Snow Angels",sets:4,reps:"20"},
      ]
    },

    "Legs":{
      exercises:[
        {name:"Jump Squats",sets:5,reps:"20"},
        {name:"Bulgarian Split Squat",sets:4,reps:"15"},
        {name:"Walking Lunges",sets:4,reps:"15"},
      ]
    },

    "HIIT":{
      exercises:[
        {name:"Burpees",sets:5,reps:"20"},
        {name:"Mountain Climbers",sets:5,reps:"45s"},
        {name:"High Knees",sets:5,reps:"45s"},
      ]
    },

    "Upper":{
      exercises:[
        {name:"Push-ups",sets:5,reps:"25"},
        {name:"Chair Dips",sets:4,reps:"20"},
        {name:"Pike Push-ups",sets:4,reps:"15"},
      ]
    },

    "Lower":{
      exercises:[
        {name:"Jump Lunges",sets:5,reps:"15"},
        {name:"Wall Sit",sets:4,reps:"90s"},
        {name:"Single Leg Calf Raise",sets:5,reps:"25"},
      ]
    }
  }
},

"fat-loss|advanced|3|dumbbells": {
  split:["Push","Pull","Legs","Rest","Rest","Rest","Rest"],
  days:{
    "Push":{
      exercises:[
        {name:"DB Bench Press",sets:5,reps:"8"},
        {name:"DB Incline Press",sets:4,reps:"10"},
        {name:"DB Shoulder Press",sets:4,reps:"10"},
        {name:"DB Lateral Raise",sets:4,reps:"15"},
      ]
    },

    "Pull":{
      exercises:[
        {name:"DB Row",sets:5,reps:"10"},
        {name:"DB Rear Delt Fly",sets:4,reps:"15"},
        {name:"DB Hammer Curl",sets:4,reps:"15"},
        {name:"DB Shrugs",sets:5,reps:"15"},
      ]
    },

    "Legs":{
      exercises:[
        {name:"DB Goblet Squat",sets:5,reps:"15"},
        {name:"DB Romanian Deadlift",sets:5,reps:"12"},
        {name:"DB Walking Lunges",sets:4,reps:"15"},
        {name:"DB Step-ups",sets:4,reps:"12"},
      ]
    }
  }
},

"fat-loss|advanced|4|dumbbells": {
  split:["Upper","Lower","Upper","Lower","Rest","Rest","Rest"],
  days:{
    "Upper":{
      exercises:[
        {name:"DB Bench Press",sets:5,reps:"8"},
        {name:"DB Row",sets:5,reps:"10"},
        {name:"DB Shoulder Press",sets:4,reps:"10"},
        {name:"DB Curl",sets:4,reps:"15"},
        {name:"DB Skull Crusher",sets:4,reps:"15"},
      ]
    },

    "Lower":{
      exercises:[
        {name:"DB Goblet Squat",sets:5,reps:"15"},
        {name:"DB Romanian Deadlift",sets:5,reps:"12"},
        {name:"DB Walking Lunges",sets:4,reps:"15"},
        {name:"DB Calf Raise",sets:5,reps:"20"},
      ]
    }
  }
},

"fat-loss|advanced|6|dumbbells": {
  split:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
  days:{
    "Push":{
      exercises:[
        {name:"DB Bench Press",sets:5,reps:"8"},
        {name:"DB Incline Press",sets:4,reps:"10"},
        {name:"DB Shoulder Press",sets:4,reps:"10"},
      ]
    },

    "Pull":{
      exercises:[
        {name:"DB Row",sets:5,reps:"10"},
        {name:"DB Rear Delt Fly",sets:4,reps:"15"},
        {name:"DB Hammer Curl",sets:4,reps:"15"},
      ]
    },

    "Legs":{
      exercises:[
        {name:"DB Goblet Squat",sets:5,reps:"15"},
        {name:"DB Romanian Deadlift",sets:5,reps:"12"},
        {name:"DB Walking Lunges",sets:4,reps:"15"},
      ]
    }
  }
},

"fat-loss|advanced|3|bands": {
  split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
  days:{
    "Full Body":{
      exercises:[
        {name:"Band Squat",sets:5,reps:"20"},
        {name:"Band Chest Press",sets:5,reps:"15"},
        {name:"Band Row",sets:5,reps:"15"},
        {name:"Band Shoulder Press",sets:4,reps:"15"},
        {name:"Band Deadlift",sets:5,reps:"15"},
      ]
    }
  }
},

"fat-loss|advanced|4|bands": {
  split:["Upper","Lower","Upper","Lower","Rest","Rest","Rest"],
  days:{
    "Upper":{
      exercises:[
        {name:"Band Chest Press",sets:5,reps:"15"},
        {name:"Band Row",sets:5,reps:"15"},
        {name:"Band Shoulder Press",sets:4,reps:"15"},
        {name:"Band Curl",sets:4,reps:"15"},
      ]
    },

    "Lower":{
      exercises:[
        {name:"Band Squat",sets:5,reps:"20"},
        {name:"Band RDL",sets:5,reps:"15"},
        {name:"Band Lunges",sets:4,reps:"15"},
        {name:"Band Glute Bridge",sets:4,reps:"20"},
      ]
    }
  }
},

"fat-loss|advanced|6|bands": {
  split:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
  days:{
    "Push":{
      exercises:[
        {name:"Band Chest Press",sets:5,reps:"15"},
        {name:"Band Shoulder Press",sets:5,reps:"15"},
        {name:"Band Tricep Extension",sets:4,reps:"15"},
      ]
    },

    "Pull":{
      exercises:[
        {name:"Band Row",sets:5,reps:"15"},
        {name:"Band Face Pull",sets:4,reps:"15"},
        {name:"Band Curl",sets:4,reps:"15"},
      ]
    },

    "Legs":{
      exercises:[
        {name:"Band Squat",sets:5,reps:"20"},
        {name:"Band Deadlift",sets:5,reps:"15"},
        {name:"Band Lunges",sets:4,reps:"15"},
      ]
    }
  }
},

  // ══════════════════════════════════════════════════════
  // MUSCLE GAIN
  // ══════════════════════════════════════════════════════
  "muscle|beginner|3|gym": {
    split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
    days:{
      "Full Body":{
        focus:"Beginner Full Body Hypertrophy",
        cardio:"Optional: 10 min light walk",
        exercises:[
          {name:"Barbell Back Squat",sets:3,reps:"8-10",rest:"90s",muscle:"Quads/Glutes",tip:"Learn the movement pattern first"},
          {name:"Flat Barbell Bench Press",sets:3,reps:"8-10",rest:"90s",muscle:"Chest",tip:"Grip slightly wider than shoulder"},
          {name:"Lat Pulldown",sets:3,reps:"10-12",rest:"75s",muscle:"Back/Lats",tip:"Pull to upper chest"},
          {name:"Seated DB Shoulder Press",sets:3,reps:"10-12",rest:"75s",muscle:"Shoulders",tip:"Full range of motion"},
          {name:"Dumbbell Curl",sets:3,reps:"12",rest:"60s",muscle:"Biceps",tip:"Squeeze at top"},
          {name:"Tricep Pushdown",sets:3,reps:"12",rest:"60s",muscle:"Triceps",tip:"Elbows pinned to sides"},
          {name:"Plank",sets:3,reps:"30-45s",rest:"45s",muscle:"Core",tip:"Breathe steadily"},
        ]
      }
    }
  },
  "muscle|beginner|3|dumbbells": {
    split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
    days:{
      "Full Body":{
        focus:"Dumbbell Full Body Hypertrophy",
        cardio:"Skip or 10 min light walk",
        exercises:[
          {name:"DB Goblet Squat",sets:3,reps:"10-12",rest:"90s",muscle:"Quads/Glutes",tip:"Slow descent, 3 seconds"},
          {name:"DB Bench Press",sets:3,reps:"10",rest:"90s",muscle:"Chest",tip:"Feet flat, arch natural"},
          {name:"DB Bent-Over Row",sets:3,reps:"10/side",rest:"75s",muscle:"Back",tip:"Flat back, row to hip"},
          {name:"DB Shoulder Press",sets:3,reps:"10-12",rest:"75s",muscle:"Shoulders",tip:"Don't lock out elbows"},
          {name:"DB Romanian Deadlift",sets:3,reps:"12",rest:"75s",muscle:"Hamstrings",tip:"Feel the stretch in hamstrings"},
          {name:"DB Curl",sets:3,reps:"12",rest:"60s",muscle:"Biceps",tip:"Supinate wrist at top"},
          {name:"DB Overhead Tricep Extension",sets:3,reps:"12",rest:"60s",muscle:"Triceps",tip:"Elbows close to head"},
          {name:"DB Calf Raise",sets:3,reps:"15-20",rest:"30s",muscle:"Calves",tip:"Full range"},
        ]
      }
    }
  },
  "muscle|beginner|3|home": {
    split:["Full Body","Rest","Full Body","Rest","Full Body","Rest","Rest"],
    days:{
      "Full Body":{
        focus:"Bodyweight Muscle Builder",
        cardio:"None — focus on muscle building",
        exercises:[
          {name:"Squat",sets:4,reps:"15",rest:"60s",muscle:"Quads/Glutes",tip:"Add a 3s pause for more tension"},
          {name:"Push-ups",sets:4,reps:"15-20",rest:"60s",muscle:"Chest/Triceps",tip:"Touch chest to floor"},
          {name:"Inverted Row (Table)",sets:3,reps:"12",rest:"75s",muscle:"Back/Biceps",tip:"Underhand grip targets biceps"},
          {name:"Pike Push-up",sets:3,reps:"10-12",rest:"60s",muscle:"Shoulders",tip:"Head goes between arms"},
          {name:"Glute Bridge",sets:4,reps:"20",rest:"45s",muscle:"Glutes",tip:"Single-leg harder option"},
          {name:"Tricep Dips (Chair)",sets:3,reps:"15",rest:"60s",muscle:"Triceps",tip:"Keep hips close to chair"},
          {name:"Plank",sets:3,reps:"45s",rest:"30s",muscle:"Core",tip:"Add shoulder taps for challenge"},
        ]
      }
    }
  },

  "muscle|intermediate|4|gym": {
    split:["Chest/Triceps","Back/Biceps","Rest","Legs","Shoulders/Arms","Rest","Rest"],
    days:{
      "Chest/Triceps":{
        focus:"Chest & Triceps Hypertrophy",
        cardio:"None",
        exercises:[
          {name:"Flat Barbell Bench Press",sets:4,reps:"6-10",rest:"120s",muscle:"Chest",tip:"Pause 1s at chest for more activation"},
          {name:"Incline DB Press",sets:4,reps:"10-12",rest:"90s",muscle:"Upper Chest",tip:"30° incline is optimal"},
          {name:"Cable Fly",sets:3,reps:"12-15",rest:"75s",muscle:"Chest",tip:"Squeeze at centre"},
          {name:"Decline Push-up",sets:3,reps:"15",rest:"60s",muscle:"Lower Chest",tip:"Feet elevated on bench"},
          {name:"Skull Crushers",sets:4,reps:"10-12",rest:"75s",muscle:"Triceps",tip:"EZ bar is easier on wrists"},
          {name:"Dip (Chest Lean)",sets:3,reps:"10-12",rest:"75s",muscle:"Chest/Triceps",tip:"Lean forward for more chest"},
          {name:"Tricep Pushdown",sets:3,reps:"12-15",rest:"45s",muscle:"Triceps",tip:"Fully extend each rep"},
        ]
      },
      "Back/Biceps":{
        focus:"Back & Biceps Hypertrophy",
        cardio:"None",
        exercises:[
          {name:"Weighted Pull-up / Lat Pulldown",sets:4,reps:"6-10",rest:"120s",muscle:"Lats",tip:"Full dead hang, slow pull"},
          {name:"Barbell Row",sets:4,reps:"8-10",rest:"90s",muscle:"Mid Back",tip:"Row to belly button"},
          {name:"Cable Seated Row",sets:3,reps:"12",rest:"75s",muscle:"Back",tip:"Keep chest up throughout"},
          {name:"DB Single-Arm Row",sets:3,reps:"10/side",rest:"60s",muscle:"Back",tip:"Elbow skims rib cage"},
          {name:"Face Pull",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Rope to forehead"},
          {name:"Barbell Curl",sets:4,reps:"10",rest:"75s",muscle:"Biceps",tip:"Strict form, no swinging"},
          {name:"Incline DB Curl",sets:3,reps:"12",rest:"60s",muscle:"Biceps",tip:"Arms hang, great stretch"},
          {name:"Hammer Curl",sets:3,reps:"12",rest:"45s",muscle:"Brachialis",tip:"Builds arm thickness"},
        ]
      },
      "Legs":{
        focus:"Leg Hypertrophy Day",
        cardio:"None",
        exercises:[
          {name:"Barbell Squat",sets:4,reps:"8-10",rest:"120s",muscle:"Quads/Glutes",tip:"High bar for quads, low bar for glutes"},
          {name:"Romanian Deadlift",sets:4,reps:"10",rest:"90s",muscle:"Hamstrings",tip:"Greatest hamstring builder"},
          {name:"Leg Press",sets:4,reps:"12",rest:"90s",muscle:"Quads",tip:"Don't let knees cave"},
          {name:"Leg Curl",sets:4,reps:"12",rest:"75s",muscle:"Hamstrings",tip:"Point toes slightly inward"},
          {name:"Bulgarian Split Squat",sets:3,reps:"10/leg",rest:"90s",muscle:"Quads/Glutes",tip:"Most brutal leg exercise"},
          {name:"Hip Thrust",sets:3,reps:"12",rest:"75s",muscle:"Glutes",tip:"Bar across hip crease"},
          {name:"Calf Raise",sets:5,reps:"20",rest:"30s",muscle:"Calves",tip:"Slow and full range"},
          {name:"Leg Raise",sets:3,reps:"15",rest:"30s",muscle:"Core",tip:"Lower back stays down"},
        ]
      },
      "Shoulders/Arms":{
        focus:"Shoulders & Arms Hypertrophy",
        cardio:"None",
        exercises:[
          {name:"Seated DB Shoulder Press",sets:4,reps:"10",rest:"90s",muscle:"Shoulders",tip:"Don't arch too much"},
          {name:"Lateral Raise",sets:4,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Lean slightly forward"},
          {name:"Rear Delt Fly",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Bent 90° at hips"},
          {name:"Front Raise",sets:3,reps:"12",rest:"45s",muscle:"Front Delts",tip:"Alternate arms"},
          {name:"EZ-Bar Curl",sets:4,reps:"10",rest:"60s",muscle:"Biceps",tip:"Supinate fully at top"},
          {name:"Preacher Curl",sets:3,reps:"12",rest:"60s",muscle:"Biceps Peak",tip:"Don't swing"},
          {name:"Skull Crusher",sets:3,reps:"12",rest:"60s",muscle:"Triceps",tip:"Keep elbows pointed up"},
          {name:"Dip (Upright — Tricep Focus)",sets:3,reps:"12",rest:"60s",muscle:"Triceps",tip:"Stay upright, elbows back"},
        ]
      }
    }
  },

  "muscle|advanced|5|gym": {
    split:["Chest","Back","Legs","Shoulders","Arms","Rest","Rest"],
    days:{
      "Chest":{
        focus:"Advanced Chest Hypertrophy",
        cardio:"None",
        exercises:[
          {name:"Flat Barbell Bench Press",sets:5,reps:"5-6",rest:"180s",muscle:"Chest",tip:"Explosive up, 3s down"},
          {name:"Incline Barbell Press",sets:4,reps:"8",rest:"120s",muscle:"Upper Chest",tip:"Wider grip for more chest"},
          {name:"Weighted Dip",sets:4,reps:"8-10",rest:"90s",muscle:"Chest/Triceps",tip:"Lean forward for chest focus"},
          {name:"Cable Fly (Low-to-High)",sets:4,reps:"12",rest:"60s",muscle:"Lower Chest",tip:"Arc motion upward"},
          {name:"DB Incline Fly",sets:3,reps:"12-15",rest:"60s",muscle:"Chest",tip:"Deep stretch at bottom"},
          {name:"Push-up (Weighted Vest)",sets:3,reps:"15-20",rest:"60s",muscle:"Chest/Triceps",tip:"Finisher — high reps"},
        ]
      },
      "Back":{
        focus:"Advanced Back Hypertrophy",
        cardio:"None",
        exercises:[
          {name:"Weighted Pull-up",sets:5,reps:"5-6",rest:"180s",muscle:"Lats",tip:"Add 10-20kg via belt"},
          {name:"Barbell Deadlift (Romanian style)",sets:4,reps:"8",rest:"120s",muscle:"Back/Hamstrings",tip:"Keep bar close to body"},
          {name:"T-Bar Row",sets:4,reps:"8-10",rest:"90s",muscle:"Mid Back/Thickness",tip:"Row explosively"},
          {name:"Wide-Grip Cable Row",sets:4,reps:"10-12",rest:"75s",muscle:"Upper Back",tip:"Elbows out, not in"},
          {name:"Straight-Arm Pulldown",sets:3,reps:"15",rest:"60s",muscle:"Lats",tip:"Great for lat isolation"},
          {name:"Meadow Row",sets:3,reps:"10/side",rest:"60s",muscle:"Back Width",tip:"Barbell landmine row"},
          {name:"Shrug",sets:4,reps:"15",rest:"45s",muscle:"Traps",tip:"Straight up, no rolls"},
        ]
      },
      "Legs":{
        focus:"Advanced Leg Hypertrophy",
        cardio:"None",
        exercises:[
          {name:"Barbell Back Squat",sets:5,reps:"5-6",rest:"180s",muscle:"Quads/Glutes",tip:"Low bar for max weight"},
          {name:"Front Squat",sets:3,reps:"8",rest:"120s",muscle:"Quads",tip:"Elbows high, upright torso"},
          {name:"Romanian Deadlift",sets:4,reps:"8",rest:"120s",muscle:"Hamstrings",tip:"Controlled descent always"},
          {name:"Leg Press (High Foot Placement)",sets:4,reps:"10-12",rest:"90s",muscle:"Glutes/Hamstrings",tip:"Maximises posterior chain"},
          {name:"Hack Squat",sets:3,reps:"10",rest:"90s",muscle:"Quads",tip:"Great quad separation tool"},
          {name:"Leg Curl",sets:4,reps:"10",rest:"75s",muscle:"Hamstrings",tip:"Toes in = more bicep femoris"},
          {name:"Hip Thrust (Heavy)",sets:4,reps:"10",rest:"90s",muscle:"Glutes",tip:"200kg+ possible here"},
          {name:"Seated Calf Raise",sets:5,reps:"15",rest:"30s",muscle:"Soleus",tip:"Seated targets deeper soleus"},
        ]
      },
      "Shoulders":{
        focus:"Advanced Shoulder Hypertrophy",
        cardio:"None",
        exercises:[
          {name:"Standing Barbell Press",sets:5,reps:"6-8",rest:"120s",muscle:"Shoulders",tip:"Full body brace"},
          {name:"Seated DB Press",sets:4,reps:"10",rest:"90s",muscle:"Shoulders",tip:"Full range overhead"},
          {name:"Cable Lateral Raise (Unilateral)",sets:4,reps:"15/side",rest:"45s",muscle:"Side Delts",tip:"Cross-body cable for better arc"},
          {name:"Lateral Raise (DB)",sets:4,reps:"20",rest:"30s",muscle:"Side Delts",tip:"Drop set finisher"},
          {name:"Face Pull",sets:4,reps:"15",rest:"45s",muscle:"Rear Delts/Rotator Cuff",tip:"Essential shoulder health"},
          {name:"Rear Delt Machine Fly",sets:3,reps:"15",rest:"45s",muscle:"Rear Delts",tip:"Slight forward lean"},
          {name:"DB Upright Row",sets:3,reps:"12",rest:"60s",muscle:"Traps/Side Delts",tip:"Elbows drive up"},
          {name:"Barbell Shrug",sets:4,reps:"15",rest:"45s",muscle:"Traps",tip:"Dead hang at bottom"},
        ]
      },
      "Arms":{
        focus:"Arm Specialisation Day",
        cardio:"None",
        exercises:[
          {name:"Barbell Curl",sets:4,reps:"8",rest:"90s",muscle:"Biceps",tip:"Heaviest curl of the week"},
          {name:"Incline DB Curl",sets:3,reps:"12",rest:"60s",muscle:"Biceps Long Head",tip:"Best long head stretch"},
          {name:"Preacher Curl (Machine or EZ)",sets:3,reps:"12",rest:"60s",muscle:"Biceps Peak",tip:"Full extension at bottom"},
          {name:"Hammer Curl",sets:3,reps:"12",rest:"60s",muscle:"Brachialis",tip:"Neutral wrist, controlled"},
          {name:"Close-Grip Bench Press",sets:4,reps:"8-10",rest:"90s",muscle:"Triceps",tip:"Heaviest tricep movement"},
          {name:"Skull Crushers",sets:4,reps:"10",rest:"75s",muscle:"Triceps Long Head",tip:"EZ bar, elbows fixed"},
          {name:"Overhead Rope Ext.",sets:3,reps:"12",rest:"60s",muscle:"Triceps Long Head",tip:"Best stretch position"},
          {name:"Tricep Dip (BW or Weighted)",sets:3,reps:"12",rest:"60s",muscle:"Triceps",tip:"Full extension at top"},
        ]
      }
    }
  },

  // ══════════════════════════════════════════════════════
  // STRENGTH
  // ══════════════════════════════════════════════════════
  "strength|beginner|3|gym": {
    split:["Squat Day","Press Day","Rest","Deadlift Day","Rest","Rest","Rest"],
    days:{
      "Squat Day":{
        focus:"Squat Focus — Leg Strength",
        cardio:"None",
        exercises:[
          {name:"Barbell Back Squat",sets:3,reps:"5",rest:"180s",muscle:"Quads/Glutes",tip:"Linear progression — add 2.5kg each session"},
          {name:"Romanian Deadlift",sets:3,reps:"8",rest:"120s",muscle:"Hamstrings",tip:"Accessory for posterior chain"},
          {name:"Leg Press",sets:3,reps:"10",rest:"90s",muscle:"Quads",tip:"Volume accessory"},
          {name:"Plank",sets:3,reps:"45s",rest:"45s",muscle:"Core",tip:"Strong core = stronger squat"},
          {name:"Ab Crunch",sets:3,reps:"15",rest:"30s",muscle:"Core",tip:"Controlled reps"},
        ]
      },
      "Press Day":{
        focus:"Press Focus — Upper Body Strength",
        cardio:"None",
        exercises:[
          {name:"Barbell Bench Press",sets:3,reps:"5",rest:"180s",muscle:"Chest",tip:"Add 2.5kg every session (linear progression)"},
          {name:"Overhead Press",sets:3,reps:"5",rest:"180s",muscle:"Shoulders",tip:"Hardest to progress — be patient"},
          {name:"Dumbbell Row",sets:3,reps:"8-10/side",rest:"90s",muscle:"Back",tip:"Stay balanced for pressing strength"},
          {name:"Dip",sets:3,reps:"8-10",rest:"90s",muscle:"Chest/Triceps",tip:"Accessory pressing"},
          {name:"Barbell Curl",sets:3,reps:"10",rest:"60s",muscle:"Biceps",tip:"Arm health for pressing"},
        ]
      },
      "Deadlift Day":{
        focus:"Deadlift Focus — Posterior Chain",
        cardio:"None",
        exercises:[
          {name:"Barbell Deadlift",sets:1,reps:"5",rest:"240s",muscle:"Full Body",tip:"1 heavy set — add 5kg each session"},
          {name:"Barbell Row",sets:3,reps:"5",rest:"120s",muscle:"Back",tip:"5×5 pairing with deadlift"},
          {name:"Chin-up",sets:3,reps:"5-8",rest:"120s",muscle:"Back/Biceps",tip:"Add weight when easy"},
          {name:"Good Morning",sets:3,reps:"10",rest:"90s",muscle:"Hamstrings/Lower Back",tip:"Light — builds back strength"},
          {name:"Farmer's Walk",sets:3,reps:"20m",rest:"90s",muscle:"Grip/Full Body",tip:"Builds grip for deadlift"},
        ]
      }
    }
  },
  "strength|intermediate|4|gym": {
    split:["Heavy Squat","Heavy Press","Rest","Heavy Deadlift","Upper Accessory","Rest","Rest"],
    days:{
      "Heavy Squat":{
        focus:"Squat — Intermediate Strength",
        cardio:"None",
        exercises:[
          {name:"Barbell Back Squat",sets:5,reps:"5",rest:"240s",muscle:"Quads/Glutes",tip:"5×5 protocol — same weight until all sets complete"},
          {name:"Front Squat",sets:3,reps:"5",rest:"180s",muscle:"Quads",tip:"Builds quad strength for back squat"},
          {name:"Romanian Deadlift",sets:3,reps:"8",rest:"120s",muscle:"Hamstrings",tip:"Controls descent under load"},
          {name:"Leg Press",sets:3,reps:"8",rest:"90s",muscle:"Quads",tip:"Heavy accessory"},
          {name:"Weighted Plank",sets:3,reps:"45s",rest:"60s",muscle:"Core",tip:"Plate on back"},
        ]
      },
      "Heavy Press":{
        focus:"Bench & OHP — Upper Strength",
        cardio:"None",
        exercises:[
          {name:"Barbell Bench Press",sets:5,reps:"5",rest:"240s",muscle:"Chest",tip:"Competition grip width"},
          {name:"Standing Overhead Press",sets:5,reps:"5",rest:"240s",muscle:"Shoulders",tip:"Full body press — brace hard"},
          {name:"Weighted Dip",sets:3,reps:"6-8",rest:"120s",muscle:"Chest/Triceps",tip:"Add weight via belt"},
          {name:"Bent-Over Row",sets:5,reps:"5",rest:"180s",muscle:"Back",tip:"Balance the press with pull"},
          {name:"Skull Crusher",sets:3,reps:"8",rest:"90s",muscle:"Triceps",tip:"Triceps extend the lockout"},
        ]
      },
      "Heavy Deadlift":{
        focus:"Deadlift Day — Maximum Pull Strength",
        cardio:"None",
        exercises:[
          {name:"Barbell Deadlift",sets:5,reps:"3-5",rest:"300s",muscle:"Full Body",tip:"Conventional — add 5kg when all reps completed"},
          {name:"Sumo Deadlift",sets:3,reps:"5",rest:"180s",muscle:"Inner Thigh/Glutes",tip:"Different motor pattern"},
          {name:"Good Morning",sets:3,reps:"8",rest:"120s",muscle:"Hamstrings/Spinal Erectors",tip:"Never heavy — technique only"},
          {name:"Farmer's Walk",sets:4,reps:"30m",rest:"120s",muscle:"Grip/Traps/Core",tip:"Heaviest you can walk with"},
          {name:"Hanging Leg Raise",sets:3,reps:"12",rest:"45s",muscle:"Core",tip:"Builds deadlift core strength"},
        ]
      },
      "Upper Accessory":{
        focus:"Upper Body Volume Accessory",
        cardio:"None",
        exercises:[
          {name:"Pull-up (Weighted)",sets:4,reps:"6",rest:"120s",muscle:"Back/Lats",tip:"Pull strength carries to deadlift"},
          {name:"DB Row",sets:4,reps:"10/side",rest:"75s",muscle:"Back",tip:"Strict form focus"},
          {name:"DB Bench Press",sets:4,reps:"10",rest:"90s",muscle:"Chest",tip:"Volume after heavy bench days"},
          {name:"DB Lateral Raise",sets:4,reps:"15",rest:"45s",muscle:"Shoulders",tip:"Shoulder health accessory"},
          {name:"Barbell Curl",sets:3,reps:"10",rest:"60s",muscle:"Biceps",tip:"Bicep helps deadlift lockout"},
          {name:"Tricep Pushdown",sets:3,reps:"12",rest:"45s",muscle:"Triceps",tip:"Lockout strength"},
        ]
      }
    }
  },
  "strength|advanced|5|gym": {
    split:["Squat","Bench","Deadlift","OHP","Accessory","Rest","Rest"],
    days:{
      "Squat":{
        focus:"Competition Squat Training",
        cardio:"None",
        exercises:[
          {name:"Barbell Back Squat",sets:5,reps:"3",rest:"300s",muscle:"Full Body",tip:"Competition depth — below parallel"},
          {name:"Pause Squat",sets:3,reps:"3",rest:"240s",muscle:"Quads",tip:"2s pause at bottom"},
          {name:"Box Squat",sets:3,reps:"3",rest:"240s",muscle:"Posterior Chain",tip:"Sit back on box, explode up"},
          {name:"Romanian Deadlift",sets:4,reps:"5",rest:"180s",muscle:"Hamstrings",tip:"Heavy and strict"},
          {name:"Weighted Plank",sets:3,reps:"60s",rest:"60s",muscle:"Core",tip:"25kg plate on back"},
          {name:"GHD Raise",sets:3,reps:"10",rest:"90s",muscle:"Hamstrings/Glutes",tip:"Advanced back support"},
        ]
      },
      "Bench":{
        focus:"Competition Bench Training",
        cardio:"None",
        exercises:[
          {name:"Barbell Bench Press",sets:5,reps:"3",rest:"300s",muscle:"Chest",tip:"Competition pause at chest"},
          {name:"Close-Grip Bench Press",sets:4,reps:"5",rest:"180s",muscle:"Triceps",tip:"Lockout strength"},
          {name:"Board Press",sets:3,reps:"3",rest:"240s",muscle:"Chest/Triceps",tip:"Overload the top end"},
          {name:"DB Fly",sets:3,reps:"10",rest:"75s",muscle:"Chest",tip:"Pec health and stretch"},
          {name:"Weighted Dip",sets:3,reps:"6",rest:"120s",muscle:"Chest/Triceps",tip:"Belt squat + chains"},
          {name:"Tricep Pushdown",sets:4,reps:"12",rest:"45s",muscle:"Triceps",tip:"Volume finisher"},
        ]
      },
      "Deadlift":{
        focus:"Competition Deadlift Training",
        cardio:"None",
        exercises:[
          {name:"Barbell Deadlift",sets:5,reps:"3",rest:"360s",muscle:"Full Body",tip:"Mixed grip or straps for max"},
          {name:"Deficit Deadlift",sets:3,reps:"3",rest:"240s",muscle:"Full Body",tip:"Stand on 2-inch plate"},
          {name:"Rack Pull",sets:3,reps:"3",rest:"240s",muscle:"Back/Traps",tip:"Above knee — overload lockout"},
          {name:"Good Morning",sets:3,reps:"5",rest:"180s",muscle:"Hamstrings/Back",tip:"Moderate weight"},
          {name:"Farmer's Walk",sets:4,reps:"40m",rest:"180s",muscle:"Grip/Core",tip:"As heavy as possible"},
          {name:"Plank",sets:3,reps:"60s",rest:"60s",muscle:"Core",tip:"Strict"},
        ]
      },
      "OHP":{
        focus:"Overhead Strength Day",
        cardio:"None",
        exercises:[
          {name:"Standing Barbell OHP",sets:5,reps:"3-5",rest:"240s",muscle:"Shoulders",tip:"Full press from rack"},
          {name:"Push Press",sets:4,reps:"3",rest:"180s",muscle:"Shoulders/Legs",tip:"Leg drive teaches bar speed"},
          {name:"Seated DB Press",sets:3,reps:"8",rest:"120s",muscle:"Shoulders",tip:"Volume accessory"},
          {name:"Lateral Raise",sets:4,reps:"15",rest:"45s",muscle:"Side Delts",tip:"Shoulder width and health"},
          {name:"Face Pull",sets:4,reps:"15",rest:"45s",muscle:"Rear Delts/RC",tip:"Non-negotiable for shoulder health"},
          {name:"Pull-up",sets:4,reps:"6-8",rest:"120s",muscle:"Back/Lats",tip:"Balances overhead pressing"},
        ]
      },
      "Accessory":{
        focus:"Hypertrophy Accessory Day",
        cardio:"None",
        exercises:[
          {name:"DB Row",sets:4,reps:"10/side",rest:"75s",muscle:"Back",tip:"Upper back helps bench and deadlift"},
          {name:"Incline DB Press",sets:4,reps:"10",rest:"90s",muscle:"Chest",tip:"Volume work for bench"},
          {name:"Leg Curl",sets:4,reps:"12",rest:"75s",muscle:"Hamstrings",tip:"Isolation for deadlift"},
          {name:"Hip Thrust",sets:4,reps:"10",rest:"90s",muscle:"Glutes",tip:"Posterior chain assistance"},
          {name:"Barbell Curl",sets:3,reps:"10",rest:"60s",muscle:"Biceps",tip:"Biceps assist deadlift"},
          {name:"Skull Crusher",sets:3,reps:"10",rest:"60s",muscle:"Triceps",tip:"Triceps assist bench lockout"},
          {name:"Ab Wheel",sets:3,reps:"10",rest:"60s",muscle:"Core",tip:"Core for all 3 lifts"},
        ]
      }
    }
  },

  // ══════════════════════════════════════════════════════
  // BEGINNER FITNESS (General)
  // ══════════════════════════════════════════════════════
  "beginner-fitness|beginner|3|gym": {
    split:["Full Body A","Rest","Full Body B","Rest","Full Body A","Rest","Rest"],
    days:{
      "Full Body A":{
        focus:"Learn Movement Patterns — Session A",
        cardio:"15 min treadmill walk",
        exercises:[
          {name:"Leg Press",sets:3,reps:"12",rest:"60s",muscle:"Quads/Glutes",tip:"Safer than squat for absolute beginners"},
          {name:"Chest Press Machine",sets:3,reps:"12",rest:"60s",muscle:"Chest",tip:"Learn the push pattern first"},
          {name:"Lat Pulldown",sets:3,reps:"12",rest:"60s",muscle:"Back/Lats",tip:"Learn the pull pattern"},
          {name:"Shoulder Press Machine",sets:3,reps:"12",rest:"60s",muscle:"Shoulders",tip:"Fixed path is safer"},
          {name:"Leg Curl Machine",sets:3,reps:"12",rest:"60s",muscle:"Hamstrings",tip:"Isolated — good for beginners"},
          {name:"Plank",sets:3,reps:"20-30s",rest:"45s",muscle:"Core",tip:"Build up to 60s over time"},
        ]
      },
      "Full Body B":{
        focus:"Free Weight Introduction — Session B",
        cardio:"15 min treadmill walk",
        exercises:[
          {name:"Goblet Squat (Dumbbell)",sets:3,reps:"10",rest:"75s",muscle:"Quads/Glutes",tip:"Transition to free weights"},
          {name:"Push-up (Modified if needed)",sets:3,reps:"8-12",rest:"60s",muscle:"Chest",tip:"Knees down is perfectly fine"},
          {name:"DB Row",sets:3,reps:"10/side",rest:"60s",muscle:"Back",tip:"Control the weight"},
          {name:"DB Shoulder Press",sets:3,reps:"10",rest:"60s",muscle:"Shoulders",tip:"Seated for stability"},
          {name:"DB Romanian Deadlift",sets:3,reps:"10",rest:"75s",muscle:"Hamstrings",tip:"Feel the hip hinge"},
          {name:"Dead Bug",sets:3,reps:"8/side",rest:"45s",muscle:"Core",tip:"Great for spinal stability"},
        ]
      }
    }
  },
  "beginner-fitness|beginner|3|home": {
    split:["Full Body A","Rest","Full Body B","Rest","Full Body A","Rest","Rest"],
    days:{
      "Full Body A":{
        focus:"Beginner Home — Session A",
        cardio:"15 min walk",
        exercises:[
          {name:"Squat",sets:3,reps:"15",rest:"45s",muscle:"Quads/Glutes",tip:"Learn the movement — no weight needed"},
          {name:"Push-up (Modified if needed)",sets:3,reps:"8-10",rest:"60s",muscle:"Chest/Triceps",tip:"Knees ok at first"},
          {name:"Glute Bridge",sets:3,reps:"15",rest:"45s",muscle:"Glutes",tip:"Squeeze at top"},
          {name:"Bird Dog",sets:3,reps:"10/side",rest:"45s",muscle:"Core/Back",tip:"Slow and controlled"},
          {name:"Wall Sit",sets:3,reps:"30s",rest:"45s",muscle:"Quads",tip:"Back flat on wall"},
          {name:"Superman",sets:3,reps:"12",rest:"30s",muscle:"Lower Back",tip:"Hold 2 seconds"},
        ]
      },
      "Full Body B":{
        focus:"Beginner Home — Session B",
        cardio:"15 min walk",
        exercises:[
          {name:"Reverse Lunge",sets:3,reps:"10/leg",rest:"60s",muscle:"Quads/Glutes",tip:"Easier on knees than forward lunge"},
          {name:"Wide Push-up",sets:3,reps:"8-10",rest:"60s",muscle:"Chest",tip:"Elbows at 90°"},
          {name:"Inverted Row (Table)",sets:3,reps:"8",rest:"75s",muscle:"Back",tip:"Keep body straight"},
          {name:"Pike Push-up",sets:3,reps:"8",rest:"60s",muscle:"Shoulders",tip:"Hips high, head between arms"},
          {name:"Plank",sets:3,reps:"30s",rest:"30s",muscle:"Core",tip:"Breathe steadily"},
          {name:"Calf Raise",sets:3,reps:"20",rest:"30s",muscle:"Calves",tip:"Use a step for range"},
        ]
      }
    }
  },
};

// Build a lookup function with smart fallback
function getPlan(goal, level, days, equipment) {
  const key = `${goal}|${level}|${days}|${equipment}`;
  if (WDB[key]) return WDB[key];
  // Fallback: try gym equipment
  const keyGym = `${goal}|${level}|${days}|gym`;
  if (WDB[keyGym]) return WDB[keyGym];
  // Fallback: try intermediate
  const keyInt = `${goal}|intermediate|${days}|gym`;
  if (WDB[keyInt]) return WDB[keyInt];
  // Fallback: try 4 days
  const key4 = `${goal}|intermediate|4|gym`;
  if (WDB[key4]) return WDB[key4];
  // Ultimate fallback
  const firstKey = Object.keys(WDB).find(k => k.startsWith(goal));
  return WDB[firstKey] || WDB[Object.keys(WDB)[0]];
}

const DAYS_OF_WEEK = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function ExerciseTable({ exercises }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, overflow:"hidden" }}>
      <div style={{ display:"grid", gridTemplateColumns:"2.5fr 0.6fr 1fr 0.8fr 1.5fr", background:C.bg3, padding:"10px 18px", fontSize:10, letterSpacing:2, color:C.muted, textTransform:"uppercase" }}>
        <span>Exercise</span><span>Sets</span><span>Reps</span><span>Rest</span><span>Muscle</span>
      </div>
      {exercises.map((ex, i) => (
        <div key={i} style={{ display:"grid", gridTemplateColumns:"2.5fr 0.6fr 1fr 0.8fr 1.5fr", padding:"13px 18px", borderTop:`1px solid ${C.border}`, alignItems:"start", background: i%2===0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
          <div>
            <div style={{ fontSize:14, color:C.text, fontWeight:600 }}>{ex.name}</div>
            {ex.tip && <div style={{ fontSize:11, color:C.muted, marginTop:2, fontStyle:"italic" }}>💡 {ex.tip}</div>}
          </div>
          <span style={{ color:C.red, fontSize:15, fontWeight:700 }}>{ex.sets}</span>
          <span style={{ color:C.text, fontSize:13 }}>{ex.reps}</span>
          <span style={{ color:C.muted, fontSize:13 }}>{ex.rest}</span>
          <span style={{ color:C.muted, fontSize:12 }}>{ex.muscle}</span>
        </div>
      ))}
    </div>
  );
}

function WorkoutPage() {
  const [goal, setGoal] = useState("muscle");
  const [level, setLevel] = useState("intermediate");
  const [days, setDays] = useState(4);
  const [equipment, setEquipment] = useState("gym");
  const [generated, setGenerated] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const plan = generated ? getPlan(goal, level, days, equipment) : null;

  const handleGenerate = () => {
    setGenerated(false);
    setTimeout(() => {
      const p = getPlan(goal, level, days, equipment);
      setGenerated(true);
      // Auto-select first training day
      const firstTrainingIdx = p.split.findIndex(s => s !== "Rest");
      setSelectedDay(firstTrainingIdx >= 0 ? firstTrainingIdx : 0);
    }, 50);
  };

  // Get unique day labels from split (exclude Rest, deduplicate)
  const trainingDayNames = plan ? [...new Set(plan.split.filter(s => s !== "Rest"))] : [];
  const selectedDayName = plan && selectedDay !== null ? plan.split[selectedDay] : null;
  const dayData = plan && selectedDayName && selectedDayName !== "Rest" ? plan.days[selectedDayName] : null;

  const selStyle = { width:"100%", background:C.bg3, border:`1px solid ${C.border}`, color:C.text, padding:"12px 14px", borderRadius:2, fontSize:14, outline:"none", cursor:"pointer" };
  const btnGroupStyle = (active) => ({ flex:1, padding:"11px 8px", background:active?C.red:"transparent", border:`1px solid ${active?C.red:C.border}`, color:active?"#fff":C.muted, borderRadius:2, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, letterSpacing:1, textTransform:"uppercase", transition:"all 0.2s" });

  return (
    <div style={{ minHeight:"100vh", background:C.bg, paddingTop:80 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${C.bg} 0%, #0f0000 100%)`, padding:"40px 4vw 30px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <Tag>Training Tool</Tag>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(48px,6vw,80px)", lineHeight:0.95, marginBottom:6 }}>
            Workout <span style={{ color:C.red }}>Planner</span>
          </h1>
          <div style={{ width:60, height:3, background:C.red, borderRadius:2, margin:"12px 0 16px" }} />
          <p style={{ color:C.muted, fontSize:15, maxWidth:560 }}>
            Select your goal, experience, schedule and equipment. Get a complete weekly plan with clickable daily workouts.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"30px 4vw" }}>
        {/* Config Panel */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"24px 24px 20px", marginBottom:24 }}>
          <div style={{ fontSize:11, letterSpacing:3, color:C.red, textTransform:"uppercase", marginBottom:16 }}>Configure Your Plan</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            {/* Goal */}
            <div>
              <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase", display:"block", marginBottom:8 }}>Goal</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {[{v:"fat-loss",l:"🔥 Fat Loss"},{v:"muscle",l:"💪 Muscle Gain"},{v:"strength",l:"⚡ Strength"},{v:"beginner-fitness",l:"🌱 Beginner"}].map(g => (
                  <button key={g.v} onClick={()=>setGoal(g.v)} style={btnGroupStyle(goal===g.v)}>{g.l}</button>
                ))}
              </div>
            </div>
            {/* Experience */}
            <div>
              <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase", display:"block", marginBottom:8 }}>Experience Level</label>
              <div style={{ display:"flex", gap:6 }}>
                {[{v:"beginner",l:"Beginner"},{v:"intermediate",l:"Intermediate"},{v:"advanced",l:"Advanced"}].map(e => (
                  <button key={e.v} onClick={()=>setLevel(e.v)} style={btnGroupStyle(level===e.v)}>{e.l}</button>
                ))}
              </div>
            </div>
            {/* Equipment */}
            <div>
              <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase", display:"block", marginBottom:8 }}>Equipment</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {[{v:"gym",l:"🏋️ Full Gym"},{v:"dumbbells",l:"🪙 Dumbbells"},{v:"home",l:"🏠 No Equipment"},{v:"bands",l:"🎗 Bands"}].map(e => (
                  <button key={e.v} onClick={()=>setEquipment(e.v)} style={btnGroupStyle(equipment===e.v)}>{e.l}</button>
                ))}
              </div>
            </div>
            {/* Days per week */}
            <div>
              <label style={{ fontSize:11, letterSpacing:2, color:C.muted, textTransform:"uppercase", display:"block", marginBottom:8 }}>Days Per Week</label>
              <div style={{ display:"flex", gap:6 }}>
                {[3,4,5,6].map(d => (
                  <button key={d} onClick={()=>setDays(d)} style={{ ...btnGroupStyle(days===d), flex:1, padding:"11px 4px", fontSize:18, fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1 }}>{d}</button>
                ))}
              </div>
              <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>Select training days per week</div>
            </div>
          </div>
          <button onClick={handleGenerate} style={{ width:"100%", padding:"15px", background:C.red, border:"none", color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, letterSpacing:3, textTransform:"uppercase", borderRadius:2, cursor:"pointer", transition:"background 0.2s" }}
            onMouseEnter={e=>e.target.style.background=C.redDark}
            onMouseLeave={e=>e.target.style.background=C.red}>
            ⚡ Generate My Workout Plan
          </button>
        </div>

        {/* Plan Output */}
        {generated && plan && (
          <>
            {/* Weekly Calendar */}
            <div style={{ background:C.bg3, border:`1px solid ${C.border}`, borderRadius:4, padding:"20px 20px 16px", marginBottom:16 }}>
              <div style={{ fontSize:11, letterSpacing:3, color:C.red, textTransform:"uppercase", marginBottom:14 }}>Weekly Split — Click a Day to View Workout</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
                {DAYS_OF_WEEK.map((d, i) => {
                  const dayName = plan.split[i];
                  const isRest = dayName === "Rest";
                  const isActive = selectedDay === i;
                  return (
                    <div key={d} onClick={() => !isRest && setSelectedDay(i)}
                      style={{ background: isActive ? C.red : isRest ? C.bg : C.card, border:`2px solid ${isActive ? C.red : isRest ? C.border : C.borderHot}`, borderRadius:4, padding:"12px 6px", textAlign:"center", cursor:isRest?"default":"pointer", transition:"all 0.2s", transform:isActive?"scale(1.05)":"scale(1)", opacity:isRest?0.45:1 }}>
                      <div style={{ fontSize:11, color:isActive?"rgba(255,255,255,0.7)":C.muted, marginBottom:5, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:2 }}>{d}</div>
                      <div style={{ fontSize:11, color:isActive?"#fff":isRest?C.muted:C.red, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, lineHeight:1.3 }}>{dayName}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Day Workout Detail */}
            {selectedDayName && selectedDayName !== "Rest" && dayData ? (
              <div>
                {/* Day header */}
                <div style={{ background:`linear-gradient(135deg, #1a0000, #0a0a0a)`, border:`1px solid ${C.borderHot}`, borderRadius:4, padding:"20px 24px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                  <div>
                    <div style={{ fontSize:11, letterSpacing:3, color:C.red, textTransform:"uppercase", marginBottom:4 }}>
                      {DAYS_OF_WEEK[selectedDay]} — {selectedDayName}
                    </div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:34, lineHeight:1 }}>{dayData.focus}</div>
                  </div>
                  <div style={{ background:"rgba(232,0,42,0.1)", border:`1px solid ${C.borderHot}`, borderRadius:2, padding:"10px 16px", fontSize:13, color:C.text }}>
                    <div style={{ fontSize:10, color:C.red, letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>Cardio / Conditioning</div>
                    {dayData.cardio}
                  </div>
                </div>

                {/* Quick stats */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
                  {[
                    { label:"Exercises", val:dayData.exercises.length },
                    { label:"Total Sets", val:dayData.exercises.reduce((a,e)=>a+e.sets,0) },
                    { label:"Est. Time", val:`${Math.round(dayData.exercises.reduce((a,e)=>{const rest=parseInt(e.rest)||60;return a+(e.sets*(40+(rest)))},0)/60)} min` },
                    { label:"Focus", val:selectedDayName.split("/")[0] },
                  ].map(s => (
                    <div key={s.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"14px 12px", textAlign:"center" }}>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:C.red }}>{s.val}</div>
                      <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Exercise table */}
                <ExerciseTable exercises={dayData.exercises} />

                {/* Tips */}
                <div style={{ marginTop:14, padding:"16px 20px", background:`rgba(232,0,42,0.04)`, border:`1px solid ${C.borderHot}`, borderRadius:4, fontSize:13, color:C.muted, lineHeight:1.8 }}>
                  <div style={{ color:C.red, fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>Training Notes</div>
                  <span style={{ color:C.red }}>Progressive Overload:</span> Increase weight by the smallest increment available each week once you complete all sets at current weight with good form.{" "}
                  <span style={{ color:C.red }}>Rest:</span> Times shown are minimums — take more if needed for heavy lifts.{" "}
                  <span style={{ color:C.red }}>Recovery:</span> Sleep 7–9 hours, eat enough protein (1.6–2.2g/kg bodyweight), and stay consistent.
                </div>

                {/* Day navigation */}
                <div style={{ display:"flex", gap:10, marginTop:14, flexWrap:"wrap" }}>
                  {plan.split.map((name, i) => name !== "Rest" && (
                    <button key={i} onClick={() => setSelectedDay(i)}
                      style={{ padding:"9px 18px", background:selectedDay===i?C.red:"transparent", border:`1px solid ${selectedDay===i?C.red:C.border}`, color:selectedDay===i?"#fff":C.muted, borderRadius:2, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:2, textTransform:"uppercase", transition:"all 0.2s" }}>
                      {DAYS_OF_WEEK[i]}: {name}
                    </button>
                  ))}
                </div>
              </div>
            ) : selectedDayName === "Rest" ? (
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"40px", textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>😴</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:36, marginBottom:8 }}>Rest Day</div>
                <div style={{ color:C.muted, fontSize:14, lineHeight:1.7, maxWidth:400, margin:"0 auto" }}>
                  Recovery is where growth happens. Light walking, stretching, or yoga is fine. Eat your protein, sleep 8 hours, and come back stronger tomorrow.
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

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
      case "workout": return <WorkoutPage />;
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
