import React from 'react';
import { X, Check, ShieldCheck, UserCheck, Smartphone, LayoutDashboard, KeyRound, HardHat, HeartPulse, GraduationCap, Sparkles, Building2, LogOut } from 'lucide-react';
import { WORKER_PROFILES, ADMIN_PROFILES } from '../data/mockData';

export default function ProfileModal({
  isOpen,
  onClose,
  currentUserRole,
  currentSectorKey,
  onSelectPersona,
  onLogout,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn font-['DM_Sans',sans-serif]">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-navy-900 p-5 text-white flex items-center justify-between border-b border-navy-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                Switch Active Persona / Role
              </h3>
              <p className="text-xs text-slate-300">
                SDG 8 Role-Based Access Control Simulation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Options List */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Section 1: Frontline Workers */}
          <div>
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Frontline Worker Profiles (Mobile App View)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(WORKER_PROFILES).map((w) => {
                const isCurrent = currentUserRole === 'worker' && currentSectorKey === w.sectorKey;
                return (
                  <div
                    key={w.id}
                    onClick={() => {
                      onSelectPersona('worker', w.sectorKey);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-md ring-2 ring-emerald-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img
                        src={w.avatar}
                        alt={w.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <strong className="text-xs font-black text-navy-900 block truncate">
                          {w.name}
                        </strong>
                        <span className="text-[10px] text-emerald-700 font-bold block truncate">
                          {w.workerType}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono font-medium">
                          ID: {w.id}
                        </span>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Site Owners / Admins */}
          <div>
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5 text-navy-700" />
              <span>Employer / Site Admin Profiles (Desktop View)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(ADMIN_PROFILES).map((a) => {
                const isCurrent = currentUserRole === 'admin' && currentSectorKey === a.sectorKey;
                return (
                  <div
                    key={a.id}
                    onClick={() => {
                      onSelectPersona('admin', a.sectorKey, a.adminTypeKey);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-md ring-2 ring-emerald-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img
                        src={a.avatar}
                        alt={a.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-navy-800 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <strong className="text-xs font-black text-navy-900 block truncate">
                          {a.name}
                        </strong>
                        <span className="text-[10px] text-navy-800 font-bold block truncate">
                          {a.adminRoleTitle}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono font-medium">
                          ID: {a.id}
                        </span>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out to Login Page</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-900 hover:bg-navy-950 text-white text-xs font-black rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
