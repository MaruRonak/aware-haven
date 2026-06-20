import { useState } from "react";
import { Phone, Plus, Pencil, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

type Contact = {
  id: number;
  name: string;
  relation: string;
  phone: string;
};

export default function ChildTrustedContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setName("");
    setRelation("");
    setPhone("");
    setEditingId(null);
    setShowForm(false);
  };

  const saveContact = () => {
    if (!name || !relation || !phone) {
      toast.error("Please fill all fields");
      return;
    }

    if (editingId !== null) {
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === editingId
            ? { ...contact, name, relation, phone }
            : contact
        )
      );

      toast.success("Contact updated successfully");
    } else {
      const newContact: Contact = {
        id: Date.now(),
        name,
        relation,
        phone,
      };

      setContacts((prev) => [...prev, newContact]);

      toast.success("Contact added successfully");
    }

    resetForm();
  };

  const editContact = (contact: Contact) => {
    setName(contact.name);
    setRelation(contact.relation);
    setPhone(contact.phone);

    setEditingId(contact.id);
    setShowForm(true);
  };

  const deleteContact = (id: number) => {
    setContacts((prev) =>
      prev.filter((contact) => contact.id !== id)
    );

    toast.success("Contact deleted successfully");
  };

  return (
    <div className="rounded-3xl border bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Trusted Contacts
        </h2>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-full bg-primary p-2 text-white"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {showForm && (
        <div className="mb-5 space-y-3 rounded-2xl border p-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="text"
            placeholder="Relation"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <button
            onClick={saveContact}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 p-3 text-white"
          >
            <Save className="h-4 w-4" />
            Save Contact
          </button>
        </div>
      )}

      <div className="space-y-3">
        {contacts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No contacts added yet
          </p>
        )}

        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center justify-between rounded-2xl border p-4"
          >
            <div>
              <p className="font-semibold">
                {contact.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {contact.relation}
              </p>

              <p className="text-sm text-muted-foreground">
                {contact.phone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${contact.phone}`}
                className="rounded-full bg-blue-100 p-2"
              >
                <Phone className="h-4 w-4 text-blue-600" />
              </a>

              <button
                onClick={() => editContact(contact)}
                className="rounded-full bg-yellow-100 p-2"
              >
                <Pencil className="h-4 w-4 text-yellow-600" />
              </button>

              <button
                onClick={() => deleteContact(contact.id)}
                className="rounded-full bg-red-100 p-2"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}