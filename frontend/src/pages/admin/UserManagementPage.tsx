import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { usersApi } from '../../api/users';
import { getErrorMessage } from '../../api/client';
import type { User, UserRole } from '../../types';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    usersApi
      .list({ search: search || undefined })
      .then((res) => setUsers(res.data.data || []))
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(() => {
    load();
  }, []);

  const updateRole = async (id: string, role: UserRole) => {
    try {
      await usersApi.update(id, { role });
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage users, roles, and access (Admin only)" />
      <div className="flex gap-3 mb-4">
        <input
          className="flex-1 max-w-md px-4 py-2 rounded-xl border border-slate-200"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          onClick={load}
          className="px-4 py-2 bg-[#A02000] text-white rounded-xl text-sm font-semibold"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 hidden sm:table-cell">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">
                  {u.firstName} {u.lastName}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value as UserRole)}
                    className="text-xs border rounded-lg px-2 py-1"
                  >
                    <option value="USER">USER</option>
                    <option value="INSPECTOR">INSPECTOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-3">{u.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
