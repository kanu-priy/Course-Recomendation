"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  Sparkles,
  Volume2,
  Play,
  MessageSquareText,
  User,
  Radio,
  Wifi,
  Minimize2,
  Maximize2,
} from "lucide-react";

interface LiveMeetCallProps {
  onTranscriptReceived: (text: string) => void;
  extractedChipsCount: number;
}

const SAMPLE_TRANSCRIPTS = [
  "Hi Sarah! I graduated with a 3.4 GPA in Mechanical Engineering. I took my IELTS last month and scored 7.5 overall.",
  "I'm looking for a Master's program in Computer Science or Robotics for Fall 2025.",
  "My maximum budget is around $40,000 USD for annual tuition, and I prefer the US or Germany.",
  "I also have 2 years of work experience as a software developer, and I want a STEM designated degree with 3-year OPT.",
];

export const LiveMeetCall: React.FC<LiveMeetCallProps> = ({
  onTranscriptReceived,
  extractedChipsCount,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [transcriptStream, setTranscriptStream] = useState<
    { sender: string; text: string; time: string }[]
  >([
    {
      sender: "Alex Chen (Student)",
      text: "Hello! Looking forward to shortlisting master's programs for Fall 2025.",
      time: "11:42 AM",
    },
  ]);
  const [transcriptIndex, setTranscriptIndex] = useState(0);

  const simulateSpeech = () => {
    const text = SAMPLE_TRANSCRIPTS[transcriptIndex % SAMPLE_TRANSCRIPTS.length];
    setTranscriptIndex((prev) => prev + 1);

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setTranscriptStream((prev) => [
      ...prev,
      { sender: "Alex Chen (Student)", text, time },
    ]);

    onTranscriptReceived(text);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all">
      {/* Top Google Meet Simulation Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <div>
            <h2 className="text-xs font-bold text-slate-100 tracking-wide flex items-center gap-2">
              Google Meet Counselling Call
            </h2>
            <p className="text-[10px] text-slate-400">
              Session #8492 • Student: <span className="text-slate-200 font-semibold">Alex Chen</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <Wifi className="w-3 h-3 text-emerald-400" /> Stable
          </span>
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" /> REC 12:44
          </span>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isCollapsed ? "Expand Video Tiles" : "Collapse into Compact Floating Bar"}
          >
            {isCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Video Call Grid (Hidden when collapsed) */}
      {!isCollapsed ? (
        <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 flex-1 min-h-[190px]">
          {/* Tile 1: Student */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800 flex flex-col justify-between p-3.5 group shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent z-10 pointer-events-none" />

            {/* Top Status */}
            <div className="z-20 flex justify-between items-center">
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Volume2 className="w-3 h-3 animate-pulse" /> Speaking
              </span>
              <span className="w-5 h-5 rounded-full bg-slate-800/80 text-slate-300 flex items-center justify-center text-[10px]">
                <User className="w-3 h-3" />
              </span>
            </div>

            {/* Student Avatar Graphic */}
            <div className="my-auto flex flex-col items-center justify-center py-3 z-10">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/20">
                  AC
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-slate-900 flex items-center justify-center text-[8px] text-white font-bold">
                  ✓
                </div>
              </div>
              <p className="mt-2 text-xs sm:text-sm font-bold text-slate-100">
                Alex Chen
              </p>
              <p className="text-[10px] text-slate-400">CS Applicant (B.Tech graduate)</p>
            </div>

            {/* Bottom Label */}
            <div className="z-20 flex items-center justify-between text-[10px]">
              <span className="text-slate-300 font-medium">Student Feed</span>
              <span className="text-slate-500">1080p • 60fps</span>
            </div>
          </div>

          {/* Tile 2: Counsellor */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800 flex flex-col justify-between p-3.5 shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent z-10 pointer-events-none" />

            <div className="z-20 flex justify-between items-center">
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                GradGuide Advisor
              </span>
            </div>

            <div className="my-auto flex flex-col items-center justify-center py-3 z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-slate-700/80 flex items-center justify-center text-xl sm:text-2xl font-black text-slate-200 shadow-lg">
                SJ
              </div>
              <p className="mt-2 text-xs sm:text-sm font-bold text-slate-100">
                Sarah Jenkins
              </p>
              <p className="text-[10px] text-slate-400">Senior Admissions Lead</p>
            </div>

            <div className="z-20 flex items-center justify-between text-[10px]">
              <span className="text-slate-300 font-medium">You (Advisor)</span>
              {isMuted ? (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <MicOff className="w-3 h-3" /> Muted
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Mic className="w-3 h-3" /> Mic Live
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Compact Floating Strip when collapsed */
        <div className="px-4 py-2.5 bg-slate-950/60 flex items-center justify-between border-b border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              AC
            </div>
            <div>
              <p className="font-bold text-slate-100 text-[11px]">Alex Chen (Speaking)</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Audio feed connected
              </p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 italic">Call docked to top strip</span>
        </div>
      )}

      {/* Live Transcript Stream Ticker */}
      <div className="px-3 sm:px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200">
              Live Transcript Feed
            </span>
          </div>
          <button
            onClick={simulateSpeech}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            Simulate Student Speaking
          </button>
        </div>

        {/* Stream Messages */}
        <div className="max-h-24 sm:max-h-28 overflow-y-auto space-y-1.5 pr-1 text-xs">
          {transcriptStream.map((t, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col gap-0.5 text-xs"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-indigo-400">{t.sender}</span>
                <span className="text-slate-500">{t.time}</span>
              </div>
              <p className="text-slate-200 text-[11px] leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meet Control Bar */}
      <div className="px-3 sm:px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-full transition-all ${
              isMuted
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-2 rounded-full transition-all ${
              !isVideoOn
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
            title={isVideoOn ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoOn ? <VideoIcon className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[11px] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
            <span className="hidden sm:inline">AI Listening Co-Pilot Active</span>
            <span className="sm:hidden">AI Active</span>
          </div>
        </div>

        <button
          className="p-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all active:scale-95"
          title="Leave Call"
        >
          <PhoneOff className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
