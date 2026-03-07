import React, { useState } from 'react';
import {
    Search,
    Bell,
    Zap,
    ChevronDown,
    Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../Common';

const Topbar = ({ onMenuClick }) => {
    const { userDoc } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    const initials = userDoc?.name?.[0] || '?';
    const firstName = userDoc?.name?.split(' ')[0] || 'Scholar';

    return (
        <header className="h-24 bg-[#050505]/60 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-40 px-6 md:px-12 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center flex-1">
                {/* Mobile menu trigger */}
                <button
                    onClick={onMenuClick}
                    className="p-3 mr-6 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl lg:hidden transition-all duration-500 border border-transparent hover:border-white/10"
                >
                    <Menu size={24} />
                </button>

                <div className="hidden sm:relative sm:flex w-full max-w-md group italic">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-orange-500 transition-all duration-500" size={18} />
                    <input
                        type="text"
                        placeholder="Scan Neural Registry..."
                        className="w-full bg-white/[0.01] border border-white/5 rounded-2xl py-4 pl-14 pr-8 text-[11px] font-black uppercase tracking-[0.2em] text-white placeholder:text-slate-800 focus:outline-none focus:border-orange-500/40 focus:ring-4 focus:ring-orange-600/10 focus:bg-white/[0.03] transition-all shadow-inner italic"
                    />
                </div>

                {/* Mobile search icon only */}
                <button className="sm:hidden p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
                    <Search size={22} />
                </button>
            </div>

            <div className="flex items-center space-x-6 sm:space-x-10">
                {/* Stats */}
                <div className="hidden md:flex items-center space-x-6 italic">
                    <div className="flex items-center space-x-3 bg-orange-600/5 px-6 py-3 rounded-2xl border border-orange-500/10 shadow-lg group">
                        <Zap size={18} className="text-orange-600 fill-orange-600 animate-pulse group-hover:scale-125 transition-transform" />
                        <div>
                            <p className="text-[8px] font-black text-slate-700 uppercase leading-none tracking-widest italic">Scholar Integrity</p>
                            <p className="text-sm font-black text-white tracking-tighter tabular-nums mt-1">{userDoc?.points || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:block h-10 w-[1px] bg-white/5 mx-2"></div>

                {/* Notifications */}
                <div className="relative italic">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-3.5 rounded-2xl transition-all duration-500 relative border group ${showNotifications ? 'bg-orange-600 text-white border-transparent shadow-[0_0_30px_rgba(234,88,12,0.4)]' : 'bg-white/[0.01] text-slate-500 hover:text-white hover:bg-white/5 border-white/5 hover:border-orange-500/30'}`}
                    >
                        <Bell size={22} className={`${showNotifications ? 'animate-none' : 'group-hover:rotate-12'} transition-transform`} />
                        <span className={`absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full border-2 ${showNotifications ? 'bg-white border-orange-600' : 'bg-orange-600 border-[#050505] shadow-[0_0_10px_rgba(234,88,12,0.8)]'}`}></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-6 w-[calc(100vw-2rem)] sm:w-96 bg-[#080808] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/5 p-8 animate-in zoom-in-95 slide-in-from-top-4 duration-500 z-50">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-orange-600/30 blur-lg"></div>
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="text-xl font-black text-white tracking-tighter italic uppercase underline decoration-orange-600/20">System Intel</h4>
                                <button className="text-[9px] font-black uppercase text-orange-500 hover:text-white transition-colors tracking-widest italic">Purge Buffer</button>
                            </div>
                            <div className="py-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-white/[0.01] border border-white/5 rounded-2xl mx-auto flex items-center justify-center text-slate-800">
                                    <Bell size={32} strokeWidth={1} />
                                </div>
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] leading-relaxed italic">No active data packets<br />synchronized in priority</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Card */}
                <div className="flex items-center space-x-4 bg-white/[0.01] p-2 pr-5 rounded-[1.75rem] border border-white/5 hover:bg-white/[0.03] hover:border-orange-500/30 transition-all duration-700 cursor-pointer group shadow-xl italic relative overflow-hidden">
                    <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-11 h-11 rounded-xl bg-[#0a0a0a] flex items-center justify-center font-black text-orange-500 text-sm border border-white/10 shadow-inner group-hover:scale-110 group-hover:border-orange-500/40 transition-all duration-500 relative z-10 italic">
                        {initials}
                    </div>
                    <div className="hidden sm:block leading-none relative z-10">
                        <p className="text-[11px] font-black text-white tracking-tight uppercase group-hover:text-orange-500 transition-colors italic">{firstName}</p>
                        <p className="text-[8px] font-black text-slate-700 uppercase mt-1.5 tracking-[0.25em] italic">{userDoc?.role || 'Elite Scholar'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
