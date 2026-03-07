import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSession } from '../../context/SessionContext';
import { Badge, Button } from '../Common';
import { Radio, ArrowRight, X } from 'lucide-react';

const Layout = ({ children }) => {
    const { isTeacherLive, sessionStatus, joinSession, activeBatch, liveSessions } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#050505] font-sans selection:bg-orange-500/30">
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden animate-in fade-in duration-500"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-500">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Live Banner */}
                {isTeacherLive && sessionStatus === 'OFFLINE' && (
                    <div className="mx-6 sm:mx-12 mt-10 bg-[#050505]/40 backdrop-blur-3xl rounded-[3.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-full duration-1000 overflow-hidden border border-white/5 group relative">
                        {/* Glow Layer */}
                        <div className="absolute top-1/2 left-0 w-80 h-80 bg-orange-600/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none group-hover:bg-orange-600/20 transition-all duration-1000"></div>
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex items-center space-x-8 relative z-20 w-full md:w-auto">
                            <div className="w-20 h-20 bg-orange-600 text-white rounded-[2rem] shadow-[0_0_50px_rgba(234,88,12,0.4)] flex items-center justify-center flex-shrink-0 animate-pulse border border-white/10 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                <Radio size={36} strokeWidth={2.5} />
                            </div>
                            <div className="italic">
                                <h3 className="text-3xl font-black tracking-tighter mb-2 uppercase italic underline decoration-orange-600/30">Terminal Live Detected</h3>
                                <p className="text-slate-700 font-black text-[10px] uppercase tracking-[0.3em] leading-relaxed">
                                    Synchronization available for <span className="text-orange-500 underline decoration-orange-500/20">{Object.values(liveSessions)[0]?.name || 'Neural Segment'}</span>
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            size="lg"
                            className="relative z-20 w-full md:w-auto group shadow-2xl scale-105 active:scale-95"
                            onClick={() => {
                                const activeSession = Object.values(liveSessions)[0];
                                if (activeSession) joinSession(activeSession);
                            }}
                        >
                            <span className="relative z-10 flex items-center font-black uppercase tracking-[0.35em] italic">
                                Initialize Uplink <ArrowRight size={18} className="ml-5 group-hover:translate-x-3 transition-transform duration-700" />
                            </span>
                        </Button>
                    </div>
                )}

                {/* Floating Session Status */}
                {sessionStatus === 'JOINED' && (
                    <div className="fixed bottom-10 right-10 z-[100] bg-[#080808]/80 backdrop-blur-3xl text-white rounded-[2.5rem] p-6 pr-12 flex items-center space-x-8 shadow-[0_30px_80px_rgba(0,0,0,0.9)] border border-white/5 animate-in slide-in-from-bottom-full duration-1000 max-w-[calc(100vw-3rem)] group cursor-pointer hover:border-orange-500/30 transition-all">
                        <div className="w-16 h-16 bg-orange-600/10 text-orange-500 rounded-2xl flex-shrink-0 flex items-center justify-center border border-orange-500/10 shadow-inner group-hover:bg-orange-600 group-hover:text-white transition-all duration-700">
                            <Radio size={28} className="animate-pulse" />
                        </div>
                        <div className="min-w-0 italic">
                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-2 leading-none">Active Synchronizer</p>
                            <p className="text-base font-black tracking-tighter truncate uppercase italic text-white underline decoration-orange-600/30">{activeBatch}</p>
                        </div>
                        <div className="hidden sm:flex items-center space-x-3 bg-emerald-500/5 text-emerald-500 px-6 py-2.5 rounded-2xl border border-emerald-500/10 ml-6 italic group-hover:bg-emerald-500 group-hover:text-white transition-all duration-700">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.25em]">Uplink Linked</span>
                        </div>
                    </div>
                )}

                <main className="p-8 md:p-14 flex-1 relative overflow-hidden">
                    {/* Background Decorative Glow */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
