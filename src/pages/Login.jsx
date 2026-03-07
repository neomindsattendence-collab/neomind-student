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
            setError('ACCESS DENIED. PLEASE VERIFY CREDENTIALS.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-orange-500/30">
            <div className="max-w-md w-full relative">
                {/* Glow Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Logo Container */}
                <div className="text-center mb-12 relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(234,88,12,0.3)] transform rotate-12 hover:rotate-0 transition-transform duration-500 group">
                        <Rocket className="text-white transform group-hover:scale-110 transition-transform" size={48} />
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3 italic uppercase">NEOMINDS</h1>
                    <div className="flex items-center justify-center space-x-3">
                        <div className="h-px w-8 bg-orange-500/50"></div>
                        <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">SCHOLAR TERMINAL v2.0</p>
                        <div className="h-px w-8 bg-orange-500/50"></div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 border border-white/10 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>

                    <div className="relative z-10">
                        <div className="mb-10 text-center">
                            <h2 className="text-xl font-black text-white mb-3 uppercase tracking-widest leading-none">Authentication Required</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em]">Establishing secure uplink for academy scholars</p>
                        </div>

                        {error && (
                            <div className="mb-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-4 py-5 px-8 bg-white text-black hover:bg-orange-500 hover:text-white rounded-[1.5rem] transition-all duration-500 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-[0_0_30px_rgba(255,255,255,0.1)] group font-black uppercase text-xs tracking-[0.2em]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Chrome size={18} />
                                    <span>Sync with Google Account</span>
                                </>
                            )}
                        </button>

                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center space-y-4">
                            <div className="flex items-center space-x-2 text-emerald-500">
                                <ShieldCheck size={14} className="animate-pulse" />
                                <span className="text-[10px] uppercase tracking-widest font-black">Secure Gateway Active</span>
                            </div>
                            <div className="flex space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500/20"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-12 text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
                    Academic Integrity Verified
                </p>
            </div>
        </div>
    );
};

export default Login;
