import React from "react";
import { Link, useLocation } from "react-router";
import { MapPin } from "lucide-react";
import { TYPE, STYLES } from "@/constants/styles";

export default function Navbar() {
  const { pathname } = useLocation();

  const isActive = (p: string) =>
    pathname === p || pathname.startsWith(`${p}/`);

  const linkBase = `${TYPE.SMALL} inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors hover:bg-white/70 ui-focus`;

  const NavItem = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`${linkBase} ${active ? "bg-white text-slate-900 ring-1 ring-white/50" : "text-slate-700"}`}
        aria-current={active ? "page" : undefined}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="absolute inset-x-0 top-0 z-30" role="banner">
      <div
        className={`mx-auto w-full max-w-[2200px] ${STYLES.SPACING.PADDING_RESPONSIVE} pt-4`}
      >
        <div className="flex items-center justify-between rounded-full border border-white/40 bg-white/60 supports-[backdrop-filter]:bg-white/50 backdrop-blur-md px-3 sm:px-4 py-2 shadow-sm">
          {/* Brand */}
          <Link
            to="/"
            aria-label="Home"
            className={`${TYPE.SUBTITLE} inline-flex items-center gap-2 text-slate-900 text-sm sm:text-base`}
          >
            <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-brand text-black ring-1 ring-orange-400/40">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="text-slate-900">Locatrova</span>
          </Link>

          {/* Nav */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-1"
          >
            <NavItem to="/chat">Chat</NavItem>
            <NavItem to="/apps">App</NavItem>
            <NavItem to="/css-test">CSS</NavItem>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link
              to="/chat"
              className={`${TYPE.SMALL} inline-flex items-center justify-center rounded-full bg-brand px-3 sm:px-4 py-1.5 font-semibold text-black ring-1 ring-orange-400/40 border border-white/30 transition-colors hover:shadow-md ui-focus`}
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
