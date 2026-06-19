import { Link, useNavigate } from "@tanstack/react-router";
import { Globe, LogOut, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  name: string;
  role: string;
};

const accentStyles = {
  rose: { bg: "var(--gradient-women)" },
  amber: { bg: "var(--gradient-children)" },
  emerald: { bg: "var(--gradient-senior)" },
} as const;

export function DashboardHeader({
  accent = "rose",
}: {
  accent?: "rose" | "amber" | "emerald";
}) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("name, role")
        .maybeSingle();

      if (data) {
        setProfile(data as Profile);
      }
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({
      to: "/",
      replace: true,
    });
  };

  return (
    <header
      className="overflow-hidden rounded-b-[2rem] text-white"
      style={{
        background: accentStyles[accent].bg,
      }}
    >
      <div className="container mx-auto max-w-6xl px-4 pb-8 pt-5 sm:pt-6">
        <div className="flex items-start justify-between gap-4">

          {/* Left Side */}
          <div>
            <div className="text-2xl font-bold leading-tight">
              {profile?.name
                ? `Hello, ${profile.name.split(" ")[0]}!`
                : "Hello!"}
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-white/90">
              <Shield className="h-4 w-4" />

              {profile?.role === "parent"
                ? "Learn. Play. Stay Safe."
                : profile?.role === "senior"
                ? "Stay Safe. Stay Secure."
                : "Stay Alert, Stay Safe"}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Link
              to="/role-select"
              className="hidden items-center gap-2 rounded-2xl bg-white/12 px-3 py-2 text-sm backdrop-blur sm:flex"
            >
              <Globe className="h-4 w-4" />
              Switch
            </Link>

            <button
              onClick={signOut}
              className="cursor-pointer rounded-full bg-white/20 p-3 transition hover:bg-white/30"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}