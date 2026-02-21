import React, { useState, useEffect } from 'react';
import {
  Home,
  MessageSquare,
  Stethoscope,
  User,
  ShieldAlert,
  Moon,
  Sun,
  Bell,
  Briefcase,
  Pill,
  LogOut,
  Languages
} from 'lucide-react';
import { UserProfile, AppRoute, Doctor, Appointment, Notification, MedicalReport, PrescriptionData, MedicalEvent, AuthResponse, Medication, OngoingTreatment } from './types';
import { AuthService, MOCK_PATIENT_DATA } from './services/authService';
import VideoCallModal from './components/VideoCallModal';
import DoctorChatView from './components/DoctorChatView';
import { useLanguage, LANGUAGE_NAMES } from './contexts/LanguageContext';
import SOSOverlay from './components/SOSOverlay';
import NotificationPanel from './components/NotificationPanel';
import MedicationPanel from './components/MedicationPanel';

import BookingSuccessModal from './components/BookingSuccessModal';
import AppTour from './components/AppTour';
import AnimatedStats from './components/AnimatedStats';
import MedicalReportsModal from './components/MedicalReportsModal';
import VFamilyModal from './components/VFamilyModal';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GoogleTranslate from './components/GoogleTranslate';

import DoctorsPage from './pages/DoctorsPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPatientView from './pages/DoctorPatientView';
import DoctorProfilePage from './pages/DoctorProfilePage';
import ChatbotPage from './pages/ChatbotPage';

