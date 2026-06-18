import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Clock3, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { resolveSOS } from "@/lib/safety.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/alerts-history")({
  head: () => ({ meta: [{ title: "SOS History — Cyber Raksha" }] }),
  component: AlertsHistory,
});

type Alert = {
  id: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  status: "active" | "resolved";
  created_at: string;
  resolved_at: string | null;
};

const PAGE_SIZE = 20;

function AlertsHistory() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const resolve = useServerFn(resolveSOS);

  const load = async (p: number) => {
    setLoading(true);
    const from = p * PAGE_SIZE;
    const { data, error } = await supabase
      .from("sos_alerts")
      .select("id,latitude,longitude,address,status,created_at,resolved_at")
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE);
    if (error) toast.error(error.message);
    const rows = (data as Alert[] | null) ?? [];
    setHasMore(rows.length > PAGE_SIZE);
    setAlerts(rows.slice(0, PAGE_SIZE));
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const handleResolve = async (id: string) => {
    try {
      await resolve({ data: { id } });
      toast.success("Marked as resolved");
      load(page);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto max-w-4xl px-4 py-6 space-y-6">
        <header className="flex items-center gap-3">
          <Link to="/dashboard" className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">SOS History</h1>
            <p className="text-sm text-muted-foreground">All your emergency alerts, newest first.</p>
          </div>
        </header>

        <section className="mobile-shell p-5 sm:p-6">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : alerts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No SOS alerts in your history.
            </div>
          ) : (
            <ul className="space-y-3">
              {alerts.map((a) => (
                <li key={a.id} className="soft-tile p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${a.status === "active" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>
                        {a.status === "active" ? <Clock3 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 text-sm">
                        <div className="font-semibold capitalize">
                          {a.status === "active" ? "Active SOS" : "Resolved"}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {format(new Date(a.created_at), "PPp")} · {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                        </div>
                        {a.latitude != null && a.longitude != null && (
                          <a
                            href={`https://maps.google.com/?q=${a.latitude},${a.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <MapPin className="h-3 w-3" /> {a.latitude.toFixed(4)}, {a.longitude.toFixed(4)}
                          </a>
                        )}
                        {a.address && <div className="mt-1 text-xs text-muted-foreground">{a.address}</div>}
                      </div>
                    </div>
                    {a.status === "active" && (
                      <Button size="sm" variant="outline" onClick={() => handleResolve(a.id)} className="rounded-2xl">
                        Resolve
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {(page > 0 || hasMore) && (
            <div className="mt-5 flex items-center justify-between">
              <Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className="rounded-2xl">
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">Page {page + 1}</span>
              <Button variant="outline" disabled={!hasMore} onClick={() => setPage((p) => p + 1)} className="rounded-2xl">
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
