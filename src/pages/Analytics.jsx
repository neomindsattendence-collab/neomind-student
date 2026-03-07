import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    BarChart3,
    PieChart,
    Target,
    Zap,
    Clock,
    Award,
    ChevronUp,
    LineChart as LucideLineChart
} from 'lucide-react';
import { Card, Button, Badge } from '../components/Common';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

const COLORS = ['#ea580c', '#10B981', '#f59e0b', '#ef4444'];

const Analytics = () => {
    const { user, userDoc } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        attendance: '0%',
        submissions: 0,
        pending: 0,
        grade: 'A'
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!userDoc?.assignedBatches?.length) {
                setLoading(false);
                return;
            }
            try {
                let submitted = 0;
                let pending = 0;
                let presentCount = 0;
                let totalSessions = 0;

                for (const batchId of userDoc.assignedBatches) {
                    // Count Assignments
                    const assignmentsSnap = await getDocs(collection(db, 'batches', batchId, 'assignments'));
                    const sessionsSnap = await getDocs(collection(db, 'batches', batchId, 'sessions'));
                    totalSessions += sessionsSnap.size;

                    for (const assignment of assignmentsSnap.docs) {
                        const subRef = doc(db, 'batches', batchId, 'assignments', assignment.id, 'submissions', user.uid);
                        const subSnap = await getDoc(subRef);
                        if (subSnap.exists()) {
                            submitted++;
                        } else {
                            pending++;
                        }
                    }

                    // Count Attendance
                    const attendanceSnap = await getDocs(collection(db, 'batches', batchId, 'attendance'));
                    attendanceSnap.docs.forEach(docSnap => {
                        if (docSnap.data().presentStudents?.includes(user.uid)) {
                            presentCount++;
                        }
                    });
                }

                setStats({
                    attendance: totalSessions > 0 ? `${Math.round((presentCount / totalSessions) * 100)}%` : '100%',
                    submissions: submitted,
                    pending: pending,
                    grade: 'Elite'
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userDoc, user.uid]);

    const chartData = [
        { name: 'W1', val: 75 },
        { name: 'W2', val: 82 },
        { name: 'W3', val: 78 },
        { name: 'W4', val: 90 },
        { name: 'W5', val: 85 },
    ];

    if (loading) {
        return (
            <div className="py-40 text-center">
                <div className="w-20 h-20 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_50px_rgba(234,88,12,0.4)]"></div>
                <p className="mt-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic animate-pulse">Aggregating Neural Telemetry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">Intelligence Center</h1>
                    <p className="text-slate-500 font-bold mt-4 uppercase tracking-[0.3em] text-[10px] italic">Operational statistical breakdown of your academic trajectory</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Attendance', val: stats.attendance, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-600/10' },
                    { label: 'Completed Tasks', val: stats.submissions, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-600/10' },
                    { label: 'Pending Tasks', val: stats.pending, icon: Zap, color: 'text-rose-500', bg: 'bg-rose-600/10' },
                    { label: 'Overall Tier', val: stats.grade, icon: Award, color: 'text-amber-500', bg: 'bg-amber-600/10' },
                ].map((stat, i) => (
                    <Card key={i} className="group hover:border-orange-500/30 p-10 bg-white/[0.02] border-white/5 relative overflow-hidden transition-all duration-700 shadow-2xl">
                        <div className="absolute -right-8 -top-8 p-10 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-6 transition-all duration-1000">
                            <stat.icon size={120} />
                        </div>
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className={`p-4 ${stat.bg} ${stat.color} rounded-[1.5rem] shadow-inner border border-white/5 italic transition-all duration-700 group-hover:scale-110`}><stat.icon size={28} /></div>
                            <Badge variant="warning" className="text-[8px] px-3 font-black tracking-widest italic animate-pulse">VERIFIED</Badge>
                        </div>
                        <h4 className="text-5xl font-black text-white tabular-nums tracking-tighter italic relative z-10 group-hover:text-orange-500 transition-colors duration-700">{stat.val}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-3 italic relative z-10">{stat.label}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card title="Attendance Synchronization" subtitle="Neural participation history" className="lg:col-span-2 bg-white/[0.02] border-white/5 p-12">
                    <div className="h-[400px] w-full mt-12 bg-white/[0.01] rounded-[2rem] border border-white/5 p-8 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent pointer-events-none transition-opacity duration-1000"></div>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis
                                    dataKey="name"
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={15}
                                    fontWeight="bold"
                                    className="uppercase tracking-widest"
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    fontWeight="bold"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#050505',
                                        borderRadius: '2rem',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                                        padding: '1.5rem',
                                        backdropFilter: 'blur(30px)'
                                    }}
                                    itemStyle={{ color: '#ea580c', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', fontStyle: 'italic' }}
                                    cursor={{ stroke: 'rgba(234,88,12,0.2)', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="val"
                                    stroke="#ea580c"
                                    strokeWidth={5}
                                    dot={{ fill: '#ea580c', r: 8, strokeWidth: 0, shadowBlur: 20, shadowColor: '#ea580c' }}
                                    activeDot={{ r: 12, stroke: '#fff', strokeWidth: 4, fill: '#ea580c' }}
                                    animationDuration={2000}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Skill Matrix" subtitle="Neural proficiency rating" className="h-full bg-white/[0.02] border-white/5 p-12">
                    <div className="space-y-10 mt-12">
                        {[
                            { skill: 'Core Technicals', val: 92, color: 'bg-orange-600' },
                            { skill: 'Task Regularity', val: 78, color: 'bg-emerald-600' },
                            { skill: 'Session Attendance', val: 85, color: 'bg-orange-600' },
                            { skill: 'Social Engagement', val: 82, color: 'bg-rose-600' },
                        ].map((skill, i) => (
                            <div key={i} className="space-y-5">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] italic">{skill.skill}</span>
                                    <span className="text-sm font-black text-white tabular-nums tracking-tighter italic">{skill.val}%</span>
                                </div>
                                <div className="h-3 bg-white/[0.04] rounded-full overflow-hidden border border-white/5 p-0.5 flex items-center">
                                    <div
                                        className={`h-1.5 rounded-full ${skill.color} transition-all duration-[2000ms] ease-out shadow-[0_0_20px_rgba(234,88,12,0.4)]`}
                                        style={{ width: `${skill.val}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 p-8 bg-black rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent pointer-events-none"></div>
                        <div className="flex items-center space-x-6 relative z-10">
                            <div className="p-4 bg-orange-600 text-white rounded-2xl shadow-[0_10px_30px_rgba(234,88,12,0.3)] italic"><Award size={28} /></div>
                            <div>
                                <h5 className="text-white font-black uppercase italic tracking-tighter text-xl">Operational Elite</h5>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2 italic">Neural Synchronization: 98.4%</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
