"use client";

import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { getFavorites, toggleFavorite } from "@/lib/local-store";
import type { Hotel } from "@/lib/hotels";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const { t } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [returnTo, setReturnTo] = useState("");
  useEffect(() => setSaved(getFavorites().includes(hotel.slug)), [hotel.slug]);
  useEffect(() => {
    const updateReturnTo = (path = `${window.location.pathname}${window.location.search}`) => {
      if (path.startsWith("/search")) setReturnTo(path);
    };
    updateReturnTo();
    const update = (event: Event) => updateReturnTo((event as CustomEvent<string>).detail);
    window.addEventListener("quickstay:search-url", update);
    return () => window.removeEventListener("quickstay:search-url", update);
  }, []);
  const detailHref = `/hotels/${hotel.slug}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
  const favorite = (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      const favorites = toggleFavorite(hotel.slug);
      setSaved(favorites.includes(hotel.slug));
      window.dispatchEvent(new CustomEvent("quickstay:favorites", { detail: favorites }));
    }
    catch { window.alert(t("errors.storage")); }
  };
  return <article className="hotel-card">
    <div className="hotel-photo" style={{ backgroundColor: "#dce5df", backgroundImage: `url("${hotel.image}")` }}>
      <Link className="photo-link" href={detailHref} aria-label={`${t("hotel.viewDetails")}: ${hotel.name}`}>
        <span className="badge" style={{ position: "absolute", top: 14, left: 14 }}>{t(`category.${hotel.category}`)}</span>
      </Link>
      <button className="favorite" aria-label={saved ? t("hotel.removeFavorite") : t("hotel.addFavorite")} onClick={favorite} style={{ position: "absolute", top: 12, right: 12, color: saved ? "#ba705f" : "var(--ink)" }}><Heart size={18} fill={saved ? "currentColor" : "none"}/></button>
    </div>
    <Link className="hotel-info hotel-info-link" href={detailHref}>
      <div className="hotel-meta"><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><MapPin size={13}/>{hotel.city}, {hotel.country}</span><span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--ink)" }}><Star size={13} fill="var(--gold)" color="var(--gold)"/>{hotel.rating}</span></div>
      <h3>{hotel.name}</h3><p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.55, margin: "0 0 16px" }}>{t(`hotel.descriptions.${hotel.category}`)}</p>
      <div className="hotel-meta"><span>{t("hotel.from")} <strong className="price">${hotel.price}</strong><small>{t("hotel.perNight")}</small></span><span aria-label={t("hotel.rating")}>{hotel.reviews} · {t("hotel.sampleReviews")}</span></div>
      <span className="view-details">{t("hotel.viewDetails")}</span>
    </Link>
    <style jsx>{`.photo-link{position:absolute;inset:0}.hotel-info-link{display:flex;min-height:202px;flex-direction:column}.hotel-info-link p{flex:1}.hotel-card:hover .view-details{color:#8c7143}.view-details{display:inline-flex;align-self:flex-start;margin-top:15px;border-bottom:1px solid var(--gold);padding-bottom:4px;color:var(--ink);font-size:12px;font-weight:700}`}</style>
  </article>;
}
