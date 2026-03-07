import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutGrid,
    Layers,
    Radio,
    FileText,
    ClipboardCheck,
    TrendingUp,
    Briefcase,
    FileSpreadsheet,
    Settings,
    Sparkles,
    X,
    LogOut,
    GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { userDoc, logout } = useAuth();
    const menuItems = [
        { icon: LayoutGrid, label: 'Dashboard', path: '/' },
        { icon: Layers, label: 'Academic Registry', path: '/batches' },
        { icon: Radio, label: 'Terminal Live', path: '/live' },
        { icon: FileText, label: 'Unit Notes', path: '/notes' },
        { icon: ClipboardCheck, label: 'Assessments', path: '/assignments' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: Briefcase, label: 'Job Board', path: '/jobs' },
        { icon: FileSpreadsheet, label: 'Industry Prep', path: '/career-tips' },
        { icon: Settings, label: 'Registry Config', path: '/settings' },
    ];

    const initials = userDoc?.name?.[0] || 'U';

    return (
        <aside className={`
             fixed inset-y-0 left-0 w-72 bg-[#050505] flex flex-col text-slate-500 z-[70] transition-transform duration-500 ease-in-out lg:translate-x-0 border-r border-white/5 shadow-[20px_0_60px_rgba(0,0,0,0.8)]
             ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-orange-600/5 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Logo Section */}
            <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01] group cursor-pointer relative z-10">
                <div className="flex items-center space-x-4">
                    <div className="bg-orange-600 p-2.5 rounded-xl text-white shadow-[0_0_30px_rgba(234,88,12,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                        <GraduationCap size={24} strokeWidth={3} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tighter leading-none uppercase group-hover:text-orange-500 transition-colors">NeoMinds</h1>
                        <p className="text-[9px] text-orange-600 font-black uppercase tracking-[0.2em] mt-1.5 leading-none">Scholar v3.0 Elite</p>
                    </div>
                </div>
                {/* Close button for mobile */}
                <button onClick={onClose} className="p-2.5 lg:hidden text-slate-700 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5">
                    <X size={20} />
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-8 px-6 space-y-2 overflow-y-auto noscroll relative z-10" onClick={() => { if (window.innerWidth < 1024) onClose(); }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center space-x-4 px-5 py-3 rounded-xl transition-all duration-500 group relative overflow-hidden border border-transparent
                            ${isActive
                                ? 'bg-white/[0.03] text-orange-500 font-black border-white/5 shadow-2xl scale-[1.02]'
                                : 'hover:bg-white/[0.02] hover:text-white hover:border-white/5'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-orange-600 rounded-r-full shadow-[0_0_15px_rgba(234,88,12,0.8)] animate-pulse"></div>
                                )}
                                <item.icon size={20} className={`relative z-10 transition-all duration-500 ${isActive ? 'text-orange-500 scale-110' : 'text-slate-700 group-hover:text-orange-500 group-hover:scale-110'}`} />
                                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.2 h-1.2 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,1)] animate-pulse"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Info / Logout Section */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] relative z-10">
                <div className="bg-white/[0.02] backdrop-blur-3xl rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-orange-500/30 transition-all duration-1000 cursor-pointer shadow-2xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/10 rounded-full -mr-12 -mt-12 blur-[40px] group-hover:scale-150 transition-transform duration-1000 opacity-50"></div>
                    <div className="flex items-center space-x-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] flex-shrink-0 flex items-center justify-center font-black text-orange-500 text-lg border border-white/10 shadow-inner group-hover:scale-110 group-hover:border-orange-500/40 transition-all duration-500">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black text-white truncate uppercase tracking-widest leading-none">{userDoc?.name || 'Academic Scholar'}</p>
                            <div className="flex items-center space-x-2 mt-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                                <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none">Neural Network Online</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="w-full mt-6 flex items-center justify-center space-x-4 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-700 bg-white/[0.01] hover:bg-rose-600 hover:text-white hover:border-transparent rounded-xl transition-all duration-500 border border-white/5 shadow-lg group overflow-hidden relative"
                    >
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform relative z-10" />
                        <span className="relative z-10">Terminate Session</span>
                    </button>
                    <div className="mt-3 flex justify-center">
                        <p className="text-[7px] font-black text-slate-800 uppercase tracking-[0.4em] opacity-50 group-hover:opacity-100 transition-opacity">Registry Data Synchronized</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
