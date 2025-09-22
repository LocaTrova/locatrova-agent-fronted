import { FC, memo, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGeocode, type Coords } from "@/hooks/useGeocode";

export type MapPoint = { lat: number; lon: number; label?: string };

 type MapSectionProps = {
   address: string;
   zoom?: number;
   markers?: MapPoint[];
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

const MapSection: FC<MapSectionProps> = ({ address, zoom = 16, markers }) => {
  const { coords, status } = useGeocode(address);

  const embedUrl = useMemo(() => toEmbedUrl(coords, zoom), [coords, zoom]);
  const viewUrl = useMemo(() => {
    if (!coords) return "#";
    return `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=${zoom}/${coords.lat}/${coords.lon}`;
  }, [coords, zoom]);

  const hasMultiple = (markers?.length ?? 0) > 0;

  return (
    <section aria-label="Mappa" className="py-8">
      <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Mappa</h2>
      <div className="mt-3 relative w-full max-w-full rounded-xl overflow-hidden ring-1 ring-slate-200" style={{ aspectRatio: "16 / 9" }}>
        {status !== "done" && (
          <div className="absolute inset-0 grid place-items-center bg-slate-100">
            <span className="text-slate-600 text-sm">Caricamento mappa…</span>
          </div>
        )}
        {status === "done" && coords && (
          hasMultiple ? (
            <LeafletPointsMap center={[coords.lat, coords.lon]} zoom={zoom} points={markers!} />
          ) : (
            embedUrl && (
              <iframe
                title="OpenStreetMap"
                src={embedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
              />
            )
          )
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

const LeafletPointsMap: FC<{ center: LatLngExpression; zoom: number; points: MapPoint[] }> = ({ center, zoom, points }) => {
  return (
    <MapContainer center={center} zoom={zoom} className="absolute inset-0 h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Center marker */}
      <CircleMarker center={center} radius={8} pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.9 }} />
      {/* Extra points */}
      {points.map((p, idx) => (
        <CircleMarker key={`${p.lat},${p.lon}-${idx}`} center={[p.lat, p.lon]} radius={7} pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.9 }}>
          {p.label ? <Popup>{p.label}</Popup> : null}
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default memo(MapSection);
