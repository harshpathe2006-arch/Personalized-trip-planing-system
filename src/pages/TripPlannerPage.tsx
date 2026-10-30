import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass,
  Check,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import { DESTINATIONS, POPULAR_STARTING_LOCATIONS } from '../data/destinations';
import {
  BudgetTier,
  InterestType,
  TripPlanningFormData,
  User,
  Trip,
} from '../types';
import {
  calculateTripDurationDays,
  buildPersonalizedTrip,
} from '../services/recommendationEngine';

interface TripPlannerPageProps {
  currentUser: User | null;
  initialDestinationId?: string;
  onTripGenerated: (trip: Trip) => void;
  onNavigateToLogin: () => void;
}

const ALL_INTERESTS: { id: InterestType; label: string; desc: string }[] = [
  { id: 'Nature', label: 'Nature', desc: 'Waterfalls, parks, flora & scenic trails' },
  { id: 'Adventure', label: 'Adventure', desc: 'Paragliding, trekking, scuba & water sports' },
  { id: 'Beaches', label: 'Beaches', desc: 'Coastal sands, ocean vistas & sea breezes' },
  { id: 'Mountains', label: 'Mountains', desc: 'High-altitude ridges, valleys & alpine passes' },
  { id: 'Historical places', label: 'Historical places', desc: 'Forts, palaces, museums & architecture' },
  { id: 'Religious tourism', label: 'Religious tourism', desc: 'Ancient temples, ghats, aartis & shrines' },
  { id: 'Food', label: 'Food', desc: 'Regional delicacies, street eats & authentic thalis' },
  { id: 'Shopping', label: 'Shopping', desc: 'Traditional bazaars, handicrafts & local silk' },
  { id: 'Wildlife', label: 'Wildlife', desc: 'Sanctuaries, safaris & endemic animals' },
  { id: 'Relaxation', label: 'Relaxation', desc: 'Spas, tranquil backwaters & sunset viewpoints' },
];

