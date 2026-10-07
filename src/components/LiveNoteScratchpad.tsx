"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Mic,
  MicOff,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Lightbulb,
} from "lucide-react";
import { ExtractedContext } from "@/types/course";
import { extractContextFromNotes } from "@/lib/noteExtractor";

interface LiveNoteScratchpadProps {
  currentNotes: string;
  onNotesChange: (notes: string) => void;
  onApplyContext: (context: ExtractedContext) => void;
  autoSync: boolean;
  setAutoSync: (val: boolean) => void;
}

const PRESET_SCRATCHPADS = [
  {
    label: "US STEM Master's",
    text: "Alex is a CS graduate with 3.4 GPA. IELTS score 7.5. Looking for MS in Computer Science or Data Science for Fall 2025 in the US or UK. Max budget $40,000. Has 2 years work exp.",
  },
  {
    label: "Germany Zero-Tuition",
    text: "Student has 3.0 CGPA out of 4.0 in Mechanical Engineering. IELTS 6.5. Wants tuition-free or low-cost master's in Germany or Ireland under $15k USD total cost. Interested in Robotics.",
  },
  {
    label: "UK Fast 1-Yr",
    text: "Applicant with 3.6 GPA and 7.0 IELTS. Seeking 1-year Master's in Business Analytics or AI in UK or Canada. Budget up to $35,000 USD.",
  },
];

export const LiveNoteScratchpad: React.FC<LiveNoteScratchpadProps> = ({
  currentNotes,
  onNotesChange,
  onApplyContext,
  autoSync,
  setAutoSync,
}) => {
  const [extracted, setExtracted] = useState<ExtractedContext | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  useEffect(() => {
    if (!currentNotes.trim()) {
      setExtracted(null);
      return;
    }

    const ctx = extractContextFromNotes(currentNotes);
    setExtracted(ctx);

    if (autoSync) {
      onApplyContext(ctx);
    }
  }, [currentNotes, autoSync, onApplyContext]);

  const toggleVoiceRecording = () => {
    if (!isRecordingVoice) {
      if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          onNotesChange(currentNotes + " " + currentTranscript);
        };

        recognition.onerror = (err: any) => {
          console.error("Speech Recognition Error:", err);
          setIsRecordingVoice(false);
        };

        recognition.onend = () => {
          setIsRecordingVoice(false);
        };

        recognition.start();
        setIsRecordingVoice(true);
      } else {
        alert("Web Speech API is not supported in this browser. You can type notes or click preset profile buttons!");
      }
    } else {
      setIsRecordingVoice(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-xl h-full justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              Live Voice & Note Extractor
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">Feature 1</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Auto-extracts student profile parameters from speech & typing in real-time
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition-all ${
              autoSync
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/20"
                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
            }`}
          >
            <Zap className={`w-3 h-3 ${autoSync ? "text-indigo-400 fill-indigo-400" : ""}`} />
            <span>Auto-Sync</span>
          </button>

          <button
            onClick={toggleVoiceRecording}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
              isRecordingVoice
                ? "bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95"
            }`}
          >
            {isRecordingVoice ? (
              <>
                <MicOff className="w-3 h-3" /> Listening...
              </>
            ) : (
              <>
                <Mic className="w-3 h-3 text-cyan-400" /> Voice Input
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Profiles */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Quick Samples:
        </span>
        {PRESET_SCRATCHPADS.map((preset, i) => (
          <button
            key={i}
            onClick={() => onNotesChange(preset.text)}
            className="px-2.5 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-[11px] font-medium whitespace-nowrap border border-slate-700/70 transition-all active:scale-95 hover:text-white"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Scratchpad Textarea */}
      <div className="relative flex-1 min-h-[90px]">
        <textarea
          value={currentNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Speak or take notes live (e.g. 'Alex has 3.4 GPA, IELTS 7.5, looking for MS in Computer Science in US or UK under $40k budget')..."
          rows={3}
          className="w-full h-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 resize-none font-mono leading-relaxed"
        />
        {currentNotes && (
          <button
            onClick={() => onNotesChange("")}
            className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 hover:text-rose-300 text-[10px] border border-slate-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Extracted Chips Display */}
      {extracted && (
        <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Real-time Extracted Parameters:
            </span>
            {!autoSync && (
              <button
                onClick={() => onApplyContext(extracted)}
                className="px-2 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold flex items-center gap-1 shadow transition-all"
              >
                <SlidersHorizontal className="w-3 h-3" /> Apply to Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {extracted.gpa !== undefined && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold">
                GPA: {extracted.gpa} ({extracted.gpaScale || "4.0"})
              </span>
            )}
            {extracted.ielts !== undefined && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                IELTS: {extracted.ielts}
              </span>
            )}
            {extracted.toefl !== undefined && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                TOEFL: {extracted.toefl}
              </span>
            )}
            {extracted.gre !== undefined && (
              <span className="px-2 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/30 text-violet-300 text-[11px] font-semibold">
                GRE: {extracted.gre}
              </span>
            )}
            {extracted.budgetUSD !== undefined && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                Budget: ${extracted.budgetUSD.toLocaleString()}
              </span>
            )}
            {extracted.countries && extracted.countries.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
                Countries: {extracted.countries.join(", ")}
              </span>
            )}
            {extracted.field && (
              <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[11px] font-semibold">
                Field: {extracted.field}
              </span>
            )}
            {extracted.workExpYears !== undefined && (
              <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold">
                Exp: {extracted.workExpYears} Yrs
              </span>
            )}
            {extracted.stemOnly && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold">
                STEM Designated
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
