import { useEffect, useRef, useState } from "react";
import type { CircleMarker, Map as LeafletMap } from "leaflet";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { soilCopy, type Lang } from "@/lib/soil-copy";
import { initialPoint, type Point } from "@/lib/soil-report";

export default function SoilMap({
  point,
  lang,
  onSelect,
}: {
  point: Point;
  lang: Lang;
  onSelect: (point: Point) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const marker = useRef<CircleMarker | null>(null);
  const select = useRef(onSelect);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const copy = soilCopy[lang];
  select.current = onSelect;

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;
    const onWheel = (event: WheelEvent) => {
      if (!(event.ctrlKey || event.metaKey) || !map.current) return;
      event.preventDefault();
      map.current.setZoom(map.current.getZoom() + (event.deltaY < 0 ? 1 : -1));
    };
    element.addEventListener("wheel", onWheel, { passive: false });

    void import("leaflet")
      .then((leaflet) => {
        if (cancelled || !container.current) return;
        const instance = leaflet
          .map(container.current, {
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: false,
          })
          .setView([initialPoint.lat, initialPoint.lon], 9);
        map.current = instance;
        leaflet
          .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            minZoom: 5,
          })
          .addTo(instance);
        marker.current = leaflet
          .circleMarker([initialPoint.lat, initialPoint.lon], {
            radius: 8,
            className: "soil-point",
          })
          .addTo(instance);
        instance.on("click", (event) =>
          select.current({ lat: event.latlng.lat, lon: event.latlng.lng }),
        );
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      element.removeEventListener("wheel", onWheel);
      map.current?.remove();
      map.current = null;
      marker.current = null;
    };
  }, []);

  useEffect(() => {
    marker.current?.setLatLng([point.lat, point.lon]);
  }, [point, ready]);

  return (
    <div className="soil-map-shell relative isolate overflow-hidden rounded-lg border border-border shadow-sm">
      <div ref={container} className="absolute inset-0" role="region" aria-label={copy.map} />
      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-muted text-sm text-muted-foreground">
          {failed ? copy.mapError : copy.mapLoading}
        </div>
      )}
      <div className="absolute right-4 top-4 z-[500] flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            aria-label={copy.zoomIn}
            title={copy.zoomIn}
            onClick={() => map.current?.zoomIn()}
          >
            <Plus />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-none border-t border-border"
            aria-label={copy.zoomOut}
            title={copy.zoomOut}
            onClick={() => map.current?.zoomOut()}
          >
            <Minus />
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label={copy.reset}
          title={copy.reset}
          onClick={() => map.current?.setView([initialPoint.lat, initialPoint.lon], 9)}
        >
          <LocateFixed />
        </Button>
      </div>
      <div className="pointer-events-none absolute left-4 top-4 z-[500] border border-border bg-background/95 px-3 py-2 text-xs font-medium text-foreground">
        {copy.coverage}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-[500] rounded-tr-md bg-background/90 px-2 py-1 text-[10px] text-muted-foreground">
        {copy.mapHint}
      </div>
      <a
        className="absolute bottom-0 right-0 z-[500] rounded-tl-md bg-background/90 px-2 py-1 text-[10px] text-muted-foreground"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
      >
        {copy.mapAttribution}
      </a>
    </div>
  );
}