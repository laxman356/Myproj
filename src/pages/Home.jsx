import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Sparkles, Calendar, Search, Package, ChevronRight, Gem } from 'lucide-react';
import { useData } from '../context/DataContext';
import ItemCard from '../components/ItemCard';

const EVENT_CATEGORIES = [
  { name: 'Wedding', emoji: '💍', color: 'from-rose-100 to-pink-50', border: 'border-rose-200' },
  { name: 'Festival', emoji: '🪔', color: 'from-orange-100 to-amber-50', border: 'border-orange-200' },
  { name: 'Engagement', emoji: '💝', color: 'from-purple-100 to-violet-50', border: 'border-purple-200' },
  { name: 'Religious Ceremony', emoji: '🛕', color: 'from-yellow-100 to-amber-50', border: 'border-yellow-200' },
  { name: 'Party', emoji: '🎉', color: 'from-blue-100 to-indigo-50', border: 'border-blue-200' },
  { name: 'Anniversary', emoji: '🌹', color: 'from-red-100 to-rose-50', border: 'border-red-200' },
  { name: 'Cultural Event', emoji: '🎭', color: 'from-teal-100 to-cyan-50', border: 'border-teal-200' },
  { name: 'Corporate Event', emoji: '🏆', color: 'from-gray-100 to-slate-50', border: 'border-gray-200' },
];

const HOW_IT_WORKS_RENTER = [
  { icon: Search, title: 'Discover', desc: 'Browse thousands of exquisite pieces. Filter by event, date, and location.' },
  { icon: Calendar, title: 'Reserve', desc: 'Pick your dates, check real-time availability, and submit a booking request.' },
  { icon: Gem, title: 'Adorn', desc: 'Receive the jewelry, shine at your event, and return it afterwards.' },
];

const HOW_IT_WORKS_OWNER = [
  { icon: Package, title: 'List', desc: 'Upload photos of your jewelry, set your price, and define your availability.' },
  { icon: Calendar, title: 'Manage', desc: 'Control your calendar, approve rentals, and track your inventory.' },
  { icon: Star, title: 'Earn', desc: 'Earn money from jewelry sitting in your locker. Get paid after each rental.' },
];

const STATS = [
  { value: '10,000+', label: 'Jewelry Pieces' },
  { value: '₹2Cr+', label: 'Saved by Renters' },
  { value: '50,000+', label: 'Happy Customers' },
  { value: '200+', label: 'Cities' },
];

export default function Home() {
  const { items } = useData();
  const featured = items.slice(0, 4);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-white">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-yellow-50 via-amber-50 to-transparent opacity-80" />
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-rose-50 opacity-40 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-50 opacity-40 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto fade-up">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={13} className="text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700 tracking-wide uppercase">India's Premier Jewelry Rental</span>
          </div>

          {/* Headline */}
          <h1 className="hero-text text-gray-900 mb-6">
            Wear Magnificence.
            <br />
            <span className="gold-shimmer">Not the Price Tag.</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Rent stunning jewelry and ornaments for weddings, festivals, and every occasion.
            Own extraordinary pieces? List them and earn effortlessly.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            <Link to="/browse" className="btn-gold text-base px-8 py-3.5">
              Browse Jewelry <ArrowRight size={16} />
            </Link>
            <Link to="/signup" className="btn-outline-dark text-base px-8 py-3.5">
              List Your Jewelry
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <div className="w-px h-8 bg-gray-400 animate-bounce" />
          <span className="text-xs text-gray-500">Scroll</span>
        </div>
      </section>

      {/* ── Event Categories ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title text-gray-900 mb-4">Shop by Occasion</h2>
            <p className="text-gray-500 text-lg">Find the perfect jewelry for every event in your life</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EVENT_CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/browse?event=${encodeURIComponent(cat.name)}`}
                className={`group card-hover bg-gradient-to-br ${cat.color} border ${cat.border} rounded-2xl p-6 text-center cursor-pointer`}
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <p className="font-semibold text-gray-800 text-sm group-hover:text-gray-900">{cat.name}</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                  <span>Browse</span>
                  <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Items ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title text-gray-900 mb-3">Featured Pieces</h2>
              <p className="text-gray-500">Handpicked by our curators</p>
            </div>
            <Link to="/browse" className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:gap-2 transition-all">
              View all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual Divider / Full-bleed Banner ── */}
      <section className="py-24 px-6 bg-gray-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c9a227 0%, transparent 50%), radial-gradient(circle at 80% 50%, #c9a227 0%, transparent 50%)' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-4">Why Ornamint</p>
          <h2 className="section-title text-white mb-6">
            Exquisite jewelry shouldn't be<br />a one-time experience.
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            The average Indian wedding jewelry costs ₹5–20 lakhs and is worn only once.
            We're changing that — making luxury accessible and sustainable.
          </p>
          <Link to="/browse" className="btn-gold px-8 py-3.5 text-base">
            Explore Collections <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Renter */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-100 rounded-full px-4 py-1.5">
                  <span className="text-blue-700 text-sm font-semibold">For Renters</span>
                </div>
              </div>
              <div className="space-y-8">
                {HOW_IT_WORKS_RENTER.map((step, i) => (
                  <div key={step.title} className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <step.icon size={22} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium mb-0.5">Step {i + 1}</div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/browse" className="btn-outline">Start Browsing <ArrowRight size={15} /></Link>
              </div>
            </div>

            {/* Owner */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-yellow-100 rounded-full px-4 py-1.5">
                  <span className="text-yellow-700 text-sm font-semibold">For Jewelry Owners</span>
                </div>
              </div>
              <div className="space-y-8" id="for-owners">
                {HOW_IT_WORKS_OWNER.map((step, i) => (
                  <div key={step.title} className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center">
                      <step.icon size={22} className="text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium mb-0.5">Step {i + 1}</div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/signup" className="btn-gold">List Your Jewelry <ArrowRight size={15} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Signals ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Insured & Secure', desc: 'Every rental is covered by our comprehensive insurance policy up to ₹5 lakhs.' },
              { icon: Star, title: 'Verified Owners', desc: 'All jewelry owners are KYC-verified. We authenticate every piece for quality.' },
              { icon: Sparkles, title: 'Professionally Cleaned', desc: 'Every item is cleaned, sanitized, and quality-checked before each rental.' },
            ].map(trust => (
              <div key={trust.title} className="flex gap-5 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <trust.icon size={22} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{trust.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{trust.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title text-gray-900 mb-5">
            Ready to shine?
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Join thousands of people who rent, share, and celebrate with exquisite jewelry.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup?type=renter" className="btn-gold px-8 py-3.5 text-base">
              Rent Jewelry <ArrowRight size={16} />
            </Link>
            <Link to="/signup?type=owner" className="btn-outline-dark px-8 py-3.5 text-base">
              List & Earn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
