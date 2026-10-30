import React, { useState } from 'react';
import {
  Compass,
  Search,
  ArrowRight,
  Calendar,
  Sparkles,
  Shield,
  Sliders,
  MapPin,
  Clock,
  IndianRupee,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { Destination } from '../types';

interface HomePageProps {
  onStartPlanning: (destinationId?: string) => void;
  onExploreDestination?: (dest: Destination) => void;
  onNavigateToLogin?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartPlanning,
  onExploreDestination,
  onNavigateToLogin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedModalDest, setSelectedModalDest] = useState<Destination | null>(null);

  const categories = ['All', 'Historical places', 'Beaches', 'Mountains', 'Nature', 'Food'];

  const filteredDestinations = DESTINATIONS.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tagline.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || dest.categories.includes(selectedCategory as any);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative bg-[#183153] text-white overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-teal-300 text-xs font-semibold mb-6 border border-slate-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithmic Travel Scheduling & Budget Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Plan Your Next Trip, Your Way.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Personalized itineraries tailored to your dates, travel party, specific interests,
            and exact budget. Built with engineering rigor and transparent cost tracking.
          </p>

          {/* Destination Search Box */}
          <div className="mt-8 max-w-2xl mx-auto bg-white p-2 rounded-lg shadow-lg border border-slate-200 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center px-3 py-2 text-[#1F2937]">
              <Search className="w-5 h-5 text-[#64748B] mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to travel? (e.g., Jaipur, Goa, Manali, Kerala...)"
                className="w-full text-sm placeholder-slate-400 focus:outline-hidden text-[#1F2937]"
              />
            </div>
            <button
              onClick={() => onStartPlanning()}
              className="bg-[#0F766E] hover:bg-[#0c625c] text-white px-6 py-2.5 rounded-md font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {onNavigateToLogin && (
            <div className="mt-4 text-xs text-slate-300">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-teal-300 hover:text-white font-semibold underline underline-offset-2"
              >
                Sign in to view your saved trips & dashboard
              </button>
            </div>
          )}

          {/* Quick Stats Badges */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto text-xs text-slate-300 border-t border-slate-800 pt-6">
            <div>
              <div className="font-bold text-base text-white">100% Curated</div>
              <div className="text-slate-400 mt-0.5">Real admission costs & timings</div>
            </div>
            <div>
              <div className="font-bold text-base text-white">₹ INR Standard</div>
              <div className="text-slate-400 mt-0.5">5-category expense breakdown</div>
            </div>
            <div>
              <div className="font-bold text-base text-white">Paced Scheduling</div>
              <div className="text-slate-400 mt-0.5">Max 3 activities/day fatigue guard</div>
            </div>
            <div>
              <div className="font-bold text-base text-white">Customizable</div>
              <div className="text-slate-400 mt-0.5">Edit, add, delete, save & print</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#183153] tracking-tight">
              Featured Indian Destinations
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Select any destination to generate an optimized, personalized day-wise schedule.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#183153] text-white shadow-xs'
                    : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.coverImage}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#183153]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-sm backdrop-blur-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-300" />
                  <span>{dest.state}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 text-[#183153] text-xs font-bold px-2 py-0.5 rounded shadow-xs">
                  From ₹{dest.avg_daily_cost.Budget.toLocaleString('en-IN')}/day
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[#183153]">{dest.name}</h3>
                <p className="text-xs font-medium text-[#0F766E] mt-0.5">{dest.tagline}</p>
                <p className="text-xs text-[#64748B] mt-2 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                {/* Best Season */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>Best season: {dest.best_season}</span>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dest.categories.slice(0, 3).map((c) => (
                    <span
                      key={c}
                      className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded"
                    >
                      {c}
                    </span>
                  ))}
                  <span className="text-[10px] bg-teal-50 text-[#0F766E] font-medium px-2 py-0.5 rounded">
                    {dest.attractions.length} Curated Attractions
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedModalDest(dest)}
                    className="text-xs font-medium text-[#183153] hover:text-[#0F766E] transition-colors"
                  >
                    View Highlights
                  </button>
                  <button
                    onClick={() => onStartPlanning(dest.id)}
                    className="bg-[#183153] hover:bg-[#0F766E] text-white px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <span>Plan This Trip</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-[#E2E8F0]">
            <p className="text-sm text-[#64748B]">No destinations match your search or filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs text-[#0F766E] font-medium hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-white border-y border-[#E2E8F0] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-[#183153] tracking-tight">
              How the System Works
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              A 3-step structured engineering workflow for seamless travel planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-[#E2E8F0] rounded-lg p-6 bg-slate-50/50">
              <div className="w-10 h-10 rounded-md bg-[#183153] text-white flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-base text-[#183153]">Input Parameters</h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                Choose your destination, origin city, exact dates, travel party (adults and
                children), total budget limit in ₹, and specific travel interests.
              </p>
            </div>

            <div className="border border-[#E2E8F0] rounded-lg p-6 bg-slate-50/50">
              <div className="w-10 h-10 rounded-md bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-base text-[#183153]">Algorithmic Synthesis</h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                The recommendation engine scores attractions, organizes realistic morning,
                afternoon, and evening time slots, and projects category expenses.
              </p>
            </div>

            <div className="border border-[#E2E8F0] rounded-lg p-6 bg-slate-50/50">
              <div className="w-10 h-10 rounded-md bg-[#183153] text-white flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-base text-[#183153]">Manage & Export</h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                Fine-tune each day, add custom stops, track your remaining budget against limits,
                save trips to your dashboard, and print a clean travel dossier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Preview Modal */}
      {selectedModalDest && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-lg shadow-xl border border-[#E2E8F0] max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-xl font-bold text-[#183153]">{selectedModalDest.name}</h3>
                <p className="text-xs text-[#0F766E] font-medium">{selectedModalDest.tagline}</p>
              </div>
              <button
                onClick={() => setSelectedModalDest(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <img
                src={selectedModalDest.coverImage}
                alt={selectedModalDest.name}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>

            <p className="mt-4 text-xs text-[#1F2937] leading-relaxed">
              {selectedModalDest.description}
            </p>

            <div className="mt-4">
              <h4 className="text-xs font-bold text-[#183153] uppercase tracking-wider mb-2">
                Curated Attractions in Dataset
              </h4>
              <div className="space-y-2">
                {selectedModalDest.attractions.map((attr) => (
                  <div
                    key={attr.id}
                    className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-md flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#183153]">{attr.name}</div>
                      <div className="text-[11px] text-[#64748B]">{attr.description}</div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="font-bold text-[#0F766E]">
                        {attr.cost_inr === 0 ? 'Free' : `₹${attr.cost_inr}`}
                      </div>
                      <div className="text-[10px] text-slate-500">{attr.duration_hours}h • {attr.time_slot_preference}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
              <button
                onClick={() => setSelectedModalDest(null)}
                className="px-4 py-2 text-xs font-medium text-[#1F2937] bg-white border border-[#E2E8F0] rounded-md hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = selectedModalDest.id;
                  setSelectedModalDest(null);
                  onStartPlanning(id);
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-[#0F766E] hover:bg-[#0c625c] rounded-md shadow-xs flex items-center gap-1.5"
              >
                <span>Plan Trip for {selectedModalDest.name.split(',')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
