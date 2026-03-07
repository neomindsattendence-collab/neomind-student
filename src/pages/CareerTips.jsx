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
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase underline decoration-orange-600/30">Neural Portfolio AI</h1>
                    <p className="text-slate-500 font-black mt-4 uppercase tracking-[0.3em] text-[10px] italic">Automated professional trajectory optimization</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Upload Section */}
                <div className="lg:col-span-2 space-y-10">
                    <Card title="Neural Scannner" subtitle="Analysis protocol" className="bg-white/[0.02] border-white/5 p-12">
                        <div className="space-y-8 mt-6">
                            <div
                                onClick={!isUploading ? handleUpload : undefined}
                                className="border-2 border-dashed border-white/5 rounded-[3.5rem] p-16 text-center bg-black hover:bg-white/[0.01] hover:border-orange-500/30 transition-all duration-700 cursor-pointer group relative overflow-hidden shadow-2xl"
                            >
                                {isUploading && (
                                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-orange-600 animate-progress origin-left"></div>
                                )}
                                <div className={`w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-all duration-700 group-hover:scale-110 shadow-2xl italic border border-white/5 ${hasUploaded ? 'bg-orange-600 text-white shadow-[0_0_30px_rgba(234,88,12,0.4)]' : 'bg-white/[0.03] text-slate-700 group-hover:text-orange-500 group-hover:bg-white/[0.05]'}`}>
                                    {hasUploaded ? <CheckCircle2 size={48} /> : <Upload size={48} />}
                                </div>
                                <h4 className="text-2xl font-black text-white tracking-tight italic uppercase">
                                    {isUploading ? 'SYNCHRONIZING...' : hasUploaded ? 'PORTFOLIO LINKED' : 'UPLOAD PORTFOLIO'}
                                </h4>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3 px-8 leading-relaxed italic">
                                    {hasUploaded ? 'Telemetry ready for neural extraction' : 'PDF or DOCX required for protocol analysis'}
                                </p>
                            </div>

                            {hasUploaded && (
                                <div className="bg-orange-600/10 p-8 rounded-[3rem] border border-orange-500/20 flex items-center justify-between animate-in zoom-in-95 duration-1000 shadow-2xl">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg italic"><FileSpreadsheet size={24} /></div>
                                        <div>
                                            <p className="text-sm font-black text-white italic uppercase tracking-tight">Portfolio_v2_2026.pdf</p>
                                            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] mt-1.5 italic">Operational Status: Linked</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setHasUploaded(false)} className="text-[10px] font-black uppercase text-orange-600 hover:text-white transition-colors tracking-widest italic">Replace</button>
                                </div>
                            )}

                            {!hasUploaded && (
                                <div className="p-8 bg-black rounded-[2.5rem] border border-white/5 text-white overflow-hidden relative group mt-10">
                                    <div className="absolute -right-10 -bottom-10 p-10 opacity-5 group-hover:opacity-[0.1] transition-opacity duration-1000">
                                        <BrainCircuit size={150} />
                                    </div>
                                    <div className="flex items-start space-x-6 relative z-10 italic">
                                        <div className="p-4 bg-orange-600/10 text-orange-500 rounded-2xl border border-orange-500/20 shadow-inner"><BrainCircuit size={24} /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed italic">
                                                Awaiting secure data upload to activate the Neural Analysis engine paradigm...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card title="Neural Guidelines" subtitle="Global standards" className="bg-white/[0.02] border-white/5 p-12">
                        <div className="space-y-6 mt-6">
                            {[
                                'Quantify operational impact with hard metrics (e.g. 95% SOTA)',
                                'Primary technical cluster must occupy the header zone',
                                'Single-column architecture for seamless ATS ingestion',
                            ].map((tip, i) => (
                                <div key={i} className="flex gap-6 p-6 bg-white/[0.03] rounded-[2.5rem] border border-white/5 italic group hover:border-orange-500/30 transition-all duration-700">
                                    <Lightbulb size={24} className="text-amber-500 flex-shrink-0 group-hover:scale-125 transition-transform" />
                                    <p className="text-xs font-black text-slate-400 leading-relaxed uppercase tracking-tight">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-3 space-y-10">
                    {hasUploaded ? (
                        <div className="space-y-10 animate-in slide-in-from-right-12 duration-1000">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <Card title="Skills Cluster" subtitle="Neural feedback" className="bg-white/[0.02] border-white/5 p-10 border-t-8 border-t-orange-600 relative overflow-hidden">
                                    <div className="space-y-6 mt-6 relative z-10">
                                        <div className="p-6 bg-orange-600/10 border border-orange-500/20 rounded-[2.5rem] flex items-start gap-6 shadow-inner italic">
                                            <AlertCircle size={24} className="text-orange-500 shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm font-black text-white italic uppercase tracking-tighter">Missing Core Directives</p>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mt-3 leading-relaxed">"Transformers", "PyTorch Lightning", and "MLOps" are absent from your skills matrix cluster.</p>
                                            </div>
                                        </div>
                                        <Button variant="secondary" className="w-full text-[10px] font-black uppercase tracking-[0.25em] h-16 rounded-2xl italic">Inject To Profile</Button>
                                    </div>
                                </Card>
                                <Card title="Project Architecture" subtitle="Neural verification" className="bg-white/[0.02] border-white/5 p-10 border-t-8 border-t-emerald-600 relative overflow-hidden">
                                    <div className="space-y-6 mt-6 relative z-10">
                                        <div className="p-6 bg-emerald-600/10 border border-emerald-500/20 rounded-[2.5rem] flex items-start gap-6 shadow-inner italic">
                                            <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm font-black text-white italic uppercase tracking-tighter">Metrics Verified</p>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mt-3 leading-relaxed">Impact quantification logic confirmed in your "Neural Net Visualization" segment.</p>
                                            </div>
                                        </div>
                                        <Button variant="secondary" className="w-full text-[10px] font-black uppercase tracking-[0.25em] h-16 rounded-2xl italic">View Templates</Button>
                                    </div>
                                </Card>
                            </div>

                            <Card title="Sector Expansion" subtitle="Recommended operational projects" className="bg-white/[0.02] border-white/5 p-12">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                                    {[
                                        { t: 'End-to-end MLOps', d: 'Secure model deployment via K8s' },
                                        { t: 'Scaleable Streams', d: 'Process 10M+ rows of real-time data' },
                                        { t: 'Custom Transports', d: 'Low latency WebSocket protocols' }
                                    ].map((proj, i) => (
                                        <div key={i} className="p-8 bg-black rounded-[3rem] border border-white/5 group hover:border-orange-500/40 transition-all duration-700 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-600/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                                            <div className="p-5 bg-white/[0.03] w-fit rounded-2xl border border-white/5 mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 italic shadow-inner"><Zap size={24} /></div>
                                            <h5 className="text-xs font-black text-white leading-tight mb-3 uppercase tracking-widest italic">{proj.t}</h5>
                                            <p className="text-[9px] font-black text-slate-600 leading-relaxed italic uppercase tracking-[0.15em]">{proj.d}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="bg-black border border-white/5 text-white overflow-hidden p-0 h-[300px] relative group rounded-[3.5rem] shadow-2xl">
                                <div className="absolute inset-0 bg-orange-600/5 group-hover:bg-orange-600/10 transition-colors duration-[2000ms]"></div>
                                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-[3000ms]"></div>
                                <div className="p-12 relative z-10 flex flex-col justify-between h-full">
                                    <Badge variant="warning" className="w-fit italic font-black px-8 py-2 tracking-[0.2em] animate-pulse">OVERALL INDEX: 78/100</Badge>
                                    <div className="space-y-8">
                                        <h4 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">Profile Status: <span className="text-orange-500">Job Synchronized</span> <br /> 4 Active Links Found.</h4>
                                        <Button className="w-fit bg-orange-600 text-white font-black uppercase tracking-[0.3em] text-[10px] py-6 px-12 rounded-[2rem] flex items-center gap-4 shadow-[0_20px_50px_rgba(234,88,12,0.3)] hover:bg-orange-700 transition-colors italic">
                                            Apply For Deployment <ArrowRight size={18} className="translate-y-[-1px]" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <Card className="h-full flex flex-col items-center justify-center text-center p-24 bg-white/[0.01] border-dashed border-2 border-white/5 rounded-[4rem] group overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <Sparkles size={80} className="text-slate-800 mb-10 group-hover:scale-110 transition-transform duration-1000 group-hover:text-orange-500/20" />
                            <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase">Intelligence Stream Locked</h3>
                            <p className="text-[10px] font-black text-slate-500 max-w-sm mx-auto mt-6 uppercase tracking-[0.3em] leading-relaxed italic">
                                Synchronize your portfolio document to activate the Neural scanner. Real-time feedback and trajectory expansion protocols will execute upon ingestion.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerTips;