export const TripPlannerPage: React.FC<TripPlannerPageProps> = ({
  currentUser,
  initialDestinationId,
  onTripGenerated,
  onNavigateToLogin,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedDestId, setSelectedDestId] = useState(initialDestinationId || 'jaipur');
  const [startingLocation, setStartingLocation] = useState('Mumbai');
  const [startDate, setStartDate] = useState('2026-11-20');
  const [endDate, setEndDate] = useState('2026-11-23');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [totalBudget, setTotalBudget] = useState(35000);
  const [budgetType, setBudgetType] = useState<BudgetTier>('Moderate');
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>([
    'Historical places',
    'Food',
  ]);

  const [stepError, setStepError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-calculated duration
  const tripDuration = calculateTripDurationDays(startDate, endDate);

  const selectedDestinationObj =
    DESTINATIONS.find((d) => d.id === selectedDestId) || DESTINATIONS[0];

  // Adjust recommended budget when destination or tier or duration changes
  const updateRecommendedBudget = (tier: BudgetTier) => {
    setBudgetType(tier);
    const dailyCost = selectedDestinationObj.avg_daily_cost[tier];
    const totalPeople = adults + children * 0.7;
    const est = Math.round(dailyCost * totalPeople * tripDuration + 3000 * totalPeople);
    setTotalBudget(Math.max(5000, est));
  };

  const handleInterestToggle = (interest: InterestType) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length === 1) {
        setStepError('Please select at least 1 interest category.');
        return;
      }
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      setStepError('');
    } else {
      setSelectedInterests([...selectedInterests, interest]);
      setStepError('');
    }
  };

  const validateStep = (step: number): boolean => {
    setStepError('');
    if (step === 1) {
      if (!selectedDestId) {
        setStepError('Please select a destination.');
        return false;
      }
      if (!startingLocation.trim()) {
        setStepError('Please specify your starting origin city.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!startDate || !endDate) {
        setStepError('Please choose both start and end travel dates.');
        return false;
      }
      if (new Date(endDate) < new Date(startDate)) {
        setStepError('End date cannot be earlier than start date.');
        return false;
      }
      if (tripDuration > 15) {
        setStepError('Maximum supported continuous itinerary duration is 15 days.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (adults < 1) {
        setStepError('At least 1 adult traveler is required.');
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (!totalBudget || totalBudget < 3000) {
        setStepError('Please enter a realistic trip budget (minimum ₹3,000).');
        return false;
      }
      return true;
    }

    if (step === 5) {
      if (selectedInterests.length === 0) {
        setStepError('Please choose at least 1 travel interest.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(6, prev + 1));
    }
  };

  const handleBack = () => {
    setStepError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleGenerate = () => {
    if (!currentUser) {
      onNavigateToLogin();
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const formData: TripPlanningFormData = {
        destination: selectedDestinationObj.name,
        starting_location: startingLocation,
        start_date: startDate,
        end_date: endDate,
        travelers: { adults, children },
        total_budget: totalBudget,
        budget_type: budgetType,
        selected_interests: selectedInterests,
      };

      const generated = buildPersonalizedTrip(formData, currentUser.user_id);

      const completeTrip: Trip = {
        trip_id: generated.trip_id,
        user_id: currentUser.user_id,
        destination: selectedDestinationObj.name,
        starting_location: startingLocation,
        start_date: startDate,
        end_date: endDate,
        duration_days: generated.duration_days,
        traveler_count: { adults, children },
        total_budget: totalBudget,
        budget_type: budgetType,
        selected_interests: selectedInterests,
        status: 'upcoming',
        created_at: new Date().toISOString(),
        itinerary_days: generated.itinerary_days,
        expenses: generated.expenses,
        cover_image: generated.cover_image,
      };

      setIsGenerating(false);
      onTripGenerated(completeTrip);
    }, 600);
  };

  const stepsList = [
    { num: 1, title: 'Destination' },
    { num: 2, title: 'Dates' },
    { num: 3, title: 'Travelers' },
    { num: 4, title: 'Budget' },
    { num: 5, title: 'Interests' },
    { num: 6, title: 'Generate' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">
                Personalized Trip Planner
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Step-by-step heuristic optimization based on budget, party size, and interests
              </p>
            </div>
            <div className="text-xs font-semibold text-[#0F766E] bg-teal-50 border border-teal-200 px-3 py-1 rounded-full self-start sm:self-auto">
              Step {currentStep} of 6: {stepsList[currentStep - 1].title}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-6">
            <div className="grid grid-cols-6 gap-2">
              {stepsList.map((step) => {
                const isCompleted = step.num < currentStep;
                const isCurrent = step.num === currentStep;

                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => {
                      if (step.num < currentStep) {
                        setCurrentStep(step.num);
                      }
                    }}
                    disabled={step.num > currentStep}
                    className="flex flex-col text-left focus:outline-hidden disabled:cursor-not-allowed"
                  >
                    <div
                      className={`h-2 rounded-full transition-all duration-200 ${
                        isCompleted
                          ? 'bg-[#0F766E]'
                          : isCurrent
                          ? 'bg-[#183153]'
                          : 'bg-slate-200'
                      }`}
                    />
                    <div className="mt-1.5 hidden sm:flex items-center gap-1">
                      <span
                        className={`text-[11px] font-semibold ${
                          isCurrent
                            ? 'text-[#183153]'
                            : isCompleted
                            ? 'text-[#0F766E]'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.num}. {step.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Validation Error Message */}
        {stepError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#E2E8F0] shadow-xs min-h-[380px] flex flex-col justify-between">
          {/* STEP 1: DESTINATION & ORIGIN */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#183153]">Select Target Destination</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Choose from our curated Indian destination databases with verified admission data.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DESTINATIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDestId(d.id)}
                    className={`p-3 rounded-lg border text-left transition-all relative flex flex-col ${
                      selectedDestId === d.id
                        ? 'border-[#0F766E] bg-teal-50/50 ring-2 ring-[#0F766E]/20'
                        : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="h-24 w-full rounded overflow-hidden mb-2 bg-slate-100">
                      <img
                        src={d.coverImage}
                        alt={d.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#183153]">{d.name}</span>
                      {selectedDestId === d.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                      {d.tagline}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  Starting Location (Origin City) *
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={startingLocation}
                    onChange={(e) => setStartingLocation(e.target.value)}
                    className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] sm:w-1/2 text-[#1F2937]"
                  >
                    {POPULAR_STARTING_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={startingLocation}
                    onChange={(e) => setStartingLocation(e.target.value)}
                    placeholder="Or type custom city..."
                    className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] sm:w-1/2 text-[#1F2937]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TRAVEL DATES */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#183153]">Select Travel Dates</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  The system automatically calculates trip duration and schedules morning,
                  afternoon, and evening time slots.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Departure Date (Start) *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#1F2937]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Return Date (End) *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#1F2937]"
                  />
                </div>
              </div>

              {/* Calculated Duration Display Banner */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#183153] text-white flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5 text-teal-300" />
                  </div>
                  <div>
                    <div className="text-xs text-[#64748B] font-medium">Calculated Duration</div>
                    <div className="text-base font-bold text-[#183153]">
                      {tripDuration} Days / {Math.max(1, tripDuration - 1)} Nights
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs text-[#64748B]">
                  <span>{tripDuration * 3} planned activity slots</span>
                </div>
              </div>

              <div className="text-xs text-[#64748B] bg-teal-50 border border-teal-200 p-3 rounded-md">
                <strong>Pacing Guideline:</strong> Our heuristic schedules up to 3 major
                activities per day to prevent travel fatigue and ensure high-quality experiences.
              </div>
            </div>
          )}

          {/* STEP 3: TRAVELERS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#183153]">Number of Travelers</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Party size influences room allocations, vehicle transit sizing, and meal budgets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 border border-[#E2E8F0] rounded-lg bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-[#183153]">Adults (Age 12+)</div>
                      <div className="text-xs text-[#64748B]">Full ticket and accommodation</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-md border border-[#E2E8F0] bg-white font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold text-base text-[#183153] w-6 text-center">
                        {adults}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                        className="w-8 h-8 rounded-md border border-[#E2E8F0] bg-white font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-[#E2E8F0] rounded-lg bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-[#183153]">Children (Under 12)</div>
                      <div className="text-xs text-[#64748B]">Discounted tickets & shared room</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                        className="w-8 h-8 rounded-md border border-[#E2E8F0] bg-white font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold text-base text-[#183153] w-6 text-center">
                        {children}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.min(6, prev + 1))}
                        className="w-8 h-8 rounded-md border border-[#E2E8F0] bg-white font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-[#64748B]">
                Total travelers:{' '}
                <strong className="text-[#183153]">{adults + children} persons</strong> (Requires ~
                {Math.max(1, Math.ceil(adults / 2))} hotel room(s))
              </div>
            </div>
          )}

          {/* STEP 4: BUDGET & TIER */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#183153]">Budget & Style Preference</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Set your total financial ceiling in Indian Rupees (₹) and your desired travel tier.
                </p>
              </div>

              {/* 3 Tier Selector Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Budget', 'Moderate', 'Luxury'] as BudgetTier[]).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => updateRecommendedBudget(tier)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      budgetType === tier
                        ? 'border-[#0F766E] bg-teal-50/50 ring-2 ring-[#0F766E]/20'
                        : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#183153]">{tier}</span>
                      {budgetType === tier && <Check className="w-4 h-4 text-[#0F766E]" />}
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1">
                      {tier === 'Budget' && 'Homestays, public transport & low-cost sights'}
                      {tier === 'Moderate' && '3-star hotels, cabs & comfortable dining'}
                      {tier === 'Luxury' && 'Resorts, private transfers & fine experiences'}
                    </p>
                  </button>
                ))}
              </div>

              {/* Total Budget Input */}
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  Total Trip Budget in INR (₹) *
                </label>
                <div className="relative max-w-sm">
                  <div className="absolute left-3 top-2.5 text-slate-500 font-bold">₹</div>
                  <input
                    type="number"
                    min="3000"
                    step="1000"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 text-base font-semibold border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#1F2937]"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[20000, 35000, 50000, 75000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTotalBudget(preset)}
                      className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: INTERESTS */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#183153]">Select Travel Interests</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Our algorithm prioritizes attractions that align with your selected interests.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {ALL_INTERESTS.map((item) => {
                  const isChecked = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleInterestToggle(item.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isChecked
                          ? 'border-[#0F766E] bg-teal-50 text-[#0F766E] shadow-xs'
                          : 'border-[#E2E8F0] bg-white text-[#1F2937] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs sm:text-sm">{item.label}</span>
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-tight">{item.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-[#64748B]">
                Selected ({selectedInterests.length}):{' '}
                <span className="text-[#183153] font-medium">
                  {selectedInterests.join(', ')}
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: TRIP GENERATION REVIEW */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#183153]">
                  Review & Generate Personalized Itinerary
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Confirm your parameters before the system synthesizes your daily schedule.
                </p>
              </div>

              <div className="bg-slate-50 border border-[#E2E8F0] rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#64748B] block">Destination</span>
                    <span className="font-bold text-[#183153] text-sm">
                      {selectedDestinationObj.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Starting Location</span>
                    <span className="font-bold text-[#183153] text-sm">{startingLocation}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Dates & Duration</span>
                    <span className="font-bold text-[#183153] text-sm">
                      {startDate} to {endDate} ({tripDuration} Days)
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Party Size</span>
                    <span className="font-bold text-[#183153] text-sm">
                      {adults} Adults, {children} Children
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Allocated Budget</span>
                    <span className="font-bold text-[#0F766E] text-sm">
                      ₹{totalBudget.toLocaleString('en-IN')} ({budgetType})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Interests Matched</span>
                    <span className="font-bold text-[#183153] text-sm">
                      {selectedInterests.length} Categories
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <span className="text-xs font-semibold text-[#183153] block mb-1">
                    Algorithm Pipeline Highlights:
                  </span>
                  <ul className="text-xs text-[#64748B] list-disc list-inside space-y-0.5">
                    <li>Weighted attraction matching based on selected travel categories</li>
                    <li>
                      Morning, Afternoon, and Evening temporal distribution with duration caps
                    </li>
                    <li>
                      Estimated category expenses (Transit, Lodging, Food, Sightseeing, Misc)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Footer Controls */}
          <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between gap-3 mt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isGenerating}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-[#1F2937] bg-white border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#183153] hover:bg-[#12243d] rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0c625c] rounded-md shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Personalized Itinerary</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
