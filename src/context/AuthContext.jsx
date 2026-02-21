import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase/firebaseConfig';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import {
    doc,
    onSnapshot,
    getDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userDoc, setUserDoc] = useState(null);
    const [loading, setLoading] = useState(true);

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => signOut(auth);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userRef = doc(db, 'users', currentUser.uid);

                // Initial check and creation if missing
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        name: currentUser.displayName || currentUser.email.split('@')[0],
                        photoURL: currentUser.photoURL,
                        role: "student",
                        assignedBatches: [],
                        createdAt: serverTimestamp()
                    });
                }

                // Real-time synchronization
                const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserDoc(docSnap.data());
                    }
                    setLoading(false);
                });

                return () => unsubscribeDoc();
            } else {
                setUser(null);
                setUserDoc(null);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const value = {
        user,
        userDoc,
        loading,
        loginWithGoogle,
        logout,
        isStudent: userDoc?.role === 'student',
        isTeacher: userDoc?.role === 'teacher',
        isAdmin: userDoc?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
