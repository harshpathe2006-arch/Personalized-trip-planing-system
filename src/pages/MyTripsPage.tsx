import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Search,
  Trash2,
  PlusCircle,
  ArrowRight,
  Filter,
  CheckCircle,
  Eye,
  Wallet,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Trip, TripStatus, User } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface MyTripsPageProps {
  currentUser: User;
  trips: Trip[];
  onNavigate: (page: string, tripId?: string) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({
  currentUser,
  trips,
  onNavigate,
  onDeleteTrip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TripStatus>('All');
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const userTrips = trips.filter((t) => t.user_id === currentUser.user_id);

  const filteredTrips = userTrips.filter((trip) => {
    const matchesSearch =
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.starting_location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || trip.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">
              My Saved Trips
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Browse, manage, and filter all personalized itineraries generated on your account.
            </p>
          </div>

          <button
            onClick={() => onNavigate('planner')}
            className="bg-[#0F766E] hover:bg-[#0c625c] text-white px-4 py-2 rounded-md font-semibold text-xs transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Trip</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by destination or origin city..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#1F2937]"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs text-[#64748B] mr-1 hidden sm:inline">Status:</span>
            {(['All', 'upcoming', 'ongoing', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-[#183153] text-white shadow-xs'
                    : 'bg-slate-50 text-[#64748B] hover:bg-slate-100 border border-[#E2E8F0]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.trip_id}
              className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className="relative h-44 bg-slate-100">
                <img
                  src={
                    trip.cover_image ||
                    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={trip.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#183153]/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded backdrop-blur-xs">
                  {trip.budget_type} Tier
                </div>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                  {trip.status}
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 text-[#183153] text-xs font-bold px-2.5 py-0.5 rounded shadow-xs">
                  ₹{trip.total_budget.toLocaleString('en-IN')} Budget
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#183153]">{trip.destination}</h3>
                  <div className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Origin: {trip.starting_location}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[#64748B] bg-slate-50 p-2.5 rounded-md border border-slate-200/70">
                    <div>
                      <span className="block text-slate-400">Duration</span>
                      <strong className="text-[#183153]">
                        {trip.duration_days} Days ({trip.itinerary_days.length} Days)
                      </strong>
                    </div>
                    <div>
                      <span className="block text-slate-400">Travelers</span>
                      <strong className="text-[#183153]">
                        {trip.traveler_count.adults} Adults
                        {trip.traveler_count.children > 0
                          ? `, ${trip.traveler_count.children} Ch`
                          : ''}
                      </strong>
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {trip.selected_interests.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {item}
                      </span>
                    ))}
                    {trip.selected_interests.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{trip.selected_interests.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setTripToDelete(trip)}
                    className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors text-xs flex items-center gap-1"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onNavigate('budget', trip.trip_id)}
                      className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#183153] border border-[#E2E8F0] hover:bg-slate-50 transition-colors"
                      title="Budget"
                    >
                      <Wallet className="w-3.5 h-3.5 text-[#0F766E]" />
                    </button>
                    <button
                      onClick={() => onNavigate('summary', trip.trip_id)}
                      className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#183153] border border-[#E2E8F0] hover:bg-slate-50 transition-colors"
                      title="Print Dossier"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate('itinerary', trip.trip_id)}
                      className="px-3.5 py-1.5 rounded-md text-xs font-bold text-white bg-[#183153] hover:bg-[#0F766E] transition-colors flex items-center gap-1 shadow-xs"
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

        {filteredTrips.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-[#E2E8F0]">
            <p className="text-sm text-[#64748B]">No trips match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="mt-2 text-xs text-[#0F766E] font-medium hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!tripToDelete}
          title="Delete Saved Trip"
          message={`Are you sure you want to permanently delete "${tripToDelete?.destination}"? All scheduled days and budget expense rows will be removed from storage.`}
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
