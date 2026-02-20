import React from 'react';
import {
    TrendingUp,
    BarChart3,
    PieChart,
    Target,
    Zap,
    Clock,
    Award,
    ChevronUp,
    LineChart
} from 'lucide-react';
import { Card, Button, Badge } from '../components/Common';
import { student, batches } from '../data/mockData';

const Analytics = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Intelligence Dashboard</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Statistical breakdown of your academic trajectory</p>
                </div>
                <div className="flex gap-4">
                    <Badge variant="success" className="px-4 py-2">Top 5% Performers</Badge>
                </div>
            </div>

            {/* High Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Avg Attendance', val: student.attendance, icon: Clock, color: 'indigo', trend: '+2.4%' },
                    { label: 'Assgn. Completion', val: '88%', icon: Target, color: 'emerald', trend: '+12%' },
                    { label: 'Knowledge Points', val: student.points, icon: Zap, color: 'amber', trend: '+250' },
                    { label: 'Course Progress', val: '64%', icon: TrendingUp, color: 'rose', trend: 'On Track' },
                ].map((stat, i) => (
                    <Card key={i} className={`border-l-4 border-l-${stat.color}-500 group hover:-translate-y-1 transition-all`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl`}><stat.icon size={20} /></div>
                            <div className="flex items-center text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                <ChevronUp size={12} className="mr-1" /> {stat.trend}
                            </div>
                        </div>
                        <h4 className="text-3xl font-black text-slate-800 tabular-nums tracking-tighter">{stat.val}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Simulation */}
                <Card title="Attendance Trajectory" className="lg:col-span-2 relative overflow-hidden h-[400px]">
                    <div className="absolute inset-x-0 bottom-0 top-20 p-8 flex items-end justify-between gap-2 overflow-hidden">
                        {/* Simulated Line Chart Dots/Lines */}
                        {[75, 82, 78, 90, 85, 94, 92, 98, 94].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div className="relative w-full flex flex-col items-center">
                                    <div className="w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-lg shadow-indigo-200 z-10 group-hover:scale-150 transition-transform mb-2"></div>
                                    <div
                                        className="w-1.5 bg-indigo-50 group-hover:bg-indigo-100 transition-colors rounded-t-full mt-[-6px]"
                                        style={{ height: `${h * 2}px` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase mt-4">W{i + 1}</p>
                            </div>
                        ))}
                    </div>
                    <div className="absolute right-8 top-8 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase">You</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-30">
                            <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase">Batch Avg</span>
                        </div>
                    </div>
                </Card>

                <Card title="Skill Matrix" className="h-fit">
                    <div className="space-y-6 pt-2">
                        {[
                            { skill: 'Neural Architectures', val: 92 },
                            { skill: 'React Ecosystem', val: 78 },
                            { skill: 'Cloud Orchestration', val: 45 },
                            { skill: 'Project Management', val: 82 },
                            { skill: 'Data Visualization', val: 68 },
                        ].map((skill, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{skill.skill}</span>
                                    <span className="text-xs font-black text-indigo-600 tabular-nums">{skill.val}%</span>
                                </div>
                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                        style={{ width: `${skill.val}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col items-center text-center p-8 border-t-4 border-t-amber-400">
                    <div className="p-4 bg-amber-50 text-amber-500 rounded-full mb-4"><Award size={32} /></div>
                    <h4 className="text-xl font-black text-slate-800">Elite Badge</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Consistency Award</p>
                </Card>
                <Card className="flex flex-col items-center text-center p-8 border-t-4 border-t-emerald-400">
                    <div className="p-4 bg-emerald-50 text-emerald-500 rounded-full mb-4"><Zap size={32} /></div>
                    <h4 className="text-xl font-black text-slate-800">Hyper-Learner</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Resource Consumption</p>
                </Card>
                <Card className="flex flex-col items-center text-center p-8 border-t-4 border-t-rose-400">
                    <div className="p-4 bg-rose-50 text-rose-500 rounded-full mb-4"><LineChart size={32} /></div>
                    <h4 className="text-xl font-black text-slate-800">Rising Star</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Performance delta 15%</p>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
