import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  Mic,
  Send,
  Heart,
  ThumbsUp,
  Sparkles,
} from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState(() =>
    JSON.parse(localStorage.getItem("clearmind_chat")) || [
      {
        id: 1,
        from: "support",
        text:
          "Hi! I'm ClearMind Support. I'm here for you — how are you feeling today?",
        time: timestamp(),
        emotion: "neutral",
      },
    ]
  );

  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [showScroll, setShowScroll] = useState(false);
  const [recording, setRecording] = useState(false);

  const chatRef = useRef(null);
  const endRef = useRef(null);

  const SUGGESTIONS = [
    "I'm anxious",
    "I feel overwhelmed",
    "I can't focus",
    "I'm stressed",
    "I'm feeling lonely",
  ];

  const REACTIONS = [
    { icon: <Heart size={18} />, text: "❤️", meaning: "kindness" },
    { icon: <ThumbsUp size={18} />, text: "👍", meaning: "support" },
    { icon: <Sparkles size={18} />, text: "✨", meaning: "hope" },
  ];

  const riskyWords = ["suicide", "kill", "end", "worthless", "die", "hurt"];

  function timestamp() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* ✅ Save chat history */
  useEffect(() => {
    localStorage.setItem("clearmind_chat", JSON.stringify(messages));
  }, [messages]);

  /* ✅ Auto Scroll Tracking */
  useEffect(() => {
    const el = chatRef.current;
    const onScroll = () => {
      const bottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScroll(bottom > 140);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ✅ Send Message */
  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      id: Date.now(),
      from: "you",
      text: input.trim(),
      time: timestamp(),
    };

    setMessages((prev) => [...prev, msg]);
    setInput("");
    navigator.vibrate?.(50);

    supportReply(msg.text);
  };

  /* ✅ Support System — Emotional Intelligence */
  const supportReply = (text) => {
    const user = text.toLowerCase();
    setTyping(true);

    let category = "default";

    const categories = [
      { key: "risk", test: (msg) => riskyWords.some((w) => msg.includes(w)) },
      { key: "anxiety", test: (msg) => /anxi|panic|fear|worry|nervous/.test(msg) },
      { key: "overwhelm", test: (msg) => /overwhelm|stress|pressure|burnout/.test(msg) },
      { key: "lonely", test: (msg) => /alone|lonely|ignored/.test(msg) },
      { key: "focus", test: (msg) => /focus|concentrate|distract/.test(msg) },
      { key: "sadness", test: (msg) => /sad|cry|empty|lost/.test(msg) },
      { key: "academic", test: (msg) => /exam|study|grades|marks/.test(msg) },
    ];

    for (const cat of categories) {
      if (cat.test(user)) {
        category = cat.key;
        break;
      }
    }

    const responses = {
      risk: [
        "Thank you for trusting me with this. Your safety matters the most. Please tap SOS if you’re in danger or call a trusted person near you.",
        "You deserve help and care. If you feel like you may hurt yourself, please reach out to emergency help now.",
      ],
      anxiety: [
        "It's okay to feel anxious. Can we try something together? Inhale for 4… hold… exhale for 4… You’re safe here.",
        "Anxiety is tough. Can you look around and name 3 things you can see right now?",
      ],
      overwhelm: [
        "You’re carrying so much right now. What’s one thing you can put down for now?",
        "It’s okay to pause. You’re allowed to rest without feeling guilty.",
      ],
      lonely: [
        "I’m here — and I’m really glad you’re talking to me.",
        "You aren’t alone anymore. You reached out — that shows strength.",
      ],
      focus: [
        "Focus can struggle when our mind is heavy. How about we try a 2-minute reset?",
        "Let’s set just one micro-goal. What’s the smallest thing you can do right now?",
      ],
      sadness: [
        "I'm really sorry you're feeling this. You deserve kindness — especially from yourself.",
        "You feel deeply because you care deeply. That’s a strength, not a weakness.",
      ],
      academic: [
        "Academic pressure doesn’t define your worth. What’s one subject stressing you out the most?",
        "You’re trying, and that counts. How about planning one tiny win today?",
      ],
      default: [
        "Thank you for sharing that. I’m here with you — tell me more.",
        "That sounds difficult. I want to understand better — what’s affecting you the most right now?",
      ],
    };

    const replyArray = responses[category];
    const reply = replyArray[Math.floor(Math.random() * replyArray.length)];
    const delay = Math.min(2000, reply.length * 35);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "support",
          text: reply,
          time: timestamp(),
        },
      ]);
    }, delay);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-b from-purple-50 to-white flex flex-col">

      {/* ✅ Header */}
      <div className="px-5 py-4 bg-white border-b shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-700">
          <MessageSquare size={22} />
          <h1 className="font-bold text-lg text-purple-800">Anonymous Support Chat</h1>
        </div>
        <Link
          to="/sos"
          className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 
          text-white text-xs font-bold rounded-lg transition"
        >
          <AlertTriangle size={14} />
          SOS
        </Link>
      </div>

      {/* ✅ Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[78%] p-3 rounded-2xl shadow-md text-sm ${
                msg.from === "you"
                  ? "ml-auto bg-purple-700 text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.text}
              <p className="text-[9px] opacity-60 text-right mt-1">{msg.time}</p>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <div className="px-4 py-2 bg-purple-100 text-purple-700 w-fit rounded-xl text-xs animate-pulse">
            Writing…
          </div>
        )}

        <div ref={endRef}></div>
      </div>

      {/* ✅ Scroll Button */}
      {showScroll && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => endRef.current.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-24 right-5 bg-purple-700 text-white w-10 h-10 rounded-full 
          flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          <ChevronDown size={20} />
        </motion.button>
      )}

      {/* ✅ Suggestions */}
      <div className="px-4 py-2 flex overflow-x-auto gap-2 text-xs">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full"
          >
            {s}
          </button>
        ))}
      </div>

      {/* ✅ Reactions */}
      <div className="px-4 pb-1 flex gap-3 text-purple-700">
        {REACTIONS.map(({ icon, text }) => (
          <button
            key={text}
            onClick={() => setInput((prev) => prev + " " + text)}
            className="flex items-center justify-center w-9 h-9 bg-white rounded-full shadow hover:scale-110 transition"
          >
            {icon}
          </button>
        ))}
      </div>

      {/* ✅ Input */}
      <div className="px-4 py-3 bg-white border-t shadow-sm flex items-center gap-3">
        <button
          onClick={() => {
            setRecording(true);
            setTimeout(() => {
              setRecording(false);
            }, 1200);
          }}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
            recording
              ? "bg-red-600 text-white animate-pulse"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          <Mic size={20} />
        </button>

        <input
          type="text"
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full border border-gray-300
          focus:ring-2 focus:ring-purple-600"
          placeholder="You’re safe here. Share your thoughts…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-11 h-11 bg-purple-700 hover:bg-purple-800 text-white rounded-full 
          flex items-center justify-center active:scale-95 transition disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
