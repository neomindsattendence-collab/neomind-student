import React, { useState } from 'react';
import {
    Layers,
    Users,
    Clock,
    TrendingUp,
    ArrowRight,
    Search,
    Filter,
    LayoutGrid,
    BookOpen,
    PieChart,
    Calendar
} from 'lucide-react';
import { Card, Button, Badge } from '../components/Common';
import { batches, student } from '../data/mockData';

const MyBatches = () => {
    const [activeBatchId, setActiveBatchId] = useState(batches[0].id);
    const activeBatch = batches.find(b => b.id === activeBatchId);

    return (
        <div className="space-y-10 animate-in slide-in-from-left-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">My Learning Tracks</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Academic segments assigned to your profile</p>
                </div>
                <div className="flex items-center space-x-1 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    {batches.map((batch) => (
                        <button
                            key={batch.id}
                            onClick={() => setActiveBatchId(batch.id)}
                            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeBatchId === batch.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {batch.course}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 border-l-4 border-l-indigo-600 bg-indigo-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Completion</p>
                    <div className="flex items-end space-x-2">
                        <h4 className="text-4xl font-black text-slate-800">{activeBatch.completion}</h4>
                        <Badge variant="blue" className="mb-1 text-[8px]">On Track</Badge>
                    </div>
                </Card>
                <Card className="lg:col-span-1 border-l-4 border-l-emerald-500 bg-emerald-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Current Perf.</p>
                    <div className="flex items-end space-x-2">
                        <h4 className="text-4xl font-black text-slate-800">{activeBatch.performance}</h4>
                        <TrendingUp size={16} className="text-emerald-500 mb-2" />
                    </div>
                </Card>
                <Card className="lg:col-span-2 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl"><Users size={24} /></div>
                        <div>
                            <h4 className="text-lg font-black text-slate-800">Lead Instructor</h4>
                            <p className="text-xs font-bold text-slate-500">{activeBatch.teacher} • Academic Unit A</p>
                        </div>
                    </div>
                    <Button variant="secondary" size="sm" className="rounded-xl px-4 py-2 border-2 text-[10px] uppercase font-black tracking-widest">Connect</Button>
                </Card>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Module Progression" subtitle="Topics covered & remaining">
                        <div className="space-y-6 pt-2">
                            {[
                                { t: 'Mathematical Foundations', s: 'Complete', p: 100 },
                                { t: 'Gradient Descent Optimization', s: 'Complete', p: 100 },
                                { t: 'Backpropagation Algorithm', s: 'In Progress', p: 45 },
                                { t: 'Convolutional Architectures', s: 'Pending', p: 0 },
                            ].map((module, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] ${module.p === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>0{i + 1}</div>
                                            <span className={`text-sm font-bold ${module.p > 0 ? 'text-slate-800' : 'text-slate-400'}`}>{module.t}</span>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${module.s === 'Complete' ? 'text-emerald-500' : 'text-slate-400'}`}>{module.s}</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-1000 ${module.p === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${module.p}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="hover:border-indigo-400 transition-all cursor-pointer group">
                            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all"><BookOpen size={24} /></div>
                            <h4 className="text-xl font-black text-slate-800 mb-1">Study Guide</h4>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-4">Curated resources and reading lists specifically for the {activeBatch.course} curriculum.</p>
                            <Button variant="secondary" className="w-full text-[10px] font-black uppercase border-2 rounded-xl">Access Library</Button>
                        </Card>
                        <Card className="hover:border-emerald-400 transition-all cursor-pointer group">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all"><PieChart size={24} /></div>
                            <h4 className="text-xl font-black text-slate-800 mb-1">Performance Drill</h4>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-4">Detailed breakdown of your session-wise quiz results and technical assessment scores.</p>
                            <Button variant="secondary" className="w-full text-[10px] font-black uppercase border-2 rounded-xl">View Analysis</Button>
                        </Card>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card title="Class Schedule Details">
                        <div className="space-y-6 pt-2">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl"><Clock size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Standard Timing</p>
                                    <p className="text-sm font-black text-slate-800">{activeBatch.timing}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl"><Calendar size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Session Frequency</p>
                                    <p className="text-sm font-black text-slate-800">2 Sessions / Week</p>
                                </div>
                            </div>
                            <div className="bg-indigo-600 p-6 rounded-[2rem] text-white text-center">
                                <p className="text-[10px] font-black uppercase opacity-60 mb-2">Next Session In</p>
                                <h4 className="text-3xl font-black tabular-nums tracking-tight">18h 42m</h4>
                            </div>
                        </div>
                    </Card>

                    <Card title="Quick Resources">
                        <div className="space-y-3 pt-2">
                            {['Syllabus.pdf', 'Lab_Guidelines.docx', 'Software_Setup.sh'].map((item, i) => (
                                <button key={i} className="w-full text-left p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-between group">
                                    {item}
                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
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
