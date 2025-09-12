'use client';
import React, { useState } from "react";

export default function FrontendIn7DaysLanding() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "ok" | "error"; msg?: string }>({ type: "idle" });

  function resolveEndpoint(): string {
    const win: any = typeof window !== "undefined" ? window : {};
    if (win.__APP_CONFIG__?.LEAD_ENDPOINT) return String(win.__APP_CONFIG__.LEAD_ENDPOINT);
    if (typeof document !== "undefined") {
      const m = document.querySelector('meta[name="lead-endpoint"]') as HTMLMetaElement | null;
      if (m?.content) return m.content;
    }
    if (win.NEXT_PUBLIC_LEAD_ENDPOINT) return String(win.NEXT_PUBLIC_LEAD_ENDPOINT);
    return "/api/lead";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatus({ type: "idle" });

    try {
      const cleanEndpoint = resolveEndpoint().replace(/\/$/, "");
      const res = await fetch(cleanEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "frontend-in-7-days" })
      });
      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        const body = await res.text();
        if (res.status === 405 || /UnsupportedHttpVerb|Method Not Allowed/i.test(body)) {
          throw new Error("This host rejected POST. Configure a real serverless endpoint (e.g., Vercel /api/lead).");
        }
        if (/^\s*<\?xml/i.test(body) || ct.includes("xml")) {
          throw new Error("Received XML error from static host. Configure the endpoint to a server API.");
        }
        throw new Error(body || `HTTP ${res.status}`);
      }
      setStatus({ type: "ok", msg: "Thanks! Your request was received. We'll contact you shortly about payment, sending the guide, and scheduling the free 60-minute consultation." });
      setEmail("");
    } catch (err: any) {
      setStatus({ type: "error", msg: err?.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white font-sans">
      <header className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <a href="#home" className="text-2xl font-bold tracking-tight flex items-center">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-emerald-400 text-black rounded-xl px-3 py-1 mr-3 font-extrabold shadow-lg">FG</span>
          Frontend in 7 Days
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
          <a href="#curriculum" className="hover:text-white transition">Curriculum</a>
          <a href="#bonus" className="hover:text-white transition">Consultation</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>
      </header>

      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-emerald-400/10 to-transparent blur-2xl" />
        <div className="relative max-w-7xl mx-auto px-8 pt-20 pb-24 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg" data-testid="headline">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Frontend in 7 Days</span>
            </h1>
            <p className="mt-6 text-neutral-300 text-lg leading-relaxed max-w-lg">
              A fast-track, hands-on guide: from HTML/CSS basics to React, TypeScript, tooling, and deployment — plus a free 60-minute 1:1 consultation.
            </p>
            <div className="mt-8 flex items-baseline gap-4" aria-label="pricing">
              <span className="text-2xl line-through text-neutral-500" data-testid="price-old">$250</span>
              <span className="text-5xl font-extrabold text-emerald-400" data-testid="price-new">$120</span>
            </div>
            <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4 bg-white/10 p-3 rounded-2xl backdrop-blur-lg border border-white/10" data-testid="lead-form">
              <input type="email" required placeholder="Enter your email"
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 rounded-xl text-white placeholder:text-neutral-500"
                value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" data-testid="email-input" />
              <button type="submit" disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-black font-bold rounded-xl shadow-lg hover:opacity-90 disabled:opacity-50 transition"
                data-testid="submit-btn">{loading ? "Sending..." : "Get the Guide"}</button>
            </form>
            {status.type === "ok" && <p className="mt-3 text-emerald-400 text-sm" data-testid="status-ok">{status.msg}</p>}
            {status.type === "error" && <p className="mt-3 text-red-400 text-sm" data-testid="status-error">{status.msg}</p>}
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-tr from-blue-500/30 to-emerald-500/30 blur-3xl rounded-full" />
            <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
              <h3 className="text-xl font-bold mb-4">What you will build</h3>
              <ul className="space-y-3 text-neutral-300 text-sm list-disc pl-5">
                <li>Responsive UIs with Tailwind</li>
                <li>Apps with React + Next.js</li>
                <li>Type-safe APIs (TypeScript)</li>
                <li>Automated testing setup</li>
                <li>Deployments with Vercel</li>
              </ul>
              <div className="mt-6 rounded-xl bg-black/40 border border-white/10 p-4 text-sm text-neutral-400">
                Includes a <span className="text-white font-semibold">free 60-minute consultation</span> tailored to your goals.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="curriculum" className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold">Curriculum Overview</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          {["Foundations","JavaScript","React","TypeScript","Tooling","Quality & DevOps"].map((t, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="text-lg font-semibold">{t}</div>
              <div className="mt-2 text-sm text-neutral-300">Brief description about {t} goes here.</div>
            </div>
          ))}
        </div>
      </section>

      <section id="bonus" className="max-w-7xl mx-auto px-8 py-16">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 p-10 text-center shadow-xl">
          <h2 className="text-3xl font-bold">Bonus: Free 60-minute Consultation</h2>
          <p className="mt-3 text-neutral-300 max-w-2xl mx-auto">After purchase you will schedule your 1:1 session — portfolio review, interview prep, or custom roadmap.</p>
        </div>
      </section>

      <section id="faq" className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold mb-10">FAQ</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {["How do I pay?","What is the format?","When is the consultation?","Refund policy?"].map((q, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold">{q}</div>
              <div className="mt-2 text-sm text-neutral-300">Answer about {q} goes here.</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-8 pb-10 text-xs text-neutral-500 text-center">
        © {new Date().getFullYear()} Frontend in 7 Days. All rights reserved.
      </footer>
    </div>
  );
}
