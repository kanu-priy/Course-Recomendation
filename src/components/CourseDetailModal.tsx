"use client";

import React from "react";
import {
  X,
  GraduationCap,
  Globe,
  DollarSign,
  Briefcase,
  Clock,
  ShieldCheck,
  Rocket,
  Target,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Course, StudentProfile } from "@/types/course";
import { evaluateCourseMatch } from "@/lib/recommendationEngine";
import { CurrencyCode, formatCurrency } from "@/lib/currencyConverter";

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  studentProfile: StudentProfile;
  isCompared: boolean;
  onToggleCompare: (course: Course) => void;
  currency?: CurrencyCode;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  studentProfile,
  isCompared,
  onToggleCompare,
  currency = "USD",
}) => {
  if (!course) return null;

  const match = evaluateCourseMatch(course, studentProfile);

  const annualTuitionFormatted = formatCurrency(course.tuitionAnnualUSD, currency);
  const annualLivingFormatted = formatCurrency(course.livingCostAnnualUSD, currency);
  const totalCostFormatted = formatCurrency(
    course.tuitionTotalUSD + course.livingCostAnnualUSD * course.durationYears,
    currency
  );
  const salaryFormatted = formatCurrency(course.avgGraduateSalaryUSD, currency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-xl">
        {/* Modal Top Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 bg-slate-950/90 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 text-[11px] font-bold border border-indigo-500/25">
                QS #{course.qsRanking} Global
              </span>
              {course.isStem && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[11px] font-bold border border-emerald-500/25">
                  STEM Designated
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {course.name}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              {course.university} • {course.city}, {course.country}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-slate-300">
          {/* Smart Admission Scorecard Banner */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Admission Viability Tier:
                </span>
                {match.tier === "Safe" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Safe Target
                  </span>
                )}
                {match.tier === "Moderate" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Moderate Match
                  </span>
                )}
                {match.tier === "Reach" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 flex items-center gap-1">
                    <Rocket className="w-3.5 h-3.5" /> Reach / Dream
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Overall Candidate Admission Fit:{" "}
                <span className="font-extrabold text-indigo-400">{match.eligibilityScore}%</span>
              </p>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">GPA Fit</span>
                <span className="font-bold text-slate-200">{match.gpaFit}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">English</span>
                <span className="font-bold text-slate-200">{match.englishFit}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Acceptance</span>
                <span className="font-bold text-amber-400">{course.acceptanceRate}%</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-white">Program Overview</h3>
            <p className="leading-relaxed text-slate-300">{course.description}</p>
          </div>

          {/* Financial Breakdown Grid */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white">Financial & Living Expenses Breakdown ({currency})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Annual Tuition</span>
                <span className="text-base font-extrabold text-white">
                  {annualTuitionFormatted}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  ({course.currency} local currency)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Living Expenses</span>
                <span className="text-base font-extrabold text-slate-200">
                  {annualLivingFormatted} / yr
                </span>
                <span className="text-[10px] text-slate-500 block">
                  in {course.city}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Course Cost</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {totalCostFormatted}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  over {course.durationYears} Years
                </span>
              </div>
            </div>
          </div>

          {/* Post-Study Visa & Career Outcomes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" /> Post-Study Work Visa Rights
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Graduates are eligible for <span className="font-bold text-emerald-400">{course.postStudyWorkVisaYears} Years</span> of full post-study work authorization in {course.country}.
              </p>
              {course.isStem && (
                <p className="text-[11px] text-indigo-400 font-semibold">
                  ✓ STEM Designated: Qualified for full 3-year US OPT work authorization.
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Career & Salary Outcomes
              </h4>
              <p className="text-xs text-slate-300">
                Average Starting Graduate Salary: <span className="font-extrabold text-white">{salaryFormatted}/yr</span>
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {course.careerOutcomes.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Intakes & Deadlines */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white">Intake Deadlines</h3>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              {Object.entries(course.deadlines).map(([intake, dl]) => (
                <div key={intake} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{intake}</span>
                  <span className="text-amber-400 font-bold">{dl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onToggleCompare(course)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isCompared
                ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {isCompared ? "✓ In Compare Matrix" : "+ Add to Compare Matrix"}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
