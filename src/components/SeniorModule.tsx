import { useState } from "react";
import { PhoneCall, Lock, Video, FileWarning, CheckCircle2, ShieldAlert, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThreatAnalyzer } from "@/components/ThreatAnalyzer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UPIImage from "@/assets/UPI.jpeg";
import OTPImage from "@/assets/OTP.jpeg";
import BankImage from "@/assets/Bank.jpeg";

export function SeniorModule() {
  // Scam call checker
  const [phone, setPhone] = useState("");
  const [callVerdict, setCallVerdict] = useState<{ risky: boolean; reason: string } | null>(null);

  // Password checker
  const [pwd, setPwd] = useState("");
  const [pwdRating, setPwdRating] = useState<{ score: number; label: string; color: string; tips: string[] } | null>(null);

  // Complaint
  const [complaint, setComplaint] = useState("");
  const [filing, setFiling] = useState(false);
  const [message, setMessage] = useState("");
const [result, setResult] = useState("");

  const checkCall = (e: React.FormEvent) => {
    e.preventDefault();
    const p = phone.replace(/\s|-/g, "");
    if (!p) return;
    const tooShort = p.length < 8;
const startsWeird = /^\+?(00|44|1|234|256)/.test(p) && !p.startsWith("+91");
    const risky = tooShort || startsWeird;
    setCallVerdict({
      risky,
      reason: tooShort
        ? "Number is unusually short — many scam calls hide their real number."
        : startsWeird
        ? "International prefix detected. Be cautious — official Indian agencies won't call from abroad."
        : "Number format looks normal. Still verify the caller's identity before sharing OTPs or money.",
    });
  };

  const checkPwd = (val: string) => {
    setPwd(val);
    if (!val) return setPwdRating(null);
    let score = 0;
    const tips: string[] = [];
    if (val.length >= 12) score++; else tips.push("Use at least 12 characters");
    if (/[A-Z]/.test(val)) score++; else tips.push("Add an uppercase letter");
    if (/[a-z]/.test(val)) score++; else tips.push("Add a lowercase letter");
    if (/\d/.test(val)) score++; else tips.push("Add a number");
    if (/[^A-Za-z0-9]/.test(val)) score++; else tips.push("Add a symbol like ! @ #");
    if (/(password|1234|qwerty|admin|name|birthday)/i.test(val)) { score = Math.max(0, score - 2); tips.push("Avoid common words"); }

    const labels = ["Very weak", "Weak", "Okay", "Good", "Strong", "Excellent"];
    const colors = ["text-rose-500", "text-rose-500", "text-amber-500", "text-amber-500", "text-emerald-500", "text-emerald-500"];
    setPwdRating({ score, label: labels[score], color: colors[score], tips });
  };

  const analyzeMessage = () => {
  const suspiciousWords = [
    "otp",
    "bank",
    "kyc",
    "lottery",
    "winner",
    "prize",
    "urgent",
  ];

  const found = suspiciousWords.some(word =>
    message.toLowerCase().includes(word)
  );

  setResult(
    found
      ? "⚠ Possible Scam Message Detected"
      : "✅ Message Looks Safe"
  );
};

  const fileComplaint = async () => {
    if (!complaint.trim()) return;
    setFiling(true);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("ai_alerts").insert({
        user_id: u.user.id,
        alert_type: "complaint",
        severity: "medium",
        description: "Fraud complaint filed by user",
        input_text: complaint.slice(0, 2000),
      });
    }
    setFiling(false);
    setComplaint("");
    toast.success("Complaint logged. Also file at cybercrime.gov.in for official action.");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Scam call checker */}
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-soft">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Scam Call Checker</h3>
              <p className="text-xs text-muted-foreground">Verify a number before you call back.</p>
            </div>
          </div>
          <form onSubmit={checkCall} className="mt-4 space-y-3">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" inputMode="tel" />
            <Button type="submit" className="w-full">Check this number</Button>
          </form>
          {callVerdict && (
            <div className={`mt-4 rounded-xl border p-4 text-sm ${callVerdict.risky ? "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"}`}>
              <div className="flex items-center gap-2 font-semibold">
                {callVerdict.risky ? <ShieldAlert className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                {callVerdict.risky ? "Be careful" : "Looks normal"}
              </div>
              <p className="mt-1 opacity-90">{callVerdict.reason}</p>
              <p className="mt-2 text-xs opacity-80">Never share OTPs, bank PINs or Aadhaar with anyone over a phone call.</p>
            </div>
          )}
        </div>

        {/* Password safety */}
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white shadow-soft">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Password Safety Checker</h3>
              <p className="text-xs text-muted-foreground">Type a password — we'll rate it (never stored).</p>
            </div>
          </div>
          <div className="mt-4">
            <Input value={pwd} onChange={(e) => checkPwd(e.target.value)} placeholder="Type a password here…" type="text" autoComplete="off" />
          </div>
          {pwdRating && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                {[0,1,2,3,4].map((i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full ${i < pwdRating.score ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-muted"}`} />
                ))}
              </div>
              <div className={`text-sm font-semibold ${pwdRating.color}`}>{pwdRating.label}</div>
              {pwdRating.tips.length > 0 && (
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {pwdRating.tips.map((t) => <li key={t}>• {t}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

          <div className="rounded-3xl border border-border bg-card p-6">
  <h3 className="text-lg font-semibold">
    📩 Message Scam Checker
  </h3>

  <Textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Paste SMS or WhatsApp message here"
    className="mt-3"
  />

  <Button
    onClick={analyzeMessage}
    className="mt-3"
  >
    Analyze Message
  </Button>

  {result && (
    <div className="mt-3 font-semibold">
      {result}
    </div>
  )}
</div>
      {/* Learning videos */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-soft">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Watch & Learn</h3>
            <p className="text-xs text-muted-foreground">Short videos to stay scam-smart.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
         {[
  {
  title: "Spotting UPI scams",
  desc: "How to avoid fake payment requests",
  url: "https://www.youtube.com/results?search_query=upi+scam+awareness",
  image: "/images/UPI.jpeg",
},
  {
    title: "OTP fraud explained",
    desc: "Why you never share OTPs",
    url: "https://www.youtube.com/results?search_query=otp+fraud+awareness",
    image: "/images/OTP.jpeg",
  },
  {
    title: "Fake bank calls",
    desc: "Recognize impostor callers",
    url: "https://www.youtube.com/results?search_query=fake+bank+call+scam",
    image: "/images/Bank.jpeg",
  },
].map((v) => (
            <a key={v.title} href={v.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border p-4 hover:border-primary/40 hover:bg-accent/40 transition-all">
              <img
  src={v.image}
  alt={v.title}
  className="aspect-video w-full rounded-lg object-cover"
/>
              <div className="mt-3 font-medium text-sm">{v.title}</div>
              <div className="text-xs text-muted-foreground">{v.desc}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-xs text-primary">Watch <ExternalLink className="h-3 w-3" /></div>
            </a>
          ))}
        </div>
      </div>

      {/* Complaint */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-soft">
            <FileWarning className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">File a Fraud Complaint</h3>
            <p className="text-xs text-muted-foreground">Log it here, then submit to cybercrime.gov.in for action.</p>
          </div>
        </div>
        <Textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} rows={4} placeholder="Describe what happened — when, how much was lost, any phone numbers or links involved…" className="mt-4" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={fileComplaint} disabled={filing || !complaint.trim()}>
            {filing ? "Filing…" : "Log complaint"}
          </Button>
          <Button asChild variant="outline">
            <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">
              Open cybercrime.gov.in <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

          <div className="rounded-3xl border border-border bg-card p-6">
  <h2 className="text-xl font-bold">
    🛡 Daily Safety Tips
  </h2>

  <ul className="mt-4 space-y-2 text-sm">
    <li>✔ Never share OTP with anyone.</li>
    <li>✔ Banks never ask for passwords.</li>
    <li>✔ Do not click unknown links.</li>
    <li>✔ Verify before sending money.</li>
    <li>✔ Block suspicious callers.</li>
  </ul>
</div>

      <ThreatAnalyzer />
    </div>
  );
}
