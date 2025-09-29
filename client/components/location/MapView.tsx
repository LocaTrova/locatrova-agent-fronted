import { memo, useMemo } from "react";
import type { ReactNode } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

import { useGeocode, type Coords } from "@/hooks/useGeocode";
import { cn } from "@/lib/utils";
import { TYPE } from "@/constants/styles";

export type MapPoint = { lat: number; lon: number; label?: string };

type GeocodeStatus = "idle" | "loading" | "done" | "error";

export interface MapViewProps {
  address: string;
  zoom?: number;
  markers?: MapPoint[];
  title?: string;
  description?: string;
  aspectRatio?: number;
  className?: string;
  mapClassName?: string;
  externalLinkLabel?: string;
  loadingLabel?: string;
  errorLabel?: string;
  ariaLabel?: string;
  showExternalLink?: boolean;
  footerSlot?: ReactNode;
}

const DEFAULT_ASPECT_RATIO = 16 / 9;
const DEFAULT_EXTERNAL_LINK_LABEL = "Open in OpenStreetMap";
const DEFAULT_LOADING_LABEL = "Loading map…";
const DEFAULT_ERROR_LABEL = "Unable to load the map for this address.";

function buildEmbedUrl(coords: Coords, zoom: number) {
  const { lat, lon } = coords;
  const delta = 0.01;
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

function buildViewUrl(coords: Coords, zoom: number) {
  const { lat, lon } = coords;
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
}

interface MapContentProps {
  status: GeocodeStatus;
  coords: Coords;
  markers?: MapPoint[];
  zoom: number;
  mapClassName?: string;
  embedUrl: string;
  loadingLabel: string;
  errorLabel: string;
}

function MapContent({
  status,
  coords,
  markers,
  zoom,
  mapClassName,
  embedUrl,
  loadingLabel,
  errorLabel,
}: MapContentProps) {
  const resolvedStatus: Exclude<GeocodeStatus, "idle"> =
    status === "idle" ? "loading" : status;
  const hasMarkers = (markers?.length ?? 0) > 0;
  const resolvedCenter: LatLngExpression | null = coords
    ? [coords.lat, coords.lon]
    : hasMarkers
      ? [markers![0].lat, markers![0].lon]
      : null;

  if (resolvedStatus === "loading") {
    return <MapStatusOverlay message={loadingLabel} variant="loading" />;
  }

  if (resolvedStatus === "error" || !resolvedCenter) {
    return <MapStatusOverlay message={errorLabel} variant="error" />;
  }

  if (hasMarkers) {
    return (
      <LeafletPointsMap
        center={resolvedCenter}
        zoom={zoom}
        points={markers!}
        className={mapClassName}
      />
    );
  }

  if (embedUrl) {
    return (
      <iframe
        title="OpenStreetMap"
        src={embedUrl}
        className={cn("absolute inset-0 h-full w-full border-0", mapClassName)}
        loading="lazy"
      />
    );
  }

  return <MapStatusOverlay message={errorLabel} variant="error" />;
}

interface LeafletPointsMapProps {
  center: LatLngExpression;
  zoom: number;
  points: MapPoint[];
  className?: string;
}

function LeafletPointsMap({ center, zoom, points, className }: LeafletPointsMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className={cn("absolute inset-0 h-full w-full", className)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={center}
        radius={8}
        pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.9 }}
      />
      {points.map((point, index) => {
        const key = `${point.lat}-${point.lon}-${index}`;
        return (
          <CircleMarker
            key={key}
            center={[point.lat, point.lon]}
            radius={7}
            pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.9 }}
          >
            {point.label ? <Popup>{point.label}</Popup> : null}
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

interface MapStatusOverlayProps {
  message: string;
  variant: "loading" | "error";
}

function MapStatusOverlay({ message, variant }: MapStatusOverlayProps) {
  const variantClasses =
    variant === "error"
      ? "bg-white/80 text-rose-600"
      : "bg-white/75 text-slate-600";

  return (
    <div className={cn("absolute inset-0 grid place-items-center text-center", variantClasses)}>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

function MapViewComponent({
  address,
  zoom = 16,
  markers,
  title,
  description,
  aspectRatio = DEFAULT_ASPECT_RATIO,
  className,
  mapClassName,
  externalLinkLabel = DEFAULT_EXTERNAL_LINK_LABEL,
  loadingLabel = DEFAULT_LOADING_LABEL,
  errorLabel = DEFAULT_ERROR_LABEL,
  ariaLabel,
  showExternalLink = true,
  footerSlot,
}: MapViewProps) {
  const { coords, status } = useGeocode(address);

  const embedUrl = useMemo(() => {
    if (!coords) return "";
    return buildEmbedUrl(coords, zoom);
  }, [coords, zoom]);

  const viewUrl = useMemo(() => {
    if (!coords) return "#";
    return buildViewUrl(coords, zoom);
  }, [coords, zoom]);

  const displayFooterLink = showExternalLink && viewUrl !== "#";
  const sectionLabel = ariaLabel ?? title ?? "Map view";

  return (
    <section
      aria-label={sectionLabel}
      className={cn("space-y-3", className)}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title ? <h2 className={TYPE.H2}>{title}</h2> : null}
          {description ? (
            <p className="text-sm text-slate-600">{description}</p>
          ) : null}
        </div>
      )}

      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-white/30 bg-white/60 backdrop-blur-md shadow-sm",
          mapClassName,
        )}
        style={{ aspectRatio }}
      >
        <MapContent
          status={status}
          coords={coords}
          markers={markers}
          zoom={zoom}
          mapClassName={mapClassName}
          embedUrl={embedUrl}
          loadingLabel={loadingLabel}
          errorLabel={errorLabel}
        />
      </div>

      {(displayFooterLink || footerSlot) && (
        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
          {displayFooterLink ? (
            <a
              className="text-sky-700 underline transition hover:no-underline"
              href={viewUrl}
              target="_blank"
              rel="noreferrer"
            >
              {externalLinkLabel}
            </a>
          ) : null}
          {footerSlot}
        </div>
      )}
    </section>
  );
}

export const MapView = memo(MapViewComponent);

export default MapView;
