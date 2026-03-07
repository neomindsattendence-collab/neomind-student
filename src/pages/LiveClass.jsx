import React, { useState, useEffect } from 'react';
import {
    Radio,
    MapPin,
    MapPinned,
    CheckCircle2,
    AlertCircle,
    Navigation,
    Globe,
    PlayCircle,
    Clock,
    ArrowRight,
    ShieldCheck,
    Signal,
    Video
} from 'lucide-react';
import { Card, Button, Badge, Modal } from '../components/Common';
import { useSession } from '../context/SessionContext';

const LiveClass = () => {
    const {
        isTeacherLive,
        sessionStatus,
        showJoinModal,
        setShowJoinModal,
        locationError,
        activeBatch,
        stats,
        joinSession,
        liveSessions,
        allowLocation,
        denyLocation,
        leaveSession
    } = useSession();

    const [timer, setTimer] = useState("00:00:00");
    const activeSessionLive = Object.values(liveSessions)[0];

    useEffect(() => {
        if (sessionStatus === 'JOINED') {
            const interval = setInterval(() => {
                const seconds = stats.duration;
                const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
                const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
                const secs = (seconds % 60).toString().padStart(2, '0');
                setTimer(`${hrs}:${mins}:${secs}`);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [sessionStatus, stats.duration]);

    if (sessionStatus === 'OFFLINE') {
        return (
            <div className="max-w-4xl mx-auto py-32 text-center animate-in fade-in duration-1000">
                <div className="w-28 h-28 bg-white/[0.03] text-slate-800 rounded-[3rem] flex items-center justify-center mx-auto mb-12 border border-white/5 shadow-2xl animate-pulse italic">
                    <Radio size={56} />
                </div>

                {isTeacherLive ? (
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <Badge variant="live" className="animate-pulse px-8 py-3 tracking-[0.3em] font-black italic">SESSION BROADCAST ACTIVE</Badge>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Class Initiated By Faculty</h2>
                            <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-widest text-[10px] italic">{activeSessionLive?.name || 'Neural Networks'} is currently in broadcast mode. Please synchronize immediately to secure your attendance protocol.</p>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            className="rounded-2xl shadow-2xl shadow-orange-500/20 group py-6 px-12"
                            onClick={() => activeSessionLive && joinSession(activeSessionLive)}
                        >
                            Synchronize With Live Session <ArrowRight size={22} className="ml-4 group-hover:translate-x-2 transition-transform duration-500" />
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Global Silence</h2>
                            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[10px] italic">Awaiting instructor heartbeat signal...</p>
                        </div>
                        <Card className="bg-white/[0.02] border-white/5 border-dashed border-2 p-12 max-w-lg mx-auto rounded-[3rem]">
                            <p className="text-xs font-black text-slate-500 italic uppercase tracking-[0.1em] leading-relaxed">"The neural training environment will activate automatically once your designated instructor initiates the operational geofence protocol."</p>
                        </Card>
                    </div>
                )}

                <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Spatial Authorization">
                    <div className="text-center space-y-10 py-6">
                        <div className="w-24 h-24 bg-orange-600/10 text-orange-500 rounded-[2rem] flex items-center justify-center mx-auto border border-orange-500/20 shadow-inner italic">
                            <MapPinned size={48} />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-2xl font-black text-white tracking-tighter uppercase italic">Geo-Radius Verification</h4>
                            <p className="text-[10px] font-black text-slate-500 px-8 leading-relaxed uppercase tracking-widest italic">Spatial telemetry is required to verify your physical presence within the designated academic campus coordinates.</p>
                        </div>
                        <div className="pt-6 flex flex-col gap-4">
                            <Button variant="primary" className="w-full py-5 rounded-2xl" onClick={allowLocation}>Authorize Session Verification</Button>
                            <Button variant="ghost" className="w-full text-slate-600 tracking-widest italic" onClick={() => setShowJoinModal(false)}>Abort Protocol</Button>
                        </div>
                        {locationError && (
                            <div className="bg-rose-600/10 p-5 rounded-2xl flex items-start space-x-4 text-left border border-rose-600/20 animate-in shake duration-500">
                                <AlertCircle size={20} className="text-rose-500 mt-0.5" />
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic leading-tight">{locationError}</p>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in zoom-in-95 duration-1000 pb-20">
            {/* Joined Header */}
            <div className="bg-black rounded-[3rem] p-12 text-white flex flex-col lg:flex-row justify-between items-center gap-10 relative overflow-hidden shadow-2xl border border-white/5 group">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-600 via-white/20 to-orange-600 animate-pulse"></div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>

                <div className="flex items-center space-x-10 relative z-10">
                    <div className="p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 relative shadow-inner italic group-hover:bg-white/[0.05] transition-colors duration-700">
                        <Video size={56} className="text-orange-500" />
                        <div className="absolute -top-3 -right-3 p-2.5 bg-rose-600 rounded-full border-4 border-black">
                            <div className="w-3.5 h-3.5 bg-white rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center space-x-4 mb-3">
                            <Badge variant="success" className="px-5 py-1.5 font-black italic tracking-widest text-[8px]">LOCATION VERIFIED</Badge>
                            <span className="text-orange-500 font-black text-2xl tabular-nums tracking-[0.2em] italic drop-shadow-[0_0_10px_rgba(234,88,12,0.3)]">{timer}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{activeBatch}</h2>
                        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mt-4 italic">Live Training Unit • Tech Faculty Command</p>
                    </div>
                </div>
                <Button variant="danger" className="py-6 px-12 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] italic shadow-2xl shadow-rose-900/30 relative z-10 hover:bg-rose-700 transition-colors duration-500" onClick={leaveSession}>Leave Class Session</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Simulation Monitoring View */}
                    <Card title="Presence Monitoring" subtitle="Operational stream analytics" className="relative group overflow-hidden bg-white/[0.02] border-white/5 p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                            <div className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-inner italic">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-emerald-600/10 text-emerald-500 rounded-2xl border border-emerald-500/20 shadow-inner"><ShieldCheck size={28} /></div>
                                    <Badge variant="success" className="px-3">STABLE</Badge>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Attendance Flow</p>
                                    <h4 className="text-2xl font-black text-white italic tracking-tight">Verified In Registry</h4>
                                </div>
                            </div>
                            <div className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-inner italic">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-orange-600/10 text-orange-500 rounded-2xl border border-orange-500/20 shadow-inner"><Signal size={28} /></div>
                                    <Badge variant="warning" className="px-3">ENCRYPTED</Badge>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Neural Heartbeat</p>
                                    <h4 className="text-2xl font-black text-white italic tracking-tight">Synchronized</h4>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex items-center space-x-10 p-10 bg-black rounded-[2.5rem] text-white overflow-hidden relative group border border-white/5 shadow-2xl">
                            <div className="absolute -bottom-16 -right-16 p-10 opacity-5 group-hover:opacity-[0.1] group-hover:scale-125 transition-transform duration-1000">
                                <Globe size={200} className="text-orange-500" />
                            </div>
                            <div className="flex-1 relative z-10">
                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-8 italic">Faculty Terminal Telemetry</p>
                                <div className="space-y-6">
                                    {[
                                        'Instructor protocol sharing: "Neural_Architecture_v2.pdf"',
                                        'Operational geofence updated: 250m Radius Locked',
                                        'Interactive segment initiated: "Backprop_Challenge"'
                                    ].map((log, i) => (
                                        <p key={i} className="text-xs font-black uppercase tracking-tight flex items-center gap-4 text-slate-400 italic">
                                            <span className="w-2 h-2 bg-orange-600 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.5)]"></span>
                                            {log}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card title="Operational Actions" className="bg-white/[0.02] border-white/5 p-10">
                            <div className="space-y-4 mt-6">
                                <Button variant="secondary" className="w-full justify-start py-5 text-[10px] tracking-[0.2em] uppercase font-black bg-white/[0.03] border-white/5 gap-5 italic hover:text-white transition-all">
                                    <PlayCircle size={22} className="text-orange-500" /> Execute Poll Response
                                </Button>
                                <Button variant="secondary" className="w-full justify-start py-5 text-[10px] tracking-[0.2em] uppercase font-black bg-white/[0.03] border-white/5 gap-5 italic hover:text-white transition-all">
                                    <Video size={22} className="text-orange-500" /> Connect Voice Stream
                                </Button>
                            </div>
                        </Card>
                        <Card title="Live Telemetry" className="bg-white/[0.02] border-white/5 p-10">
                            <div className="flex items-center justify-center h-full py-4">
                                <div className="text-center group italic">
                                    <div className="text-5xl font-black text-orange-500 group-hover:scale-110 transition-all duration-700 tabular-nums drop-shadow-[0_0_15px_rgba(234,88,12,0.3)]">1.2<span className="text-lg ml-1">mbps</span></div>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-3">Link Throughput</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="space-y-10">
                    <Card title="Activity Stream" className="h-fit bg-white/[0.02] border-white/5 p-10">
                        <div className="space-y-8 mt-6">
                            {[
                                { m: 'Academic signature: Arsalan synced', t: '12m ago' },
                                { m: 'Attendance protocol: Taha verified', t: '15m ago' },
                                { m: 'Registry update: Faculty posted notes', t: '22m ago' },
                                { m: 'System signal: Session initialized', t: '25m ago' },
                            ].map((act, i) => (
                                <div key={i} className="flex gap-5 items-start pb-8 last:pb-0 relative border-l-2 border-white/5 ml-2 pl-6">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 mt-1 z-10 border-2 border-orange-500/30"></div>
                                    <div>
                                        <p className="text-xs font-black text-white leading-relaxed uppercase tracking-tight italic">{act.m}</p>
                                        <p className="text-[9px] font-black text-slate-600 uppercase mt-2 tracking-[0.2em] italic">{act.t}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-orange-600 border-none text-white text-center py-16 relative overflow-hidden group rounded-[3rem] shadow-[0_20px_50px_rgba(234,88,12,0.3)]">
                        <div className="absolute -bottom-20 -right-20 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000 text-black">
                            <ShieldCheck size={250} />
                        </div>
                        <h4 className="text-3xl font-black italic relative z-10 leading-tight uppercase tracking-tighter">"Knowledge <br /> Is The Ultimate <br /><span className="text-black">Weapon</span>."</h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/60 mt-8 relative z-10 italic">NeoMinds Command Center</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LiveClass;
