import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/_authenticated/privacy-security"
)({
  component: PrivacySecurity,
});


function PrivacySecurity() {
  const saveSettings = () => {
  toast.success(
    "Privacy & Security Settings Saved Successfully"
  );
};

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/profile"
          className="grid h-11 w-11 place-items-center rounded-xl border"
        >
          <ArrowLeft size={18} />
        </Link>

        <h1 className="text-3xl font-bold">
          Privacy & Security
        </h1>
      </div>

      <div className="rounded-3xl border bg-card p-8 shadow-sm space-y-8">

        {/* Privacy Settings */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Privacy Settings
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Hide personal information
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Allow emergency responders to view profile
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Share live location during SOS
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Security Settings
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Enable Two-Factor Authentication
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Require password for profile changes
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Notify on suspicious login
            </label>
          </div>
        </div>

        {/* Login Activity */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Login Activity
          </h2>

          <div className="rounded-xl border p-4">
            Last Login:
            <span className="font-semibold ml-2">
              Today 10:30 AM
            </span>
          </div>
        </div>

        {/* Active Sessions */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Active Sessions
          </h2>

          <div className="rounded-xl border p-4 flex justify-between">
            <span>Current Device</span>

            <span className="text-green-600 font-semibold">
              Active
            </span>
          </div>
        </div>

        {/* Emergency Security */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Emergency Security
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Auto-send location during SOS
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Notify emergency contacts automatically
            </label>
          </div>
        </div>

        {/* Data Protection */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Data Protection
          </h2>

          <div className="rounded-xl border p-4">
            Your data is encrypted and securely stored.
          </div>
        </div>

        {/* Security Score */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Security Score
          </h2>

          <div className="rounded-xl border p-5">
            <div className="text-4xl font-bold text-green-600">
              92%
            </div>

            <p className="text-muted-foreground">
              Excellent Security Level
            </p>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={saveSettings}
          className="w-full h-12 rounded-2xl"
        >
          Save Privacy & Security Settings
        </Button>

       
      </div>
    </div>
  );
}