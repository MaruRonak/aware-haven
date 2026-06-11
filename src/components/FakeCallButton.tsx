import { useEffect, useMemo, useState } from "react";
import { PhoneCall, MessageCircle, MapPinned, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Contact = {
  id: string;
  name: string;
  phone: string;
  is_primary: boolean;
};

function normalizePhone(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  return `+${cleaned}`;
}

function whatsappLink(phone: string, latitude?: number | null, longitude?: number | null) {
  const e164 = normalizePhone(phone).replace(/^\+/, "");
  const mapUrl = latitude != null && longitude != null
    ? `https://maps.google.com/?q=${latitude},${longitude}`
    : "";
  const message = encodeURIComponent(
    latitude != null && longitude != null
      ? `Emergency alert from Cyber Raksha. My live location: ${mapUrl}`
      : "Emergency alert from Cyber Raksha. Please contact me immediately.",
  );
  return `https://wa.me/${e164}?text=${message}`;
}

export function FakeCallButton({ latestLocation }: { latestLocation?: { latitude: number | null; longitude: number | null } }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("id,name,phone,is_primary")
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) toast.error(error.message);
      setContacts((data as Contact[] | null) ?? []);
      setLoading(false);
    })();
  }, []);

  const primary = useMemo(() => contacts.find((c) => c.is_primary) ?? contacts[0] ?? null, [contacts]);

  const callNow = () => {
    if (!primary) {
      toast.error("Add a primary emergency contact first.");
      return;
    }
    window.location.href = `tel:${normalizePhone(primary.phone)}`;
  };

  const shareWhatsApp = () => {
    if (!primary) {
      toast.error("Add a primary emergency contact first.");
      return;
    }
    window.open(whatsappLink(primary.phone, latestLocation?.latitude, latestLocation?.longitude), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mobile-shell p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Emergency contact</h3>
          <p className="text-xs text-muted-foreground">Real call and WhatsApp location sharing</p>
        </div>
        <div className="hero-badge px-3 py-1 text-[11px] font-semibold text-emerald-600">
          <ShieldCheck className="mr-1 inline h-3.5 w-3.5" /> Live device actions
        </div>
      </div>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading contacts…
        </div>
      ) : primary ? (
        <>
          <div className="mt-4 rounded-2xl border border-border bg-background/70 p-4">
            <div className="text-base font-semibold">{primary.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{primary.phone}</div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button onClick={callNow} className="h-12 rounded-2xl bg-primary text-primary-foreground shadow-none">
              <PhoneCall className="h-4 w-4" /> Call now
            </Button>
            <Button onClick={shareWhatsApp} variant="outline" className="h-12 rounded-2xl border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800">
              <MessageCircle className="h-4 w-4" /> Send WhatsApp location
            </Button>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-accent/50 px-3 py-2 text-xs text-muted-foreground">
            <MapPinned className="h-3.5 w-3.5 text-primary" /> Uses your current location when available.
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          Add an emergency contact to enable real calling and WhatsApp sharing.
        </div>
      )}
    </div>
  );
}
