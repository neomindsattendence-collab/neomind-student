import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export const Card = ({ children, className = '', title, subtitle, ...props }) => (
    <div className={`bg-[#050505]/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden transition-all duration-700 hover:border-orange-500/20 shadow-2xl relative group/card ${className}`} {...props}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-[60px] opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
        {(title || subtitle) && (
            <div className="px-10 py-10 border-b border-white/5 bg-white/[0.01]">
                <div>
                    {title && <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase underline decoration-orange-600/30">{title}</h3>}
                    {subtitle && <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] mt-3 italic">{subtitle}</p>}
                </div>
            </div>
        )}
        <div className="p-10 sm:p-12 relative z-10">
            {children}
        </div>
    </div>
);

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    loading = false,
    ...props
}) => {
    const variants = {
        primary: 'bg-orange-600 text-white hover:bg-orange-500 shadow-[0_15px_40px_rgba(234,88,12,0.3)] border border-orange-500/20',
        secondary: 'bg-white/[0.02] text-slate-400 border border-white/5 hover:bg-white/5 hover:text-white shadow-xl',
        danger: 'bg-rose-600/10 text-rose-500 border border-rose-500/10 hover:bg-rose-600 hover:text-white shadow-lg',
        success: 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/10 hover:bg-emerald-600 hover:text-white shadow-lg',
        ghost: 'bg-transparent text-slate-700 hover:bg-white/[0.03] hover:text-white border border-transparent hover:border-white/5',
    };

    const sizes = {
        sm: 'px-6 py-3 text-[9px] font-black uppercase tracking-[0.15em] italic',
        md: 'px-10 py-5 text-[10px] font-black uppercase tracking-[0.25em] italic',
        lg: 'px-14 py-6 text-xs font-black uppercase tracking-[0.35em] italic',
    };

    return (
        <button
            onClick={onClick}
            disabled={loading || props.disabled}
            className={`inline-flex items-center justify-center rounded-[1.5rem] transition-all duration-500 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed group whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-4 shadow-2xl shadow-white/50"></div>
            ) : null}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
    const variants = {
        neutral: 'bg-white/[0.03] text-slate-600 border border-white/5',
        success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
        warning: 'bg-orange-500/10 text-orange-500 border border-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
        danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
        blue: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]',
        live: 'bg-rose-600 text-white animate-pulse shadow-[0_0_25px_rgba(225,29,72,0.5)] border border-rose-400/30',
    };

    return (
        <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] leading-none italic ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050505]/80 backdrop-blur-3xl animate-in fade-in duration-700">
            <div className="bg-[#080808] rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/5 relative group/modal">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-2 bg-orange-600/20 blur-xl"></div>
                <div className="px-12 py-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div>
                        <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase">{title}</h3>
                        <div className="w-12 h-1 bg-orange-600 mt-2 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.5)]"></div>
                    </div>
                    <button onClick={onClose} className="text-slate-700 hover:text-white p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-12">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Input = ({ label, error, ...props }) => (
    <div className="space-y-4 w-full group/input">
        {label && <label className="block text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] ml-3 italic group-focus-within/input:text-orange-500 transition-colors">{label}</label>}
        <div className="relative">
            <input
                {...props}
                className={`w-full px-8 py-5 bg-white/[0.01] border border-white/5 rounded-2xl focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.03] transition-all font-black text-[12px] uppercase tracking-widest italic text-white placeholder:text-slate-800 shadow-inner ${error ? 'border-rose-500/40' : ''}`}
            />
            <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
        </div>
        {error && <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest ml-3 italic animate-pulse">{error}</p>}
    </div>
);

export const Skeleton = ({ className = '', circle = false }) => (
    <div className={`animate-pulse bg-white/[0.02] shadow-inner ${circle ? 'rounded-full' : 'rounded-3xl'} ${className}`}></div>
);

export const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 8000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: 'bg-[#0a0a0a] text-emerald-500 border border-emerald-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.1)]',
        error: 'bg-[#0a0a0a] text-rose-500 border border-rose-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(225,29,72,0.1)]',
        info: 'bg-[#0a0a0a] text-orange-500 border border-orange-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(234,88,12,0.1)]',
    };

    const icons = {
        success: <CheckCircle2 size={24} className="animate-bounce" />,
        error: <AlertCircle size={24} className="animate-pulse" />,
        info: <Info size={24} className="animate-pulse" />,
    };

    return (
        <div className={`fixed bottom-12 right-12 z-[200] flex items-center gap-8 px-10 py-6 rounded-[2rem] shadow-2xl animate-in slide-in-from-right-full duration-1000 backdrop-blur-3xl ${styles[type]}`}>
            <div className="flex-shrink-0">{icons[type]}</div>
            <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Scholar Protocol</p>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] italic text-white">{message}</p>
            </div>
            <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-xl transition-all ml-6 text-slate-700 hover:text-white border border-transparent hover:border-white/5"><X size={16} /></button>
        </div>
    );
};

export const EmptyState = ({ icon: Icon, title, message }) => (
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-10 group/empty">
        <div className="w-32 h-32 bg-white/[0.01] text-slate-800 rounded-[3.5rem] flex items-center justify-center border border-white/5 shadow-inner group-hover/empty:scale-110 group-hover/empty:border-orange-500/20 transition-all duration-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.02] animate-pulse"></div>
            <div className="relative z-10">
                {Icon ? <Icon size={64} strokeWidth={1} className="group-hover/empty:rotate-12 transition-transform duration-700" /> : <Info size={64} strokeWidth={1} />}
            </div>
        </div>
        <div className="space-y-4">
            <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic group-hover/empty:text-orange-500 transition-colors uppercase underline decoration-orange-600/20">{title || 'Registry Silent'}</h4>
            <p className="text-[10px] font-black text-slate-700 mt-4 max-w-xs mx-auto leading-relaxed uppercase tracking-[0.25em] italic">{message || 'No data packets synchronized in this registry entry.'}</p>
        </div>
    </div>
);
