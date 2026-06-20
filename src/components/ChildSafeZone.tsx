export default function ChildSafeZone() {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="text-xl font-bold mb-4">
        Safe Zones
      </h2>

      <div className="space-y-3">
        <div>🏠 Home</div>
        <div>🏫 School</div>
        <div>📚 Tuition</div>
      </div>

      <div className="mt-4 rounded-xl bg-green-100 p-4 text-green-700">
        Child is inside safe area
      </div>
    </div>
  );
}