import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSession } from '../../context/SessionContext';
import { Badge, Button } from '../Common';
import { Radio, ArrowRight, X } from 'lucide-react';

const Layout = ({ children }) => {
    const { isTeacherLive, sessionStatus, attemptJoin, activeBatch } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 lg:ml-80">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Live Banner */}
                {isTeacherLive && sessionStatus === 'OFFLINE' && (
                    <div className="mx-4 sm:mx-10 mt-6 bg-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl animate-in slide-in-from-top-full duration-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="flex items-center space-x-6 relative z-10 w-full md:w-auto">
                            <div className="p-4 bg-rose-500 text-white rounded-2xl live-pulse flex-shrink-0">
                                <Radio size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tighter mb-1">Live Class Alert!</h3>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
                                    Teacher started session for <span className="text-indigo-400 underline decoration-indigo-400/30 underline-offset-4">Neural Networks</span>
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            className="relative z-10 w-full md:w-auto px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] group"
                            onClick={() => attemptJoin('Mastering Neural Networks')}
                        >
                            Join Class Now <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                )}

                {/* Floating Session Status */}
                {sessionStatus === 'JOINED' && (
                    <div className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 bg-slate-900 text-white rounded-[2rem] p-4 pr-6 flex items-center space-x-4 shadow-2xl border border-white/10 animate-in slide-in-from-right-full duration-500 max-w-[calc(100vw-2rem)]">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-2xl flex-shrink-0 flex items-center justify-center">
                            <Radio size={20} className="animate-pulse" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">Active Class</p>
                            <p className="text-xs font-black tracking-tight truncate">{activeBatch}</p>
                        </div>
                        <Badge variant="success" className="hidden sm:inline-flex">Joined</Badge>
                    </div>
                )}

                <main className="p-4 sm:p-10 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
