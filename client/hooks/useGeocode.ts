import { useEffect, useState } from "react";

export type Coords = { lat: number; lon: number } | null;

export function useGeocode(address: string) {
  const [coords, setCoords] = useState<Coords>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!address || !address.trim()) {
        setCoords(null);
        setStatus("idle");
        return;
      }
      setStatus("loading");
      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("format", "json");
        url.searchParams.set("q", address);
        url.searchParams.set("limit", "1");
        const res = await fetch(url.toString(), {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Array<{ lat: string; lon: string }> = await res.json();
        const first = data[0];
        if (!first) throw new Error("Address not found");
        if (!cancelled)
          setCoords({ lat: parseFloat(first.lat), lon: parseFloat(first.lon) });
        if (!cancelled) setStatus("done");
      } catch {
        if (!cancelled) {
          setCoords(null);
          setStatus("error");
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [address]);

  return { coords, status } as const;
}
