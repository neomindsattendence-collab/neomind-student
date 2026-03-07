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
    LogOut
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
            <div className="p-10 flex items-center justify-between border-b border-white/5 bg-white/[0.01] group cursor-pointer relative z-10">
                <div className="flex items-center space-x-5">
                    <div className="bg-orange-600 p-3 rounded-2xl text-white shadow-[0_0_30px_rgba(234,88,12,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                        <GraduationCap size={28} strokeWidth={3} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tighter leading-none italic uppercase group-hover:text-orange-500 transition-colors">NeoMinds</h1>
                        <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.3em] mt-2 leading-none italic">Scholar v3.0 Elite</p>
                    </div>
                </div>
                {/* Close button for mobile */}
                <button onClick={onClose} className="p-3 lg:hidden text-slate-700 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
                    <X size={24} />
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-12 px-6 space-y-3 overflow-y-auto noscroll relative z-10 italic" onClick={() => { if (window.innerWidth < 1024) onClose(); }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center space-x-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden border border-transparent
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
                                <item.icon size={22} className={`relative z-10 transition-all duration-500 ${isActive ? 'text-orange-500 scale-110' : 'text-slate-700 group-hover:text-orange-500 group-hover:scale-110'}`} />
                                <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,1)] animate-pulse"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Info / Logout Section */}
            <div className="p-8 border-t border-white/5 bg-white/[0.01] relative z-10">
                <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/5 relative overflow-hidden group hover:border-orange-500/30 transition-all duration-1000 cursor-pointer shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 blur-[50px] group-hover:scale-150 transition-transform duration-1000 opacity-50"></div>
                    <div className="flex items-center space-x-5 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-[#0a0a0a] flex-shrink-0 flex items-center justify-center font-black text-orange-500 text-xl border border-white/10 shadow-inner group-hover:scale-110 group-hover:border-orange-500/40 transition-all duration-500 italic">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-white truncate uppercase tracking-widest italic leading-none">{userDoc?.name || 'Academic Scholar'}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                                <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none italic">Neural Network Online</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="w-full mt-8 flex items-center justify-center space-x-4 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic text-slate-700 bg-white/[0.01] hover:bg-rose-600 hover:text-white hover:border-transparent rounded-2xl transition-all duration-500 border border-white/5 shadow-lg group overflow-hidden relative"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform relative z-10" />
                        <span className="relative z-10">Terminate Session</span>
                    </button>
                    <div className="mt-4 flex justify-center">
                        <p className="text-[7px] font-black text-slate-800 uppercase tracking-[0.4em] italic opacity-50 group-hover:opacity-100 transition-opacity">Registry Data Synchronized</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
