import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Mic, 
  ShieldCheck, 
  Clock, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle, 
  Award, 
  QrCode, 
  Radio, 
  Sparkles, 
  Send, 
  FileCheck2,
  HardHat,
  Biohazard,
  Banknote,
  Lock,
  ChevronRight,
  MapPin,
  Camera,
  User,
  Heart,
  Phone,
  PhoneCall,
  Activity,
  Calendar,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { TRANSLATIONS } from '../data/mockData';
import PhotoProofModal from './PhotoProofModal';

export default function WorkerView({
  workerProfile,
  language,
  onNewTicketCreated,
  onToast,
  isShiftActive,
  setIsShiftActive,
  workedHours,
  setWorkedHours,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const worker = workerProfile;

  // Internal tab: 'shift' (Shift & Live Wages) vs 'profile' (My Full Profile)
  const [phoneTab, setPhoneTab] = useState('shift');

  // Geofence Distance State (in km)
  // Default to 0.35 km (350m) so check-in is valid initially, but toggleable to test >1km restriction!
  const [currentDistanceKm, setCurrentDistanceKm] = useState(0.35);

  // Photo Proof States
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoModalMode, setPhotoModalMode] = useState('checkin'); // 'checkin' | 'checkout'
  const [checkInPhotoProof, setCheckInPhotoProof] = useState(worker.avatar);
  const [checkOutPhotoProof, setCheckOutPhotoProof] = useState(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [hasVoiceTranscribed, setHasVoiceTranscribed] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [hazardCategory, setHazardCategory] = useState(worker.hazardCategoryDefault || 'Safety Hazard');

  // When worker profile changes, reset voice note defaults
  useEffect(() => {
    setTranscribedText('');
    setHasVoiceTranscribed(false);
    setHazardCategory(worker.hazardCategoryDefault || 'Safety Hazard');
  }, [worker.id]);

  // Live timer tick every 10 seconds if shift is active
  useEffect(() => {
    if (!isShiftActive) return;
    const interval = setInterval(() => {
      setWorkedHours(prev => Math.round((prev + 0.01) * 100) / 100);
    }, 10000);
    return () => clearInterval(interval);
  }, [isShiftActive, setWorkedHours]);

  // Calculation of wages
  const regularHoursLimit = 8.0;
  const regularHoursWorked = Math.min(workedHours, regularHoursLimit);
  const overtimeHoursWorked = Math.max(0, workedHours - regularHoursLimit);

  const baseRate = worker.baseRate;
  const otRate = worker.otRate;

  const baseEarnings = Math.round(regularHoursWorked * baseRate);
  const otEarnings = Math.round(overtimeHoursWorked * otRate);
  const totalEarnings = baseEarnings + otEarnings;

  // Format hours to "06h 42m"
  const totalMinutes = Math.round(workedHours * 60);
  const displayHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const displayMinutes = (totalMinutes % 60).toString().padStart(2, '0');

  // Geofence logic (1km radius rule)
  const isWithinGeofence = currentDistanceKm <= 1.0;

  // Handle Check-in click
  const handleCheckInClick = () => {
    if (!isWithinGeofence) {
      onToast({
        title: '⚠️ Geofence Lock Triggered',
        message: `You are ${currentDistanceKm} km away. Shift check-in strictly requires being within 1.0 km radius of the worksite.`,
        type: 'error'
      });
      return;
    }

    // Trigger photo proof capture
    setPhotoModalMode('checkin');
    setIsPhotoModalOpen(true);
  };

  // Handle Clock-out click
  const handleClockOutClick = () => {
    // Trigger photo proof capture for clock out
    setPhotoModalMode('checkout');
    setIsPhotoModalOpen(true);
  };

  // Callback when photo proof is confirmed in modal
  const handleProofConfirmed = (proofData) => {
    if (proofData.mode === 'checkin') {
      setCheckInPhotoProof(proofData.photoUrl);
      setIsShiftActive(true);
      onToast({
        title: '🟢 Shift Check-In Verified',
        message: `Welcome ${worker.name}! Photo proof & GPS geo-stamp (${currentDistanceKm} km) logged to site safety registry.`,
        type: 'success'
      });
    } else {
      setCheckOutPhotoProof(proofData.photoUrl);
      setIsShiftActive(false);
      onToast({
        title: '🏁 Shift Clock-Out Verified',
        message: `Clock-out photo proof logged. Total shift: ${displayHours}h ${displayMinutes}m. ₹${totalEarnings.toLocaleString('en-IN')} approved for direct deposit.`,
        type: 'info'
      });
    }
  };

  // Trigger simulated voice recording
  const handleStartVoiceRecording = () => {
    if (isRecording) return;
    setIsRecording(true);
    setHasVoiceTranscribed(false);
    onToast({
      title: '🎙️ Voice Recording Active',
      message: 'Listening... AI Speech Engine is analyzing frequency & removing site background noise.',
      type: 'info'
    });

    setTimeout(() => {
      setIsRecording(false);
      setTranscribedText(worker.defaultHazardPrompt);
      setHasVoiceTranscribed(true);
      onToast({
        title: '✨ AI Voice Transcribed',
        message: 'Hazard transcription complete. Verified against occupational hazard keywords.',
        type: 'success'
      });
    }, 2000);
  };

  // Submit hazard grievance ticket
  const handleSubmitHazard = (e) => {
    e?.preventDefault();
    if (!transcribedText.trim()) {
      onToast({
        title: 'Empty Hazard Note',
        message: 'Please record or type a hazard description before submitting.',
        type: 'error'
      });
      return;
    }

    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      sector: `${worker.siteShortName} (${worker.department})`,
      issue: transcribedText,
      category: hazardCategory,
      priority: 'High',
      status: 'Open',
      anonymous: isAnonymous,
      reportedBy: isAnonymous ? `Verified Worker ${worker.id} (Anonymous)` : `${worker.name} (${worker.role})`,
    };

    onNewTicketCreated(newTicket);
    onToast({
      title: '✅ Report Submitted Securely',
      message: isAnonymous 
        ? 'Your report was securely routed to Chief Supervisor with identity encryption.' 
        : `Report submitted under verified employee ID ${worker.id}.`,
      type: 'success'
    });

    setTranscribedText('');
    setHasVoiceTranscribed(false);
  };

  // Simulation time adjustments
  const addSimulationTime = (deltaHours) => {
    setWorkedHours(prev => {
      return Math.max(0, Math.round((prev + deltaHours) * 10) / 10);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 sm:px-4 font-['DM_Sans',sans-serif]">
      
      {/* Smartphone frame container */}
      <div className="w-full max-w-sm rounded-[42px] border-[10px] border-slate-900 bg-white shadow-2xl overflow-hidden relative transition-all duration-300">
        
        {/* Phone Top Speaker & Status Bar */}
        <div className="bg-slate-900 pt-3 pb-2 px-6 flex items-center justify-between text-white text-[11px] font-mono select-none">
          <span>09:41</span>
          <div className="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center space-x-1">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold">5G</span>
            <div className="w-4 h-2 border border-white/60 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Scrollable Phone Screen */}
        <div className="bg-slate-50 min-h-[720px] max-h-[840px] overflow-y-auto pb-8 text-slate-800 scrollbar-none">
          
          {/* 1. WORKER PROFILE HEADER */}
          <div className="bg-navy-900 text-white p-4 pt-3 rounded-b-3xl shadow-md border-b border-navy-800 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-navy-900 rounded-full animate-pulse-fast" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h2 className="text-base font-extrabold tracking-tight text-white">
                      {worker.name}
                    </h2>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-navy-800 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {worker.id}
                    </span>
                  </div>
                  <div className="mt-0.5">
                    <span className="inline-block px-2 py-0.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold rounded-full">
                      {worker.workerType}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1 flex items-center gap-1 truncate max-w-[190px]">
                    📍 <strong className="text-slate-100">{worker.siteShortName}</strong>
                  </p>
                </div>
              </div>

              {/* Verified Status Badge */}
              <div className="flex flex-col items-end">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-600/40 px-2 py-0.5 rounded-full shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Active
                </span>
                <span className="text-[9px] text-slate-400 mt-1 font-medium">
                  SDG 8 Protected
                </span>
              </div>
            </div>

            {/* In-App Tab Switcher */}
            <div className="mt-4 flex bg-navy-950/80 p-1 rounded-xl border border-navy-800">
              <button
                type="button"
                onClick={() => setPhoneTab('shift')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  phoneTab === 'shift'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t.shiftAndPay}</span>
              </button>
              <button
                type="button"
                onClick={() => setPhoneTab('profile')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                  phoneTab === 'profile'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.myProfile}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: SHIFT TRACKER & WAGES & GEOFENCE */}
          {phoneTab === 'shift' && (
            <div className="p-4 space-y-4">

              {/* 1. GEOFENCE 1KM RADIUS CARD */}
              <div className={`rounded-2xl p-3.5 border transition-all ${
                isWithinGeofence
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-rose-50/80 border-rose-300'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isWithinGeofence ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        GPS Geofence: 1.0 km Site Verification
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {worker.siteName}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono ${
                    isWithinGeofence
                      ? 'bg-emerald-200/70 text-emerald-900'
                      : 'bg-rose-200/80 text-rose-900 animate-pulse'
                  }`}>
                    {currentDistanceKm} km
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                  <span className={`font-bold flex items-center gap-1 ${
                    isWithinGeofence ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {isWithinGeofence ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Inside Permitted 1.0 km Work Zone</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Outside 1.0 km Radius • Check-In Locked</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Geofence Simulator Toggle Buttons */}
                <div className="mt-2.5 bg-white/80 p-1.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-1 text-[10px]">
                  <span className="text-slate-500 font-medium text-[9px] px-1">Simulate GPS:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDistanceKm(0.35);
                        onToast({
                          title: '📍 GPS Updated: On-Site',
                          message: 'Simulated 350m distance from site center. Check-in unlocked.',
                          type: 'success'
                        });
                      }}
                      className={`px-2 py-0.5 rounded font-bold transition ${
                        currentDistanceKm <= 1.0
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      On-Site (350m)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentDistanceKm(2.4);
                        onToast({
                          title: '⚠️ GPS Updated: Off-Site',
                          message: 'Simulated 2.4 km distance. Shift check-in disabled outside 1.0 km radius.',
                          type: 'error'
                        });
                      }}
                      className={`px-2 py-0.5 rounded font-bold transition ${
                        currentDistanceKm > 1.0
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Off-Site (2.4km)
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. SHIFT CHECK-IN & REAL-TIME PAY CARD */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                
                {/* Check-In / Clock Out Main Action */}
                {isShiftActive ? (
                  <button
                    type="button"
                    onClick={handleClockOutClick}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2.5 transition-all duration-200 shadow-md bg-navy-900 hover:bg-navy-950 text-white border-2 border-slate-700 hover:border-slate-500"
                  >
                    <Square className="w-4 h-4 fill-coral-500 text-coral-500" />
                    <span>Clock Out & Upload Exit Proof</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCheckInClick}
                    disabled={!isWithinGeofence}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2.5 transition-all duration-200 shadow-md ${
                      isWithinGeofence
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/25 ring-2 ring-emerald-400/30 cursor-pointer'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {isWithinGeofence ? 'Check In to Shift (Photo Proof)' : 'Check-In Disabled (Outside 1km)'}
                    </span>
                  </button>
                )}

                {/* Real-time elapsed time counter */}
                <div className="mt-3.5 bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {isShiftActive ? 'Active Shift in Progress' : 'Shift Standby'}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-mono font-bold px-1.5 py-0.5 rounded">
                      Daily Cap: 8h
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black font-mono tracking-tight text-navy-900">
                        {displayHours}h {displayMinutes}m
                      </span>
                      <span className="text-xs text-slate-500 ml-1.5 font-bold">
                        {t.workedToday}
                      </span>
                    </div>

                    {overtimeHoursWorked > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-md border border-amber-300 animate-pulse">
                        ⚡ Overtime Active (+{Math.round(overtimeHoursWorked * 60)}m)
                      </span>
                    )}
                  </div>

                  {/* Dual Segment Progress Bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[10px] font-bold mb-1 text-slate-600">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Regular: <strong>{regularHoursWorked.toFixed(1)}h</strong>
                      </span>
                      <span className="flex items-center gap-1 text-amber-700">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Overtime: <strong>{overtimeHoursWorked.toFixed(1)}h</strong>
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        className="bg-emerald-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (regularHoursWorked / 8) * 70)}%` }}
                      />
                      {overtimeHoursWorked > 0 && (
                        <div
                          className="bg-amber-500 transition-all duration-300 animate-pulse"
                          style={{ width: `${Math.min(30, (overtimeHoursWorked / 4) * 30)}%` }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Prototype Simulator Controls */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 text-[10px] font-medium">Test hours:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => addSimulationTime(-1)}
                        className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-mono text-[10px] font-bold"
                      >
                        -1h
                      </button>
                      <button
                        onClick={() => addSimulationTime(0.5)}
                        className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-mono text-[10px] font-bold"
                      >
                        +30m
                      </button>
                      <button
                        onClick={() => addSimulationTime(2.0)}
                        className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 hover:bg-emerald-100 font-mono text-[10px] font-extrabold"
                      >
                        +2h (OT)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Pay Breakdown Card in ₹ INR */}
                <div className="mt-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-xs">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                      <span>Transparent Wage Accrual</span>
                    </div>
                    <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full shadow-xs">
                      Live Total
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">{t.baseRate}:</span>
                      <span className="font-bold font-mono text-slate-900">
                        ₹{baseRate} / hr × {regularHoursWorked.toFixed(1)}h = <strong>₹{baseEarnings.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-amber-900">
                      <span className="flex items-center gap-1 text-[11px]">
                        <span>{t.overtimeRate}:</span>
                        {overtimeHoursWorked > 0 && (
                          <span className="text-[9px] bg-amber-200 px-1 rounded font-black">1.5x</span>
                        )}
                      </span>
                      <span className="font-bold font-mono">
                        ₹{otRate} / hr × {overtimeHoursWorked.toFixed(1)}h = <strong>₹{otEarnings.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/80 flex justify-between items-baseline">
                      <span className="font-extrabold text-emerald-950 text-xs">
                        {t.estimatedEarnings}:
                      </span>
                      <div className="text-right">
                        <span className="text-xl font-black text-emerald-700 font-mono">
                          ₹{totalEarnings.toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[9px] text-emerald-600 font-bold">
                          ₹ INR (Direct Aadhaar-UPI)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Proof Status Badges */}
                <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      <strong>Login Proof (Site Photo):</strong>
                    </span>
                    {checkInPhotoProof ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Pending Check-in</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <strong>Logout Proof (Site Photo):</strong>
                    </span>
                    {checkOutPhotoProof ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Logged
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Pending Shift Close</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. ANONYMOUS VOICE HAZARD & GRIEVANCE REPORTER */}
              <div className="bg-gradient-to-br from-coral-500 to-rose-600 rounded-2xl p-4 text-white shadow-lg shadow-coral-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm tracking-tight leading-tight">
                        {t.reportHazard}
                      </h3>
                      <p className="text-[10px] text-coral-100">
                        Zero Retaliation • Direct site supervisor alert
                      </p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-black/20 text-[9px] font-mono tracking-wide uppercase font-bold">
                    UN SDG 8.8
                  </span>
                </div>

                {/* Voice Card Action */}
                <div className="mt-3 bg-white rounded-xl p-3 text-slate-800 shadow-md">
                  <button
                    type="button"
                    onClick={handleStartVoiceRecording}
                    disabled={isRecording}
                    className={`w-full py-3 px-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isRecording 
                        ? 'bg-rose-50 border-rose-400' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {isRecording ? (
                      <div className="flex flex-col items-center space-y-2 py-1">
                        <div className="flex items-center justify-center gap-1.5 h-8">
                          <span className="w-1.5 bg-rose-500 rounded-full wave-bar" />
                          <span className="w-1.5 bg-rose-600 rounded-full wave-bar" />
                          <span className="w-1.5 bg-rose-500 rounded-full wave-bar" />
                          <span className="w-1.5 bg-rose-700 rounded-full wave-bar" />
                          <span className="w-1.5 bg-rose-600 rounded-full wave-bar" />
                        </div>
                        <span className="text-xs font-bold text-rose-600 animate-pulse">
                          {t.recording}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-rose-600">
                        <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center">
                          <Mic className="w-4 h-4 text-rose-600" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold block leading-snug">
                            {hasVoiceTranscribed ? 'Tap to Re-Record Voice Note' : t.tapToSpeak}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Supports Hindi, Tamil, Bengali, Telugu & English
                          </span>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Transcribed Text */}
                  {transcribedText && (
                    <div className="mt-3 bg-amber-50/80 border border-amber-200 rounded-lg p-2.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-amber-800 mb-1">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          AI Voice Transcript (Verified)
                        </span>
                        <span className="text-slate-500 font-mono text-[9px] font-bold">98% Match</span>
                      </div>
                      <textarea
                        value={transcribedText}
                        onChange={(e) => setTranscribedText(e.target.value)}
                        rows={2}
                        className="w-full text-xs text-slate-800 bg-white border border-amber-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  )}

                  {/* Anonymity Checkbox */}
                  <label className="mt-3 flex items-start space-x-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div className="text-[11px] leading-tight">
                      <span className="font-bold text-slate-800 block">
                        {t.anonymousReport}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        Employee ID <strong>{worker.id}</strong> will remain encrypted from supervisor.
                      </span>
                    </div>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleSubmitHazard}
                    disabled={!transcribedText.trim()}
                    className={`mt-3 w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                      transcribedText.trim()
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Incident to Supervisor</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MY FULL PROFILE (DETAILED WORKER SPECS) */}
          {phoneTab === 'profile' && (
            <div className="p-4 space-y-4">
              
              {/* Profile Card Header */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-center relative overflow-hidden">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden ring-4 ring-emerald-500/30 shadow-md">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-3 text-base font-extrabold text-navy-900">
                  {worker.name}
                </h3>
                <span className="inline-block mt-0.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                  {worker.role}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 font-mono font-bold">
                  Employee ID: <strong className="text-slate-800">{worker.id}</strong>
                </p>
              </div>

              {/* Physical & Medical Attributes Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center space-x-2 text-xs font-bold text-navy-900 pb-2.5 border-b border-slate-100 mb-3">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Physical & Medical Profile</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Age</span>
                    <strong className="text-sm font-black text-navy-900">{worker.age} Years</strong>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Blood Type</span>
                    <strong className="text-sm font-black text-rose-600 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      {worker.bloodType}
                    </strong>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Height</span>
                    <strong className="text-xs font-bold text-navy-900">{worker.height}</strong>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Weight</span>
                    <strong className="text-xs font-bold text-navy-900">{worker.weight}</strong>
                  </div>
                </div>

                <div className="mt-3 bg-emerald-50/70 p-2 rounded-xl text-[10px] text-emerald-900 flex items-center justify-between border border-emerald-200">
                  <span>Health Insurance ID:</span>
                  <strong className="font-mono">{worker.healthInsuranceId}</strong>
                </div>
              </div>

              {/* Emergency Contact Card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-900 pb-2.5 border-b border-slate-100 mb-3">
                  <Phone className="w-4 h-4 text-rose-600" />
                  <span>Emergency Safety Contact</span>
                </div>

                <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200 flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-extrabold text-navy-900 block">
                      {worker.emergencyContact.name} ({worker.emergencyContact.relation})
                    </strong>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {worker.emergencyContact.phone}
                    </span>
                  </div>
                  <a
                    href={`tel:${worker.emergencyContact.phone}`}
                    className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs hover:bg-rose-700 transition"
                    title="Direct SOS Call"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Chief Supervisor Details */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center space-x-2 text-xs font-bold text-navy-900 pb-2.5 border-b border-slate-100 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Chief Supervisor & Chain of Command</span>
                </div>

                <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <img
                    src={worker.supervisor.avatar}
                    alt={worker.supervisor.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-navy-800"
                  />
                  <div className="flex-1 min-w-0">
                    <strong className="text-xs font-extrabold text-navy-900 block truncate">
                      {worker.supervisor.name}
                    </strong>
                    <span className="text-[10px] text-slate-500 block truncate font-medium">
                      {worker.supervisor.role}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-600">
                      <span>ID: <strong className="font-mono">{worker.supervisor.id}</strong></span>
                      <span>•</span>
                      <strong className="font-mono text-emerald-800">{worker.supervisor.phone}</strong>
                    </div>
                  </div>
                  <a
                    href={`tel:${worker.supervisor.phone}`}
                    className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center shadow-xs hover:bg-navy-900 transition flex-shrink-0"
                    title="Call Supervisor"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Cumulative Working Hours & Earnings Till Now */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center space-x-2 text-xs font-bold text-navy-900 pb-2.5 border-b border-slate-100 mb-3">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Fair Wage & Verified Hours Log</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Total Lifetime Hours</span>
                    <strong className="text-base font-black text-navy-900 font-mono">
                      {worker.lifetimeHours.toLocaleString()} hrs
                    </strong>
                    <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">
                      + {worker.weeklyHours}h this week
                    </span>
                  </div>

                  <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 block">Total Lifetime Earnings</span>
                    <strong className="text-base font-black text-emerald-700 font-mono">
                      ₹{worker.lifetimeEarnings.toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[9px] text-slate-500 font-medium block mt-0.5">
                      Direct INR Deposited
                    </span>
                  </div>
                </div>

                <div className="mt-3 bg-slate-50 p-2 rounded-xl text-[10px] text-slate-600 flex items-center justify-between border border-slate-200">
                  <span>Linked Payout: <strong>{worker.bankAccount}</strong></span>
                  <strong className="text-emerald-700">Zero Cut</strong>
                </div>
              </div>

              {/* Verified Digital Badges */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-navy-900">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Verified Skill Certifications ({worker.badges.length})</span>
                  </div>
                  <button
                    onClick={() => setShowQrModal(!showQrModal)}
                    className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                  >
                    {showQrModal ? 'Hide Passport' : 'Show Passport'}
                  </button>
                </div>

                {showQrModal && (
                  <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="w-28 h-28 mx-auto bg-white p-2 rounded-lg border border-slate-300 flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-slate-900" />
                    </div>
                    <p className="text-[9px] font-mono text-slate-600 mt-1">
                      DID:india:frontline:{worker.id}:verified
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  {worker.badges.map((b) => (
                    <div key={b.id} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <strong className="block text-slate-900 text-xs">{b.name}</strong>
                        <span className="text-[10px] text-slate-500">{b.issuer}</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {b.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Bottom Home indicator */}
          <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-4 mb-2" />
        </div>

      </div>

      {/* Photo Proof Modal for Check-in & Clock-Out */}
      <PhotoProofModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        mode={photoModalMode}
        worker={worker}
        siteName={worker.siteName}
        currentDistanceKm={currentDistanceKm}
        onProofConfirmed={handleProofConfirmed}
      />

    </div>
  );
}
