import { useState } from "react";
import { Button } from "@/components/ui/button";

const questions = [
  {
    question: "Someone asks your password online. What should you do?",
    options: [
      "Share Password",
      "Ignore and Tell Parents",
      "Send Later",
      "Ask Friend"
    ],
    answer: 1,
  },
  {
    question: "A stranger asks your home address.",
    options: [
      "Tell Them",
      "Give School Address",
      "Do Not Share",
      "Send Location"
    ],
    answer: 2,
  },
  {
    question: "You receive a suspicious link.",
    options: [
      "Click It",
      "Ignore It",
      "Forward It",
      "Save It"
    ],
    answer: 1,
  },
  {
    question: "Can you share OTP with anyone?",
    options: [
      "Yes",
      "Only Friends",
      "Only Teacher",
      "No"
    ],
    answer: 3,
  },
  {
    question: "Before downloading a new game, what should you do?",
    options: [
      "Download Immediately",
      "Ask Parents",
      "Ask Stranger",
      "Ignore Parents"
    ],
    answer: 1,
  },
];

export default function ChildCyberQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const question = questions[currentQuestion];

  const nextQuestion = () => {
    if (selected === null) return;

    if (selected === question.answer) {
      setScore((prev) => prev + 1);
    }

    setSelected(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  const getRank = () => {
    if (score === 5) return "🥇 Gold Champion";
    if (score === 4) return "🥈 Silver Protector";
    if (score === 3) return "🥉 Bronze Defender";
    return "📚 Safety Learner";
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border bg-card p-6">
        <h2 className="text-2xl font-bold text-center">
          Quiz Result
        </h2>

        <div className="mt-6 text-center">
          <p className="text-4xl font-bold text-primary">
            {score}/5
          </p>

          <p className="mt-3 text-xl font-semibold">
            {getRank()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Cyber Safety Quiz
        </h2>

        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} / 5
        </span>
      </div>

      <p className="mb-6 text-lg font-medium">
        {question.question}
      </p>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`w-full rounded-xl border p-4 text-left transition
            ${
              selected === index
                ? "border-primary bg-primary/10"
                : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <Button
        className="mt-6 w-full"
        onClick={nextQuestion}
        disabled={selected === null}
      >
        {currentQuestion === questions.length - 1
          ? "Submit Quiz"
          : "Next Question"}
      </Button>
    </div>
  );
}