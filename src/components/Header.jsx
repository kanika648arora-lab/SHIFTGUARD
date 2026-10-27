import React from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  LayoutDashboard, 
  Globe2, 
  UserCircle2, 
  CheckCircle2,
  LogOut,
  HardHat,
  HeartPulse,
  GraduationCap,
  Sparkles,
  Building2,
  KeyRound
} from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from '../data/mockData';

export default function Header({
  activeView,
  setActiveView,
  currentSectorKey,
  onSectorChange,
  language,
  setLanguage,
  currentUserRole,
  activeWorker,
  activeAdmin,
  onOpenProfileModal,
  onLogout,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isWorker = currentUserRole === 'worker';
  const activeUser = isWorker ? activeWorker : activeAdmin;

  return (
    <header className="sticky top-0 z-40 bg-navy-950 text-white shadow-xl border-b border-navy-800 font-['DM_Sans',sans-serif]">
      {/* Top micro SDG banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white px-4 py-1 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-emerald-900 shadow-sm">
            SDG 8
          </span>
          <strong className="font-extrabold tracking-wide">
            {t.sdgBadge}
          </strong>
          <span className="hidden md:inline text-emerald-100 font-normal">
            • 1.0 km GPS Geofence Check-in • Mandatory Photo Proof • Transparent Wages
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-[11px] text-emerald-100">
          <span className="flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
            W3C Biometric Audit Compliant
          </span>
          <span className="text-emerald-300">|</span>
          <span className="font-mono font-bold">Live v2.5</span>
        </div>
      </div>

      {/* Main Header Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/40">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                    ShiftGuard <span className="text-emerald-400 font-black">AI</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-navy-800 text-emerald-400 border border-emerald-500/30">
                    Frontline Safety OS
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Fair Hours • Real-time INR Wages • Voice Hazard Redressal
                </p>
              </div>
            </div>

            {/* Mobile Log Out button shortcut */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-200 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>

          {/* Interface Switcher: Center Buttons */}
          <div className="flex items-center justify-center bg-navy-900/90 p-1 rounded-xl border border-navy-800 shadow-inner">
            <button
              onClick={() => setActiveView('worker')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeView === 'worker'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>[ 📱 {t.workerView} ]</span>
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeView === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>[ 🖥️ {t.adminView} ]</span>
            </button>
          </div>

          {/* Right Controls: Sector, Language, Active User, Logout */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sector / Domain Selector */}
            <div className="relative flex-1 sm:flex-none">
              <div className="flex items-center bg-navy-900 rounded-lg border border-navy-800 px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500">
                {currentSectorKey === 'construction_worker' && <HardHat className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" />}
                {currentSectorKey === 'nurse' && <HeartPulse className="w-4 h-4 text-rose-400 mr-2 flex-shrink-0" />}
                {currentSectorKey === 'school_staff' && <GraduationCap className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />}
                {currentSectorKey === 'cleaning_lady' && <Sparkles className="w-4 h-4 text-teal-400 mr-2 flex-shrink-0" />}
                
                <select
                  value={currentSectorKey}
                  onChange={(e) => onSectorChange(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-bold text-slate-100 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="construction_worker" className="bg-navy-900 text-white">
                    🏗️ Construction (Metro Infra Line 3)
                  </option>
                  <option value="nurse" className="bg-navy-900 text-white">
                    🏥 Hospital (City Metro Trauma ICU)
                  </option>
                  <option value="school_staff" className="bg-navy-900 text-white">
                    🏫 School (St. Jude Model Labs)
                  </option>
                  <option value="cleaning_lady" className="bg-navy-900 text-white">
                    🧹 Sanitation (University Main Campus)
                  </option>
                </select>
              </div>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <div className="flex items-center bg-navy-900 rounded-lg border border-navy-800 px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500">
                <Globe2 className="w-4 h-4 text-emerald-400 mr-1.5 flex-shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-navy-900 text-white">
                      {lang.native} ({lang.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Switch Profile Modal Button */}
            <button
              onClick={onOpenProfileModal}
              className="hidden lg:flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-200 shadow transition group"
              title="Quick switch identity"
            >
              <img 
                src={activeUser.avatar} 
                alt={activeUser.name} 
                className="w-6 h-6 rounded-full object-cover ring-2 ring-emerald-500/80"
              />
              <div className="text-left">
                <div className="font-bold text-white leading-tight">
                  {activeUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">
                  {activeUser.id}
                </div>
              </div>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={onLogout}
              className="hidden lg:flex items-center space-x-1.5 bg-rose-950/70 hover:bg-rose-900 border border-rose-700/60 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-200 shadow hover:text-white transition"
              title="Sign Out to Login Page"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
