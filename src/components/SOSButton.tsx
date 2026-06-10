import { useState } from "react";
import { Siren, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { triggerSOS } from "@/lib/safety.functions";

function getPosition(): Promise<GeolocationPosition | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve(p),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  });
}

export function SOSButton({ onSent }: { onSent?: (a: { latitude: number | null; longitude: number | null }) => void }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const trigger = useServerFn(triggerSOS);

  const handleClick = async () => {
    if (state !== "idle") return;
    setState("sending");
    try {
      const pos = await getPosition();
      const latitude = pos?.coords.latitude ?? null;
      const longitude = pos?.coords.longitude ?? null;
      const res = await trigger({
        data: { latitude, longitude, address: null, notes: null },
      });
      setState("sent");
      const count = res.notifiedContacts.length;
      toast.success(
        count > 0
          ? `SOS sent. Notifying ${count} emergency contact${count > 1 ? "s" : ""}.`
          : "SOS recorded. Add emergency contacts so we can notify them next time.",
      );
      onSent?.({ latitude, longitude });
      setTimeout(() => setState("idle"), 4000);
    } catch (err) {
      setState("idle");
      toast.error(err instanceof Error ? err.message : "Could not send SOS");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={state !== "idle"}
        aria-label="Send SOS emergency alert"
        className="sos-pulse relative grid h-44 w-44 place-items-center rounded-full text-destructive-foreground font-bold text-2xl tracking-wide shadow-glow transition-transform active:scale-95 disabled:opacity-90 sm:h-52 sm:w-52"
        style={{ background: "var(--gradient-danger)" }}
      >
        <span className="sos-pulse-ring" aria-hidden />
        <span className="flex flex-col items-center gap-2">
          {state === "sending" ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : state === "sent" ? (
            <Check className="h-10 w-10" />
          ) : (
            <Siren className="h-10 w-10" />
          )}
          <span className="text-xl">
            {state === "sending" ? "SENDING…" : state === "sent" ? "SOS SENT" : "SOS"}
          </span>
        </span>
      </button>
      <p className="max-w-xs text-center text-xs text-muted-foreground">
        Tap to instantly share your location with your emergency contacts.
      </p>
    </div>
  );
}
