import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ChildReportStranger() {
  const report = () => {
    toast.success("Report sent successfully");
  };

  return (
    <div className="rounded-2xl border p-6 bg-card">
      <h2 className="text-xl font-bold mb-4">
        Report Stranger
      </h2>

      <div className="space-y-3">
        <Button
          className="w-full"
          onClick={report}
        >
          Online Stranger
        </Button>

        <Button
          className="w-full"
          onClick={report}
        >
          School Stranger
        </Button>

        <Button
          className="w-full"
          onClick={report}
        >
          Phone Stranger
        </Button>
      </div>
    </div>
  );
}