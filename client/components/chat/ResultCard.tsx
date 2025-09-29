import React, { useState } from "react";
import type { LocationResult } from "../../../shared/api";
import { Link } from "react-router";
import { Search, Home, Sun, BadgeCheck } from "lucide-react";
import FavoriteToggle from "./FavoriteToggle";

type ResultCardProps = Partial<LocationResult> & { href?: string };

function ResultCard({
  title = "",
  description,
  imageUrl,
  badge,
  href,
  tags,
  attributes,
}: ResultCardProps) {
  const attributeChips = [
    { key: "indoor" as const, label: "Indoor", icon: Home },
    { key: "outdoor" as const, label: "Outdoor", icon: Sun },
    { key: "permit" as const, label: "Permit", icon: BadgeCheck },
  ];

  return (
    <div className="group relative transition ui-card p-3 sm:p-4 hover:shadow-md hover:ring-1 hover:ring-orange-400/25 bg-white/70 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-br from-orange-100/30 via-transparent to-white/40" />
      <div className="relative flex gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <span className="relative flex h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-white/40 shadow-sm">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || "Location preview"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <span
                className="flex h-full w-full items-center justify-center text-slate-400"
                aria-hidden
              >
                IMG
              </span>
            )}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <h3
                className="truncate font-semibold text-slate-800 text-[clamp(14px,2.8vw,16px)]"
                title={title}
              >
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
                  className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-orange-900 ring-1 ring-orange-400/40 border border-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-orange-500/60"
                  style={{
                    backgroundColor: "hsla(var(--brand), 0.22)",
                    boxShadow: "0 8px 18px hsla(18, 100%, 50%, 0.15)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "hsla(var(--brand), 0.32)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "hsla(var(--brand), 0.22)")
                  }
                >
                  <Search className="h-4 w-4" />
                </Link>
                <FavoriteToggle />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ResultCard);
