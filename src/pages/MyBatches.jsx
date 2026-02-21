import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton, EmptyState } from '../components/Common';

const MyBatches = () => {
    const { userDoc } = useAuth();
    const [batchesData, setBatchesData] = useState([]);
    const [activeBatchId, setActiveBatchId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatches = async () => {
            if (!userDoc?.assignedBatches?.length) {
                setLoading(false);
                return;
            }
            try {
                const promises = userDoc.assignedBatches.map(id => getDoc(doc(db, 'batches', id)));
                const snaps = await Promise.all(promises);
                const data = snaps.map(s => ({ id: s.id, ...s.data() }));
                setBatchesData(data);
                if (data.length > 0) setActiveBatchId(data[0].id);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
    }, [userDoc]);

    const activeBatch = batchesData.find(b => b.id === activeBatchId);

    if (loading) {
        return (
            <div className="space-y-10">
                <Skeleton className="h-24 w-1/2 rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 md:col-span-2 rounded-2xl" />
                </div>
                <Skeleton className="h-96 rounded-3xl" />
            </div>
        );
    }

    if (!batchesData.length) {
        return <EmptyState icon={Layers} title="Awaiting Unit Assignment" message="Your academic profile is verified. Our registrars are currently assigning you to your designated batches." />;
    }

    return (
        <div className="space-y-10 animate-in slide-in-from-left-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none uppercase">Academic Registry</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Active training units synced to your ID</p>
                </div>
                <div className="flex items-center space-x-1 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto max-w-full">
                    {batchesData.map((batch) => (
                        <button
                            key={batch.id}
                            onClick={() => setActiveBatchId(batch.id)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeBatchId === batch.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:text-indigo-600'}`}
                        >
                            {batch.course}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 border-l-4 border-l-indigo-600 bg-indigo-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Unit Status</p>
                    <div className="flex items-end space-x-2">
                        <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Active</h4>
                        <Badge variant="blue" className="mb-1 text-[8px]">In Progress</Badge>
                    </div>
                </Card>
                <Card className="lg:col-span-1 border-l-4 border-l-emerald-500 bg-emerald-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Class Frequency</p>
                    <div className="flex items-end space-x-2">
                        <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Bi-Weekly</h4>
                        <TrendingUp size={16} className="text-emerald-500 mb-2" />
                    </div>
                </Card>
                <Card className="lg:col-span-2 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl"><Users size={24} /></div>
                        <div>
                            <h4 className="text-lg font-black text-slate-800">Unit Instructors</h4>
                            <p className="text-xs font-bold text-slate-500">{activeBatch?.teacher || 'Senior Faculty Staff'} • Faculty Unit</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Academic Progression" subtitle="Verified curriculum checkpoints">
                        <div className="space-y-6 pt-2">
                            {[
                                { t: 'Core Fundamental Module', s: 'Complete', p: 100 },
                                { t: 'Advanced Concept Integration', s: 'In Progress', p: 45 },
                                { t: 'Project Deployment Phase', s: 'Pending', p: 0 },
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
                            <h4 className="text-xl font-black text-slate-800 mb-1">Unit Resources</h4>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-4">Curated library specifically for your {activeBatch?.course} track.</p>
                            <Button variant="secondary" className="w-full text-[10px] font-black uppercase border-2 rounded-xl">Registry Library</Button>
                        </Card>
                        <Card className="hover:border-emerald-400 transition-all cursor-pointer group">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all"><PieChart size={24} /></div>
                            <h4 className="text-xl font-black text-slate-800 mb-1">Progress Analytics</h4>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-4">Real-time breakdown of your metrics and technical assessment scores.</p>
                            <Button variant="secondary" className="w-full text-[10px] font-black uppercase border-2 rounded-xl">Sync Analytics</Button>
                        </Card>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card title="Time Parameters">
                        <div className="space-y-6 pt-2">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl"><Clock size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Batch Schedule</p>
                                    <p className="text-sm font-black text-slate-800">{activeBatch?.timing}</p>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-[2rem] text-white text-center">
                                <p className="text-[10px] font-black uppercase opacity-60 mb-2">System Time Status</p>
                                <h4 className="text-2xl font-black tracking-tight">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
                            </div>
                        </div>
                    </Card>

                    <Card title="Registry Updates">
                        <div className="space-y-3 pt-2">
                            {['Curriculum_Outline.pdf', 'Unit_Safety_Manual.pdf'].map((item, i) => (
                                <button key={i} className="w-full text-left p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-between group uppercase tracking-widest">
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
