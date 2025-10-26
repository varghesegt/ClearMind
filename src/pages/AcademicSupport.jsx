import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  BookOpen,
  Target,
  Timer,
  FileText,
  UserCheck,
  MessageCircle,
  Search,
  X,
  CheckCircle2,
  Pause,
  Play,
  RotateCw,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  AlarmClock,
  Layers,
  GraduationCap,
  Sparkles,
  ListChecks,
  NotepadText,
  Download,
  Book,
  School,
  Wand2,
  Brain,
  Info,
  Lightbulb,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

/* =====================================================================================
   AcademicSupport — Single File, Premium UI
   Sections:
   1) Header
   2) Quick Actions Grid (SupportCard *)
   3) Smart Tools Grid (ResourceCard *)
   4) Study Toolkit (PomodoroTimer, WeeklyPlanner, GoalTracker, Tips)
   5) Download Center (notes, templates)
   6) Mentor Request Modal (request a senior mentor)
   7) FAQ
   8) Sticky Utility Aside (shortcuts + status) for large screens
   - Each "card" is its own function component as requested
===================================================================================== */

export default function AcademicSupport() {
  // Search/filter for the Resources section
  const [query, setQuery] = useState("");
  const [mentorOpen, setMentorOpen] = useState(false);

  // Demo resources (could come from API later)
  const resources = useMemo(
    () => [
      {
        id: "r1",
        icon: <Timer />,
        tag: "Focus",
        title: "Pomodoro Deep Focus",
        desc: "Boost productivity with structured intervals and mindful breaks.",
        component: <PomodoroCard />,
        keywords: ["pomodoro", "focus", "timer", "productivity", "breaks"],
      },
      {
        id: "r2",
        icon: <FileText />,
        tag: "Planning",
        title: "Weekly Planner",
        desc: "Visualize priorities and plan a realistic study schedule.",
        component: <WeeklyPlannerCard />,
        keywords: ["planner", "calendar", "schedule", "weekly", "plan"],
      },
      {
        id: "r3",
        icon: <Target />,
        tag: "Progress",
        title: "Goal Tracker",
        desc: "Set measurable goals and track progress over time.",
        component: <GoalTrackerCard />,
        keywords: ["goals", "progress", "tracker", "habits", "targets"],
      },
      {
        id: "r4",
        icon: <BookOpen />,
        tag: "Guidance",
        title: "Study Guidance",
        desc: "Evidence-based revision techniques and learning strategies.",
        component: <StudyGuidanceCard />,
        keywords: ["study", "guidance", "tips", "learning", "revision"],
      },
      {
        id: "r5",
        icon: <Download />,
        tag: "Templates",
        title: "Download Center",
        desc: "Syllabus outline, revision schedule, and assignment trackers.",
        component: <DownloadCenterCard />,
        keywords: ["download", "templates", "notes", "outline", "documents"],
      },
      {
        id: "r6",
        icon: <UserCheck />,
        tag: "Mentorship",
        title: "Senior Mentor",
        desc: "Ask for guidance from someone who’s been there.",
        component: (
          <MentorRequestCard
            onRequest={() => setMentorOpen(true)}
          />
        ),
        keywords: ["mentor", "support", "peer", "help", "guidance"],
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return resources;
    return resources.filter((r) => {
      return (
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.tag.toLowerCase().includes(q) ||
        (r.keywords || []).some((k) => k.includes(q))
      );
    });
  }, [resources, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_320px] gap-10">
        {/* Main */}
        <main>
          <HeaderCard />

          {/* Quick Actions */}
          <section className="mt-10">
            <SectionTitle
              icon={<Layers size={18} />}
              title="Quick Actions"
              subtitle="Jump straight into what matters."
            />

            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              <SupportCard
                icon={<ClipboardCheck />}
                title="Assignments & Deadlines"
                desc="Organize tasks and avoid last-minute panic."
                link="/todo"
                cta="Open Study Tasks"
              />
              <SupportCard
                icon={<BookOpen />}
                title="Study Guidance"
                desc="Structured learning help from the right resources."
                link="#resources"
                cta="Explore Tips"
              />
              <SupportCard
                icon={<Target />}
                title="Goal Tracking"
                desc="Break big goals into achievable milestones."
                link="#goal-tracker"
                cta="Set Goals"
              />
            </div>
          </section>

          {/* Smart Productivity Tools */}
          <section id="resources" className="mt-16 scroll-mt-24">
            <SectionTitle
              icon={<Sparkles size={18} />}
              title="Smart Productivity Tools"
              subtitle="Build momentum with structure and clarity."
            />

            <ResourceSearch value={query} setValue={setQuery} />

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {filtered.map((r) => (
                <ResourceCard
                  key={r.id}
                  icon={r.icon}
                  tag={r.tag}
                  title={r.title}
                  desc={r.desc}
                >
                  {r.component}
                </ResourceCard>
              ))}
            </div>
          </section>

          {/* Study Toolkit Composite */}
          <section className="mt-16">
            <SectionTitle
              icon={<GraduationCap size={18} />}
              title="Study Toolkit"
              subtitle="Timers, planners, trackers — tuned for academic flow."
            />

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <PomodoroFocusWidget />
              <WeeklyPlannerWidget />
              <GoalTrackerWidget />
              <StudyTipsWidget />
            </div>
          </section>

          {/* Final CTA */}
          <FinalCTACard />
        </main>

        {/* Sticky Aside (Large screens) */}
        <aside className="hidden lg:block">
          <StickyUtilityAside onMentor={() => setMentorOpen(true)} />
        </aside>
      </div>

      {/* Mentor Modal */}
      <MentorRequestModal open={mentorOpen} onClose={() => setMentorOpen(false)} />
    </div>
  );
}

/* =====================================================================================
   Header — Hero card
===================================================================================== */
function HeaderCard() {
  return (
    <section className="text-center">
      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white border border-purple-100 shadow-sm">
        <Book className="text-purple-700" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 tracking-tight">
          Academic Support Center
        </h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto mt-3 text-lg">
        Stay productive, organized, and calm with ClearMind’s academic wellness tools.
      </p>
    </section>
  );
}

/* =====================================================================================
   Section Title
===================================================================================== */
function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-purple-100 text-purple-700">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-purple-800">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

/* =====================================================================================
   Support Card (Quick actions) — function per card
===================================================================================== */
function SupportCard({ icon, title, desc, link, cta }) {
  return (
    <Link
      to={link}
      className="group bg-white rounded-2xl p-7 shadow-md border border-purple-100 
      hover:shadow-2xl hover:-translate-y-1 transition-all transform backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
    >
      <div className="mb-4 text-purple-700 group-hover:text-purple-900 transition">
        {React.cloneElement(icon, { size: 36, strokeWidth: 2.2 })}
      </div>
      <h3 className="text-lg font-bold text-purple-800 group-hover:text-purple-900">
        {title}
      </h3>
      <p className="text-gray-600 text-sm mt-1">{desc}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 group-hover:text-purple-900">
        {cta || "Open"} <ChevronRight size={16} />
      </div>
    </Link>
  );
}

/* =====================================================================================
   Resource Search
===================================================================================== */
function ResourceSearch({ value, setValue }) {
  return (
    <div className="mt-6 flex items-center gap-3 bg-white border border-purple-100 rounded-2xl p-3 shadow-sm">
      <Search size={18} className="text-purple-700" />
      <input
        type="text"
        placeholder="Search tools, tips, downloads…"
        className="flex-1 outline-none text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search academic tools"
      />
    </div>
  );
}

/* =====================================================================================
   Resource Card — container
===================================================================================== */
function ResourceCard({ icon, tag, title, desc, children }) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-md border border-purple-100 hover:shadow-xl transition-all">
      <div className="flex items-center gap-2">
        {React.cloneElement(icon, { size: 20, className: "text-purple-700" })}
        <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-lg">
          {tag}
        </span>
      </div>

      <h4 className="text-lg font-bold text-gray-900 mt-3">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>

      <div className="mt-5">{children}</div>
    </div>
  );
}

