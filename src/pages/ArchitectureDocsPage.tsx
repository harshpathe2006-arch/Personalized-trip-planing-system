import React, { useState } from 'react';
import {
  Database,
  Code2,
  FileCode,
  Terminal,
  Layers,
  Copy,
  Check,
  Server,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ArchitectureDocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'schema' | 'sql' | 'springboot' | 'algorithm' | 'vscode'
  >('schema');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sqlDdl = `-- =========================================================================
-- PERSONALIZED TRIP PLANNING SYSTEM - RELATIONAL DATABASE SCHEMA
-- Target Database: Microsoft SQL Server / Azure SQL (Also PostgreSQL Compliant)
-- Academic Project: Second Year Information Technology Engineering Mini-Project
-- =========================================================================

-- 1. USERS TABLE
CREATE TABLE Users (
    user_id NVARCHAR(64) PRIMARY KEY,
    full_name NVARCHAR(120) NOT NULL,
    email NVARCHAR(150) NOT NULL UNIQUE,
    password_hash NVARCHAR(256) NOT NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

-- 2. TRIPS TABLE
CREATE TABLE Trips (
    trip_id NVARCHAR(64) PRIMARY KEY,
    user_id NVARCHAR(64) NOT NULL,
    destination NVARCHAR(150) NOT NULL,
    starting_location NVARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    traveler_count_adults INT NOT NULL DEFAULT 1,
    traveler_count_children INT NOT NULL DEFAULT 0,
    total_budget DECIMAL(12, 2) NOT NULL,
    budget_type NVARCHAR(20) NOT NULL CHECK (budget_type IN ('Budget', 'Moderate', 'Luxury')),
    status NVARCHAR(20) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
    cover_image NVARCHAR(500),
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Trips_Users FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 3. TRIP INTERESTS TABLE (Normalized Many-to-Many Bridge)
CREATE TABLE Trip_Interests (
    trip_interest_id INT IDENTITY(1,1) PRIMARY KEY,
    trip_id NVARCHAR(64) NOT NULL,
    interest_name NVARCHAR(50) NOT NULL,
    CONSTRAINT FK_TripInterests_Trips FOREIGN KEY (trip_id) REFERENCES Trips(trip_id) ON DELETE CASCADE
);

-- 4. ITINERARY DAYS TABLE
CREATE TABLE Itinerary_Days (
    itinerary_day_id NVARCHAR(64) PRIMARY KEY,
    trip_id NVARCHAR(64) NOT NULL,
    day_number INT NOT NULL,
    itinerary_date DATE NOT NULL,
    theme NVARCHAR(150),
    CONSTRAINT FK_ItineraryDays_Trips FOREIGN KEY (trip_id) REFERENCES Trips(trip_id) ON DELETE CASCADE
);

-- 5. ACTIVITIES TABLE
CREATE TABLE Activities (
    activity_id NVARCHAR(64) PRIMARY KEY,
    itinerary_day_id NVARCHAR(64) NOT NULL,
    activity_name NVARCHAR(200) NOT NULL,
    description NVARCHAR(1000),
    time_slot NVARCHAR(20) NOT NULL CHECK (time_slot IN ('Morning', 'Afternoon', 'Evening')),
    duration_hours DECIMAL(4, 2) NOT NULL DEFAULT 2.0,
    estimated_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    category NVARCHAR(50) NOT NULL,
    location_hint NVARCHAR(150),
    is_custom BIT DEFAULT 0,
    CONSTRAINT FK_Activities_ItineraryDays FOREIGN KEY (itinerary_day_id) REFERENCES Itinerary_Days(itinerary_day_id) ON DELETE CASCADE
);

-- 6. EXPENSES TABLE (5-Category Budget Tracking)
CREATE TABLE Expenses (
    expense_id NVARCHAR(64) PRIMARY KEY,
    trip_id NVARCHAR(64) NOT NULL,
    category NVARCHAR(30) NOT NULL CHECK (category IN ('Transportation', 'Accommodation', 'Food', 'Sightseeing', 'Miscellaneous')),
    amount DECIMAL(12, 2) NOT NULL,
    description NVARCHAR(255),
    is_estimated BIT DEFAULT 1,
    CONSTRAINT FK_Expenses_Trips FOREIGN KEY (trip_id) REFERENCES Trips(trip_id) ON DELETE CASCADE
);

-- INDEXES FOR PERFORMANCE OPTIMIZATION
CREATE INDEX IX_Trips_UserId ON Trips(user_id);
CREATE INDEX IX_ItineraryDays_TripId ON Itinerary_Days(trip_id);
CREATE INDEX IX_Activities_DayId ON Activities(itinerary_day_id);
CREATE INDEX IX_Expenses_TripId ON Expenses(trip_id);`;

  const springBootJava = `package com.tripplanner.controller;

import com.tripplanner.dto.TripRequestDTO;
import com.tripplanner.model.Trip;
import com.tripplanner.service.TripRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Spring Boot REST Controller for Trip Planning API
 * Department of Information Technology - Mini-Project
 */
@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:3000")
public class TripController {

    @Autowired
    private TripRecommendationService tripService;

    @PostMapping("/generate")
    public ResponseEntity<Trip> generatePersonalizedTrip(
            @RequestBody TripRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Trip trip = tripService.buildPersonalizedTrip(request, userDetails.getUsername());
        return ResponseEntity.ok(trip);
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getUserTrips(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(tripService.getTripsForUser(userDetails.getUsername()));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Trip> getTripById(@PathVariable String tripId) {
        return ResponseEntity.ok(tripService.getTripById(tripId));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<Void> deleteTrip(@PathVariable String tripId) {
        tripService.deleteTrip(tripId);
        return ResponseEntity.noContent().build();
    }
}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Academic Mini-Project Architectural Specifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#183153] tracking-tight">
            System Architecture & Database Schema
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-3xl leading-relaxed">
            Detailed engineering documentation for the Second Year IT Engineering Mini-Project.
            Includes the normalized 3NF relational schema, Microsoft SQL Server DDL scripts,
            Spring Boot REST service specifications, heuristic recommendation algorithm, and
            local execution instructions.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'schema', label: '1. Relational ER Schema', icon: Layers },
            { id: 'sql', label: '2. SQL Server DDL Script', icon: Database },
            { id: 'springboot', label: '3. Spring Boot Backend Spec', icon: Server },
            { id: 'algorithm', label: '4. Recommendation Logic', icon: Code2 },
            { id: 'vscode', label: '5. Local VS Code Setup', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#183153] text-white shadow-xs'
                    : 'text-[#1F2937] hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: RELATIONAL SCHEMA (3NF) */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#183153]">
                  Normalized Database Structure (Third Normal Form - 3NF)
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Entity-Relationship mapping showing primary keys (PK), foreign keys (FK), and
                  relationships.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Users Table Card */}
                <div className="border border-[#E2E8F0] rounded-lg p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <span className="font-bold text-sm text-[#183153]">Table: Users</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Core Entity
                    </span>
                  </div>
                  <ul className="mt-3 text-xs space-y-1.5 font-mono text-[#1F2937]">
                    <li className="flex justify-between">
                      <span className="font-bold text-amber-700">user_id (PK)</span>
                      <span className="text-slate-500">NVARCHAR(64)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>full_name</span>
                      <span className="text-slate-500">NVARCHAR(120)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>email (UNIQUE)</span>
                      <span className="text-slate-500">NVARCHAR(150)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>password_hash</span>
                      <span className="text-slate-500">NVARCHAR(256)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>created_at</span>
                      <span className="text-slate-500">DATETIME2</span>
                    </li>
                  </ul>
                </div>

                {/* Trips Table Card */}
                <div className="border border-[#E2E8F0] rounded-lg p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <span className="font-bold text-sm text-[#183153]">Table: Trips</span>
                    <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                      Parent Entity
                    </span>
                  </div>
                  <ul className="mt-3 text-xs space-y-1.5 font-mono text-[#1F2937]">
                    <li className="flex justify-between">
                      <span className="font-bold text-amber-700">trip_id (PK)</span>
                      <span className="text-slate-500">NVARCHAR(64)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-teal-700 font-semibold">user_id (FK)</span>
                      <span className="text-slate-500">NVARCHAR(64)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>destination, starting_location</span>
                      <span className="text-slate-500">NVARCHAR</span>
                    </li>
                    <li className="flex justify-between">
                      <span>start_date, end_date</span>
                      <span className="text-slate-500">DATE</span>
                    </li>
                    <li className="flex justify-between">
                      <span>traveler_count (adults, ch)</span>
                      <span className="text-slate-500">INT</span>
                    </li>
                    <li className="flex justify-between">
                      <span>total_budget, budget_type</span>
                      <span className="text-slate-500">DECIMAL / ENUM</span>
                    </li>
                  </ul>
                </div>

                {/* Itinerary Days Card */}
                <div className="border border-[#E2E8F0] rounded-lg p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <span className="font-bold text-sm text-[#183153]">Table: Itinerary_Days</span>
                    <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                      1:N Relation
                    </span>
                  </div>
                  <ul className="mt-3 text-xs space-y-1.5 font-mono text-[#1F2937]">
                    <li className="flex justify-between">
                      <span className="font-bold text-amber-700">itinerary_day_id (PK)</span>
                      <span className="text-slate-500">NVARCHAR(64)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-teal-700 font-semibold">trip_id (FK)</span>
                      <span className="text-slate-500">NVARCHAR(64)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>day_number</span>
                      <span className="text-slate-500">INT</span>
                    </li>
                    <li className="flex justify-between">
                      <span>itinerary_date</span>
                      <span className="text-slate-500">DATE</span>
                    </li>
                    <li className="flex justify-between">
                      <span>theme</span>
                      <span className="text-slate-500">NVARCHAR(150)</span>
                    </li>
                  </ul>
                </div>

                {/* Activities Card */}
                <div className="border border-[#E2E8F0] rounded-lg p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <span className="font-bold text-sm text-[#183153]">Table: Activities</span>
                    <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      1:N Relation
                    </span>
                  </div>
                  <ul className="mt-3 text-xs space-y-1.5 font-mono text-[#1F2937]">
                    <li className="flex justify-between">
                      <span className="font-bold text-amber-700">activity_id (PK)</span>
                      <span className="text-slate-500">NVARCHAR(64)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-teal-700 font-semibold">itinerary_day_id (FK)</span>
                      <span className="text-slate-500">NVARCHAR(64)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>activity_name, description</span>
                      <span className="text-slate-500">NVARCHAR</span>
                    </li>
                    <li className="flex justify-between">
                      <span>time_slot ('Morning','Afternoon','Evening')</span>
                      <span className="text-slate-500">NVARCHAR(20)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>duration_hours, estimated_cost</span>
                      <span className="text-slate-500">DECIMAL</span>
                    </li>
                  </ul>
                </div>

                {/* Expenses Card */}
                <div className="border border-[#E2E8F0] rounded-lg p-4 bg-slate-50/50 md:col-span-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                    <span className="font-bold text-sm text-[#183153]">Table: Expenses (5 Categories)</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Financial Tracking
                    </span>
                  </div>
                  <ul className="mt-3 text-xs space-y-1.5 font-mono text-[#1F2937]">
                    <li className="flex justify-between">
                      <span className="font-bold text-amber-700">expense_id (PK)</span>
                      <span className="text-slate-500">NVARCHAR(64)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-teal-700 font-semibold">trip_id (FK)</span>
                      <span className="text-slate-500">NVARCHAR(64)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>category ('Transportation', 'Accommodation', 'Food', 'Sightseeing', 'Miscellaneous')</span>
                      <span className="text-slate-500">NVARCHAR(30)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>amount, description, is_estimated</span>
                      <span className="text-slate-500">DECIMAL / BIT</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SQL DDL SCRIPT */}
        {activeTab === 'sql' && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#183153]">
                  Microsoft SQL Server DDL Script
                </h2>
                <p className="text-xs text-[#64748B]">
                  Execute this in SQL Server Management Studio (SSMS) or Azure Data Studio.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(sqlDdl, 'sql')}
                className="bg-[#183153] hover:bg-[#12243d] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedSection === 'sql' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy DDL Script</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed max-h-[480px]">
              {sqlDdl}
            </pre>
          </div>
        )}

        {/* TAB 3: SPRING BOOT BACKEND SPEC */}
        {activeTab === 'springboot' && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#183153]">
                  Spring Boot 3 + Spring Data JPA Controller Spec
                </h2>
                <p className="text-xs text-[#64748B]">
                  Java architecture separating Controllers, Services, Repositories, and Entities.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(springBootJava, 'java')}
                className="bg-[#183153] hover:bg-[#12243d] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5"
              >
                {copiedSection === 'java' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Java Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed max-h-[480px]">
              {springBootJava}
            </pre>
          </div>
        )}

        {/* TAB 4: ALGORITHM SPECIFICATION */}
        {activeTab === 'algorithm' && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#183153]">
                Personalization Logic & Algorithmic Design
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Deterministic mathematical model balancing attraction scoring, party budget
                thresholds, and temporal scheduling.
              </p>
            </div>

            <div className="space-y-4 text-xs text-[#1F2937] leading-relaxed">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-bold text-sm text-[#183153] mb-1">
                  1. Attraction Scoring Formula:
                </h3>
                <code className="block p-2.5 bg-white border border-slate-200 rounded font-mono text-[11px] text-[#0F766E] my-2">
                  Score(A) = Base_Weight (10) + Primary_Category_Match (50) + (Interest_Overlap ×
                  20) + Budget_Tier_Modifier(A, Tier)
                </code>
                <p className="text-[#64748B]">
                  Attractions with admission matching user’s tier are prioritized (e.g., free/low
                  cost monuments for Budget tier, curated private tours for Luxury tier).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-bold text-sm text-[#183153] mb-1">
                  2. Daily Slot Assignment & Fatigue Mitigation:
                </h3>
                <p className="text-[#64748B]">
                  Each day is strictly bounded to 3 discrete time slots:
                  <br />• <strong>Morning:</strong> High-energy outdoor sights, forts, viewpoints
                  before peak heat.
                  <br />• <strong>Afternoon:</strong> Indoor air-conditioned museums, culinary
                  specialties, thali banquets.
                  <br />• <strong>Evening:</strong> Waterfront ghat aartis, night bazaars, sunset
                  promenades, cultural shows.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-bold text-sm text-[#183153] mb-1">
                  3. 5-Category Expense Estimation Formulas:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-[#64748B]">
                  <li>
                    <strong>Transportation:</strong> (Intercity Base × Party) + (Local Transit/Day
                    × Days)
                  </li>
                  <li>
                    <strong>Accommodation:</strong> Room_Rate(Tier) × ⌈Adults/2⌉ × (Days - 1)
                  </li>
                  <li>
                    <strong>Food:</strong> Daily_Meal_Rate(Tier) × (Adults + 0.7 × Children) × Days
                  </li>
                  <li>
                    <strong>Sightseeing:</strong> ∑ (Activity_Cost × Adults + 0.5 × Activity_Cost ×
                    Children)
                  </li>
                  <li>
                    <strong>Miscellaneous:</strong> 8% Contingency Reserve of total expenses
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LOCAL VS CODE SETUP */}
        {activeTab === 'vscode' && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#183153]">
                Instructions to Run Locally in VS Code
              </h2>
              <p className="text-xs text-[#64748B]">
                Quick setup guide for presentation and local evaluation.
              </p>
            </div>

            <div className="space-y-4 text-xs text-[#1F2937]">
              <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-2">
                <div className="font-bold text-[#183153]">Step 1: Prerequisites</div>
                <ul className="list-disc list-inside text-[#64748B] space-y-1">
                  <li>Node.js (v18 or higher) and npm installed</li>
                  <li>Visual Studio Code with recommended extensions (ESLint, Tailwind)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-2">
                <div className="font-bold text-[#183153]">Step 2: Clone & Install</div>
                <pre className="p-2.5 bg-slate-900 text-slate-100 rounded font-mono text-[11px]">
                  {`npm install`}
                </pre>
              </div>

              <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-2">
                <div className="font-bold text-[#183153]">Step 3: Run Unit Tests</div>
                <pre className="p-2.5 bg-slate-900 text-slate-100 rounded font-mono text-[11px]">
                  {`npx tsx --test src/services/recommendationEngine.test.ts`}
                </pre>
              </div>

              <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-2">
                <div className="font-bold text-[#183153]">Step 4: Start Dev Server</div>
                <pre className="p-2.5 bg-slate-900 text-slate-100 rounded font-mono text-[11px]">
                  {`npm run dev`}
                </pre>
                <p className="text-[#64748B]">
                  Open browser at <code className="text-[#0F766E] font-mono">http://localhost:3000</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
