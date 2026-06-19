import { useState, useEffect, useRef } from "react";
import {
  Bot,
  User,
  Send,
  Mic,
  Plus
} from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function CyberAIAssistant() {
const navigate = useNavigate();
const fileInputRef = useRef<HTMLInputElement>(null);
const [input, setInput] = useState("");
const [score, setScore] = useState(75);
const [typing, setTyping] = useState(false);
const [uploadedImage, setUploadedImage] = useState<string | null>(null);
const [threatsChecked, setThreatsChecked] = useState(0);
const [riskLevel, setRiskLevel] = useState("Safe");
const getGreeting = () => {
const hour = new Date().getHours();

  if (hour < 12) return "🌅 Good Morning";
  if (hour < 18) return "☀️ Good Afternoon";
  return "🌙 Good Evening";
};



const [messages, setMessages] = useState([
  {
    role: "ai",
    text: `${getGreeting()}

👋 Welcome to Cyber Suraksha AI Assistant

How can I help you today?`,
  },
]);

const bottomRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (bottomRef.current) {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }
}, [messages]);

  const suggestions = [
  "⚠ Check a suspicious message",
  "📞 Verify a phone number",
  "🌐 Is this website safe?",
  "🛡 How can I protect myself online?",
];

const handleImageUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const imageUrl = URL.createObjectURL(file);

  setUploadedImage(imageUrl);

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      text: `📷 Uploaded image: ${file.name}`,
    },
  ]);

  setTyping(true);

  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text:
`🔍 AI Image Analysis

Risk Level: HIGH ⚠️

Detected:
• Suspicious Payment Request
• Urgent Language
• Possible Scam Content

Recommendation:
Do not send money or share OTP.`      },
    ]);

    setTyping(false);
    setThreatsChecked((prev) => prev + 1);
  }, 2000);
};


const startListening = () => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition not supported.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript);
  };
};


const handleSend = () => {
  if (!input.trim()) return;

  const userInput = input;

  const userMessage = {
    role: "user",
    text: userInput,
  };

  setMessages((prev) => [...prev, userMessage]);

  setInput("");
  setTyping(true);

 let aiReply =
  "🤔 Let me help you with that.\n\nCan you tell me a little more about the situation so I can give better advice?";

  const msg = userInput.toLowerCase();
  if (
  msg.includes("hi") ||
  msg.includes("hello") ||
  msg.includes("hey")
) {
  aiReply =
    "👋 Hello!\n\nI'm Cyber Raksha AI.\n\nI can help you with:\n\n🛡️ UPI Fraud\n📞 Fake Calls\n🔐 OTP Scams\n🌐 Suspicious Links\n🚨 Cybercrime Reporting\n\nHow can I help you today?";
}else if (
  msg.includes("thank") ||
  msg.includes("thanks")
) {
  aiReply =
    "😊 You're welcome!\n\nStay safe online and feel free to ask me anything related to cybersecurity.";
}else if (
  msg.includes("who are you")
) {
  aiReply =
    "🤖 I'm Cyber Raksha AI.\n\nI'm designed to help users stay safe from online scams, cybercrime, fake calls, phishing attacks, and social media fraud.";
}else if (
  msg.includes("how are you")
) {
  aiReply =
    "😊 I'm doing great and ready to help keep you safe online.\n\nHow can I assist you today?";
}else if (
  msg.includes("good morning")
) {
  aiReply =
    "☀️ Good Morning!\n\nRemember today's cyber safety tip:\n\nNever share OTP, passwords, or banking details with anyone.";
}else if (
  msg.includes("good night")
) {
  aiReply =
    "🌙 Good Night!\n\nStay safe online and remember to use strong passwords.";
}


  if (msg.includes("otp")) {
    aiReply =
      "⚠️ OTP Safety Alert\n\nNever share OTP with anyone.\nBanks never ask for OTP.\nBlock suspicious callers immediately.";
  } else if (msg.includes("upi")) {
    aiReply =
      "💳 UPI Fraud Warning\n\nNever approve collect requests from unknown users.\nAlways verify before paying.";
  } else if (msg.includes("call")) {
    aiReply =
      "📞 Call Safety\n\nVerify caller identity.\nNever share bank details over phone calls.";
  } else if (msg.includes("link")) {
    aiReply =
      "🌐 Suspicious Link Alert\n\nCheck domain name carefully.\nAvoid clicking shortened links.";
  } else if (
  msg.includes("website") ||
  msg.includes(".com") ||
  msg.includes(".xyz")
) {
  aiReply =
    "🌐 Website Analysis\n\n⚠ This website should be verified before entering personal information.\n\nCheck:\n• HTTPS Lock\n• Official Domain\n• Contact Information";
}else if (
  msg.includes("job") ||
  msg.includes("salary") ||
  msg.includes("work from home")
) {
  aiReply =
    "🚨 Possible Job Scam\n\nNever pay money for a job.\nVerify company details before applying.";
}else if (
  msg.includes("winner") ||
  msg.includes("lottery") ||
  msg.includes("prize")
) {
  aiReply =
    "🚨 Lottery Scam Alert\n\nYou cannot win a lottery you never entered.\nDo not share personal information.";
}else if (
  msg.includes("bank") ||
  msg.includes("kyc")
) {
  aiReply =
    "🏦 Banking Scam Warning\n\nBanks never ask for:\n\n• OTP\n• PIN\n• Password\n\nDo not share them.";
}

  setTimeout(() => {
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: aiReply,
      },
    ]);

    setTyping(false);
    setScore((prev) => prev + 1);
  }, 1000);
};

