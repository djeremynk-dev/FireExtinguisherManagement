import React, { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth';
import { usersApi } from '../../api/users';
import { getErrorMessage } from '../../api/client';

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#A02000]/20 outline-none';

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await usersApi.updateMe(profile);
      await refreshUser();
      setMessage('Profile updated.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.changePassword(passwords.currentPassword, passwords.newPassword);
      setMessage('Password changed.');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" subtitle="View and update your account information" />
      {message && <p className="text-green-700 text-sm mb-4">{message}</p>}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={saveProfile} className="bg-white rounded-2xl border p-6 space-y-4">
          <h3 className="font-bold">Profile Information</h3>
          <input
            className={inputClass}
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            placeholder="First name"
          />
          <input
            className={inputClass}
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            placeholder="Last name"
          />
          <input
            className={inputClass}
            value={profile.phoneNumber}
            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
            placeholder="Phone number"
          />
          <p className="text-sm text-slate-500">Email: {user?.email}</p>
          <p className="text-sm text-slate-500">Role: {user?.role}</p>
          <button type="submit" className="px-6 py-2 bg-[#A02000] text-white rounded-xl font-bold">
            Save Profile
          </button>
        </form>
        <form onSubmit={changePassword} className="bg-white rounded-2xl border p-6 space-y-4">
          <h3 className="font-bold">Change Password</h3>
          <input
            type="password"
            className={inputClass}
            placeholder="Current password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            required
          />
          <input
            type="password"
            className={inputClass}
            placeholder="New password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
          />
          <button type="submit" className="px-6 py-2 border border-slate-200 rounded-xl font-bold">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
