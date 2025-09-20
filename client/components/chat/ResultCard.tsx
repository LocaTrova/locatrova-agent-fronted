import React from "react";

export interface ResultCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  badge?: string;
}

export default function ResultCard({
  title,
  description,
  imageUrl,
  badge,
}: ResultCardProps) {
  return (
    <div className="ui-card p-3 transition hover:shadow-sm">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <span className="relative flex h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-lg bg-slate-100">
            {imageUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img
                src={imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-slate-400">
                IMG
              </span>
            )}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="truncate font-medium text-slate-800" title={title}>
                {title}
              </h3>
              {badge && (
                <span className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-600">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm leading-5 text-slate-600 overflow-hidden max-h-10">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