// --- MOCK DATA ---
const MOCK_REPORTS: MedicalReport[] = [
  { id: '101', title: 'Complete Blood Count (CBC)', date: '2023-11-15', type: 'Lab Report', doctorName: 'City PathLabs', url: '#' },
  { id: '102', title: 'Eye Vision Prescription', date: '2023-08-10', type: 'Prescription', doctorName: 'Dr. Aditi Gupta', url: '#' },
  { id: '103', title: 'Discharge Summary - Surgery', date: '2022-12-08', type: 'Certificate', doctorName: 'Apollo Hospital', url: '#' },
  { id: '104', title: 'Allergy Test Panel', date: '2022-03-15', type: 'Lab Report', doctorName: 'Dr. Meera Reddy', url: '#' },
  { id: '105', title: 'COVID-19 Vaccination Cert', date: '2021-06-20', type: 'Certificate', doctorName: 'CoWin', url: '#' },
  { id: '106', title: 'Chest X-Ray PA View', date: '2020-09-12', type: 'Imaging', doctorName: 'City Imaging Center', url: '#' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Appointment Reminder', message: 'Video consult with Dr. Anita Desai starts in 15 mins.', time: '10 min ago', type: 'reminder', read: false },
  { id: '2', title: 'Lab Results Ready', message: 'Your recent blood work report is available for download.', time: '2 hours ago', type: 'info', read: false },
  { id: '3', title: 'Daily Check-in', message: 'Time for your daily wellness check.', time: 'Yesterday', type: 'alert', read: true },
];

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: '1', name: 'Dr. Anita Desai', specialty: 'Cardiologist', rating: 4.9, image: 'https://picsum.photos/100/100?random=1', nextAvailable: 'Today, 2:30 PM', price: '₹1200', isVideoEnabled: true,
    about: 'Dr. Anita Desai is a senior Cardiologist with over 15 years of experience. She specializes in preventive cardiology and heart failure management.',
    experience: 15, qualifications: ['MBBS', 'MD (Medicine)', 'DM (Cardiology)'], verified: true
  },
  {
    id: '2', name: 'Dr. Rajesh Kumar', specialty: 'General Physician', rating: 4.7, image: 'https://picsum.photos/100/100?random=2', nextAvailable: 'Tomorrow, 9:00 AM', price: '₹600', isVideoEnabled: false,
    about: 'Friendly neighborhood physician focusing on holistic health and chronic disease management.',
    experience: 8, qualifications: ['MBBS', 'DNB (Family Medicine)']
  },
  {
    id: '3', name: 'Dr. Meera Reddy', specialty: 'Dermatologist', rating: 4.8, image: 'https://picsum.photos/100/100?random=3', nextAvailable: 'Today, 4:15 PM', price: '₹900', isVideoEnabled: true,
    experience: 10, qualifications: ['MBBS', 'MD (Dermatology)']
  },
  {
    id: '4', name: 'Dr. Vikram Singh', specialty: 'Neurologist', rating: 4.9, image: 'https://picsum.photos/100/100?random=4', nextAvailable: 'Wed, 11:00 AM', price: '₹1500', isVideoEnabled: true,
    about: 'Expert in treating migraines, epilepsy, and stroke rehabilitation. Passionate about leveraging technology for patient care.',
    experience: 12, qualifications: ['MBBS', 'MD', 'DM (Neurology)'], verified: true
  },
  {
    id: '5', name: 'Dr. Arjun Gupta', specialty: 'Orthopedist', rating: 4.6, image: 'https://picsum.photos/100/100?random=5', nextAvailable: 'Thu, 10:30 AM', price: '₹1000', isVideoEnabled: true,
    experience: 14, qualifications: ['MBBS', 'MS (Orthopedics)']
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  // Upcoming
  { id: '201', doctorId: '1', doctorName: 'Dr. Anita Desai', date: 'Today', time: '2:30 PM', type: 'video', status: 'upcoming', notes: 'Routine check' },
  { id: '204', doctorId: '4', doctorName: 'Dr. Vikram Singh', date: 'Tomorrow', time: '11:00 AM', type: 'video', status: 'upcoming', notes: 'Follow up on migraine' },

  // Pending Requests (For Doctor Dashboard Demo)
  { id: '207', doctorId: '4', doctorName: 'Dr. Vikram Singh', date: 'Today', time: '04:00 PM', type: 'video', status: 'pending', notes: 'New Patient: Frequent headaches' },
  { id: '208', doctorId: '4', doctorName: 'Dr. Vikram Singh', date: 'Tomorrow', time: '12:30 PM', type: 'in-person', status: 'pending', notes: 'Review MRI Scan' },

  // History - Enriched for Demo
  { id: '202', doctorId: '2', doctorName: 'Dr. Rajesh Kumar', date: '2023-11-15', time: '10:00 AM', type: 'in-person', status: 'completed', notes: 'Annual Physical', diagnosis: 'Healthy', prescription: ['Multivitamins'], userRating: 5 },
  { id: '205', doctorId: '6', doctorName: 'Dr. Aditi Gupta', date: '2023-08-10', time: '11:30 AM', type: 'in-person', status: 'completed', notes: 'Eye Exam', diagnosis: 'Mild Myopia', prescription: ['Eye Drops', 'Corrective Lenses'] },
  { id: '203', doctorId: '3', doctorName: 'Dr. Meera Reddy', date: '2023-03-15', time: '4:00 PM', type: 'video', status: 'completed', notes: 'Skin rash', diagnosis: 'Contact Dermatitis', prescription: ['Hydrocortisone Cream', 'Levocetirizine'], userRating: 4, userReview: "Good doctor, but video lagged a bit." },
  { id: '206', doctorId: '2', doctorName: 'Dr. Rajesh Kumar', date: '2023-05-22', time: '09:30 AM', type: 'in-person', status: 'completed', notes: 'High Fever', diagnosis: 'Viral Fever', prescription: ['Paracetamol 650mg', 'Rest'] },
  { id: '209', doctorId: '5', doctorName: 'Dr. Arjun Gupta', date: '2022-11-20', time: '05:00 PM', type: 'in-person', status: 'completed', notes: 'Ankle Sprain', diagnosis: 'Grade 1 Ligament Tear', prescription: ['Volini Spray', 'Aceclofenac'], userRating: 5 },
];

const INITIAL_USER: UserProfile = {
  name: "",
  age: 0,
  gender: "",
  medicalHistory: "",
  medicalEvents: [],
  reports: [],
  allergies: [],
  medications: [],
  emergencyContact: { name: "", phone: "", relation: "" }
};

import { ToastProvider, useToast } from './contexts/ToastContext';

// Wrap the main export with ToastProvider
function AppWrapper() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}

