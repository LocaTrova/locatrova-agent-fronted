import React from "react";
import type { LocationResult } from "../../../shared/api";
import { Link } from "react-router";
import { Search, Heart } from "lucide-react";

type ResultCardProps = Partial<LocationResult> & { href?: string };

export default function ResultCard({
  title = "",
  description,
  imageUrl,
  badge,
  href,
}: ResultCardProps) {
  return (
    <div className="p-3 transition hover:shadow-md hover:ring-1 hover:ring-orange-400/30 border border-white/25 bg-white/60 backdrop-blur-md">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <span className="relative flex h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-lg bg-slate-100">
            {imageUrl ? (
               
              <img
                src={imageUrl}
                alt={title || "Location preview"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-slate-400" aria-hidden>
                IMG
              </span>
            )}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="truncate font-semibold text-slate-800 text-[clamp(14px,2.8vw,16px)]" title={title}>
                {title}
              </h3>
              {badge && (
                <span className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-600">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-[13px] sm:text-sm leading-5 text-slate-600 overflow-hidden max-h-10">
                {description}
              </p>
            )}
          </div>
        <div className="flex items-center">
          {title && (
            <>
              <Link
                to={href || "#"}
                aria-label={`View ${title}`}
                title={`View ${title}`}
                className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,152,59,0.22)] text-orange-900 ring-1 ring-orange-400/40 border border-white/30 backdrop-blur-md shadow-[0_8px_18px_rgba(255,68,0,0.15)] hover:bg-[rgba(255,152,59,0.32)] focus:outline-none focus:ring-2 focus:ring-orange-500/60"
              >
                <Search className="h-4 w-4" />
              </Link>
              <button
                type="button"
                aria-label="Aggiungi ai preferiti"
                title="Aggiungi ai preferiti"
                className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-rose-700 ring-1 ring-rose-300/40 border border-white/30 backdrop-blur-md shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/60"
              >
                <Heart className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
