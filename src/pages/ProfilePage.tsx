import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Lock,
  Calendar,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Shield,
  KeyRound,
} from 'lucide-react';
import { User } from '../types';
import { AuthService } from '../services/authService';

interface ProfilePageProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onUpdateUser,
  onLogout,
}) => {
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    if (!fullName.trim()) {
      setNameError('Full name cannot be empty.');
      return;
    }

    const res = AuthService.updateProfile(fullName);
    if (res.success && res.user) {
      onUpdateUser(res.user);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } else {
      setNameError(res.error || 'Failed to update name.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');

    if (!currentPassword || !newPassword) {
      setPwdError('Please complete all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    const res = AuthService.changePassword(currentPassword, newPassword);
    if (res.success) {
      setPwdSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdSuccess(false), 3000);
    } else {
      setPwdError(res.error || 'Password update failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#183153] text-white flex items-center justify-center text-xl font-bold">
              {currentUser.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#183153]">{currentUser.full_name}</h1>
              <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>{currentUser.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-md text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Section 1: Profile Details */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6">
          <h2 className="text-base font-bold text-[#183153] pb-3 border-b border-[#E2E8F0] flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#0F766E]" />
            <span>Account Profile Details</span>
          </h2>

          {nameSuccess && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full name updated successfully.</span>
            </div>
          )}

          {nameError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{nameError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateName} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#1F2937]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Registered Email (Identifier)
              </label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-md bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Email address is tied to relational user_id and cannot be modified.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#183153] hover:bg-[#12243d] text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Password Security */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs p-6">
          <h2 className="text-base font-bold text-[#183153] pb-3 border-b border-[#E2E8F0] flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#0F766E]" />
            <span>Security & Password Management</span>
          </h2>

          {pwdSuccess && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Password updated securely in storage.</span>
            </div>
          )}

          {pwdError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{pwdError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter existing password"
                className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#1F2937]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#1F2937]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-[#1F2937]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#0F766E] hover:bg-[#0c625c] text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
