/**
 * Personalized Trip Planning System - Recommendation & Budget Engine
 * Deterministic, testable heuristic algorithm for itinerary generation and cost estimation.
 */

import { DESTINATIONS } from '../data/destinations';
import {
  Activity,
  Attraction,
  BudgetSummary,
  BudgetTier,
  Destination,
  Expense,
  ExpenseCategory,
  InterestType,
  ItineraryDay,
  TimeSlot,
  Travelers,
  TripPlanningFormData,
} from '../types';

export function calculateTripDurationDays(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 1;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
}

export function formatDateForDay(startDateStr: string, dayIndex: number): string {
  const date = new Date(startDateStr);
  date.setDate(date.getDate() + dayIndex);
  return date.toISOString().split('T')[0];
}

/**
 * Score an attraction based on user interests, budget tier, and category alignment.
 */
export function scoreAttraction(
  attraction: Attraction,
  selectedInterests: InterestType[],
  budgetTier: BudgetTier
): number {
  let score = 10; // Baseline score

  // 1. Primary category match
  if (selectedInterests.includes(attraction.category)) {
    score += 50;
  }

  // 2. Overlap with recommended interests
  const interestOverlap = attraction.recommended_for_interests.filter((i) =>
    selectedInterests.includes(i)
  ).length;
  score += interestOverlap * 20;

  // 3. Budget Tier compatibility
  if (budgetTier === 'Budget') {
    // Prefer free or lower cost
    if (attraction.cost_inr === 0) score += 30;
    else if (attraction.cost_inr <= 250) score += 20;
    else if (attraction.cost_inr > 1000) score -= 30;
  } else if (budgetTier === 'Luxury') {
    // Premium experiences
    if (attraction.cost_inr >= 800) score += 25;
  }

  return score;
}

/**
 * Generates day-wise itinerary activities
 */
export function generateItineraryDays(
  tripId: string,
  destination: Destination,
  startDate: string,
  durationDays: number,
  selectedInterests: InterestType[],
  budgetTier: BudgetTier,
  travelers: Travelers
): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  const totalTravelers = travelers.adults + travelers.children;

  // Score and sort attractions
  const scoredAttractions = [...destination.attractions]
    .map((attr) => ({
      attraction: attr,
      score: scoreAttraction(attr, selectedInterests, budgetTier),
    }))
    .sort((a, b) => b.score - a.score);

  // Pool of available attractions to distribute
  let attractionPool = scoredAttractions.map((s) => s.attraction);

  // If trip duration needs more attractions than we have, wrap around
  if (attractionPool.length === 0) {
    attractionPool = [...destination.attractions];
  }

  let poolIndex = 0;

  for (let dayNumber = 1; dayNumber <= durationDays; dayNumber++) {
    const dayDate = formatDateForDay(startDate, dayNumber - 1);
    const dayId = `${tripId}-day-${dayNumber}`;
    const dayActivities: Activity[] = [];

    const slots: TimeSlot[] = ['Morning', 'Afternoon', 'Evening'];

    for (const slot of slots) {
      // Pick attraction matching slot or next available
      let picked: Attraction | undefined;

      // Find an attraction matching slot preference that hasn't been overused
      const matchIndex = attractionPool.findIndex(
        (a, idx) => idx >= poolIndex && a.time_slot_preference === slot
      );

      if (matchIndex !== -1) {
        picked = attractionPool[matchIndex];
        // Swap to current position
        const [removed] = attractionPool.splice(matchIndex, 1);
        attractionPool.push(removed);
      } else {
        // Fallback to pool modulo
        picked = attractionPool[poolIndex % attractionPool.length];
        poolIndex++;
      }

      if (picked) {
        // Calculate estimated cost for party
        const perPersonCost = picked.cost_inr;
        const totalActivityCost =
          perPersonCost * travelers.adults + Math.round(perPersonCost * 0.5 * travelers.children);

        dayActivities.push({
          activity_id: `${dayId}-act-${slot.toLowerCase()}`,
          itinerary_day_id: dayId,
          activity_name: picked.name,
          description: picked.description,
          time_slot: slot,
          duration_hours: picked.duration_hours,
          estimated_cost: totalActivityCost,
          category: picked.category,
          location_hint: picked.location_hint,
          is_custom: false,
        });
      }
    }

    days.push({
      itinerary_day_id: dayId,
      trip_id: tripId,
      day_number: dayNumber,
      date: dayDate,
      theme: getDayTheme(dayNumber, dayActivities),
      activities: dayActivities,
    });
  }

  return days;
}

function getDayTheme(dayNumber: number, activities: Activity[]): string {
  if (dayNumber === 1) return 'Arrival, Landmark Exploration & Welcome';
  const categories = activities.map((a) => a.category);
  if (categories.includes('Nature') || categories.includes('Mountains'))
    return 'Scenic Vistas & Nature Walk';
  if (categories.includes('Historical places'))
    return 'Heritage, Architecture & Cultural Trail';
  if (categories.includes('Beaches') || categories.includes('Adventure'))
    return 'Coastal Escapades & Outdoor Discovery';
  return 'Local Flavours, Bazaars & Evening Leisure';
}

/**
 * Calculates budget breakdown across 5 categories
 */
