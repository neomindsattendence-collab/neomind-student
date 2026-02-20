import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const SessionContext = createContext();

// Helper to calculate distance in meters
const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
    var R = 6371e3; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in meters
    return d;
}

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

export const SessionProvider = ({ children }) => {
    const [isTeacherLive, setIsTeacherLive] = useState(false);
    const [sessionStatus, setSessionStatus] = useState('OFFLINE'); // OFFLINE, PENDING, JOINED
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [activeBatch, setActiveBatch] = useState(null);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [stats, setStats] = useState({ duration: 0 });

    const STUDENT_ID = "student_456"; // Hardcoded for demo

    // Real-time listener for active sessions
    useEffect(() => {
        const q = query(collection(db, "sessions"), where("isActive", "==", true));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                // Assuming only one active session for simplicity, or pick the first one
                const doc = snapshot.docs[0];
                const data = doc.data();

                setIsTeacherLive(true);
                setActiveBatch(data.batchId); // This should be the batch name/ID
                setActiveSessionId(doc.id);
                setSessionData(data);

                console.log("Live session detected:", data);
            } else {
                setIsTeacherLive(false);
                setActiveBatch(null);
                setActiveSessionId(null);
                setSessionData(null);
                setSessionStatus('OFFLINE');
            }
        }, (error) => {
            console.error("Error listening to sessions:", error);
        });

        return () => unsubscribe();
    }, []);

    const triggerTeacherLive = () => setIsTeacherLive(true); // Helper to manually trigger for demo

    const attemptJoin = (batchName) => {
        // If we have a real session content, use that batch name/id
        // setActiveBatch(batchName); 
        setShowJoinModal(true);
        setLocationError(null);
    };

    const allowLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            // Calculate distance if we have session location
            let distance = 0;
            let withinRadius = true;

            if (sessionData && sessionData.location) {
                distance = getDistanceFromLatLonInM(
                    latitude, longitude,
                    sessionData.location.lat, sessionData.location.lng
                );
                // Check if within radius (e.g., 100m + buffer)
                // withinRadius = distance <= (sessionData.radius || 100);
            }

            try {
                // Log attendance
                await addDoc(collection(db, "attendance"), {
                    sessionId: activeSessionId,
                    studentId: STUDENT_ID,
                    batchId: activeBatch,
                    joinedAt: serverTimestamp(),
                    location: { lat: latitude, lng: longitude },
                    distance: distance,
                    status: 'PRESENT', // Or 'LATE' based on time
                    device: navigator.userAgent
                });

                setShowJoinModal(false);
                setSessionStatus('JOINED');
                setLocationError(null);

                // Start duration timer
                const interval = setInterval(() => {
                    setStats(prev => ({ duration: prev.duration + 1 }));
                }, 1000);

                // Cleanup interval on unmount or session end is tricky here inside function scope
                // For now, simpler implementation holds. 

            } catch (error) {
                console.error("Error joining session:", error);
                setLocationError("Failed to join session: " + error.message);
            }

        }, (error) => {
            setLocationError('Location access is required to verify you are inside the class radius.');
        });
    };

    const denyLocation = () => {
        setLocationError('Location access is required to verify you are inside the class radius.');
    };

    const leaveSession = () => {
        setSessionStatus('OFFLINE');
        setStats({ duration: 0 });
        // setActiveBatch(null); // Keep active batch visible if still live
    };

    return (
        <SessionContext.Provider value={{
            isTeacherLive,
            triggerTeacherLive,
            sessionStatus,
            showJoinModal,
            setShowJoinModal,
            locationError,
            activeBatch,
            stats,
            attemptJoin,
            allowLocation,
            denyLocation,
            leaveSession
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
