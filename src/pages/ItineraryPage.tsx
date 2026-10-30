import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  IndianRupee,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Save,
  ArrowLeft,
  Wallet,
  Printer,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Activity, ItineraryDay, TimeSlot, Trip } from '../types';
import { AddActivityModal } from '../components/AddActivityModal';

interface ItineraryPageProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onNavigate: (page: string, tripId?: string) => void;
}

export const ItineraryPage: React.FC<ItineraryPageProps> = ({
  trip,
  onUpdateTrip,
  onNavigate,
}) => {
  const [currentTrip, setCurrentTrip] = useState<Trip>(trip);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const activeDay =
    currentTrip.itinerary_days.find((d) => d.day_number === selectedDayNumber) ||
    currentTrip.itinerary_days[0];

  const handleRemoveActivity = (activityId: string) => {
    const updatedDays = currentTrip.itinerary_days.map((day) => {
      if (day.day_number === selectedDayNumber) {
        return {
          ...day,
          activities: day.activities.filter((a) => a.activity_id !== activityId),
        };
      }
      return day;
    });

    // Recalculate sightseeing expense
    const newSightseeingTotal = updatedDays.reduce((acc, d) => {
      return acc + d.activities.reduce((dAcc, act) => dAcc + (act.estimated_cost || 0), 0);
    }, 0);

    const updatedExpenses = currentTrip.expenses.map((exp) => {
      if (exp.category === 'Sightseeing') {
        return { ...exp, amount: newSightseeingTotal };
      }
      return exp;
    });

    const updated = {
      ...currentTrip,
      itinerary_days: updatedDays,
      expenses: updatedExpenses,
    };

    setCurrentTrip(updated);
    onUpdateTrip(updated);
  };

  const handleAddActivity = (newActivity: Activity) => {
    const updatedDays = currentTrip.itinerary_days.map((day) => {
      if (day.day_number === selectedDayNumber) {
        return {
          ...day,
          activities: [...day.activities, newActivity],
        };
      }
      return day;
    });

    const newSightseeingTotal = updatedDays.reduce((acc, d) => {
      return acc + d.activities.reduce((dAcc, act) => dAcc + (act.estimated_cost || 0), 0);
    }, 0);

    const updatedExpenses = currentTrip.expenses.map((exp) => {
      if (exp.category === 'Sightseeing') {
        return { ...exp, amount: newSightseeingTotal };
      }
      return exp;
    });

    const updated = {
      ...currentTrip,
      itinerary_days: updatedDays,
      expenses: updatedExpenses,
    };

    setCurrentTrip(updated);
    onUpdateTrip(updated);
  };

  const handleSaveTrip = () => {
    onUpdateTrip(currentTrip);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const getSlotIcon = (slot: TimeSlot) => {
    if (slot === 'Morning') return <Sun className="w-4 h-4 text-amber-500" />;
    if (slot === 'Afternoon') return <Sun className="w-4 h-4 text-orange-500" />;
    return <Moon className="w-4 h-4 text-indigo-400" />;
  };

  const dayTotalCost = activeDay
    ? activeDay.activities.reduce((sum, a) => sum + (a.estimated_cost || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Trip Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#183153] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('budget', currentTrip.trip_id)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#183153] bg-white border border-[#E2E8F0] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Budget Breakdown</span>
            </button>
            <button
              onClick={() => onNavigate('summary', currentTrip.trip_id)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#183153] bg-white border border-[#E2E8F0] hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={handleSaveTrip}
              className="px-4 py-1.5 rounded-md text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0c625c] transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Itinerary</span>
            </button>
          </div>
        </div>

        {saveSuccessNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Itinerary changes and custom activities saved to database successfully.</span>
          </div>
        )}

        {/* Hero Header Card */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                {currentTrip.duration_days} Days / {Math.max(1, currentTrip.duration_days - 1)} Nights
              </span>
              <span className="text-xs text-[#64748B]">
                • {currentTrip.budget_type} Tier
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#183153] tracking-tight mt-1">
              {currentTrip.destination}
            </h1>
            <p className="text-xs text-[#64748B] mt-1 flex flex-wrap items-center gap-3">
              <span>
                Origin: <strong>{currentTrip.starting_location}</strong>
              </span>
              <span>•</span>
              <span>
                Dates: <strong>{currentTrip.start_date}</strong> to{' '}
                <strong>{currentTrip.end_date}</strong>
              </span>
              <span>•</span>
              <span>
                Travelers:{' '}
                <strong>
                  {currentTrip.traveler_count.adults} Adults
                  {currentTrip.traveler_count.children > 0
                    ? `, ${currentTrip.traveler_count.children} Children`
                    : ''}
                </strong>
              </span>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-right shrink-0">
            <div className="text-[11px] text-[#64748B] font-medium">Trip Allocated Budget</div>
            <div className="text-xl font-bold text-[#183153]">
              ₹{currentTrip.total_budget.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-[#0F766E] font-medium">
              INR Standard Pricing
            </div>
          </div>
        </div>

        {/* Day Navigation Tabs */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-2 shadow-xs flex items-center gap-2 overflow-x-auto">
          {currentTrip.itinerary_days.map((day) => {
            const isSelected = day.day_number === selectedDayNumber;
            return (
              <button
                key={day.day_number}
                onClick={() => setSelectedDayNumber(day.day_number)}
                className={`px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#183153] text-white shadow-xs'
                    : 'text-[#1F2937] hover:bg-slate-100'
                }`}
              >
                <span>Day {day.day_number}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-slate-700 text-teal-300' : 'bg-slate-200 text-[#64748B]'
                  }`}
                >
                  {day.date}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Day Content */}
        {activeDay && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-4">
              <div>
                <div className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
                  Day {activeDay.day_number} Schedule • {activeDay.date}
                </div>
                <h2 className="text-xl font-bold text-[#183153] mt-0.5">
                  {activeDay.theme || 'Exploration & Leisure Trail'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <span className="text-[#64748B]">Day Activities Total: </span>
                  <span className="font-bold text-[#183153]">
                    ₹{dayTotalCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#0F766E] hover:bg-[#0c625c] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {activeDay.activities.map((activity, idx) => (
                <div
                  key={activity.activity_id || idx}
                  className="bg-slate-50/70 rounded-lg border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all hover:border-slate-300"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="p-2.5 rounded-md bg-white border border-slate-200 shrink-0">
                      {getSlotIcon(activity.time_slot)}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#183153] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
                          {activity.time_slot} Slot
                        </span>
                        <span className="text-xs bg-teal-50 text-[#0F766E] font-medium px-2 py-0.5 rounded border border-teal-200">
                          {activity.category}
                        </span>
                        {activity.is_custom && (
                          <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-200">
                            Custom Added
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#183153]">
                        {activity.activity_name}
                      </h3>

                      <p className="text-xs text-[#64748B] leading-relaxed max-w-2xl">
                        {activity.description}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                          <span>Duration: {activity.duration_hours} hrs</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                          <span>{activity.location_hint}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
                    <div className="text-right">
                      <div className="text-[10px] text-[#64748B]">Estimated Cost</div>
                      <div className="text-base font-bold text-[#183153]">
                        {activity.estimated_cost === 0 ? (
                          <span className="text-[#0F766E]">Free Admission</span>
                        ) : (
                          `₹${activity.estimated_cost.toLocaleString('en-IN')}`
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveActivity(activity.activity_id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors text-xs flex items-center gap-1"
                      title="Remove activity from day"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="md:hidden">Remove</span>
                    </button>
                  </div>
                </div>
              ))}

              {activeDay.activities.length === 0 && (
                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                  <p className="text-xs text-[#64748B]">
                    No activities scheduled for Day {activeDay.day_number}.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-3 text-xs text-[#0F766E] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Activity</span>
                  </button>
                </div>
              )}
            </div>

            {/* Travel Logistics Guidelines Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#64748B] space-y-1">
              <div className="font-bold text-[#183153] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Suggested Local Transit Arrangement</span>
              </div>
              <p>
                Pre-book morning transfers via app cab or dedicated auto-rickshaw hire. Allow 30–45
                minutes buffer for inter-neighborhood transfers between morning and afternoon
                locations.
              </p>
            </div>
          </div>
        )}

        {/* Modal for adding custom activity */}
        {activeDay && (
          <AddActivityModal
            isOpen={isAddModalOpen}
            dayNumber={activeDay.day_number}
            itineraryDayId={activeDay.itinerary_day_id}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddActivity}
          />
        )}
      </div>
    </div>
  );
};
