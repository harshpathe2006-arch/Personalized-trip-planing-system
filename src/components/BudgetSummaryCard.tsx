import React from 'react';
import { IndianRupee, AlertCircle, CheckCircle2, TrendingUp, ShieldAlert } from 'lucide-react';
import { BudgetSummary } from '../types';

interface BudgetSummaryCardProps {
  summary: BudgetSummary;
  onAdjustBudget?: () => void;
}

export const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({
  summary,
  onAdjustBudget,
}) => {
  const percentUsed = Math.min(
    100,
    Math.round((summary.total_estimated / (summary.total_allocated || 1)) * 100)
  );

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
      {/* Exceeded Warning Banner */}
      {summary.is_exceeded && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold text-amber-900">
              Budget Exceeded by ₹{Math.abs(summary.remaining).toLocaleString('en-IN')}:
            </span>{' '}
            <span className="text-amber-800">
              Your estimated itinerary expenses (₹
              {summary.total_estimated.toLocaleString('en-IN')}) exceed the allocated budget of ₹
              {summary.total_allocated.toLocaleString('en-IN')}. Consider adjusting accommodation tier
              or switching to budget activities.
            </span>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-base font-bold text-[#183153]">Trip Budget Overview</h3>
            <p className="text-xs text-[#64748B]">Real-time algorithmic financial tracking</p>
          </div>
          {onAdjustBudget && (
            <button
              onClick={onAdjustBudget}
              className="text-xs font-medium text-[#0F766E] hover:underline self-start sm:self-auto"
            >
              Adjust Allocated Budget
            </button>
          )}
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3.5">
            <div className="text-xs font-medium text-[#64748B]">Allocated Budget</div>
            <div className="text-xl font-bold text-[#183153] mt-1 flex items-center">
              <span className="text-sm mr-0.5">₹</span>
              {summary.total_allocated.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#64748B] mt-1">Target limit set by user</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-md p-3.5">
            <div className="text-xs font-medium text-[#64748B]">Estimated Expenditure</div>
            <div
              className={`text-xl font-bold mt-1 flex items-center ${
                summary.is_exceeded ? 'text-amber-600' : 'text-[#0F766E]'
              }`}
            >
              <span className="text-sm mr-0.5">₹</span>
              {summary.total_estimated.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#64748B] mt-1">
              {percentUsed}% of budget calculated
            </div>
          </div>

          <div
            className={`border rounded-md p-3.5 ${
              summary.remaining < 0
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="text-xs font-medium">
              {summary.remaining < 0 ? 'Deficit / Shortfall' : 'Remaining Cushion'}
            </div>
            <div className="text-xl font-bold mt-1 flex items-center">
              <span className="text-sm mr-0.5">₹</span>
              {Math.abs(summary.remaining).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] mt-1 flex items-center gap-1">
              {summary.remaining < 0 ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Deficit requires trim</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Within target limits</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-[#64748B] mb-1.5 font-medium">
            <span>Budget Utilization</span>
            <span>
              ₹{summary.total_estimated.toLocaleString('en-IN')} / ₹
              {summary.total_allocated.toLocaleString('en-IN')} ({percentUsed}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                summary.is_exceeded ? 'bg-amber-500' : 'bg-[#0F766E]'
              }`}
              style={{ width: `${Math.min(100, (summary.total_estimated / (summary.total_allocated || 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
