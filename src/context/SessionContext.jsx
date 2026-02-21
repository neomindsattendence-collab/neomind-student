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
    serverTimestamp,
    getDoc
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

    // Timer logic
    useEffect(() => {
        let interval;
        if (sessionStatus === 'JOINED') {
            interval = setInterval(() => setDuration(prev => prev + 1), 1000);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [sessionStatus]);

    // 🎓 STUDENT FLOW: Live Geofence Discovery
    useEffect(() => {
        if (!userDoc?.assignedBatches?.length) return;

        const unsubscribes = userDoc.assignedBatches.map(batchId => {
            const batchRef = doc(db, 'batches', batchId);

            return onSnapshot(batchRef, (snap) => {
                if (snap.exists()) {
                    const batchData = snap.data();
                    const activeId = batchData.activeSessionId;

                    if (!activeId) {
                        setLiveSessions(prev => {
                            const next = { ...prev };
                            delete next[batchId];
                            return next;
                        });

                        if (activeSession?.batchId === batchId && sessionStatus === 'JOINED') {
                            setSessionStatus('OFFLINE');
                            setActiveSession(null);
                            alert("Session Ended: Presence protocol terminated by instructor.");
                        }
                        return;
                    }

                    // Listen to root session doc
                    const sessionRef = doc(db, 'sessions', activeId);
                    onSnapshot(sessionRef, (sSnap) => {
                        if (sSnap.exists() && sSnap.data().status === 'active') {
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
                }
            });
        });

        return () => unsubscribes.forEach(u => u());
    }, [userDoc, activeSession?.batchId, sessionStatus]);

    const joinSession = async (session) => {
        if (!session || !user) return;

        if (!navigator.geolocation) {
            alert("Protocol Violation: Hardware location services required.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                const distance = getDistanceMeters(
                    latitude, longitude,
                    session.geoCenter.lat, session.geoCenter.lng
                );

                if (distance > session.radius) {
                    alert(`GEOFENCE BREACH: You are ${Math.round(distance)}m away. Max radius is ${session.radius}m.`);
                    return;
                }

                // 📡 PRESENCE PROTOCOL: Write to session sub-collection
                const presenceRef = doc(db, "sessions", session.id, "presence", user.uid);
                await setDoc(presenceRef, {
                    uid: user.uid,
                    name: userDoc.name,
                    lat: latitude,
                    lng: longitude,
                    insideRadius: true,
                    joinedAt: serverTimestamp()
                });

                setActiveSession(session);
                setSessionStatus('JOINED');
            } catch (err) {
                console.error("Presence registration failed:", err);
            }
        }, null, { enableHighAccuracy: true });
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
            activeBatch: activeSession?.name || currentLiveSession?.name || 'Academic Session',
            stats: { duration },
            joinSession,
            leaveSession
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
