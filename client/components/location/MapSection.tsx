import { FC, memo, useEffect, useMemo, useState } from "react";

type Coords = { lat: number; lon: number } | null;

type MapSectionProps = {
  address: string;
  zoom?: number;
};

function toEmbedUrl(coords: Coords, zoom: number) {
  if (!coords) return "";
  const { lat, lon } = coords;
  const delta = 0.01; // ~1km radius
  const left = lon - delta;
  const right = lon + delta;
  const top = lat + delta;
  const bottom = lat - delta;
  const bbox = `${left},${bottom},${right},${top}`;
  const marker = `${lat},${lon}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox,
  )}&layer=mapnik&marker=${encodeURIComponent(marker)}&zoom=${zoom}`;
}

const MapSection: FC<MapSectionProps> = ({ address, zoom = 16 }) => {
  const [coords, setCoords] = useState<Coords>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus("loading");
      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("format", "json");
        url.searchParams.set("q", address);
        url.searchParams.set("limit", "1");
        const res = await fetch(url.toString(), {
          headers: {
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Array<{ lat: string; lon: string }> = await res.json();
        const first = data[0];
        if (!first) throw new Error("Address not found");
        if (!cancelled)
          setCoords({ lat: parseFloat(first.lat), lon: parseFloat(first.lon) });
        if (!cancelled) setStatus("done");
      } catch (e) {
        if (!cancelled) setStatus("error");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [address]);

  const embedUrl = useMemo(() => toEmbedUrl(coords, zoom), [coords, zoom]);
  const viewUrl = useMemo(() => {
    if (!coords) return "#";
    return `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=${zoom}/${coords.lat}/${coords.lon}`;
  }, [coords, zoom]);

  return (
    <section aria-label="Mappa" className="py-8">
      <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Mappa</h2>
      <div className="mt-3 relative w-full max-w-full rounded-xl overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
        {status !== "done" && (
          <div className="absolute inset-0 grid place-items-center bg-slate-100">
            <span className="text-slate-600 text-sm">Caricamento mappa…</span>
          </div>
        )}
        {status === "done" && embedUrl && (
          <iframe
            title="OpenStreetMap"
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />
        )}
      </div>
      <div className="mt-2">
        <a
          className="text-sky-700 text-sm underline hover:no-underline"
          href={viewUrl}
          target="_blank"
          rel="noreferrer"
        >
          Apri su OpenStreetMap
        </a>
      </div>
    </section>
  );
};

export default memo(MapSection);
