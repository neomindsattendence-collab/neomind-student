import React, { useState, useEffect } from 'react';
import {
    Layers,
    Calendar,
    FileText,
    TrendingUp,
    ArrowRight,
    Zap,
    Clock,
    ChevronRight,
    ClipboardCheck,
    Trophy,
    Radio,
    Sparkles,
    Search,
    Inbox,
    Shield
} from 'lucide-react';
import { Card, Button, Badge, Skeleton, EmptyState, Toast, Modal } from '../components/Common';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const Dashboard = () => {
    const { userDoc } = useAuth();
    const { liveSessions, isAnyLive, joinSession, sessionStatus, locationError } = useSession();
    const navigate = useNavigate();
    const [realBatches, setRealBatches] = useState([]);
    const [recentNotes, setRecentNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!userDoc?.assignedBatches?.length) {
                setLoading(false);
                return;
            }
            try {
                // Fetch Batches
                const batchPromises = userDoc.assignedBatches.map(id => getDoc(doc(db, 'batches', id)));
                const batchSnaps = await Promise.all(batchPromises);
                const batchData = batchSnaps.map(snap => ({ id: snap.id, ...snap.data() }));
                setRealBatches(batchData);

                // Fetch Recent Notes
                const notesUnsubs = userDoc.assignedBatches.map(batchId => {
                    return onSnapshot(query(collection(db, 'batches', batchId, 'notes'), orderBy('createdAt', 'desc'), limit(1)), (snap) => {
                        setRecentNotes(prev => {
                            const others = prev.filter(n => n.batchId !== batchId);
                            return [...others, ...snap.docs.map(d => ({ id: d.id, batchId, ...d.data() }))];
                        });
                    });
                });

                setLoading(false);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, [userDoc]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in duration-1000">
                <div className="lg:col-span-3 space-y-12">
                    <Skeleton className="h-64 w-full rounded-[3.5rem]" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Skeleton className="h-80 rounded-[3rem]" />
                        <Skeleton className="h-80 rounded-[3rem]" />
                    </div>
                </div>
                <div className="space-y-10">
                    <Skeleton className="h-96 rounded-[3rem]" />
                    <Skeleton className="h-64 rounded-[3rem]" />
                </div>
            </div>
        );
    }

    // Identify which session to show in banner (if any)
    const activeBatchLive = Object.values(liveSessions)[0];

    return (
        <div className="space-y-16 animate-in fade-in duration-1000 pb-32 relative">
            {/* Background Decorative Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/[0.03] rounded-full blur-[160px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/[0.03] rounded-full blur-[140px] pointer-events-none -z-10"></div>

            {/* Live Class Alert Banner */}
            {isAnyLive && sessionStatus === 'OFFLINE' && (
                <div className="bg-[#050505]/40 backdrop-blur-3xl rounded-[4rem] p-12 md:p-16 text-white flex flex-col lg:flex-row justify-between items-center gap-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-20 duration-1000 relative overflow-hidden group border border-orange-500/10 hover:border-orange-500/30 transition-all">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/[0.07] rounded-full translate-x-1/2 -translate-y-1/2 blur-[140px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="flex items-center space-x-12 relative z-20 w-full lg:w-auto">
                        <div className="w-28 h-28 bg-orange-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(234,88,12,0.5)] animate-pulse border border-white/20 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                            <Radio size={56} strokeWidth={2.5} />
                        </div>
                        <div className="italic">
                            <div className="flex items-center gap-4 mb-5">
                                <span className="w-3 h-3 bg-orange-500 rounded-full animate-ping shadow-[0_0_15px_#f97316]"></span>
                                <Badge variant="warning" className="px-6 py-2 tracking-[0.3em] font-black text-[10px] italic bg-orange-500/10 border-orange-500/20">NEURAL STREAM INITIALIZED</Badge>
                            </div>
                            <h3 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none underline decoration-orange-600/20">{activeBatchLive?.name}</h3>
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-700 mt-6 italic">Status: Academic Signal Detected • Encrypted Link Protocol Active</p>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full lg:w-auto group shadow-2xl scale-110 active:scale-95 transition-all duration-500"
                        onClick={() => joinSession(activeBatchLive)}
                    >
                        <span className="flex items-center font-black uppercase tracking-[0.4em] italic">
                            Initialize Uplink <ArrowRight size={22} className="ml-6 group-hover:translate-x-4 transition-transform duration-700 mt-0.5" />
                        </span>
                    </Button>
                </div>
            )}

            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 px-4">
                <div className="space-y-4">
                    <Badge variant="blue" className="px-8 py-3 tracking-[0.3em] font-black text-[10px] italic bg-indigo-500/5 border-indigo-500/10 text-indigo-500">CORE PROTOCOL v4.0 ONLINE</Badge>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase mt-6">
                        Hello, <span className="text-orange-500 underline decoration-orange-600/20">{userDoc?.name?.split(' ')[0] || 'Scholar'}</span>
                    </h1>
                    <p className="text-slate-700 font-black mt-6 uppercase tracking-[0.4em] text-[11px] italic">Accessing your neural academy console • Registry Synchronized</p>
                </div>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-3 space-y-16">
                    {realBatches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {realBatches.map((batch) => (
                                <Card key={batch.id} className="relative overflow-hidden group hover:border-orange-500/30 transition-all duration-1000 shadow-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-3xl p-12 hover:scale-[1.02]">
                                    <div className="absolute -top-20 -right-20 opacity-[0.02] group-hover:opacity-[0.08] group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000">
                                        <Layers size={350} className="text-orange-600" />
                                    </div>
                                    <div className="relative z-10 space-y-8">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="blue" className="bg-indigo-500/5 border-indigo-500/10 text-indigo-500 font-black px-5 py-2 uppercase tracking-widest">{batch.course}</Badge>
                                            <Shield size={24} className="text-orange-600 opacity-20 group-hover:opacity-50 transition-opacity" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-5xl font-black text-white tracking-tighter leading-none mb-4 uppercase italic group-hover:text-orange-500 transition-colors underline decoration-orange-600/10">{batch.name}</h3>
                                            <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] italic">Frequency: {batch.timing || 'Global Time Protocol'}</p>
                                        </div>

                                        <div className="pt-10 border-t border-white/5 flex gap-6">
                                            <Button variant="secondary" size="md" className="flex-1 italic" onClick={() => navigate('/notes')}>Unit Resources</Button>
                                            <Button variant="primary" size="md" className="flex-1 italic" onClick={() => navigate('/analytics')}>Telemetry Scan</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={Inbox} title="Signal Null" message="Your account is synchronized but no neural academic units have been mapped to your profile." />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <Card title="Academic Directives" subtitle="Operational schedule logs" className="bg-[#050505]/40 backdrop-blur-3xl border-white/5 hover:border-orange-500/20 transition-all duration-700 shadow-2xl">
                            <div className="space-y-5 mt-10">
                                {realBatches.map((batch, i) => (
                                    <div key={i} className="flex items-center justify-between p-8 bg-white/[0.01] rounded-[2.5rem] border border-white/5 group hover:border-orange-500/40 hover:bg-white/[0.03] transition-all duration-500 cursor-pointer shadow-inner overflow-hidden relative">
                                        <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative z-10 flex items-center space-x-6">
                                            <div className="w-12 h-12 bg-[#0a0a0a] rounded-xl flex items-center justify-center border border-white/5 text-slate-800 group-hover:text-orange-500 group-hover:border-orange-500/30 transition-all duration-500 shadow-2xl">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-white uppercase tracking-tight italic group-hover:text-orange-500 transition-colors">{batch.name}</p>
                                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.25em] mt-2 italic group-hover:text-slate-500 transition-colors">{batch.timing}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={22} className="text-slate-800 group-hover:text-orange-500 transition-all duration-700 translate-x-0 group-hover:translate-x-3 relative z-10" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Knowledge Streams" subtitle="Real-time resource archives" className="bg-[#050505]/40 backdrop-blur-3xl border-white/5 hover:border-orange-500/20 transition-all duration-700 shadow-2xl">
                            {recentNotes.length > 0 ? (
                                <div className="space-y-5 mt-10">
                                    {recentNotes.map((note) => (
                                        <div key={note.id} className="flex items-center space-x-6 p-8 bg-white/[0.01] rounded-[2.5rem] border border-white/5 group hover:border-orange-500/40 hover:bg-white/[0.03] transition-all duration-500 cursor-pointer shadow-inner relative overflow-hidden" onClick={() => navigate('/notes')}>
                                            <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="p-5 bg-[#0a0a0a] text-slate-800 group-hover:text-orange-500 rounded-2xl border border-white/5 shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 relative z-10"><FileText size={26} strokeWidth={2} /></div>
                                            <div className="relative z-10">
                                                <p className="text-base font-black text-white uppercase tracking-tight italic mb-2 group-hover:text-orange-500 transition-colors line-clamp-1">{note.title}</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse"></div>
                                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] italic group-hover:text-slate-500 transition-colors">Encrypted Fragment</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-8">
                                    <EmptyState icon={Search} title="Streams Inactive" message="No neural resource archives have been synchronized for your current units." />
                                </div>
                            )}
                        </Card>
                    </div>
                </div>

                <div className="space-y-12">
                    <Card className="bg-[#050505] border border-white/5 text-white overflow-hidden relative p-16 group shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-[4rem] hover:border-orange-500/30 transition-all duration-1000">
                        <div className="absolute -bottom-16 -right-16 p-12 opacity-[0.03] group-hover:opacity-[0.1] group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000 blur-sm">
                            <Zap size={300} className="fill-orange-600 text-orange-600" />
                        </div>
                        <div className="text-center relative z-10">
                            <div className="w-28 h-28 bg-orange-600/5 rounded-[3rem] border border-orange-500/10 flex items-center justify-center mx-auto mb-10 backdrop-blur-3xl shadow-[0_0_50px_rgba(234,88,12,0.1)] group-hover:shadow-[0_0_80px_rgba(234,88,12,0.2)] group-hover:scale-110 transition-all duration-700">
                                <Zap size={44} className="text-orange-600 fill-orange-600 animate-pulse" />
                            </div>
                            <h4 className="text-7xl font-black tabular-nums tracking-tighter italic text-white group-hover:text-orange-500 transition-colors">1,240</h4>
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-700 mt-6 leading-none italic uppercase">Scholar Proficiency Matrix</p>
                        </div>
                        <div className="mt-12 h-3 bg-white/[0.02] rounded-full overflow-hidden relative z-10 border border-white/5 shadow-inner">
                            <div className="h-full bg-gradient-to-r from-orange-800 to-orange-500 shadow-[0_0_20px_#ea580c] transition-all duration-2000 ease-out flex items-center justify-end px-2" style={{ width: '75%' }}>
                                <div className="w-1 h-1 bg-white rounded-full animate-ping shadow-[0_0_10px_white]"></div>
                            </div>
                        </div>
                        <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.5em] mt-10 text-center italic opacity-40 group-hover:opacity-100 transition-opacity">Registry Data Synchronized</p>
                    </Card>

                    <Card title="Telemetry Scan" subtitle="Neural performance variance" className="bg-[#050505]/40 backdrop-blur-3xl border-white/5 shadow-2xl hover:border-orange-500/20 transition-all duration-700">
                        <div className="space-y-6 mt-10">
                            {[
                                { l: 'Consistency', v: '98%', c: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                                { l: 'Sync Rate', v: '14/15', c: 'text-orange-500', bg: 'bg-orange-500/5' },
                                { l: 'Neural Latency', v: '0.2ms', c: 'text-slate-600', bg: 'bg-white/[0.02]' },
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center p-6 bg-white/[0.01] rounded-[2rem] border border-white/5 group hover:border-white/10 transition-all duration-500 shadow-inner relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${row.bg} blur-3xl rounded-full -mr-12 -mt-12 opacity-30`}></div>
                                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] italic relative z-10">{row.l}</span>
                                    <span className={`text-sm font-black italic tracking-tighter relative z-10 px-4 py-1.5 rounded-xl border border-white/5 backdrop-blur-xl ${row.c}`}>{row.v}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Location Error Toast */}
            {locationError && <Toast type="error" message={`GPS MALFUNCTION: ${locationError}`} onClose={() => { }} />}
        </div>
    );
};

export default Dashboard;
