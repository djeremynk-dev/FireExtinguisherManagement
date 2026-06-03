import React, { useState } from "react";
import { User } from "../types";
import { Mail, ShieldAlert, Key, RefreshCw, AlertCircle, CheckCircle, UserCheck } from "lucide-react";

interface ProfileViewProps {
  currentUser: User;
  onUpdateProfile: (data: { firstName: string; lastName: string; email: string }) => Promise<boolean>;
  onChangePassword: (data: { oldPassword: string; newPassword: string }) => Promise<boolean>;
}

export default function ProfileView({
  currentUser,
  onUpdateProfile,
  onChangePassword,
}: ProfileViewProps) {
  // Update Profile Form
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
  });

  // Password Update Form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.firstName || !profileForm.lastName || !profileForm.email) {
      setErr("Profile parameters cannot be left blank.");
      return;
    }
    const success = await onUpdateProfile(profileForm);
    if (success) {
      setMessage("User Profile information updated successfully.");
      setTimeout(() => setMessage(null), 3000);
    } else {
      setErr("An error occurred during profile updates.");
      setTimeout(() => setErr(null), 3000);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setErr("Please provide both current and new passwords.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErr("Confirm Password does not match specified New Password.");
      return;
    }
    const success = await onChangePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });
    if (success) {
      setMessage("Your password was updated successfully.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setErr("Failed to update password. Verify old password entry.");
      setTimeout(() => setErr(null), 3000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Sidebar Details Badge */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-20 w-20 bg-orange-100 text-orange-600 font-extrabold flex items-center justify-center rounded-2xl text-2xl uppercase border-2 border-orange-200">
            {currentUser.firstName[0]}
            {currentUser.lastName[0]}
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-950">
              {currentUser.firstName} {currentUser.lastName}
            </h4>
            <p className="text-xs text-slate-400 font-mono">User ID: {currentUser.id}</p>
          </div>

          <div className="pt-2 w-full border-t border-slate-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest block text-center">
              SYSTEM ROLES CLEARED
            </span>
            <div className="flex justify-center">
              <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold font-mono border border-orange-200 tracking-wider">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Operational Security warnings */}
        <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 space-y-3.5 text-xs">
          <h5 className="font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <ShieldAlert size={14} className="text-orange-500" /> Compliance notice
          </h5>
          <p className="leading-relaxed">
            Administrative credentials, passwords and emails are subject to monthly structural safety log checks. Do not distribute access keys to third-party providers.
          </p>
        </div>
      </div>

      {/* Main Form Fields Panel */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Flash notifications */}
        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse">
            <CheckCircle size={15} className="text-emerald-55 text-emerald-600" /> {message}
          </div>
        )}
        {err && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} className="text-rose-600" /> {err}
          </div>
        )}

        {/* Form 1: Profile info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
              <UserCheck size={14} /> Profile Parameters Setup
            </h4>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            {/* Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Insert First Name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold text-xs focus:ring-1 focus:ring-orange-500"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Insert Last Name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold text-xs focus:ring-1 focus:ring-orange-500"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Operational Email Coordinator</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail size={13} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="coordinator@domain.com"
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold text-xs focus:ring-1 focus:ring-orange-500"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition"
            >
              Verify & Save Profile
            </button>
          </form>
        </div>

        {/* Form 2: Password Modifying */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
              <Key size={14} /> Password Credential Authority
            </h4>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            {/* Old password field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Current Secret Password</label>
              <input
                type="password"
                required
                placeholder="Insert current security passcode"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold text-xs focus:ring-1 focus:ring-orange-500"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New pass */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">New Secret Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters recommended"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold text-xs focus:ring-1 focus:ring-orange-500"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>

              {/* Confirm pass */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Confirm New Secret Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter to verify parameter integrity"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold text-xs focus:ring-1 focus:ring-orange-500"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition"
            >
              Commit Password Change
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
