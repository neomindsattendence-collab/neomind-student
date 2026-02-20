import React from 'react';
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
    Trophy
} from 'lucide-react';
import { Card, Button, Badge } from '../components/Common';
import { student, batches, mockNotes, mockAssignments } from '../data/mockData';

const Dashboard = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <Badge variant="blue" className="px-4 py-1.5 mb-2">Academic Year 2026</Badge>
                    <h1 className="text-5xl font-black text-slate-800 tracking-tighter leading-none">
                        Welcome back, <span className="text-indigo-600">{student.name.split(' ')[0]}!</span>
                    </h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Your personalized learning hub is ready</p>
                </div>
                <div className="flex gap-4">
                    <Card className="flex items-center space-x-4 p-4 py-3 bg-white border-2 border-indigo-100 shadow-indigo-500/5">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={20} /></div>
                        <div>
                            <p className="text-2xl font-black text-slate-800 leading-none">{student.attendance}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Avg Attendance</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Col: Main Stats & Schedule */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {batches.map((batch) => (
                            <Card key={batch.id} className="relative overflow-hidden group hover:border-indigo-200 transition-all duration-300">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Layers size={80} className="text-indigo-600" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <Badge variant="neutral">{batch.course}</Badge>
                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Level {student.level}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors uppercase">{batch.name}</h3>
                                    <p className="text-sm font-bold text-slate-500 mb-6">Instructor: {batch.teacher}</p>

                                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                            <p className="text-xs font-bold text-slate-600">{batch.completion} Complete</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next Class</p>
                                            <p className="text-xs font-bold text-slate-600">{batch.nextClass.split(',')[0]}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Schedule & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card title="Academic Schedule" className="h-fit">
                            <div className="space-y-6 pt-2">
                                {batches.map((batch, i) => (
                                    <div key={i} className="flex items-center space-x-5 group cursor-pointer p-2 -m-2 rounded-2xl hover:bg-slate-50 transition-all">
                                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200 text-slate-500 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <span className="text-xs">{batch.timing.split(' ')[0]}</span>
                                            <span className="text-[8px] uppercase tracking-tighter opacity-70">Day</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{batch.name}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Starts @ {batch.timing.split(', ')[1]}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="secondary" className="w-full mt-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center group">
                                View Full Calendar <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Card>

                        <Card title="Recent Study Notes" className="h-fit">
                            <div className="space-y-4 pt-2">
                                {mockNotes.slice(0, 3).map((note) => (
                                    <div key={note.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-400 transition-all cursor-pointer group">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2.5 bg-white text-rose-500 rounded-xl shadow-sm"><FileText size={18} /></div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{note.title}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase mt-1">{note.date}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                ))}
                            </div>
                            <Button variant="secondary" className="w-full mt-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center group">
                                Study Library <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Right Col: Deadlines & Quick Stats */}
                <div className="space-y-8">
                    <Card title="Upcoming Tasks" subtitle="Pending Assignments" className="bg-slate-900 border-none text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="space-y-5 pt-2 relative z-10">
                            {mockAssignments.filter(a => a.status === 'Pending').slice(0, 2).map((task) => (
                                <div key={task.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1 tabular-nums italic">Due: {task.dueDate}</p>
                                    <p className="text-sm font-bold text-white leading-tight">{task.title}</p>
                                    <div className="flex items-center mt-3 space-x-2">
                                        <Badge variant="neutral" className="bg-white/10 text-white/60 lowercase italic">! Needs Attention</Badge>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 py-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                All Assignments
                            </Button>
                        </div>
                    </Card>

                    <Card title="Knowledge Points" className="bg-indigo-600 border-none text-white">
                        <div className="text-center py-6">
                            <div className="w-24 h-24 bg-white/10 rounded-full border-4 border-indigo-400 flex items-center justify-center mx-auto mb-4">
                                <Zap size={40} className="text-white fill-white" />
                            </div>
                            <h4 className="text-4xl font-black">{student.points}</h4>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mt-2">Current XP Progress</p>
                        </div>
                        <div className="mt-4 h-2 bg-black/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white shadow-[0_0_10px_white]" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-[9px] font-bold text-center mt-3 opacity-50 uppercase tracking-widest">250 MORE TO LEVEL 15</p>
                    </Card>

                    <Card className="!p-0 overflow-hidden group">
                        <div className="bg-emerald-500 p-6 text-white text-center pb-20 relative">
                            <Trophy className="mx-auto mb-2 opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[3]" size={80} />
                            <h4 className="text-lg font-black tracking-tight relative z-10">Consistency King</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 relative z-10">Achievement Unlocked</p>
                        </div>
                        <div className="px-8 pb-8 -mt-12 relative z-10">
                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-900/10 border border-slate-100 text-center">
                                <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"You haven't missed a single lecture in the last 15 days. Keep up the momentum!"</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
