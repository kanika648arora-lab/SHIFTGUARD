import React, { useState } from 'react';
import Header from './components/Header';
import WorkerView from './components/WorkerView';
import AdminDashboard from './components/AdminDashboard';
import ProfileModal from './components/ProfileModal';
import LoginPage from './components/LoginPage';
import Toast from './components/Toast';
import { WORKER_PROFILES, ADMIN_PROFILES } from './data/mockData';
import { Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState('worker'); // 'worker' | 'admin'
  const [currentSectorKey, setCurrentSectorKey] = useState('construction_worker');
  const [currentAdminKey, setCurrentAdminKey] = useState('admin_construction');

  // Active view: 'worker' | 'admin'
  const [activeView, setActiveView] = useState('worker');
  const [language, setLanguage] = useState('en');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Shift & Hours states
  const [isShiftActive, setIsShiftActive] = useState(true);
  const [workedHours, setWorkedHours] = useState(6.7); // 6h 42m

  // Tickets stored dynamically per sector
  const [ticketsBySector, setTicketsBySector] = useState({
    construction_worker: WORKER_PROFILES.construction_worker.tickets,
    nurse: WORKER_PROFILES.nurse.tickets,
    school_staff: WORKER_PROFILES.school_staff.tickets,
    cleaning_lady: WORKER_PROFILES.cleaning_lady.tickets,
  });

  // Workers roster stored dynamically per sector
  const [workersBySector, setWorkersBySector] = useState({
    construction_worker: WORKER_PROFILES.construction_worker.roster,
    nurse: WORKER_PROFILES.nurse.roster,
    school_staff: WORKER_PROFILES.school_staff.roster,
    cleaning_lady: WORKER_PROFILES.cleaning_lady.roster,
  });

  // Toast system
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random().toString();
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const handleLoginSuccess = (loginData) => {
    setIsAuthenticated(true);
    setCurrentUserRole(loginData.role);

    if (loginData.role === 'worker') {
      setCurrentSectorKey(loginData.workerKey);
      setActiveView('worker');
      addToast({
        title: `🟢 Welcome, ${loginData.profile.name}!`,
        message: `Signed in as ${loginData.profile.workerType}. Site: ${loginData.profile.siteShortName}.`,
        type: 'success',
      });
    } else {
      setCurrentAdminKey(loginData.adminKey);
      setCurrentSectorKey(loginData.sectorKey);
      setActiveView('admin');
      addToast({
        title: `🏛️ Welcome, ${loginData.profile.name}!`,
        message: `Logged in as ${loginData.profile.adminRoleTitle}. Audit dashboard activated.`,
        type: 'info',
      });
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    addToast({
      title: '🚪 Signed Out',
      message: 'You have been securely signed out. Please log in with your ID and password.',
      type: 'info',
    });
  };

  // Sector switcher handler
  const handleSectorChange = (newSectorKey) => {
    setCurrentSectorKey(newSectorKey);
    // Align admin key
    const matchingAdmin = Object.values(ADMIN_PROFILES).find(a => a.sectorKey === newSectorKey);
    if (matchingAdmin) {
      setCurrentAdminKey(matchingAdmin.adminTypeKey);
    }
    addToast({
      title: `📍 Sector Switched: ${WORKER_PROFILES[newSectorKey].siteShortName}`,
      message: `Active roster and compliance logs updated for ${WORKER_PROFILES[newSectorKey].workerType}.`,
      type: 'info',
    });
  };

  // Persona switch from modal
  const handleSelectPersona = (role, sectorKey, adminKey) => {
    setCurrentUserRole(role);
    setCurrentSectorKey(sectorKey);
    if (role === 'admin' && adminKey) {
      setCurrentAdminKey(adminKey);
      setActiveView('admin');
    } else {
      setActiveView('worker');
    }
    const profile = role === 'worker' ? WORKER_PROFILES[sectorKey] : ADMIN_PROFILES[adminKey || currentAdminKey];
    addToast({
      title: `👤 Switched to ${profile.name}`,
      message: `Role: ${role === 'worker' ? profile.workerType : profile.adminRoleTitle}`,
      type: 'info',
    });
  };

  // Handle new hazard ticket created
  const handleNewTicketCreated = (newTicket) => {
    setTicketsBySector((prev) => ({
      ...prev,
      [currentSectorKey]: [newTicket, ...prev[currentSectorKey]],
    }));
  };

  // Handle resolve ticket from Admin
  const handleResolveTicket = (ticketId) => {
    setTicketsBySector((prev) => ({
      ...prev,
      [currentSectorKey]: prev[currentSectorKey].map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: 'Resolved' } : ticket
      ),
    }));

    addToast({
      title: '✅ Ticket Status Updated to Resolved',
      message: `Ticket #${ticketId} marked resolved with supervisor corrective action.`,
      type: 'success',
    });
  };

  // Handle trigger mandatory break from Admin
  const handleTriggerBreak = (workerId) => {
    const targetWorker = workersBySector[currentSectorKey].find((w) => w.id === workerId);
    const workerName = targetWorker ? targetWorker.name : workerId;

    setWorkersBySector((prev) => ({
      ...prev,
      [currentSectorKey]: prev[currentSectorKey].map((w) => {
        if (w.id === workerId) {
          return {
            ...w,
            fatigueLevel: 'Safe',
            status: 'On Break (Paid) • 45m Rest Mandated',
            breaksTaken: (w.breaksTaken || 0) + 1,
          };
        }
        return w;
      }),
    }));

    addToast({
      title: '🛑 Mandatory Paid Rest Mandated',
      message: `Statutory fatigue cooldown enforced for ${workerName} under SDG 8 safe rest compliance.`,
      type: 'info',
    });
  };

  // Current active profiles
  const activeWorkerProfile = WORKER_PROFILES[currentSectorKey];
  const activeAdminProfile = ADMIN_PROFILES[currentAdminKey] || ADMIN_PROFILES.admin_construction;
  const currentTickets = ticketsBySector[currentSectorKey] || [];
  const currentWorkers = workersBySector[currentSectorKey] || [];

  // If not authenticated, show Login Page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <Toast toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white font-['DM_Sans',sans-serif]">
      <div>
        {/* Top Control Header */}
        <Header
          activeView={activeView}
          setActiveView={setActiveView}
          currentSectorKey={currentSectorKey}
          onSectorChange={handleSectorChange}
          language={language}
          setLanguage={setLanguage}
          currentUserRole={currentUserRole}
          activeWorker={activeWorkerProfile}
          activeAdmin={activeAdminProfile}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* View Transition Banner / Demo Guide */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/90 rounded-2xl p-3 px-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                ℹ
              </span>
              <span>
                Viewing: <strong className="text-navy-950 font-black">{activeView === 'worker' ? 'Worker Mobile Smartphone' : 'Employer Admin Desktop Dashboard'}</strong>
                {' '}— Sector: <strong className="text-emerald-700 font-bold">{activeWorkerProfile.siteShortName}</strong> ({activeWorkerProfile.workerType})
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView(activeView === 'worker' ? 'admin' : 'worker')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick Toggle: {activeView === 'worker' ? 'Switch to Admin Dashboard 🖥️' : 'Switch to Worker Mobile 📱'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Primary View Area */}
        <main className="py-4">
          {activeView === 'worker' ? (
            <WorkerView
              workerProfile={activeWorkerProfile}
              language={language}
              onNewTicketCreated={handleNewTicketCreated}
              onToast={addToast}
              isShiftActive={isShiftActive}
              setIsShiftActive={setIsShiftActive}
              workedHours={workedHours}
              setWorkedHours={setWorkedHours}
            />
          ) : (
            <AdminDashboard
              adminProfile={activeAdminProfile}
              sectorData={activeWorkerProfile}
              language={language}
              tickets={currentTickets}
              onResolveTicket={handleResolveTicket}
              workers={currentWorkers}
              onTriggerBreak={handleTriggerBreak}
              onToast={addToast}
              isShiftActive={isShiftActive}
            />
          )}
        </main>
      </div>

      {/* Profile Switcher Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUserRole={currentUserRole}
        currentSectorKey={currentSectorKey}
        onSelectPersona={handleSelectPersona}
        onLogout={handleLogout}
      />

      {/* Global Interactive Toast Feedback */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Footer with SDG 8 & Decent Work Compliance Seals */}
      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs mt-12 font-['DM_Sans',sans-serif]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
              8
            </div>
            <div>
              <strong className="text-slate-800">UN SDG 8 Decent Work & Economic Growth</strong>
              <p className="text-[11px] text-slate-400">
                Target 8.8: Protect labour rights and promote safe and secure working environments for all frontline workers.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-500 font-bold">
            <span>1.0 km GPS Radius</span>
            <span>•</span>
            <span>Check-in & Exit Photo Proof</span>
            <span>•</span>
            <span>DM Sans Typography</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
