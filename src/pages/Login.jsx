import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase/firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { Rocket, ShieldCheck, Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-200 transform rotate-12">
                        <Rocket className="text-white -rotate-12" size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">NeoMinds Student</h1>
                    <p className="text-slate-500 font-medium">Your journey to mastery starts here</p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-10 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>

                    <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Student Portal</h2>
                            <p className="text-slate-500 text-sm">Sign in with Google to access your batches and learning materials</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-4 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 shadow-xl shadow-slate-900/10 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Chrome size={20} className="group-hover:text-indigo-400 transition-colors" />
                                    <span className="font-bold tracking-wide">Continue to Learning</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
