import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import CheckIn from "./pages/CheckIn.jsx";
import Chat from "./pages/Chat.jsx";
import SOS from "./pages/SOS.jsx";
import Peer from "./pages/Peer.jsx";                 // or PeerSupport.jsx if you named it that
import Counselor from "./pages/Counselor.jsx";       // counselor dashboard/page

import AcademicSupport from "./pages/AcademicSupport.jsx"; // academicsupport
import Todo from "./pages/Todo.jsx";                        // todo

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Redirect root to /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Core pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/peer" element={<Peer />} />
          <Route path="/counselor" element={<Counselor />} />

          {/* Utilities */}
          <Route path="/academic-support" element={<AcademicSupport />} />
          <Route path="/todo" element={<Todo />} />

          {/* Fallback: redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  );
}
