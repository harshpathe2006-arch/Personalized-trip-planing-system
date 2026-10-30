import React, { useState } from 'react';
import { X, Plus, Clock, IndianRupee, Tag, MapPin } from 'lucide-react';
import { Activity, InterestType, TimeSlot } from '../types';

interface AddActivityModalProps {
  isOpen: boolean;
  dayNumber: number;
  itineraryDayId: string;
  onClose: () => void;
  onAdd: (activity: Activity) => void;
}

const INTEREST_OPTIONS: InterestType[] = [
  'Historical places',
  'Nature',
  'Adventure',
  'Beaches',
  'Mountains',
  'Food',
  'Shopping',
  'Religious tourism',
  'Wildlife',
  'Relaxation',
];

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  dayNumber,
  itineraryDayId,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('Morning');
  const [durationHours, setDurationHours] = useState(2);
  const [costInr, setCostInr] = useState(0);
  const [category, setCategory] = useState<InterestType>('Historical places');
  const [locationHint, setLocationHint] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an activity name.');
      return;
    }

    const newActivity: Activity = {
      activity_id: `act-custom-${Date.now()}`,
      itinerary_day_id: itineraryDayId,
      activity_name: name.trim(),
      description: description.trim() || 'Custom planned activity.',
      time_slot: timeSlot,
      duration_hours: Number(durationHours) || 2,
      estimated_cost: Number(costInr) || 0,
      category,
      location_hint: locationHint.trim() || 'Local area',
      is_custom: true,
    };

    onAdd(newActivity);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-act-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-lg shadow-xl border border-[#E2E8F0] max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 id="add-act-title" className="text-lg font-bold text-[#183153]">
              Add Custom Activity
            </h3>
            <p className="text-xs text-[#64748B]">Insert into Day {dayNumber} Schedule</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1">
              Activity Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Sunset Boat Ride / Local Craft Bazaar"
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Preferred Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InterestType)}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
              >
                {INTEREST_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                Duration (Hours)
              </label>
              <input
                type="number"
                min="0.5"
                max="8"
                step="0.5"
                value={durationHours}
                onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-[#64748B]" />
                Estimated Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={costInr}
                onChange={(e) => setCostInr(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
              Location / Neighborhood
            </label>
            <input
              type="text"
              value={locationHint}
              onChange={(e) => setLocationHint(e.target.value)}
              placeholder="e.g. Near City Center / Old Promenade"
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key sights to see, ticket booking details, attire guidelines..."
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#1F2937] bg-white border border-[#E2E8F0] rounded-md hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#0F766E] hover:bg-[#0c625c] rounded-md shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
