import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Clock,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

export default function Peer() {
  const [queue, setQueue] = useState([
    {
      id: "User-A91",
      issue: "Feeling anxious about exams",
      time: Date.now() - 2 * 60 * 1000,
      status: "Waiting",
    },
    {
      id: "User-J54",
      issue: "Loneliness and stress",
      time: Date.now() - 8 * 60 * 1000,
      status: "Waiting",
    },
    {
      id: "User-T09",
      issue: "Homesickness & low mood",
      time: Date.now() - 12 * 60 * 1000,
      status: "In Support",
    },
  ]);

  const getTimeAgo = (timestamp) => {
    const diffMins = Math.floor((Date.now() - timestamp) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    return `${diffMins} min ago`;
  };

  const acceptSupport = (userId) => {
    setQueue((prev) =>
      prev.map((req) =>
        req.id === userId ? { ...req, status: "In Support" } : req
      )
    );
  };

  const badgeStyle = {
    Waiting:
      "bg-yellow-100 text-yellow-700 border-yellow-300 flex items-center gap-1",
    "In Support":
      "bg-green-100 text-green-700 border-green-300 flex items-center gap-1",
  };

  const indicatorDot = {
    Waiting: "bg-yellow-500 animate-pulse",
    "In Support": "bg-green-500 animate-pulse",
  };

  const sortedQueue = [...queue].sort((a, b) =>
    a.status === "In Support" ? -1 : 1
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24 pb-20 px-6">
      
      {/* HEADER */}
      <section className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-white rounded-2xl border shadow-sm">
          <Users className="text-purple-700" size={28} />
          <h1 className="text-3xl md:text-4xl font-extrabold text-purple-800 tracking-tight">
            Peer Support Dashboard
          </h1>
        </div>

        <p className="text-gray-700 max-w-xl mx-auto mt-4 text-sm md:text-base">
          Be the reason someone feels seen, heard & valued today.
          <br />
          Offer compassionate help to peers who need emotional support.
        </p>

        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={14} /> Support Active:{" "}
            {queue.filter((q) => q.status === "In Support").length}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="text-purple-700" size={14} /> Waiting:{" "}
            {queue.filter((q) => q.status === "Waiting").length}
          </span>
        </div>
      </section>

      {/* QUEUE LIST */}
      <section className="max-w-6xl mx-auto mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sortedQueue.map((request) => (
          <div
            key={request.id}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-purple-100 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
          >
            {/* STATUS + ID + INDICATOR */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-purple-900">{request.id}</h3>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-lg border ${badgeStyle[request.status]}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${indicatorDot[request.status]}`}
                ></span>
                {request.status}
              </span>
            </div>

            <p className="text-gray-700 mt-3 text-sm">{request.issue}</p>

            <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
              <Clock size={12} /> {getTimeAgo(request.time)}
            </div>

            {/* ACTIONS */}
            {request.status === "Waiting" && (
              <button
                onClick={() => acceptSupport(request.id)}
                className="w-full mt-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
              >
                <UserPlus size={16} />
                Accept & Support
              </button>
            )}

            {request.status === "In Support" && (
              <Link
                to="/chat"
                className="w-full inline-block mt-5 text-center py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                Continue Chat
              </Link>
            )}
          </div>
        ))}
      </section>

      {/* FOOTER NOTE */}
      <div className="max-w-5xl mx-auto text-center mt-10 text-xs text-gray-600">
        All support interactions remain private & anonymous ✦
      </div>
    </div>
  );
}
