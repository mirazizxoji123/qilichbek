"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { useLanguage } from "@/components/language-provider";
import { getBookings, type Booking } from "@/lib/local-store";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [nextPath, setNextPath] = useState("/account");
  useEffect(() => {
    setBookings(getBookings());
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "signup") setMode("signup");
    if (params.get("reset") === "true") setRecoveryMode(true);
    const next = params.get("next");
    if (next?.startsWith("/") && !next.startsWith("//")) setNextPath(next);
    if (!supabase) return;
    let alive = true;
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) { console.error("Supabase session lookup failed.", sessionError); setError(t("account.authError")); return; }
      if (alive) setSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
    });
    return () => { alive = false; listener.subscription.unsubscribe(); };
  }, [t]);
  const authAction = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setNotice("");
    if (!supabase) { setError(t("account.authUnavailable")); return; }
    setBusy(true);
    try {
      const result = mode === "signup"
        ? await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (mode === "signup" && !result.data.session) setNotice(t("account.confirmEmail"));
      else {
        setNotice(mode === "signup" ? t("account.signupSuccess") : t("account.signInSuccess"));
        setSession(result.data.session);
        router.replace(nextPath);
      }
    } catch (cause) {
      console.error("Supabase authentication failed.", cause);
      const message = cause instanceof Error ? cause.message.toLowerCase() : "";
      setError(
        message.includes("already registered") || message.includes("already exists")
          ? t("account.emailExists")
          : message.includes("invalid login credentials") || message.includes("invalid credentials")
            ? t("account.invalidCredentials")
            : t("account.authError"),
      );
    } finally { setBusy(false); }
  };
  const google = async () => {
    setError(""); setNotice("");
    if (!supabase) { setError(t("account.authUnavailable")); return; }
    setBusy(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: new URL(nextPath, window.location.origin).toString() } });
      if (authError) throw authError;
    } catch (cause) { console.error("Google OAuth could not start.", cause); setError(t("account.authError")); setBusy(false); }
  };
  const reset = async () => {
    setError(""); setNotice("");
    if (!supabase) { setError(t("account.authUnavailable")); return; }
    if (!email.trim()) { setError(t("errors.enterEmail")); return; }
    setBusy(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/account?reset=true" });
      if (resetError) throw resetError;
      setNotice(t("account.resetSent"));
    } catch (cause) { console.error("Supabase password reset failed.", cause); setError(t("account.authError")); }
    finally { setBusy(false); }
  };
  const signOut = async () => {
    if (!supabase) return;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setSession(null);
    } catch (cause) {
      console.error("Supabase sign-out failed.", cause);
      setError(t("account.authError"));
    }
  };
  const updatePassword = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setNotice("");
    if (!supabase) { setError(t("account.authUnavailable")); return; }
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      setRecoveryMode(false); setNewPassword(""); setNotice(t("errors.passwordUpdated"));
      window.history.replaceState(null, "", "/account");
    } catch (cause) { console.error("Supabase password update failed.", cause); setError(t("account.authError")); }
  };
  const saveProfile = async () => {
    if (!supabase) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { data, error: updateError } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
      if (updateError) throw updateError;
      setSession((current) => current ? { ...current, user: data.user } : current);
      setNotice(t("account.profileUpdated"));
    } catch (cause) {
      console.error("Supabase profile update failed.", cause);
      setError(t("account.authError"));
    } finally { setBusy(false); }
  };
  return <div className="wrap" style={{ paddingTop: 48, paddingBottom: 50 }}>
    <span className="eyebrow">{t("account.profile")}</span><h1 className="serif" style={{ fontSize: 42 }}>{t("account.title")}</h1>
    {recoveryMode ? <form className="auth-card" onSubmit={updatePassword} style={{ maxWidth: 480 }}><h2 className="serif">{t("account.reset")}</h2><label className="field"><span>{t("account.password")}</span><input type="password" minLength={8} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required/></label>{error && <p role="alert" className="message-error">{error}</p>}<button className="button">{t("errors.savePassword")}</button></form> : !session ? <div className="account-grid">
      <form className="auth-card" onSubmit={authAction}><h2 className="serif" style={{ fontSize: 28 }}>{mode === "signin" ? t("account.signIn") : t("account.signUp")}</h2>
        {mode === "signup" && <label className="field"><span>{t("account.fullName")}</span><input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required/></label>}
        <label className="field"><span>{t("account.email")}</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required/></label>
        <label className="field"><span>{t("account.password")}</span><span className="password-field"><input type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required/><button className="password-toggle" type="button" aria-label={showPassword ? t("account.hidePassword") : t("account.showPassword")} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></span></label>
        {error && <p role="alert" className="message-error">{error}</p>}{notice && <p role="status" className="notice">{notice}</p>}
        <button className="button" style={{ width: "100%" }} disabled={busy}>{busy ? t("errors.loading") : mode === "signin" ? t("account.signIn") : t("account.signUp")}</button>
        <button type="button" className="button button-outline" style={{ width: "100%" }} onClick={google} disabled={busy}>{busy ? t("errors.loading") : t("account.google")}</button>
        <div className="auth-links"><button type="button" disabled={busy} onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}>{mode === "signin" ? t("account.signUp") : t("account.signIn")}</button><button type="button" disabled={busy} onClick={reset}>{t("account.reset")}</button></div>
        <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.6 }}>{t("account.configure")}</p>
      </form>
      <aside><h2 className="serif" style={{ fontSize: 28 }}>{t("account.bookings")}</h2><p className="notice">{t("account.localNotice")}</p><BookingList bookings={bookings} t={t}/></aside>
    </div> : <div className="account-grid">
      <section className="auth-card"><h2 className="serif">{session.user.user_metadata.full_name || session.user.email}</h2><p>{session.user.email}</p><label className="field"><span>{t("account.fullName")}</span><input value={name || session.user.user_metadata.full_name || ""} onChange={(event) => setName(event.target.value)}/></label><button className="button button-outline" style={{ marginTop: 14 }} disabled={busy} onClick={saveProfile}>{busy ? t("errors.loading") : t("account.saveProfile")}</button><button className="button" style={{ marginTop: 10 }} disabled={busy} onClick={signOut}>{t("account.signOut")}</button>{error && <p className="message-error">{error}</p>}{notice && <p className="notice">{notice}</p>}</section>
      <section><h2 className="serif" style={{ fontSize: 28 }}>{t("account.bookings")}</h2><BookingList bookings={bookings} t={t}/></section>
    </div>}
    <style jsx>{`.account-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;align-items:start}.auth-card{display:grid;gap:15px;border:1px solid var(--line);border-radius:6px;background:white;padding:24px}.auth-card h2{margin:0}.auth-links{display:flex;justify-content:space-between;gap:10px}.auth-links button{border:0;background:none;color:#596961;text-decoration:underline;font-size:12px}.auth-links button:disabled{opacity:.5}.password-field{position:relative;display:block}.password-field input{padding-right:44px!important}.password-toggle{position:absolute;right:10px;top:50%;display:grid;place-items:center;transform:translateY(-50%);border:0;background:transparent;color:var(--muted)}.message-error{color:#a23c32;font-size:13px}.booking-row{border:1px solid var(--line);border-radius:4px;padding:15px;margin:10px 0;font-size:13px}.booking-row p{color:var(--muted);margin:6px 0 0}@media(max-width:700px){.account-grid{grid-template-columns:1fr}.auth-card{padding:18px}}`}</style>
  </div>;
}

function BookingList({ bookings, t }: { bookings: Booking[]; t: (key: string) => string }) {
  if (!bookings.length) return <div className="empty">{t("account.noBookings")}<p><Link href="/search">{t("home.explore")}</Link></p></div>;
  return <div>{bookings.map((booking) => <article className="booking-row" key={booking.id}><strong>{booking.hotelName}</strong><p>{booking.checkIn} — {booking.checkOut} · {t(booking.roomId === "comfort" ? "hotel.comfortRoom" : "hotel.signatureSuite")}</p><p>{t("booking.reference")}: {booking.id.slice(0, 8).toUpperCase()} · ${booking.total.toFixed(2)}</p></article>)}</div>;
}
