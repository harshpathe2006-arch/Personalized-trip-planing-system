import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Wallet,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Database,
  PlusCircle,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  activePage: string;
  onNavigate: (page: string, tripId?: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activePage,
  onNavigate,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: Calendar, requiresAuth: true },
    { id: 'planner', label: 'Plan Trip', icon: PlusCircle, highlight: true },
    { id: 'my-trips', label: 'My Trips', icon: MapPin, requiresAuth: true },
    { id: 'budget', label: 'Budget Planner', icon: Wallet, requiresAuth: true },
    { id: 'architecture', label: 'System Schema', icon: Database },
  ];

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-lg bg-[#183153] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0F766E] transition-colors">
              <Compass className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg text-[#183153] tracking-tight leading-tight">
                TripPlanning<span className="text-[#0F766E]">System</span>
              </div>
              <div className="text-[11px] text-[#64748B] font-medium hidden sm:block">
                Second Year IT Engineering Mini-Project
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              if (link.requiresAuth && !currentUser) return null;
              const Icon = link.icon;
              const isActive = activePage === link.id;

              if (link.highlight) {
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#0F766E] text-white shadow-xs'
                        : 'bg-teal-50 text-[#0F766E] hover:bg-teal-100 border border-teal-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#183153] text-white'
                      : 'text-[#1F2937] hover:text-[#183153] hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#64748B]" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side: User profile or Auth buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-[#E2E8F0]">
                <button
                  onClick={() => handleLinkClick('profile')}
                  className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activePage === 'profile'
                      ? 'bg-slate-100 text-[#183153]'
                      : 'text-[#1F2937] hover:bg-slate-50'
                  }`}
                  title="View Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-[#183153] text-white flex items-center justify-center text-xs font-semibold">
                    {currentUser.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{currentUser.full_name}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-[#64748B] hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleLinkClick('login')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                    activePage === 'login'
                      ? 'bg-[#183153] text-white shadow-xs'
                      : 'text-[#183153] hover:text-[#0F766E] hover:bg-slate-100 border border-[#E2E8F0]'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-[#0F766E]" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => handleLinkClick('register')}
                  className="px-3.5 py-1.5 text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#0c625c] rounded-md shadow-xs transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#1F2937] hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-2 pb-4 space-y-1 shadow-md">
          {navLinks.map((link) => {
            if (link.requiresAuth && !currentUser) return null;
            const Icon = link.icon;
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-[#183153] text-white'
                    : 'text-[#1F2937] hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#E2E8F0] mt-2">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleLinkClick('profile')}
                  className="flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium text-[#1F2937] hover:bg-slate-50"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profile ({currentUser.full_name})</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleLinkClick('login')}
                  className="flex-1 py-2 text-center text-sm font-medium text-[#183153] border border-[#E2E8F0] rounded-md"
                >
                  Login
                </button>
                <button
                  onClick={() => handleLinkClick('register')}
                  className="flex-1 py-2 text-center text-sm font-medium text-white bg-[#183153] rounded-md"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
