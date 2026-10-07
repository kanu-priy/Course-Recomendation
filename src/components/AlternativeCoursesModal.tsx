"use client";

import React from "react";
import {
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  Target,
  Rocket,
  Globe,
  Sparkles,
  Plus,
  Check,
} from "lucide-react";
import { Course, StudentProfile, ScoredCourse } from "@/types/course";
import { findAlternativeRecommendations, evaluateCourseMatch } from "@/lib/recommendationEngine";
import { CurrencyCode, formatCurrency } from "@/lib/currencyConverter";

interface AlternativeCoursesModalProps {
  course: Course | null;
  onClose: () => void;
  studentProfile: StudentProfile;
  allCourses: Course[];
  currency: CurrencyCode;
  comparedIds: string[];
  onToggleCompare: (course: Course) => void;
  onSelectCourse: (course: Course) => void;
}

export const AlternativeCoursesModal: React.FC<AlternativeCoursesModalProps> = ({
  course,
  onClose,
  studentProfile,
  allCourses,
  currency,
  comparedIds,
  onToggleCompare,
  onSelectCourse,
}) => {
  if (!course) return null;

  const alternatives = findAlternativeRecommendations(course, studentProfile, allCourses);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Alternative Recommendations
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/25">PDF Requirement</span>
              </h2>
              <p className="text-xs text-slate-400">
                Explore similar lower-cost or alternative country paths to <strong className="text-slate-200">{course.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-300 max-h-[75vh] overflow-y-auto">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Currently Viewing</span>
              <p className="font-bold text-white">{course.name} ({course.university})</p>
              <p className="text-slate-400 text-[11px]">{course.country} • {formatCurrency(course.tuitionTotalUSD, currency)} total</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-300 font-bold text-[11px] border border-indigo-500/25">
              Target Reference
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Suggested Alternative Programs:
            </h4>

            {alternatives.map((alt) => {
              const altMatch = evaluateCourseMatch(alt, studentProfile);
              const isComp = comparedIds.includes(alt.id);
              const formattedTuition = formatCurrency(alt.tuitionTotalUSD, currency);

              return (
                <div
                  key={alt.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                        QS #{alt.qsRanking}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        altMatch.tier === "Safe"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : altMatch.tier === "Moderate"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-purple-500/20 text-purple-300"
                      }`}>
                        {altMatch.tier}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {alt.country} • {alt.city}
                      </span>
                    </div>
                    <h5 className="font-extrabold text-sm text-white">{alt.name}</h5>
                    <p className="text-slate-400 text-[11px]">{alt.university} • {alt.durationYears} Years</p>
                    <p className="text-emerald-400 text-[11px] font-semibold">
                      Tuition: {formattedTuition} • Visa: {alt.postStudyWorkVisaYears} Yrs PSW
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => onToggleCompare(alt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isComp
                          ? "bg-indigo-600/25 border-indigo-500/60 text-indigo-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {isComp ? "✓ In Matrix" : "+ Compare"}
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectCourse(alt);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
