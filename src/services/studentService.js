import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    onSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// --- 1. SESSIONS ---

export const listenToLiveSession = (batchId, callback) => {
    const sessionsRef = collection(db, 'batches', batchId, 'sessions');
    const q = query(sessionsRef, where('status', '==', 'live'));
    return onSnapshot(q, (snapshot) => {
        const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(sessions[0] || null); // Return the first live session found
    });
};

// --- 2. ATTENDANCE ---

export const getMyAttendance = async (batchId, studentUid) => {
    const attendanceRef = collection(db, 'batches', batchId, 'attendance');
    const snapshot = await getDocs(attendanceRef);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            sessionId: doc.id,
            present: data.presentStudents?.includes(studentUid),
            markedAt: data.markedAt
        };
    });
};

// --- 3. NOTES ---

export const getBatchNotes = (batchId, callback) => {
    const notesRef = collection(db, 'batches', batchId, 'notes');
    const q = query(notesRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, snapshot => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};

// --- 4. ASSIGNMENTS & SUBMISSIONS ---

export const getBatchAssignments = (batchId, callback) => {
    const assignmentsRef = collection(db, 'batches', batchId, 'assignments');
    return onSnapshot(assignmentsRef, snapshot => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};

export const submitAssignment = async (batchId, assignmentId, studentUid, submissionData) => {
    const submissionRef = doc(db, 'batches', batchId, 'assignments', assignmentId, 'submissions', studentUid);
    await setDoc(submissionRef, {
        ...submissionData,
        studentUid,
        submittedAt: serverTimestamp()
    });
};

export const getMySubmission = async (batchId, assignmentId, studentUid) => {
    const submissionRef = doc(db, 'batches', batchId, 'assignments', assignmentId, 'submissions', studentUid);
    const snap = await getDoc(submissionRef);
    return snap.exists() ? snap.data() : null;
};
