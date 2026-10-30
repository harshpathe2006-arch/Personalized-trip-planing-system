import React from 'react';
import {
  Printer,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { Trip } from '../types';
import { computeBudgetSummary } from '../services/recommendationEngine';

interface TripSummaryPageProps {
  trip: Trip;
  onNavigate: (page: string, tripId?: string) => void;
}

export const TripSummaryPage: React.FC<TripSummaryPageProps> = ({ trip, onNavigate }) => {
  const budgetSummary = computeBudgetSummary(trip.total_budget, trip.expenses);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation / Action Top Bar (Hidden during print) */}
        <div className="no-print flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#183153] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('itinerary', trip.trip_id)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#183153] bg-white border border-[#E2E8F0] hover:bg-slate-50 transition-colors"
            >
              Back to Itinerary
            </button>
            <button
              onClick={handlePrint}
              className="print-keep bg-[#183153] hover:bg-[#12243d] text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5 text-teal-300" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Trip Dossier Container */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-8 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-[#183153] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E] uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Personalized Trip Planning System • Official Travel Dossier</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#183153] tracking-tight mt-1">
                {trip.destination}
              </h1>
              <p className="text-xs text-[#64748B] mt-1">
                Origin: <strong>{trip.starting_location}</strong> • Dates:{' '}
                <strong>
                  {trip.start_date} to {trip.end_date}
                </strong>{' '}
                ({trip.duration_days} Days)
              </p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <div className="text-[#64748B]">Document Reference</div>
              <div className="font-mono font-bold text-[#183153] uppercase">{trip.trip_id}</div>
              <div className="text-[10px] text-slate-400">
                Generated: {new Date(trip.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Key Trip Parameters Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-[#64748B] block">Travel Party</span>
              <strong className="text-[#183153] text-sm">
                {trip.traveler_count.adults} Adults
                {trip.traveler_count.children > 0 ? `, ${trip.traveler_count.children} Children` : ''}
              </strong>
            </div>

            <div>
              <span className="text-[#64748B] block">Budget Preference</span>
              <strong className="text-[#183153] text-sm">{trip.budget_type} Tier</strong>
            </div>

            <div>
              <span className="text-[#64748B] block">Total Allocated Budget</span>
              <strong className="text-[#183153] text-sm">
                ₹{trip.total_budget.toLocaleString('en-IN')}
              </strong>
            </div>

            <div>
              <span className="text-[#64748B] block">Estimated Expenditure</span>
              <strong
                className={`text-sm ${
                  budgetSummary.is_exceeded ? 'text-amber-600' : 'text-[#0F766E]'
                }`}
              >
                ₹{budgetSummary.total_estimated.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          {/* Interests Filtered */}
          <div>
            <h3 className="text-xs font-bold text-[#183153] uppercase tracking-wider mb-2">
              Personalized Interest Profile
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {trip.selected_interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded bg-teal-50 text-[#0F766E] border border-teal-200 text-xs font-semibold"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Day-Wise Complete Schedule Table */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#183153] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
              Day-by-Day Detailed Itinerary
            </h3>

            {trip.itinerary_days.map((day) => (
              <div
                key={day.day_number}
                className="border border-[#E2E8F0] rounded-lg overflow-hidden"
              >
                <div className="bg-slate-100 px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#183153]">
                    Day {day.day_number}: {day.theme || 'Scheduled Activities'}
                  </span>
                  <span className="text-[#64748B] font-mono">{day.date}</span>
                </div>

                <div className="p-4 space-y-3">
                  {day.activities.map((act) => (
                    <div
                      key={act.activity_id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 border-b border-slate-100 pb-2 last:border-none last:pb-0"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0F766E] w-18">{act.time_slot}:</span>
                          <span className="font-semibold text-[#183153]">{act.activity_name}</span>
                          <span className="text-[10px] text-slate-500">
                            ({act.duration_hours}h • {act.category})
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] pl-20">{act.description}</p>
                      </div>

                      <div className="sm:text-right shrink-0 pl-20 sm:pl-0 font-semibold text-[#183153]">
                        {act.estimated_cost === 0 ? 'Free' : `₹${act.estimated_cost.toLocaleString('en-IN')}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Category Financial Breakdown Table */}
          <div className="space-y-3 print-page-break">
            <h3 className="text-sm font-bold text-[#183153] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
              Financial Breakdown & Cost Projection
            </h3>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-[#E2E8F0] font-semibold text-[#64748B]">
                <tr>
                  <th className="py-2.5 px-3">Expense Category</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {trip.expenses.map((exp) => (
                  <tr key={exp.expense_id}>
                    <td className="py-2 px-3 font-semibold text-[#183153]">{exp.category}</td>
                    <td className="py-2 px-3 text-[#64748B]">{exp.description}</td>
                    <td className="py-2 px-3 text-right font-bold text-[#183153]">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold">
                  <td className="py-3 px-3 text-[#183153]" colSpan={2}>
                    Total Projected Cost
                  </td>
                  <td className="py-3 px-3 text-right text-base text-[#183153]">
                    ₹{budgetSummary.total_estimated.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Academic Project Stamp */}
          <div className="pt-6 border-t border-slate-200 text-center text-[11px] text-[#64748B]">
            Second Year Information Technology Engineering • Mini-Project Demonstration
            <br />
            System Architecture: React + TypeScript + Spring Boot Specifications + Microsoft SQL Server Schema
          </div>
        </div>
      </div>
    </div>
  );
};
