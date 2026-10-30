import React, { useState } from 'react';
import {
  IndianRupee,
  Wallet,
  Car,
  Hotel,
  Utensils,
  Camera,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Edit2,
  Save,
} from 'lucide-react';
import { Expense, ExpenseCategory, Trip } from '../types';
import { computeBudgetSummary } from '../services/recommendationEngine';
import { BudgetSummaryCard } from '../components/BudgetSummaryCard';

interface BudgetPlannerPageProps {
  trips: Trip[];
  activeTripId?: string;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onNavigate: (page: string, tripId?: string) => void;
}

export const BudgetPlannerPage: React.FC<BudgetPlannerPageProps> = ({
  trips,
  activeTripId,
  onUpdateTrip,
  onNavigate,
}) => {
  const selectedTrip =
    trips.find((t) => t.trip_id === activeTripId) || trips[0];

  const [currentTrip, setCurrentTrip] = useState<Trip | null>(selectedTrip || null);
  const [isEditingAllocated, setIsEditingAllocated] = useState(false);
  const [newAllocatedValue, setNewAllocatedValue] = useState(
    selectedTrip ? selectedTrip.total_budget : 35000
  );

  // New custom expense form state
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('Miscellaneous');
  const [newAmount, setNewAmount] = useState<number>(1000);
  const [newDescription, setNewDescription] = useState('');
  const [formError, setFormError] = useState('');

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-[#183153]">No Trips Available for Budgeting</h2>
        <p className="text-xs text-[#64748B] mt-2">
          Create a personalized trip first to view and manage its budget.
        </p>
        <button
          onClick={() => onNavigate('planner')}
          className="mt-4 bg-[#0F766E] text-white px-4 py-2 rounded-md text-xs font-semibold"
        >
          Plan a Trip Now
        </button>
      </div>
    );
  }

  const budgetSummary = computeBudgetSummary(
    currentTrip.total_budget,
    currentTrip.expenses
  );

  const handleTripChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = trips.find((t) => t.trip_id === e.target.value);
    if (found) {
      setCurrentTrip(found);
      setNewAllocatedValue(found.total_budget);
    }
  };

  const handleSaveAllocatedBudget = () => {
    if (newAllocatedValue < 1000) return;
    const updated = {
      ...currentTrip,
      total_budget: newAllocatedValue,
    };
    setCurrentTrip(updated);
    onUpdateTrip(updated);
    setIsEditingAllocated(false);
  };

  const handleAddCustomExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim() || newAmount <= 0) {
      setFormError('Please enter a description and valid amount.');
      return;
    }

    const newExpenseItem: Expense = {
      expense_id: `exp-custom-${Date.now()}`,
      trip_id: currentTrip.trip_id,
      category: newCategory,
      amount: newAmount,
      description: newDescription.trim(),
      is_estimated: false,
    };

    const updated = {
      ...currentTrip,
      expenses: [...currentTrip.expenses, newExpenseItem],
    };

    setCurrentTrip(updated);
    onUpdateTrip(updated);
    setShowAddExpense(false);
    setNewDescription('');
    setNewAmount(1000);
    setFormError('');
  };

  const handleDeleteExpense = (expenseId: string) => {
    const updated = {
      ...currentTrip,
      expenses: currentTrip.expenses.filter((e) => e.expense_id !== expenseId),
    };
    setCurrentTrip(updated);
    onUpdateTrip(updated);
  };

  const categoryIcons: Record<ExpenseCategory, any> = {
    Transportation: Car,
    Accommodation: Hotel,
    Food: Utensils,
    Sightseeing: Camera,
    Miscellaneous: Layers,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#183153] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>

          {/* Trip Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B] font-medium">Select Trip:</span>
            <select
              value={currentTrip.trip_id}
              onChange={handleTripChange}
              className="text-xs font-semibold px-3 py-1.5 border border-[#E2E8F0] rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#183153]"
            >
              {trips.map((t) => (
                <option key={t.trip_id} value={t.trip_id}>
                  {t.destination} ({t.start_date})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
              Financial Management & Variance Tracker
            </div>
            <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight mt-1">
              Budget Breakdown: {currentTrip.destination}
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              {currentTrip.duration_days} Days • {currentTrip.budget_type} Tier •{' '}
              {currentTrip.traveler_count.adults} Adults
              {currentTrip.traveler_count.children > 0
                ? `, ${currentTrip.traveler_count.children} Children`
                : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('itinerary', currentTrip.trip_id)}
              className="px-4 py-2 text-xs font-semibold text-[#183153] bg-white border border-[#E2E8F0] hover:bg-slate-50 rounded-md transition-colors"
            >
              View Day Itinerary
            </button>
            <button
              onClick={() => setShowAddExpense(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0c625c] rounded-md shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Expense</span>
            </button>
          </div>
        </div>

        {/* Budget Metric Summary Card */}
        <BudgetSummaryCard
          summary={budgetSummary}
          onAdjustBudget={() => setIsEditingAllocated(!isEditingAllocated)}
        />

        {/* Inline Adjust Allocated Budget Form */}
        {isEditingAllocated && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-150">
            <span className="text-xs font-semibold text-[#183153] shrink-0">
              Update Allocated Budget (₹):
            </span>
            <input
              type="number"
              min="1000"
              step="1000"
              value={newAllocatedValue}
              onChange={(e) => setNewAllocatedValue(parseInt(e.target.value) || 0)}
              className="px-3 py-1.5 text-xs font-bold border border-[#E2E8F0] rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] w-48"
            />
            <button
              onClick={handleSaveAllocatedBudget}
              className="bg-[#183153] text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-[#12243d] flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              <span>Save Budget</span>
            </button>
            <button
              onClick={() => setIsEditingAllocated(false)}
              className="text-xs text-[#64748B] hover:underline"
            >
              Cancel
            </button>
          </div>
        )}

        {/* 5 Categories Visual Progress Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(
            [
              'Transportation',
              'Accommodation',
              'Food',
              'Sightseeing',
              'Miscellaneous',
            ] as ExpenseCategory[]
          ).map((cat) => {
            const Icon = categoryIcons[cat];
            const amount = budgetSummary.category_breakdown[cat] || 0;
            const pctOfTotal = budgetSummary.total_estimated
              ? Math.round((amount / budgetSummary.total_estimated) * 100)
              : 0;

            return (
              <div
                key={cat}
                className="bg-white p-4 rounded-lg border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-slate-500">
                    <Icon className="w-4 h-4 text-[#0F766E]" />
                    <span className="text-[10px] font-bold text-slate-400">{pctOfTotal}%</span>
                  </div>
                  <div className="text-xs font-semibold text-[#1F2937] mt-2">{cat}</div>
                  <div className="text-lg font-bold text-[#183153] mt-0.5">
                    ₹{amount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="bg-[#0F766E] h-full rounded-full"
                    style={{ width: `${Math.min(100, pctOfTotal)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Itemized Expenses Table */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#183153]">Itemized Trip Expenses</h3>
              <p className="text-xs text-[#64748B]">
                Breakdown of transport, lodging, food, scheduled activities, and contingency
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {currentTrip.expenses.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1F2937]">
              <thead className="bg-slate-50 border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description / Details</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Estimated Amount (₹)</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {currentTrip.expenses.map((expense) => {
                  const Icon = categoryIcons[expense.category] || Layers;
                  return (
                    <tr key={expense.expense_id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-semibold text-[#183153] flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#0F766E] shrink-0" />
                        <span>{expense.category}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] max-w-md">
                        {expense.description}
                      </td>
                      <td className="py-3.5 px-4">
                        {expense.is_estimated ? (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            Algorithmic Est.
                          </span>
                        ) : (
                          <span className="text-[10px] bg-teal-50 text-[#0F766E] px-2 py-0.5 rounded font-semibold border border-teal-200">
                            Custom Added
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#183153]">
                        ₹{expense.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteExpense(expense.expense_id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          >
            <div className="bg-white rounded-lg shadow-xl border border-[#E2E8F0] max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h3 className="text-base font-bold text-[#183153]">Add Custom Trip Expense</h3>
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              {formError && (
                <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddCustomExpense} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Expense Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
                  >
                    <option value="Transportation">Transportation</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Food">Food</option>
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Amount in INR (₹) *
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="e.g., Souvenir shopping / Airport cab upgrade"
                    className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="px-4 py-2 text-xs font-medium text-[#1F2937] bg-white border border-[#E2E8F0] rounded-md hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0c625c] rounded-md shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Expense</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
