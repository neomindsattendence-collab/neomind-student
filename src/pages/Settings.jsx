import React from 'react';
import {
    User,
    Mail,
    BookOpen,
    Shield,
    Bell,
    Smartphone,
    ExternalLink,
    Lock,
    ChevronRight,
    Database
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/Common';
import { student } from '../data/mockData';

const Settings = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center md:text-left">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Account Ecosystem</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Manage your profile and platform preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Student Identity" subtitle="Personal Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <Input label="Full Name" defaultValue={student.name} readOnly />
                            <Input label="Academic Email" defaultValue={student.email} readOnly />
                            <Input label="Student ID" defaultValue={student.id} readOnly />
                            <Input label="Primary Track" defaultValue={student.major} readOnly />
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-slate-400">
                                <Lock size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Fields locked by Administration</span>
                            </div>
                            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Request Change</Button>
                        </div>
                    </Card>

                    <Card title="Security & Authentication">
                        <div className="space-y-4 pt-2">
                            {[
                                { icon: Shield, title: 'Two-Factor Authentication', status: 'Enabled', action: 'Manage' },
                                { icon: Lock, title: 'Password Settings', status: 'Last changed 3 months ago', action: 'Update' },
                                { icon: Database, title: 'Session Management', status: '2 active devices', action: 'Review' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-indigo-400 transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-white text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl transition-all shadow-sm">
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 tracking-tight">{item.title}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.status}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase rounded-xl">{item.action}</Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card title="Preferences" className="h-fit">
                        <div className="space-y-6 pt-2">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <Bell size={20} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">Email Notifications</span>
                                </div>
                                <div className="w-12 h-6 bg-indigo-600 rounded-full p-1 flex justify-end cursor-pointer"><div className="w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <Smartphone size={20} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">SMS Alerts (Live Class)</span>
                                </div>
                                <div className="w-12 h-6 bg-slate-200 rounded-full p-1 flex justify-start cursor-pointer"><div className="w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <BookOpen size={20} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">Course Newsletter</span>
                                </div>
                                <div className="w-12 h-6 bg-indigo-600 rounded-full p-1 flex justify-end cursor-pointer"><div className="w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-slate-900 border-none text-white text-center py-10 px-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10 space-y-4">
                            <Badge variant="blue" className="bg-white/10 text-white border-white/20 px-6">BETA ACCESS</Badge>
                            <h4 className="text-2xl font-black tracking-tight leading-tight uppercase">NeoMinds Mobile App</h4>
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest italic">Join the closed beta to test our iOS & Android student apps with real-time radius syncing.</p>
                            <Button variant="secondary" className="w-full bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl group">
                                Enroll as Beta User <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-all" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
