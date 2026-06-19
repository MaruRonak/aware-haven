import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/_authenticated/language-selection"
)({
  component: LanguageSelection,
});

function LanguageSelection() {
  const [language, setLanguage] = useState("English");
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [voiceLanguage, setVoiceLanguage] = useState("English");
  const [notificationLanguage, setNotificationLanguage] =
    useState("English");
  const [textSize, setTextSize] = useState("Medium");

  const saveLanguagePreferences = () => {
    console.log({
      language,
      autoTranslate,
      voiceLanguage,
      notificationLanguage,
      textSize,
    });

    // Sonner toast can be used here
    // toast.success("Language preferences saved");


  toast.success("Language preferences saved");
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/profile"
          className="grid h-11 w-11 place-items-center rounded-xl border"
        >
          <ArrowLeft size={18} />
        </Link>

        <h1 className="text-3xl font-bold">
          Language Settings
        </h1>
      </div>

      <div className="rounded-3xl border bg-card p-8 shadow-sm space-y-6">

        {/* Preferred Language */}
        <div>
          <label className="font-medium">
            Preferred Language
          </label>

          <select
            className="mt-2 w-full rounded-xl border p-3"
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Gujarati</option>
          </select>
        </div>

        {/* Auto Translate */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={autoTranslate}
            onChange={(e) =>
              setAutoTranslate(e.target.checked)
            }
          />

          <label>
            Auto Translate Website
          </label>
        </div>

        {/* Voice Assistant */}
        <div>
          <label className="font-medium block mb-3">
            Voice Assistant Language
          </label>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="voice"
                value="English"
                checked={voiceLanguage === "English"}
                onChange={(e) =>
                  setVoiceLanguage(e.target.value)
                }
              />
              English
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="voice"
                value="Hindi"
                checked={voiceLanguage === "Hindi"}
                onChange={(e) =>
                  setVoiceLanguage(e.target.value)
                }
              />
              Hindi
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="voice"
                value="Gujarati"
                checked={voiceLanguage === "Gujarati"}
                onChange={(e) =>
                  setVoiceLanguage(e.target.value)
                }
              />
              Gujarati
            </label>
          </div>
        </div>

        {/* Notification Language */}
        <div>
          <label className="font-medium">
            Notification Language
          </label>

          <select
            className="mt-2 w-full rounded-xl border p-3"
            value={notificationLanguage}
            onChange={(e) =>
              setNotificationLanguage(
                e.target.value
              )
            }
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Gujarati</option>
          </select>
        </div>

        {/* Text Size */}
        <div>
          <label className="font-medium">
            Text Size
          </label>

          <select
            className="mt-2 w-full rounded-xl border p-3"
            value={textSize}
            onChange={(e) =>
              setTextSize(e.target.value)
            }
          >
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border bg-muted/20 p-5">
          <h3 className="font-semibold mb-2">
            Preview
          </h3>

          <p
            className={
              textSize === "Small"
                ? "text-sm"
                : textSize === "Large"
                ? "text-xl"
                : "text-base"
            }
          >
            Welcome to Cyber Raksha
          </p>
        </div>

        {/* Save */}
        <Button
          onClick={saveLanguagePreferences}
          className="w-full h-12 rounded-2xl"
        >
          Save Language Preferences
        </Button>

      </div>
    </div>
  );
}