import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Phone, User, Star, MessageCircleMore } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Contact = {
  id: string;
  name: string;
  phone: string;
  relation: string | null;
  is_primary: boolean;
};

function normalizePhone(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  return `+${cleaned}`;
}

export function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [adding, setAdding] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("id,name,phone,relation,is_primary")
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setContacts((data as Contact[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setAdding(true);
    const { data: user } = await supabase.auth.getUser();
    const uid = user.user?.id;
    if (!uid) { setAdding(false); return; }
    const { error } = await supabase.from("emergency_contacts").insert({
      user_id: uid,
      name: name.trim(),
      phone: phone.trim(),
      relation: relation.trim() || null,
      is_primary: contacts.length === 0,
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`${name} added to emergency contacts`);
      setName(""); setPhone(""); setRelation("");
      load();
    }
    setAdding(false);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Contact removed"); load(); }
  };

  const primary = useMemo(() => contacts.find((c) => c.is_primary) ?? contacts[0], [contacts]);

  return (
    <div className="mobile-shell p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Emergency Contacts</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your primary contact is used for direct calling and WhatsApp location sharing.
          </p>
        </div>
        {primary ? (
          <div className="hero-badge px-3 py-1 text-[11px] font-semibold text-primary">
            <Star className="mr-1 inline h-3 w-3" /> {primary.name}
          </div>
        ) : null}
      </div>

      <form onSubmit={add} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <div>
          <Label htmlFor="c-name" className="text-xs">Name</Label>
          <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Priya Patel" className="mt-1.5 rounded-2xl bg-background/80" />
        </div>
        <div>
          <Label htmlFor="c-phone" className="text-xs">Phone</Label>
          <Input id="c-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 98765 43210" className="mt-1.5 rounded-2xl bg-background/80" />
        </div>
        <div>
          <Label htmlFor="c-rel" className="text-xs">Relation</Label>
          <Input id="c-rel" value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Sister" className="mt-1.5 rounded-2xl bg-background/80" />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={adding} className="h-11 w-full rounded-2xl sm:w-auto">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </form>

      <ul className="mt-6 space-y-3">
        {loading ? (
          <li className="text-sm text-muted-foreground">Loading…</li>
        ) : contacts.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No contacts yet. Add at least one trusted person above.
          </li>
        ) : (
          contacts.map((c) => (
            <li key={c.id} className="soft-tile p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold">{c.name}</span>
                      {c.is_primary && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <Star className="h-3 w-3" /> Primary
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" /> {c.phone} {c.relation ? `· ${c.relation}` : ""}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <a href={`tel:${normalizePhone(c.phone)}`} className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100" aria-label={`Call ${c.name}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                  <a href={`https://wa.me/${normalizePhone(c.phone).replace(/^\+/, "")}`} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-700 transition-colors hover:bg-sky-100" aria-label={`Message ${c.name} on WhatsApp`}>
                    <MessageCircleMore className="h-4 w-4" />
                  </a>
                  <Button variant="ghost" size="icon" onClick={() => remove(c.id)} aria-label={`Remove ${c.name}`} className="rounded-2xl">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
