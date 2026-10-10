"use client";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
export default function NotFound() {
  const { t } = useLanguage();
  return <div className="wrap" style={{ minHeight: "55vh", display: "grid", alignContent: "center", textAlign: "center" }}><span className="eyebrow">404 · QUICKSTAY</span><h1 className="serif" style={{ fontSize: 46 }}>{t("errors.notFoundTitle")}</h1><p style={{ color: "var(--muted)" }}>{t("search.noResults")}</p><Link className="button" style={{ justifySelf: "center", marginTop: 15 }} href="/search">{t("home.explore")}</Link></div>;
}
