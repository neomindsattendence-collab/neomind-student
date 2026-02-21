import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { userDoc } = useAuth();

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center md:text-left">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none uppercase">Profile Registry</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Registry metadata and system permissions</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Registry Identity" subtitle="System Verified Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <Input label="Registry Name" defaultValue={userDoc?.name} readOnly />
                            <Input label="System Email" defaultValue={userDoc?.email} readOnly />
                            <Input label="Registry ID" defaultValue={userDoc?.uid} readOnly />
                            <Input label="Auth Role" defaultValue={userDoc?.role || 'Student'} readOnly />
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-slate-400">
                                <Lock size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Metadata locked by registry board</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Ecosystem Security">
                        <div className="space-y-4 pt-2">
                            {[
                                { icon: Shield, title: 'Identity Synchronization', status: 'Google Linked', action: 'Manage' },
                                { icon: Lock, title: 'Access Tokens', status: 'OAuth 2.0 Active', action: 'Rotate' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-indigo-200 transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-white text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl transition-all shadow-sm">
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{item.title}</p>
                                            <p className="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-widest">{item.status}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-[8px] font-black uppercase bg-white border border-slate-100 rounded-xl px-4 py-2 hover:bg-slate-50">{item.action}</Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card title="Protocol Prefs" className="h-fit">
                        <div className="space-y-6 pt-2">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <Bell size={18} className="text-indigo-600" />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Comm Alerts</span>
                                </div>
                                <div className="w-12 h-6 bg-indigo-600 rounded-full p-1 flex justify-end cursor-pointer shadow-lg shadow-indigo-100"><div className="w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <Smartphone size={18} className="text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Mobile Sync</span>
                                </div>
                                <div className="w-12 h-6 bg-slate-100 rounded-full p-1 flex justify-start cursor-pointer"><div className="w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-slate-900 border-none text-white text-center py-10 px-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10 space-y-4">
                            <Badge variant="blue" className="bg-white/10 text-white border-white/20 px-6 font-black text-[8px]">REGISTRY BETA</Badge>
                            <h4 className="text-2xl font-black tracking-tighter leading-tight uppercase">Mobile Console</h4>
                            <p className="text-[9px] font-black text-slate-500 leading-relaxed uppercase tracking-widest italic">Request early access to the decentralized mobile interface.</p>
                            <Button variant="secondary" className="w-full bg-white text-slate-900 font-black uppercase tracking-widest text-[9px] py-4 rounded-2xl group hover:bg-slate-100 transition-all">
                                Request Indexing <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-all" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
