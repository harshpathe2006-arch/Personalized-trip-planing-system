import { Trip, User } from '../types';
import { DESTINATIONS } from '../data/destinations';
import { generateItineraryDays, calculateBudgetBreakdown } from './recommendationEngine';

const TRIPS_STORAGE_KEY = 'personalized_trip_planner_trips';
const USERS_STORAGE_KEY = 'personalized_trip_planner_users';

export const DEMO_USER: User = {
  user_id: 'user-it-demo-001',
  full_name: 'Harsh Pathe',
  email: 'harsh.it@engg.edu',
  password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // hashed 'Password@123'
  created_at: '2026-09-15T10:00:00.000Z',
};

function seedInitialTrips(): Trip[] {
  const jaipurDest = DESTINATIONS[0];
  const goaDest = DESTINATIONS[1];

  const jaipurTripId = 'trip-seed-jaipur-01';
  const jaipurDays = generateItineraryDays(
    jaipurTripId,
    jaipurDest,
    '2026-11-15',
    3,
    ['Historical places', 'Food', 'Shopping'],
    'Moderate',
    { adults: 2, children: 0 }
  );
  const jaipurExpenses = calculateBudgetBreakdown(
    jaipurTripId,
    jaipurDest,
    'Mumbai',
    3,
    { adults: 2, children: 0 },
    'Moderate',
    jaipurDays
  );

  const goaTripId = 'trip-seed-goa-02';
  const goaDays = generateItineraryDays(
    goaTripId,
    goaDest,
    '2026-12-24',
    4,
    ['Beaches', 'Adventure', 'Food'],
    'Moderate',
    { adults: 2, children: 1 }
  );
  const goaExpenses = calculateBudgetBreakdown(
    goaTripId,
    goaDest,
    'Pune',
    4,
    { adults: 2, children: 1 },
    'Moderate',
    goaDays
  );

  return [
    {
      trip_id: jaipurTripId,
      user_id: DEMO_USER.user_id,
      destination: 'Jaipur, Rajasthan',
      starting_location: 'Mumbai',
      start_date: '2026-11-15',
      end_date: '2026-11-17',
      duration_days: 3,
      traveler_count: { adults: 2, children: 0 },
      total_budget: 35000,
      budget_type: 'Moderate',
      selected_interests: ['Historical places', 'Food', 'Shopping'],
      status: 'upcoming',
      created_at: '2026-10-15T09:30:00.000Z',
      itinerary_days: jaipurDays,
      expenses: jaipurExpenses,
      cover_image: jaipurDest.coverImage,
    },
    {
      trip_id: goaTripId,
      user_id: DEMO_USER.user_id,
      destination: 'Goa',
      starting_location: 'Pune',
      start_date: '2026-12-24',
      end_date: '2026-12-27',
      duration_days: 4,
      traveler_count: { adults: 2, children: 1 },
      total_budget: 45000,
      budget_type: 'Moderate',
      selected_interests: ['Beaches', 'Adventure', 'Food'],
      status: 'upcoming',
      created_at: '2026-10-20T14:15:00.000Z',
      itinerary_days: goaDays,
      expenses: goaExpenses,
      cover_image: goaDest.coverImage,
    },
  ];
}

export const StorageService = {
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) {
        const initial = [DEMO_USER];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [DEMO_USER];
    }
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex((u) => u.user_id === user.user_id || u.email === user.email);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  getTrips(): Trip[] {
    try {
      const data = localStorage.getItem(TRIPS_STORAGE_KEY);
      if (!data) {
        const initial = seedInitialTrips();
        localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed: Trip[] = JSON.parse(data);
      // Migrate old image URLs if cached
      const sanitized = parsed.map((t) => {
        if (
          !t.cover_image ||
          t.cover_image.includes('photo-1603262110263') ||
          t.cover_image.includes('photo-1561361513')
        ) {
          const match = DESTINATIONS.find((d) => d.name.toLowerCase().includes(t.destination.toLowerCase().slice(0, 4)));
          return {
            ...t,
            cover_image: match ? match.coverImage : DESTINATIONS[0].coverImage,
          };
        }
        return t;
      });
      return sanitized;
    } catch {
      return seedInitialTrips();
    }
  },

  getTripsForUser(userId: string): Trip[] {
    const all = this.getTrips();
    return all.filter((t) => t.user_id === userId);
  },

  getTripById(tripId: string): Trip | undefined {
    const all = this.getTrips();
    return all.find((t) => t.trip_id === tripId);
  },

  saveTrip(trip: Trip): void {
    const all = this.getTrips();
    const index = all.findIndex((t) => t.trip_id === trip.trip_id);
    if (index >= 0) {
      all[index] = trip;
    } else {
      all.unshift(trip);
    }
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(all));
  },

  deleteTrip(tripId: string): boolean {
    const all = this.getTrips();
    const filtered = all.filter((t) => t.trip_id !== tripId);
    if (filtered.length !== all.length) {
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  resetDemoData(): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEMO_USER]));
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(seedInitialTrips()));
  },
};
