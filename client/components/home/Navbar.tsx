import React from "react";
import { Link, useLocation } from "react-router";
import { MapPin } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();
  const linkBase = "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition hover:bg-white/70";
  const active = (p: string) => pathname === p ? "bg-white text-slate-900 ring-1 ring-white/50" : "text-slate-700";

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto w-full max-w-[2200px] px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between rounded-full border border-white/40 bg-white/60 backdrop-blur-md px-3 sm:px-4 py-2 shadow-sm">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-2 text-slate-900 font-semibold text-sm sm:text-base">
            <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[rgb(255,152,59)] text-black ring-1 ring-orange-400/40">
              <MapPin className="h-4 w-4" />
            </span>
            <span>Locatrova</span>
          </Link>

          {/* Nav */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            <Link to="/chat" className={`${linkBase} ${active("/chat")}`}>Chat</Link>
            <Link to="/apps" className={`${linkBase} ${active("/apps")}`}>App</Link>
            <Link to="/css-test" className={`${linkBase} ${active("/css-test")}`}>CSS</Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center rounded-full bg-[rgb(255,152,59)] px-3 sm:px-4 py-1.5 text-sm font-semibold text-black ring-1 ring-orange-400/40 border border-white/30 hover:shadow-md"
              aria-label="Inizia a cercare"
            >
              Inizia
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
