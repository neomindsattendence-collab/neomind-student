import React, { useState } from 'react';
import {
    FileSpreadsheet,
    Upload,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Zap,
    LayoutGrid,
    FileText,
    AlertCircle,
    BrainCircuit,
    Lightbulb
} from 'lucide-react';
import { Card, Button, Badge } from '../components/Common';

const CareerTips = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [hasUploaded, setHasUploaded] = useState(false);

    const handleUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            setHasUploaded(true);
        }, 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Smart Resume AI</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Optimize your portfolio for automated screening</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Analysis Portal" className="bg-white border-2 border-indigo-100 shadow-xl shadow-indigo-500/5">
                        <div className="space-y-6 pt-2">
                            <div
                                onClick={!isUploading ? handleUpload : undefined}
                                className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center bg-slate-50 hover:bg-white hover:border-indigo-400 transition-all cursor-pointer group relative overflow-hidden"
                            >
                                {isUploading && (
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-600 animate-progress origin-left"></div>
                                )}
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110 shadow-lg ${hasUploaded ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 group-hover:text-indigo-600'}`}>
                                    {hasUploaded ? <CheckCircle2 size={40} /> : <Upload size={40} />}
                                </div>
                                <h4 className="text-lg font-black text-slate-800 tracking-tight">
                                    {isUploading ? 'Analyzing Structure...' : hasUploaded ? 'Resume Synchronized' : 'Upload your Resume'}
                                </h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-4 leading-relaxed">
                                    {hasUploaded ? 'Artifact ready for intelligent tips' : 'PDF or DOCX required for Neural analysis'}
                                </p>
                            </div>

                            {hasUploaded && (
                                <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center justify-between animate-in zoom-in-95 duration-500">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center"><FileSpreadsheet size={20} /></div>
                                        <div>
                                            <p className="text-sm font-black text-emerald-900">Resume_v2_2026.pdf</p>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">Scanned Successfully</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setHasUploaded(false)} className="text-[10px] font-black uppercase text-emerald-700 hover:underline">Replace</button>
                                </div>
                            )}

                            {!hasUploaded && (
                                <Card title="System Insights" className="bg-slate-900 text-white border-none py-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-indigo-600 text-white rounded-xl"><BrainCircuit size={18} /></div>
                                        <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest italic opacity-70">
                                            Upload to activate the Neural Analysis engine...
                                        </p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </Card>

                    <Card title="Best Practices" subtitle="Academy Standards">
                        <div className="space-y-4 pt-2">
                            {[
                                'Use quantitative metrics for projects (e.g. "95% accuracy")',
                                'Primary tech stack must be in the top 1/3rd',
                                'Maintain a single-column layout for ATS compatibility',
                            ].map((tip, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic group hover:border-indigo-300 transition-all">
                                    <Lightbulb size={20} className="text-amber-500 flex-shrink-0" />
                                    <p className="text-xs font-bold text-slate-600 leading-snug">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-3 space-y-8">
                    {hasUploaded ? (
                        <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card title="Neural Tip: Skills Section" className="border-t-4 border-t-indigo-600">
                                    <div className="space-y-4 pt-2">
                                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-4">
                                            <AlertCircle size={20} className="text-orange-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-black text-orange-900">Missing Core Keywords</p>
                                                <p className="text-xs font-bold text-orange-700/80 mt-1">"Transformers", "PyTorch Lightning", and "MLOps" are missing from your skills cluster but are highly trending.</p>
                                            </div>
                                        </div>
                                        <Button variant="secondary" className="w-full text-[10px] font-black uppercase tracking-widest border-2 py-4">Add to Draft</Button>
                                    </div>
                                </Card>
                                <Card title="Project Formatting" className="border-t-4 border-t-emerald-600">
                                    <div className="space-y-4 pt-2">
                                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4">
                                            <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-black text-emerald-900">Impact Metrics Found</p>
                                                <p className="text-xs font-bold text-emerald-700/80 mt-1">Excellent job on using percentages in your Neural Network visualization project description.</p>
                                            </div>
                                        </div>
                                        <Button variant="secondary" className="w-full text-[10px] font-black uppercase tracking-widest border-2 py-4">View Templates</Button>
                                    </div>
                                </Card>
                            </div>

                            <Card title="Suggested Improvements" subtitle="Recommended Projects to Add">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                    {[
                                        { t: 'End-to-end MLOps', d: 'Deploy a model using Docker & Kubernetes' },
                                        { t: 'Scaleable Analytics', val: 'Handle 10M+ rows of streaming data' },
                                        { t: 'Custom WebSockets', val: 'Low latency real-time communication' }
                                    ].map((proj, i) => (
                                        <div key={i} className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100 group hover:border-indigo-400 hover:bg-white transition-all">
                                            <div className="p-3 bg-white w-fit rounded-2xl shadow-sm mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Zap size={20} /></div>
                                            <h5 className="text-sm font-black text-slate-800 leading-tight mb-2 uppercase">{proj.t}</h5>
                                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">{proj.d || proj.val}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="bg-slate-900 border-none text-white overflow-hidden p-0 h-[250px] relative group">
                                <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/20 transition-colors"></div>
                                <div className="p-10 relative z-10 flex flex-col justify-between h-full">
                                    <Badge variant="blue" className="w-fit">Final Score: 78/100</Badge>
                                    <div className="space-y-4">
                                        <h4 className="text-3xl font-black tracking-tighter">Your profile is "Job Ready" <br /> for 4 active openings.</h4>
                                        <Button className="bg-white text-indigo-950 font-black uppercase tracking-widest text-[10px] py-4 px-8 rounded-2xl flex items-center gap-3">
                                            Apply Now <ArrowRight size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <Card className="h-full flex flex-col items-center justify-center text-center p-20 bg-slate-50/50 border-dashed border-2">
                            <Sparkles size={64} className="text-slate-200 mb-8" />
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Intelligence Data Awaiting</h3>
                            <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto mt-4 uppercase tracking-[0.2em] leading-relaxed">
                                Once you upload your resume, our Neural Scannner will provide specific feedback and project suggestions tailored to your course performance.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerTips;
