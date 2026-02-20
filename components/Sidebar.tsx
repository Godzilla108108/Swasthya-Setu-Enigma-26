import React, { useState } from 'react';
import {
    Home,
    MessageSquare,
    Stethoscope,
    User,
    LogOut,
    Briefcase,
    ShieldAlert,
    Settings,
    ChevronLeft,
    Menu,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { AppRoute, UserProfile, Doctor } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
    currentRoute: AppRoute;
    onNavigate: (route: AppRoute) => void;
    isDoctorMode: boolean;
    user?: UserProfile;
    doctor?: Doctor;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    currentRoute,
    onNavigate,
    isDoctorMode,
    user,
    doctor,
    onLogout
}) => {
    const { t } = useLanguage();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const patientLinks = [
        { icon: Home, label: t('nav.home'), route: AppRoute.HOME },
        { icon: Stethoscope, label: t('nav.doctors'), route: AppRoute.DOCTORS },
        { icon: User, label: t('nav.profile'), route: AppRoute.PROFILE },
    ];

    const doctorLinks = [
        { icon: Home, label: t('nav.dashboard'), route: AppRoute.DOCTOR_HOME },
        { icon: Briefcase, label: t('nav.profile'), route: AppRoute.DOCTOR_PROFILE },
    ];

    const links = isDoctorMode ? doctorLinks : patientLinks;

    return (
        <div className={`hidden md:flex flex-col h-full glass border-r border-white/10 transition-all duration-500 z-50 relative ${isCollapsed ? 'w-24' : 'w-72'}`}>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 bg-blue-600 text-white rounded-full p-1 shadow-lg shadow-blue-500/20 hover:scale-110 active:scale-90 transition-all z-[60]"
            >
                {isCollapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Brand Header */}
            <div className={`p-8 pb-10 transition-all duration-500 ${isCollapsed ? 'px-4' : 'px-8'}`}>
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <Stethoscope className="text-white w-7 h-7" />
                    </div>
                    {!isCollapsed && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                            <h1 className="font-extrabold text-slate-900 dark:text-white text-2xl tracking-tighter shadow-sm">
                                {isDoctorMode ? 'Swasthya Setu Pro' : 'Swasthya Setu'}
                            </h1>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                                <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">Status: Active</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
                {!isCollapsed && (
                    <p className="px-5 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-60 animate-in fade-in duration-500">System Menu</p>
                )}

                {links.map((link) => {
                    const isActive = currentRoute === link.route;
                    return (
                        <button
                            key={link.route}
                            onClick={() => onNavigate(link.route)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${isActive
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 font-bold translate-x-1'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                            title={isCollapsed ? link.label : ''}
                        >
                            <link.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`transition-transform duration-300 shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            {!isCollapsed && (
                                <span className="text-sm font-bold tracking-tight uppercase tracking-widest text-[11px] scale-y-110 translate-y-0.5 animate-in fade-in slide-in-from-left-4">{link.label}</span>
                            )}
                            {isActive && !isCollapsed && (
                                <div className="absolute left-0 w-1 h-6 bg-white rounded-full -translate-x-1" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* User Profile Summary */}
            <div className={`p-6 transition-all duration-500 ${isCollapsed ? 'px-4' : 'px-6'}`}>
                <div className="relative group/profile transition-all">
                    <div className={`glass-card flex items-center gap-4 border-white/10 bg-white/40 dark:bg-slate-950/40 mb-2 cursor-pointer hover:bg-white/60 dark:hover:bg-slate-800 transition-all rounded-[2rem] shadow-lg shadow-slate-200/50 dark:shadow-none ${isCollapsed ? 'p-2 justify-center' : '!p-4'}`}>
                        <div className="relative shrink-0">
                            <div className={`${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white dark:border-slate-800 transition-all duration-500`}>
                                {(isDoctorMode ? doctor?.name.charAt(0) : user?.name.charAt(0)) || "U"}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></div>
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-4 duration-500">
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">
                                    {isDoctorMode ? doctor?.name : user?.name || "Guest User"}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.5)]"></span>
                                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest truncate">
                                        {isDoctorMode ? doctor?.specialty : "Verified Patient"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <div className="flex gap-2 mb-4 px-2 animate-in fade-in duration-700">
                            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800/50 text-center">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Health</p>
                                <p className="text-xs font-black text-emerald-500">92%</p>
                            </div>
                            <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800/50 text-center">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Level</p>
                                <p className="text-xs font-black text-blue-500">PRO</p>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onLogout}
                    className={`w-full flex items-center justify-center gap-3 p-4 text-xs font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all active:scale-95 group border border-transparent hover:border-rose-500/20 ${isCollapsed ? 'px-0' : ''}`}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <LogOut size={16} className={`group-hover:-translate-x-1 transition-transform ${isCollapsed ? 'mr-0' : ''}`} />
                    {!isCollapsed && <span className="animate-in fade-in duration-500">Logout Account</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
