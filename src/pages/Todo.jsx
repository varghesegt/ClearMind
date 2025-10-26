import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Zap,
  CalendarDays,
  Clock,
  Filter,
  Search,
  Download,
  Upload,
  Edit3,
  X,
  RotateCw,
  SortDesc,
  Tag,
  Folder,
  ListChecks,
  CheckSquare,
  Square,
} from "lucide-react";

/**
 * ClearMind — Study Tasks (Advanced)
 * - LocalStorage key: "clearmind_tasks_v2"
 */

const LS_KEY = "clearmind_tasks_v2";

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };
const PRIORITY_STYLES = {
  High: "bg-red-50 text-red-700 border-red-300",
  Medium: "bg-orange-50 text-orange-700 border-orange-300",
  Low: "bg-green-50 text-green-700 border-green-300",
};

const CATEGORY_OPTIONS = ["Study", "Assignment", "Exam", "Personal", "Project"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

export default function Todo() {
  /** =========================
   * State
   * ========================= */
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Form state
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [energy, setEnergy] = useState(3);
  const [category, setCategory] = useState("Study");
  const [due, setDue] = useState("");
  const [duration, setDuration] = useState(60); // minutes
  const [notes, setNotes] = useState("");

  // Controls
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All"); // All | Today | Upcoming | Completed | High
  const [sortBy, setSortBy] = useState("Smart"); // Smart | Due date | Energy | Created
  const [selected, setSelected] = useState(new Set()); // ids for bulk actions
  const [editingId, setEditingId] = useState(null);

  // Pomodoro (compact)
  const [pomodoro, setPomodoro] = useState({
    running: false,
    seconds: 25 * 60,
    focusMins: 25,
    breakMins: 5,
    phase: "Focus", // Focus | Break
  });
  const tickRef = useRef(null);

  /** =========================
   * Effects
   * ========================= */
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!pomodoro.running) return;
    tickRef.current = setInterval(() => {
      setPomodoro((p) => {
        if (p.seconds <= 1) {
          const nextPhase = p.phase === "Focus" ? "Break" : "Focus";
          const seconds =
            nextPhase === "Focus" ? p.focusMins * 60 : p.breakMins * 60;
          return { ...p, phase: nextPhase, seconds, running: false };
        }
        return { ...p, seconds: p.seconds - 1 };
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [pomodoro.running]);

  /** =========================
   * Helpers
   * ========================= */
  const addTask = () => {
    if (!text.trim()) return;
    const payload = {
      id: Date.now(),
      text: text.trim(),
      priority,
      energy,
      category,
      due, // yyyy-mm-dd
      duration, // minutes estimate
      notes: notes.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, payload]);
    resetForm();
  };

  const resetForm = () => {
    setText("");
    setPriority("Medium");
    setEnergy(3);
    setCategory("Study");
    setDue("");
    setDuration(60);
    setNotes("");
  };

  const toggleDone = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      return next;
    });
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSelected((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  };

  const toggleSelected = (id) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkComplete = () => {
    setTasks((prev) => prev.map((t) => (selected.has(t.id) ? { ...t, done: true } : t)));
    setSelected(new Set());
  };
  const bulkDelete = () => {
    if (selected.size === 0) return;
    setTasks((prev) => prev.filter((t) => !selected.has(t.id)));
    setSelected(new Set());
  };
  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.done));
    setSelected(new Set());
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "clearmind_tasks.json";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          // ensure shape
          const normalized = data
            .filter((d) => d && d.text)
            .map((d) => ({
              id: d.id || Date.now() + Math.random(),
              text: String(d.text),
              priority: PRIORITY_OPTIONS.includes(d.priority) ? d.priority : "Medium",
              energy: Number(d.energy) || 3,
              category: CATEGORY_OPTIONS.includes(d.category)
                ? d.category
                : "Study",
              due: d.due || "",
              duration: Number(d.duration) || 60,
              notes: d.notes ? String(d.notes) : "",
              done: !!d.done,
              createdAt: d.createdAt || new Date().toISOString(),
            }));
          setTasks(normalized);
        }
      } catch {}
    };
    reader.readAsText(file);
  };

  const nowYMD = () => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  };

  const isToday = (dateStr) => dateStr && dateStr === nowYMD();

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = tasks.filter((t) => {
      const matchesQuery =
        !q ||
        t.text.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.notes.toLowerCase().includes(q);
      if (!matchesQuery) return false;
      if (filter === "All") return true;
      if (filter === "Today") return isToday(t.due);
      if (filter === "Upcoming") return !!t.due && t.due > nowYMD() && !t.done;
      if (filter === "Completed") return t.done;
      if (filter === "High") return t.priority === "High" && !t.done;
      return true;
    });

    // Sort
    if (sortBy === "Smart") {
      arr.sort((a, b) => {
        if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        }
        if ((a.due || "") !== (b.due || "")) {
          // undefined last
          if (!a.due) return 1;
          if (!b.due) return -1;
          return a.due.localeCompare(b.due);
        }
        if (a.energy !== b.energy) return a.energy - b.energy; // low energy first
        return (a.createdAt || "").localeCompare(b.createdAt || "");
      });
    } else if (sortBy === "Due date") {
      arr.sort((a, b) => {
        if (!a.due) return 1;
        if (!b.due) return -1;
        return a.due.localeCompare(b.due);
      });
    } else if (sortBy === "Energy") {
      arr.sort((a, b) => a.energy - b.energy);
    } else if (sortBy === "Created") {
      arr.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
    }

    return arr;
  }, [tasks, filter, sortBy, query]);

  const completedCount = tasks.filter((t) => t.done).length;
  const openCount = tasks.length - completedCount;
  const todayCount = tasks.filter((t) => isToday(t.due) && !t.done).length;
  const highCount = tasks.filter((t) => t.priority === "High" && !t.done).length;
  const progressPct = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  /** =========================
   * UI
   * ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white px-6 pt-24 pb-24">
      {/* Header */}
      <header className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-purple-800 tracking-tight">
          Study Task Planner
        </h1>
        <p className="text-gray-600 mt-2">
          Plan by priority, energy, and time build momentum without burnout.
        </p>
      </header>

      {/* Stats */}
      <section className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <StatsCard icon={<ListChecks className="text-purple-700" />} label="Open" value={openCount} />
        <StatsCard icon={<CheckCircle2 className="text-green-600" />} label="Completed" value={completedCount} />
        <StatsCard icon={<CalendarDays className="text-blue-600" />} label="Due Today" value={todayCount} />
        <StatsCard icon={<Zap className="text-orange-500" />} label="High Priority" value={highCount} />
      </section>

      {/* Progress */}
      <section className="max-w-6xl mx-auto mt-4">
        <ProgressBar percent={progressPct} />
      </section>

      {/* Input Card */}
      <section className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
        <div className="grid md:grid-cols-2 gap-4">
          <TextField
            label="Task"
            placeholder="What do you want to accomplish?"
            value={text}
            onChange={setText}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <SelectField
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={PRIORITY_OPTIONS}
              icon={<Tag size={14} />}
            />
            <NumberSlider
              label={`Energy ${energy}/5`}
              min={1}
              max={5}
              value={energy}
              onChange={setEnergy}
              icon={<Zap size={14} />}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <SelectField
              label="Category"
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
              icon={<Folder size={14} />}
            />
            <DateField
              label="Due date"
              value={due}
              onChange={setDue}
              icon={<CalendarDays size={14} />}
            />
            <NumberField
              label="Duration (min)"
              value={duration}
              onChange={setDuration}
              min={15}
              max={240}
              step={5}
              icon={<Clock size={14} />}
            />
          </div>

          <TextAreaField
            label="Notes (optional)"
            placeholder="Add context, links, or steps…"
            value={notes}
            onChange={setNotes}
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={addTask}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-700 text-white hover:bg-purple-800 active:scale-95 transition"
          >
            <Plus size={18} />
            Add Task
          </button>

          <div className="flex-1" />

          <ImportButton onImport={importJson} />
          <button
            onClick={exportJson}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
          >
            <Download size={16} />
            Export JSON
          </button>
        </div>
      </section>

      {/* Controls: search / filters / sort / bulk */}
      <section className="max-w-6xl mx-auto mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-purple-100 px-3 py-2">
          <Search size={18} className="text-purple-700" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by text, notes or category…"
            className="flex-1 outline-none text-sm"
          />
        </div>

        <div className="flex gap-2">
          <FilterTabs value={filter} onChange={setFilter} />
          <SortMenu value={sortBy} onChange={setSortBy} />
        </div>
      </section>

      {/* Bulk actions */}
      <section className="max-w-6xl mx-auto mt-4 flex items-center gap-2">
        <button
          onClick={bulkComplete}
          disabled={selected.size === 0}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-sm"
        >
          <CheckSquare size={16} />
          Mark Completed
        </button>
        <button
          onClick={bulkDelete}
          disabled={selected.size === 0}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-600 disabled:opacity-40 hover:bg-red-50 text-sm"
        >
          <Trash2 size={16} />
          Delete Selected
        </button>
        <button
          onClick={clearCompleted}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
        >
          <RotateCw size={16} />
          Clear Completed
        </button>
        <span className="ml-auto text-xs text-gray-500">
          {selected.size} selected
        </span>
      </section>

      {/* Task list */}
      <section className="max-w-6xl mx-auto mt-6 space-y-3">
        {filteredAndSorted.length === 0 ? (
          <EmptyState />
        ) : (
          filteredAndSorted.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              selected={selected.has(task.id)}
              onToggleSelect={() => toggleSelected(task.id)}
              onToggleDone={() => toggleDone(task.id)}
              onDelete={() => deleteTask(task.id)}
              onEdit={() => setEditingId(task.id)}
            />
          ))
        )}
      </section>

      {/* Inline editor (modal-ish inline) */}
      {editingId && (
        <TaskEditor
          task={tasks.find((t) => t.id === editingId)}
          onClose={() => setEditingId(null)}
          onSave={(patched) => {
            setTasks((prev) => prev.map((t) => (t.id === patched.id ? patched : t)));
            setEditingId(null);
          }}
        />
      )}

      {/* Pomodoro footer widget */}
      <section className="max-w-6xl mx-auto mt-10">
        <PomodoroBar pomodoro={pomodoro} setPomodoro={setPomodoro} />
      </section>
    </div>
  );
}

