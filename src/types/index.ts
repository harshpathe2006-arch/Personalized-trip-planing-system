/**
 * Personalized Trip Planning System - Type Definitions
 * Maps to Normalized Relational Schema for Second Year IT Engineering Mini-Project
 */

export type InterestType =
  | 'Nature'
  | 'Adventure'
  | 'Beaches'
  | 'Mountains'
  | 'Historical places'
  | 'Religious tourism'
  | 'Food'
  | 'Shopping'
  | 'Wildlife'
  | 'Relaxation';

export type BudgetTier = 'Budget' | 'Moderate' | 'Luxury';

export type TripStatus = 'upcoming' | 'ongoing' | 'completed';

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening';

export type ExpenseCategory =
  | 'Transportation'
  | 'Accommodation'
  | 'Food'
  | 'Sightseeing'
  | 'Miscellaneous';

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface Attraction {
  id: string;
  name: string;
  category: InterestType;
  duration_hours: number;
  cost_inr: number;
  time_slot_preference: TimeSlot;
  description: string;
  location_hint: string;
  imageUrl?: string;
  recommended_for_interests: InterestType[];
  luxury_tier_only?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  tagline: string;
  description: string;
  coverImage: string;
  categories: InterestType[];
  best_season: string;
  starting_locations: string[];
  avg_daily_cost: {
    Budget: number;
    Moderate: number;
    Luxury: number;
  };
  attractions: Attraction[];
}

export interface Activity {
  activity_id: string;
  itinerary_day_id: string;
  activity_name: string;
  description: string;
  time_slot: TimeSlot;
  duration_hours: number;
  estimated_cost: number;
  category: InterestType;
  location_hint: string;
  is_custom?: boolean;
}

export interface ItineraryDay {
  itinerary_day_id: string;
  trip_id: string;
  day_number: number;
  date: string;
  theme?: string;
  activities: Activity[];
}

export interface Expense {
  expense_id: string;
  trip_id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  is_estimated: boolean;
}

export interface Travelers {
  adults: number;
  children: number;
}

export interface Trip {
  trip_id: string;
  user_id: string;
  destination: string;
  starting_location: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  traveler_count: Travelers;
  total_budget: number;
  budget_type: BudgetTier;
  selected_interests: InterestType[];
  status: TripStatus;
  created_at: string;
  itinerary_days: ItineraryDay[];
  expenses: Expense[];
  cover_image?: string;
}

export interface BudgetSummary {
  total_allocated: number;
  total_estimated: number;
  remaining: number;
  is_exceeded: boolean;
  category_breakdown: Record<ExpenseCategory, number>;
}

export interface TripPlanningFormData {
  destination: string;
  starting_location: string;
  start_date: string;
  end_date: string;
  travelers: Travelers;
  total_budget: number;
  budget_type: BudgetTier;
  selected_interests: InterestType[];
}
