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
    LogOut,
    Sparkles,
    X
} from 'lucide-react';
import { student } from '../../data/mockData';

const Sidebar = ({ isOpen, onClose }) => {
    const menuItems = [
        { icon: LayoutGrid, label: 'Dashboard', path: '/' },
        { icon: Layers, label: 'My Batches', path: '/batches' },
        { icon: Radio, label: 'Live Class', path: '/live' },
        { icon: FileText, label: 'Notes', path: '/notes' },
        { icon: ClipboardCheck, label: 'Assignments', path: '/assignments' },
        { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
        { icon: Briefcase, label: 'Jobs & Career', path: '/jobs' },
        { icon: FileSpreadsheet, label: 'Resume Tips', path: '/career-tips' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className={`
             fixed inset-y-0 left-0 w-80 bg-slate-900 flex flex-col text-slate-400 z-[70] transition-transform duration-500 ease-in-out lg:translate-x-0
             ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Logo */}
            <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <Sparkles size={24} fill="currentColor" />
                    </div>
                    <div className="leading-tight">
                        <h1 className="text-xl font-black text-white tracking-tighter uppercase">NeoMinds</h1>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Student Portal</p>
                    </div>
                </div>
                {/* Close button for mobile */}
                <button onClick={onClose} className="p-2 lg:hidden text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 mt-8 space-y-1 px-4 noscroll overflow-y-auto" onClick={() => { if (window.innerWidth < 1024) onClose(); }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-indigo-600 text-white font-black shadow-xl shadow-indigo-600/20'
                                : 'hover:bg-slate-800 hover:text-white font-bold'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                                <span className="text-sm uppercase tracking-widest">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Info */}
            <div className="p-6">
                <div className="bg-slate-800/50 rounded-3xl p-5 border border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600/10 rounded-full -mr-8 -mt-8 blur-xl group-hover:scale-150 transition-transform"></div>
                    <div className="flex items-center space-x-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-slate-700 flex-shrink-0 flex items-center justify-center font-black text-white text-lg">
                            {student.name[0]}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-black text-white truncate">{student.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{student.id}</p>
                        </div>
                    </div>
                    <button className="w-full mt-4 flex items-center justify-center space-x-2 py-2 text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all">
                        <LogOut size={12} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
