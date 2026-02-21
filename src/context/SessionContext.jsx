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

function getDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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

                    // 🔥 MANDATORY AUTO-EXIT: If this student is in a session for this batch,
                    // but the batch no longer has an activeSessionId, kick them out.
                    if (!activeId) {
                        setLiveSessions(prev => {
                            const next = { ...prev };
                            delete next[batchId];
                            return next;
                        });

                        setSessionStatus(prev => {
                            if (activeSession?.batchId === batchId && prev === 'JOINED') {
                                alert("Class Session Ended: Academic data synchronized.");
                                return 'OFFLINE';
                            }
                            return prev;
                        });
                        return;
                    }

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
                            // If session document says not live, also remove from banner
                            setLiveSessions(prev => {
                                const next = { ...prev };
                                delete next[batchId];
                                return next;
                            });
                        }
                    });
                }
            });
        });

        return () => unsubscribes.forEach(u => u());
    }, [userDoc, activeSession?.batchId]); // Added activeSession to dependencies for kick-out logic

    // 🎓 STUDENT ACTION: Strict Spatial Join (Final Protocol)
    const joinSession = async (session) => {
        if (!session || !user) return;

        if (!navigator.geolocation) {
            alert("Security Protocol Error: Hardware location service unavailable.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                const distance = getDistanceMeters(
                    latitude, longitude,
                    session.center.lat, session.center.lng
                );

                if (distance > session.radiusMeters) {
                    alert("GEOFENCE BREACH: You are outside the allowed class radius of " + session.radiusMeters + "m.");
                    return;
                }

                const sessionRef = doc(db, "batches", session.batchId, "sessions", session.id);

                // FINAL PROTOCOL: Update map-based students pool
                await updateDoc(sessionRef, {
                    [`students.${user.uid}`]: {
                        lat: latitude,
                        lng: longitude,
                        insideRadius: true,
                        joinedAt: serverTimestamp()
                    }
                });

                setActiveSession(session);
                setSessionStatus('JOINED');
            } catch (err) {
                console.error("Spatial Join Error:", err);
            }
        }, (err) => {
            alert("Geo-Auth Denied: Academic presence requires location authorization.");
        }, { enableHighAccuracy: true });
    };

    // 🔬 OPTIONAL STRONG: Continuous Spatial Monitoring (15s Heartbeat)
    useEffect(() => {
        let heartbeat;
        if (sessionStatus === 'JOINED' && activeSession) {
            heartbeat = setInterval(() => {
                navigator.geolocation.getCurrentPosition(async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const distance = getDistanceMeters(
                        latitude, longitude,
                        activeSession.center.lat, activeSession.center.lng
                    );
                    const isInside = distance <= activeSession.radiusMeters;

                    const sessionRef = doc(db, "batches", activeSession.batchId, "sessions", activeSession.id);
                    await updateDoc(sessionRef, {
                        [`students.${user.uid}.insideRadius`]: isInside,
                        [`students.${user.uid}.lat`]: latitude,
                        [`students.${user.uid}.lng`]: longitude
                    });
                }, null, { enableHighAccuracy: true });
            }, 15000);
        }
        return () => clearInterval(heartbeat);
    }, [sessionStatus, activeSession, user?.uid]);

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
            isTeacherLive: isAnyLive,
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
