import { useEffect, useMemo, useState } from "react";
import { MapPin, Loader2, Crosshair, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Pos = { lat: number; lng: number } | null;

export function MapView({ external }: { external?: { latitude: number | null; longitude: number | null } }) {
  const [pos, setPos] = useState<Pos>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation not supported in this browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (p) => { setPos({ lat: p.coords.latitude, lng: p.coords.longitude }); setLoading(false); },
      (e) => { setError(e.message); setLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  useEffect(() => { locate(); }, []);
  useEffect(() => {
    if (external && external.latitude != null && external.longitude != null) {
      setPos({ lat: external.latitude, lng: external.longitude });
    }
  }, [external]);

  const bbox = useMemo(() => pos ? `${pos.lng - 0.01},${pos.lat - 0.01},${pos.lng + 0.01},${pos.lat + 0.01}` : null, [pos]);
  const src = bbox
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${pos!.lat},${pos!.lng}`
    : null;

  return (
    <div className="mobile-shell overflow-hidden">
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Location Sharing</h3>
            <p className="text-xs text-muted-foreground">
              {pos ? `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}` : "Waiting for location permission…"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={locate} disabled={loading} className="rounded-2xl">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" className="rounded-2xl">
            <Layers3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative h-72 bg-muted sm:h-80">
        {src ? (
          <>
            <iframe
              title="Your location"
              src={src}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
            />
            <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 rounded-2xl bg-card/95 px-4 py-3 text-center shadow-lg backdrop-blur">
              <div className="text-sm font-semibold">You are here</div>
              <div className="mt-1 text-xs text-muted-foreground">Updated just now</div>
            </div>
          </>
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            {error ?? "Waiting for location permission…"}
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between rounded-2xl bg-accent/40 px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Live sharing</div>
            <div className="text-xs text-muted-foreground">Used during SOS and WhatsApp location alerts</div>
          </div>
          <div className="hero-badge px-3 py-1 text-[11px] font-semibold text-emerald-600">ON</div>
        </div>
      </div>
    </div>
  );
}
