import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Card = ({ children, className, title, subtitle }) => (
    <div className={cn("bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm", className)}>
        {(title || subtitle) && (
            <div className="mb-6">
                {title && <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>}
                {subtitle && <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>}
            </div>
        )}
        {children}
    </div>
);

export const Button = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200',
        secondary: 'bg-white text-slate-700 border-2 border-slate-100 hover:bg-slate-50',
        ghost: 'text-slate-500 hover:bg-slate-50',
        danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200',
        outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base font-black uppercase tracking-widest'
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export const Badge = ({ children, variant = 'neutral', className }) => {
    const variants = {
        neutral: 'bg-slate-100 text-slate-500',
        success: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-indigo-50 text-indigo-600',
        live: 'bg-rose-500 text-white live-pulse',
        warning: 'bg-amber-50 text-amber-600'
    };

    return (
        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", variants[variant], className)}>
            {children}
        </span>
    );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-2">✕</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export const Input = ({ label, className, ...props }) => (
    <div className="space-y-1.5 w-full">
        {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>}
        <input
            className={cn(
                "w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300",
                className
            )}
            {...props}
        />
    </div>
);
