import React, { useState } from 'react';
import { 
  Users, 
  AlertOctagon, 
  TicketCheck, 
  IndianRupee, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Coffee, 
  ShieldAlert, 
  Download, 
  Search, 
  CheckCircle, 
  Building,
  Camera,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { TRANSLATIONS } from '../data/mockData';

export default function AdminDashboard({
  adminProfile,
  sectorData,
  language,
  tickets,
  onResolveTicket,
  workers,
  onTriggerBreak,
  onToast,
  isShiftActive,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const admin = adminProfile;

  const [ticketFilter, setTicketFilter] = useState('all'); // all | open | resolved
  const [workerSearch, setWorkerSearch] = useState('');

  // Calculate dynamic stats
  const openTicketsCount = tickets.filter(t => t.status === 'Open').length;
  const fatigueAlertsCount = workers.filter(w => w.fatigueLevel === 'High Burnout Risk').length;
  const totalActiveWorkers = sectorData.stats.totalWorkers + (isShiftActive ? 1 : 0);
  const wageLiabilities = sectorData.stats.wageLiabilities;

  // Filtered tickets
  const filteredTickets = tickets.filter(ticket => {
    if (ticketFilter === 'open') return ticket.status === 'Open';
    if (ticketFilter === 'resolved') return ticket.status === 'Resolved';
    return true;
  });

  // Filtered workers
  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
    worker.role.toLowerCase().includes(workerSearch.toLowerCase()) ||
    worker.id.toLowerCase().includes(workerSearch.toLowerCase())
  );

  // Weekly analytics aggregates
  const totalRegularWeek = sectorData.weeklyTrends.reduce((acc, curr) => acc + curr.regularHours, 0);
  const totalOtWeek = sectorData.weeklyTrends.reduce((acc, curr) => acc + curr.otHours, 0);
  const otPercentage = Math.round((totalOtWeek / (totalRegularWeek + totalOtWeek)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-['DM_Sans',sans-serif]">
      
      {/* Supervisor Site Context & Header */}
      <div className="bg-navy-900 rounded-3xl p-6 text-white shadow-xl border border-navy-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={admin.avatar}
              alt={admin.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-navy-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {sectorData.siteName}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Live Audit Active
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              Logged in as: <strong className="text-white font-extrabold">{admin.name}</strong> ({admin.id}) • <span className="text-emerald-300 font-bold">{admin.adminRoleTitle}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <strong>{admin.organization}</strong>
              </span>
              <span>•</span>
              <span className="text-emerald-300 font-bold">
                {admin.complianceLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              onToast({
                title: '📋 SDG 8 Labour Audit Exported',
                message: `Exported biometric attendance, 1km geofence audit, and photo proofs for ${sectorData.siteShortName}.`,
                type: 'success'
              });
            }}
            className="flex items-center space-x-2 bg-navy-800 hover:bg-navy-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-slate-700 transition shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Labour Audit Log</span>
          </button>
        </div>
      </div>

      {/* 1. KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Active Workers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 tracking-wider uppercase">
              {t.kpiActiveWorkers}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-navy-900 font-mono">
              {totalActiveWorkers}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" />
              100% Geofenced
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            Verified within 1.0 km radius with facial photo proof.
          </p>
        </div>

        {/* KPI 2: Fatigue Risk Alerts */}
        <div className={`rounded-2xl p-5 border shadow-sm transition ${
          fatigueAlertsCount > 0 
            ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-coral-600 tracking-wider uppercase">
              {t.kpiFatigueAlerts}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center animate-pulse">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-rose-600 font-mono">
              {fatigueAlertsCount} Workers
            </span>
            <span className="text-xs font-extrabold text-rose-700 bg-rose-200/70 px-2 py-0.5 rounded-full">
              &gt; 10h Consecutive
            </span>
          </div>
          <p className="mt-2 text-xs text-rose-800 font-medium">
            Immediate supervisor intervention required to mandate rest.
          </p>
        </div>

        {/* KPI 3: Open Tickets */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 tracking-wider uppercase">
              {t.kpiOpenTickets}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TicketCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-navy-900 font-mono">
              {openTicketsCount} Pending
            </span>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              High Priority
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            {tickets.length - openTicketsCount} tickets resolved this week under SLA.
          </p>
        </div>

        {/* KPI 4: Wage Liabilities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 tracking-wider uppercase">
              {t.kpiWageLiabilities}
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-navy-900 font-mono">
              ₹{wageLiabilities.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full font-mono">
              INR Escrowed
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            Direct Aadhaar-UPI transfer scheduled at daily shift close.
          </p>
        </div>

      </div>

      {/* 2. SHIFT & OVERTIME TREND VISUALIZATION */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black text-navy-900">
                Weekly Shift Hours vs Overtime Trends (SDG 8 Safe Hours Benchmark)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visualizing statutory 8h shift norms vs overtime bursts to prevent systemic burnout.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-bold">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-slate-700">Regular Shift Hours</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-amber-500" />
              <span className="text-slate-700">Overtime (1.5x Pay)</span>
            </div>
          </div>
        </div>

        {/* Bar Stack */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 pt-2">
          {sectorData.weeklyTrends.map((dayData) => {
            const totalHours = dayData.regularHours + dayData.otHours;
            const maxRef = 420;
            const regHeightPercent = (dayData.regularHours / maxRef) * 100;
            const otHeightPercent = (dayData.otHours / maxRef) * 100;
            const isHighOvertime = dayData.otHours > 45;

            return (
              <div 
                key={dayData.day} 
                className="bg-slate-50 hover:bg-slate-100/90 rounded-xl p-3 border border-slate-200 flex flex-col justify-between transition group"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{dayData.day}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isHighOvertime ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {totalHours}h
                  </span>
                </div>

                <div className="my-3 h-36 bg-slate-200/70 rounded-lg flex flex-col-reverse p-1.5 relative overflow-hidden">
                  <div 
                    className="w-full bg-emerald-500 rounded-b-md transition-all duration-300 group-hover:bg-emerald-600"
                    style={{ height: `${regHeightPercent}%` }}
                  />
                  <div 
                    className="w-full bg-amber-500 rounded-t-md transition-all duration-300 group-hover:bg-amber-600 mb-0.5"
                    style={{ height: `${otHeightPercent}%` }}
                  />
                </div>

                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Base:</span>
                    <strong className="font-mono text-slate-700">{dayData.regularHours}h</strong>
                  </div>
                  <div className="flex justify-between text-amber-800">
                    <span>OT:</span>
                    <strong className="font-mono">{dayData.otHours}h</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Metrics Banner */}
        <div className="mt-5 p-3.5 bg-gradient-to-r from-emerald-50 via-slate-50 to-amber-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center space-x-2">
            <span className="text-slate-800">Cumulative Weekly Hours:</span>
            <span className="font-mono text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-300 font-extrabold">
              {(totalRegularWeek + totalOtWeek).toLocaleString()} hrs
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-800">Overtime Ratio:</span>
            <span className={`font-mono px-2 py-0.5 rounded border font-extrabold ${
              otPercentage > 15 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}>
              {otPercentage}% (Permitted max: 20%)
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-emerald-700 font-extrabold">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Zero Unpaid Overtime Violations Detected</span>
          </div>
        </div>
      </div>

      {/* 3. REAL-TIME HAZARD & GRIEVANCE QUEUE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-coral-600" />
              <h2 className="text-lg font-black text-navy-900">
                Real-Time Hazard & Grievance Queue
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct reports transcribed from frontline mobile voice notes. Anonymity preserved under SDG 8 whistleblower protections.
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTicketFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                ticketFilter === 'all' 
                  ? 'bg-white text-navy-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({tickets.length})
            </button>
            <button
              onClick={() => setTicketFilter('open')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                ticketFilter === 'open' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Open ({tickets.filter(t => t.status === 'Open').length})
            </button>
            <button
              onClick={() => setTicketFilter('resolved')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                ticketFilter === 'resolved' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved ({tickets.filter(t => t.status === 'Resolved').length})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Sector / Area</th>
                <th className="py-3 px-4">Issue Summary & Category</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                    No tickets found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const isResolved = ticket.status === 'Resolved';
                  return (
                    <tr 
                      key={ticket.id} 
                      className={`hover:bg-slate-50/80 transition ${
                        !isResolved && ticket.priority === 'High' ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-navy-900">
                        {ticket.id}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-medium">
                        {ticket.timestamp}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {ticket.sector}
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <strong className="text-slate-900 block leading-snug">
                          {ticket.issue}
                        </strong>
                        <span className="text-[10px] text-slate-500 inline-block mt-0.5 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 font-medium">
                          {ticket.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {ticket.anonymous ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                            🛡️ Verified Anonymous
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-800">
                            {ticket.reportedBy}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {ticket.priority === 'High' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-coral-600 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-ping" />
                            High Priority
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                            Medium
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {t.resolved}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            {t.open}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {isResolved ? (
                          <span className="text-slate-400 font-bold text-[11px] italic">
                            Resolved & Logged
                          </span>
                        ) : (
                          <button
                            onClick={() => onResolveTicket(ticket.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3 py-1.5 rounded-lg text-[11px] inline-flex items-center space-x-1 shadow-sm transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>[ {t.resolveTicket} ]</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. WORKFORCE FATIGUE & ATTENDANCE MONITOR TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-black text-navy-900">
                Workforce Fatigue & Attendance Monitor (1.0 km Geofenced)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking of worker shift duration & mandatory photo check-in audit. Exceeding limits triggers rest orders.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search worker by name, ID or role..."
              value={workerSearch}
              onChange={(e) => setWorkerSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 font-medium"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Worker & Check-in Photo</th>
                <th className="py-3 px-4">Worker ID</th>
                <th className="py-3 px-4">Check-in Time</th>
                <th className="py-3 px-4">Hours Worked Today</th>
                <th className="py-3 px-4">Fatigue Risk Level</th>
                <th className="py-3 px-4">Status & Rest Cycle</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkers.map((w) => {
                const isRed = w.fatigueLevel === 'High Burnout Risk';
                const isYellow = w.fatigueLevel === 'Approaching Overtime';
                const isMandatedBreak = w.status.includes('Break Mandated') || w.status.includes('On Break');

                return (
                  <tr 
                    key={w.id} 
                    className={`hover:bg-slate-50 transition ${
                      isRed ? 'bg-rose-50/30' : isYellow ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-navy-900">
                      <div className="flex items-center space-x-2.5">
                        <div className="relative">
                          {w.checkInPhoto ? (
                            <img
                              src={w.checkInPhoto}
                              alt={w.name}
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-500"
                              title="Site Check-in Photo Verified"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500">
                              <Camera className="w-4 h-4" />
                            </div>
                          )}
                          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                        </div>
                        <div>
                          <strong>{w.name}</strong>
                          <span className="block text-[10px] font-normal text-slate-500">
                            {w.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {w.id}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-mono font-medium">
                      {w.checkIn}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <strong className={`font-mono text-xs ${
                          w.hoursWorked >= 10 
                            ? 'text-rose-600' 
                            : w.hoursWorked >= 8 
                            ? 'text-amber-600' 
                            : 'text-slate-800'
                        }`}>
                          {w.hoursWorked.toFixed(1)} hrs
                        </strong>
                        {w.hoursWorked > 8 && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-bold">
                            +{ (w.hoursWorked - 8).toFixed(1) }h OT
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isRed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-coral-600 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-ping" />
                          🔴 {t.fatigueDanger}
                        </span>
                      ) : isYellow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                          🟡 {t.fatigueWarning}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                          🟢 {t.fatigueSafe}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      <span className={`inline-block font-bold ${
                        isMandatedBreak ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200' : ''
                      }`}>
                        {w.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isRed ? (
                        <button
                          onClick={() => onTriggerBreak(w.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3 py-1.5 rounded-lg text-[11px] inline-flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
                        >
                          <Coffee className="w-3.5 h-3.5" />
                          <span>[ {t.triggerBreak} ]</span>
                        </button>
                      ) : isMandatedBreak ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Break Enforced
                        </span>
                      ) : (
                        <button
                          onClick={() => onTriggerBreak(w.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-md text-[11px] transition cursor-pointer"
                        >
                          Send Rest Notice
                        </button>
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
