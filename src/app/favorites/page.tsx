"use client";
import { useEffect, useState } from "react";
import { HotelCard } from "@/components/hotel-card";
import { useLanguage } from "@/components/language-provider";
import { hotels } from "@/lib/hotels";
import { getFavorites } from "@/lib/local-store";
export default function FavoritesPage() {
  const { t } = useLanguage();
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    setSaved(getFavorites());
    const update = (event: Event) => setSaved((event as CustomEvent<string[]>).detail);
    window.addEventListener("quickstay:favorites", update);
    return () => window.removeEventListener("quickstay:favorites", update);
  }, []);
  const selected = hotels.filter((hotel) => saved.includes(hotel.slug));
  return <div className="wrap" style={{ paddingTop: 48 }}><span className="eyebrow">{t("nav.saved")}</span><h1 className="serif" style={{ fontSize: 42 }}>{t("account.favorites")}</h1>{selected.length ? <div className="hotel-grid">{selected.map((hotel) => <HotelCard key={hotel.id} hotel={hotel}/>)}</div> : <div className="empty">{t("account.noFavorites")}</div>}</div>;
}
