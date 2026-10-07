"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Target,
  Rocket,
  Check,
  Plus,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Briefcase,
  GraduationCap,
  Sparkles,
  Info,
  Clock,
  Globe,
  Mic,
  AlertTriangle,
} from "lucide-react";
import { ScoredCourse, Course } from "@/types/course";
import { CurrencyCode, formatCurrency } from "@/lib/currencyConverter";

interface CourseCardProps {
  scored: ScoredCourse;
  isCompared: boolean;
  onToggleCompare: (course: Course) => void;
  isShortlisted: boolean;
  onToggleShortlist: (course: Course) => void;
  onSelectDetail: (course: Course) => void;
  currency: CurrencyCode;
  onOpenVisaRadar: (course: Course) => void;
  onOpenPitchScript: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  scored,
  isCompared,
  onToggleCompare,
  isShortlisted,
  onToggleShortlist,
  onSelectDetail,
  currency,
  onOpenVisaRadar,
  onOpenPitchScript,
}) => {
  const { course, match } = scored;
  const [showBreakdown, setShowBreakdown] = useState(false);

  const formattedTuition = formatCurrency(course.tuitionTotalUSD, currency);
  const formattedSalary = formatCurrency(course.avgGraduateSalaryUSD, currency);

  // Safe Reasons list fallback
  const reasonsList = match.whyRelevant || match.reasons || [];

  // Tier Badge & Glow Config
  const getTierBadge = () => {
    switch (match.tier) {
      case "Safe":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-[11px] font-bold flex items-center gap-1 shadow-sm shadow-emerald-500/10">
            <ShieldCheck className="w-3.5 h-3.5" /> Safe Match
          </span>
        );
      case "Moderate":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-400 text-[11px] font-bold flex items-center gap-1 shadow-sm shadow-amber-500/10">
            <Target className="w-3.5 h-3.5" /> Moderate Target
          </span>
        );
      case "Reach":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/35 text-purple-300 text-[11px] font-bold flex items-center gap-1 shadow-sm shadow-purple-500/10">
            <Rocket className="w-3.5 h-3.5" /> Reach / Dream
          </span>
        );
    }
  };

  const getBorderColor = () => {
    switch (match.tier) {
      case "Safe":
        return "hover:border-emerald-500/50 card-safe-glow";
      case "Moderate":
        return "hover:border-amber-500/50 card-moderate-glow";
      case "Reach":
        return "hover:border-purple-500/50 card-reach-glow";
    }
  };

  return (
    <div className={`flex flex-col bg-slate-900/90 border border-slate-800/90 rounded-2xl transition-all duration-200 overflow-hidden shadow-xl backdrop-blur-xl ${getBorderColor()}`}>
      {/* Top Banner & University Info */}
      <div className="p-3.5 sm:p-4 flex items-start justify-between gap-2.5 border-b border-slate-800/70 bg-slate-950/40">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold tracking-wide uppercase border border-slate-700">
              QS #{course.qsRanking}
            </span>
            {course.isStem && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                STEM
              </span>
            )}
            <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
              <Globe className="w-3 h-3 text-cyan-400 shrink-0" /> {course.university}
            </span>
          </div>
          <h3
            onClick={() => onSelectDetail(course)}
            className="text-sm sm:text-base font-extrabold text-white hover:text-indigo-300 transition-colors cursor-pointer line-clamp-1 tracking-tight"
            title={course.name}
          >
            {course.name}
          </h3>
          <p className="text-[11px] text-slate-400">
            {course.city}, {course.country} • {course.degreeLevel} ({course.durationYears} Yrs)
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          {getTierBadge()}
          <span className="text-[11px] font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
            {match.eligibilityScore}% Fit
          </span>
        </div>
      </div>

      {/* Quick Specs Grid */}
      <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950/60 border-b border-slate-800/60 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Total Tuition
          </span>
          <span className="font-extrabold text-slate-100 text-xs sm:text-sm">
            {formattedTuition}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            PSW Visa
          </span>
          <span className="font-bold text-emerald-400">
            {course.postStudyWorkVisaYears} Yrs Duration
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Req Min GPA
          </span>
          <span className="font-bold text-slate-200">
            {course.requirements.minGPA.toFixed(2)} / 4.0
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Avg Salary
          </span>
          <span className="font-bold text-cyan-300">
            {formattedSalary}/yr
          </span>
        </div>
      </div>

      {/* Highlights & Feature Action Buttons */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-3 text-xs">
        {/* Bullet Highlights */}
        <div className="space-y-1">
          {match.highlights.slice(0, 2).map((h, idx) => (
            <p key={idx} className="text-slate-300 flex items-center gap-1.5 text-[11px] leading-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span>{h}</span>
            </p>
          ))}
          {match.missingRequirements.length > 0 && (
            <p className="text-amber-400 flex items-center gap-1.5 text-[11px] font-semibold leading-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>{match.missingRequirements[0]}</span>
            </p>
          )}
        </div>

        {/* Unique Feature Quick Buttons (Visa Radar + Pitch Script) */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
          <button
            onClick={() => onOpenVisaRadar(course)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 transition-all active:scale-95 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">Visa Risk Radar</span>
          </button>

          <button
            onClick={() => onOpenPitchScript(course)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 transition-all active:scale-95 shadow-sm"
          >
            <Mic className="w-3.5 h-3.5 text-purple-400" />
            <span className="truncate">Live Pitch Script</span>
          </button>
        </div>

        {/* Expandable Smart Admission Breakdown */}
        <div className="pt-1">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-slate-400 hover:text-slate-200 py-1 transition-colors border-t border-slate-800/70"
          >
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-indigo-400" /> Smart Admission Viability Breakdown
            </span>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showBreakdown && (
            <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px] animate-fadeIn">
              <div className="grid grid-cols-2 gap-2 text-slate-300 border-b border-slate-800/80 pb-2">
                <div>GPA Score: <span className="font-extrabold text-indigo-400">{match.scoreBreakdown.gpaScore}/35</span></div>
                <div>English: <span className="font-extrabold text-emerald-400">{match.scoreBreakdown.englishScore}/20</span></div>
                <div>Work Exp: <span className="font-extrabold text-cyan-400">{match.scoreBreakdown.workExpScore}/15</span></div>
                <div>Selectivity: <span className="font-extrabold text-purple-400">{match.scoreBreakdown.selectivityAdjust}/15</span></div>
              </div>
              <div className="space-y-1.5 text-slate-300">
                {reasonsList.map((r, i) => (
                  <p key={i} className="leading-snug">• {r}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/90 flex items-center justify-between gap-2">
        <button
          onClick={() => onToggleCompare(course)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
            isCompared
              ? "bg-indigo-600/25 border-indigo-500/60 text-indigo-300"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          {isCompared ? <Check className="w-3.5 h-3.5 text-indigo-400" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isCompared ? "In Matrix" : "Compare"}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleShortlist(course)}
            className={`p-1.5 rounded-xl border transition-all active:scale-95 ${
              isShortlisted
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-sm shadow-amber-500/20"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title={isShortlisted ? "Remove bookmark" : "Shortlist course"}
          >
            {isShortlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onSelectDetail(course)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 active:scale-95"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