/* =====================================================================================
   Pomodoro Card — self-contained tool
===================================================================================== */
function PomodoroCard() {
  return (
    <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-center">
      <p className="text-sm text-gray-600">
        Use short, focused intervals (e.g., 25 min) followed by brief breaks to
        maintain energy and reduce burnout.
      </p>
      <Link
        to="#focus"
        className="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm rounded-xl bg-purple-700 text-white hover:bg-purple-800"
      >
        <AlarmClock size={16} />
        Open Focus Timer
      </Link>
    </div>
  );
}

/* =====================================================================================
   Weekly Planner Card — link to widget
===================================================================================== */
function WeeklyPlannerCard() {
  return (
    <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-center">
      <p className="text-sm text-gray-600">
        Plan a realistic week. Balance deep work with recovery windows.
      </p>
      <a
        href="#planner"
        className="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm rounded-xl border border-purple-700 text-purple-700 hover:bg-purple-50"
      >
        <CalendarDays size={16} />
        Open Planner
      </a>
    </div>
  );
}

/* =====================================================================================
   Goal Tracker Card — link to widget
===================================================================================== */
function GoalTrackerCard() {
  return (
    <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-center" id="goal-tracker">
      <p className="text-sm text-gray-600">
        Define clear targets, then track progress visually to keep momentum.
      </p>
      <a
        href="#goals"
        className="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm rounded-xl border border-purple-700 text-purple-700 hover:bg-purple-50"
      >
        <ListChecks size={16} />
        Open Goals
      </a>
    </div>
  );
}

