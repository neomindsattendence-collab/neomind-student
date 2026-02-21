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
            <div className="max-w-4xl mx-auto py-20 text-center animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                    <Radio size={56} />
                </div>

                {isTeacherLive ? (
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <Badge variant="live" className="animate-pulse px-6 py-2">SESSION LIVE NOW</Badge>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Class has started by your teacher</h2>
                            <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">{activeSessionLive?.name || 'Neural Networks'} is currently in progress. Please join immediately to mark your attendance.</p>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            className="rounded-3xl shadow-2xl shadow-indigo-200 group"
                            onClick={() => activeSessionLive && joinSession(activeSessionLive)}
                        >
                            Join Live Session <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">No Active Sessions</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Waiting for instructor heartbeat...</p>
                        </div>
                        <Card className="bg-slate-50 border-dashed border-2 p-10 max-w-md mx-auto">
                            <p className="text-sm font-medium text-slate-500 italic">"The live environment will activate automatically once your instructor initiates the session geofence."</p>
                        </Card>
                    </div>
                )}

                <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Location Authorization">
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto">
                            <MapPinned size={40} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-slate-800 tracking-tighter">Academy Geo-Radius Check</h4>
                            <p className="text-sm font-medium text-slate-500 px-4 leading-relaxed">Location access is required to verify you are physically present within the academic campus radius.</p>
                        </div>
                        <div className="pt-4 flex flex-col gap-3">
                            <Button variant="primary" className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={allowLocation}>Allow Session Verification</Button>
                            <Button variant="ghost" className="w-full text-slate-400 font-black uppercase tracking-widest text-[10px]" onClick={() => setShowJoinModal(false)}>Cancel</Button>
                        </div>
                        {locationError && (
                            <div className="bg-rose-50 p-4 rounded-xl flex items-start space-x-3 text-left animate-in shake duration-500">
                                <AlertCircle size={18} className="text-rose-500 mt-0.5" />
                                <p className="text-xs font-bold text-rose-600 leading-tight">{locationError}</p>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in zoom-in-95 duration-700">
            {/* Joined Header */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 animate-pulse"></div>
                <div className="flex items-center space-x-8">
                    <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10 relative">
                        <Video size={48} className="text-indigo-400" />
                        <div className="absolute -top-2 -right-2 p-2 bg-rose-500 rounded-full border-4 border-slate-900">
                            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="success">LOCATION VERIFIED</Badge>
                            <span className="text-white/40 font-black text-xl tabular-nums tracking-widest">{timer}</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter line-clamp-1">{activeBatch}</h2>
                        <p className="text-indigo-300 font-bold text-sm uppercase tracking-widest mt-1">Live Technical Unit • Dr. Irfan Malik</p>
                    </div>
                </div>
                <Button variant="danger" className="py-5 px-10 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-900/20" onClick={leaveSession}>Leave Class Session</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Simulation Monitoring View */}
                    <Card title="Presence Monitoring" className="relative group overflow-hidden bg-slate-50 border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><ShieldCheck size={24} /></div>
                                    <Badge variant="success">Active</Badge>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance Status</p>
                                    <h4 className="text-2xl font-black text-slate-800">Verified & Marked</h4>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Signal size={24} /></div>
                                    <Badge variant="blue">Encrypted</Badge>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Uptime Heartbeat</p>
                                    <h4 className="text-2xl font-black text-slate-800">Stable Connection</h4>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center space-x-6 p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                <Globe size={120} />
                            </div>
                            <div className="flex-1 relative z-10">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Instructor Terminal Activity</p>
                                <div className="space-y-4">
                                    {[
                                        'Instructor is sharing screen: "Backprop_Derivations.pdf"',
                                        'Geofence radius updated: 250m Locked',
                                        'Poll initiated: "Complexity of Gradient Descent"'
                                    ].map((log, i) => (
                                        <p key={i} className="text-sm font-medium flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                            {log}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Quick Actions" className="bg-white">
                            <div className="space-y-3 pt-2">
                                <Button variant="secondary" className="w-full justify-start py-4 text-[10px] uppercase font-black border-2 gap-4">
                                    <PlayCircle size={18} className="text-indigo-600" /> Participate in Poll
                                </Button>
                                <Button variant="secondary" className="w-full justify-start py-4 text-[10px] uppercase font-black border-2 gap-4">
                                    <Video size={18} className="text-indigo-600" /> Join Meet Audio
                                </Button>
                            </div>
                        </Card>
                        <Card title="Live Stats" className="bg-white">
                            <div className="flex items-center justify-center h-full py-2">
                                <div className="text-center group">
                                    <div className="text-4xl font-black text-indigo-600 group-hover:scale-110 transition-transform tabular-nums">1.2mbps</div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Data Throughput</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card title="Recent Activity" className="h-fit">
                        <div className="space-y-6 pt-2">
                            {[
                                { m: 'Arsalan joined the class', t: '12m ago' },
                                { m: 'Taha marked present', t: '15m ago' },
                                { m: 'Instructor updated notes', t: '22m ago' },
                                { m: 'Session initialized', t: '25m ago' },
                            ].map((act, i) => (
                                <div key={i} className="flex gap-4 items-start pb-6 last:pb-0 relative">
                                    {i < 3 && <div className="absolute left-[7px] top-4 w-[2px] h-full bg-slate-50"></div>}
                                    <div className="w-4 h-4 rounded-full bg-slate-200 mt-1 z-10 border-2 border-white"></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 leading-snug">{act.m}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">{act.t}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-indigo-600 border-none text-white text-center py-10 relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 p-10 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                            <ShieldCheck size={120} />
                        </div>
                        <h4 className="text-xl font-black italic relative z-10 leading-tight">"Learning is a <br /> lifetime process."</h4>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-4 relative z-10">NeoMinds Education</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LiveClass;
