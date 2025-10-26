import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-10">
      <div className="container-lg py-8 grid md:grid-cols-3 gap-6 text-sm text-gray-600">
        <div>
          <h3 className="font-heading text-lg text-primary">Kalvikann Foundation</h3>
          <p className="mt-2 text-muted">Empowering communities through education & development.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Quick Links</h4>
          <ul className="mt-2 grid gap-1">
            <li><NavLink to="/programs">Programs</NavLink></li>
            <li><NavLink to="/volunteer">Volunteer</NavLink></li>
            <li><NavLink to="/careers">Careers</NavLink></li>
            <li><NavLink to="/donation">Donate</NavLink></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Legal</h4>
          <ul className="mt-2 grid gap-1">
            <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
            <li><NavLink to="/terms">Terms of Service</NavLink></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-gray-500">© {new Date().getFullYear()} Kalvikann Foundation. All rights reserved.</div>
    </footer>
  );
}
