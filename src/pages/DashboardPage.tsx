import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  IndianRupee,
  PlusCircle,
  Trash2,
  Edit3,
  ArrowRight,
  TrendingUp,
  FileText,
  Compass,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Trip, User } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface DashboardPageProps {
  currentUser: User;
  trips: Trip[];
  onNavigate: (page: string, tripId?: string) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  trips,
  onNavigate,
  onDeleteTrip,
}) => {
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  // Filter trips for this user
  const userTrips = trips.filter((t) => t.user_id === currentUser.user_id);

  const upcomingTrips = userTrips.filter((t) => t.status === 'upcoming');
  const pastTrips = userTrips.filter((t) => t.status !== 'upcoming');

  const totalBudgetManaged = userTrips.reduce((sum, t) => sum + (t.total_budget || 0), 0);
  const totalDaysPlanned = userTrips.reduce((sum, t) => sum + (t.duration_days || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header & Action Banner */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] uppercase tracking-wider mb-1">
              <span>Personalized Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#183153] tracking-tight">
              Welcome back, {currentUser.full_name}!
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-2xl">
              Manage your day-wise schedules, track multi-category expenses, and generate new
              personalized travel itineraries.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('planner')}
              className="bg-[#0F766E] hover:bg-[#0c625c] text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors shadow-xs flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Trip</span>
            </button>
          </div>
        </div>

        {/* Quick Analytics Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="text-xs font-medium text-[#64748B]">Total Planned Trips</div>
            <div className="text-2xl font-bold text-[#183153] mt-1">{userTrips.length}</div>
            <div className="text-[11px] text-[#0F766E] mt-1 font-medium">
              {upcomingTrips.length} upcoming scheduled
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="text-xs font-medium text-[#64748B]">Total Budget Managed</div>
            <div className="text-2xl font-bold text-[#183153] mt-1">
              ₹{totalBudgetManaged.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#64748B] mt-1">Across all itineraries</div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="text-xs font-medium text-[#64748B]">Total Travel Days</div>
            <div className="text-2xl font-bold text-[#183153] mt-1">{totalDaysPlanned} Days</div>
            <div className="text-[11px] text-[#64748B] mt-1">Algorithmic day schedules</div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
            <div className="text-xs font-medium text-[#64748B]">Database Sync Status</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
              <span>Active</span>
            </div>
            <div className="text-[11px] text-[#64748B] mt-1">Local & relational persistence</div>
          </div>
        </div>

        {/* Upcoming Trips Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#183153] tracking-tight">
                Upcoming Trips ({upcomingTrips.length})
              </h2>
              <p className="text-xs text-[#64748B]">Your scheduled and confirmed travel plans</p>
            </div>
            {upcomingTrips.length > 0 && (
              <button
                onClick={() => onNavigate('my-trips')}
                className="text-xs font-semibold text-[#0F766E] hover:underline"
              >
                View all in My Trips →
              </button>
            )}
          </div>

          {upcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingTrips.map((trip) => (
                <div
                  key={trip.trip_id}
                  className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  <div className="relative h-40 bg-slate-100">
                    <img
                      src={
                        trip.cover_image ||
                        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={trip.destination}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#183153]/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                      {trip.budget_type} Tier
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                      {trip.status}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#183153]">{trip.destination}</h3>
                        <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                          <span>Origin: {trip.starting_location}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#64748B]">Total Budget</div>
                        <div className="text-base font-bold text-[#183153]">
                          ₹{trip.total_budget.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#64748B] bg-slate-50 p-2.5 rounded-md border border-slate-200/70">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#183153]" />
                        <span>
                          {trip.start_date} to {trip.end_date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#183153]" />
                        <span>
                          {trip.duration_days} Days ({trip.itinerary_days.length} Daily Plans)
                        </span>
                      </div>
                    </div>

                    {/* Interest Chips */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {trip.selected_interests.map((i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                        >
                          {i}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                      <button
                        onClick={() => setTripToDelete(trip)}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigate('budget', trip.trip_id)}
                          className="px-3 py-1.5 rounded-md text-xs font-medium text-[#183153] border border-[#E2E8F0] hover:bg-slate-50 transition-colors"
                        >
                          Budget
                        </button>
                        <button
                          onClick={() => onNavigate('summary', trip.trip_id)}
                          className="px-3 py-1.5 rounded-md text-xs font-medium text-[#183153] border border-[#E2E8F0] hover:bg-slate-50 transition-colors"
                          title="Print / Dossier"
                        >
                          Dossier
                        </button>
                        <button
                          onClick={() => onNavigate('itinerary', trip.trip_id)}
                          className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-[#183153] hover:bg-[#0F766E] transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>Itinerary</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-dashed border-[#E2E8F0] p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-[#64748B] flex items-center justify-center mx-auto mb-3">
                <Compass className="w-6 h-6 text-[#0F766E]" />
              </div>
              <h3 className="text-base font-bold text-[#183153]">No upcoming trips found</h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                Ready to explore? Create your first personalized trip using our 6-step planning
                wizard.
              </p>
              <button
                onClick={() => onNavigate('planner')}
                className="mt-4 bg-[#0F766E] hover:bg-[#0c625c] text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Start Planning Now</span>
              </button>
            </div>
          )}
        </section>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!tripToDelete}
          title="Delete Trip Plan"
          message={`Are you sure you want to permanently delete the itinerary for "${tripToDelete?.destination}"? This will remove all associated day schedules and category expense records.`}
          confirmLabel="Delete Trip"
          isDestructive={true}
          onConfirm={() => {
            if (tripToDelete) {
              onDeleteTrip(tripToDelete.trip_id);
              setTripToDelete(null);
            }
          }}
          onCancel={() => setTripToDelete(null)}
        />
      </div>
    </div>
  );
};
