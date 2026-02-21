import React from 'react';
import { Sparkles, Info, LogOut } from 'lucide-react';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

const PendingAssignment = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full text-center">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Sparkles className="text-indigo-600" size={48} />
                </div>

                <h1 className="text-3xl font-black text-slate-800 mb-4">Almost There!</h1>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    You've successfully joined <span className="font-bold text-indigo-600">NeoMinds Academy</span>.
                    Our admins are currently setting up your virtual classroom.
                </p>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 mb-8">
                    <div className="flex items-start space-x-4 text-left">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Info size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-1">Enrolled Batches</h3>
                            <p className="text-sm text-slate-500">
                                Once an admin assigns you to a batch, you will see your courses, notes, and attendance tracking right here.
                                Please check back soon or contact support if you believe there is a delay.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200"
                    >
                        Refresh Dashboard
                    </button>
                    <button
                        onClick={() => signOut(auth)}
                        className="flex items-center space-x-2 px-8 py-3 text-slate-500 hover:text-slate-800 font-bold transition-all"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>

                <p className="mt-12 text-sm text-slate-400 font-medium tracking-wide italic">
                    "The future belongs to those who learn more skills."
                </p>
            </div>
        </div>
    );
};

export default PendingAssignment;
