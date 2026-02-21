import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    serverTimestamp
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const SessionContext = createContext();

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const SessionProvider = ({ children }) => {
    const { user, userDoc } = useAuth();
    const [liveSessions, setLiveSessions] = useState({}); // { batchId: { sessionId, ...data } }
    const [sessionStatus, setSessionStatus] = useState('OFFLINE');
    const [activeSession, setActiveSession] = useState(null);
    const [duration, setDuration] = useState(0);

    // Timer logic remains same
    useEffect(() => {
        let interval;
        if (sessionStatus === 'JOINED') {
            interval = setInterval(() => setDuration(prev => prev + 1), 1000);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [sessionStatus]);

    // 🎓 STUDENT FLOW: Live Real-time Listener on assigned batches
    useEffect(() => {
        if (!userDoc?.assignedBatches?.length) return;

        const unsubscribes = userDoc.assignedBatches.map(batchId => {
            const batchRef = doc(db, 'batches', batchId);

            return onSnapshot(batchRef, (snap) => {
                if (snap.exists()) {
                    const batchData = snap.data();
                    const activeId = batchData.activeSessionId;

                    if (activeId) {
                        // We found a live session! Now listen to the session document itself
                        const sessionRef = doc(db, 'batches', batchId, 'sessions', activeId);
                        onSnapshot(sessionRef, (sSnap) => {
                            if (sSnap.exists() && sSnap.data().isLive) {
                                setLiveSessions(prev => ({
                                    ...prev,
                                    [batchId]: {
                                        id: activeId,
                                        batchId,
                                        name: batchData.name,
                                        ...sSnap.data()
                                    }
                                }));
                            } else {
                                setLiveSessions(prev => {
                                    const next = { ...prev };
                                    delete next[batchId];
                                    return next;
                                });
                            }
                        });
                    } else {
                        setLiveSessions(prev => {
                            const next = { ...prev };
                            delete next[batchId];
                            return next;
                        });
                    }
                }
            });
        });

        return () => unsubscribes.forEach(u => u());
    }, [userDoc]);

    // 🎓 STUDENT ACTION: Join Session Protocol
    const joinSession = async (session) => {
        if (!session || !user) return;

        try {
            const sessionRef = doc(db, "batches", session.batchId, "sessions", session.id);

            // Mandatory update: add self to joinedStudents pool
            await updateDoc(sessionRef, {
                joinedStudents: arrayUnion(user.uid)
            });

            setActiveSession(session);
            setSessionStatus('JOINED');
        } catch (err) {
            console.error("Join Protocol Error:", err);
        }
    };

    const leaveSession = () => {
        setSessionStatus('OFFLINE');
        setActiveSession(null);
    };

    const isAnyLive = Object.keys(liveSessions).length > 0;
    const currentLiveSession = Object.values(liveSessions)[0];

    return (
        <SessionContext.Provider value={{
            liveSessions,
            isAnyLive,
            sessionStatus,
            activeSession,
            activeBatch: activeSession?.name || currentLiveSession?.name || 'Class Session',
            stats: { duration },
            joinSession,
            leaveSession
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
