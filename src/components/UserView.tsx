import React, { useState } from "react";
import {
  Users,
  UserCheck,
  Shield,
  Trash2,
  X,
  Mail,
  User as UserIcon,
  Briefcase,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { User, Role } from "../types";

interface UserViewProps {
  currentUser: User;
  usersList: User[];
  onUpdateRole: (id: string, role: Role) => Promise<boolean>;
  onDeleteUser: (id: string) => Promise<boolean>;
}

export default function UserView({
  currentUser,
  usersList,
  onUpdateRole,
  onDeleteUser,
}: UserViewProps) {
  const [editingRoleUserId, setEditingRoleUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("USER");

  const [message, setMessage] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleRoleUpdateSubmit = async (userId: string) => {
    const success = await onUpdateRole(userId, selectedRole);
    if (success) {
      setEditingRoleUserId(null);
      setMessage("User role updated successfully.");
      setTimeout(() => setMessage(null), 3000);
    } else {
      setErr("Failed to update user role.");
      setTimeout(() => setErr(null), 3000);
    }
  };

  const handleDeleteClick = async (userId: string, name: string) => {
    if (userId === currentUser.id) {
      alert("Error: You cannot delete your own logged-in user account.");
      return;
    }
    if (userId === "u1") {
      alert("Error: System constraint prevents deleting the primary root administrator.");
      return;
    }

    if (confirm(`Are you absolutely sure you want to terminate user account "${name}" from TZW LTD system access? This action is permanent.`)) {
      const success = await onDeleteUser(userId);
      if (success) {
        setMessage("User account deleted successfully.");
        setTimeout(() => setMessage(null), 3000);
      } else {
        setErr("Failed to delete user account.");
        setTimeout(() => setErr(null), 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
            <Users size={22} className="text-orange-600" /> Operational User Directory
          </h3>
          <p className="text-xs text-slate-500">
            Administrate operational credentials, modify access clearances, and terminate permissions rosters
          </p>
        </div>
      </div>

      {/* Notifications banner */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse">
          <CheckCircle size={15} className="text-emerald-600" /> {message}
        </div>
      )}
      {err && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={15} className="text-rose-600" /> {err}
        </div>
      )}

      {/* Roster database table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 font-mono">
                <th className="py-3.5 px-5">Operator Name</th>
                <th className="py-3.5 px-5">Email Credential</th>
                <th className="py-3.5 px-5">Role Clearance</th>
                <th className="py-3.5 px-5">Registered Since</th>
                <th className="py-3.5 px-5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {usersList.map((usr) => {
                const isEditing = editingRoleUserId === usr.id;
                const isSelf = usr.id === currentUser.id;

                return (
                  <tr key={usr.id} className="hover:bg-slate-50/50 transition">
                    
                    {/* Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-orange-100 text-orange-700 max-w-full font-bold flex items-center justify-center rounded-xl shrink-0 font-mono text-sm uppercase">
                          {usr.firstName[0]}
                          {usr.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {usr.firstName} {usr.lastName} {isSelf && " (You)"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {usr.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-5 font-medium text-slate-700">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail size={12} className="text-slate-400" />
                        <span>{usr.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-5">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as Role)}
                          >
                            <option value="USER">USER (Client)</option>
                            <option value="INSPECTOR">INSPECTOR (Mechanic)</option>
                            <option value="ADMIN">ADMINISTRATOR (Full)</option>
                          </select>
                          <button
                            onClick={() => handleRoleUpdateSubmit(usr.id)}
                            className="px-2 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] hover:bg-emerald-700 transition cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRoleUserId(null)}
                            className="px-2 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-[10px] hover:bg-slate-200 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                          usr.role === "ADMIN"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : usr.role === "INSPECTOR"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {usr.role}
                        </span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-5 text-slate-500 font-medium">
                      {usr.createdAt ? usr.createdAt.split("T")[0] : "Pre-system"}
                    </td>

                    {/* Administrative Actions */}
                    <td className="py-4 px-5 text-right">
                      {usr.id !== "u1" && (
                        <div className="flex items-center justify-end gap-2">
                          {!isEditing && (
                            <button
                              onClick={() => {
                                setSelectedRole(usr.role);
                                setEditingRoleUserId(usr.id);
                              }}
                              className="px-2 py-1 bg-slate-50 text-slate-700 hover:bg-slate-200 text-[10px] font-bold border border-slate-200/50 rounded-lg transition shrink-0 cursor-pointer"
                            >
                              Edit clearance
                            </button>
                          )}
                          {!isSelf && (
                            <button
                              onClick={() => handleDeleteClick(usr.id, `${usr.firstName} ${usr.lastName}`)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition cursor-pointer"
                              title="Delete Operator"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
