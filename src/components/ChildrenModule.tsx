import ChildCyberQuiz from "./ChildCyberQuiz";
import ChildSafeBrowser from "./ChildSafeBrowser";
import ChildReportStranger from "./ChildReportStranger";
import ChildSafetyTips from "./ChildSafetyTips";
import ChildTrustedContacts from "./ChildTrustedContacts";
import ChildScamChecker from "./ChildScamChecker";

export default function ChildrenModule() {
  return (
    <div className="space-y-6">

      <ChildCyberQuiz />
         <div className="grid gap-6 lg:grid-cols-2">
  <ChildTrustedContacts />
  <ChildScamChecker />
</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChildSafeBrowser />
        <ChildReportStranger />
      </div>

      <ChildSafetyTips />

    </div>
  );
}

