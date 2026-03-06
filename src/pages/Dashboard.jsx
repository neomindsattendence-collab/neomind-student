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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
                <div className="lg:col-span-3 space-y-8">
                    <Skeleton className="h-40 w-full" />
                    <div className="grid grid-cols-2 gap-6">
                        <Skeleton className="h-64" />
                        <Skeleton className="h-64" />
                    </div>
                </div>
                <Skeleton className="h-full" />
            </div>
        );
    }

    // Identify which session to show in banner (if any)
    const activeBatchLive = Object.values(liveSessions)[0];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Live Class Alert Banner */}
            {isAnyLive && sessionStatus === 'OFFLINE' && (
                <div className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-[0_20px_50px_rgba(225,29,72,0.3)] animate-in slide-in-from-top-10 duration-700 relative overflow-hidden group">
                    {/* Dynamic Glow Layers */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-rose-400/20 rounded-full blur-[80px] pointer-events-none transition-transform duration-1000"></div>

                    <div className="flex items-center space-x-10 relative z-20 w-full md:w-auto">
                        <div className="p-6 bg-white/20 rounded-[2.5rem] live-pulse shadow-2xl backdrop-blur-md border border-white/20 pointer-events-none">
                            <Radio size={48} className="text-white drop-shadow-lg" />
                        </div>
                        <div className="pointer-events-none">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-90 italic drop-shadow-md">Live Session Logic Initialized</p>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-2 drop-shadow-2xl">{activeBatchLive?.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="live" className="px-4 py-1.5 !bg-white/10 border-white/10 text-white text-[9px]">ENCRYPTED STREAM</Badge>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status: Lead Instructor Active</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        className="!bg-white !text-rose-600 hover:scale-105 active:scale-95 border-none px-14 py-6 rounded-2xl relative z-50 pointer-events-auto shadow-[0_15px_30px_rgba(255,255,255,0.2)] font-black text-sm transition-all duration-300 group/btn"
                        onClick={() => joinSession(activeBatchLive)}
                    >
                        Join Class Now <ArrowRight size={20} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </div>
            )}

            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <Badge variant="blue" className="px-5 py-2 mb-4">Unit Protocol v2.5 Online</Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter leading-none">
                        Hello, <span className="text-indigo-600">{userDoc?.name?.split(' ')[0] || 'Scholar'}</span>
                    </h1>
                    <p className="text-slate-400 font-black mt-3 uppercase tracking-[0.2em] text-[10px] italic">Accessing your neural academy dashboard</p>
                </div>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-10">
                    {realBatches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {realBatches.map((batch) => (
                                <Card key={batch.id} className="relative overflow-hidden group hover:border-indigo-400 transition-all duration-500 shadow-2xl shadow-slate-200/20 border-none">
                                    <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                                        <Layers size={200} className="text-indigo-600" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <Badge variant="blue">{batch.course}</Badge>
                                            <Shield size={18} className="text-emerald-500" />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-none mb-2 uppercase">{batch.name}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Index: {batch.timing || 'Global Time'}</p>

                                        <div className="mt-10 pt-8 border-t border-slate-50 flex gap-4">
                                            <Button variant="secondary" className="flex-1" onClick={() => navigate('/notes')}>Resources</Button>
                                            <Button variant="primary" className="flex-1" onClick={() => navigate('/analytics')}>Intel</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={Inbox} title="Awaiting Assignment" message="Your account is active but no course batches have been assigned yet." />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card title="Academic Directive" subtitle="Live schedule logs">
                            <div className="space-y-4 pt-4">
                                {realBatches.map((batch, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-400 transition-all">
                                        <div>
                                            <p className="text-sm font-black text-slate-800 uppercase leading-none">{batch.name}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mt-2">{batch.timing}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Knowledge Streams" subtitle="Recent resource drops">
                            {recentNotes.length > 0 ? (
                                <div className="space-y-4 pt-4">
                                    {recentNotes.map((note) => (
                                        <div key={note.id} className="flex items-center space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-400 transition-all cursor-pointer" onClick={() => navigate('/notes')}>
                                            <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm"><FileText size={20} /></div>
                                            <div>
                                                <p className="text-xs font-black text-slate-700 uppercase leading-tight">{note.title}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Resource Index Locked</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={Search} title="No Streams" message="No study notes have been released to your batches yet." />
                            )}
                        </Card>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card className="bg-indigo-600 border-none text-white overflow-hidden relative p-10 group">
                        <div className="absolute -bottom-10 -right-10 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                            <Zap size={180} className="fill-white" />
                        </div>
                        <div className="text-center relative z-10">
                            <div className="w-20 h-20 bg-white/10 rounded-[2rem] border-2 border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                                <Zap size={32} className="text-white fill-white" />
                            </div>
                            <h4 className="text-5xl font-black tabular-nums tracking-tighter">1,240</h4>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-4 leading-none italic">Academic XP Rank</p>
                        </div>
                        <div className="mt-8 h-1.5 bg-black/20 rounded-full overflow-hidden relative z-10">
                            <div className="h-full bg-white shadow-[0_0_20px_white]" style={{ width: '75%' }}></div>
                        </div>
                    </Card>

                    <Card title="Quick Analytics" subtitle="Realtime performance drift">
                        <div className="space-y-6 pt-4">
                            {[
                                { l: 'Consistency', v: '98%', c: 'text-emerald-500' },
                                { l: 'Submissions', v: '14/15', c: 'text-indigo-600' },
                                { l: 'Avg Latency', v: '0.2ms', c: 'text-slate-400' },
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{row.l}</span>
                                    <span className={`text-xs font-black italic ${row.c}`}>{row.v}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Location Error Toast */}
            {locationError && <Toast type="error" message={locationError} onClose={() => { }} />}
        </div>
    );
};

export default Dashboard;
