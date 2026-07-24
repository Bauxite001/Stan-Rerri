import { createContext, useContext, useEffect, useRef, useState } from "react";
import srLogo from "../imports/07e0be08-1a28-4b20-bf0e-519046daeb73.png";
import stanPortrait2 from "../imports/images__16_-1.jpg";
import stanPortrait from "../imports/images__16_.jpg";
import photoFamily from "../imports/download__20_.jpg";
import photoFriends from "../imports/download__21_.jpg";
import photoCelebration from "../imports/download__22_.jpg";
import photoTravel from "../imports/download__23_.jpg";
import photoDining from "../imports/download__24_.jpg";

// ─── Theme ───────────────────────────────────────────────────────────────────
type Theme = {
  dark: boolean;
  bg: string;
  bgAlt: string;
  bgCard: string;
  bgDark: string;
  fg: string;
  fgSub: string;
  fgMuted: string;
  border: string;
  navBg: string;
  navBgScrolled: string;
};

const light: Theme = {
  dark: false,
  bg: "#FFFFFF",
  bgAlt: "#F5F0EA",
  bgCard: "#F5F0EA",
  bgDark: "#1A1208",
  fg: "#1A1208",
  fgSub: "#4A3828",
  fgMuted: "#9A8C80",
  border: "rgba(26,18,8,0.08)",
  navBg: "rgba(250,250,248,0.90)",
  navBgScrolled: "rgba(250,250,248,0.96)",
};

const dark: Theme = {
  dark: true,
  bg: "#110C06",
  bgAlt: "#1C1409",
  bgCard: "#261B0E",
  bgDark: "#080503",
  fg: "#FAF6F0",
  fgSub: "#C4A882",
  fgMuted: "#7A6A58",
  border: "rgba(250,246,240,0.07)",
  navBg: "rgba(17,12,6,0.90)",
  navBgScrolled: "rgba(17,12,6,0.97)",
};

const ThemeCtx = createContext<{ t: Theme; toggle: () => void }>({ t: light, toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

// ─── Scroll-fade hook ────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.65s ease, transform 0.65s ease" }}
    >
      {children}
    </div>
  );
}

// ─── Eyebrow ─────────────────────────────────────────────────────────────────
function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p
      className={`text-[11px] font-medium tracking-[0.24em] uppercase ${center ? "text-center" : ""}`}
      style={{ color: "#E85A00", fontFamily: "'DM Sans', sans-serif" }}
    >
      {children}
    </p>
  );
}