/* =====================================================================================
   Study Guidance Card — expands tips
===================================================================================== */
function StudyGuidanceCard() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:underline"
        aria-expanded={open}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        View techniques and best practices
      </button>

      {open && (
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <Lightbulb className="text-purple-700" size={16} />
            Active recall + spaced repetition outperform rereading.
          </li>
          <li className="flex gap-2">
            <Brain className="text-purple-700" size={16} />
            Interleaving topics improves transfer and retention.
          </li>
          <li className="flex gap-2">
            <ShieldCheck className="text-purple-700" size={16} />
            Sleep and breaks consolidate learning and prevent overload.
          </li>
          <li className="flex gap-2">
            <Wand2 className="text-purple-700" size={16} />
            Teach-back method: explain concepts as if you’re the tutor.
          </li>
        </ul>
      )}
    </div>
  );
}

/* =====================================================================================
   Download Center Card — templates (stub links)
===================================================================================== */
function DownloadCenterCard() {
  const files = [
    { name: "Weekly Study Planner (PDF)", href: "/downloads/weekly-planner.pdf" },
    { name: "Assignment Tracker (CSV)", href: "/downloads/assignment-tracker.csv" },
    { name: "Syllabus Outline (DOCX)", href: "/downloads/syllabus-outline.docx" },
  ];
  return (
    <div className="space-y-3">
      {files.map((f) => (
        <a
          key={f.name}
          href={f.href}
          className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-white hover:shadow transition group"
        >
          <span className="text-sm text-gray-800">{f.name}</span>
          <span className="inline-flex items-center gap-2 text-purple-700 group-hover:text-purple-900">
            <Download size={16} />
            Download
          </span>
        </a>
      ))}
      <p className="text-xs text-gray-500">
        Tip: Save templates to your cloud drive and duplicate per course.
      </p>
    </div>
  );
}

/* =====================================================================================
   Mentor Request Card — opens modal
===================================================================================== */
function MentorRequestCard({ onRequest }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-gray-600">
        Pair with a supportive senior mentor for practical strategies.
      </p>
      <button
        type="button"
        onClick={onRequest}
        className="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm rounded-xl bg-purple-700 text-white hover:bg-purple-800"
      >
        <UserCheck size={16} />
        Request Mentor
      </button>
    </div>
  );
}

/* =====================================================================================
   Toolkit Widgets (big tiles)
===================================================================================== */
function PomodoroFocusWidget() {
  return (
    <div id="focus" className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
      <WidgetHeader
        icon={<AlarmClock />}
        title="Focus Timer (Pomodoro)"
        subtitle="Stay laser-focused with cycles of deep work and restorative breaks."
      />
      <div className="mt-4">
        <PomodoroTimer />
      </div>
    </div>
  );
}

function WeeklyPlannerWidget() {
  return (
    <div id="planner" className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
      <WidgetHeader
        icon={<CalendarDays />}
        title="Weekly Planner"
        subtitle="Map your study blocks and keep a realistic routine."
      />
      <div className="mt-4">
        <WeeklyPlanner />
      </div>
    </div>
  );
}

function GoalTrackerWidget() {
  return (
    <div id="goals" className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
      <WidgetHeader
        icon={<ListChecks />}
        title="Goal Tracker"
        subtitle="Define targets and monitor your progress visually."
      />
      <div className="mt-4">
        <GoalTracker />
      </div>
    </div>
  );
}

function StudyTipsWidget() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
      <WidgetHeader
        icon={<NotepadText />}
        title="Study Tips"
        subtitle="Short, evidence-backed pointers to learn effectively."
      />
      <div className="mt-4">
        <StudyTips />
      </div>
    </div>
  );
}

