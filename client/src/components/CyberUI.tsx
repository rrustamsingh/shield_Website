import { useEffect, useState } from "react";
import { Binary, Cpu, Radio, ShieldCheck } from "lucide-react";

export function CyberLoader({ label = "ESTABLISHING SECURE CHANNEL" }: { label?: string }) {
  return <div className="cyber-loader" role="status" aria-live="polite">
    <div className="cyber-loader__core"><span className="cyber-loader__ring cyber-loader__ring--outer" /><span className="cyber-loader__ring cyber-loader__ring--inner" /><ShieldCheck size={30} className="relative z-10 text-[#b8ff6a]" /></div>
    <div className="mono mt-7 text-xs tracking-[.25em] text-[#b8ff6a]">{label}</div>
    <div className="cyber-loader__bar"><span /></div>
    <div className="mt-3 flex items-center gap-3 text-[10px] tracking-[.16em] text-[#5d777e]"><span>AUTH</span><span className="text-[#71e1ed]">OK</span><span>ROUTE</span><span className="text-[#71e1ed]">SYNC</span><span>NODE</span><span className="text-[#b8ff6a]">LIVE</span></div>
  </div>;
}

const nodes = Array.from({ length: 12 }, (_, index) => index);
export function CyberBackground() {
  return <div className="cyber-background" aria-hidden="true"><div className="cyber-background__grid" /><div className="cyber-background__beam cyber-background__beam--one" /><div className="cyber-background__beam cyber-background__beam--two" /><div className="cyber-background__scan" />{nodes.map((node) => <span key={node} className="cyber-node" style={{ "--node-x": `${(node * 31) % 100}%`, "--node-y": `${(node * 47) % 100}%`, "--node-delay": `${(node % 6) * -1.1}s` } as React.CSSProperties}><i /></span>)}</div>;
}

export function ScrollRevealController({ routeKey }: { routeKey: string }) {
  useEffect(() => {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>("main section, main article, main .card-hover, main > div > .grid, main > div > .gradient-border"));
    candidates.forEach((element) => element.classList.add("reveal-on-scroll"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.08, rootMargin: "0px 0px -30px" });
    candidates.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [routeKey]);
  return null;
}

export function SignalStrip() { return <div className="cyber-signal-strip"><Cpu size={13} /><span>SHIELD NETWORK</span><i /><Radio size={13} /><span>LIVE LEARNING NODE</span><i /><Binary size={13} /><span>ETHICAL MODE: ON</span></div>; }
