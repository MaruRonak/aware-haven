import { useMemo, useState } from "react";
import { Siren, Loader2, Check, PhoneCall, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { triggerSOS } from "@/lib/safety.functions";
import { Button } from "@/components/ui/button";

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

function normalizePhone(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  return `+${cleaned}`;
}

export function SOSButton({ onSent }: { onSent?: (a: { latitude: number | null; longitude: number | null }) => void }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [contactPhone, setContactPhone] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null } | null>(null);
  const trigger = useServerFn(triggerSOS);

  const whatsappUrl = useMemo(() => {
    if (!contactPhone) return null;
    const phone = normalizePhone(contactPhone).replace(/^\+/, "");
    const message = location?.latitude != null && location.longitude != null
      ? `Emergency alert from Cyber Raksha. My live location: https://maps.google.com/?q=${location.latitude},${location.longitude}`
      : "Emergency alert from Cyber Raksha. Please contact me immediately.";
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [contactPhone, location]);

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
      const primary = res.notifiedContacts[0] ?? null;
      setContactPhone(primary?.phone ?? null);
      setLocation({ latitude, longitude });
      setState("sent");
      const count = res.notifiedContacts.length;
      toast.success(
        count > 0
          ? `SOS sent. Emergency actions are ready for ${primary?.name ?? "your primary contact"}.`
          : "SOS recorded. Add emergency contacts so calling and WhatsApp sharing work.",
      );
      onSent?.({ latitude, longitude });
      if (primary?.phone) {
        if (whatsappUrl) window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        window.location.href = `tel:${normalizePhone(primary.phone)}`;
      }
      setTimeout(() => setState("idle"), 5000);
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
        className="sos-pulse relative grid h-44 w-44 place-items-center rounded-full text-destructive-foreground font-bold text-2xl shadow-glow transition-transform active:scale-95 disabled:opacity-90 sm:h-52 sm:w-52"
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
        Press once to log the alert, open WhatsApp with your live location, and call your primary emergency contact.
      </p>

      {contactPhone ? (
        <div className="grid w-full max-w-xs gap-2 sm:grid-cols-2">
          <Button asChild variant="outline" className="rounded-2xl">
            <a href={`tel:${normalizePhone(contactPhone)}`}>
              <PhoneCall className="h-4 w-4" /> Call
            </a>
          </Button>
          {whatsappUrl ? (
            <Button asChild variant="outline" className="rounded-2xl border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