/* =====================================================================================
   Widget Header
===================================================================================== */
function WidgetHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <h3 className="text-lg font-bold text-purple-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
}

/* =====================================================================================
   Pomodoro Timer — stateful tool
===================================================================================== */
function PomodoroTimer() {
  const DEFAULTS = { focus: 25, short: 5, long: 15, cyclesBeforeLong: 4 };
  const [focusMins, setFocusMins] = useState(DEFAULTS.focus);
  const [shortBreak, setShortBreak] = useState(DEFAULTS.short);
  const [longBreak, setLongBreak] = useState(DEFAULTS.long);
  const [cyclesBeforeLong, setCyclesBeforeLong] = useState(DEFAULTS.cyclesBeforeLong);

  const [phase, setPhase] = useState("Focus"); // Focus | Short Break | Long Break
  const [remaining, setRemaining] = useState(focusMins * 60);
  const [running, setRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  const tickRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(tickRef.current);
          handlePhaseComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  useEffect(() => {
    if (phase === "Focus") setRemaining(focusMins * 60);
    if (phase === "Short Break") setRemaining(shortBreak * 60);
    if (phase === "Long Break") setRemaining(longBreak * 60);
  }, [phase, focusMins, shortBreak, longBreak]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handlePhaseComplete = () => {
    // Notification
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("ClearMind Focus", {
          body: `${phase} completed. Switching mode.`,
        });
      }
    } catch {}

    if (phase === "Focus") {
      const newCount = cycleCount + 1;
      setCycleCount(newCount);
      if (newCount % cyclesBeforeLong === 0) setPhase("Long Break");
      else setPhase("Short Break");
    } else {
      setPhase("Focus");
    }
    setRunning(false);
  };

  const resetTimer = () => {
    setRunning(false);
    if (phase === "Focus") setRemaining(focusMins * 60);
    if (phase === "Short Break") setRemaining(shortBreak * 60);
    if (phase === "Long Break") setRemaining(longBreak * 60);
  };

  const requestNotifications = async () => {
    try {
      if (!("Notification" in window)) return;
      await Notification.requestPermission();
    } catch {}
  };

  return (
    <div className="grid gap-5 md:grid-cols-[1fr_320px]">
      {/* Clock */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-lg border ${
              phase === "Focus"
                ? "text-purple-700 bg-purple-100 border-purple-200"
                : phase === "Short Break"
                ? "text-green-700 bg-green-100 border-green-200"
                : "text-blue-700 bg-blue-100 border-blue-200"
            }`}
          >
            {phase}
          </span>

          <button
            onClick={requestNotifications}
            className="text-xs font-semibold text-purple-700 hover:underline"
          >
            Enable notifications
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="text-6xl font-extrabold text-purple-800 tracking-tight">
            {formatTime(remaining)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cycles completed: {cycleCount}
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={() => setRunning((v) => !v)}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white ${
                running ? "bg-red-600 hover:bg-red-700" : "bg-purple-700 hover:bg-purple-800"
              }`}
            >
              {running ? <Pause size={16} /> : <Play size={16} />}
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <RotateCw size={16} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h4 className="text-sm font-bold text-gray-900">Intervals</h4>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <NumberField label="Focus (min)" value={focusMins} setValue={setFocusMins} min={5} max={90} />
          <NumberField label="Short Break (min)" value={shortBreak} setValue={setShortBreak} min={3} max={30} />
          <NumberField label="Long Break (min)" value={longBreak} setValue={setLongBreak} min={5} max={60} />
          <NumberField label="Cycles before long break" value={cyclesBeforeLong} setValue={setCyclesBeforeLong} min={2} max={8} />
        </div>
      </div>
    </div>
  );
}

/* =====================================================================================
   Number Field — small utility input
===================================================================================== */
function NumberField({ label, value, setValue, min = 0, max = 999 }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-700">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => setValue(parseInt(e.target.value || "0", 10))}
        className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none text-sm"
      />
    </label>
  );
}

