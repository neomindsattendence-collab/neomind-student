import React, { useState, useEffect } from 'react';
import {
    Layers,
    TrendingUp,
    Users,
    BookOpen,
    PieChart,
    Clock,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Skeleton, EmptyState, Card, Badge, Button } from '../components/Common';

const MyBatches = () => {
    const { userDoc } = useAuth();
    const [batchesData, setBatchesData] = useState([]);
    const [activeBatchId, setActiveBatchId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(false);

    useEffect(() => {
        const fetchBatches = async () => {
            if (!userDoc?.assignedBatches?.length) {
                setLoading(false);
                return;
            }
            try {
                const promises = userDoc.assignedBatches.map(id => getDoc(doc(db, 'batches', id)));
                const snaps = await Promise.all(promises);
                const data = snaps.map(s => ({ id: s.id, ...s.data() }));
                setBatchesData(data);
                if (data.length > 0) setActiveBatchId(data[0].id);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
    }, [userDoc]);

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!activeBatchId) return;
            setLoadingAttendance(true);
            try {
                const q = query(collection(db, `batches/${activeBatchId}/attendance`), orderBy('date', 'desc'));
                const snap = await getDocs(q);
                const logs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAttendanceLogs(logs);
            } catch (err) {
                console.error("Attendance fetch error:", err);
            } finally {
                setLoadingAttendance(false);
            }
        };
        fetchAttendance();
    }, [activeBatchId]);

    const activeBatch = batchesData.find(b => b.id === activeBatchId);

    if (loading) {
        return (
            <div className="space-y-12">
                <Skeleton className="h-28 w-1/2 rounded-[2rem]" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <Skeleton className="h-40 rounded-[2rem]" />
                    <Skeleton className="h-40 rounded-[2rem]" />
                    <Skeleton className="h-40 md:col-span-2 rounded-[2rem]" />
                </div>
                <Skeleton className="h-[500px] rounded-[3rem]" />
            </div>
        );
    }

    if (!batchesData.length) {
        return <EmptyState icon={Layers} title="Operational Silence" message="Your academic signature is verified, but no neural training units have been mapped to your protocol yet." />;
    }

    return (
        <div className="space-y-12 animate-in slide-in-from-left-6 duration-1000 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase italic">Academic Registry</h1>
                    <p className="text-slate-500 font-bold mt-4 uppercase tracking-[0.3em] text-[10px] italic">Operational training units synced to your ID</p>
                </div>
                <div className="flex items-center space-x-2 bg-white/[0.03] p-2 rounded-[1.75rem] border border-white/5 shadow-2xl overflow-x-auto max-w-full backdrop-blur-xl">
                    {batchesData.map((batch) => (
                        <button
                            key={batch.id}
                            onClick={() => setActiveBatchId(batch.id)}
                            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap italic ${activeBatchId === batch.id ? 'bg-orange-600 text-white shadow-2xl shadow-orange-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {batch.course}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <Card className="lg:col-span-1 border-t-4 border-t-orange-600 bg-orange-600/[0.03] p-10 group overflow-hidden relative border-none">
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-orange-600/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-4 italic">Unit Status</p>
                    <div className="flex items-end space-x-3">
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Operational</h4>
                        <Badge variant="warning" className="mb-1 text-[8px] animate-pulse">ACTIVE FLOW</Badge>
                    </div>
                </Card>
                <Card className="lg:col-span-1 border-t-4 border-t-emerald-500 bg-emerald-600/[0.03] p-10 group overflow-hidden relative border-none">
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-4 italic">Clock Rate</p>
                    <div className="flex items-end space-x-3">
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Regular</h4>
                        <TrendingUp size={22} className="text-emerald-500 mb-1.5" />
                    </div>
                </Card>
                <Card className="lg:col-span-2 flex items-center justify-between p-10 bg-white/[0.02] border-white/5 border relative overflow-hidden group">
                    <div className="absolute -right-16 -top-16 p-10 opacity-5 group-hover:opacity-10 group-hover:rotate-6 transition-all duration-1000">
                        <Users size={180} className="text-orange-500" />
                    </div>
                    <div className="flex items-center space-x-8 relative z-10">
                        <div className="w-16 h-16 bg-white/[0.05] text-white rounded-[1.5rem] flex items-center justify-center border border-white/5 italic font-black shadow-inner"><Users size={28} /></div>
                        <div>
                            <h4 className="text-2xl font-black text-white tracking-tight uppercase italic leading-none">{activeBatch?.teacher || 'Senior Faculty Staff'}</h4>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-3 italic">Designated Faculty Lead • Sector Alpha</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <Card title="Operational Progression" subtitle="Neural curriculum synchronization" className="bg-white/[0.02] border-white/5 p-12">
                        <div className="space-y-8 pt-4">
                            {[
                                { t: 'Core Fundamental Module', s: 'Synced', p: 100 },
                                { t: 'Advanced Concept Integration', s: 'In Progress', p: 45 },
                                { t: 'Project Deployment Phase', s: 'Locked', p: 0 },
                            ].map((module, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-5">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs italic border ${module.p === 100 ? 'bg-orange-600 text-white border-orange-500/50' : 'bg-white/5 text-slate-600 border-white/5'}`}>0{i + 1}</div>
                                            <span className={`text-base font-black uppercase tracking-tight italic ${module.p > 0 ? 'text-white' : 'text-slate-600'}`}>{module.t}</span>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${module.s === 'Synced' ? 'text-orange-500' : 'text-slate-600'}`}>{module.s}</span>
                                    </div>
                                    <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden border border-white/5 px-0.5 flex items-center">
                                        <div className={`h-1 rounded-full transition-all duration-1000 ${module.p === 100 ? 'bg-orange-600 shadow-[0_0_15px_#ea580c]' : 'bg-white/20'}`} style={{ width: `${module.p}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="hover:border-orange-500/30 transition-all duration-500 cursor-pointer group bg-white/[0.02] border-white/5 p-10">
                            <div className="p-5 bg-white/[0.05] text-slate-500 rounded-[1.75rem] w-fit mb-8 border border-white/5 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-500 transition-all duration-700 shadow-inner italic"><BookOpen size={28} /></div>
                            <h4 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">Resource Archive</h4>
                            <p className="text-[10px] font-black text-slate-600 leading-relaxed mb-8 uppercase tracking-widest italic">Encrypted library synced to your {activeBatch?.course} track.</p>
                            <Button variant="secondary" className="w-full text-[10px] font-black uppercase py-4 rounded-xl italic">Open Repository</Button>
                        </Card>
                        <Card className="hover:border-emerald-500/30 transition-all duration-500 cursor-pointer group bg-white/[0.02] border-white/5 p-10">
                            <div className="p-5 bg-white/[0.05] text-slate-500 rounded-[1.75rem] w-fit mb-8 border border-white/5 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all duration-700 shadow-inner italic"><PieChart size={28} /></div>
                            <h4 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">Performance Intel</h4>
                            <p className="text-[10px] font-black text-slate-600 leading-relaxed mb-8 uppercase tracking-widest italic">Real-time telemetry of your progress metrics and assessments.</p>
                            <Button variant="secondary" className="w-full text-[10px] font-black uppercase py-4 rounded-xl italic">Scan Metrics</Button>
                        </Card>
                    </div>

                    <Card title="Attendance Registry" subtitle="Verified operational participation logs" className="bg-white/[0.02] border-white/5 p-12">
                        {loadingAttendance ? (
                            <div className="space-y-4 mt-8">
                                <Skeleton className="h-20 rounded-[1.5rem]" />
                                <Skeleton className="h-20 rounded-[1.5rem]" />
                            </div>
                        ) : attendanceLogs.length > 0 ? (
                            <div className="space-y-4 mt-8">
                                {attendanceLogs.map((log) => {
                                    const isPresent = log.students?.includes(userDoc.uid);
                                    return (
                                        <div key={log.id} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-[1.75rem] border border-white/5 group hover:border-orange-500/30 transition-all duration-500 shadow-xl">
                                            <div className="flex items-center space-x-6">
                                                <div className={`p-4 rounded-2xl border transition-all duration-500 shadow-inner ${isPresent ? 'bg-orange-600/10 text-orange-500 border-orange-500/20' : 'bg-white/5 text-slate-700 border-white/5'}`}>
                                                    <Clock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase tracking-tight italic leading-none">Protocol ID: {log.sessionId.slice(0, 8)}</p>
                                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 italic leading-none">
                                                        {log.date?.toDate().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant={isPresent ? 'success' : 'danger'} className="px-5 py-2">
                                                {isPresent ? 'SECURE' : 'ABSENT'}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-20 h-20 bg-white/[0.03] rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-slate-800 border border-white/5 animate-pulse italic">
                                    <Clock size={40} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">Registry Silent</h4>
                                <p className="text-[10px] text-slate-600 font-bold max-w-xs mx-auto mt-3 leading-relaxed uppercase tracking-[0.2em] italic">
                                    No participation logs found in the global registry for this designated unit.
                                </p>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="space-y-10">
                    <Card title="Temporal Status" className="bg-white/[0.02] border-white/5 p-10">
                        <div className="space-y-8 mt-6">
                            <div className="flex items-center space-x-6 bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                                <div className="p-4 bg-white/[0.05] text-orange-500 rounded-2xl border border-white/5 shadow-inner italic"><Clock size={24} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-2 italic">Unit Schedule</p>
                                    <p className="text-base font-black text-white uppercase tracking-tight italic">{activeBatch?.timing}</p>
                                </div>
                            </div>
                            <div className="bg-black p-10 rounded-[2.5rem] text-white text-center border border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent pointer-events-none"></div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 italic relative z-10">Terminal Time Flow</p>
                                <h4 className="text-5xl font-black tracking-tighter italic text-orange-500 relative z-10 tabular-nums drop-shadow-[0_0_15px_rgba(234,88,12,0.3)]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
                            </div>
                        </div>
                    </Card>

                    <Card title="Registry Flux" className="bg-white/[0.02] border-white/5 p-10">
                        <div className="space-y-4 mt-6">
                            {['Curriculum_Protocol_v4.pdf', 'Operational_Guidelines.pdf'].map((item, i) => (
                                <button key={i} className="w-full text-left p-6 bg-white/[0.03] rounded-2xl border border-white/5 text-[10px] font-black text-slate-500 hover:text-white hover:bg-white/[0.06] hover:border-orange-500/30 transition-all duration-500 flex items-center justify-between group uppercase tracking-[0.2em] italic shadow-xl">
                                    {item}
                                    <ArrowRight size={16} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-0 group-hover:translate-x-2" />
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MyBatches;
