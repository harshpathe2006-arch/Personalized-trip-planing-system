import React from 'react';
import { Compass, Database, ShieldCheck, FileText, Code2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#183153] text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Project Details */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[#0F766E] flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Personalized Trip Planning System
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              An engineering-grade academic mini-project developed for Second Year Information
              Technology Engineering. Designed for personalized travel recommendations, day-wise
              scheduling heuristics, category-wise budget management, and relational trip data modeling.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-teal-300 font-medium border border-slate-700">
                React 19 + TypeScript
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium border border-slate-700">
                Tailwind CSS
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-amber-300 font-medium border border-slate-700">
                Spring Boot Spec + SQL Server Schema
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors text-left"
                >
                  Explore Destinations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-white transition-colors text-left text-teal-400 font-medium"
                >
                  Multi-Step Trip Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  User Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-trips')}
                  className="hover:text-white transition-colors text-left"
                >
                  Saved Trips & Itineraries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('budget')}
                  className="hover:text-white transition-colors text-left"
                >
                  Budget Breakdown & Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Academic & Engineering Specs */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-3">
              Engineering Specs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('architecture')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <Database className="w-3.5 h-3.5 text-teal-400" />
                  <span>Relational Schema (ERD)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('architecture')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <Code2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Spring Boot & JPA Spec</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('architecture')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Local Run Instructions</span>
                </button>
              </li>
              <li className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic Heuristic Engine</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026-2027 Department of Information Technology. Second Year Mini-Project.
          </div>
          <div className="flex items-center gap-4">
            <span>Color Standard: Navy #183153 & Teal #0F766E</span>
            <span>•</span>
            <span>Font: Inter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
