import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth-callback")({
  component: CallbackPage,
});

function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate({
          to: "/role-select",
          replace: true,
        });
      } else {
        navigate({
          to: "/auth",
          replace: true,
        });
      }
    };

    finishLogin();
  }, [navigate]);

  return <div>Signing in...</div>;
}