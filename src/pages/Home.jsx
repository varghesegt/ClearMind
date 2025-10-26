import React from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  MessageCircle,
  UsersRound,
  UserCircle,
  CheckSquare,
  GraduationCap,
  Siren,
  MapPin,
} from "lucide-react";

/* ✅ Home Page */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
      
      {/* ✅ HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-800 leading-tight">
          Support for Every Student,
          <br />
          Anytime. Anywhere.
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto mt-6 text-lg">
          ClearMind guides students emotionally & academically, empowering
          wellness, focus and timely help whenever they need it most.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <CTAButton primary link="/check-in">Start Check-In</CTAButton>
          <CTAButton link="/chat">Anonymous Chat</CTAButton>
        </div>
      </section>

      {/* ✅ FULL FEATURE SUITE */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-purple-800 mb-14">
          Your Wellness Companion, All-in-One
        </h2>

        {/* ✅ Mental Health */}
        <CategoryTitle title="Mental Health Support" />
        <FeatureGrid>
          <FeatureCard icon={<HeartPulse />} title="Emotional Check-In" desc="Track your emotions with insights" link="/check-in" />
          <FeatureCard icon={<MessageCircle />} title="Anonymous Chat" desc="Feel heard without revealing identity" link="/chat" />
          <FeatureCard icon={<UsersRound />} title="Peer Support" desc="Compassion from trained listeners" link="/peer" />
          <FeatureCard icon={<UserCircle />} title="Counselor Access" desc="Reach campus support quickly" link="/counselor" />
        </FeatureGrid>

        {/* ✅ Academic */}
        <CategoryTitle title="Academic Wellness" />
        <FeatureGrid>
          <FeatureCard icon={<CheckSquare />} title="Study Tasks" desc="Stay on track without stress" link="/todo" />
          <FeatureCard icon={<GraduationCap />} title="Academic Support" desc="Guidance, notes & mentors" link="/academic-support" />
        </FeatureGrid>

        {/* ✅ Emergency */}
        <CategoryTitle title="Emergency Safety" danger />
        <FeatureGrid>
          <FeatureCard icon={<Siren />} title="SOS Alert" desc="Instant safety activation" link="/sos" />
          <FeatureCard icon={<MapPin />} title="Live Location" desc="Smart location sharing during crisis" link="/sos" />
        </FeatureGrid>

      </section>

      {/* ✅ PRIVACY + TRUST */}
      <TrustSection />
    </div>
  );
}

/* ---------- Reusable UI Components ---------- */

/* ✅ CTA Buttons */
function CTAButton({ children, primary, link }) {
  const base =
    "px-7 py-3 rounded-xl font-semibold shadow-md transition transform active:scale-95";
  const styles = primary
    ? "bg-purple-700 text-white hover:bg-purple-800"
    : "bg-white/80 backdrop-blur border border-purple-700 text-purple-700 hover:bg-purple-100";
  return (
    <Link to={link} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

/* ✅ Section Titles */
function CategoryTitle({ title, danger }) {
  return (
    <h3
      className={`text-xl font-bold mb-4 ${
        danger ? "text-red-600" : "text-purple-700"
      }`}
    >
      {title}
    </h3>
  );
}

/* ✅ Grid Wrapper */
function FeatureGrid({ children }) {
  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 mb-14">
      {children}
    </div>
  );
}

/* ✅ Premium Feature Card */
function FeatureCard({ icon, title, desc, link }) {
  return (
    <Link
      to={link}
      className="group p-8 bg-white/80 backdrop-blur-xl rounded-2xl border 
      border-purple-200 shadow-sm hover:shadow-2xl transition-all duration-300 
      transform hover:-translate-y-1"
    >
      <div className="mb-4 text-purple-700 group-hover:text-purple-900 transition">
        {React.cloneElement(icon, { size: 36, strokeWidth: 2.2 })}
      </div>

      <h3 className="text-lg font-bold text-purple-900">{title}</h3>
      <p className="text-gray-600 mt-2 text-sm">{desc}</p>

      <span className="inline-block mt-4 text-sm font-semibold text-purple-700 group-hover:text-purple-900 transition">
        Explore →
      </span>
    </Link>
  );
}

/* ✅ Trust Section */
function TrustSection() {
  return (
    <section className="bg-purple-800 text-white py-16 text-center rounded-t-3xl">
      <h3 className="text-2xl font-bold">Trusted. Secure. Human Centered.</h3>
      <p className="max-w-xl mx-auto mt-3 text-purple-200">
        Zero PII | Confidential support | You control your data.
      </p>
      <div className="flex justify-center gap-6 mt-8 text-purple-100 text-sm flex-wrap">
        <Badge text="Confidential System" />
        <Badge text="University Verified" />
        <Badge text="Wellness First" />
      </div>
    </section>
  );
}

/* ✅ Small Badge */
function Badge({ text }) {
  return (
    <span className="px-4 py-2 bg-white/10 rounded-xl border border-purple-300/20">
      {text}
    </span>
  );
}
