"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { HotelCard } from "@/components/hotel-card";
import { SearchPanel } from "@/components/search-panel";
import { useLanguage } from "@/components/language-provider";
import { hotels } from "@/lib/hotels";
import { getFavorites } from "@/lib/local-store";

const categories = ["All", ...Array.from(new Set(hotels.map((hotel) => hotel.category)))];
export default function SearchPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("recommended");
  const [maxPrice, setMaxPrice] = useState("1000");
  const [onlySaved, setOnlySaved] = useState(false);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [destination, setDestination] = useState("");
  const [city, setCity] = useState("");
  const [minimumRating, setMinimumRating] = useState("0");
  const [amenity, setAmenity] = useState("");
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setFavoriteSlugs(getFavorites());
    const params = new URLSearchParams(window.location.search);
    setDestination(params.get("destination") ?? "");
    setCategory(params.get("category") ?? "All");
    setCity(params.get("city") ?? "");
    setMaxPrice(params.get("maxPrice") ?? "1000");
    setMinimumRating(params.get("rating") ?? "0");
    setAmenity(params.get("amenity") ?? "");
    setSort(params.get("sort") ?? "recommended");
    setOnlySaved(params.get("saved") === "true");
    setReady(true);
    const updateSearch = (event: Event) => {
      const detail = (event as CustomEvent<{ destination: string }>).detail;
      setDestination(detail.destination);
    };
    window.addEventListener("quickstay:search", updateSearch);
    const updateFavorites = (event: Event) => setFavoriteSlugs((event as CustomEvent<string[]>).detail);
    window.addEventListener("quickstay:favorites", updateFavorites);
    return () => {
      window.removeEventListener("quickstay:search", updateSearch);
      window.removeEventListener("quickstay:favorites", updateFavorites);
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    const values = { category, city, maxPrice, rating: minimumRating, amenity, sort, saved: onlySaved ? "true" : "" };
    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const query = params.toString();
    const searchPath = query ? `/search?${query}` : "/search";
    window.history.replaceState(null, "", searchPath);
    window.dispatchEvent(new CustomEvent("quickstay:search-url", { detail: searchPath }));
  }, [amenity, category, city, maxPrice, minimumRating, onlySaved, ready, sort]);
  const filtered = useMemo(() => {
    const query = destination.trim().toLowerCase();
    const result = hotels.filter((hotel) =>
      (category === "All" || hotel.category === category) &&
      (!query || `${hotel.city} ${hotel.country} ${hotel.name}`.toLowerCase().includes(query)) &&
      (!city || hotel.city === city) &&
      hotel.price <= Number(maxPrice) &&
      hotel.rating >= Number(minimumRating) &&
      (!amenity || hotel.amenities.includes(amenity)) &&
      (!onlySaved || favoriteSlugs.includes(hotel.slug)),
    );
    if (sort === "priceLow") result.sort((a,b) => a.price-b.price);
    if (sort === "priceHigh") result.sort((a,b) => b.price-a.price);
    if (sort === "rating") result.sort((a,b) => b.rating-a.rating);
    if (sort === "popular") result.sort((a,b) => b.reviews-a.reviews);
    if (sort === "recommended") result.sort((a,b) => Number(b.featured)-Number(a.featured) || b.rating-a.rating);
    return result;
  }, [amenity, category, city, destination, favoriteSlugs, maxPrice, minimumRating, onlySaved, sort]);
  useEffect(() => setPage(1), [amenity, category, city, destination, maxPrice, minimumRating, onlySaved, sort]);
  const reset = () => {
    setCategory("All"); setCity(""); setMaxPrice("1000"); setMinimumRating("0");
    setAmenity(""); setSort("recommended"); setOnlySaved(false); setDestination("");
    window.dispatchEvent(new Event("quickstay:clear-search"));
    router.replace("/search");
  };
  const visible = filtered.slice(0, page * 12);
  const cities = Array.from(new Set(hotels.map((hotel) => hotel.city))).sort();
  const amenities = Array.from(new Set(hotels.flatMap((hotel) => hotel.amenities))).sort();
  return <div className="wrap" style={{ paddingTop: 48 }}>
    <div className="section-heading"><div><span className="eyebrow">{t("search.results")}</span><h1 className="serif" style={{ fontSize: 42, margin: "8px 0" }}>{t("nav.discover")}</h1></div><span style={{ color: "var(--muted)", fontSize: 13 }}>{t("search.showing")} {visible.length} / {filtered.length}</span></div>
    <SearchPanel/>
    <div className="filters" style={{ marginTop: 24 }}>
      {categories.map((item) => <button key={item} className={`chip ${category===item?"active":""}`} onClick={() => setCategory(item)}>{t(`category.${item}`)}</button>)}
    </div>
    <div className="filters" style={{ justifyContent: "space-between", marginTop: 18, marginBottom: 24 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <label className="filter-select"><SlidersHorizontal size={15}/>{t("search.destinationFilter")}<select aria-label={t("search.destinationFilter")} value={city} onChange={(event) => setCity(event.target.value)}><option value="">{t("search.allDestinations")}</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="filter-select">{t("search.amenity")}<select aria-label={t("search.amenity")} value={amenity} onChange={(event) => setAmenity(event.target.value)}><option value="">{t("search.allAmenities")}</option>{amenities.map((item) => <option key={item} value={item}>{t(`amenities.${item}`)}</option>)}</select></label>
        <label className="filter-select">{t("search.rating")}<select aria-label={t("search.rating")} value={minimumRating} onChange={(event) => setMinimumRating(event.target.value)}><option value="0">{t("search.anyRating")}</option><option value="4.5">4.5+</option><option value="4.7">4.7+</option><option value="4.9">4.9+</option></select></label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 12 }}>{t("search.maxPrice")}<input type="range" min="40" max="1000" step="10" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} aria-label={t("search.maxPrice")}/><strong style={{ color: "var(--ink)" }}>${maxPrice}</strong></label>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <label style={{ display: "flex", gap: 7, alignItems: "center", color: "var(--muted)", fontSize: 12 }}><input type="checkbox" checked={onlySaved} onChange={(event) => { setFavoriteSlugs(getFavorites()); setOnlySaved(event.target.checked); }}/>{t("search.favorites")}</label>
        <label style={{ color: "var(--muted)", fontSize: 12 }}>{t("search.sort")} <select value={sort} onChange={(event) => setSort(event.target.value)} style={{ marginLeft: 7, border: "1px solid var(--line)", borderRadius: 4, padding: 9, background: "#fff" }}><option value="recommended">{t("search.recommended")}</option><option value="priceLow">{t("search.priceLow")}</option><option value="priceHigh">{t("search.priceHigh")}</option><option value="rating">{t("search.rating")}</option><option value="popular">{t("search.popular")}</option></select></label>
        <button className="chip" onClick={reset}>{t("search.reset")}</button>
      </div>
    </div>
    {!ready ? <div className="hotel-grid" aria-label={t("errors.loading")}>{Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-photo"/><div className="skeleton-line"/><div className="skeleton-line short"/></div>)}</div> : filtered.length ? <><div className="hotel-grid">{visible.map((hotel) => <HotelCard key={hotel.id} hotel={hotel}/>)}</div>{visible.length < filtered.length && <button className="button button-outline" style={{ display: "flex", margin: "32px auto" }} onClick={() => setPage((previous) => previous + 1)}>{t("search.loadMore")}</button>}</> : <div className="empty">{t("search.noResults")}</div>}
    <style jsx>{`.filter-select{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:12px}.filter-select select{max-width:160px;border:1px solid var(--line);border-radius:4px;padding:9px;background:#fff;color:var(--ink)}.skeleton-card{border:1px solid var(--line);border-radius:6px;background:#fff;padding-bottom:20px;overflow:hidden}.skeleton-photo{height:245px;background:linear-gradient(100deg,#e8ebe7 20%,#f7f8f5 38%,#e8ebe7 55%);background-size:300% 100%;animation:shimmer 1.3s linear infinite}.skeleton-line{height:14px;margin:20px 18px 12px;border-radius:4px;background:#ecefea}.skeleton-line.short{width:48%;margin-top:0}@keyframes shimmer{to{background-position:-150% 0}}@media(prefers-reduced-motion:reduce){.skeleton-photo{animation:none}}@media(max-width:560px){.wrap{padding-top:30px!important}.filters input[type=range]{width:95px}.filter-select{width:100%;justify-content:space-between}.filter-select select{flex:1;max-width:210px}.skeleton-photo{height:240px}}`}</style>
  </div>;
}
