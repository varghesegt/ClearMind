import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Siren,
  ShieldAlert,
  Shield,
  Phone,
  Mail,
  MapPin,
  LocateFixed,
  Share2,
  Copy,
  CheckCircle2,
  X,
  Loader2,
  Clock,
  Info,
  Bell,
} from "lucide-react";

/**
 * SOS.jsx — ClearMind (Frontend-only, advanced)
 * - Consent-first SOS with severity presets
 * - 5s cancelable countdown (aria-live) before triggering
 * - Geolocation with refresh + Google Maps link
 * - Web Share / Clipboard fallback (resilient)
 * - Quick-call buttons: 112 (India), campus helpline, counselor
 * - Notification opt-in + local confirmation
 *
 * Replace `sendAlert()` with a real API call in production.
 */

const CAMPUS_CONTACTS = {
  campusHelplineTel: "tel:+910000000000", // TODO: replace with real campus helpline
  counselorTel: "tel:+910000000001", // TODO: replace with real counselor number
  counselorEmail:
    "mailto:counselor@example.edu?subject=URGENT%20Student%20Support%20Needed",
};

const SEVERITIES = {
  urgent: {
    key: "urgent",
    label: "Urgent",
    cta: "Trigger SOS Now",
    tone: "bg-red-600 hover:bg-red-700 text-white",
    badge: "text-red-700 bg-red-50 border-red-200",
    icon: <ShieldAlert size={18} className="text-red-600" />,
  },
  safety: {
    key: "safety",
    label: "Safety",
    cta: "Request Safety Help",
    tone: "bg-amber-600 hover:bg-amber-700 text-white",
    badge: "text-amber-700 bg-amber-50 border-amber-200",
    icon: <Shield size={18} className="text-amber-600" />,
  },
  emotional: {
    key: "emotional",
    label: "Emotional",
    cta: "Ask for Support",
    tone: "bg-purple-700 hover:bg-purple-800 text-white",
    badge: "text-purple-700 bg-purple-50 border-purple-200",
    icon: <Siren size={18} className="text-purple-700" />,
  },
};

