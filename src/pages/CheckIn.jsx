import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function CheckIn() {
  const moods = [
    { label: "Great", emoji: "😄", score: 5 },
    { label: "Good", emoji: "😊", score: 4 },
    { label: "Okay", emoji: "😐", score: 3 },
    { label: "Low", emoji: "😔", score: 2 },
    { label: "Awful", emoji: "😣", score: 1 },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#facc15", "#fb923c", "#ef4444"];

  const timestamp = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const generateDummyHistory = () =>
    Array.from({ length: 30 }, (_, i) => ({
      mood: moods[Math.floor(Math.random() * moods.length)].label,
      stress: Math.floor(Math.random() * 5) + 1,
      sleep: Math.floor(Math.random() * 5) + 1,
      focus: Math.floor(Math.random() * 5) + 1,
      date: `Day ${i + 1}`,
    }));

  const [mood, setMood] = useState(null);
  const [stress, setStress] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [focus, setFocus] = useState(3);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("clearmind_checkins")) ||
      generateDummyHistory();
    setHistory(savedHistory);
  }, []);

  const saveCheckIn = () => {
    const entry = {
      mood,
      stress,
      sleep,
      focus,
      note,
      date: "Today",
      time: timestamp(),
    };
    const updated = [entry, ...history];
    setHistory(updated);
    localStorage.setItem("clearmind_checkins", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const recent = history.slice(0, 7).reverse();

  const wellnessScore = Math.round(
    (recent.reduce(
      (acc, h) => acc + (h.sleep + h.focus + (6 - h.stress)),
      0
    ) /
      (recent.length * 15)) *
      100
  );

  const moodCounts = moods.map((m) => ({
    name: m.label,
    value: history.filter((h) => h.mood === m.label).length,
  }));

  const projection = recent.map((h, i) => ({
    day: `+${i + 1}`,
    forecast: Math.min(5, Math.max(1, (h.sleep + h.focus) / 2)),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white px-6 py-24 pb-32">
      
      {/* TITLE */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-800">Daily Check-In 💜</h1>
        <p className="text-gray-600 mt-2">
          Understand your emotions. Improve your well-being.
        </p>
      </div>

      {/* MOOD SELECT */}
      <div className="max-w-4xl mx-auto mt-10">
        <p className="text-sm font-medium text-gray-800">How do you feel?</p>
        <div className="grid grid-cols-5 gap-3 mt-2">
          {moods.map((m) => (
            <motion.button
              key={m.label}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMood(m.label)}
              className={`p-4 rounded-xl border text-center transition ${
                mood === m.label
                  ? "bg-purple-200 border-purple-700"
                  : "bg-white border-gray-300 hover:bg-purple-50"
              }`}
            >
              <div className="text-3xl">{m.emoji}</div>
              <small className="font-medium">{m.label}</small>
            </motion.button>
          ))}
        </div>
      </div>

      {/* SLIDERS */}
      <div className="max-w-4xl mx-auto mt-10 space-y-6">
        <Slider label="Stress" value={stress} setValue={setStress} />
        <Slider label="Sleep Quality" value={sleep} setValue={setSleep} />
        <Slider label="Focus Level" value={focus} setValue={setFocus} />
      </div>

      {/* NOTE */}
      <div className="max-w-4xl mx-auto mt-10">
        <textarea
          rows="3"
          placeholder="Write about today…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-4 rounded-xl border border-gray-300"
        />
      </div>

      {/* SAVE BUTTON */}
      <div className="text-center mt-8">
        <button
          disabled={!mood}
          onClick={saveCheckIn}
          className={`px-8 py-3 rounded-lg font-bold shadow ${
            mood
              ? "bg-purple-700 text-white hover:bg-purple-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Save ✅
        </button>
      </div>

      {/* FEEDBACK */}
      <AnimatePresence>
        {saved && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-green-600 mt-3 text-center font-medium"
          >
            Saved Successfully 🌟
          </motion.p>
        )}
      </AnimatePresence>

      {/* WELLNESS SCORE */}
      <InsightCard title="Overall Well-Being Score 🎯">
        <h2 className="text-5xl font-bold text-purple-700 text-center">
          {wellnessScore}%
        </h2>
      </InsightCard>

      {/* WEEKLY TREND */}
      <ChartCard title="Weekly Emotional Trend 📈">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={recent}>
            <defs>
              <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="90%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis domain={[1, 5]} />
            <Tooltip />
            <Area
              dataKey="stress"
              fill="url(#stressGradient)"
              stroke="#ef4444"
              strokeWidth={2}
              name="Stress Level"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* MOOD DISTRIBUTION */}
      <ChartCard title="Mood Distribution 🧠">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={moodCounts} outerRadius={100} dataKey="value" label>
              {COLORS.map((c, i) => (
                <Cell key={i} fill={c} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* FORECAST */}
      <ChartCard title="7-Day Wellness Forecast 🔮">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={projection}>
            <XAxis dataKey="day" />
            <Tooltip />
            <Bar dataKey="forecast" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

/* ✅ Slider Component */
function Slider({ label, value, setValue }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-purple-700">{value}/5</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        className="w-full accent-purple-700"
      />
    </div>
  );
}

/* ✅ UI Card Templates */
function ChartCard({ title, children }) {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border p-8 mt-10">
      <h3 className="text-lg font-bold text-purple-800 text-center mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InsightCard({ title, children }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border p-8 mt-10 text-center">
      <h3 className="text-lg font-bold text-purple-800 mb-2">{title}</h3>
      {children}
    </div>
  );
}
