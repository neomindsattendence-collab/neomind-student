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
    const [activeType, setActiveType] = useState('All');

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
            <div className="space-y-10">
                <Skeleton className="h-48 w-full rounded-[2.5rem]" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-80 rounded-3xl" />
                    <Skeleton className="h-80 rounded-3xl" />
                    <Skeleton className="h-80 rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none uppercase">Talent Registry</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Direct pipelines to elite industry partners</p>
                </div>
            </div>

            {/* Talent Sync Banner */}
            <Card className="bg-slate-900 border-none text-white p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md italic font-black text-[10px] tracking-widest text-indigo-400">NEOMINDS SYNC ACTIVE</div>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter leading-tight uppercase">Your profile is currently <br /> being indexed.</h2>
                        <p className="text-slate-400 font-bold text-sm max-w-lg">Our partner networks periodically scan the NeoMinds Talent Registry. Active students with high integrity scores are prioritized for interview invitations.</p>
                        <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100 py-4 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                            Optimize Portfolio
                        </Button>
                    </div>
                </div>
            </Card>

            {jobsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobsData.map((job) => (
                        <Card key={job.id} className="group hover:border-slate-800 transition-all duration-300 flex flex-col h-full bg-white shadow-xl shadow-slate-200/20">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-slate-50 border border-slate-100 group-hover:border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-slate-800 transition-all">
                                    <Building2 size={24} />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors uppercase">{job.role}</h4>
                                <p className="text-sm font-bold text-slate-500 leading-none">{job.company}</p>
                            </div>
                            <Button variant="primary" className="w-full mt-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 border-none hover:bg-indigo-600 group shadow-lg shadow-slate-200">
                                Apply with Profile <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Briefcase}
                    title="Registry Awaiting Cycles"
                    message="New internship and full-time cycles are posted weekly. Maintain clinical attendance to qualify for the next wave of partner hiring."
                />
            )}

            {/* Footer Info */}
            <div className="text-center py-10 opacity-40">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Integrated Talent Registry Console v1.0</p>
            </div>
        </div>
    );
};

export default Jobs;
