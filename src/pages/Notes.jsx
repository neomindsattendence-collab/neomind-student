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
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Resource Library</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Access your lecture slides and study materials</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all w-full sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                        <button
                            onClick={() => setSelectedBatchId('all')}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedBatchId === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            All
                        </button>
                        {batches.map(b => (
                            <button
                                key={b.id}
                                onClick={() => setSelectedBatchId(b.id)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedBatchId === b.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {b.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
            ) : filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <Card key={note.id} className="group hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-indigo-100 shadow-xl shadow-indigo-500/5 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl transition-all duration-300 ${note.type === 'PDF' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                                    {note.type === 'PDF' ? <FileText size={24} /> : <Eye size={24} />}
                                </div>
                                <Badge variant="neutral">{note.type}</Badge>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors uppercase">{note.title}</h4>
                                <div className="mt-4 flex flex-col space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Batch: <span className="text-indigo-600 font-black">{note.batchName}</span></p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mt-2">
                                        {note.createdAt?.toDate ? note.createdAt.toDate().toLocaleDateString() : 'New'}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
                                {note.fileUrl ? (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            className="flex-1 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2"
                                            onClick={() => openFile(note.fileUrl)}
                                        >
                                            <Eye size={16} />
                                            <span>View</span>
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="flex-1 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2"
                                            onClick={() => forceDownload(note.fileUrl, `${note.title}.pdf`)}
                                        >
                                            <Download size={16} />
                                            <span>Download</span>
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="ghost" className="w-full cursor-not-allowed opacity-50">
                                        No Payload
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="py-20 text-center bg-slate-50/50 border-dashed border-2">
                    <FileBox size={60} className="mx-auto text-slate-200 mb-6" />
                    <h3 className="text-xl font-black text-slate-800">No resources found</h3>
                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Your instructor hasn't uploaded notes for this batch yet.</p>
                </Card>
            )}
        </div>
    );
};

export default Notes;
