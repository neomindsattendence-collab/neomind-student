import React, { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Download,
    Eye,
    FileBox,
    ExternalLink
} from 'lucide-react';
import { Card, Button, Badge } from '../components/Common';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { collection, query, onSnapshot, orderBy, getDoc, doc } from 'firebase/firestore';
import { forceDownload, openFile } from '../services/fileService';

const Notes = () => {
    const { userDoc } = useAuth();
    const [notes, setNotes] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedBatchId, setSelectedBatchId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch batch names
    useEffect(() => {
        const fetchBatches = async () => {
            if (!userDoc?.assignedBatches?.length) return;
            try {
                const bDetails = [];
                for (const id of userDoc.assignedBatches) {
                    const snap = await getDoc(doc(db, 'batches', id));
                    if (snap.exists()) bDetails.push({ id: snap.id, name: snap.data().name });
                }
                setBatches(bDetails);
            } catch (err) {
                console.error("Batch Fetch Error:", err);
            }
        };
        fetchBatches();
    }, [userDoc]);

    // Real-time listener for notes
    useEffect(() => {
        if (!userDoc?.assignedBatches?.length) {
            setLoading(false);
            return;
        }

        const unsubscribes = userDoc.assignedBatches.map(batchId => {
            const notesRef = collection(db, 'batches', batchId, 'notes');
            return onSnapshot(query(notesRef, orderBy('createdAt', 'desc')), (snapshot) => {
                const batchName = batches.find(b => b.id === batchId)?.name || 'Batch';
                const bNotes = snapshot.docs.map(doc => ({
                    id: doc.id,
                    batchId,
                    batchName,
                    ...doc.data()
                }));

                setNotes(prev => {
                    const others = prev.filter(n => n.batchId !== batchId);
                    return [...others, ...bNotes].sort((a, b) => {
                        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
                        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
                        return dateB - dateA;
                    });
                });
            });
        });

        setLoading(false);
        return () => unsubscribes.forEach(unsub => unsub());
    }, [userDoc, batches]);

    const filteredNotes = notes.filter(note => {
        const matchesBatch = selectedBatchId === 'all' || note.batchId === selectedBatchId;
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBatch && matchesSearch;
    });

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase underline decoration-orange-600/30">Library</h1>
                    <p className="text-slate-500 font-black mt-4 uppercase tracking-[0.3em] text-[10px] italic">Secured archives of academic training telemetry</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Query archives..."
                            className="pl-14 pr-8 h-16 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-orange-600/50 focus:ring-4 focus:ring-orange-600/10 transition-all w-full sm:w-80 italic shadow-2xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-2xl border border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setSelectedBatchId('all')}
                            className={`px-8 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 italic whitespace-nowrap ${selectedBatchId === 'all' ? 'bg-orange-600 text-white shadow-2xl shadow-orange-900/40' : 'text-slate-500 hover:text-white'}`}
                        >
                            Global
                        </button>
                        {batches.map(b => (
                            <button
                                key={b.id}
                                onClick={() => setSelectedBatchId(b.id)}
                                className={`px-8 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 italic whitespace-nowrap ${selectedBatchId === b.id ? 'bg-orange-600 text-white shadow-2xl shadow-orange-900/40' : 'text-slate-500 hover:text-white'}`}
                            >
                                {b.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-40 text-center"><div className="w-20 h-20 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_50px_rgba(234,88,12,0.4)]"></div></div>
            ) : filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredNotes.map((note) => (
                        <Card key={note.id} className="group hover:border-orange-500/30 transition-all duration-1000 bg-white/[0.01] border-white/5 rounded-[3.5rem] p-12 shadow-2xl flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className={`p-5 rounded-2xl border border-white/5 transition-all duration-700 italic shadow-inner ${note.type === 'PDF' ? 'bg-rose-600/10 text-rose-500 border-rose-500/20' : 'bg-orange-600/10 text-orange-500 border-orange-500/20'}`}>
                                    {note.type === 'PDF' ? <FileText size={32} /> : <Eye size={32} />}
                                </div>
                                <Badge variant="warning" className="px-6 py-2 italic text-[8px] font-black tracking-widest uppercase">{note.type}</Badge>
                            </div>
                            <div className="flex-1 relative z-10">
                                <h4 className="text-2xl font-black text-white tracking-tighter leading-tight group-hover:text-orange-500 transition-colors duration-700 uppercase italic underline decoration-white/5">{note.title}</h4>
                                <div className="mt-8 flex flex-col space-y-4">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] leading-none italic">Sector: <span className="text-orange-500">{note.batchName}</span></p>
                                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] italic">
                                        Release: {note.createdAt?.toDate ? note.createdAt.toDate().toLocaleDateString() : 'New Protocol'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-10 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                                {note.fileUrl ? (
                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        <Button
                                            variant="secondary"
                                            className="h-16 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 italic bg-white/[0.03] border-white/5 hover:bg-white/10"
                                            onClick={() => openFile(note.fileUrl)}
                                        >
                                            <Eye size={20} className="translate-y-[-1px]" />
                                            <span>Stream</span>
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="h-16 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 italic shadow-2xl shadow-orange-900/30"
                                            onClick={() => forceDownload(note.fileUrl, `${note.title}.pdf`)}
                                        >
                                            <Download size={20} className="translate-y-[-1px]" />
                                            <span>Acquire</span>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full h-16 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-center text-[9px] font-black text-slate-700 uppercase tracking-widest italic cursor-not-allowed">
                                        Directives Locked
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="py-32 text-center bg-white/[0.01] border-dashed border-2 border-white/5 rounded-[4rem] group overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent pointer-events-none transition-opacity duration-1000 opacity-0 group-hover:opacity-100"></div>
                    <FileBox size={80} className="mx-auto text-slate-800 mb-10 group-hover:scale-110 transition-transform duration-1000 group-hover:text-orange-500/10" />
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">Archives Depleted</h3>
                    <p className="text-[10px] font-black text-slate-500 mt-6 uppercase tracking-[0.3em] italic max-w-sm mx-auto leading-relaxed">No academic directives found for this sector cluster. Synchronize with faculty for manual data acquisition.</p>
                </Card>
            )}
        </div>
    );
};

export default Notes;