export function calculateBudgetBreakdown(
  tripId: string,
  destination: Destination,
  startingLocation: string,
  durationDays: number,
  travelers: Travelers,
  budgetTier: BudgetTier,
  itineraryDays: ItineraryDay[]
): Expense[] {
  const totalTravelers = travelers.adults + travelers.children;
  const nights = Math.max(1, durationDays - 1);

  // 1. Sightseeing from scheduled activities
  const sightseeingCost = itineraryDays.reduce((sum, day) => {
    return (
      sum +
      day.activities.reduce((daySum, act) => daySum + (act.estimated_cost || 0), 0)
    );
  }, 0);

  // 2. Transportation
  // Base distance factor (inter-city train/flight estimate) + local cabs/autos
  let intercityPerPerson = 2500;
  if (budgetTier === 'Budget') intercityPerPerson = 1200; // Train / AC sleeper bus
  else if (budgetTier === 'Luxury') intercityPerPerson = 6500; // Flights & private pickup

  const localTransitPerDay =
    budgetTier === 'Budget' ? 400 : budgetTier === 'Moderate' ? 1200 : 2800;

  const totalTransport = Math.round(
    intercityPerPerson * totalTravelers + localTransitPerDay * durationDays
  );

  // 3. Accommodation
  // Room calculation: 2 adults per room, children with parents
  const roomsNeeded = Math.max(1, Math.ceil(travelers.adults / 2));
  let roomNightRate = 1800; // Clean 2/3 star
  if (budgetTier === 'Budget') roomNightRate = 1100; // Guesthouse / budget hotel
  else if (budgetTier === 'Luxury') roomNightRate = 6500; // 4/5 star heritage resort

  const totalAccommodation = roomNightRate * roomsNeeded * nights;

  // 4. Food & Dining
  let dailyFoodPerPerson = 700;
  if (budgetTier === 'Budget') dailyFoodPerPerson = 450;
  else if (budgetTier === 'Luxury') dailyFoodPerPerson = 1800;

  const totalFood = Math.round(
    dailyFoodPerPerson * (travelers.adults + travelers.children * 0.7) * durationDays
  );

  // 5. Miscellaneous (contingency, tips, snacks, shopping buffer)
  const baseExpenses = totalTransport + totalAccommodation + totalFood + sightseeingCost;
  const totalMisc = Math.round(baseExpenses * 0.08);

  const expenses: Expense[] = [
    {
      expense_id: `${tripId}-exp-trans`,
      trip_id: tripId,
      category: 'Transportation',
      amount: totalTransport,
      description: `Intercity travel from ${startingLocation} & local transit (${durationDays} days)`,
      is_estimated: true,
    },
    {
      expense_id: `${tripId}-exp-hotel`,
      trip_id: tripId,
      category: 'Accommodation',
      amount: totalAccommodation,
      description: `${nights} nights lodging for ${roomsNeeded} room(s) (${budgetTier} tier)`,
      is_estimated: true,
    },
    {
      expense_id: `${tripId}-exp-food`,
      trip_id: tripId,
      category: 'Food',
      amount: totalFood,
      description: `Daily breakfast, regional dining & street specialties for party`,
      is_estimated: true,
    },
    {
      expense_id: `${tripId}-exp-sight`,
      trip_id: tripId,
      category: 'Sightseeing',
      amount: sightseeingCost,
      description: `Admission tickets, permits & activities scheduled in itinerary`,
      is_estimated: true,
    },
    {
      expense_id: `${tripId}-exp-misc`,
      trip_id: tripId,
      category: 'Miscellaneous',
      amount: totalMisc,
      description: `Emergency contingency, tips, and local market miscellaneous (8%)`,
      is_estimated: true,
    },
  ];

  return expenses;
}

/**
 * Summarizes the budget vs. allocated limit
 */
export function computeBudgetSummary(
  totalAllocated: number,
  expenses: Expense[]
): BudgetSummary {
  const category_breakdown: Record<ExpenseCategory, number> = {
    Transportation: 0,
    Accommodation: 0,
    Food: 0,
    Sightseeing: 0,
    Miscellaneous: 0,
  };

  let total_estimated = 0;
  for (const exp of expenses) {
    category_breakdown[exp.category] = (category_breakdown[exp.category] || 0) + exp.amount;
    total_estimated += exp.amount;
  }

  const remaining = totalAllocated - total_estimated;
  const is_exceeded = total_estimated > totalAllocated;

  return {
    total_allocated: totalAllocated,
    total_estimated,
    remaining,
    is_exceeded,
    category_breakdown,
  };
}

/**
 * High-level Trip Builder combining algorithm, itinerary generation, and budget breakdown
 */
export function buildPersonalizedTrip(
  formData: TripPlanningFormData,
  userId: string
): {
  trip_id: string;
  duration_days: number;
  itinerary_days: ItineraryDay[];
  expenses: Expense[];
  cover_image: string;
} {
  const tripId = `trip-${Date.now()}`;
  const duration = calculateTripDurationDays(formData.start_date, formData.end_date);

  // Match destination from database
  const dest =
    DESTINATIONS.find(
      (d) =>
        d.id.toLowerCase() === formData.destination.toLowerCase() ||
        d.name.toLowerCase().includes(formData.destination.toLowerCase())
    ) || DESTINATIONS[0];

  const itineraryDays = generateItineraryDays(
    tripId,
    dest,
    formData.start_date,
    duration,
    formData.selected_interests,
    formData.budget_type,
    formData.travelers
  );

  const expenses = calculateBudgetBreakdown(
    tripId,
    dest,
    formData.starting_location,
    duration,
    formData.travelers,
    formData.budget_type,
    itineraryDays
  );

  return {
    trip_id: tripId,
    duration_days: duration,
    itinerary_days: itineraryDays,
    expenses,
    cover_image: dest.coverImage,
  };
}
