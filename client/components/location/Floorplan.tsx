import React from "react";
import { Maximize2 } from "lucide-react";
import { TYPE } from "@/constants/styles";

interface FloorplanSectionProps {
  imageUrl?: string;
  title?: string;
}

export default function FloorplanSection({
  imageUrl = "https://pic.im-cdn.it/plan/117062099/m.jpg",
  title = "Planimetria",
}: FloorplanSectionProps) {
  const handleExpand = async () => {
    try {
      const { openInNewTab } = await import("@/lib/utils");
      openInNewTab(imageUrl);
    } catch {
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section aria-label={title} className="py-8">
      <h2 className={TYPE.H2}>{title}</h2>
      <figure
        className="mt-3 relative w-full max-w-full rounded-xl overflow-hidden ring-1 ring-slate-200 bg-slate-50"
        style={{ aspectRatio: "16 / 9" }}
      >
        <img
          src={imageUrl}
          alt="Planimetria dell'immobile"
          className="absolute inset-0 h-full w-full object-contain"
          loading="lazy"
        />
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          type="button"
          onClick={handleExpand}
          className="absolute bottom-3 right-3 inline-grid grid-flow-col items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-[11px] font-medium uppercase text-sky-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          aria-label="Espandi planimetria"
          title="Espandi"
        >
          <Maximize2 className="h-4 w-4 text-sky-700" />
          <span>Espandi</span>
        </button>
      </figure>
    </section>
  );
}
