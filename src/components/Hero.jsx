import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-white to-blue-50">
      <div className="container-lg py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl text-primary leading-tight">Building brighter futures through education</h1>
          <p className="mt-4 text-lg text-gray-700">Join our Infinite e-Learning Initiative empowering learners with accessible, high-quality digital education.</p>
          <div className="mt-6 flex gap-3">
            <NavLink to="/donation" className="px-5 py-3 rounded-xl bg-primary text-white shadow-card">Donate Now</NavLink>
            <NavLink to="/programs" className="px-5 py-3 rounded-xl border border-border">Explore Programs</NavLink>
          </div>
        </div>
        <div className="rounded-2xl bg-white shadow-soft p-6 border border-border">
          <h3 className="font-semibold text-gray-900">Infinite e-Learning Initiative</h3>
          <p className="mt-2 text-gray-700">A short intro about our mission to enable continuous learning with curated courses, community mentorship, and open resources.</p>
          <ul className="mt-4 list-disc list-inside text-gray-700">
            <li>Free foundational courses</li>
            <li>Mentor-led cohorts</li>
            <li>Job-ready skill tracks</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
