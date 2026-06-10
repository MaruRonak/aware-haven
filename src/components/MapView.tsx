import { useEffect, useState } from "react";
import { MapPin, Loader2, Crosshair } from "lucide-react";
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

  const bbox = pos
    ? `${pos.lng - 0.01},${pos.lat - 0.01},${pos.lng + 0.01},${pos.lat + 0.01}`
    : null;
  const src = bbox
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${pos!.lat},${pos!.lng}`
    : null;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Live location</h3>
            <p className="text-xs text-muted-foreground">
              {pos ? `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}` : "Locating…"}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={locate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
          Refresh
        </Button>
      </div>
      <div className="relative h-64 bg-muted">
        {src ? (
          <iframe
            title="Your location"
            src={src}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            {error ?? "Waiting for location permission…"}
          </div>
        )}
      </div>
    </div>
  );
}
