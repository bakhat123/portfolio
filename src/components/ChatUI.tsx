"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: ((event: any) => void) | null;
};

const quickPrompts = [
  "What are Bakhat's skills?",
  "Show projects",
  "Tell me about him",
  "How to contact him?",
  "What are his goals?",
  "What are his hobbies?",
];

export default function ChatUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "welcome",
    role: "assistant",
    content: "Hi 👋 I’m Li Wang Zhang Liu Yang Zhao Huang Wu, here to tell you everything about Muhammad Bakhat Nasar. Ask about projects, skills, goals, hobbies, or contact info.",
  }]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [provider, setProvider] = useState<"local" | "groq" | "error" | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const load = () => setAvailableVoices(synth.getVoices());
    load();
    synth.addEventListener("voiceschanged", load);
    return () => synth.removeEventListener("voiceschanged", load);
  }, []);

  const recognition = useMemo<BrowserSpeechRecognition | null>(() => {
    if (!mounted) return null;
    const w = window as any;
    const SR = w?.SpeechRecognition || w?.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    return rec as BrowserSpeechRecognition;
  }, [mounted]);

  function speak(text: string) {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    const voices = availableVoices.length ? availableVoices : synth.getVoices();
    const cnHint = /(zh|chinese|mandarin|xiaoyi|tian|liang|bing|yan|yunjian|yunzhe)/i;
    const englishHint = /(en-|english)/i;
    const preferred =
      voices.find(v => englishHint.test(v.lang) && cnHint.test(v.name)) ||
      voices.find(v => /en-GB|en-US/i.test(v.lang) && /male|man|google en|english/i.test(v.name)) ||
      voices.find(v => /en-US/i.test(v.lang)) ||
      voices[0];
    const u = new SpeechSynthesisUtterance(text);
    // Funny Chinese-accent English male style (approximation via pitch/rate)
    u.rate = 1.05;
    u.pitch = 0.95;
    u.volume = 1.0;
    u.lang = preferred?.lang || "en-US";
    if (preferred) u.voice = preferred;
    synth.cancel();
    synth.speak(u);
  }

  function push(role: "user" | "assistant", content: string) {
    setMessages((prev) => [...prev, { id: Math.random().toString(36).slice(2), role, content }]);
  }

  async function send(text?: string) {
    const prompt = (text ?? input).trim();
    if (!prompt) return;
    setInput("");
    push("user", prompt);
    setIsSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: messages.concat({ id: "tmp", role: "user", content: prompt }) }),
      });
      const data = await res.json();
      const reply = data?.reply ?? "I couldn't find that.";
      setProvider((data?.provider as any) ?? null);
      if (data?.provider === "error") {
        // Show a subtle hint in UI by appending a note
        push("assistant", "(AI error — using chibi voice only)");
      }
      push("assistant", reply);
      speak(reply);
    } catch (e) {
      push("assistant", "Sorry, something went wrong.");
    } finally {
      setIsSending(false);
    }
  }

  function toggleListen() {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (ev: any) => {
        const transcript = ev.results?.[0]?.[0]?.transcript ?? "";
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }
  }

  return (
    <div className="h-[calc(100vh-6rem)] w-full rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/60 to-black/60 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col" suppressHydrationWarning>
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Li Wang Zhang Liu Yang Zhao Huang Wu</h2>
          <p className="text-sm text-zinc-400">Ask about Muhammad Bakhat Nasar</p>
        </div>
        <div className="flex items-center gap-3">
          {provider ? (
            <span className={
              (provider === "groq" ? "text-emerald-300" : provider === "error" ? "text-amber-300" : "text-slate-300") +
              " text-xs px-2 py-1 rounded-full border border-white/10 bg-black/20"
            }>
              {provider === "groq" ? "AI: Llama (Groq)" : provider === "error" ? "AI: Error" : "AI: Local"}
            </span>
          ) : null}
          {/* Links moved to top navbar */}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3 custom-scroll">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={
              (m.role === "user"
                ? "bg-gradient-to-br from-indigo-600 to-sky-600 text-white"
                : "bg-slate-800/80 text-slate-100 border border-white/10 backdrop-blur") +
              " max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-lg"
            }>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 md:px-6 py-3 border-t border-white/10 bg-black/20">
        <div className="flex flex-wrap gap-2 pb-3">
          {quickPrompts.map((q) => (
            <button key={q} onClick={() => send(q)} className="text-xs rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-slate-300 hover:text-white hover:border-white/20 transition">
              {q}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleListen} disabled={!mounted || !recognition} title={mounted && recognition ? "Voice input" : "Voice not supported"} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-slate-300 hover:text-white hover:border-white/20 disabled:opacity-50">
            {isListening ? "Listening…" : "🎤"}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about skills, projects, goals…"
            className="flex-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-white/20"
          />
          <button onClick={() => send()} disabled={isSending} className="rounded-lg bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:opacity-50 text-white px-4 py-2 text-sm font-medium shadow">
            {isSending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}


