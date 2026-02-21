import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export const Card = ({ children, className = '', title, subtitle, ...props }) => (
    <div className={`bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden ${className}`} {...props}>
        {(title || subtitle) && (
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div>
                    {title && <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>}
                    {subtitle && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
                </div>
            </div>
        )}
        <div className="p-8">
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
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100',
        secondary: 'bg-white text-slate-700 border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30',
        danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-100',
        success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100',
        ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800',
    };

    const sizes = {
        sm: 'px-4 py-2 text-[10px] font-black uppercase tracking-widest',
        md: 'px-6 py-3.5 text-xs font-black uppercase tracking-widest',
        lg: 'px-8 py-5 text-sm font-black uppercase tracking-widest',
    };

    return (
        <button
            onClick={onClick}
            disabled={loading || props.disabled}
            className={`inline-flex items-center justify-center rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            {children}
        </button>
    );
};

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
    const variants = {
        neutral: 'bg-slate-100 text-slate-500',
        success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
        warning: 'bg-amber-50 text-amber-600 border border-amber-100',
        danger: 'bg-rose-50 text-rose-600 border border-rose-100',
        blue: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
        live: 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-200',
    };

    return (
        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest leading-none ${variants[variant]} ${className}`}>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 border border-white/20">
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{title}</h3>
                    <button onClick={onClose} className="text-slate-300 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-all">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Input = ({ label, error, ...props }) => (
    <div className="space-y-2 w-full">
        {label && <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
        <div className="relative">
            <input
                {...props}
                className={`w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-bold text-sm placeholder:text-slate-300 ${error ? 'border-rose-300 focus:border-rose-500' : ''}`}
            />
        </div>
        {error && <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest ml-1">{error}</p>}
    </div>
);

export const Skeleton = ({ className = '', circle = false }) => (
    <div className={`animate-pulse bg-slate-100 ${circle ? 'rounded-full' : 'rounded-2xl'} ${className}`}></div>
);

export const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: 'bg-emerald-600 text-white shadow-emerald-200',
        error: 'bg-rose-600 text-white shadow-rose-200',
        info: 'bg-indigo-600 text-white shadow-indigo-200',
    };

    const icons = {
        success: <CheckCircle2 size={18} />,
        error: <AlertCircle size={18} />,
        info: <Info size={18} />,
    };

    return (
        <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-full duration-500 ${styles[type]}`}>
            {icons[type]}
            <p className="text-xs font-black uppercase tracking-widest">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-all"><X size={14} /></button>
        </div>
    );
};

export const EmptyState = ({ icon: Icon, title, message }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center">
            {Icon ? <Icon size={40} /> : <Info size={40} />}
        </div>
        <div>
            <h4 className="text-lg font-black text-slate-800">{title || 'No data protocol found'}</h4>
            <p className="text-sm font-bold text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">{message || 'This parameters is currently empty within the cloud synchronizer.'}</p>
        </div>
    </div>
);