// ─── Theme toggle button ─────────────────────────────────────────────────────
function ThemeToggle() {
  const { t, toggle } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label="Toggle dark mode"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 14px",
        borderRadius: 50,
        border: `1px solid ${hov ? "#E85A00" : t.border}`,
        background: hov ? "rgba(232,90,0,0.08)" : "transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: hov ? "#E85A00" : t.fgMuted,
      }}
    >
      {/* Track */}
      <span
        style={{
          position: "relative",
          display: "inline-block",
          width: 34,
          height: 18,
          borderRadius: 9,
          background: t.dark ? "#E85A00" : "rgba(26,18,8,0.15)",
          transition: "background 0.3s ease",
          flexShrink: 0,
        }}
      >
        {/* Knob */}
        <span
          style={{
            position: "absolute",
            top: 2,
            left: t.dark ? 16 : 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.3s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </span>
      {t.dark ? "Light" : "Dark"}
    </button>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const { t } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["About", "Values", "Celebrations", "Friends", "Instagram"];
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16"
      style={{
        height: 72,
        background: scrolled ? t.navBgScrolled : t.navBg,
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${t.border}`,
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <img
        src={srLogo}
        alt="Stan Rerri"
        style={{
          height: 48,
          width: "auto",
          filter: t.dark ? "brightness(1)" : "none",
        }}
      />
      <div className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            className="text-[12px] font-medium tracking-[0.14em] uppercase transition-colors duration-200"
            style={{ color: t.fgMuted, fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#E85A00")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = t.fgMuted)}
          >
            {l}
          </a>
        ))}
      </div>
      <ThemeToggle />
    </nav>
  );
}

// ─── Mosaic data ─────────────────────────────────────────────────────────────
const mosaicCells = [
  { photo: photoTravel, label: "Travel" },
  { photo: photoCelebration, label: "Celebrations" },
  { photo: photoFriends, label: "Friends" },
  { photo: photoDining, label: "Moments" },
  { photo: photoFamily, label: "Family" },
  { photo: stanPortrait, label: "Nigeria" },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { t } = useTheme();
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ minHeight: "100vh", paddingTop: 72, background: t.bg, transition: "background 0.4s ease" }}
    >
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,90,0,0.09) 0%, transparent 70%)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -54%)",
        }}
      />

      <img
        src={srLogo}
        alt="Stan Rerri"
        style={{ width: 300, height: "auto", animation: "fadeDown 1s ease forwards", opacity: 0 }}
      />

      <p
        className="mt-6 text-[11px] font-medium tracking-[0.24em] uppercase"
        style={{ color: "#E85A00", fontFamily: "'DM Sans', sans-serif", animation: "fadeUp 0.7s 0.2s ease forwards", opacity: 0 }}
      >
        Family · Celebrations · Life
      </p>

      <h1
        className="mt-4"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "clamp(52px, 7vw, 88px)",
          lineHeight: 1.15,
          color: t.fg,
          animation: "fadeUp 0.7s 0.3s ease forwards",
          opacity: 0,
          maxWidth: 700,
          transition: "color 0.4s ease",
        }}
      >
        Life is{" "}
        <em style={{ color: "#E85A00", fontStyle: "italic" }}>better</em>
        <br />with the ones<br />you love
      </h1>

      <div
        style={{
          width: 50, height: 1.5,
          background: "rgba(232,90,0,0.5)",
          marginTop: 28,
          animation: "fadeUp 0.7s 0.4s ease forwards",
          opacity: 0,
        }}
      />

      <p
        className="mt-6"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300, fontSize: 17, lineHeight: 1.85,
          color: t.fgSub,
          maxWidth: "48ch",
          animation: "fadeUp 0.7s 0.5s ease forwards",
          opacity: 0,
          transition: "color 0.4s ease",
        }}
      >
        Stan Rerri lives and breathes family, celebration, and genuine human connection.
        This is his world — warm, personal, and deeply rooted in love.
      </p>

      <button
        className="mt-8 px-8 py-3 text-white text-[12px] font-medium tracking-[0.14em] uppercase"
        style={{
          background: "#E85A00", borderRadius: 2,
          fontFamily: "'DM Sans', sans-serif",
          animation: "fadeUp 0.7s 0.6s ease forwards",
          opacity: 0, border: "none", cursor: "pointer",
          transition: "background 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#FF7A2B"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#E85A00"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
      >
        Discover His World
      </button>

      {/* Photo Mosaic */}
      <div
        className="mt-16 w-full max-w-4xl"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 180px)",
          gap: 12,
          animation: "fadeUp 0.7s 0.7s ease forwards",
          opacity: 0,
        }}
      >
        <div
          className="relative overflow-hidden transition-transform duration-300 hover:scale-[1.01]"
          style={{ gridRow: "1 / 3", borderRadius: 4 }}
        >
          <img src={stanPortrait2} alt="Stan Rerri" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,6,2,0.55) 0%, transparent 50%)" }} />
          <span className="absolute bottom-3 left-3 text-[11px] italic" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Cormorant Garamond', serif" }}>Stan Rerri</span>
        </div>
        {mosaicCells.map((cell, i) => (
          <div key={i} className="relative overflow-hidden transition-transform duration-300 hover:scale-[1.01]" style={{ borderRadius: 4 }}>
            <img src={cell.photo} alt={cell.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,6,2,0.55) 0%, transparent 55%)" }} />
            <span className="absolute bottom-3 left-3 text-[11px] italic" style={{ color: "rgba(255,255,255,0.9)", fontFamily: "'Cormorant Garamond', serif" }}>{cell.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(16px);  } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
function About() {
  const { t } = useTheme();
  const ref = useFadeIn();
  return (
    <section id="about" style={{ background: t.bgAlt, padding: "96px 0", transition: "background 0.4s ease" }}>
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div
          ref={ref}
          className="grid md:grid-cols-2 gap-20 items-center"
          style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.65s ease, transform 0.65s ease" }}
        >
          <div>
            <Eyebrow>About Stan</Eyebrow>
            <h2 className="mt-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(36px, 4vw, 52px)", lineHeight: 1.2, color: t.fg, transition: "color 0.4s" }}>
              A Sentimentalist<br />at{" "}<em style={{ color: "#E85A00" }}>heart</em>
            </h2>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 17, lineHeight: 1.85, color: t.fgSub, marginTop: 24, transition: "color 0.4s" }}>
              <p className="mb-4">
                Stan Rerri is a man defined by <strong style={{ fontWeight: 500 }}>his people</strong> — his family, his friends, and the moments they share together. He believes that life's greatest wealth is found not in achievements alone, but in the warmth of the people you choose to walk with.
              </p>
              <p className="mb-4">
                At his core, Stan is drawn to <strong style={{ fontWeight: 500 }}>genuine connection, joyful celebration, and quiet mindfulness</strong>. Whether hosting a lavish gathering in Lagos or savouring a still morning at home, he brings the same intentionality to every experience.
              </p>
              <p>Nigerian at heart and global in spirit, Stan moves through the world with grace, humour, and an abiding love for the people who matter most.</p>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center gap-6">
            <div style={{ position: "relative", width: "100%", maxWidth: 340, borderRadius: 4, overflow: "hidden" }}>
              <img src={photoTravel} alt="Stan Rerri" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "center top", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,6,2,0.5) 0%, transparent 55%)" }} />
              <img src={srLogo} alt="SR" style={{ position: "absolute", bottom: 16, right: 16, width: 56, opacity: 0.7 }} />
            </div>
            <p className="text-center" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: 20, lineHeight: 1.6, color: t.fgMuted, maxWidth: "28ch", transition: "color 0.4s" }}>
              "Celebrating life, family, and the people around me — every single day."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Values ──────────────────────────────────────────────────────────────────
const valuesData = [
  { emoji: "❤️", title: "Family, First & Always", desc: "Every decision traces back to family. They are his anchor, his joy, and his why." },
  { emoji: "🎊", title: "The Art of Celebration", desc: "Life's milestones deserve to be marked with intention, warmth, and unforgettable moments." },
  { emoji: "🌍", title: "Exploring Together", desc: "Travel is richer when shared. New cities, new flavours, and new memories with the ones he loves." },
  { emoji: "🧘🏿", title: "Mindfulness Daily", desc: "In the stillness between celebrations, Stan finds clarity and gratitude through mindful living." },
  { emoji: "🤝", title: "Real Friendships", desc: "He values depth over breadth — a circle of friends who show up, stay present, and speak truth." },
  { emoji: "🇳🇬", title: "Nigerian Pride", desc: "His roots inform everything — the culture, the warmth, the resilience, and the joy of being Nigerian." },
];

function ValueCard({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.bgCard,
        borderRadius: 4,
        padding: "28px 24px",
        borderBottom: `2.5px solid ${hov ? "#E85A00" : "transparent"}`,
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s ease, background 0.4s ease",
        cursor: "default",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 12 }}>{emoji}</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 21, color: t.fg, marginBottom: 8, lineHeight: 1.3, transition: "color 0.4s" }}>{title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 14, color: t.fgMuted, lineHeight: 1.75, transition: "color 0.4s" }}>{desc}</p>
    </div>
  );
}

function Values() {
  const { t } = useTheme();
  return (
    <section id="values" style={{ background: t.bg, padding: "96px 0", transition: "background 0.4s ease" }}>
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <FadeSection className="text-center mb-14">
          <Eyebrow center>What Matters Most</Eyebrow>
          <h2 className="mt-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 48px)", color: t.fg, transition: "color 0.4s" }}>
            The things he holds dear
          </h2>
        </FadeSection>
        <FadeSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {valuesData.map((v, i) => <ValueCard key={i} {...v} />)}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// ─── Celebrations ─────────────────────────────────────────────────────────────
const events = [
  { month: "Jan", type: "Family",   name: "New Year's with the Family",       location: "Lagos, Nigeria",                     tag: "Family"   },
  { month: "Mar", type: "Travel",   name: "Spring Getaway Abroad",             location: "Mediterranean",                      tag: "Travel"   },
  { month: "Jun", type: "Social",   name: "Lagos High Society Gatherings",      location: "Lekki & Victoria Island",            tag: "Social"   },
  { month: "Aug", type: "Birthday", name: "Birthday Celebrations",             location: "With the people who matter most",    tag: "Birthday" },
  { month: "Dec", type: "Family",   name: "Christmas & End-of-Year",           location: "Home, family, gratitude",            tag: "Family"   },
];

function Celebrations() {
  const { t } = useTheme();
  return (
    <section id="celebrations" style={{ background: t.bgAlt, padding: "96px 0", transition: "background 0.4s ease" }}>
      <div className="max-w-5xl mx-auto px-8 md:px-16">
        <FadeSection className="mb-12">
          <Eyebrow>The Calendar</Eyebrow>
          <h2 className="mt-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 48px)", color: t.fg, lineHeight: 1.2, transition: "color 0.4s" }}>
            A life full of{" "}<em style={{ color: "#E85A00" }}>celebrations</em>
          </h2>
          <p className="mt-4" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 17, lineHeight: 1.85, color: t.fgSub, maxWidth: "58ch", transition: "color 0.4s" }}>
            Every month brings something worth marking. Stan moves through the year with intention — honouring the people, places, and moments that shape his story.
          </p>
        </FadeSection>
        <FadeSection>
          <div style={{ borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
            {events.map((ev, i) => (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "90px 1fr auto", alignItems: "center", padding: "20px 0", borderBottom: i < events.length - 1 ? `1px solid ${t.border}` : "none" }}
              >
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 26, color: "#E85A00" }}>{ev.month}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 10, color: t.fgMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>{ev.type}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 20, color: t.fg, transition: "color 0.4s" }}>{ev.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 13, color: t.fgMuted, marginTop: 2, transition: "color 0.4s" }}>{ev.location}</div>
                </div>
                <div className="hidden sm:block ml-4">
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 11, color: "#E85A00", textTransform: "uppercase", letterSpacing: "0.12em", border: "1px solid rgba(232,90,0,0.3)", borderRadius: 50, padding: "4px 14px" }}>
                    {ev.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// ─── Pull Quote ───────────────────────────────────────────────────────────────
function PullQuote() {
  const { t } = useTheme();
  return (
    <section style={{ background: t.bgDark, padding: "112px 0", position: "relative", overflow: "hidden", transition: "background 0.4s ease" }}>
      <div style={{ position: "absolute", top: -40, left: -20, fontFamily: "'Cormorant Garamond', serif", fontSize: "28rem", lineHeight: 1, color: "rgba(232,90,0,0.05)", userSelect: "none", pointerEvents: "none" }}>
        "
      </div>
      <FadeSection className="flex flex-col items-center text-center px-8 max-w-4xl mx-auto">
        <img src={srLogo} alt="SR" style={{ width: 80, opacity: 0.15, filter: "brightness(0) invert(1)", marginBottom: 32 }} />
        <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1.5, color: "#FAF6F0", maxWidth: 820, margin: 0 }}>
          "I choose to fill every day with{" "}
          <span style={{ fontStyle: "normal", fontWeight: 600, color: "#FF7A2B" }}>positive thoughts and mindfulness</span>
          {" "}— because the life I'm building is one worth being fully present for."
        </blockquote>
        <p className="mt-8" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(250,246,240,0.35)" }}>
          — Stan Rerri · @stanrerri
        </p>
      </FadeSection>
    </section>
  );
}

// ─── Friends ─────────────────────────────────────────────────────────────────
const friendsData = [
  { handle: "Celebrations",  name: "With the Crew",      note: "White outfits, big energy — the way they celebrate", photo: photoCelebration },
  { handle: "Late Nights",   name: "Good Company",       note: "The ones who make every room feel alive",            photo: photoFriends    },
  { handle: "Family Moments",name: "Red Carpet Love",    note: "Stepping out together — always in style",            photo: photoFamily     },
  { handle: "Fine Dining",   name: "Around the Table",   note: "Food, laughter, and real conversation",              photo: photoDining     },
];

function FriendCard({ handle, name, note, photo }: { handle: string; name: string; note: string; photo: string }) {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.bgCard,
        borderRadius: 4,
        overflow: "hidden",
        borderLeft: `3px solid ${hov ? "#E85A00" : "rgba(232,90,0,0.15)"}`,
        transform: hov ? "translateX(3px)" : "translateX(0)",
        transition: "all 0.25s ease, background 0.4s ease",
        cursor: "default",
      }}
    >
      <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
        <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", transition: "transform 0.4s ease", transform: hov ? "scale(1.04)" : "scale(1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,6,2,0.5) 0%, transparent 60%)" }} />
      </div>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 11, color: "#E85A00", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{handle}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 18, color: t.fg, marginBottom: 4, transition: "color 0.4s" }}>{name}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 12, color: t.fgMuted, transition: "color 0.4s" }}>{note}</div>
      </div>
    </div>
  );
}

function Friends() {
  const { t } = useTheme();
  return (
    <section id="friends" style={{ background: t.bg, padding: "96px 0", transition: "background 0.4s ease" }}>
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <FadeSection>
            <Eyebrow>His World</Eyebrow>
            <h2 className="mt-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 48px)", color: t.fg, lineHeight: 1.2, transition: "color 0.4s" }}>
              The people who<br />make life rich
            </h2>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 17, lineHeight: 1.85, color: t.fgSub, marginTop: 24, transition: "color 0.4s" }}>
              <p className="mb-4">
                Stan's world is populated by remarkable people — artists, icons, changemakers, and those whose <strong style={{ fontWeight: 500 }}>real friendship</strong> he treasures above all else.
              </p>
              <p className="mb-4">
                From the bright lights of Nollywood to the intimate gatherings of Lagos high society, he moves through circles defined by warmth, authenticity, and genuine human connection.
              </p>
              <p>These are not just contacts — they are the people who show up, who celebrate alongside him, and who make the journey meaningful.</p>
            </div>
          </FadeSection>
          <FadeSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {friendsData.map((f, i) => <FriendCard key={i} {...f} />)}
            </div>
          </FadeSection>
        </div>
      </div>
    </section>
  );
}

// ─── Instagram CTA ────────────────────────────────────────────────────────────
function InstagramCTA() {
  const { t } = useTheme();
  return (
    <section id="instagram" style={{ background: t.bgAlt, padding: "96px 0", transition: "background 0.4s ease" }}>
      <div className="max-w-3xl mx-auto px-8 md:px-16 flex flex-col items-center text-center">
        <FadeSection className="flex flex-col items-center">
          <Eyebrow center>On Instagram</Eyebrow>
          <h2 className="mt-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 48px)", color: t.fg, transition: "color 0.4s" }}>
            Join the journey
          </h2>
          <img src={srLogo} alt="SR" style={{ width: 100, marginTop: 32, marginBottom: 40 }} />
          <div className="flex gap-16 mb-8">
            {[["2,238", "Posts"], ["3,074", "Followers"], ["2,328", "Following"]].map(([val, label]) => (
              <div key={label} className="flex flex-col items-center">
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(32px, 4vw, 52px)", color: t.fg, transition: "color 0.4s" }}>{val}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 11, color: t.fgMuted, textTransform: "uppercase", letterSpacing: "0.18em", marginTop: 4 }}>{label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 16, lineHeight: 1.85, color: t.fgMuted, maxWidth: "44ch", marginBottom: 32, transition: "color 0.4s" }}>
            Follow along for family moments, celebrations, and glimpses of a life well-lived.
          </p>
          <button
            className="px-8 py-3 text-white text-[12px] font-medium tracking-[0.14em] uppercase"
            style={{ background: "#E85A00", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", border: "none", cursor: "pointer", transition: "background 0.2s, transform 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#FF7A2B"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#E85A00"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            📷 Follow @stanrerri
          </button>
        </FadeSection>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useTheme();
  return (
    <footer style={{ background: t.bgDark, padding: "40px 64px", transition: "background 0.4s ease" }}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
        <img src={srLogo} alt="SR" style={{ height: 38, filter: "brightness(0) invert(1)", opacity: 0.6 }} />
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: 15, color: "rgba(250,246,240,0.4)", textAlign: "center" }}>
          Celebrating life, family, and the people around me.
        </p>
        <a
          href="https://instagram.com/stanrerri"
          target="_blank"
          rel="noreferrer"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(250,246,240,0.4)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#FF7A2B")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(250,246,240,0.4)")}
        >
          @stanrerri
        </a>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState(false);
  const t = isDark ? dark : light;

  return (
    <ThemeCtx.Provider value={{ t, toggle: () => setIsDark((d) => !d) }}>
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: t.bg, transition: "background 0.4s ease" }}>
        <Nav />
        <Hero />
        <About />
        <Values />
        <Celebrations />
        <PullQuote />
        <Friends />
        <InstagramCTA />
        <Footer />
      </div>
    </ThemeCtx.Provider>
  );
}
