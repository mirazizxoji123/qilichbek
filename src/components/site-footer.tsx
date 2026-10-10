"use client";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { t } = useLanguage();
  return <footer className="site-footer">
    <div className="wrap" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 32 }}>
      <div><Link href="/" style={{ color: "white", fontWeight: 800, letterSpacing: ".14em" }}>{t("brand")}</Link><p style={{ maxWidth: 300, lineHeight: 1.7, fontSize: 13 }}>{t("footer.tagline")}</p></div>
      <div><strong style={{ fontSize: 12 }}>{t("footer.explore")}</strong><p><Link href="/search">{t("nav.discover")}</Link></p><p><Link href="/favorites">{t("nav.saved")}</Link></p></div>
      <div><strong style={{ fontSize: 12 }}>{t("footer.support")}</strong><p><Link href="/chat">{t("nav.chat")}</Link></p><p><Link href="/account">{t("nav.account")}</Link></p></div>
    </div>
    <div className="wrap" style={{ display: "flex", justifyContent: "space-between", gap: 15, borderTop: "1px solid #ffffff24", marginTop: 34, paddingTop: 20, fontSize: 11, color: "#c5ccc8" }}>
      <span>© 2026 QUICKSTAY. {t("footer.rights")}</span><span>{t("footer.disclaimer")}</span>
    </div>
    <style jsx>{`@media(max-width:560px){.wrap{grid-template-columns:1fr 1fr !important}.wrap>div:first-child{grid-column:1/-1}.wrap:nth-child(2){display:grid !important;grid-template-columns:1fr !important}}`}</style>
  </footer>;
}