/* =====================================================================================
   Weekly Planner — lightweight plan grid (frontend-only)
===================================================================================== */
function WeeklyPlanner() {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [blocks, setBlocks] = useState(() => {
    return JSON.parse(localStorage.getItem("cm_weekly_planner")) || {};
  });
  const [input, setInput] = useState("");
  const [activeDay, setActiveDay] = useState(DAYS[0]);

  useEffect(() => {
    localStorage.setItem("cm_weekly_planner", JSON.stringify(blocks));
  }, [blocks]);

  const addBlock = () => {
    const val = input.trim();
    if (!val) return;
    setBlocks((prev) => {
      const list = prev[activeDay] || [];
      return { ...prev, [activeDay]: [...list, val] };
    });
    setInput("");
  };

  const removeBlock = (day, idx) => {
    setBlocks((prev) => {
      const list = [...(prev[day] || [])];
      list.splice(idx, 1);
      return { ...prev, [day]: list };
    });
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`px-3 py-1 rounded-lg text-sm border ${
              activeDay === d
                ? "bg-purple-700 text-white border-purple-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-purple-50"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-4 grid sm:grid-cols-[1fr_auto] gap-3">
        <input
          type="text"
          placeholder={`Add a study block for ${activeDay} (e.g., CS101 problem set 18:00–19:30)`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none text-sm"
        />
        <button
          onClick={addBlock}
          className="px-4 py-2 rounded-xl bg-purple-700 text-white hover:bg-purple-800 text-sm"
        >
          Add
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {(blocks[activeDay] || []).length === 0 ? (
          <li className="text-xs text-gray-500">No blocks set for {activeDay} yet.</li>
        ) : (
          (blocks[activeDay] || []).map((b, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-2 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-sm text-gray-800">{b}</span>
              <button
                onClick={() => removeBlock(activeDay, i)}
                className="p-1 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove block"
              >
                <X size={16} />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/* =====================================================================================
   Goal Tracker — localStorage based
===================================================================================== */
function GoalTracker() {
  const [goals, setGoals] = useState(() => {
    return JSON.parse(localStorage.getItem("cm_goals")) || [];
  });
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Study");
  const [difficulty, setDifficulty] = useState("Medium"); // Low, Medium, High

  useEffect(() => {
    localStorage.setItem("cm_goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    const t = text.trim();
    if (!t) return;
    setGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: t,
        category,
        difficulty,
        done: false,
      },
    ]);
    setText("");
    setCategory("Study");
    setDifficulty("Medium");
  };

  const toggleGoal = (id) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));
  };

  const removeGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const difficultyStyles = {
    High: "bg-red-50 text-red-700 border-red-300",
    Medium: "bg-orange-50 text-orange-700 border-orange-300",
    Low: "bg-green-50 text-green-700 border-green-300",
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="grid md:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Define a clear, measurable target…"
          className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none text-sm md:col-span-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Study</option>
          <option>Assignment</option>
          <option>Exam</option>
          <option>Personal</option>
        </select>

        <select
          className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 text-sm"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={addGoal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 text-white hover:bg-purple-800 text-sm"
        >
          <Target size={16} />
          Add Goal
        </button>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {goals.length === 0 ? (
          <li className="text-xs text-gray-500">No goals yet. Add your first target above.</li>
        ) : (
          goals.map((g) => (
            <li
              key={g.id}
              className={`flex justify-between items-center px-4 py-3 rounded-xl border bg-white ${g.done ? "opacity-60 line-through" : ""}`}
            >
              <div className="space-y-1">
                <p className="text-sm text-gray-900 font-semibold">{g.text}</p>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700 border border-purple-200">
                    {g.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg border ${difficultyStyles[g.difficulty]}`}>
                    {g.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleGoal(g.id)}
                  className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-purple-50"
                >
                  <CheckCircle2 size={18} />
                </button>
                <button
                  onClick={() => removeGoal(g.id)}
                  className="p-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X size={18} />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/* =====================================================================================
   Study Tips — static content
===================================================================================== */
function StudyTips() {
  const TIPS = [
    {
      title: "Chunk work into 30–50 minute blocks",
      text: "Set a timer, silence notifications, and batch similar tasks.",
    },
    {
      title: "Prioritize by energy, not time",
      text: "Tackle cognitively heavy tasks when alert; leave admin for low-energy periods.",
    },
    {
      title: "Design for recall",
      text: "Practice retrieval (self-quizzing) and teach-back to solidify knowledge.",
    },
    {
      title: "Schedule review loops",
      text: "Short spaced reviews beat long cramming sessions every time.",
    },
  ];

  return (
    <div className="grid gap-3">
      {TIPS.map((t, i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-sm transition"
        >
          <div className="flex items-center gap-2 text-purple-700 text-sm font-semibold">
            <Info size={16} />
            {t.title}
          </div>
          <p className="text-sm text-gray-700 mt-1">{t.text}</p>
        </div>
      ))}
      <a
        href="#resources"
        className="inline-flex items-center gap-2 text-sm text-purple-700 font-semibold hover:underline mt-2"
      >
        Explore more tools <ExternalLink size={14} />
      </a>
    </div>
  );
}

/* =====================================================================================
   Sticky Utility Aside — shortcuts & status
===================================================================================== */
function StickyUtilityAside({ onMentor }) {
  return (
    <div className="sticky top-24">
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
        <h4 className="text-sm font-bold text-purple-900">Shortcuts</h4>
        <div className="mt-3 grid gap-2">
          <AsideLink href="/todo" icon={<ClipboardCheck size={16} />}>
            Study Tasks
          </AsideLink>
          <AsideAnchor href="#planner" icon={<CalendarDays size={16} />}>
            Weekly Planner
          </AsideAnchor>
          <AsideAnchor href="#focus" icon={<AlarmClock size={16} />}>
            Focus Timer
          </AsideAnchor>
          <AsideAnchor href="#goals" icon={<ListChecks size={16} />}>
            Goals
          </AsideAnchor>
          <AsideAnchor href="#resources" icon={<BookOpen size={16} />}>
            Resources
          </AsideAnchor>
        </div>

        <div className="h-px bg-purple-100 my-5" />

        <h4 className="text-sm font-bold text-purple-900">Need guidance?</h4>
        <p className="text-xs text-gray-600 mt-1">
          Request a senior mentor for study strategy help.
        </p>
        <button
          onClick={onMentor}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-700 text-white hover:bg-purple-800 text-sm"
        >
          <UserCheck size={16} /> Request Mentor
        </button>
      </div>

      <div className="mt-4 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-5 shadow-md">
        <h5 className="text-sm font-semibold">Pro tip</h5>
        <p className="text-xs text-purple-100 mt-1">
          Batch similar tasks and protect deep work windows in your calendar.
        </p>
      </div>
    </div>
  );
}

function AsideLink({ href, icon, children }) {
  return (
    <Link
      to={href}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-purple-100 hover:bg-purple-50"
    >
      {icon}
      {children}
    </Link>
  );
}

function AsideAnchor({ href, icon, children }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-purple-100 hover:bg-purple-50"
    >
      {icon}
      {children}
    </a>
  );
}

