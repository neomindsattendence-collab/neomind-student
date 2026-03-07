import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    Building2,
    ChevronRight
} from 'lucide-react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Skeleton, EmptyState, Card, Button } from '../components/Common';

const Jobs = () => {
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const snap = await getDocs(collection(db, 'jobs'));
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setJobsData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) {
        return (
            <div className="space-y-12 animate-in fade-in duration-1000">
                <Skeleton className="h-64 w-full rounded-[3.5rem] bg-white/[0.02]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <Skeleton className="h-96 rounded-[3rem] bg-white/[0.02]" />
                    <Skeleton className="h-96 rounded-[3rem] bg-white/[0.02]" />
                    <Skeleton className="h-96 rounded-[3rem] bg-white/[0.02]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 text-center lg:text-left">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase italic underline decoration-orange-600/30">Talent Hub</h1>
                    <p className="text-slate-500 font-black mt-4 uppercase tracking-[0.4em] text-[10px] italic">Direct pipelines to elite industry partnerships</p>
                </div>
            </div>

            {/* Talent Sync Banner */}
            <Card className="bg-black border border-white/5 text-white p-14 relative overflow-hidden group rounded-[4rem] shadow-2xl">
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-orange-600/5 rounded-full -mr-48 -mt-48 blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-transparent pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="space-y-10 flex-1">
                        <div className="flex items-center gap-4">
                            <div className="px-6 py-2.5 bg-orange-600 text-white rounded-2xl italic font-black text-[10px] tracking-[0.3em] shadow-[0_0_20px_rgba(234,88,12,0.4)] animate-pulse uppercase">BROADCAST: SYNC ACTIVE</div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase italic">Your profile is <br /> <span className="text-orange-600">actively indexed.</span></h2>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs max-w-xl italic leading-relaxed opacity-70">Our partner networks periodically scan the NeoMinds Talent Registry. Active students with high integrity scores are prioritized for elite interview invitations.</p>
                        </div>
                        <Button variant="primary" className="py-6 px-12 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] italic shadow-2xl shadow-orange-900/40">
                            Optimize Deployment Portfolio
                        </Button>
                    </div>
                    <div className="w-full md:w-fit p-12 bg-white/[0.01] border border-white/5 rounded-[3rem] backdrop-blur-3xl italic shadow-inner group-hover:bg-white/[0.03] transition-colors duration-700">
                        <div className="text-center">
                            <div className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">94.2%</div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3">Indexing Score</p>
                        </div>
                    </div>
                </div>
            </Card>

            {jobsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {jobsData.map((job) => (
                        <Card key={job.id} className="group hover:border-orange-500/30 transition-all duration-1000 flex flex-col h-full bg-white/[0.01] border-white/5 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="p-5 bg-black border border-white/5 group-hover:border-orange-500/30 rounded-2xl flex items-center justify-center text-slate-700 group-hover:text-orange-500 transition-all duration-700 italic shadow-inner">
                                    <Building2 size={32} />
                                </div>
                                <Badge variant="warning" className="px-5 italic text-[8px] font-black tracking-widest">FULL-TIME</Badge>
                            </div>
                            <div className="flex-1 space-y-4 relative z-10">
                                <h4 className="text-2xl font-black text-white tracking-tighter leading-none group-hover:text-orange-500 transition-colors duration-700 uppercase italic">{job.role}</h4>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic underline decoration-white/5">{job.company}</p>
                            </div>
                            <Button variant="secondary" className="w-full mt-10 py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] italic bg-white/[0.03] border-white/5 hover:bg-orange-600 hover:text-white group transition-all duration-500 shadow-2xl shadow-black/50">
                                Deploy Profile <ChevronRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform duration-500" />
                            </Button>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Briefcase}
                    title="Registry Latency: Awaiting Wave"
                    message="New internship and full-time hiring cycles are deployed weekly. Maintain clinical attendance and node performance to qualify for the next wave of partner hiring."
                    className="bg-white/[0.01] border-white/5 p-24 rounded-[4rem] text-slate-500 italic uppercase font-black"
                />
            )}

            {/* Footer Info */}
            <div className="text-center py-20">
                <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] italic">Integrated Intelligence Talent Registry • NeoMinds Collective v1.0</p>
            </div>
        </div>
    );
};

export default Jobs;
