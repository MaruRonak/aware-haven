export default function ChildSafetyTips() {
  const tips = [
    "Never share OTP",
    "Never share Password",
    "Avoid Stranger Chats",
    "Ask Parents Before Downloading Apps",
  ];

  return (
    <div className="rounded-3xl border bg-card p-6">
      <h2 className="mb-4 text-xl font-bold">
        Today's Safety Tips
      </h2>

      <div className="space-y-3">
        {tips.map((tip) => (
          <div
            key={tip}
            className="rounded-xl bg-yellow-50 p-3"
          >
            ⚠️ {tip}
          </div>
        ))}
      </div>
    </div>
  );
}