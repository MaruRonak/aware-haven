import { createFileRoute } from "@tanstack/react-router";
import { CyberAIAssistant } from "@/components/CyberAIAssistant";

export const Route = createFileRoute("/_authenticated/ai")({
  component: AIPage,
});

function AIPage() {
  return (
  <div className="h-screen bg-background">
    <CyberAIAssistant />
  </div>
);
}