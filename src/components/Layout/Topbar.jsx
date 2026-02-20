import React, { useState } from 'react';
import { Bell, Search, Zap, Trophy, ChevronDown, Menu } from 'lucide-react';
import { student, notifications } from '../../data/mockData';
import { Badge } from '../Common';

const Topbar = ({ onMenuClick }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="h-20 sm:h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-10 sticky top-0 z-40">
            <div className="flex items-center flex-1">
                {/* Mobile menu trigger */}
                <button
                    onClick={onMenuClick}
                    className="p-2 mr-4 text-slate-500 hover:bg-slate-50 rounded-xl lg:hidden transition-all"
                >
                    <Menu size={24} />
                </button>

                <div className="hidden sm:relative sm:flex w-full max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search lessons, nodes, batches..."
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    />
                </div>

                {/* Mobile search icon only */}
                <button className="sm:hidden p-2 text-slate-500">
                    <Search size={20} />
                </button>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-8">
                {/* Stats - Hidden on Small Mobile */}
                <div className="hidden md:flex items-center space-x-6">
                    <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                        <Zap size={18} className="text-indigo-600 fill-indigo-600" />
                        <div>
                            <p className="text-[9px] font-black text-indigo-400 uppercase leading-none">XP Points</p>
                            <p className="text-sm font-black text-indigo-900 tracking-tight tabular-nums">{student.points}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                        <Trophy size={18} className="text-amber-600 fill-amber-600" />
                        <div>
                            <p className="text-[9px] font-black text-amber-400 uppercase leading-none">Level</p>
                            <p className="text-sm font-black text-amber-900 tracking-tight tabular-nums">{student.level}</p>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:block h-8 w-[2px] bg-slate-100 mx-2"></div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 sm:p-3 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all relative border border-slate-100"
                    >
                        <Bell size={22} />
                        <span className="absolute top-1 sm:top-2 right-1 sm:right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-4 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 animate-in slide-in-from-top-4 duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-lg font-black text-slate-800 tracking-tighter">Notifications</h4>
                                <button className="text-[10px] font-black uppercase text-indigo-600">Mark all as read</button>
                            </div>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto noscroll">
                                {notifications.map((n) => (
                                    <div key={n.id} className="group p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-indigo-100">
                                        <p className="text-sm font-bold text-slate-700 leading-snug group-hover:text-slate-900">{n.text}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">{n.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Card */}
                <div className="flex items-center space-x-3 bg-slate-50 p-1.5 sm:p-2 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all cursor-pointer group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-[10px] sm:text-xs shadow-lg shadow-indigo-200 flex-shrink-0">
                        {student.name[0]}
                    </div>
                    <div className="hidden sm:block xl:block leading-none pr-2">
                        <p className="text-[10px] sm:text-xs font-black text-slate-800 tracking-tight">{student.name.split(' ')[0]}</p>
                        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">Student</p>
                    </div>
                    <ChevronDown size={14} className="hidden sm:block text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
            </div>
        </div>
    );
};

export default Topbar;