function App() {
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const session = AuthService.getSession();
    if (!session) return AppRoute.LOGIN;

    const saved = localStorage.getItem('swasthya_current_route');
    if (saved && Object.values(AppRoute).includes(saved as AppRoute)) {
      return saved as AppRoute;
    }
    return AppRoute.LOGIN;
  });
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(DEFAULT_DOCTORS);

  useEffect(() => {
    localStorage.setItem('swasthya_current_route', currentRoute);
  }, [currentRoute]);

  const loadDoctors = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/doctors`);
      const data = await res.json();

      if (data && data.length > 0) {
        const processedDoctors = data.map((doc: any, index: number) => ({
          ...doc,
          id: doc._id || doc.id,
          image: doc.image || `https://picsum.photos/100/100?random=${index + 10}`,
          rating: doc.rating || 4.5,
          nextAvailable: doc.nextAvailable || 'Tomorrow, 10:00 AM',
          price: doc.price || '₹500',
          isVideoEnabled: doc.isVideoEnabled !== undefined ? doc.isVideoEnabled : true,
          experience: doc.experience || 5,
          verified: doc.verified !== undefined ? doc.verified : true
        }));
        setDoctors(processedDoctors);
      }
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  useEffect(() => {
    // Restore session on mount
    const session = AuthService.getSession();
    if (session) {
      handleAuthSuccess(session, true);
    }

    loadDoctors();
  }, []);

  // Overlays State
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMedicationPanelOpen, setIsMedicationPanelOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isDoctorMode, setIsDoctorMode] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const [showTour, setShowTour] = useState(false);
  const [lastBookedAppointment, setLastBookedAppointment] = useState<Appointment | null>(null);
  const [currentDoctorProfile, setCurrentDoctorProfile] = useState<Doctor>(DEFAULT_DOCTORS[3]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCaregiverMode, setIsCaregiverMode] = useState(false);

  // Sync Dark Mode with DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAuthSuccess = (session: AuthResponse, isRestored: boolean = false) => {
    setIsAuthenticated(true);

    // Always refresh doctors list on login just in case new doctors registered
    loadDoctors();

    if (session.role === 'patient' || session.role === 'relative') {
      const parsedUser = session.user as UserProfile;
      setUser(parsedUser);
      setIsDoctorMode(false);
      setIsCaregiverMode(session.role === 'relative');

      // Async fetch patient DB reports
      const fetchReports = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const r = await fetch(`${API_URL}/reports/user/${parsedUser.id || 'dummy-patient-id'}`);
          if (r.ok) {
            const dbReports = await r.json();
            setUser(prev => ({
              ...prev, reports: dbReports.map((d: any) => ({
                id: d._id || d.id,
                title: d.title,
                date: d.date,
                type: d.type,
                doctorName: d.doctorName,
                url: d.url,
                fileData: d.fileData
              }))
            }));
          }
        } catch (e) {
          console.error("Error fetching reports", e);
        }
      };

      fetchReports();

      if (session.isNewUser) {
        setCurrentRoute(AppRoute.ONBOARDING);
      } else {
        if (!isRestored) {
          setCurrentRoute(AppRoute.HOME);
          showToast(`Welcome back, ${session.user.name}!`, 'success');
        }
      }
    } else {
      setCurrentDoctorProfile(session.user as Doctor);
      setIsDoctorMode(true);
      if (!isRestored) {
        setCurrentRoute(AppRoute.DOCTOR_HOME);
        showToast(`Welcome back, Dr. ${session.user.name}`, 'success');
      }
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    setIsDoctorMode(false);
    setIsCaregiverMode(false);
    setCurrentRoute(AppRoute.LOGIN);
    showToast("Successfully logged out", "info");
  };

  const handleBookAppointment = async (doctor: Doctor, date: string, time: string, type: 'video' | 'in-person') => {
    if (isCaregiverMode) {
      showToast("Access Denied: Relatives cannot book appointments on behalf of the patient.", "error");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: user.id || 'dummy-patient-id', // In a real app we'd use the precise ObjectId, mapping from our auth response
          doctorId: doctor.userId || 'dummy-doctor-id', // Make sure doctor's user ID matches DB
          doctorName: doctor.name,
          date,
          time,
          type,
          notes: "Booked via Swasthya Setu",
          status: 'pending'
        })
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      const savedAppt = await response.json();

      const newAppt: Appointment = {
        id: savedAppt._id || Date.now().toString(),
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: savedAppt.date,
        time: savedAppt.time,
        notes: savedAppt.notes,
        type: savedAppt.type as any,
        status: savedAppt.status as any
      };

      setAppointments([...appointments, newAppt]);
      setNotifications([
        { id: Date.now().toString(), title: 'Request Sent', message: `Appointment request sent to ${doctor.name}`, time: 'Just now', type: 'info', read: false },
        ...notifications
      ]);
      setLastBookedAppointment(newAppt);
      showToast("Appointment request sent", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to book appointment", "error");
    }
  };

  const handleBookingConfirmationClose = () => {
    setLastBookedAppointment(null);
    setCurrentRoute(AppRoute.HOME);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUser(updated);
    showToast("Profile updated successfully", "success");
  };

  const handleUpdateDoctor = (updated: Doctor) => {
    setCurrentDoctorProfile(updated);
    setDoctors(prev => prev.map(d => d.id === updated.id ? updated : d));
    showToast("Profile updated successfully", "success");
  };

  const handleMarkMedicationTaken = (medId: string) => {
    const updatedMeds = user.medications.map(med =>
      med.id === medId ? { ...med, taken: true } : med
    );
    setUser({ ...user, medications: updatedMeds });
    showToast("Medication marked as taken", "success");
  };

  const handleOnboardingComplete = (newUser: UserProfile) => {
    const completeProfile = { ...user, ...newUser };
    if (!completeProfile.reports || completeProfile.reports.length === 0) {
      completeProfile.reports = MOCK_REPORTS;
    }
    setUser(completeProfile);
    setCurrentRoute(AppRoute.HOME);
    setShowTour(true);
    showToast("Setup complete! Welcome to Swasthya Setu", "success");
  };

  const handleDoctorSelectPatient = (apptId: string) => {
    setSelectedPatientId(apptId);
    setCurrentRoute(AppRoute.DOCTOR_CONSULT);
  };

  const handleAcceptAppointment = (id: string) => {
    setAppointments(prev => prev.map(appt =>
      appt.id === id ? { ...appt, status: 'upcoming' } : appt
    ));
    showToast("Appointment accepted", "success");
  };

  const handleDeclineAppointment = (id: string) => {
    setAppointments(prev => prev.map(appt =>
      appt.id === id ? { ...appt, status: 'cancelled' } : appt
    ));
    showToast("Appointment declined", "info");
  };

  const handleConsultationComplete = (data: PrescriptionData) => {
    const newEvent: MedicalEvent = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: 'Doctor Visit',
      description: `Diagnosis: ${data.diagnosis}. Follow up: ${data.followUp || 'N/A'}`,
      type: 'diagnosis',
      doctorName: currentDoctorProfile.name,
      location: 'Apollo Clinic'
    };

    const newMeds: Medication[] = data.medications.map(name => ({
      id: Date.now().toString() + Math.random().toString(),
      name,
      dosage: 'As prescribed',
      frequency: 'Daily',
      taken: false
    }));

    setUser({
      ...user,
      medicalEvents: [newEvent, ...user.medicalEvents],
      medications: [...user.medications, ...newMeds]
    });

    if (selectedPatientId) {
      setAppointments(prev => prev.map(appt =>
        appt.id === selectedPatientId ? { ...appt, status: 'completed', diagnosis: data.diagnosis, prescription: data.medications } : appt
      ));
    }
    setCurrentRoute(AppRoute.DOCTOR_HOME);
    showToast("Consultation completed", "success");
  };

  const handleRateAppointment = (appointmentId: string, rating: number, review: string) => {
    setAppointments(prev => prev.map(appt =>
      appt.id === appointmentId ? { ...appt, userRating: rating, userReview: review } : appt
    ));
    showToast("Review submitted. Thank you!", "success");
  };

  // Global Modals State
  const [activeVideoCall, setActiveVideoCall] = useState<OngoingTreatment | null>(null);
  const [activeChat, setActiveChat] = useState<OngoingTreatment | null>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isVFamilyModalOpen, setIsVFamilyModalOpen] = useState(false);

  const handleAddReport = async (report: MedicalReport) => {
    let finalId = report.id;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: user.id || 'dummy-patient-id',
          title: report.title,
          date: report.date,
          type: report.type,
          doctorName: report.doctorName,
          url: report.url,
          fileData: (report as any).fileData
        })
      });
      if (res.ok) {
        const saved = await res.json();
        finalId = saved._id || saved.id;
      } else {
        console.warn("Warning: Failed to save to specific DB. Falling back to local state.");
      }
    } catch (err) {
      console.warn("DB Connection Error (or mock environment without DB):", err);
    }

    setUser(prev => ({
      ...prev,
      reports: [{ ...report, id: finalId }, ...(prev.reports || [])]
    }));
    showToast("Report uploaded successfully", "success");
  };

  const renderPage = () => {
    switch (currentRoute) {
      case AppRoute.LOGIN: return <LoginPage onLogin={handleAuthSuccess} onNavigate={setCurrentRoute} />;
      case AppRoute.SIGNUP: return <SignupPage onSignup={handleAuthSuccess} onNavigate={setCurrentRoute} />;
      case AppRoute.ONBOARDING: return <OnboardingPage initialName={user.name} initialEmail={user.email} onComplete={handleOnboardingComplete} />;
      case AppRoute.HOME: return <HomePage user={user} appointments={appointments} onNavigate={setCurrentRoute} onRateDoctor={handleRateAppointment} onStartVideoCall={setActiveVideoCall} onStartChat={setActiveChat} onOpenReports={() => setIsReportsModalOpen(true)} onOpenVFamily={() => setIsVFamilyModalOpen(true)} />;
      case AppRoute.CHATBOT: return <ChatbotPage user={user} />;
      case AppRoute.DOCTORS: return <DoctorsPage doctors={doctors} filterSpecialty={null} onBook={handleBookAppointment} />;
      case AppRoute.PROFILE: return <ProfilePage user={user} onUpdate={handleUpdateProfile} onLogout={handleLogout} />;
      case AppRoute.DOCTOR_HOME: return <DoctorDashboard appointments={appointments} onSelectPatient={handleDoctorSelectPatient} onAccept={handleAcceptAppointment} onDecline={handleDeclineAppointment} />;
      case AppRoute.DOCTOR_CONSULT:
        const apt = appointments.find(a => a.id === selectedPatientId) || null;
        return <DoctorPatientView user={isDoctorMode ? MOCK_PATIENT_DATA : user} appointment={apt} onBack={() => setCurrentRoute(AppRoute.DOCTOR_HOME)} onComplete={handleConsultationComplete} />;
      case AppRoute.DOCTOR_PROFILE: return <DoctorProfilePage doctor={currentDoctorProfile} onUpdate={handleUpdateDoctor} onLogout={handleLogout} />;
      default: return <HomePage user={user} appointments={appointments} onNavigate={setCurrentRoute} onRateDoctor={handleRateAppointment} onStartVideoCall={setActiveVideoCall} onStartChat={setActiveChat} onOpenReports={() => setIsReportsModalOpen(true)} onOpenVFamily={() => setIsVFamilyModalOpen(true)} />;
    }
  };

  const showHeader = isAuthenticated && ![AppRoute.ONBOARDING, AppRoute.LOGIN, AppRoute.SIGNUP].includes(currentRoute);
  const showPatientNav = isAuthenticated && !isDoctorMode && ![AppRoute.ONBOARDING, AppRoute.LOGIN, AppRoute.SIGNUP].includes(currentRoute);
  const showDoctorNav = isAuthenticated && isDoctorMode && currentRoute !== AppRoute.DOCTOR_CONSULT;
  const hasPendingMeds = !isDoctorMode && user.medications && user.medications.some(m => !m.taken);

  return (
    <div className={`h-[100dvh] flex bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-500`}>
      <div className="w-full h-full flex flex-col md:flex-row relative">

        {/* Desktop Sidebar */}
        {isAuthenticated && ![AppRoute.ONBOARDING, AppRoute.LOGIN, AppRoute.SIGNUP].includes(currentRoute) && (
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={setCurrentRoute}
            isDoctorMode={isDoctorMode}
            user={user}
            doctor={currentDoctorProfile}
            onLogout={handleLogout}
          />
        )}

        {/* Main Content Area Wrapper */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {showHeader && (
            <Header
              currentRoute={currentRoute}
              isDoctorMode={isDoctorMode}
              user={user}
              doctor={currentDoctorProfile}
              t={t}
              language={language}
              setLanguage={setLanguage}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              showToast={showToast}
              onNavigate={setCurrentRoute}
              setIsSOSOpen={setIsSOSOpen}
              setIsNotificationsOpen={setIsNotificationsOpen}
              setIsMedicationPanelOpen={setIsMedicationPanelOpen}
              onLogout={handleLogout}
              hasPendingMeds={hasPendingMeds}
            />
          )}

          <main className="flex-1 overflow-y-auto scrollbar-hide relative animate-page-enter" key={currentRoute}>
            <div className="h-full w-full mx-auto max-w-7xl flex flex-col min-h-full">
              {/* Caregiver Mode Banner */}
              {isCaregiverMode && (
                <div className="bg-amber-500 text-white text-xs font-bold py-1.5 px-4 text-center sticky top-0 z-[100] shadow-md flex items-center justify-center gap-2 rounded-b-xl max-w-2xl mx-auto mb-4">
                  <ShieldAlert size={14} /> Caregiver Mode: Viewing {user.name}'s profile. Access to edit sensitive details is restricted.
                </div>
              )}
              <div className="flex-1">
                {renderPage()}
              </div>

              {/* Home Page Footer Stats */}
              {isAuthenticated && currentRoute === AppRoute.HOME && (
                <div className="mt-8 mb-24 md:mb-8 px-6 md:px-8 w-full mx-auto max-w-7xl">
                  <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                    <AnimatedStats />
                  </div>
                </div>
              )}
            </div>
          </main>

          {showPatientNav && (
            <nav className="md:hidden glass border-t border-white/10 px-8 py-4 flex justify-between items-center z-[40] sticky bottom-0 pb-safe transition-all duration-300">
              <button
                onClick={() => setCurrentRoute(AppRoute.HOME)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentRoute === AppRoute.HOME ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${currentRoute === AppRoute.HOME ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <Home size={24} strokeWidth={currentRoute === AppRoute.HOME ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold tracking-wider">{t('nav.home')}</span>
              </button>

              <button
                onClick={() => setCurrentRoute(AppRoute.DOCTORS)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentRoute === AppRoute.DOCTORS ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${currentRoute === AppRoute.DOCTORS ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <Stethoscope size={24} strokeWidth={currentRoute === AppRoute.DOCTORS ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold tracking-wider">{t('nav.doctors')}</span>
              </button>

              <button
                onClick={() => setCurrentRoute(AppRoute.PROFILE)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentRoute === AppRoute.PROFILE ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${currentRoute === AppRoute.PROFILE ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <User size={24} strokeWidth={currentRoute === AppRoute.PROFILE ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold tracking-wider">{t('nav.profile')}</span>
              </button>
            </nav>
          )}

          {showDoctorNav && (
            <nav className="md:hidden glass border-t border-white/10 px-12 py-4 flex justify-around items-center z-[40] sticky bottom-0 pb-safe transition-all duration-300">
              <button
                onClick={() => setCurrentRoute(AppRoute.DOCTOR_HOME)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentRoute === AppRoute.DOCTOR_HOME ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${currentRoute === AppRoute.DOCTOR_HOME ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <Home size={24} strokeWidth={currentRoute === AppRoute.DOCTOR_HOME ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold tracking-wider">{t('nav.dashboard')}</span>
              </button>
              <button
                onClick={() => setCurrentRoute(AppRoute.DOCTOR_PROFILE)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentRoute === AppRoute.DOCTOR_PROFILE ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <div className={`p-2 rounded-xl transition-colors ${currentRoute === AppRoute.DOCTOR_PROFILE ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                  <Briefcase size={24} strokeWidth={currentRoute === AppRoute.DOCTOR_PROFILE ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold tracking-wider">{t('nav.profile')}</span>
              </button>
            </nav>
          )}

          {/* Global Overlays */}
          <SOSOverlay isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} contactName={user.emergencyContact?.name || "Emergency Contact"} />
          <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} notifications={notifications} />
          <MedicationPanel isOpen={isMedicationPanelOpen} onClose={() => setIsMedicationPanelOpen(false)} user={user} onMarkTaken={handleMarkMedicationTaken} onNavigateProfile={() => { setIsMedicationPanelOpen(false); setCurrentRoute(AppRoute.PROFILE); }} />
          {activeVideoCall && <VideoCallModal treatment={activeVideoCall} onClose={() => setActiveVideoCall(null)} />}
          {activeChat && (
            <div className="absolute inset-0 z-[110] glass animate-in slide-in-from-right-10 duration-500">
              <DoctorChatView treatment={activeChat} onBack={() => setActiveChat(null)} />
            </div>
          )}
          <MedicalReportsModal
            isOpen={isReportsModalOpen}
            onClose={() => setIsReportsModalOpen(false)}
            user={user}
            onAddReport={handleAddReport}
            isCaregiverMode={isCaregiverMode}
          />
          <VFamilyModal
            isOpen={isVFamilyModalOpen}
            onClose={() => setIsVFamilyModalOpen(false)}
            user={user}
            isCaregiverMode={isCaregiverMode}
            onNavigate={(route) => {
              setIsVFamilyModalOpen(false);
              setCurrentRoute(route);
            }}
          />
          <BookingSuccessModal appointment={lastBookedAppointment} onClose={handleBookingConfirmationClose} />
          <AppTour isOpen={showTour} onComplete={() => setShowTour(false)} />

          {/* Global Floating Translation Widget */}
          <div className="fixed bottom-4 right-4 z-[200] md:bottom-6 md:right-6">
            <GoogleTranslate />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppWrapper;