export default function SOS() {
  const [consent, setConsent] = useState(false);
  const [severity, setSeverity] = useState("urgent"); // 'urgent' | 'safety' | 'emotional'
  const [countdown, setCountdown] = useState(0); // 0 idle
  const [sent, setSent] = useState(false);

  const [loc, setLoc] = useState(null);
  const [locError, setLocError] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  const [notes, setNotes] = useState("");
  const [sharing, setSharing] = useState(false);

  const [notifPerm, setNotifPerm] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  const canShare = typeof navigator !== "undefined" && !!navigator.share;
  const canClipboard = typeof navigator !== "undefined" && !!navigator.clipboard?.writeText;

  const timerRef = useRef(null);
  const cancelBtnRef = useRef(null);

  // Try to get location when page opens
  useEffect(() => {
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist consent/severity locally for UX continuity
  useEffect(() => {
    localStorage.setItem("cm_sos_consent", JSON.stringify(consent));
    localStorage.setItem("cm_sos_severity", severity);
  }, [consent, severity]);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cm_sos_consent") || "false");
    const s = localStorage.getItem("cm_sos_severity") || "urgent";
    setConsent(c);
    setSeverity(s);
  }, []);

  const fetchLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocError("Geolocation not supported by this browser.");
      return;
    }
    setLocLoading(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setLoc({ lat: latitude, lon: longitude, acc: accuracy });
        setLocLoading(false);
      },
      (err) => {
        setLoc(null);
        setLocError(err?.message || "Unable to fetch location.");
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 }
    );
  };

  const message = useMemo(() => {
    const ts = new Date().toLocaleString();
    const sev = severity.toUpperCase();
    const mapLink = loc ? `https://maps.google.com/?q=${loc.lat},${loc.lon}` : "(location unavailable)";
    const acc = loc?.acc ? `${Math.round(loc.acc)}m` : "N/A";
    const extra = notes ? `\nNotes: ${notes}` : "";
    return [
      `CLEAR MIND SOS (${sev})`,
      `Time: ${ts}`,
      `Location: ${mapLink}`,
      `Accuracy: ${acc}`,
      extra,
    ]
      .filter(Boolean)
      .join("\n");
  }, [severity, loc, notes]);

  const startCountdown = () => {
    if (!consent) return;
    if (countdown > 0) return;
    setCountdown(5);
    // move focus to cancel for accessibility
    setTimeout(() => cancelBtnRef.current?.focus(), 50);

    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          triggerSOS();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    clearInterval(timerRef.current);
    setCountdown(0);
  };

  // Simulate sending alert (replace with API call)
  const sendAlert = async () => {
    // Example: await fetch("/api/sos", { method: "POST", body: JSON.stringify({ severity, loc, notes }) });
    await new Promise((res) => setTimeout(res, 600));
  };

  const triggerSOS = async () => {
    await sendAlert();
    setSent(true);

    // Local notification confirmation (if allowed)
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("ClearMind — SOS Sent", {
          body: "Your alert has been triggered. Stay safe — help is on the way.",
        });
      }
    } catch {
      // ignore
    }
  };

  const requestNotifications = async () => {
    try {
      if (!("Notification" in window)) return;
      const p = await Notification.requestPermission();
      setNotifPerm(p);
    } catch {
      setNotifPerm("denied");
    }
  };

  const doShare = async () => {
    setSharing(true);
    try {
      if (canShare) {
        await navigator.share({
          title: "ClearMind SOS",
          text: message,
        });
      } else if (canClipboard) {
        await navigator.clipboard.writeText(message);
        alert("Details copied to clipboard.");
      } else {
        // Fallback: prompt with selectable text (last resort)
        window.prompt("Copy SOS details:", message);
      }
    } catch {
      try {
        if (canClipboard) {
          await navigator.clipboard.writeText(message);
          alert("Details copied to clipboard.");
        } else {
          window.prompt("Copy SOS details:", message);
        }
      } catch {
        alert("Could not share or copy.");
      }
    } finally {
      setSharing(false);
    }
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      alert("Copied SOS details.");
    } catch {
      window.prompt("Copy SOS details:", message);
    }
  };

  const sev = SEVERITIES[severity];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20 pb-16 px-6">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-purple-200 shadow-sm">
          <Siren className="text-purple-700" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-purple-800">
            Emergency SOS
          </h1>
        </div>
        <p className="text-gray-700 max-w-2xl mx-auto mt-4">
          If you feel unsafe or overwhelmed, you can trigger an alert. This is a demo — no data is sent to a server.
          In production, this would securely notify your campus support team.
        </p>

        <div className="mt-3 inline-flex items-center gap-2 text-xs text-gray-600">
          <Info size={14} />
          <span>This page never stores your identity. You stay in control.</span>
        </div>
      </section>

      {/* Card */}
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top */}
        <div className="p-6 grid gap-6 md:grid-cols-2">
          {/* Left: Consent + Severity + Notes */}
          <div>
            <h3 className="font-semibold text-gray-900">Consent</h3>
            <label className="mt-2 flex items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                className="mt-1 accent-purple-700"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-label="I consent to trigger SOS and share details with designated helpers"
              />
              <span>
                I confirm I want to trigger an emergency alert and share my details with designated helpers.
              </span>
            </label>

            <h3 className="font-semibold text-gray-900 mt-6">Severity</h3>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {Object.values(SEVERITIES).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSeverity(s.key)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition inline-flex items-center justify-center gap-2
                    ${
                      severity === s.key
                        ? "bg-purple-100 border-purple-700"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-purple-50"
                    }`}
                  aria-pressed={severity === s.key}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Optional Notes</h3>
                <span className={`text-[11px] px-2 py-0.5 rounded-lg border ${sev.badge}`}>
                  Severity: {sev.label}
                </span>
              </div>
              <textarea
                rows={4}
                placeholder="Share anything that could help responders support you better..."
                className="mt-2 w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                aria-label="Notes to assist responders"
              />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Bell size={18} className={notifPerm === "granted" ? "text-green-600" : "text-gray-500"} />
              <button
                type="button"
                onClick={requestNotifications}
                className="text-sm font-semibold text-purple-700 hover:underline"
              >
                {notifPerm === "granted" ? "Notifications enabled" : "Enable local notifications"}
              </button>
            </div>
          </div>

          {/* Right: Location + Contacts */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Your Location (optional)</h3>
              <button
                type="button"
                onClick={fetchLocation}
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:underline"
              >
                <LocateFixed size={16} />
                Refresh
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Used to help responders reach you faster. You can still send SOS without it.
            </p>

            <div className="mt-3 bg-gray-50 rounded-xl border border-gray-200 p-4">
              {locLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Loader2 size={16} className="animate-spin" />
                  Fetching location…
                </div>
              )}

              {!locLoading && !loc && !locError && (
                <p className="text-sm text-gray-600">Location pending…</p>
              )}

              {locError && (
                <p className="text-sm text-red-600">Location unavailable: {locError}</p>
              )}

              {loc && !locLoading && (
                <>
                  <p className="text-sm text-gray-800 flex items-center gap-2">
                    <MapPin size={16} className="text-purple-700" />
                    Lat: <b>{loc.lat.toFixed(4)}</b>, Lon: <b>{loc.lon.toFixed(4)}</b>
                    <span className="ml-2 text-gray-500">(±{Math.round(loc.acc)} m)</span>
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${loc.lat},${loc.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-purple-700 font-semibold hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 mt-6">Quick Contacts</h3>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <a
                href="tel:112"
                className="px-4 py-3 text-center rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition inline-flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                112 (Emergency)
              </a>
              <a
                href={CAMPUS_CONTACTS.campusHelplineTel}
                className="px-4 py-3 text-center rounded-xl bg-purple-700 text-white font-bold hover:bg-purple-800 transition inline-flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                Campus Helpline
              </a>
              <a
                href={CAMPUS_CONTACTS.counselorTel}
                className="px-4 py-3 text-center rounded-xl border border-purple-700 text-purple-700 font-bold hover:bg-purple-50 transition inline-flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                Call Counselor
              </a>
              <a
                href={CAMPUS_CONTACTS.counselorEmail}
                className="px-4 py-3 text-center rounded-xl border border-purple-700 text-purple-700 font-bold hover:bg-purple-50 transition inline-flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                Email Counselor
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-purple-100" />

        {/* Action Row */}
        <div className="p-6 flex flex-col md:flex-row items-center gap-3 md:gap-4">
          {!sent ? (
            <>
              <div
                className="sr-only"
                role="status"
                aria-live="assertive"
                aria-atomic="true"
              >
                {countdown > 0 && `Alert will send in ${countdown} seconds.`}
              </div>

              <button
                onClick={startCountdown}
                disabled={!consent || countdown > 0}
                className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold shadow-md transition ${sev.tone} ${
                  !consent ? "opacity-60 cursor-not-allowed" : ""
                }`}
                aria-disabled={!consent}
              >
                {countdown > 0 ? (
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} />
                    Sending in {countdown}…
                  </span>
                ) : (
                  sev.cta
                )}
              </button>

              {countdown > 0 && (
                <button
                  onClick={cancelCountdown}
                  ref={cancelBtnRef}
                  className="w-full md:w-auto px-6 py-3 rounded-xl font-bold border border-gray-400 text-gray-800 hover:bg-gray-100 transition inline-flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}

              <button
                onClick={doShare}
                className="w-full md:w-auto px-6 py-3 rounded-xl font-bold border border-purple-700 text-purple-700 hover:bg-purple-50 transition inline-flex items-center justify-center gap-2"
                disabled={sharing}
              >
                {sharing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Preparing…
                  </>
                ) : canShare ? (
                  <>
                    <Share2 size={16} /> Share Details
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copy Details
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="w-full text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="mt-3 text-green-700 font-bold text-lg">Alert Sent</h4>
              <p className="text-gray-600 mt-1 text-sm">
                Stay where you feel safest. Keep your phone nearby. Help is on the way.
              </p>

              <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-3">
                <button
                  onClick={doShare}
                  className="px-6 py-3 rounded-xl font-bold border border-purple-700 text-purple-700 hover:bg-purple-50 transition inline-flex items-center justify-center gap-2"
                >
                  {canShare ? (
                    <>
                      <Share2 size={16} />
                      Share Location & Note
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Location & Note
                    </>
                  )}
                </button>
                <button
                  onClick={copyMessage}
                  className="px-6 py-3 rounded-xl font-bold border border-gray-400 text-gray-800 hover:bg-gray-100 transition inline-flex items-center justify-center gap-2"
                >
                  <Copy size={16} />
                  Copy Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guidance */}
      <section className="max-w-4xl mx-auto mt-10 text-sm text-gray-700 bg-white p-5 rounded-2xl border border-gray-200">
        <h4 className="text-gray-900 font-semibold flex items-center gap-2">
          <Info size={16} /> While you wait
        </h4>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Move to a safe, well-lit place if possible.</li>
          <li>Keep your phone charged and ringer on.</li>
          <li>If you’re with someone you trust, let them know you asked for help.</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          This demo does not send any data to a server. In production, pressing “{SEVERITIES[severity].cta}”
          will notify campus support channels and can include your live location, depending on your consent and local laws.
        </p>
      </section>
    </div>
  );
}
