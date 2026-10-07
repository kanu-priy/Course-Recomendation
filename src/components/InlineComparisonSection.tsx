"use client";

import React, { useState } from "react";
import {
  Columns3,
  X,
  TrendingUp,
  ShieldCheck,
  Target,
  Rocket,
  Copy,
  Check,
  DollarSign,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { Course, StudentProfile } from "@/types/course";
import { evaluateCourseMatch } from "@/lib/recommendationEngine";
import { CurrencyCode, formatCurrency } from "@/lib/currencyConverter";

interface InlineComparisonSectionProps {
  comparedCourses: Course[];
  onRemoveCourse: (courseId: string) => void;
  studentProfile: StudentProfile;
  currency: CurrencyCode;
}

export const InlineComparisonSection: React.FC<InlineComparisonSectionProps> = ({
  comparedCourses,
  onRemoveCourse,
  studentProfile,
  currency,
}) => {
  const [copied, setCopied] = useState(false);

  const scoredList = comparedCourses.map((course) => ({
    course,
    match: evaluateCourseMatch(course, studentProfile),
  }));

  const calculateROI = (c: Course) => {
    const totalCost = c.tuitionTotalUSD + c.livingCostAnnualUSD * c.durationYears;
    const totalEarnings3Yrs = c.avgGraduateSalaryUSD * 3;
    const netReturn = totalEarnings3Yrs - totalCost;
    const roiPercent = Math.round((netReturn / totalCost) * 100);
    return { totalCost, netReturn, roiPercent };
  };

  const handleCopySummary = () => {
    let summary = `🎓 *GRADGUIDE COURSE COMPARISON MATRIX*\n\n`;
    scoredList.forEach(({ course, match }, idx) => {
      const { totalCost, roiPercent } = calculateROI(course);
      summary += `${idx + 1}. *${course.name}* - ${course.university} (${course.country})\n`;
      summary += `   • Admission Tier: ${match.tier} (${match.eligibilityScore}% Fit Score)\n`;
      summary += `   • Total Cost: ${formatCurrency(totalCost, currency)} | Avg Starting Salary: ${formatCurrency(course.avgGraduateSalaryUSD, currency)}/yr\n`;
      summary += `   • 3-Yr ROI: +${roiPercent}% | Post-Study Work Visa: ${course.postStudyWorkVisaYears} Years\n\n`;
    });

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="compare-section" className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Columns3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Feature 3: Side-by-Side Trade-off & ROI Comparison Matrix
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {comparedCourses.length} Courses Selected
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Inline financial, post-study visa duration, and ROI comparison table ({currency})
            </p>
          </div>
        </div>

        {comparedCourses.length > 0 && (
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Matrix Sheet!" : "Copy Formatted Matrix"}</span>
          </button>
        )}
      </div>

      {/* Body */}
      {comparedCourses.length === 0 ? (
        <div className="p-8 text-center text-slate-400 space-y-2 bg-slate-950/50 rounded-xl border border-slate-800/80">
          <Columns3 className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-semibold">No courses added to matrix yet</p>
          <p className="text-xs text-slate-500">
            Click the <strong className="text-indigo-400">+ Compare</strong> button on any course card in the Safe, Moderate, or Reach columns above to inspect side-by-side trade-offs right here!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800">
                <th className="p-3.5 text-slate-400 font-bold uppercase tracking-wider w-40 min-w-[160px]">
                  Comparison Field
                </th>
                {scoredList.map(({ course, match }) => (
                  <th
                    key={course.id}
                    className="p-4 text-slate-200 min-w-[230px] border-l border-slate-800 relative align-top"
                  >
                    <button
                      onClick={() => onRemoveCourse(course.id)}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove from matrix"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="space-y-1 pr-6">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold border border-slate-700">
                        QS #{course.qsRanking}
                      </span>
                      <h4 className="font-bold text-sm text-white line-clamp-1">
                        {course.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {course.university} ({course.country})
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {/* Row 1: Admission Tier */}
              <tr>
                <td className="p-3.5 font-semibold text-slate-300 bg-slate-900/30">
                  Admission Tier
                </td>
                {scoredList.map(({ course, match }) => (
                  <td key={course.id} className="p-4 border-l border-slate-800">
                    <div className="flex items-center gap-2">
                      {match.tier === "Safe" && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Safe
                        </span>
                      )}
                      {match.tier === "Moderate" && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40 flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" /> Moderate
                        </span>
                      )}
                      {match.tier === "Reach" && (
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 flex items-center gap-1">
                          <Rocket className="w-3.5 h-3.5" /> Reach
                        </span>
                      )}
                      <span className="font-bold text-blue-400">
                        {match.eligibilityScore}% Fit
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 2: Total Study Cost */}
              <tr>
                <td className="p-3.5 font-semibold text-slate-300 bg-slate-900/30">
                  Total Study Cost
                </td>
                {scoredList.map(({ course }) => {
                  const { totalCost } = calculateROI(course);
                  return (
                    <td key={course.id} className="p-4 border-l border-slate-800">
                      <span className="text-sm font-bold text-white">
                        {formatCurrency(totalCost, currency)}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Tuition: {formatCurrency(course.tuitionTotalUSD, currency)} + Living: {formatCurrency(course.livingCostAnnualUSD * course.durationYears, currency)}
                      </p>
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Post-Study Work Visa */}
              <tr>
                <td className="p-3.5 font-semibold text-slate-300 bg-slate-900/30">
                  PSW Visa Rights
                </td>
                {scoredList.map(({ course }) => (
                  <td key={course.id} className="p-4 border-l border-slate-800">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                      {course.postStudyWorkVisaYears} Years {course.isStem ? "(STEM OPT)" : ""}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: 3-Year Estimated ROI */}
              <tr>
                <td className="p-3.5 font-semibold text-slate-300 bg-slate-900/30">
                  Est. 3-Year ROI %
                </td>
                {scoredList.map(({ course }) => {
                  const { roiPercent, netReturn } = calculateROI(course);
                  return (
                    <td key={course.id} className="p-4 border-l border-slate-800">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>+{roiPercent}% ROI</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Net Gain: +{formatCurrency(netReturn, currency)}
                      </p>
                    </td>
                  );
                })}
              </tr>

              {/* Row 5: Min GPA & Test Scores */}
              <tr>
                <td className="p-3.5 font-semibold text-slate-300 bg-slate-900/30">
                  Entry Requirements
                </td>
                {scoredList.map(({ course }) => (
                  <td key={course.id} className="p-4 border-l border-slate-800 space-y-1 text-[11px]">
                    <p>• Min GPA: <span className="font-semibold text-white">{course.requirements.minGPA}</span></p>
                    <p>• Min IELTS: <span className="font-semibold text-white">{course.requirements.minIELTS}</span></p>
                    <p>• GRE: <span className="font-semibold text-white">{course.requirements.greRequired}</span></p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
