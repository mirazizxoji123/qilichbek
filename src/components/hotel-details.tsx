"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, MapPin, Star } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { hotels, type Hotel } from "@/lib/hotels";
import { HotelCard } from "@/components/hotel-card";

export function HotelDetails({ hotel }: { hotel: Hotel }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [room, setRoom] = useState(hotel.rooms[0].id);
  const [returnTo, setReturnTo] = useState("/search");
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get("returnTo");
    if (target?.startsWith("/search") && !target.startsWith("//")) setReturnTo(target);
  }, []);
  const selectedRoom = hotel.rooms.find((item) => item.id === room) ?? hotel.rooms[0];
  const checkoutUrl = () => {
    const params = new URLSearchParams({ hotel: hotel.slug, room: selectedRoom.id });
    const search = new URLSearchParams(returnTo.split("?")[1] ?? "");
    for (const key of ["checkIn", "checkOut", "guests", "rooms"]) {
      const value = search.get(key);
      if (value) params.set(key, value);
    }
    return `/checkout?${params.toString()}`;
  };
  return <div className="wrap" style={{ paddingTop: 36 }}>
    <Link href={returnTo} className="back-link"><ArrowLeft size={15}/>{t("hotel.backToResults")}</Link>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 15, alignItems: "center", marginBottom: 20 }}>
      <div><span className="eyebrow">{t(`category.${hotel.category}`)}</span><h1 className="serif" style={{ fontSize: "clamp(34px,5vw,54px)", margin: "8px 0" }}>{hotel.name}</h1><div style={{ display: "flex", gap: 8, color: "var(--muted)", fontSize: 13 }}><MapPin size={15}/>{hotel.city}, {hotel.country}<span>·</span><Star size={15} color="var(--gold)" fill="var(--gold)"/>{t("hotel.rating")} {hotel.rating} ({hotel.reviews} {t("hotel.sampleReviews")})</div></div>
      <button className="button button-outline" onClick={() => router.push(checkoutUrl())}>{t("hotel.book")}</button>
    </div>
    <div className="gallery"><div className="gallery-main" style={{ backgroundImage: `url("${hotel.images[0]}")` }}/><div className="gallery-side"><div style={{ backgroundImage: `url("${hotel.images[1]}")` }}/><div style={{ backgroundImage: `url("${hotel.images[2]}")` }}/></div></div>
    <div className="details-layout">
      <section><h2 className="serif" style={{ fontSize: 32 }}>{t("hotel.description")}</h2><p style={{ color: "var(--muted)", lineHeight: 1.8 }}>{t(`hotel.descriptions.${hotel.category}`)}</p>
        <h2 className="serif" style={{ fontSize: 28, marginTop: 34 }}>{t("hotel.amenities")}</h2><div className="amenities">{hotel.amenities.map((amenity) => <span key={amenity}><Check size={14} color="var(--gold)"/>{t(`amenities.${amenity}`)}</span>)}</div>
        <h2 className="serif" style={{ fontSize: 28, marginTop: 34 }}>{t("hotel.policies")}</h2><p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{t("hotel.checkIn")}: {hotel.checkIn} · {t("hotel.checkOut")}: {hotel.checkOut}</p>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{t("hotel.cancellation")}: {t("hotel.freeCancel")} · {t("hotel.sampleContent")}</p>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{t("hotel.capacity")}: {hotel.capacity} {t("hotel.guests")} · {t("hotel.beds")}: {hotel.rooms.map((item) => item.bed).join(", ")}</p>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{t("hotel.sampleReviews")}: {hotel.reviews} · {t("hotel.rating")}: {hotel.rating}/5</p>
      </section>
      <aside className="booking-card"><span className="eyebrow">{t("hotel.available")}</span><div className="price" style={{ fontSize: 27, marginTop: 9 }}>${selectedRoom.price}<small>{t("hotel.perNight")}</small></div><p style={{ color: "var(--muted)", fontSize: 12 }}>{t("hotel.included")}: {t("hotel.breakfast")} · {t("hotel.freeCancel")}</p><h3 style={{ fontSize: 13, marginTop: 24 }}>{t("hotel.rooms")}</h3>
        {hotel.rooms.map((item) => <label key={item.id} className={`room ${room===item.id?"selected":""}`}><input type="radio" name="room" value={item.id} checked={room===item.id} onChange={() => setRoom(item.id)}/><span><strong>{t(item.id === "comfort" ? "hotel.comfortRoom" : "hotel.signatureSuite")}</strong><small>{item.guests} {t("hotel.guests")} · {t(item.id === "comfort" ? "hotel.roomBasicDescription" : "hotel.roomSuiteDescription")} · {t(item.id === "comfort" ? "hotel.queenBed" : "hotel.kingBed")}</small></span><strong>${item.price}</strong></label>)}
        <button className="button" style={{ width: "100%", marginTop: 16 }} onClick={() => router.push(checkoutUrl())}>{t("hotel.book")}</button><p className="notice" style={{ marginTop: 15 }}>{t("hotel.cancel")}</p>
      </aside>
    </div>
    <section className="wrap" style={{ paddingTop: 10, paddingBottom: 30 }}><h2 className="serif" style={{ fontSize: 30 }}>{t("hotel.nearby")}</h2><div className="hotel-grid">{hotels.filter((item) => item.slug !== hotel.slug && (item.city === hotel.city || item.category === hotel.category)).slice(0, 3).map((item) => <HotelCard key={item.id} hotel={item}/>)}</div></section>
    <style jsx>{`
      .gallery{height:420px;display:grid;grid-template-columns:1.6fr 1fr;gap:10px;overflow:hidden;border-radius:6px}.gallery-main,.gallery-side>div{background-size:cover;background-position:center}.gallery-side{display:grid;grid-template-rows:1fr 1fr;gap:10px;min-height:0}
      .back-link{display:inline-flex;align-items:center;gap:8px;margin-bottom:20px;color:var(--muted);font-size:12px;transition:color .2s}.back-link:hover{color:var(--ink)}
      .details-layout{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(300px,.8fr);gap:60px;padding:42px 0}
      .amenities{display:grid;grid-template-columns:repeat(2,1fr);gap:13px;color:#66716c;font-size:13px}.amenities span{display:flex;align-items:center;gap:8px}
      .booking-card{align-self:start;position:sticky;top:20px;border:1px solid var(--line);border-radius:6px;padding:23px;background:#fff}
      .room{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:start;border:1px solid var(--line);border-radius:4px;padding:12px;margin:9px 0;cursor:pointer;font-size:12px}.room.selected{border-color:var(--gold);background:#fbf8f1}.room input{margin-top:3px;accent-color:var(--ink)}.room span{display:grid;gap:5px}.room small{color:var(--muted);line-height:1.45}
      @media(max-width:760px){.gallery{height:340px}.details-layout{grid-template-columns:1fr;gap:25px}.booking-card{position:static}}
      @media(max-width:480px){.gallery{height:270px;grid-template-columns:1fr}.gallery-side{display:none}}
    `}</style>
  </div>;
}
