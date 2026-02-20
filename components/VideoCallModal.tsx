import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, MoreHorizontal, Maximize2, ShieldCheck, User, Volume2, Layout } from 'lucide-react';
import { OngoingTreatment } from '../types';
import { Button, Card, Badge } from './ui';

interface VideoCallModalProps {
    treatment: OngoingTreatment;
    onClose: () => void;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ treatment, onClose }) => {
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans">

            {/* Immersive Video Feed Background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
                    alt="Doctor Video"
                    className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent"></div>
            </div>

            {/* Top Bar Navigation */}
            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-2xl">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]"></div>
                        <span className="text-white text-sm font-black font-mono tracking-widest">{formatTime(duration)}</span>
                    </div>
                    <Badge variant="info" className="bg-blue-600/20 text-blue-400 border-blue-500/30 uppercase tracking-[0.2em] text-[10px] py-1 px-3">
                        Consultation Live
                    </Badge>
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl text-white hover:bg-white/10 transition-all active:scale-95">
                        <Layout size={20} />
                    </button>
                    <button className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl text-white hover:bg-white/10 transition-all active:scale-95">
                        <Maximize2 size={20} />
                    </button>
                </div>
            </div>

            {/* Main Speaker Display */}
            <div className="relative z-10 flex flex-col items-center gap-8 animate-in zoom-in-95 duration-700">
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-48 h-48 rounded-[3rem] p-1.5 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 shadow-2xl relative overflow-hidden transform group-hover:rotate-6 transition-transform duration-500">
                        <img
                            src={treatment.doctorImage}
                            alt={treatment.doctorName}
                            className="w-full h-full rounded-[2.8rem] object-cover border-4 border-slate-950"
                        />
                        <div className="absolute bottom-4 right-4 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-950 shadow-lg animate-pulse"></div>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">{treatment.doctorName}</h2>
                        <p className="text-blue-400 font-extrabold uppercase tracking-[0.3em] text-xs mt-2 opacity-80">Primary Care Specialist</p>
                    </div>

                    <div className="flex items-center gap-2 justify-center">
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-white/5 py-1.5 px-4 rounded-full border border-white/5 backdrop-blur-md">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            End-to-End Encrypted
                        </div>
                    </div>
                </div>
            </div>

            {/* Picture-in-Picture (Self View) */}
            <div className="absolute bottom-36 right-8 w-40 h-56 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 z-50 group hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full bg-slate-900/50 flex items-center justify-center relative">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white/20">
                        <User size={48} />
                    </div>
                    {!isVideoOn && (
                        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-3">
                            <VideoOff size={32} className="text-rose-500" />
                            <span className="text-[10px] font-black text-rose-500 uppercase">Camera Off</span>
                        </div>
                    )}
                    <div className="absolute top-4 left-4">
                        <Badge variant="info" className="bg-slate-900/80 text-[8px] py-0 px-2 uppercase border-white/5">You</Badge>
                    </div>
                </div>
            </div>

            {/* Integrated Control Center */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-6 z-[100] px-8">
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-4 rounded-[3rem] flex items-center gap-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    <button
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all active:scale-95 ${isMicOn
                            ? 'bg-slate-800/80 text-white hover:bg-slate-700'
                            : 'bg-white text-slate-950 shadow-xl'
                            }`}
                    >
                        {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>

                    <button
                        onClick={() => setIsVideoOn(!isVideoOn)}
                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all active:scale-95 ${isVideoOn
                            ? 'bg-slate-800/80 text-white hover:bg-slate-700'
                            : 'bg-white text-slate-950 shadow-xl'
                            }`}
                    >
                        {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-20 h-20 rounded-[2rem] bg-rose-600 text-white hover:bg-rose-500 shadow-2xl shadow-rose-600/40 transition-all transform hover:scale-110 active:scale-90 flex items-center justify-center group"
                    >
                        <PhoneOff size={36} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
                    </button>

                    <button className="w-16 h-16 rounded-[1.5rem] bg-slate-800/80 text-white hover:bg-slate-700 backdrop-blur-md transition-all active:scale-95 flex items-center justify-center">
                        <MessageSquare size={24} />
                    </button>

                    <button className="w-16 h-16 rounded-[1.5rem] bg-slate-800/80 text-white hover:bg-slate-700 backdrop-blur-md transition-all active:scale-95 flex items-center justify-center">
                        <Volume2 size={24} />
                    </button>
                </div>
            </div>

            {/* Security Identifier */}
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">
                    Swasthya Setu Protocol • Link Node: 0x921A
                </p>
            </div>

        </div>
    );
};

export default VideoCallModal;
