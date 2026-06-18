import { useEffect, useState } from "react";
import { Clock3, MapPin, CheckCircle2, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
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
      .limit(6);
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
    <div className="mobile-shell p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Recent SOS Activity</h3>
        <Link to="/alerts-history" className="text-xs font-semibold text-primary hover:underline">
          View all
        </Link>
      </div>
      <ul className="mt-4 space-y-3">
        {loading ? (
          <li className="text-sm text-muted-foreground">Loading…</li>
        ) : alerts.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No SOS alerts sent yet.
          </li>
        ) : (
          alerts.map((a) => (
            <li key={a.id} className="soft-tile p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${a.status === "active" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>
                    {a.status === "active" ? <Clock3 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 text-sm">
                    <div className="font-semibold capitalize">{a.status === "active" ? "SOS sent" : "Resolved alert"}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                      {a.latitude != null && a.longitude != null && (
                        <>
                          <MapPin className="h-3 w-3" />
                          {a.latitude.toFixed(3)}, {a.longitude.toFixed(3)} ·
                        </>
                      )}
                      {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                {a.status === "active" ? (
                  <Button size="sm" variant="outline" onClick={() => handleResolve(a.id)} className="rounded-2xl">
                    Resolve
                  </Button>
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
