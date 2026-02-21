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

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

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
                    totalSessions += (await getDocs(collection(db, 'batches', batchId, 'sessions'))).size;

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
                    // This is a bit complex as attendance is per sessionId.
                    // For now, let's look at the attendance sub-collection keys
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
        { name: 'Week 1', val: 75 },
        { name: 'Week 2', val: 82 },
        { name: 'Week 3', val: 78 },
        { name: 'Week 4', val: 90 },
        { name: 'Week 5', val: 85 },
    ];

    if (loading) {
        return (
            <div className="py-20 text-center animate-pulse">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Aggregating Academic Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Intelligence Dashboard</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Statistical breakdown of your academic trajectory</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Attendance', val: stats.attendance, icon: Clock, color: 'indigo' },
                    { label: 'Completed Tasks', val: stats.submissions, icon: Target, color: 'emerald' },
                    { label: 'Pending Tasks', val: stats.pending, icon: Zap, color: 'rose' },
                    { label: 'Overall Tier', val: stats.grade, icon: TrendingUp, color: 'amber' },
                ].map((stat, i) => (
                    <Card key={i} className="group hover:-translate-y-1 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 bg-slate-50 text-slate-600 rounded-xl`}><stat.icon size={20} /></div>
                            <Badge variant="blue" className="text-[9px]">Calculated</Badge>
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tabular-nums tracking-tighter">{stat.val}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card title="Attendance Trajectory" className="lg:col-span-2">
                    <div className="h-[300px] w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                <Line type="monotone" dataKey="val" stroke="#4F46E5" strokeWidth={4} dot={{ fill: '#4F46E5', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Skill Matrix" className="h-fit">
                    <div className="space-y-6 pt-2">
                        {[
                            { skill: 'Core Technicals', val: 92 },
                            { skill: 'Task Regularity', val: 78 },
                            { skill: 'Campus Presence', val: 85 },
                            { skill: 'Engagement', val: 82 },
                        ].map((skill, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{skill.skill}</span>
                                    <span className="text-xs font-black text-indigo-600 tabular-nums">{skill.val}%</span>
                                </div>
                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600" style={{ width: `${skill.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
