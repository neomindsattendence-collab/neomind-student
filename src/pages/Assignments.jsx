import React, { useState } from 'react';
import {
    ClipboardCheck,
    Search,
    Clock,
    Upload,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    MonitorCheck,
    FileBox,
    Plus
} from 'lucide-react';
import { Card, Button, Badge, Modal, Input } from '../components/Common';
import { mockAssignments, batches } from '../data/mockData';

const Assignments = () => {
    const [assignments, setAssignments] = useState(mockAssignments);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (id) => {
        setIsSubmitting(true);
        // Simulate API delay
        setTimeout(() => {
            setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'Submitted' } : a));
            setIsSubmitting(false);
            setShowSubmitModal(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 text-center lg:text-left">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Task Hub</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Manage your technical submissions & deadlines</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-full lg:w-auto overflow-x-auto noscroll">
                    {['All Tasks', 'Pending', 'Submitted'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === 'All Tasks' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hero Goal Card */}
            <Card className="bg-slate-900 border-none text-white p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="space-y-4">
                        <Badge variant="blue" className="bg-indigo-600/30 text-white border-white/20">Monthly Progress: 82%</Badge>
                        <h2 className="text-4xl font-black tracking-tighter leading-none">Complete 2 more tasks to <br /> maintain your XP streak!</h2>
                        <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-lg">Consistent submission of lab works is the fastest way to gain visibility among partner hiring teams.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Pending</p>
                            <p className="text-4xl font-black">{assignments.filter(a => a.status === 'Pending').length}</p>
                        </div>
                        <div className="text-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Completed</p>
                            <p className="text-4xl font-black">{assignments.filter(a => a.status === 'Submitted').length}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Assignment Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {assignments.map((task) => {
                    const batch = batches.find(b => b.id === task.batchId);
                    return (
                        <Card key={task.id} className="group hover:border-indigo-400 transition-all duration-300 shadow-xl shadow-indigo-500/5 h-fit flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                    <ClipboardCheck size={24} />
                                </div>
                                <Badge variant={task.status === 'Submitted' ? 'success' : 'warning'}>{task.status}</Badge>
                            </div>

                            <div className="flex-1">
                                <h4 className="text-2xl font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{batch.course} Unit</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diff: {task.difficulty}</span>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center space-x-3 text-slate-500">
                                        <Clock size={16} />
                                        <div className="leading-tight">
                                            <p className="text-[9px] font-black uppercase opacity-60">Due Date</p>
                                            <p className="text-xs font-black">{task.dueDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 text-slate-500">
                                        <MonitorCheck size={16} />
                                        <div className="leading-tight">
                                            <p className="text-[9px] font-black uppercase opacity-60">Status</p>
                                            <p className="text-xs font-black">{task.status === 'Submitted' ? 'Grading Pending' : 'Action Required'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                {task.status === 'Pending' ? (
                                    <Button
                                        variant="primary"
                                        className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 group"
                                        onClick={() => { setSelectedAssignment(task); setShowSubmitModal(true); }}
                                    >
                                        Open Submission Portal <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                ) : (
                                    <Button variant="secondary" className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 border-emerald-500/10 bg-emerald-50/20 text-emerald-600 cursor-default">
                                        <CheckCircle2 size={14} className="mr-2" /> Successfully Submitted
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Submission Modal */}
            <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Upload Submission">
                <div className="space-y-8">
                    <div className="space-y-1">
                        <h4 className="text-lg font-black text-slate-800">{selectedAssignment?.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Submission • Encrypted Upload</p>
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center bg-slate-50 cursor-pointer hover:bg-white hover:border-indigo-400 transition-all group">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-slate-300 group-hover:text-indigo-600 shadow-sm mb-4 transition-all group-hover:scale-110">
                            <Upload size={32} />
                        </div>
                        <p className="text-sm font-black text-slate-700">Drag & drop your artifact</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">PDF, ZIP or GitHub Link</p>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="secondary" className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-2" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            className="flex-2 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-200"
                            onClick={() => handleSubmit(selectedAssignment.id)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Syncing with Server...' : 'Confirm Submission'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Success Banner */}
            {showSuccess && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-top-full duration-500">
                    <Card className="!bg-emerald-600 !text-white border-none py-4 px-10 flex items-center space-x-4 shadow-[0_20px_40px_rgba(5,150,105,0.3)]">
                        <CheckCircle2 size={24} />
                        <span className="text-sm font-black uppercase tracking-widest">Artifact Uploaded Successfully!</span>
                    </Card>
                </div>
            )}

            {/* Career Bridge Card */}
            <Card className="bg-indigo-600 border-none text-white overflow-hidden group">
                <div className="flex items-center flex-col md:flex-row gap-8">
                    <div className="relative w-40 h-40 flex-shrink-0">
                        <div className="absolute inset-0 bg-white/20 rounded-3xl group-hover:rotate-12 transition-transform duration-500"></div>
                        <div className="absolute inset-0 bg-white/10 rounded-3xl group-hover:-rotate-6 transition-transform duration-500"></div>
                        <div className="absolute inset-0 bg-white rounded-3xl flex items-center justify-center text-indigo-600">
                            <MonitorCheck size={64} />
                        </div>
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-3xl font-black tracking-tight leading-none">Ready for Evaluation?</h3>
                        <p className="text-indigo-100 font-bold text-sm max-w-xl">Our partner hiring teams review top-tier submissions weekly. Ensure your code is well-documented and optimized for the final project showcase.</p>
                        <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                            View Eval Metrics
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Assignments;
