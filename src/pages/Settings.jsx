import React from 'react';
import {
    Lock,
    Shield,
    Bell,
    Smartphone,
    ChevronRight
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/Common';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { userDoc } = useAuth();

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">Registry Configuration</h1>
                    <p className="text-slate-500 font-black mt-4 uppercase tracking-[0.3em] text-[10px] italic">Access hierarchy and system operational metadata</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <Card title="Operational Identity" subtitle="System Verified Information" className="bg-white/[0.02] border-white/5 p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Registry Name</label>
                                <Input defaultValue={userDoc?.name} readOnly className="italic font-bold bg-white/[0.03] border-white/5 text-slate-300 h-14 rounded-2xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">System Email</label>
                                <Input defaultValue={userDoc?.email} readOnly className="italic font-bold bg-white/[0.03] border-white/5 text-slate-300 h-14 rounded-2xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Registry ID</label>
                                <Input defaultValue={userDoc?.uid} readOnly className="italic font-bold bg-white/[0.03] border-white/5 text-slate-300 h-14 rounded-2xl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 italic">Authorized Role</label>
                                <Input defaultValue={userDoc?.role || 'Student'} readOnly className="italic font-bold bg-white/[0.03] border-white/5 text-orange-500 h-14 rounded-2xl" />
                            </div>
                        </div>
                        <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-slate-600 transition-all hover:text-orange-500 cursor-help group">
                                <Lock size={16} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none italic">Metadata locked by central registry council</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Network Security" subtitle="Neural access protocols" className="bg-white/[0.02] border-white/5 p-10">
                        <div className="space-y-6 mt-6">
                            {[
                                { icon: Shield, title: 'Identity Synchronization', status: 'Google Cloud Linked', action: 'Manage Access' },
                                { icon: Lock, title: 'Access Tokens', status: 'R-Proxy 4.0 Active', action: 'Rotate Hub' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/5 rounded-[2.5rem] group hover:border-orange-500/30 transition-all duration-700 shadow-xl overflow-hidden relative">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-orange-600/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                                    <div className="flex items-center space-x-6 relative z-10">
                                        <div className="p-4 bg-black text-slate-500 group-hover:bg-orange-600 group-hover:text-white rounded-2xl transition-all duration-500 shadow-2xl border border-white/5 italic">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-white uppercase tracking-widest italic">{item.title}</p>
                                            <p className="text-[9px] font-black text-slate-500 uppercase mt-2 tracking-[0.2em] italic">{item.status}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase bg-white/[0.03] border border-white/5 rounded-xl px-5 py-2.5 hover:bg-white/10 transition-colors italic relative z-10">{item.action}</Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-10">
                    <Card title="Stream Protocols" subtitle="System alerts" className="h-fit bg-white/[0.02] border-white/5 p-10">
                        <div className="space-y-8 mt-6">
                            <div className="flex items-center justify-between py-2 group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-600/10 text-orange-500 rounded-xl group-hover:scale-110 transition-transform"><Bell size={20} /></div>
                                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest italic">Broadcast Signals</span>
                                </div>
                                <div className="w-14 h-7 bg-orange-600 rounded-full p-1.5 flex justify-end cursor-pointer shadow-[0_0_15px_rgba(234,88,12,0.3)] transition-all"><div className="w-4 h-4 bg-white rounded-full shadow-lg"></div></div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-white/5 pt-8 group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/[0.03] text-slate-600 border border-white/5 rounded-xl group-hover:scale-110 transition-transform"><Smartphone size={20} /></div>
                                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest italic">Peripheral Sync</span>
                                </div>
                                <div className="w-14 h-7 bg-white/[0.05] border border-white/5 rounded-full p-1.5 flex justify-start cursor-pointer"><div className="w-4 h-4 bg-slate-500 rounded-full"></div></div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-black border border-white/5 text-white text-center py-20 px-10 relative overflow-hidden group rounded-[3.5rem] shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full -mr-24 -mt-24 blur-[100px] group-hover:scale-150 transition-transform duration-[2000ms] pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-transparent pointer-events-none"></div>

                        <div className="relative z-10 space-y-10">
                            <Badge variant="warning" className="bg-orange-600/20 text-orange-500 border-orange-500/20 px-8 py-2 font-black text-[9px] tracking-[0.3em] animate-pulse italic">OPERATIONAL NODE</Badge>
                            <div className="space-y-4">
                                <h4 className="text-3xl font-black tracking-tighter leading-tight uppercase italic underline decoration-orange-600/30">Neural Console</h4>
                                <p className="text-[10px] font-black text-slate-500 leading-relaxed uppercase tracking-[0.25em] italic">Access early decentralized mobile interface paradigms.</p>
                            </div>
                            <Button variant="primary" className="w-full py-6 rounded-2xl group shadow-[0_15px_40px_rgba(234,88,12,0.2)]">
                                Request Indexing <ChevronRight size={18} className="ml-3 group-hover:translate-x-2 transition-all duration-500" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
