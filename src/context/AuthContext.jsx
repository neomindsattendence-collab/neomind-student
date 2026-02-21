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
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                setUser(null);
                setUserDoc(null);
                setLoading(false);
                return;
            }

            setUser(currentUser);
            const userRef = doc(db, 'users', currentUser.uid);

            const unsubscribeDoc = onSnapshot(userRef, async (docSnap) => {
                if (!docSnap.exists()) {
                    // Create user document if missing
                    await setDoc(userRef, {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        name: currentUser.displayName || currentUser.email.split('@')[0],
                        photoURL: currentUser.photoURL,
                        role: "student",
                        assignedBatches: [],
                        createdAt: serverTimestamp()
                    });
                    return;
                }

                setUserDoc(docSnap.data());
                setLoading(false);
            });

            return () => unsubscribeDoc();
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
