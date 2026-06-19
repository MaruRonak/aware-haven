import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/alerts")({
  component: AlertsPage,
});

function AlertsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
     <div className="flex items-center gap-3">
  <button
    onClick={() => window.history.back()}
    className="rounded-full border p-2 hover:bg-muted"
  >
    <ArrowLeft size={20} />
  </button>

  <h1 className="text-3xl font-bold">
    🔔 Safety Intelligence Center
  </h1>
</div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">🚨 Critical Alerts</h2>

        <ul className="mt-4 space-y-2">
          <li>🚨 Scam Message Detected</li>
          <li>🚨 SOS Activated Successfully</li>
          <li>🚨 Fraud Complaint Submitted</li>
          <li>🚨 Suspicious Caller Reported</li>
        </ul>
      </div>

      <div className="rounded-2xl border p-6 bg-green-50">
        <h2 className="text-xl font-semibold">🎯 Current Risk Level</h2>

        <div className="mt-3 text-green-600 font-bold text-2xl">
          🟢 LOW RISK
        </div>

        <p>No recent threats detected.</p>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">⭐ Safety Score</h2>

        <div className="mt-4 text-5xl font-bold text-primary">
          92 / 100
        </div>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">
          📊 Weekly Protection Summary
        </h2>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>Messages Scanned: 27</div>
          <div>Scam Calls Checked: 15</div>
          <div>Threats Detected: 3</div>
          <div>Complaints Filed: 1</div>
        </div>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">📡 Scam Radar</h2>

        <div className="mt-4 text-yellow-600 font-bold text-xl">
          🟡 MEDIUM
        </div>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">📞 Dangerous Numbers</h2>

        <ul className="mt-4 space-y-2">
          <li>⚠ +91 9876543210 (42 Reports)</li>
          <li>⚠ +91 8765432109 (27 Reports)</li>
          <li>⚠ +91 7654321098 (18 Reports)</li>
        </ul>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">🤖 AI Safety Insights</h2>

        <p className="mt-4">
          You frequently scan unknown messages. Risk reduced by 12%.
        </p>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold">
          🏥 Nearby Emergency Services
        </h2>

        <ul className="mt-4 space-y-2">
          <li>🚓 Police Station - 1.2 km</li>
          <li>🏥 Hospital - 0.8 km</li>
          <li>💻 Cyber Cell - 2.5 km</li>
        </ul>
      </div>

      <div className="rounded-2xl border p-6 bg-blue-50">
        <h2 className="text-xl font-semibold">🎯 Today's Mission</h2>

        <p className="mt-4">
          Review your emergency contacts.
        </p>

        <div className="mt-2 font-bold">
          Reward: +20 Safety Points
        </div>
      </div>
    </div>
  );
}