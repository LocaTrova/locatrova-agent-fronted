import { ArrowRight } from "lucide-react";
import React from "react";

export interface AppCardProps {
  href: string;
  title: string;
  description: string;
  updatedText?: string;
  logoUrl?: string;
  logoAlt?: string;
  placeholderLetter?: string;
}

export default function AppCard({
  href,
  title,
  description,
  updatedText = "Updated 15 days ago",
  logoUrl,
  logoAlt,
  placeholderLetter,
}: AppCardProps) {
  return (
    <div className="opacity-0 animate-slide-up will-change-transform">
      <a href={href} title={`Open ${title}`} className="block h-full">
        <div className="group h-full cursor-pointer rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition">
          <div className="flex h-full gap-3">
            <div className="flex-shrink-0">
              <span className="relative flex h-20 w-20 overflow-hidden rounded-lg">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={logoAlt || title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 font-medium text-orange-500">
                    {placeholderLetter || title.charAt(0)}
                  </span>
                )}
              </span>
            </div>
            <div className="flex h-20 flex-1 flex-col justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-1">
                  <h3 className="truncate font-medium text-slate-800">{title}</h3>
                  <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <p className="mb-1 line-clamp-2 text-sm text-slate-600">{description}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400 whitespace-nowrap">{updatedText}</div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
