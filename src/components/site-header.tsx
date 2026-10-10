"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, MessageCircle, UserRound, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export function SiteHeader() {
  const { t, language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) { console.error("Could not restore QUICKSTAY session.", error); return; }
      if (active) setSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);
  const links = [
    ["/", t("nav.home")], ["/search", t("nav.discover")], ["/#destinations", t("nav.destinations")],
    ["/#experiences", t("nav.experiences")], ["/#about", t("nav.about")],
  ];
  return <header style={{ background: "#fbfaf7", borderBottom: "1px solid var(--line)" }}>
    <div className="wrap" style={{ height: 76, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
      <Link href="/" aria-label={t("brand")} style={{ fontWeight: 800, letterSpacing: ".13em", fontSize: 17 }}>{t("brand")}<span style={{ color: "var(--gold)" }}>.</span></Link>
      <nav style={{ display: "flex", alignItems: "center", gap: 22 }} className="desktop-nav">
        {links.map(([href, label]) => <Link key={href} href={href} style={{ color: "var(--muted)", fontSize: 13 }}>{label}</Link>)}
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <select aria-label={t("nav.language")} value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} style={{ border: 0, background: "transparent", padding: "8px 2px", fontSize: 12, fontWeight: 700 }}>
          <option value="uz">UZ</option><option value="ru">RU</option><option value="en">EN</option>
        </select>
        <Link href="/favorites" className="mobile-icon" aria-label={t("nav.saved")}><Heart size={19}/></Link>
        <Link href="/chat" className="mobile-icon" aria-label={t("nav.chat")}><MessageCircle size={19}/></Link>
        <Link href="/account" className="button button-outline desktop-signin" style={{ minHeight: 40, padding: "0 15px" }}>{session ? <><UserRound size={15}/>{session.user.user_metadata.full_name || session.user.email}</> : t("nav.signIn")}</Link>
        {!session && <Link href="/account?mode=signup" className="button desktop-signup" style={{ minHeight: 40, padding: "0 15px" }}>{t("nav.signUp")}</Link>}
        <button aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")} className="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
    </div>
    {open && <nav className="mobile-nav">{links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/favorites" onClick={() => setOpen(false)}>{t("nav.saved")}</Link><Link href="/chat" onClick={() => setOpen(false)}>{t("nav.chat")}</Link><Link href="/account" onClick={() => setOpen(false)}>{session ? session.user.user_metadata.full_name || session.user.email : t("nav.signIn")}</Link>{!session && <Link href="/account?mode=signup" onClick={() => setOpen(false)}>{t("nav.signUp")}</Link>}</nav>}
    <style jsx>{`
      .mobile-nav { display:none }
      .mobile-icon,.mobile-menu { display:none }
      @media(max-width:990px) {
        .desktop-nav,.desktop-signin,.desktop-signup { display:none !important }
        .mobile-icon { display:grid; place-items:center; color:var(--ink) }
        .mobile-menu { display:grid; place-items:center; border:0; padding:4px; background:transparent; color:var(--ink) }
        .mobile-nav { display:grid; gap:0; border-top:1px solid var(--line); background:var(--paper) }
        .mobile-nav a { padding:14px 24px; border-bottom:1px solid var(--line); font-size:14px }
      }
    `}</style>
  </header>;
}
