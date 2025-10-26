import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  MessageCircle,
  Activity,
  CheckCircle2,
  ArrowUp,
  AlertTriangle,
  Shield,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  BadgeInfo,
  CheckSquare,
  Square,
  Download,
  ClipboardList,
  X,
  Clock4,
  UserCircle2,
} from "lucide-react";

/** LocalStorage key */
const LS_KEY = "clearmind_counselor_v1";

/** Risk helpers */
const RISK_ORDER = { High: 0, Medium: 1, Low: 2 };
const RISK_COLORS = {
  High: "text-red-700 bg-red-50 border-red-200",
  Medium: "text-orange-700 bg-orange-50 border-orange-200",
  Low: "text-green-700 bg-green-50 border-green-200",
};
const RISK_ICONS = {
  High: <ShieldAlert size={14} />,
  Medium: <AlertTriangle size={14} />,
  Low: <Shield size={14} />,
};

export default function Counselor() {
  /** Seed + Persistence */
  const [rows, setRows] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(LS_KEY)) || [
          {
            id: "User-002",
            mood: "Awful",
            stress: 5,
            risk: "High",
            lastCheckIn: "2025-10-26T10:12:00Z",
            newMessages: 5,
            notes: "Reported panic symptoms during morning check-in.",
            timeline: [
              { t: "2025-10-26T10:12:00Z", event: "Check-in: mood Awful, stress 5" },
              { t: "2025-10-26T10:20:00Z", event: "Peer chat matched" },
            ],
          },
          {
            id: "User-001",
            mood: "Low",
            stress: 4,
            risk: "Medium",
            lastCheckIn: "2025-10-26T08:45:00Z",
            newMessages: 2,
            notes: "Academic load high; sleeping 4–5 hours.",
            timeline: [
              { t: "2025-10-26T08:45:00Z", event: "Check-in: mood Low, stress 4" },
              { t: "2025-10-26T09:30:00Z", event: "Counselor note added" },
            ],
          },
          {
            id: "User-003",
            mood: "Okay",
            stress: 2,
            risk: "Low",
            lastCheckIn: "2025-10-25T17:10:00Z",
            newMessages: 0,
            notes: "Improved focus and better sleep reported.",
            timeline: [{ t: "2025-10-25T17:10:00Z", event: "Check-in: mood Okay, stress 2" }],
          },
        ]
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(rows));
  }, [rows]);

  /** Table controls */
  const [riskFilter, setRiskFilter] = useState("All"); // All | High | Medium | Low
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "risk", dir: "asc" }); // 'risk'|'stress'|'last'|'msg'
  const [selected, setSelected] = useState(new Set());
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const riskOk = riskFilter === "All" || r.risk === riskFilter;
      const qOk =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.mood.toLowerCase().includes(q) ||
        String(r.stress).includes(q) ||
        r.notes?.toLowerCase().includes(q);
      return riskOk && qOk;
    });
  }, [rows, riskFilter, query]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    const { key, dir } = sort;
    const mul = dir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      if (key === "risk") return (RISK_ORDER[a.risk] - RISK_ORDER[b.risk]) * mul;
      if (key === "stress") return (a.stress - b.stress) * mul;
      if (key === "last") return (Date.parse(a.lastCheckIn) - Date.parse(b.lastCheckIn)) * mul;
      if (key === "msg") return (a.newMessages - b.newMessages) * mul;
      return 0;
    });
    return copy;
  }, [filtered, sort]);

  /** Actions */
  const toggleSelect = (id) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = () => setSelected(new Set(sorted.map((r) => r.id)));
  const clearSelection = () => setSelected(new Set());

  const markReviewed = (id) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, newMessages: 0 } : r)));
  };

  const bulkMarkReviewed = () => {
    if (selected.size === 0) return;
    setRows((prev) => prev.map((r) => (selected.has(r.id) ? { ...r, newMessages: 0 } : r)));
    clearSelection();
  };

  const escalateRisk = (id) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    const ok = window.confirm(
      `Escalate ${row.id} (${row.risk}) to emergency response?\nThis will notify on-call staff.`
    );
    if (!ok) return;
    // TODO: integrate backend webhook
    alert("Escalated to emergency support team.");
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(sorted, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "clearmind_counselor_export.json";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = ["id", "mood", "stress", "risk", "lastCheckIn", "newMessages"];
    const lines = [headers.join(",")].concat(
      sorted.map((r) =>
        [
          r.id,
          r.mood,
          r.stress,
          r.risk,
          new Date(r.lastCheckIn).toISOString(),
          r.newMessages,
        ]
          .map((x) => `"${String(x).replace(/"/g, '""')}"`)
          .join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "clearmind_counselor_export.csv";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  /** Derived stats */
  const highCount = rows.filter((r) => r.risk === "High").length;
  const medCount = rows.filter((r) => r.risk === "Medium").length;
  const lowCount = rows.filter((r) => r.risk === "Low").length;
  const unreadTotal = rows.reduce((n, r) => n + (r.newMessages || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24 px-6 pb-20 relative">
      {/* Header */}
      <section className="max-w-7xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white border border-purple-200 shadow-sm">
          <Activity className="text-purple-700" size={26} />
          <h1 className="text-3xl md:text-4xl font-extrabold text-purple-800 tracking-tight">
            Counselor Dashboard
          </h1>
        </div>
        <p className="text-gray-700 max-w-2xl mx-auto mt-3 text-sm md:text-base">
          Real-time emotional insights to safeguard student mental well-being.
        </p>
      </section>

      {/* Top Stats */}
      <section className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="High Risk" value={highCount} tone="red" />
        <StatCard label="Medium Risk" value={medCount} tone="orange" />
        <StatCard label="Low Risk" value={lowCount} tone="green" />
        <StatCard label="Unread Msgs" value={unreadTotal} tone="purple" />
      </section>

      {/* Controls */}
      <section className="max-w-7xl mx-auto mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-purple-100 px-3 py-2">
          <Search size={18} className="text-purple-700" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, mood, notes…"
            className="flex-1 outline-none text-sm"
          />
        </div>

        <div className="inline-flex items-center gap-2 bg-white rounded-xl border border-purple-100 px-3 py-2">
          <Filter size={16} className="text-purple-700" />
          <select
            className="outline-none text-sm"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            aria-label="Risk filter"
          >
            {["All", "High", "Medium", "Low"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="inline-flex items-center gap-2 bg-white rounded-xl border border-purple-100 px-3 py-2">
          <span className="text-sm text-gray-700">Sort</span>
          <SortButton
            active={sort.key === "risk"}
            label="Risk"
            dir={sort.key === "risk" ? sort.dir : undefined}
            onClick={() => toggleSort(setSort, "risk")}
          />
          <SortButton
            active={sort.key === "stress"}
            label="Stress"
            dir={sort.key === "stress" ? sort.dir : undefined}
            onClick={() => toggleSort(setSort, "stress")}
          />
          <SortButton
            active={sort.key === "last"}
            label="Last Check-in"
            dir={sort.key === "last" ? sort.dir : undefined}
            onClick={() => toggleSort(setSort, "last")}
          />
          <SortButton
            active={sort.key === "msg"}
            label="Messages"
            dir={sort.key === "msg" ? sort.dir : undefined}
            onClick={() => toggleSort(setSort, "msg")}
          />
        </div>
      </section>

      {/* Bulk bar */}
      <section className="max-w-7xl mx-auto mb-4 flex items-center gap-2">
        <button
          onClick={selected.size === sorted.length ? clearSelection : selectAll}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
        >
          {selected.size === sorted.length ? <Square size={16} /> : <CheckSquare size={16} />}
          {selected.size === sorted.length ? "Clear selection" : "Select all"}
        </button>

        <button
          onClick={bulkMarkReviewed}
          disabled={selected.size === 0}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 text-sm"
        >
          <CheckCircle2 size={16} />
          Mark reviewed
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={exportJSON}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
            title="Export JSON"
          >
            <Download size={16} />
            JSON
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
            title="Export CSV"
          >
            <Download size={16} />
            CSV
          </button>
        </div>
      </section>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white/85 backdrop-blur rounded-2xl shadow-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Select</th>
              <th className="py-3 px-4 text-left">Anonymous ID</th>
              <th className="py-3 px-4">Mood</th>
              <th className="py-3 px-4">Stress</th>
              <th className="py-3 px-4">Risk</th>
              <th className="py-3 px-4">Last Check-In</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((u) => (
              <tr key={u.id} className="border-b border-gray-200 hover:bg-purple-50 transition">
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleSelect(u.id)}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    aria-label={selected.has(u.id) ? "Unselect row" : "Select row"}
                  >
                    {selected.has(u.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                </td>

                <td className="px-4 py-3 font-semibold text-gray-900">{u.id}</td>
                <td className="px-4 py-3 text-gray-700">{u.mood}</td>
                <td className="px-4 py-3 text-center font-bold text-purple-800">{u.stress}/5</td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg border ${RISK_COLORS[u.risk]}`}
                  >
                    {RISK_ICONS[u.risk]}
                    {u.risk}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-600">
                  <LastSeen iso={u.lastCheckIn} />
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setDetail(u)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 transition flex items-center gap-1"
                      title="Details"
                    >
                      <BadgeInfo size={14} />
                      Details
                    </button>

                    <Link
                      to="/chat"
                      className={`px-3 py-1 rounded-lg font-semibold text-xs transition flex items-center gap-1 ${
                        u.newMessages > 0
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-purple-700 text-white hover:bg-purple-800"
                      }`}
                      title="Chat & Review"
                    >
                      <MessageCircle size={14} />
                      {u.newMessages > 0 ? `${u.newMessages}` : "Open"}
                    </Link>

                    <button
                      onClick={() => markReviewed(u.id)}
                      className="px-3 py-1 border border-purple-600 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-50 transition flex items-center gap-1"
                      title="Mark Reviewed"
                    >
                      <CheckCircle2 size={14} />
                      Reviewed
                    </button>

                    {u.risk !== "Low" && (
                      <button
                        onClick={() => escalateRisk(u.id)}
                        className="px-2 py-1 border border-red-600 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition flex items-center gap-1"
                        title="Escalate to emergency response"
                      >
                        <ArrowUp size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-500">
                  No students match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="max-w-7xl mx-auto text-center mt-8 text-xs text-gray-500">
        ClearMind protects student anonymity. No personal identities stored.
      </div>

      {detail && (
        <DetailDrawer
          row={detail}
          onClose={() => setDetail(null)}
          onUpdate={(patch) => {
            setRows((prev) => prev.map((r) => (r.id === patch.id ? patch : r)));
            setDetail(patch);
          }}
          onMarkReviewed={() => markReviewed(detail.id)}
          onEscalate={() => escalateRisk(detail.id)}
        />
      )}
    </div>
  );
}

/* ---------- Small components ---------- */

function StatCard({ label, value, tone = "purple" }) {
  const toneMap = {
    red: "text-red-700 bg-red-50 border-red-200",
    orange: "text-orange-700 bg-orange-50 border-orange-200",
    green: "text-green-700 bg-green-50 border-green-200",
    purple: "text-purple-700 bg-purple-50 border-purple-200",
  };
  return (
    <div className={`bg-white rounded-2xl border ${toneMap[tone]} shadow-sm p-4 text-center`}>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}

function SortButton({ active, label, dir, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-lg text-sm flex items-center gap-1 ${
        active ? "bg-purple-100 text-purple-900" : "hover:bg-purple-50"
      }`}
    >
      {label}
      {active ? dir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} /> : <ChevronDown size={14} className="opacity-40" />}
    </button>
  );
}

function LastSeen({ iso }) {
  if (!iso) return <span className="text-gray-500">—</span>;
  const d = new Date(iso);
  const now = new Date();
  const diffMin = Math.max(0, Math.round((now - d) / 60000));
  let label = d.toLocaleString();
  if (diffMin < 1) label = "just now";
  else if (diffMin < 60) label = `${diffMin} min ago`;
  else if (diffMin < 60 * 24) label = `${Math.round(diffMin / 60)} h ago`;
  return (
    <span className="inline-flex items-center gap-1">
      <Clock4 size={14} className="text-gray-400" />
      {label}
    </span>
  );
}

function toggleSort(setSort, key) {
  setSort((s) => {
    if (s.key !== key) return { key, dir: "asc" };
    return { key, dir: s.dir === "asc" ? "desc" : "asc" };
  });
}

/* ---------- Detail Drawer ---------- */

function DetailDrawer({ row, onClose, onUpdate, onMarkReviewed, onEscalate }) {
  const [notes, setNotes] = useState(row.notes || "");
  const [risk, setRisk] = useState(row.risk);
  const [stress, setStress] = useState(row.stress);

  useEffect(() => {
    setNotes(row.notes || "");
    setRisk(row.risk);
    setStress(row.stress);
  }, [row]);

  const save = () => {
    onUpdate({
      ...row,
      notes: notes.trim(),
      risk,
      stress: Number(stress) || row.stress,
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-purple-100 p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle2 className="text-purple-700" />
            <h3 className="font-bold text-gray-900">{row.id}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Mood: <span className="font-semibold text-gray-800">{row.mood}</span>
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="block text-gray-700 font-semibold mb-1">Risk</span>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
            >
              {["High", "Medium", "Low"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="block text-gray-700 font-semibold mb-1">Stress (1–5)</span>
            <input
              type="number"
              min={1}
              max={5}
              value={stress}
              onChange={(e) => setStress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </label>
        </div>

        <label className="text-sm mt-4">
          <span className="block text-gray-700 font-semibold mb-1">Case Notes</span>
          <textarea
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write brief, objective notes (no PII)."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </label>

        <div className="mt-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <ClipboardList size={16} className="text-purple-700" />
            Timeline
          </div>
          <div className="mt-2 max-h-48 overflow-auto pr-1 space-y-2">
            {(row.timeline || []).map((e, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700">
                <span className="text-gray-500 mr-2">{new Date(e.t).toLocaleString()}</span>
                {e.event}
              </div>
            ))}
            {(!row.timeline || row.timeline.length === 0) && (
              <div className="text-xs text-gray-500">No events recorded.</div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link
              to="/chat"
              className={`px-4 py-2 rounded-xl font-semibold text-xs transition flex items-center gap-2 ${
                row.newMessages > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-purple-700 text-white hover:bg-purple-800"
              }`}
            >
              <MessageCircle size={16} />
              Open Chat {row.newMessages > 0 ? `(${row.newMessages})` : ""}
            </Link>

            <button
              onClick={onMarkReviewed}
              className="px-4 py-2 rounded-xl border border-purple-600 text-purple-700 text-xs font-semibold hover:bg-purple-50 transition flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              Mark Reviewed
            </button>

            {row.risk !== "Low" && (
              <button
                onClick={onEscalate}
                className="px-3 py-2 rounded-xl border border-red-600 text-red-700 text-xs font-semibold hover:bg-red-50 transition flex items-center gap-2"
                title="Escalate to emergency response"
              >
                <ArrowUp size={16} />
                Escalate
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 rounded-xl bg-purple-700 text-white hover:bg-purple-800 text-sm">
              Save Changes
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-sm">
              Close
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
