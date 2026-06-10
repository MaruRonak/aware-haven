import { useEffect, useState } from "react";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { resolveSOS } from "@/lib/safety.functions";
import { Button } from "@/components/ui/button";

type Alert = {
  id: string;
  latitude: number | null;
  longitude: number | null;
  status: "active" | "resolved";
  created_at: string;
};

export function RecentAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const resolve = useServerFn(resolveSOS);

  const load = async () => {
    const { data, error } = await supabase
      .from("sos_alerts")
      .select("id,latitude,longitude,status,created_at")
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) toast.error(error.message);
    setAlerts((data as Alert[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("sos-alerts-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "sos_alerts" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await resolve({ data: { id } });
      toast.success("Marked as resolved");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold">Recent SOS alerts</h3>
      <ul className="mt-4 space-y-2">
        {loading ? (
          <li className="text-sm text-muted-foreground">Loading…</li>
        ) : alerts.length === 0 ? (
          <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No alerts yet. You're safe.
          </li>
        ) : (
          alerts.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${a.status === "active" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`}>
                  {a.status === "active" ? <Clock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </div>
                <div className="min-w-0 text-sm">
                  <div className="font-medium capitalize">{a.status}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {a.latitude != null && a.longitude != null && (
                      <>
                        <MapPin className="h-3 w-3" />
                        {a.latitude.toFixed(3)}, {a.longitude.toFixed(3)} ·{" "}
                      </>
                    )}
                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
              {a.status === "active" && (
                <Button size="sm" variant="outline" onClick={() => handleResolve(a.id)}>
                  Resolve
                </Button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
