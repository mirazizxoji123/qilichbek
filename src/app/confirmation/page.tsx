"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getBookings, type Booking } from "@/lib/local-store";
export default function ConfirmationPage() {
  const { t } = useLanguage();
  const [booking, setBooking] = useState<Booking | null>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    setBooking(getBookings().find((item) => item.id === id) ?? null);
  }, []);
  if (!booking) return <div className="wrap" style={{ padding: "100px 0", textAlign: "center" }}><h1 className="serif">{t("booking.notFound")}</h1><p>{t("booking.notFoundText")}</p><Link className="button" href="/search">{t("home.explore")}</Link></div>;
  return <div className="wrap" style={{ maxWidth: 700, padding: "80px 0", textAlign: "center" }}><CheckCircle2 size={46} color="var(--gold)"/><span className="eyebrow" style={{ display: "block", marginTop: 18 }}>{t("booking.confirmed")}</span><h1 className="serif" style={{ fontSize: 45 }}>{booking.hotelName}</h1><p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{t("booking.confirmationText")}</p><div className="notice" style={{ textAlign: "left", margin: "26px auto", maxWidth: 520 }}><strong>{t("booking.reference")}:</strong> {booking.id.slice(0, 8).toUpperCase()}<br/>{booking.checkIn} — {booking.checkOut}<br/>{t(booking.roomId === "comfort" ? "hotel.comfortRoom" : "hotel.signatureSuite")} · ${booking.total.toFixed(2)}<br/>{t("booking.priceBreakdown")}: ${booking.base.toFixed(2)} + ${booking.serviceFee.toFixed(2)} + ${booking.tax.toFixed(2)}</div><Link className="button" href="/account">{t("booking.goAccount")}</Link></div>;
}
