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
    Plus,
    UploadCloud,
    ExternalLink
} from 'lucide-react';
import { Card, Button, Badge, Modal, Input } from '../components/Common';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import {
    collection,
    query,
    onSnapshot,
    orderBy,
    doc,
    setDoc,
    serverTimestamp,
    getDoc,
    where
} from 'firebase/firestore';
import { uploadToCloudinary } from '../services/cloudinaryService';

const Assignments = () => {
    const { user, userDoc } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submissions, setSubmissions] = useState({}); // { assignmentId: submissionData }
    const [selectedFile, setSelectedFile] = useState(null);

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
                    return [...others, ...batchAssignments].sort((a, b) => {
                        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
                        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
                        return dateB - dateA;
                    });
                });

                // Listen to student's specific submissions for these assignments
                batchAssignments.forEach(assignment => {
                    const subRef = doc(db, 'batches', batchId, 'assignments', assignment.id, 'submissions', user.uid);
                    onSnapshot(subRef, (subSnap) => {
                        if (subSnap.exists()) {
                            setSubmissions(prev => ({ ...prev, [assignment.id]: subSnap.data() }));
                        }
                    });
                });
            });
        });

        return () => unsubscribes.forEach(unsub => unsub());
    }, [userDoc, batches, user.uid]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            alert("Security Protocol: Only PDF files are permitted for technical submissions.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAssignment || !selectedFile) {
            alert("Submission Refused: PDF payload is missing.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Upload to Cloudinary
            const fileData = await uploadToCloudinary(selectedFile);

            // 2. Save metadata to Firestore
            const subRef = doc(db, 'batches', selectedAssignment.batchId, 'assignments', selectedAssignment.id, 'submissions', user.uid);
            await setDoc(subRef, {
                studentUid: user.uid,
                studentName: userDoc.name,
                fileUrl: fileData.url,
                fileId: fileData.id,
                submittedAt: serverTimestamp(),
                status: 'Grading Pending'
            }, { merge: true });

            setShowSubmitModal(false);
            setSelectedFile(null);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error("Critical Submission Failure:", err);
            alert("Protocol Breach: Synchronization failed. Check your connection.");
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
                    <div className="space-y-4 text-left">
                        <Badge variant="blue" className="bg-indigo-600/30 text-white border-white/20">Task Progress</Badge>
                        <h2 className="text-4xl font-black tracking-tighter leading-none">Stay Ahead. <br /> Finish your pending tasks.</h2>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Pending</p>
                            <p className="text-4xl font-black tabular-nums">{pendingCount}</p>
                        </div>
                        <div className="text-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Completed</p>
                            <p className="text-4xl font-black tabular-nums">{submittedCount}</p>
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
                                <div className="flex gap-2">
                                    {submission && (
                                        <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                    <Badge variant={submission ? 'success' : 'warning'}>{submission ? 'Submitted' : 'Pending'}</Badge>
                                </div>
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
                                            <p className="text-xs font-black">{submission?.grade || 'Evaluator Idle'}</p>
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
                                        <CheckCircle2 size={14} className="mr-2" /> Protocol Synchronized
                                    </Button>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Modal isOpen={showSubmitModal} onClose={() => { if (!isSubmitting) setShowSubmitModal(false); }} title="Upload Submission Protocol">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <h4 className="text-lg font-black text-slate-800">{selectedAssignment?.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target: {selectedAssignment?.batchName}</p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700">Digital Payload (PDF ONLY)</label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                id="submission-file"
                                onChange={handleFileUpload}
                                disabled={isSubmitting}
                            />
                            <label
                                htmlFor="submission-file"
                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-12 cursor-pointer transition-all ${selectedFile ? 'bg-emerald-50 border-emerald-300 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:border-indigo-300 group-hover:bg-indigo-50/20'}`}
                            >
                                <UploadCloud size={48} className={selectedFile ? "text-emerald-500" : "text-slate-300"} />
                                <p className="text-xs font-black uppercase mt-6">{selectedFile ? selectedFile.name : "Select PDF for Encryption & Upload"}</p>
                                <p className="text-[10px] font-bold opacity-60 mt-1 italic">Max Payload: 15MB</p>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            variant="secondary"
                            className="flex-1 py-4 rounded-xl"
                            type="button"
                            onClick={() => setShowSubmitModal(false)}
                            disabled={isSubmitting}
                        >
                            Abort
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 py-4 rounded-xl"
                            type="submit"
                            loading={isSubmitting}
                        >
                            {isSubmitting ? "Encrypting..." : "Execute Submission"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {showSuccess && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-top-full duration-500">
                    <Card className="!bg-emerald-600 !text-white border-none py-4 px-10 flex items-center space-x-4 shadow-[0_20px_40px_rgba(5,150,105,0.3)]">
                        <CheckCircle2 size={24} />
                        <span className="text-sm font-black uppercase tracking-widest text-white">Protocol Synchronized with Evaluator!</span>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Assignments;
