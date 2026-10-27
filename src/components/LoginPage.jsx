import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  HardHat, 
  HeartPulse, 
  GraduationCap, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WORKER_PROFILES, ADMIN_PROFILES } from '../data/mockData';

export default function LoginPage({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('worker'); // 'worker' | 'admin'

  // Worker Form State
  const [selectedWorkerKey, setSelectedWorkerKey] = useState('construction_worker');
  const [workerId, setWorkerId] = useState(WORKER_PROFILES.construction_worker.id);
  const [workerPassword, setWorkerPassword] = useState(WORKER_PROFILES.construction_worker.password);

  // Admin Form State
  const [selectedAdminKey, setSelectedAdminKey] = useState('admin_construction');
  const [adminId, setAdminId] = useState(ADMIN_PROFILES.admin_construction.id);
  const [adminPassword, setAdminPassword] = useState(ADMIN_PROFILES.admin_construction.password);

  const [errorMessage, setErrorMessage] = useState('');

  // Handle worker type change
  const handleWorkerTypeChange = (key) => {
    setSelectedWorkerKey(key);
    setWorkerId(WORKER_PROFILES[key].id);
    setWorkerPassword(WORKER_PROFILES[key].password);
    setErrorMessage('');
  };

  // Handle admin type change
  const handleAdminTypeChange = (key) => {
    setSelectedAdminKey(key);
    setAdminId(ADMIN_PROFILES[key].id);
    setAdminPassword(ADMIN_PROFILES[key].password);
    setErrorMessage('');
  };

  // Worker Submit
  const handleWorkerLogin = (e) => {
    e.preventDefault();
    const profile = WORKER_PROFILES[selectedWorkerKey];
    if (workerId.trim().toUpperCase() === profile.id && workerPassword.trim() === profile.password) {
      onLoginSuccess({
        role: 'worker',
        workerKey: selectedWorkerKey,
        profile: profile,
      });
    } else {
      setErrorMessage(`Invalid Credentials! For ${profile.workerType}, use ID: ${profile.id} & Password: ${profile.password}`);
    }
  };

  // Admin Submit
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const profile = ADMIN_PROFILES[selectedAdminKey];
    if (adminId.trim().toUpperCase() === profile.id && adminPassword.trim() === profile.password) {
      onLoginSuccess({
        role: 'admin',
        adminKey: selectedAdminKey,
        sectorKey: profile.sectorKey,
        profile: profile,
      });
    } else {
      setErrorMessage(`Invalid Credentials! For ${profile.adminRoleTitle}, use ID: ${profile.id} & Password: ${profile.password}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-['DM_Sans',sans-serif]">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/20 mb-4">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          ShiftGuard <span className="text-emerald-400 font-black">AI</span>
        </h1>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-xs font-bold bg-navy-800 text-emerald-300 border border-emerald-500/30">
          <span>UN SDG 8</span> • <span>Decent Work & Economic Growth</span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Role-Based Access for Frontline Workers & Site Authorities
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="bg-navy-950/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800">
          
          {/* Dual Persona Switcher Tabs */}
          <div className="flex bg-navy-900 p-1.5 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('worker');
                setErrorMessage('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                activeTab === 'worker'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>[ 👷 Frontline Worker Login ]</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>[ 🏛️ Employer / Site Admin Login ]</span>
            </button>
          </div>

          {/* Error Message Notice */}
          {errorMessage && (
            <div className="mb-5 bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs p-3 rounded-xl flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: WORKER LOGIN FORM */}
          {activeTab === 'worker' && (
            <form onSubmit={handleWorkerLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Your Worker Category
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { key: 'construction_worker', label: 'Construction Worker', icon: HardHat, name: 'Ramesh Kumar' },
                    { key: 'nurse', label: 'Nurse (Healthcare)', icon: HeartPulse, name: 'Sister Ananya Sen' },
                    { key: 'school_staff', label: 'School Support Staff', icon: GraduationCap, name: 'Rajeshwar Sharma' },
                    { key: 'cleaning_lady', label: 'Cleaning Lady / Sanitation', icon: Sparkles, name: 'Sunita Devi' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedWorkerKey === item.key;
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => handleWorkerTypeChange(item.key)}
                        className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30 text-white'
                            : 'bg-navy-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                          {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                        </div>
                        <div className="mt-2">
                          <strong className="block text-xs font-bold text-slate-100">{item.label}</strong>
                          <span className="text-[10px] text-slate-400 font-medium">{item.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Worker ID Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Worker Employee ID
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={workerId}
                    onChange={(e) => setWorkerId(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    placeholder="e.g. CONST-8842"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Security Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={workerPassword}
                    onChange={(e) => setWorkerPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Quick Fill Demo Helper */}
              <div className="bg-navy-900/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Demo Credential: <strong>{WORKER_PROFILES[selectedWorkerKey].id}</strong> / <strong>{WORKER_PROFILES[selectedWorkerKey].password}</strong></span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pre-filled
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 flex items-center justify-center space-x-2 transition ring-2 ring-emerald-400/30"
              >
                <span>Sign In as {WORKER_PROFILES[selectedWorkerKey].workerType}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: EMPLOYER / SITE ADMIN LOGIN FORM */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Employer / Supervisory Role
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { key: 'admin_construction', label: 'Construction Site Owner', title: 'Owner & Chief Director', name: 'Vikram Singh' },
                    { key: 'admin_hospital', label: 'Head of Hospital', title: 'Medical Superintendent', name: 'Dr. Arvinder Mehta' },
                    { key: 'admin_school', label: 'Head of School', title: 'Principal & Head', name: 'Sister Mary Thomas' },
                    { key: 'admin_campus', label: 'Head of University Facilities', title: 'Campus Director', name: 'Dr. Anita Roy' },
                  ].map((item) => {
                    const isSelected = selectedAdminKey === item.key;
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => handleAdminTypeChange(item.key)}
                        className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30 text-white'
                            : 'bg-navy-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Building2 className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                          {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                        </div>
                        <div className="mt-2">
                          <strong className="block text-xs font-bold text-slate-100 leading-snug">{item.label}</strong>
                          <span className="text-[10px] text-slate-400 font-medium">{item.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Admin ID Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Admin / Executive ID
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="h-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    placeholder="e.g. ADMIN-CONST"
                  />
                </div>
              </div>

              {/* Admin Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Admin Passcode
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Quick Fill Demo Helper */}
              <div className="bg-navy-900/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Demo Credential: <strong>{ADMIN_PROFILES[selectedAdminKey].id}</strong> / <strong>{ADMIN_PROFILES[selectedAdminKey].password}</strong></span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pre-filled
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 flex items-center justify-center space-x-2 transition ring-2 ring-emerald-400/30"
              >
                <span>Launch Employer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

        {/* Footnote */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Protected by W3C Biometric Decent Work Protocol • ISO 45001 Safe Roster Verification
        </p>
      </div>
    </div>
  );
}
