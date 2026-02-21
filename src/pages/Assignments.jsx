import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    getDocs,
    doc,
    setDoc,
    serverTimestamp,
    getDoc
} from 'firebase/firestore';

const Assignments = () => {
    const { user, userDoc } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submissions, setSubmissions] = useState({}); // { assignmentId: submissionData }

    // Fetch batch names
    useEffect(() => {
        const fetchBatches = async () => {
            if (!userDoc?.assignedBatches?.length) return;
            const bDetails = [];
            for (const id of userDoc.assignedBatches) {
                const snap = await getDocs(query(collection(db, 'batches'), where('__name__', '==', id)));
                if (!snap.empty) bDetails.push({ id: snap.docs[0].id, name: snap.docs[0].data().name });
            }
            setBatches(bDetails);
        };
        fetchBatches();
    }, [userDoc]);

    // Real-time listener for assignments and submissions
    useEffect(() => {
        if (!userDoc?.assignedBatches?.length) return;

        const unsubscribes = userDoc.assignedBatches.map(batchId => {
            const assignmentsRef = collection(db, 'batches', batchId, 'assignments');
            return onSnapshot(query(assignmentsRef, orderBy('createdAt', 'desc')), async (snapshot) => {
                const batchAssignments = snapshot.docs.map(doc => ({
                    id: doc.id,
                    batchId,
                    batchName: batches.find(b => b.id === batchId)?.name || 'Batch',
                    ...doc.data()
                }));

                setAssignments(prev => {
                    const others = prev.filter(a => a.batchId !== batchId);
                    return [...others, ...batchAssignments].sort((a, b) => b.createdAt ? -1 : 1);
                });

                // Fetch submissions for these assignments
                for (const assignment of batchAssignments) {
                    const subRef = doc(db, 'batches', batchId, 'assignments', assignment.id, 'submissions', user.uid);
                    const subSnap = await getDoc(subRef);
                    if (subSnap.exists()) {
                        setSubmissions(prev => ({ ...prev, [assignment.id]: subSnap.data() }));
                    }
                }
            });
        });

        return () => unsubscribes.forEach(unsub => unsub());
    }, [userDoc, batches, user.uid]);

    const handleSubmit = async () => {
        if (!selectedAssignment) return;
        setIsSubmitting(true);
        try {
            const subRef = doc(db, 'batches', selectedAssignment.batchId, 'assignments', selectedAssignment.id, 'submissions', user.uid);
            await setDoc(subRef, {
                studentUid: user.uid,
                studentName: userDoc.name,
                submittedAt: serverTimestamp(),
                status: 'Grading Pending'
            });

            setShowSubmitModal(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error("Submission failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const pendingCount = assignments.filter(a => !submissions[a.id]).length;
    const submittedCount = Object.keys(submissions).length;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 text-center lg:text-left">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Task Hub</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Manage your technical submissions & deadlines</p>
                </div>
            </div>

            <Card className="bg-slate-900 border-none text-white p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                    <div className="space-y-4">
                        <Badge variant="blue" className="bg-indigo-600/30 text-white border-white/20">Task Progress</Badge>
                        <h2 className="text-4xl font-black tracking-tighter leading-none">Stay Ahead. <br /> Finish your pending tasks.</h2>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Pending</p>
                            <p className="text-4xl font-black">{pendingCount}</p>
                        </div>
                        <div className="text-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Completed</p>
                            <p className="text-4xl font-black">{submittedCount}</p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {assignments.map((task) => {
                    const submission = submissions[task.id];
                    return (
                        <Card key={task.id} className="group hover:border-indigo-400 transition-all duration-300 shadow-xl shadow-indigo-500/5 h-fit flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                    <ClipboardCheck size={24} />
                                </div>
                                <Badge variant={submission ? 'success' : 'warning'}>{submission ? 'Submitted' : 'Pending'}</Badge>
                            </div>

                            <div className="flex-1">
                                <h4 className="text-2xl font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors uppercase">{task.title}</h4>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{task.batchName}</span>
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
                                            <p className="text-[9px] font-black uppercase opacity-60">Result</p>
                                            <p className="text-xs font-black">{submission?.grade || 'Awaiting Eval'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                {!submission ? (
                                    <Button
                                        variant="primary"
                                        className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 group"
                                        onClick={() => { setSelectedAssignment(task); setShowSubmitModal(true); }}
                                    >
                                        Open Submission Portal <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                ) : (
                                    <Button variant="secondary" className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 border-emerald-500/10 bg-emerald-50/20 text-emerald-600 cursor-default">
                                        <CheckCircle2 size={14} className="mr-2" /> Synced with Server
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Upload Submission">
                <div className="space-y-8">
                    <div className="space-y-1">
                        <h4 className="text-lg font-black text-slate-800">{selectedAssignment?.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Submission • Encrypted Upload</p>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center bg-slate-50 cursor-pointer hover:bg-white hover:border-indigo-400 transition-all group" onClick={handleSubmit}>
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-slate-300 group-hover:text-indigo-600 shadow-sm mb-4 transition-all group-hover:scale-110">
                            <Upload size={32} />
                        </div>
                        <p className="text-sm font-black text-slate-700">Click to confirm final upload</p>
                    </div>
                </div>
            </Modal>

            {showSuccess && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-top-full duration-500">
                    <Card className="!bg-emerald-600 !text-white border-none py-4 px-10 flex items-center space-x-4 shadow-[0_20px_40px_rgba(5,150,105,0.3)]">
                        <CheckCircle2 size={24} />
                        <span className="text-sm font-black uppercase tracking-widest">Marked for Evaluation!</span>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Assignments;
