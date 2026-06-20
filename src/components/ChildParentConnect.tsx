export default function ChildParentConnect() {
  return (
    <div className="rounded-3xl border bg-card p-6">
      <h2 className="text-xl font-bold">
        Parent Connection
      </h2>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-green-500" />

        <span className="font-medium">
          Parent Connected
        </span>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        Your parents can receive emergency alerts.
      </p>
    </div>
  );
}