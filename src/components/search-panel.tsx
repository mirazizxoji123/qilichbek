"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";

export function SearchPanel({ hero = false }: { hero?: boolean }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [rooms, setRooms] = useState("1");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDestination(params.get("destination") ?? "");
    setCheckIn(params.get("checkIn") ?? "");
    setCheckOut(params.get("checkOut") ?? "");
    setGuests(params.get("guests") ?? "2");
    setRooms(params.get("rooms") ?? "1");
    const clear = () => {
      setDestination(""); setCheckIn(""); setCheckOut(""); setGuests("2"); setRooms("1");
    };
    window.addEventListener("quickstay:clear-search", clear);
    return () => window.removeEventListener("quickstay:clear-search", clear);
  }, []);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      window.alert(t("booking.invalidDates")); return;
    }
    const params = new URLSearchParams({ destination, checkIn, checkOut, guests, rooms });
    window.dispatchEvent(new CustomEvent("quickstay:search", { detail: { destination } }));
    router.push(`/search?${params.toString()}`);
  };
  return <form onSubmit={submit} className={hero ? "search-panel search-hero" : "search-panel"}>
    <label className="field destination"><span>{t("search.destination")}</span><input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder={t("search.destinationPlaceholder")}/></label>
    <label className="field"><span>{t("search.checkIn")}</span><input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)}/></label>
    <label className="field"><span>{t("search.checkOut")}</span><input type="date" value={checkOut} min={checkIn || undefined} onChange={(event) => setCheckOut(event.target.value)}/></label>
    <label className="field"><span>{t("search.guests")}</span><select value={guests} onChange={(event) => setGuests(event.target.value)}>{[1,2,3,4,5,6,7,8].map((count) => <option key={count} value={count}>{count}</option>)}</select></label>
    <label className="field"><span>{t("search.rooms")}</span><select value={rooms} onChange={(event) => setRooms(event.target.value)}>{[1,2,3,4,5,6].map((count) => <option key={count} value={count}>{count}</option>)}</select></label>
    <button className="button" type="submit"><Search size={16}/>{t("search.search")}</button>
    <style jsx>{`
      .search-panel { display:grid; grid-template-columns:minmax(170px,1.4fr) repeat(4,minmax(85px,.7fr)) auto; align-items:end; gap:12px; padding:16px; border:1px solid var(--line); border-radius:6px; background:#fff; box-shadow:0 12px 44px #18241e12 }
      .search-panel :global(.field input),.search-panel :global(.field select) { height:42px }
      .search-panel :global(.button) { min-height:42px; white-space:nowrap }
      @media(max-width:880px) { .search-panel { grid-template-columns:repeat(3,minmax(0,1fr)) }.destination { grid-column:1/-1 }.search-panel :global(button) { grid-column:1/-1 } }
      @media(max-width:560px) { .search-panel { grid-template-columns:repeat(2,minmax(0,1fr)) } }
      @media(max-width:380px) { .search-panel { padding:11px;gap:9px } }
    `}</style>
  </form>;
}