return (
  <div className="h-screen w-full flex flex-col bg-background">
   {/* Header */}
<div className="border-b p-4 flex items-center gap-3">

  <button
onClick={() => window.history.back()}
    className="rounded-full border p-2 hover:bg-muted"
  >
    <ArrowLeft size={20} />
  </button>

  <div>
    <h2 className="text-2xl font-bold">
      🤖 Cyber Suraksha AI
    </h2>

    <p className="text-sm text-muted-foreground">
      Your Personal Safety Assistant
    </p>
  </div>

</div>

   


    {/* Chat Area */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] rounded-2xl p-3 ${
              msg.role === "user"
                ? "bg-primary text-white"
                : "bg-muted"
            }`}
          >
            <div className="flex items-start gap-2">
              {msg.role === "ai" ? (
                <Bot size={18} />
              ) : (
                <User size={18} />
              )}

              <span className="whitespace-pre-line">
                {msg.text}
              </span>
              {msg.role === "ai" &&
 msg.text.includes("🚨") && (
  <div className="mt-3 flex gap-2 flex-wrap">

  </div>
)}
            </div>
          </div>
        </div>
      ))}
        {typing && (
  <div className="flex justify-start">
    <div className="rounded-2xl bg-muted p-3">
      🤖 Cyber Raksha AI is typing...
    </div>
  </div>
)}

    {uploadedImage && (
  <div className="flex justify-end">
    <img
      src={uploadedImage}
      alt="Uploaded"
      className="max-w-[200px] rounded-xl border"
    />
  </div>
)}
      <div ref={bottomRef}></div>
    </div>

   

          {/* image */}
    <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="hidden"
/>

    {/* Input Box */}
    <div className="border-t p-4 flex gap-2 bg-background">
      <input
        value={input}
        onChange={(e) =>
          setInput(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Ask Cyber Raksha AI..."
        className="flex-1 rounded-xl border px-4 py-3"
      />

     <button
  onClick={() => fileInputRef.current?.click()}
  className="rounded-xl border px-4"
>
  <Plus size={18} />
</button>

<button
  onClick={startListening}
  className="rounded-xl border px-4"
>
  <Mic size={18} />
</button>

<button
  onClick={handleSend}
  className="rounded-xl bg-primary px-4 text-white"
>
  <Send size={18} />
</button>
    </div>
  </div>
);
}