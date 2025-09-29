import React from "react";
import type { LocationResult, LocationAttributes } from "../../../shared/api";
import { Link } from "react-router";
import { Search, Home, Sun, BadgeCheck, type LucideIcon } from "lucide-react";
import FavoriteToggle from "./FavoriteToggle";

type ResultCardProps = Partial<LocationResult> & { href?: string };

type AttributeMeta = {
  key: keyof LocationAttributes;
  label: string;
  icon: LucideIcon;
};

const ATTRIBUTE_META: AttributeMeta[] = [
  { key: "indoor", label: "Indoor", icon: Home },
  { key: "outdoor", label: "Outdoor", icon: Sun },
  { key: "permit", label: "Permit required", icon: BadgeCheck },
];

function ResultCard({
  title = "",
  description,
  imageUrl,
  badge,
  href,
  tags,
  attributes,
}: ResultCardProps) {
  const activeAttributes = ATTRIBUTE_META.filter(
    ({ key }) => attributes?.[key],
  );
  const displayedTags = tags?.slice(0, 3) ?? [];
  const extraTagCount =
    tags && tags.length > displayedTags.length
      ? tags.length - displayedTags.length
      : 0;

  return (
    <div className="group relative overflow-hidden transition ui-card p-3 sm:p-4 hover:shadow-md hover:ring-1 hover:ring-orange-400/25 bg-white/70 backdrop-blur-md">
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
            {activeAttributes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {activeAttributes.map(({ key, label, icon: Icon }) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100/80 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-white/40"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {label}
                  </span>
                ))}
              </div>
            )}
            {displayedTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {displayedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/80 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
                {extraTagCount > 0 && (
                  <span className="inline-flex items-center rounded-full border border-dashed border-slate-200/70 bg-white/70 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                    +{extraTagCount}
                  </span>
                )}
              </div>
            )}
          </div>
          {title && (
            <div className="flex items-center justify-end gap-2 pt-3">
              <FavoriteToggle />
              <Link
                to={href || "#"}
                aria-label={`View ${title}`}
                title={`View ${title}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-orange-100/70 text-orange-900 ring-1 ring-orange-400/40 backdrop-blur-md transition hover:bg-orange-200/80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500/60"
              >
                <Search className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ResultCard);
