import { useEffect, useState } from "react";
import { PhoneCall, PhoneOff, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FakeCallButton() {
  const [ringing, setRinging] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!ringing) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate?.([400, 200, 400, 200, 400]); } catch { /* ignore */ }
    }
    return () => clearInterval(id);
  }, [ringing]);

  const start = () => { setSeconds(0); setRinging(true); };
  const stop = () => setRinging(false);

  return (
    <>
      <Button onClick={start} variant="outline" className="w-full justify-start gap-3 h-14">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <PhoneCall className="h-4 w-4" />
        </div>
        <div className="text-left">
          <div className="font-semibold">Fake incoming call</div>
          <div className="text-xs text-muted-foreground">Escape unsafe situations discreetly</div>
        </div>
      </Button>

      {ringing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/95 text-white animate-in fade-in">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="text-sm uppercase tracking-widest text-white/60">Incoming call</div>
            <div className="grid h-32 w-32 place-items-center rounded-full bg-white/10 backdrop-blur">
              <Phone className="h-12 w-12 animate-pulse" />
            </div>
            <div>
              <div className="text-3xl font-semibold">Mom</div>
              <div className="mt-1 text-sm text-white/60">
                Mobile · {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
              </div>
            </div>
            <div className="mt-6 flex gap-12">
              <button
                onClick={stop}
                className="grid h-16 w-16 place-items-center rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                aria-label="Decline"
              >
                <PhoneOff className="h-7 w-7" />
              </button>
              <button
                onClick={stop}
                className="grid h-16 w-16 place-items-center rounded-full bg-green-600 hover:bg-green-700 transition-colors"
                aria-label="Answer"
              >
                <Phone className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
