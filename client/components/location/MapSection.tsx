import { memo } from "react";

import { MapView, type MapViewProps, type MapPoint } from "./MapView";

export type { MapPoint };

export interface MapSectionProps {
  address: string;
  zoom?: MapViewProps["zoom"];
  markers?: MapViewProps["markers"];
  title?: string;
  description?: string;
  externalLinkLabel?: string;
  loadingLabel?: string;
  errorLabel?: string;
}

const DEFAULT_TITLE = "Mappa";
const DEFAULT_EXTERNAL_LABEL = "Apri su OpenStreetMap";
const DEFAULT_LOADING_LABEL = "Caricamento mappa…";
const DEFAULT_ERROR_LABEL =
  "Impossibile caricare la mappa per questo indirizzo.";

const MapSection = ({
  address,
  zoom,
  markers,
  title = DEFAULT_TITLE,
  description,
  externalLinkLabel = DEFAULT_EXTERNAL_LABEL,
  loadingLabel = DEFAULT_LOADING_LABEL,
  errorLabel = DEFAULT_ERROR_LABEL,
}: MapSectionProps) => {
  return (
    <MapView
      address={address}
      zoom={zoom}
      markers={markers}
      title={title}
      description={description}
      externalLinkLabel={externalLinkLabel}
      loadingLabel={loadingLabel}
      errorLabel={errorLabel}
      ariaLabel={title}
      className="py-8"
      mapClassName="rounded-xl border-0 ring-1 ring-slate-200 bg-white"
      showExternalLink
    />
  );
};

export default memo(MapSection);
