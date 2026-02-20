import React, { useState } from 'react';
import {
    Briefcase,
    Search,
    MapPin,
    DollarSign,
    Clock,
    ExternalLink,
    Filter,
    ChevronRight,
    Zap,
    Building2,
    Bookmark
} from 'lucide-react';
import { Card, Button, Badge } from '../components/Common';
import { jobs } from '../data/mockData';

const Jobs = () => {
    const [activeType, setActiveType] = useState('All');

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Career Portal</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Exclusive opportunities for NeoMinds graduates</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-full lg:w-auto">
                    {['All', 'Full-time', 'Hybrid', 'Remote', 'Internship'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveType(t)}
                            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeType === t ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hero Jobs Banner */}
            <Card className="bg-indigo-600 border-none text-white p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md italic font-black text-xs">HIRE-NET ACTIVE</div>
                            <Badge variant="success" className="bg-emerald-400 text-emerald-950">12 NEW TODAY</Badge>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter leading-tight">Elite Partner Network <br /> Direct Applications</h2>
                        <p className="text-indigo-100 font-bold text-sm max-w-lg">Your academic performance is visible to these partners. Maintaining 90%+ attendance unlocks premium "Verified" badge for your applications.</p>
                        <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50 py-4 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            Complete Profile Sync
                        </Button>
                    </div>
                    <div className="hidden lg:flex gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10"><Building2 size={32} /></div>
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 translate-y-8"><Zap size={32} /></div>
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10"><Briefcase size={32} /></div>
                    </div>
                </div>
            </Card>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Filter by roles, companies or technologies..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-slate-800 transition-all shadow-sm"
                    />
                </div>
                <Button variant="secondary" className="py-4 px-8 border-2 rounded-2xl text-[10px] uppercase font-black tracking-widest gap-3">
                    <Filter size={16} /> Advanced Filters
                </Button>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.filter(j => activeType === 'All' || j.type === activeType).map((job) => (
                    <Card key={job.id} className="group hover:border-slate-800 transition-all duration-300 flex flex-col h-full bg-white shadow-xl shadow-slate-200/20">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-slate-50 border border-slate-100 group-hover:border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-slate-800 transition-all">
                                <Building2 size={24} />
                            </div>
                            <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                <Bookmark size={20} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-2">
                            <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors uppercase">{job.role}</h4>
                            <p className="text-sm font-bold text-slate-500 leading-none">{job.company}</p>

                            <div className="flex flex-wrap gap-2 pt-4">
                                {job.tags.map(tag => (
                                    <Badge key={tag} className="bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">{tag}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 text-slate-400">
                                <MapPin size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-400 justify-end">
                                <DollarSign size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">{job.salary}</span>
                            </div>
                        </div>

                        <Button variant="primary" className="w-full mt-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 border-none hover:bg-indigo-600 group shadow-lg shadow-slate-200">
                            Apply with Profile <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Footer Info */}
            <div className="text-center py-10 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Career Portal Powered by NeoMinds Talent-Sync</p>
            </div>
        </div>
    );
};

export default Jobs;
