export default function ChildSafeBrowser() {
  return (
    <div className="rounded-2xl border p-6 bg-card">
      <h2 className="text-xl font-bold mb-4">
        Safe Browser Checklist
      </h2>

      <div className="space-y-3">
        <div>✅ Safe Search Enabled</div>
        <div>✅ YouTube Kids Enabled</div>
        <div>✅ Parent Control Enabled</div>
        <div>✅ Website Filter Enabled</div>
      </div>
    </div>
  );
}