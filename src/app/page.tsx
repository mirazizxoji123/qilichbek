"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { HotelCard } from "@/components/hotel-card";
import { SearchPanel } from "@/components/search-panel";
import { useLanguage } from "@/components/language-provider";
import { hotels } from "@/lib/hotels";

export default function Home() {
  const { t } = useLanguage();
  return <>
    <section className="hero">
      <div className="hero-photo" />
      <div className="wrap hero-content">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          <span className="eyebrow">{t("home.eyebrow")}</span>
          <h1 className="serif">{t("home.title")}</h1>
          <p>{t("home.subtitle")}</p>
          <Link href="/search" className="hero-link">{t("home.explore")} <ArrowRight size={17}/></Link>
        </motion.div>
        <a className="scroll-cue" href="#discover"><span>{t("home.scroll")}</span><ArrowDownRight size={18}/></a>
      </div>
      <style jsx>{`
        .hero { position:relative; min-height:610px; display:flex; align-items:center; overflow:hidden; background:#344742; color:white }
        .hero-photo { position:absolute; inset:0; background:linear-gradient(90deg,#101c19d9 0%,#17241f9e 45%,#18221e30 100%),url("/stays/hero.jpg") center 53%/cover }
        .hero-content { position:relative; padding-top:22px; padding-bottom:95px }
        .hero h1 { max-width:680px; margin:19px 0 15px; font-size:clamp(50px,7.4vw,88px); line-height:.99; color:#fff }
        .hero p { max-width:520px; margin:0; color:#e0e5e1; font-size:16px; line-height:1.8 }
        .hero-link { display:inline-flex; align-items:center; gap:12px; margin-top:30px; border-bottom:1px solid #ffffff80; padding-bottom:9px; font-size:13px }
        .scroll-cue { position:absolute; right:0; bottom:41px; display:flex; align-items:center; gap:12px; color:#fff; font-size:9px; letter-spacing:.16em }
        @media(max-width:560px){.hero{min-height:560px}.hero-content{padding-bottom:65px}.hero p{font-size:14px}.scroll-cue{bottom:25px}}
      `}</style>
    </section>
    <div className="wrap" style={{ position: "relative", zIndex: 1, marginTop: -38 }}><SearchPanel hero/></div>
    <section className="section" id="discover">
      <div className="wrap">
        <div className="section-heading"><div><span className="eyebrow">{t("home.featured")}</span><h2 className="serif">{t("home.featuredSub")}</h2></div><Link href="/search" className="button button-outline">{t("home.explore")} <ArrowRight size={15}/></Link></div>
        <div className="hotel-grid">{hotels.filter((hotel) => hotel.featured).slice(0, 6).map((hotel, index) => <motion.div key={hotel.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index % 3 * .08 }}><HotelCard hotel={hotel}/></motion.div>)}</div>
      </div>
    </section>
    <section className="section" id="destinations" style={{ paddingTop: 8 }}>
      <div className="wrap"><div className="section-heading"><div><span className="eyebrow">{t("home.destinations")}</span><h2 className="serif">{t("home.destinationsSub")}</h2></div><Link href="/search" className="button button-outline">{t("home.explore")} <ArrowRight size={15}/></Link></div>
        <div className="destination-grid">{["Tashkent","Samarkand","Bukhara","Istanbul","Bali","Paris"].map((city) => {
          const hotel = hotels.find((item) => item.city === city);
          if (!hotel) return null;
          return <Link className="destination-card" key={city} href={`/search?destination=${encodeURIComponent(city)}`} style={{ backgroundImage: `linear-gradient(0deg,#15201dd9,transparent 75%),url("${hotel.image}")` }}><span>{city}</span><small>{hotel.country}</small></Link>;
        })}</div>
      </div>
      <style jsx>{`.destination-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.destination-card{display:flex;min-height:225px;flex-direction:column;justify-content:end;border-radius:5px;background-size:cover;background-position:center;padding:20px;color:white;transition:transform .2s}.destination-card:hover{transform:translateY(-3px)}.destination-card span{font:26px Georgia,serif}.destination-card small{margin-top:4px;color:#e0e5e1;font-size:11px}@media(max-width:620px){.destination-grid{grid-template-columns:repeat(2,1fr);gap:10px}.destination-card{min-height:160px;padding:14px}.destination-card span{font-size:20px}}`}</style>
    </section>
    <section className="section" id="experiences" style={{ paddingTop: 12 }}>
      <div className="wrap"><div className="section-heading"><div><span className="eyebrow">{t("home.experiences")}</span><h2 className="serif">{t("home.whySub")}</h2></div></div>
        <div className="experience-grid">{["Luxury","Beach","Mountain","Boutique","Family","Budget"].map((category) => <Link key={category} href={`/search?category=${encodeURIComponent(category)}`} className="experience-tile"><span>{t(`category.${category}`)}</span><ArrowRight size={17}/></Link>)}</div>
      </div>
      <style jsx>{`.experience-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.experience-tile{display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid var(--line);border-radius:5px;background:#fff;padding:20px;transition:border-color .2s,transform .2s}.experience-tile:hover{border-color:var(--gold);transform:translateY(-2px)}@media(max-width:560px){.experience-grid{grid-template-columns:repeat(2,1fr)}.experience-tile{padding:15px;font-size:13px}}`}</style>
    </section>
    <section style={{ padding: "54px 0", background: "#f2eee6" }}>
      <div className="wrap offer-grid"><div><span className="eyebrow">{t("home.offers")}</span><h2 className="serif" style={{ fontSize: 37, margin: "10px 0" }}>{t("home.featuredSub")}</h2><p style={{ maxWidth: 430, lineHeight: 1.7, color: "var(--muted)" }}>{t("home.offersText")}</p><Link href="/search?sort=priceLow" className="button">{t("home.explore")}</Link></div>
        {hotels.filter((hotel) => hotel.category === "Budget").slice(0, 2).map((hotel) => <div className="offer-card" key={hotel.id} style={{ backgroundImage: `linear-gradient(0deg,#111c18db,transparent 90%),url("${hotel.image}")` }}><span>{t(`category.${hotel.category}`)}</span><h3>{hotel.name}</h3><strong>${hotel.price}<small>{t("hotel.perNight")}</small></strong></div>)}
      </div>
      <style jsx>{`.offer-grid{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:18px;align-items:stretch}.offer-card{min-height:250px;display:flex;flex-direction:column;justify-content:end;border-radius:5px;background-size:cover;background-position:center;padding:20px;color:white}.offer-card h3{font:24px Georgia,serif;margin:7px 0}.offer-card>span{font-size:11px;letter-spacing:.08em}.offer-card strong{font-size:18px}.offer-card small{font-size:11px;font-weight:400}@media(max-width:650px){.offer-grid{grid-template-columns:1fr}.offer-card{min-height:210px}}`}</style>
    </section>
    <section className="section">
      <div className="wrap review">
        <span className="eyebrow">{t("home.guestName")}</span><div aria-label="5 out of 5 stars" style={{ color: "var(--gold)", letterSpacing: 5, marginTop: 16 }}>★★★★★</div><blockquote className="serif">“{t("home.guestQuote")}”</blockquote><p>{t("home.guestName")} · {t("hotel.sampleContent")}</p>
      </div>
      <style jsx>{`.review{max-width:760px;text-align:center}.review blockquote{font-size:clamp(26px,4vw,38px);line-height:1.35;margin:18px 0}.review p{font-size:12px;color:var(--muted)}`}</style>
    </section>
    <section id="about" style={{ background: "var(--blue)", padding: "48px 0" }}><div className="wrap about"><div><span className="eyebrow">{t("home.about")}</span><h2 className="serif" style={{ fontSize: 35 }}>{t("home.why")}</h2></div><p>{t("home.aboutText")}</p></div><style jsx>{`.about{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center}.about p{color:#59665f;line-height:1.8}@media(max-width:600px){.about{grid-template-columns:1fr;gap:0}}`}</style></section>
    <section style={{ background: "var(--blue)", padding: "58px 0" }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 34 }}><span className="eyebrow">{t("home.why")}</span><h2 className="serif" style={{ fontSize: 39, margin: "9px 0" }}>{t("home.whySub")}</h2></div>
        <div className="values">
          {[[Sparkles,"home.curated","home.curatedText"],[ShieldCheck,"home.simple","home.simpleText"],[Compass,"home.local","home.localText"]].map(([Icon,title,text]) => {
            const ValueIcon = Icon as typeof Sparkles;
            return <article key={title as string}><ValueIcon size={22} color="var(--gold)"/><h3>{t(title as string)}</h3><p>{t(text as string)}</p></article>;
          })}
        </div>
      </div>
      <style jsx>{`.values{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;text-align:center}.values article{padding:10px}.values h3{font:22px Georgia,serif;margin:14px 0 8px}.values p{color:#64716b;font-size:13px;line-height:1.7;max-width:270px;margin:auto}@media(max-width:620px){.values{grid-template-columns:1fr;gap:15px}.values article{padding:5px}}`}</style>
    </section>
  </>;
}
