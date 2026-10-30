/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trip, User } from './types';
import { AuthService } from './services/authService';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { BudgetPlannerPage } from './pages/BudgetPlannerPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { TripSummaryPage } from './pages/TripSummaryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ArchitectureDocsPage } from './pages/ArchitectureDocsPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    AuthService.getCurrentUser()
  );
  const [trips, setTrips] = useState<Trip[]>(() => StorageService.getTrips());
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedTripId, setSelectedTripId] = useState<string | undefined>(undefined);
  const [plannerDestinationId, setPlannerDestinationId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, selectedTripId]);

  const handleNavigate = (page: string, tripId?: string) => {
    if (tripId) {
      setSelectedTripId(tripId);
    }
    setActivePage(page);
  };

  const handleStartPlanning = (destinationId?: string) => {
    if (destinationId) {
      setPlannerDestinationId(destinationId);
    }
    setActivePage('planner');
  };

  const handleTripGenerated = (newTrip: Trip) => {
    StorageService.saveTrip(newTrip);
    setTrips(StorageService.getTrips());
    setSelectedTripId(newTrip.trip_id);
    setActivePage('itinerary');
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    StorageService.saveTrip(updatedTrip);
    setTrips(StorageService.getTrips());
  };

  const handleDeleteTrip = (tripId: string) => {
    StorageService.deleteTrip(tripId);
    setTrips(StorageService.getTrips());
  };

  const handleLoginSuccess = () => {
    setCurrentUser(AuthService.getCurrentUser());
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setActivePage('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Resolve current active trip object if needed
  const activeTrip =
    trips.find((t) => t.trip_id === selectedTripId) ||
    trips.find((t) => currentUser && t.user_id === currentUser.user_id) ||
    trips[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-[#1F2937]">
      <Navbar
        currentUser={currentUser}
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onStartPlanning={handleStartPlanning}
            onNavigateToLogin={() => setActivePage('login')}
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            onSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setActivePage('register')}
            onNavigateToHome={() => setActivePage('home')}
          />
        )}

        {activePage === 'register' && (
          <RegisterPage
            onSuccess={handleLoginSuccess}
            onNavigateToLogin={() => setActivePage('login')}
          />
        )}

        {activePage === 'dashboard' && currentUser && (
          <DashboardPage
            currentUser={currentUser}
            trips={trips}
            onNavigate={handleNavigate}
            onDeleteTrip={handleDeleteTrip}
          />
        )}

        {activePage === 'dashboard' && !currentUser && (
          <LoginPage
            onSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setActivePage('register')}
          />
        )}

        {activePage === 'planner' && (
          <TripPlannerPage
            currentUser={currentUser}
            initialDestinationId={plannerDestinationId}
            onTripGenerated={handleTripGenerated}
            onNavigateToLogin={() => setActivePage('login')}
          />
        )}

        {activePage === 'itinerary' && activeTrip && (
          <ItineraryPage
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'budget' && (
          <BudgetPlannerPage
            trips={
              currentUser
                ? trips.filter((t) => t.user_id === currentUser.user_id)
                : trips
            }
            activeTripId={selectedTripId}
            onUpdateTrip={handleUpdateTrip}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'my-trips' && currentUser && (
          <MyTripsPage
            currentUser={currentUser}
            trips={trips}
            onNavigate={handleNavigate}
            onDeleteTrip={handleDeleteTrip}
          />
        )}

        {activePage === 'my-trips' && !currentUser && (
          <LoginPage
            onSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setActivePage('register')}
          />
        )}

        {activePage === 'summary' && activeTrip && (
          <TripSummaryPage
            trip={activeTrip}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'profile' && currentUser && (
          <ProfilePage
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
          />
        )}

        {activePage === 'architecture' && <ArchitectureDocsPage />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
