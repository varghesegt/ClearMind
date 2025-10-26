import React, { useRef, useEffect } from 'react';
import pricingBg from '../assets/images/pricing.jpg';
import { FaCheckCircle, FaCrown } from 'react-icons/fa';

const plans = [
  { title: 'Starter Site Essentials', badge: 'basic', price: 9999, original: 12999, billing: 'One-time (1 Year)', tagline: 'Ideal for students, freelancers & new creators launching online', discountTag: '💸 Limited-Time Offer: Save 23%', features: ['2-Page Website: Home + Contact/About','Clean, responsive layout for all devices','Direct WhatsApp/Call Integration','Social Media Links + Location Maps','3 Months of Expert Support',], wpMessage: "Hi! I'm interested in the Starter Site Essentials plan for ₹9,999.", },
  { title: 'Pro Presence Package', badge: 'premium', price: 14999, original: 19999, billing: 'One-time (1 Year)', tagline: 'Perfect for cafés, salons, consultants & local brands', discountTag: '🧳 Save 25% Instantly', features: ['3 Pages: Home, Menu/Services, Contact','Branded QR Menu or Service PDF','One-click WhatsApp Orders/Appointments','Testimonials + Social Proof Section','6 Months Premium Support',], wpMessage: 'Hi! I’d like to know more about the Pro Presence Package for ₹14,999.', },
  { title: 'Brand Builder Suite', badge: 'elite', price: 29999, original: 39999, billing: 'One-time (1 Year)', tagline: 'Designed for clinics, educators, restaurants & influencers', discountTag: '🔥 Save ₹10,000 Today', features: ['5 Pages: Home, About, Services, Reviews, Contact','Digital & Print-ready QR Brochure/Menu','Full SEO + Speed Optimization','Lead Capture Form (Email + Sheets)','1 Year Premium Support + 5 Free Content Updates','Custom Icons, Animations & Visuals','Premium Hosting + CDN','One-click Social Share Buttons',], wpMessage: "Hi! I'm ready to begin with the Brand Builder Suite for ₹29,999.", },
  { title: 'Launch Lite (Monthly)', badge: 'basic', price: 1999, original: 2999, billing: '/month', tagline: 'A budget-friendly monthly plan for small starters', discountTag: '🧠 Smart Launch: Save 33%', features: ['3 Pages + Hosting + Domain','Fully Responsive Design','QR Menu / Product PDF Support','Basic Monthly Updates','WhatsApp Support (Business Hours)',], wpMessage: 'Hi! I want to get started with Launch Lite at ₹1,999/month.', },
  { title: 'Digital Growth Engine', badge: 'premium', price: 3499, original: 4999, billing: '/month', tagline: 'Perfect for scaling brands with fast updates & optimizations', discountTag: '📈 ₹1,500/mo Savings', features: ['5 Pages + Live Menu via Google Sheets','Unlimited Monthly Content Updates','Fast Hosting + Custom Domain','SEO Ready (Meta, Speed, Structure)','Priority Response Support',], wpMessage: "Hi! I'm interested in the Digital Growth Engine plan at ₹3,499/month.", },
  { title: 'Elite Partner Program', badge: 'elite', price: 4999, original: 6999, billing: '/month', tagline: 'Complete monthly care: strategy, design, SEO & updates', discountTag: '🚀 Save ₹2,000 Every Month', features: ['5 Premium Pages: Home, About, Services, Reviews, Contact','Digital & Printable Brochures / QR Menus','Full SEO + Core Web Speed Optimization','Integrated Lead Forms (Email + Sheets)','1 Monthly Content Update + Priority Support','Custom UI Icons & Web Animations','Premium Hosting with Global CDN','Social Media Share Links Included',], wpMessage: 'Hi! I’m ready to join the Elite Partner Program at ₹4,999/month.', },
];

const addons = ['Extra Page – ₹999','Custom Contact Form – ₹1,499','PDF Brochure/Menu – ₹1,499','Image Gallery/Carousel – ₹999','Multi-language Setup – ₹1,999','Booking or Lead Form Setup – ₹2,499','Full E-commerce Setup – ₹9,999+','Content Upload & Alignment – ₹1,499',];

const getBadgeStyle = (type) => {
  switch (type) {
    case 'basic': return 'bg-[#58A6FF]';
    case 'premium': return 'bg-[#9B5DE5]';
    case 'elite': return 'bg-gradient-to-r from-[#FF6EC4] to-[#9B5DE5]';
    default: return 'bg-gray-500';
  }
};

export default function Pricing() {
  const whatsapp = '917871844464';
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : scrollLeft + clientWidth, behavior: 'smooth' });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="pricing" className="relative text-[#0F172A] py-20 px-4 sm:px-6 overflow-hidden">
      <img src={pricingBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 z-0" />
      <div className="absolute inset-0 bg-white/70 z-0" />

      <div className="relative z-10 container-lg text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-primary">Smart Plans. Real Results. Zero Guesswork.</h2>
        <p className="text-gray-700 mb-10 max-w-2xl mx-auto text-sm sm:text-base">
          Select the perfect <span className="text-primary font-semibold">website plan</span> to boost your business, convert leads, and go digital.
        </p>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pr-2">
          {plans.map((plan, idx) => (
            <div key={idx} className={`snap-start min-w-[320px] sm:min-w-[360px] flex flex-col justify-between relative border rounded-2xl p-6 transition duration-300 shadow-card bg-white overflow-hidden ${plan.badge==='elite' ? 'border-pink-300 ring-1 ring-pink-200' : 'border-border'}`}>
              <div>
                <div className={`absolute top-0 left-0 text-white text-xs font-semibold px-3 py-1 rounded-br-xl flex items-center gap-1 ${getBadgeStyle(plan.badge)}`}>
                  {plan.badge === 'elite' && <FaCrown className="text-yellow-300" />}
                  {plan.badge.charAt(0).toUpperCase() + plan.badge.slice(1)}
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-1 text-gray-900">{plan.title}</h3>
                <p className="text-gray-600 mb-2 text-sm">{plan.tagline}</p>

                <div className="flex flex-wrap items-center justify-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="line-through text-gray-400 text-sm">₹{plan.original}</span>
                  <span className="text-green-600 text-xs">{plan.billing}</span>
                </div>

                <span className="text-xs text-pink-600 font-semibold block mb-3">{plan.discountTag}</span>

                <ul className="text-left space-y-2 text-sm mb-6 text-gray-700">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <FaCheckCircle className="text-primary" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(plan.wpMessage)}`} target="_blank" rel="noopener noreferrer" className="mt-auto inline-block w-full bg-primary hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition">
                Get This Plan
              </a>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-white border border-border rounded-2xl shadow-soft p-8 text-left">
            <h3 className="text-3xl font-heading font-bold text-center mb-4 text-primary">🧩 Universal Add-ons</h3>
            <p className="text-gray-700 text-center text-base mb-8">
              Add any of these <span className="text-primary font-semibold">extras</span> to customize your website even further.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addons.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl shadow-inner">
                  <FaCheckCircle className="text-primary shrink-0" />
                  <span className="text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
