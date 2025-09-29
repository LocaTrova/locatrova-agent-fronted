import React, { useState } from "react";
import { Heart } from "lucide-react";

export default function FavoriteToggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      aria-label={on ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      title={on ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-rose-700 ring-1 ring-rose-300/40 border border-white/30 backdrop-blur-md shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/60"
    >
      <Heart className={on ? "h-4 w-4 fill-rose-500" : "h-4 w-4"} />
    </button>
  );
}