/* =====================================================================================
   Mentor Request Modal
===================================================================================== */
function MentorRequestModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setTimeout(() => dialogRef.current?.focus(), 50);
    }
  }, [open]);

  const submit = () => {
    if (!topic.trim()) return;
    // In production: send to backend
    setSubmitted(true);
    setTimeout(() => onClose?.(), 1400);
  };

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="mentor-title"
      className="fixed inset-0 z-50 grid place-items-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-purple-100 p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <UserCheck size={18} />
              </div>
              <div>
                <h3 id="mentor-title" className="text-lg font-bold text-purple-900">
                  Request a Senior Mentor
                </h3>
                <p className="text-xs text-gray-600">
                  Share a bit about your course or the concept you’re struggling with.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <label className="block">
                <span className="text-xs font-semibold text-gray-700">Your Name (optional)</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="You can skip this for anonymity"
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none text-sm"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-gray-700">Course/Subject (optional)</span>
                <input
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g., Data Structures / Organic Chemistry"
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none text-sm"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-gray-700">Topic / Problem</span>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What would you like help with?"
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none text-sm"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="px-4 py-2 rounded-xl bg-purple-700 text-white hover:bg-purple-800 text-sm"
              >
                Submit Request
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <p className="mt-3 text-sm text-gray-800 font-semibold">
              Mentor request sent
            </p>
            <p className="text-xs text-gray-500 mt-1">
              We’ll connect you to a senior mentor shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================================================
   Final CTA — Connect to Chat
===================================================================================== */
function FinalCTACard() {
  return (
    <section className="max-w-6xl mx-auto text-center mt-16">
      <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-10">
        <h3 className="text-2xl font-bold text-gray-900">
          Stuck or confused? Don’t spin alone.
        </h3>
        <p className="text-gray-600 mt-1">
          Connect with a peer mentor or chat anonymously for quick help.
        </p>

        <Link
          to="/chat"
          className="inline-flex items-center gap-2 mt-6 px-8 py-3 rounded-2xl bg-purple-700 text-white 
          hover:bg-purple-800 active:scale-95 font-semibold shadow-lg transition"
        >
          <MessageCircle size={20} />
          Talk Now
        </Link>
      </div>
    </section>
  );
}

/* =====================================================================================
   END
===================================================================================== */
