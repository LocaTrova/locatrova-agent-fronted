import React from "react";
import { Link, useLocation } from "react-router";
import { MapPin } from "lucide-react";
import { TYPE, STYLES } from "@/constants/styles";

export default function Navbar() {
  const { pathname } = useLocation();

  const isActive = (p: string) => pathname === p || pathname.startsWith(`${p}/`);

  const linkBase = `${TYPE.SMALL} inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10`;

  return (
    <header className="absolute inset-x-0 top-0 z-30" role="banner">
      <div className={`mx-auto w-full max-w-[2200px] ${STYLES.SPACING.PADDING_RESPONSIVE} pt-4`}>
        <div className="flex items-center justify-between rounded-full border border-white/40 bg-white/60 supports-[backdrop-filter]:bg-white/50 backdrop-blur-md px-3 sm:px-4 py-2 shadow-sm">
          {/* Brand */}
          <Link
            to="/"
            aria-label="Home"
            className={`${TYPE.SUBTITLE} inline-flex items-center gap-2 text-slate-900 text-sm sm:text-base`}
          >
            <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[rgb(255,152,59)] text-black ring-1 ring-orange-400/40">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="text-slate-900">Locatrova</span>
          </Link>

          {/* Nav */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            <Link
              to="/chat"
              className={`${linkBase} ${isActive("/chat") ? "bg-white text-slate-900 ring-1 ring-white/50" : "text-slate-700"}`}
              aria-current={isActive("/chat") ? "page" : undefined}
            >
              Chat
            </Link>
            <Link
              to="/apps"
              className={`${linkBase} ${isActive("/apps") ? "bg-white text-slate-900 ring-1 ring-white/50" : "text-slate-700"}`}
              aria-current={isActive("/apps") ? "page" : undefined}
            >
              App
            </Link>
            <Link
              to="/css-test"
              className={`${linkBase} ${isActive("/css-test") ? "bg-white text-slate-900 ring-1 ring-white/50" : "text-slate-700"}`}
              aria-current={isActive("/css-test") ? "page" : undefined}
            >
              CSS
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link
              to="/chat"
              className={`${TYPE.SMALL} inline-flex items-center justify-center rounded-full bg-[rgb(255,152,59)] px-3 sm:px-4 py-1.5 font-semibold text-black ring-1 ring-orange-400/40 border border-white/30 transition-colors hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10`}
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