/* =========================
 * Reusable UI Components
 * ========================= */

function StatsCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-xl font-bold text-purple-800">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}

function ProgressBar({ percent }) {
  return (
    <div className="bg-white border border-purple-100 rounded-2xl p-4">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>Overall progress</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 bg-purple-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-600 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function TextField({ label, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function TextAreaField({ label, placeholder, value, onChange }) {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <textarea
        rows={3}
        placeholder={placeholder}
        className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, icon }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <select
        className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange, min = 0, max = 999, step = 1, icon }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value || "0", 10))}
        className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
      />
    </label>
  );
}

function NumberSlider({ label, value, onChange, min = 1, max = 5, icon }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full mt-3 accent-purple-700 cursor-pointer"
      />
    </label>
  );
}

function DateField({ label, value, onChange, icon }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
      />
    </label>
  );
}

function FilterTabs({ value, onChange }) {
  const tabs = ["All", "Today", "Upcoming", "Completed", "High"];
  return (
    <div className="inline-flex gap-2 bg-white rounded-xl border border-purple-100 p-1">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-3 py-2 rounded-lg text-sm transition ${
            value === t ? "bg-purple-700 text-white" : "hover:bg-purple-50"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function SortMenu({ value, onChange }) {
  const options = ["Smart", "Due date", "Energy", "Created"];
  return (
    <div className="inline-flex items-center gap-2 bg-white rounded-xl border border-purple-100 px-3 py-2">
      <SortDesc size={16} className="text-purple-700" />
      <select
        className="outline-none text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border border-purple-100 rounded-2xl p-10 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
        <ListChecks />
      </div>
      <h3 className="mt-3 text-lg font-bold text-purple-900">No tasks yet</h3>
      <p className="text-sm text-gray-600 mt-1">
        Add your first task above. Start with one small, clear action.
      </p>
    </div>
  );
}

function TaskRow({ task, selected, onToggleSelect, onToggleDone, onDelete, onEdit }) {
  return (
    <div
      className={`bg-white p-4 rounded-2xl border transition flex items-center gap-4 ${
        task.done ? "opacity-60 line-through" : "border-gray-200"
      }`}
    >
      <button
        onClick={onToggleSelect}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        aria-label={selected ? "Unselect" : "Select"}
      >
        {selected ? <CheckSquare size={18} /> : <Square size={18} />}
      </button>

      <button
        onClick={onToggleDone}
        className={`p-2 rounded-lg border ${
          task.done
            ? "border-green-300 text-green-700 hover:bg-green-50"
            : "border-gray-300 hover:bg-purple-50 text-purple-700"
        }`}
        aria-label={task.done ? "Mark as not done" : "Mark as done"}
      >
        {task.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      </button>

      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{task.text}</h4>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded-lg font-semibold border ${PRIORITY_STYLES[task.priority]}`}>
            {task.priority}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700 border border-purple-200">
            Energy {task.energy}/5
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            {task.category}
          </span>
          {task.due && (
            <span className="px-2 py-0.5 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 flex items-center gap-1">
              <CalendarDays size={12} />
              {task.due}
            </span>
          )}
          {task.duration ? (
            <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
              <Clock size={12} />
              {task.duration} min
            </span>
          ) : null}
          {task.notes && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 truncate max-w-[220px]">
              {task.notes}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
          aria-label="Edit"
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={onDelete}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
          aria-label="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function TaskEditor({ task, onClose, onSave }) {
  const [text, setText] = useState(task.text);
  const [priority, setPriority] = useState(task.priority);
  const [energy, setEnergy] = useState(task.energy);
  const [category, setCategory] = useState(task.category);
  const [due, setDue] = useState(task.due || "");
  const [duration, setDuration] = useState(task.duration || 60);
  const [notes, setNotes] = useState(task.notes || "");

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-purple-100 p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-purple-900">Edit Task</h3>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <TextField label="Task" value={text} onChange={setText} />
          <div className="grid sm:grid-cols-2 gap-4">
            <SelectField
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={PRIORITY_OPTIONS}
              icon={<Tag size={14} />}
            />
            <NumberSlider
              label={`Energy ${energy}/5`}
              value={energy}
              onChange={setEnergy}
              min={1}
              max={5}
              icon={<Zap size={14} />}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <SelectField
              label="Category"
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
              icon={<Folder size={14} />}
            />
            <DateField
              label="Due date"
              value={due}
              onChange={setDue}
              icon={<CalendarDays size={14} />}
            />
            <NumberField
              label="Duration (min)"
              value={duration}
              onChange={setDuration}
              min={15}
              max={240}
              step={5}
              icon={<Clock size={14} />}
            />
          </div>
          <TextAreaField
            label="Notes"
            value={notes}
            onChange={setNotes}
            placeholder="Extra details, links or steps…"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                ...task,
                text: text.trim(),
                priority,
                energy,
                category,
                due,
                duration,
                notes: notes.trim(),
              })
            }
            className="px-4 py-2 rounded-xl bg-purple-700 text-white hover:bg-purple-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
 * Import Button
 * ========================= */
function ImportButton({ onImport }) {
  const ref = useRef(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => onImport(e.target.files?.[0])}
      />
      <button
        onClick={() => ref.current?.click()}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
      >
        <Upload size={16} />
        Import JSON
      </button>
    </>
  );
}

/* =========================
 * Pomodoro Bar (compact)
 * ========================= */
function PomodoroBar({ pomodoro, setPomodoro }) {
  const format = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(Math.floor(sec % 60)).padStart(2, "0");
    return `${m}:${s}`;
  };
  const setFocus = (v) =>
    setPomodoro((p) => ({
      ...p,
      focusMins: v,
      seconds: p.phase === "Focus" ? v * 60 : p.seconds,
    }));
  const setBreak = (v) =>
    setPomodoro((p) => ({
      ...p,
      breakMins: v,
      seconds: p.phase === "Break" ? v * 60 : p.seconds,
    }));

  return (
    <div className="bg-white border border-purple-100 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <Clock size={14} />
        Focus Assistant
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-lg border ${
              pomodoro.phase === "Focus"
                ? "text-purple-700 bg-purple-100 border-purple-200"
                : "text-green-700 bg-green-100 border-green-200"
            }`}
          >
            {pomodoro.phase}
          </span>
          <div className="text-3xl font-extrabold text-purple-800">
            {format(pomodoro.seconds)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPomodoro((p) => ({ ...p, running: !p.running }))}
            className={`px-4 py-2 rounded-xl text-white ${
              pomodoro.running ? "bg-red-600 hover:bg-red-700" : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {pomodoro.running ? "Pause" : "Start"}
          </button>
          <button
            onClick={() =>
              setPomodoro((p) => ({
                ...p,
                running: false,
                seconds: p.phase === "Focus" ? p.focusMins * 60 : p.breakMins * 60,
              }))
            }
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 ml-auto">
          <MiniNumber
            label="Focus (min)"
            value={pomodoro.focusMins}
            setValue={setFocus}
            min={5}
            max={120}
          />
          <MiniNumber
            label="Break (min)"
            value={pomodoro.breakMins}
            setValue={setBreak}
            min={3}
            max={60}
          />
          <button
            onClick={() =>
              setPomodoro((p) => ({
                ...p,
                phase: "Focus",
                seconds: p.focusMins * 60,
                running: false,
              }))
            }
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
          >
            Focus
          </button>
          <button
            onClick={() =>
              setPomodoro((p) => ({
                ...p,
                phase: "Break",
                seconds: p.breakMins * 60,
                running: false,
              }))
            }
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
          >
            Break
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniNumber({ label, value, setValue, min, max }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-gray-700">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value || "0", 10))}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none text-sm"
      />
    </label>
  );
}
