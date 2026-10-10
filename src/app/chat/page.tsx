"use client";
import { FormEvent, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { getMessages, saveMessage, type ChatMessage } from "@/lib/local-store";
export default function ChatPage() {
  const { t, language } = useLanguage();
  const [messages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { setLocalMessages(getMessages()); }, []);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    try { setLocalMessages(saveMessage(text.trim())); setText(""); setError(""); }
    catch { setError(t("chat.error")); }
  };
  const locale = language === "uz" ? "uz-UZ" : language === "ru" ? "ru-RU" : "en-US";
  return <div className="wrap" style={{ maxWidth: 850, paddingTop: 48, paddingBottom: 50 }}><span className="eyebrow">{t("chat.subtitle")}</span><h1 className="serif" style={{ fontSize: 42 }}>{t("chat.title")}</h1><p className="notice">{t("chat.localNotice")}</p><section className="chat-window"><div className="message-list">{messages.length ? messages.map((message) => <article key={message.id} className="message"><p>{message.text}</p><time>{new Date(message.createdAt).toLocaleString(locale)}</time></article>) : <div className="empty">{t("chat.empty")}</div>}</div><form onSubmit={submit} className="chat-form"><input aria-label={t("chat.placeholder")} placeholder={t("chat.placeholder")} value={text} onChange={(event) => setText(event.target.value)}/><button className="button" aria-label={t("chat.send")}><Send size={16}/>{t("chat.send")}</button></form>{error && <p role="alert" style={{ color: "#a23c32" }}>{error}</p>}</section><style jsx>{`.chat-window{margin-top:24px;border:1px solid var(--line);border-radius:6px;background:white}.message-list{display:flex;min-height:300px;max-height:480px;flex-direction:column;gap:14px;overflow:auto;padding:20px}.message{align-self:flex-end;max-width:78%;border-radius:8px 8px 0 8px;background:#e7efeb;padding:11px 14px}.message p{margin:0;line-height:1.5}.message time{display:block;margin-top:6px;text-align:right;color:var(--muted);font-size:10px}.chat-form{display:flex;gap:10px;border-top:1px solid var(--line);padding:14px}.chat-form input{flex:1;min-width:0;border:1px solid var(--line);border-radius:4px;padding:12px}.chat-form button{min-height:42px}@media(max-width:480px){.chat-form{padding:10px}.chat-form button{font-size:0}.chat-form button :global(svg){width:18px}}`}</style></div>;
}
