import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
  "/_authenticated/notification-settings"
)({
  component: NotificationSettings,
});

function NotificationSettings() {
  const [settings, setSettings] = useState({
    sosAlerts: true,
    dangerAlerts: true,
    emergencyUpdates: true,

    fraudAlerts: true,
    loginAlerts: true,
    cyberTips: true,

    quizReminders: true,
    newCourses: true,
    achievements: true,

    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    doNotDisturb: false,

    startTime: "22:00",
    endTime: "07:00",

    notificationSound: "Default",
    frequency: "Instant",

    priority: "High",
  });

  const saveNotifications = () => {
    toast.success(
      "Notification Settings Saved Successfully"
    );
  };

  const sendTestNotification = () => {
    toast.success(
      "Test Notification Sent Successfully"
    );
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/profile"
          className="grid h-11 w-11 place-items-center rounded-xl border"
        >
          <ArrowLeft size={18} />
        </Link>

        <h1 className="text-3xl font-bold">
          Notification Settings
        </h1>
      </div>

      <div className="rounded-3xl border bg-card p-8 shadow-sm space-y-8">

        {/* Emergency Alerts */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Emergency Alerts
          </h2>

          <div className="space-y-3">
            <CheckboxItem
              label="SOS Alerts"
              checked={settings.sosAlerts}
              onChange={() =>
                setSettings({
                  ...settings,
                  sosAlerts: !settings.sosAlerts,
                })
              }
            />

            <CheckboxItem
              label="Nearby Danger Alerts"
              checked={settings.dangerAlerts}
              onChange={() =>
                setSettings({
                  ...settings,
                  dangerAlerts:
                    !settings.dangerAlerts,
                })
              }
            />

            <CheckboxItem
              label="Emergency Contact Updates"
              checked={settings.emergencyUpdates}
              onChange={() =>
                setSettings({
                  ...settings,
                  emergencyUpdates:
                    !settings.emergencyUpdates,
                })
              }
            />
          </div>
        </div>

        {/* Cyber Alerts */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Cyber Security Alerts
          </h2>

          <div className="space-y-3">
            <CheckboxItem
              label="Fraud Alert Notifications"
              checked={settings.fraudAlerts}
              onChange={() =>
                setSettings({
                  ...settings,
                  fraudAlerts:
                    !settings.fraudAlerts,
                })
              }
            />

            <CheckboxItem
              label="Suspicious Login Alerts"
              checked={settings.loginAlerts}
              onChange={() =>
                setSettings({
                  ...settings,
                  loginAlerts:
                    !settings.loginAlerts,
                })
              }
            />

            <CheckboxItem
              label="Cyber Awareness Tips"
              checked={settings.cyberTips}
              onChange={() =>
                setSettings({
                  ...settings,
                  cyberTips:
                    !settings.cyberTips,
                })
              }
            />
          </div>
        </div>

        {/* Learning */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Learning Notifications
          </h2>

          <div className="space-y-3">
            <CheckboxItem
              label="Quiz Reminders"
              checked={settings.quizReminders}
              onChange={() =>
                setSettings({
                  ...settings,
                  quizReminders:
                    !settings.quizReminders,
                })
              }
            />

            <CheckboxItem
              label="New Courses Available"
              checked={settings.newCourses}
              onChange={() =>
                setSettings({
                  ...settings,
                  newCourses:
                    !settings.newCourses,
                })
              }
            />

            <CheckboxItem
              label="Achievement Notifications"
              checked={settings.achievements}
              onChange={() =>
                setSettings({
                  ...settings,
                  achievements:
                    !settings.achievements,
                })
              }
            />
          </div>
        </div>

        {/* Communication */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Communication Preferences
          </h2>

          <div className="space-y-3">
            <CheckboxItem
              label="Email Notifications"
              checked={settings.emailNotifications}
              onChange={() =>
                setSettings({
                  ...settings,
                  emailNotifications:
                    !settings.emailNotifications,
                })
              }
            />

            <CheckboxItem
              label="SMS Notifications"
              checked={settings.smsNotifications}
              onChange={() =>
                setSettings({
                  ...settings,
                  smsNotifications:
                    !settings.smsNotifications,
                })
              }
            />

            <CheckboxItem
              label="Push Notifications"
              checked={settings.pushNotifications}
              onChange={() =>
                setSettings({
                  ...settings,
                  pushNotifications:
                    !settings.pushNotifications,
                })
              }
            />
          </div>
        </div>

        {/* Do Not Disturb */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Do Not Disturb
          </h2>

          <CheckboxItem
            label="Enable Do Not Disturb"
            checked={settings.doNotDisturb}
            onChange={() =>
              setSettings({
                ...settings,
                doNotDisturb:
                  !settings.doNotDisturb,
              })
            }
          />

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              type="time"
              value={settings.startTime}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  startTime: e.target.value,
                })
              }
              className="rounded-xl border p-3"
            />

            <input
              type="time"
              value={settings.endTime}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  endTime: e.target.value,
                })
              }
              className="rounded-xl border p-3"
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4">
            Emergency Alert Priority
          </h2>

          <select
            value={settings.priority}
            onChange={(e) =>
              setSettings({
                ...settings,
                priority: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        {/* Preview */}
        <div className="rounded-2xl bg-muted p-5">
          <h3 className="font-bold mb-3">
            Preview
          </h3>

          <div>🔔 New Cyber Safety Quiz Available</div>
          <div>⚠ Suspicious Login Detected</div>
          <div>🚨 Emergency Alert Received</div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={sendTestNotification}
            variant="outline"
            className="h-12 rounded-2xl"
          >
            Send Test Notification
          </Button>

          <Button
            onClick={saveNotifications}
            className="h-12 rounded-2xl"
          >
            Save Notification Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}