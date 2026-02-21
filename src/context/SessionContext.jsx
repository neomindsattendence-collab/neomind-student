import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    arrayUnion,
    serverTimestamp
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

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
    const [liveSessions, setLiveSessions] = useState({});
    const [sessionStatus, setSessionStatus] = useState('OFFLINE');
    const [activeSession, setActiveSession] = useState(null);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);

    // Real-time listener for active sessions across all assigned batches
    useEffect(() => {
        if (!userDoc?.assignedBatches?.length) return;

        const unsubscribes = userDoc.assignedBatches.map(batchId => {
            const sessionsRef = collection(db, "batches", batchId, "sessions");
            const q = query(sessionsRef, where("status", "==", "live"));

            return onSnapshot(q, (snapshot) => {
                setLiveSessions(prev => {
                    const newSessions = { ...prev };
                    if (!snapshot.empty) {
                        newSessions[batchId] = { id: snapshot.docs[0].id, batchId, ...snapshot.docs[0].data() };
                    } else {
                        delete newSessions[batchId];
                    }
                    return newSessions;
                });
            });
        });

        return () => unsubscribes.forEach(unsub => unsub());
    }, [userDoc]);

    const joinSession = async (session) => {
        if (!navigator.geolocation) {
            setLocationError("GPS Hardware Not Detected.");
            return;
        }

        setIsVerifying(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const distance = calculateDistance(
                    latitude, longitude,
                    session.location.lat, session.location.lng
                );

                // Tolerance Band: +20m added to teacher's set radius
                const allowedRadius = (session.radius || 100) + 20;

                if (distance <= allowedRadius) {
                    try {
                        // Record check-in in Firestore
                        const checkinRef = doc(db, "batches", session.batchId, "sessions", session.id, "checkins", user.uid);
                        await setDoc(checkinRef, {
                            uid: user.uid,
                            name: userDoc?.name || user.email,
                            timestamp: serverTimestamp(),
                            distance: Math.round(distance)
                        });

                        setActiveSession(session);
                        setSessionStatus('JOINED');
                        setShowJoinModal(false);
                        setLocationError(null);
                    } catch (err) {
                        console.error("Check-in error:", err);
                        setLocationError("Security sync failed. Try again.");
                    }
                } else {
                    setLocationError(`Outside academic radius (${Math.round(distance)}m away)`);
                }
                setIsVerifying(false);
            },
            (error) => {
                setIsVerifying(false);
                setLocationError("Location authorization required for attendance.");
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    };

    const leaveSession = () => {
        setSessionStatus('OFFLINE');
        setActiveSession(null);
    };

    const isAnyLive = Object.keys(liveSessions).length > 0;

    return (
        <SessionContext.Provider value={{
            liveSessions,
            isAnyLive,
            sessionStatus,
            activeSession,
            showJoinModal,
            setShowJoinModal,
            locationError,
            isVerifying,
            joinSession,
            leaveSession
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
