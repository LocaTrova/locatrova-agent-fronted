import React, { useState } from "react";
import IconButton from "./IconButton";
import { Heart } from "lucide-react";

export default function FavoriteButton({
  defaultOn = false,
  onToggle,
}: {
  defaultOn?: boolean;
  onToggle?: (value: boolean) => void;
}) {
  const [fav, setFav] = useState<boolean>(defaultOn);
  const toggle = () => {
    const next = !fav;
    setFav(next);
    onToggle?.(next);
  };
  return (
    <IconButton
      aria-label={fav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      title={fav ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      aria-pressed={fav}
      onClick={toggle}
    >
      <Heart
        className="h-5 w-5 text-rose-600"
        fill={fav ? "currentColor" : "none"}
      />
    </IconButton>
  );
}
