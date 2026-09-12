import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, ShieldCheck, X } from "lucide-react";
import { CyberBackground, ScrollRevealController, SignalStrip } from "./CyberUI";

const links = [
  ["About", "/about"],
  ["Domains", "/domains"],
  ["Team", "/team"],
  ["Events", "/events"],
  ["Status", "/status"],
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); setOpen(false); }, [location]);
  return (
    <div className="relative min-h-screen overflow-clip bg-[#071014] text-[#e8eef2]">
      <CyberBackground />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071014]/85 backdrop-blur-xl">
        <div className="container flex min-h-[74px] items-center justify-between gap-6">
          <button onClick={() => setExpanded(!expanded)} className="group flex items-center gap-3 text-left" aria-label="Expand SHIELD full form">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#b8ff6a]/35 bg-[#b8ff6a]/10 text-[#b8ff6a] shadow-[0_0_25px_rgba(184,255,106,.08)]"><ShieldCheck size={21} /></span>
            <span>
              <span className="mono block text-sm font-medium tracking-[.28em] text-[#b8ff6a]">SHIELD</span>
              <span className={`block overflow-hidden text-[10px] text-[#8da2aa] transition-all duration-200 ${expanded ? "max-h-8 opacity-100" : "max-h-0 opacity-0"}`}>Society for Hacking Intelligence and Ethical Learning and Defence</span>
            </span>
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(([label, href]) => <Link key={href} href={href} className={`rounded-lg px-3 py-2 text-sm transition hover:bg-white/5 hover:text-[#b8ff6a] ${location === href ? "text-[#b8ff6a]" : "text-[#9aadb4]"}`}>{label}</Link>)}
            <Link href="/apply" className="ml-2 flex items-center gap-1 rounded-lg border border-[#b8ff6a]/35 bg-[#b8ff6a] px-4 py-2 text-sm font-semibold text-[#071014] transition hover:bg-[#cbff91]">Join SHIELD <ArrowUpRight size={15} /></Link>
          </nav>
          <button className="rounded-lg border border-white/10 p-2 text-[#8da2aa] md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {open && <nav className="container flex flex-col gap-1 border-t border-white/10 py-3 md:hidden">
          {[...links, ["Apply", "/apply"]].map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-[#9aadb4] hover:bg-white/5 hover:text-[#b8ff6a]">{label}</Link>)}
        </nav>}
      </header>
      <SignalStrip />
      <div key={location} className="route-stage relative z-10"><ScrollRevealController routeKey={location} />{children}</div>
      <footer className="border-t border-white/10 bg-[#050b0d] py-14">
        <div className="container grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div><div className="mono mb-4 text-sm tracking-[.3em] text-[#b8ff6a]">SHIELD / NITH</div><p className="max-w-sm text-sm leading-7 text-[#80949d]">A community for builders, defenders, and curious minds learning to make the digital world safer.</p><p className="mono mt-7 text-xs text-[#53666e]">SECURE BY DEFAULT · ETHICAL BY DESIGN</p></div>
          <div><p className="mono mb-4 text-xs tracking-[.2em] text-[#53666e]">EXPLORE</p><div className="grid gap-3 text-sm text-[#8da2aa]"><Link href="/about" className="hover:text-[#b8ff6a]">About us</Link><Link href="/domains" className="hover:text-[#b8ff6a]">Domains</Link><Link href="/events" className="hover:text-[#b8ff6a]">Events</Link></div></div>
          <div><p className="mono mb-4 text-xs tracking-[.2em] text-[#53666e]">NIT HAMIRPUR</p><p className="text-sm leading-7 text-[#8da2aa]">Himachal Pradesh<br />India<br /><a href="mailto:shield@nith.ac.in" className="text-[#b8ff6a] hover:underline">shield@nith.ac.in</a></p></div>
        </div>
        <div className="container mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-[#53666e] sm:flex-row"><span>© 2025 SHIELD, NIT Hamirpur</span><span className="mono">HEAD OF SOCIETY · AVISHIT SHRIVASTAV</span></div>
      </footer>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) { return <div className="max-w-2xl"><div className="mono mb-3 text-xs tracking-[.22em] text-[#b8ff6a]">{eyebrow}</div><h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>{copy && <p className="mt-4 leading-7 text-[#8da2aa]">{copy}</p>}</div>; }
export function Pill({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "cyan" | "purple" }) { const colors = { green: "border-[#b8ff6a]/25 bg-[#b8ff6a]/10 text-[#b8ff6a]", cyan: "border-[#71e1ed]/25 bg-[#71e1ed]/10 text-[#71e1ed]", purple: "border-[#bd9cff]/25 bg-[#bd9cff]/10 text-[#bd9cff]" }; return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${colors[tone]}`}>{children}</span>; }
export function ButtonLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) { return <Link href={href} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition active:scale-[.97] ${secondary ? "border border-white/15 bg-white/[.03] text-[#d7e2e6] hover:border-[#71e1ed]/40 hover:bg-white/[.07]" : "bg-[#b8ff6a] text-[#071014] hover:bg-[#cbff91]"}`}>{children}</Link>; }
