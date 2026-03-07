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
    Download,
    Eye
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
import { forceDownload, openFile } from '../services/fileService';

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
        if (file) {
            console.log("Student Submission Selection:", file);
            if (file.size === 0) {
                alert("Security Breach: Attempted upload of 0-byte binary. Operation Refused.");
                return;
            }
            if (file.type === "application/pdf") {
                setSelectedFile(file);
            } else {
                alert("Security Protocol: Only PDF files are permitted for technical submissions.");
            }
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
            console.log("Synchronizing Student Submission Payload:", {
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type
            });

            if (selectedFile.size === 0) {
                throw new Error("Empty technical payload detected. Protocol aborted.");
            }

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
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase italic">Task Hub</h1>
                    <p className="text-slate-500 font-bold mt-4 uppercase tracking-[0.3em] text-[10px] italic">Manage your technical submissions & deadlines</p>
                </div>
            </div>

            <Card className="bg-black border border-white/5 text-white p-12 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="space-y-6 text-left">
                        <Badge variant="warning" className="px-6 py-2 tracking-[0.2em] font-black italic">TASK FREQUENCY PROTOCOL</Badge>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase italic">Stay Ahead. <br /><span className="text-orange-500">Synchronize</span> your pending tasks.</h2>
                    </div>
                    <div className="flex gap-6">
                        <div className="text-center bg-white/[0.03] p-8 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group/item">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent pointer-events-none"></div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 italic relative z-10">Active Flux</p>
                            <p className="text-5xl font-black tabular-nums text-white italic relative z-10">{pendingCount}</p>
                        </div>
                        <div className="text-center bg-white/[0.03] p-8 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group/item">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent pointer-events-none"></div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 italic relative z-10">Archived</p>
                            <p className="text-5xl font-black tabular-nums text-emerald-500 italic relative z-10">{submittedCount}</p>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {assignments.map((task) => {
                    const submission = submissions[task.id];
                    return (
                        <Card key={task.id} className="group hover:border-orange-500/30 transition-all duration-700 shadow-none border border-white/5 bg-white/[0.02] p-10 h-fit flex flex-col relative overflow-hidden">
                            <div className="absolute -right-8 -top-8 p-10 opacity-[0.02] group-hover:opacity-[0.05] group-hover:rotate-6 transition-all duration-1000">
                                <ClipboardCheck size={200} className="text-orange-500" />
                            </div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="p-4 bg-white/[0.03] text-slate-500 rounded-2xl group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-500 border border-white/5 transition-all duration-700 shadow-inner italic">
                                    <ClipboardCheck size={28} />
                                </div>
                                <div className="flex gap-3">
                                    {submission && (
                                        <>
                                            <button
                                                onClick={() => openFile(submission.fileUrl)}
                                                className="p-3 bg-white/[0.05] text-slate-500 hover:text-white rounded-xl transition-all duration-500 border border-white/5 shadow-xl italic"
                                                title="View Submission"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => forceDownload(submission.fileUrl, `Submission_${task.title}.pdf`)}
                                                className="p-3 bg-white/[0.05] text-slate-500 hover:text-white rounded-xl transition-all duration-500 border border-white/5 shadow-xl italic"
                                                title="Download Submission"
                                            >
                                                <Download size={18} />
                                            </button>
                                        </>
                                    )}
                                    <Badge variant={submission ? 'success' : 'warning'} className="px-5 py-2 uppercase tracking-widest">{submission ? 'SYNCED' : 'PENDING'}</Badge>
                                </div>
                            </div>

                            <div className="flex-1 relative z-10">
                                <h4 className="text-3xl font-black text-white tracking-tighter group-hover:text-orange-500 transition-all duration-700 uppercase italic leading-none">{task.title}</h4>
                                <div className="flex items-center gap-3 mt-4">
                                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] italic">{task.batchName}</span>
                                </div>

                                <div className="mt-10 grid grid-cols-2 gap-8 p-8 bg-white/[0.03] rounded-[2rem] border border-white/5 shadow-inner">
                                    <div className="flex items-center space-x-4 text-slate-500 italic">
                                        <div className="p-2.5 bg-white/[0.05] rounded-xl border border-white/5"><Clock size={16} className="text-orange-500" /></div>
                                        <div className="leading-tight">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Frequency End</p>
                                            <p className="text-xs font-black text-white mt-1 tabular-nums">{task.dueDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4 text-slate-500 italic">
                                        <div className="p-2.5 bg-white/[0.05] rounded-xl border border-white/5"><MonitorCheck size={16} className="text-emerald-500" /></div>
                                        <div className="leading-tight">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Terminal Grade</p>
                                            <p className="text-xs font-black text-white mt-1 uppercase tracking-widest">{submission?.grade || 'Awaiting Evaluator'}</p>
                                        </div>
                                    </div>
                                </div>
                                {task.fileUrl && (
                                    <div className="flex gap-4 mt-6 text-[10px] font-black uppercase tracking-[0.2em] italic">
                                        <button
                                            onClick={() => openFile(task.fileUrl)}
                                            className="flex-1 flex items-center justify-center space-x-3 py-4 bg-white/[0.03] text-slate-500 rounded-xl hover:bg-white/[0.06] hover:text-white transition-all duration-500 border border-white/5 shadow-xl"
                                        >
                                            <Eye size={16} />
                                            <span>Open Prompt</span>
                                        </button>
                                        <button
                                            onClick={() => forceDownload(task.fileUrl, `Assignment_${task.title}.pdf`)}
                                            className="flex-1 flex items-center justify-center space-x-3 py-4 bg-white/[0.03] text-slate-500 rounded-xl hover:bg-white/[0.06] hover:text-white transition-all duration-500 border border-white/5 shadow-xl"
                                        >
                                            <Download size={16} />
                                            <span>Download</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-10 relative z-10">
                                {!submission ? (
                                    <Button
                                        variant="primary"
                                        className="w-full py-5 rounded-2xl shadow-2xl shadow-orange-500/20 group"
                                        onClick={() => { setSelectedAssignment(task); setShowSubmitModal(true); }}
                                    >
                                        Open Synchronization Portal <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform duration-500" />
                                    </Button>
                                ) : (
                                    <div className="w-full py-5 rounded-2xl bg-white/[0.05] border border-white/5 text-emerald-500 flex items-center justify-center italic font-black text-[10px] uppercase tracking-[0.3em] shadow-inner">
                                        <CheckCircle2 size={18} className="mr-3" /> Operational Link Secure
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Modal isOpen={showSubmitModal} onClose={() => { if (!isSubmitting) setShowSubmitModal(false); }} title="Transmission Protocol">
                <form className="space-y-10 py-4" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedAssignment?.title}</h4>
                        <div className="flex items-center gap-3">
                            <Badge variant="blue" className="bg-white/5 border-white/10">{selectedAssignment?.batchName}</Badge>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">Sector: Neural Unit</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Digital Payload (PDF SECURE BINARY)</label>
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
                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] p-16 cursor-pointer transition-all duration-700 relative overflow-hidden ${selectedFile ? 'bg-orange-600/10 border-orange-500/40 text-orange-500 shadow-2xl' : 'bg-white/[0.02] border-white/5 text-slate-600 group-hover:border-orange-500/30 group-hover:bg-white/[0.04]'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <UploadCloud size={64} className={`${selectedFile ? "text-orange-500" : "text-slate-800 group-hover:text-orange-500/30"} transition-all duration-700`} />
                                <p className="text-sm font-black uppercase mt-8 italic text-center px-6 relative z-10">{selectedFile ? selectedFile.name : "Select Encrypted PDF Payload"}</p>
                                <p className="text-[10px] font-bold opacity-40 mt-3 italic uppercase tracking-widest relative z-10">Security Constraint: 15MB MAX</p>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-6 pt-6 relative z-10">
                        <Button
                            variant="secondary"
                            className="flex-1 py-5 rounded-2xl bg-white/5 border-white/10 text-slate-500"
                            type="button"
                            onClick={() => setShowSubmitModal(false)}
                            disabled={isSubmitting}
                        >
                            Abort Signal
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-2 py-5 rounded-2xl shadow-2xl shadow-orange-500/20"
                            type="submit"
                            loading={isSubmitting}
                            disabled={!selectedFile}
                        >
                            {isSubmitting ? "Encrypting Stream..." : "Initiate Synchronization"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {showSuccess && (
                <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-full duration-1000">
                    <Card className="!bg-[#0a0a0a] !text-white border-orange-500/30 border py-6 px-16 flex items-center space-x-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-[2.5rem] backdrop-blur-3xl">
                        <div className="p-3 bg-orange-600 rounded-2xl shadow-[0_0_20px_rgba(234,88,12,0.4)] animate-pulse">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <span className="text-lg font-black uppercase tracking-[0.2em] italic text-white leading-none block">Protocol Synchronized!</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mt-2 block">Global Registry Updated In Real-Time</span>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Assignments;
