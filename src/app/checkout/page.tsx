"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { hotels } from "@/lib/hotels";
import { saveBooking } from "@/lib/local-store";
import { useLanguage } from "@/components/language-provider";

function today() { return new Date().toISOString().slice(0, 10); }
export default function CheckoutPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [hotelSlug, setHotelSlug] = useState(hotels[0].slug);
  const [roomId, setRoomId] = useState(hotels[0].rooms[0].id);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [error, setError] = useState("");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("hotel");
    const selected = hotels.find((hotel) => hotel.slug === slug) ?? hotels[0];
    setHotelSlug(selected.slug);
    setRoomId(selected.rooms.find((room) => room.id === params.get("room"))?.id ?? selected.rooms[0].id);
    setCheckIn(params.get("checkIn") || "");
    setCheckOut(params.get("checkOut") || "");
    setGuests(Math.max(1, Number(params.get("guests")) || 2));
    setRooms(Math.max(1, Number(params.get("rooms")) || 1));
  }, []);
  const hotel = hotels.find((item) => item.slug === hotelSlug) ?? hotels[0];
  const room = hotel.rooms.find((item) => item.id === roomId) ?? hotel.rooms[0];
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    return Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  }, [checkIn, checkOut]);
  const base = room.price * nights * rooms;
  const serviceFee = Math.round(base * 0.05 * 100) / 100;
  const tax = Math.round((base + serviceFee) * 0.08 * 100) / 100;
  const total = base + serviceFee + tax;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!guestName.trim() || !email.trim() || !phone.trim()) { setError(t("booking.required")); return; }
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn) || new Date(checkIn) < new Date(today())) { setError(t("booking.invalidDates")); return; }
    if (!Number.isInteger(guests) || !Number.isInteger(rooms) || guests < 1 || rooms < 1 || guests > room.guests * rooms) { setError(t("booking.required")); return; }
    if (rooms > hotel.availability.sampleRooms) { setError(t("errors.sampleAvailability")); return; }
    const id = crypto.randomUUID();
    try {
      saveBooking({ id, hotelSlug, hotelName: hotel.name, roomId: room.id, roomName: room.name, guestName: guestName.trim(), email: email.trim(), phone: phone.trim(), checkIn, checkOut, guests, rooms, notes: notes.trim(), base, serviceFee, tax, total, createdAt: new Date().toISOString() });
      router.push(`/confirmation?id=${encodeURIComponent(id)}`);
    } catch {
      setError(t("errors.storage"));
    }
  };
  return <div className="wrap" style={{ padding: "50px 0", maxWidth: 980 }}>
    <span className="eyebrow">{t("booking.title")}</span><h1 className="serif" style={{ fontSize: 43, margin: "8px 0 24px" }}>{t("booking.title")}</h1>
    <div className="checkout-grid">
      <form onSubmit={submit} className="checkout-form">
        <p className="notice">{t("booking.localNotice")}</p>
        <label className="field"><span>{t("booking.property")}</span><select value={hotelSlug} onChange={(event) => { const nextHotel = hotels.find((item) => item.slug === event.target.value) ?? hotels[0]; setHotelSlug(nextHotel.slug); setRoomId(nextHotel.rooms[0].id); }}>{hotels.map((item) => <option key={item.id} value={item.slug}>{item.name} · {item.city}</option>)}</select></label>
        <label className="field"><span>{t("hotel.rooms")}</span><select value={roomId} onChange={(event) => setRoomId(event.target.value)}>{hotel.rooms.map((item) => <option key={item.id} value={item.id}>{t(item.id === "comfort" ? "hotel.comfortRoom" : "hotel.signatureSuite")} · ${item.price}</option>)}</select></label>
        <div className="fields-two"><label className="field"><span>{t("search.checkIn")}</span><input type="date" min={today()} value={checkIn} onChange={(event) => setCheckIn(event.target.value)}/></label><label className="field"><span>{t("search.checkOut")}</span><input type="date" min={checkIn || today()} value={checkOut} onChange={(event) => setCheckOut(event.target.value)}/></label></div>
        <div className="fields-two"><label className="field"><span>{t("search.guests")}</span><input type="number" min="1" max="12" value={guests} onChange={(event) => setGuests(Number(event.target.value))}/></label><label className="field"><span>{t("search.rooms")}</span><input type="number" min="1" max="6" value={rooms} onChange={(event) => setRooms(Number(event.target.value))}/></label></div>
        <h2 className="serif" style={{ fontSize: 25, margin: "14px 0 0" }}>{t("account.profile")}</h2>
        <label className="field"><span>{t("booking.guestName")}</span><input autoComplete="name" required value={guestName} onChange={(event) => setGuestName(event.target.value)}/></label>
        <label className="field"><span>{t("booking.email")}</span><input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)}/></label>
        <label className="field"><span>{t("booking.phone")}</span><input type="tel" autoComplete="tel" required value={phone} onChange={(event) => setPhone(event.target.value)}/></label>
        <label className="field"><span>{t("booking.notes")}</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)}/></label>
        {error && <p role="alert" style={{ color: "#a23c32", fontSize: 13 }}>{error}</p>}
        <button className="button" type="submit" style={{ width: "100%" }}>{t("booking.continue")} · ${total}</button>
      </form>
      <aside className="summary"><div style={{ height: 190, borderRadius: 4, background: `url("${hotel.image}") center/cover`}}/><span className="eyebrow" style={{ display: "block", marginTop: 18 }}>{hotel.city}</span><h2 className="serif" style={{ fontSize: 26, margin: "6px 0" }}>{hotel.name}</h2><p style={{ color: "var(--muted)", fontSize: 13 }}>{t("hotel.comfortRoom")} · {guests} {t("hotel.guests")} · {rooms} {t("search.rooms")}</p><hr/><p style={{ color: "var(--muted)", fontSize: 12 }}>{t("booking.priceBreakdown")} · {t("booking.samplePrices")}</p><div className="summary-line"><span>${room.price} × {nights} {t("booking.nights")} × {rooms}</span><strong>${base.toFixed(2)}</strong></div><div className="summary-line"><span>{t("booking.serviceFee")}</span><strong>${serviceFee.toFixed(2)}</strong></div><div className="summary-line"><span>{t("booking.tax")}</span><strong>${tax.toFixed(2)}</strong></div><hr/><div className="summary-line total"><span>{t("booking.total")}</span><strong>${total.toFixed(2)}</strong></div></aside>
    </div>
    <style jsx>{`.checkout-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:35px;align-items:start}.checkout-form,.summary{display:grid;gap:17px}.summary{position:sticky;top:20px;border:1px solid var(--line);border-radius:6px;padding:18px;background:white}.fields-two{display:grid;grid-template-columns:1fr 1fr;gap:14px}hr{width:100%;border:0;border-top:1px solid var(--line)}.summary-line{display:flex;justify-content:space-between;color:var(--muted);font-size:13px}.summary-line.total{color:var(--ink);font-size:16px}@media(max-width:700px){.checkout-grid{grid-template-columns:1fr}.summary{position:static;grid-row:1}.wrap{padding-top:34px!important}}@media(max-width:400px){.fields-two{grid-template-columns:1fr}}`}</style>
  </div>;
}
