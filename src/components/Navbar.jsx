import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  HeartPulse,
  MessageCircle,
  Siren,
  UsersRound,
  GraduationCap,
  UserCircle,
  Download,
} from "lucide-react";

const links = [
  { to: "/home", label: "Home", icon: <Home size={18} /> },
  { to: "/check-in", label: "Check-In", icon: <HeartPulse size={18} /> },
  { to: "/chat", label: "Chat", icon: <MessageCircle size={18} /> },
  { to: "/sos", label: "SOS", icon: <Siren size={18} className="text-red-600" /> },
  { to: "/peer", label: "Peer Support", icon: <UsersRound size={18} /> },
  { to: "/academic-support", label: "Academic", icon: <GraduationCap size={18} /> }, // ✅ Added Here
  { to: "/counselor", label: "Counselor", icon: <UserCircle size={18} /> },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      <header className="bg-white/85 backdrop-blur-xl shadow-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">

          {/* ✅ Logo + Brand */}
          <NavLink
            to="/home"
            className="flex items-center gap-2 text-purple-800 font-extrabold text-2xl hover:scale-105 transition-transform"
          >
            <svg width="34" height="34" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#6B46C1" strokeWidth="9" />
              <path d="M30,45 C48,15 52,85 70,55" fill="none" stroke="#6B46C1" strokeWidth="9" />
            </svg>
            ClearMind
          </NavLink>

          {/* ✅ Desktop Navigation */}
          <nav className="hidden md:flex gap-3 font-medium text-gray-700">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-purple-100 text-purple-800 font-bold shadow"
                      : "hover:bg-purple-50 hover:shadow-sm"
                  }`
                }
              >
                {l.icon}
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* ✅ Mobile Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden bg-purple-50 p-2 rounded-lg border border-purple-300 active:scale-95 text-purple-700"
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* ✅ Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 border-t border-purple-200 shadow-inner" : "max-h-0"
          }`}
        >
          <ul className="grid gap-2 p-5 font-medium text-gray-800">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      isActive
                        ? "bg-purple-100 text-purple-800 font-semibold"
                        : "hover:bg-purple-50"
                    }`
                  }
                >
                  {l.icon}
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ✅ Overlay Background When Menu Active */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
        />
      )}
    </>
  );
}
