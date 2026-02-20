import React, { useState } from 'react';
import {
    FileText,
    Search,
    Filter,
    Download,
    Eye,
    ArrowRight,
    Inbox,
    LayoutGrid,
    ChevronRight,
    FileBox
} from 'lucide-react';
import { Card, Button, Badge, Modal, Input } from '../components/Common';
import { mockNotes, batches } from '../data/mockData';

const Notes = () => {
    const [selectedBatchId, setSelectedBatchId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);

    const filteredNotes = mockNotes.filter(note => {
        const matchesBatch = selectedBatchId === 'all' || note.batchId === selectedBatchId;
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesBatch && matchesSearch;
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
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
                    <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                        <button
                            onClick={() => setSelectedBatchId('all')}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedBatchId === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            All
                        </button>
                        {batches.map(b => (
                            <button
                                key={b.id}
                                onClick={() => setSelectedBatchId(b.id)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedBatchId === b.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {b.course}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                        <Card key={note.id} className="group hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-indigo-100 shadow-xl shadow-indigo-500/5 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                                    <FileText size={24} />
                                </div>
                                <Badge variant="neutral">{note.fileSize}</Badge>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{note.title}</h4>
                                <div className="mt-4 flex flex-col space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Instructor: <span className="text-slate-600">{note.teacher}</span></p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Batch: <span className="text-indigo-600 font-black">{batches.find(b => b.id === note.batchId)?.course}</span></p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
                                <Button variant="secondary" className="flex-1 text-[10px] uppercase font-black tracking-widest py-3 border-2" onClick={() => setSelectedNote(note)}>
                                    <Eye size={14} className="mr-2" /> Preview
                                </Button>
                                <Button variant="primary" className="flex-1 text-[10px] uppercase font-black tracking-widest py-3 shadow-lg shadow-indigo-100">
                                    <Download size={14} className="mr-2" /> Get PDF
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="py-20 text-center bg-slate-50/50 border-dashed border-2">
                    <FileBox size={60} className="mx-auto text-slate-200 mb-6" />
                    <h3 className="text-xl font-black text-slate-800">No resources found</h3>
                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Try adjusting your search or filters</p>
                </Card>
            )}

            {/* Note Preview Modal */}
            <Modal isOpen={!!selectedNote} onClose={() => setSelectedNote(null)} title="Document Preview">
                <div className="space-y-6">
                    <div className="aspect-[3/4] bg-slate-100 rounded-[2rem] border-2 border-slate-100 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-slate-900/5 flex flex-col items-center justify-center p-12 text-center">
                            <FileText size={80} className="text-slate-300 mb-6 group-hover:scale-110 transition-transform" />
                            <p className="text-sm font-bold text-slate-400 leading-relaxed italic">Interactive PDF rendering is disabled in simulated mode. Click download to access full material.</p>
                        </div>
                        <div className="absolute top-4 right-4 animate-pulse">
                            <Badge variant="live">Simulated Layer</Badge>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xl font-black text-slate-800">{selectedNote?.title}</h4>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Released by {selectedNote?.teacher} on {selectedNote?.date}</p>
                    </div>
                    <Button variant="primary" className="w-full py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-200" onClick={() => setSelectedNote(null)}>
                        Proceed to Download
                    </Button>
                </div>
            </Modal>

            {/* Bottom Tip Card */}
            <Card className="bg-slate-900 border-none text-white py-8 px-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                        <div className="p-4 bg-white/10 rounded-[1.5rem] backdrop-blur-md">
                            <LayoutGrid size={32} className="text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black tracking-tight leading-tight">Can't find something?</h4>
                            <p className="text-sm font-medium text-slate-400 mt-1">Check the "Global Archives" for older batch materials from previous years.</p>
                        </div>
                    </div>
                    <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl px-8 py-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        Open Archives
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Notes;
