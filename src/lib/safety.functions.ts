import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const triggerSOS = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const d = input as { latitude?: unknown; longitude?: unknown; address?: unknown; notes?: unknown };
    return {
      latitude: typeof d.latitude === "number" ? d.latitude : null,
      longitude: typeof d.longitude === "number" ? d.longitude : null,
      address: typeof d.address === "string" ? d.address : null,
      notes: typeof d.notes === "string" ? d.notes : null,
    };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: alert, error } = await supabase
      .from("sos_alerts")
      .insert({
        user_id: userId,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        notes: data.notes,
        status: "active",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    // Fetch contacts that would be notified
    const { data: contacts } = await supabase
      .from("emergency_contacts")
      .select("name, phone")
      .eq("user_id", userId);

    return { alert, notifiedContacts: contacts ?? [] };
  });

export const resolveSOS = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const d = input as { id?: unknown };
    if (typeof d.id !== "string") throw new Error("id required");
    return { id: d.id };
  })
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("sos_alerts")
      .update({ status: "resolved", resolved_at: new Date().toISOString() })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
