import React from 'react';
import { Sparkles, Info, LogOut } from 'lucide-react';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

const PendingAssignment = () => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8 relative overflow-hidden">
            {/* Visual background elements */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-orange-600/5 rounded-full -mr-48 -mt-48 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-orange-600/5 rounded-full -ml-24 -mb-24 blur-[100px] pointer-events-none"></div>

            <div className="max-w-2xl w-full text-center relative z-10 space-y-12">
                <div className="w-32 h-32 bg-orange-600/10 border border-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_50px_rgba(234,88,12,0.2)] group animate-bounce duration-[2000ms]">
                    <Sparkles className="text-orange-500 group-hover:scale-125 transition-transform duration-700" size={56} />
                </div>

                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic underline decoration-orange-600/30">Protocol Latency</h1>
                    <p className="text-slate-500 text-xl mb-12 leading-relaxed uppercase tracking-widest italic font-bold max-w-lg mx-auto">
                        Authenticated at <span className="text-orange-600">NeoMinds Collective</span>. <br />
                        <span className="text-white/40">Awaiting secure sector assignment...</span>
                    </p>
                </div>

                <div className="bg-white/[0.01] border border-white/5 p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left relative z-10">
                        <div className="p-5 bg-orange-600/10 border border-orange-600/20 rounded-[2rem] text-orange-500 shadow-inner italic">
                            <Info size={32} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-black text-white text-2xl tracking-tighter uppercase italic">Curriculum Sync In Progress</h3>
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed italic opacity-80">
                                Once an administrator authorizes your sector clearance, your specific curriculum hubs, archival notes, and presence synchronizers will manifest.
                                <span className="block mt-4 text-orange-500/60 animate-pulse font-black italic">Real-time data stream established. Standing by...</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        onClick={() => signOut(auth)}
                        className="group flex items-center space-x-3 mx-auto px-12 py-5 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-500 hover:text-white hover:bg-orange-600/20 hover:border-orange-500/40 transition-all duration-700 italic font-black uppercase tracking-[0.3em] text-[10px]"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingAssignment;
