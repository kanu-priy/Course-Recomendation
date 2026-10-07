"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Columns3,
  TrendingUp,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldCheck,
  Rocket,
  Target,
  Copy,
  Check,
  Award,
  Globe,
} from "lucide-react";
import { Course, ScoredCourse } from "@/types/course";
import { evaluateCourseMatch } from "@/lib/recommendationEngine";
import { StudentProfile } from "@/types/course";

interface ComparisonMatrixProps {
  isOpen: boolean;
  onClose: () => void;
  comparedCourses: Course[];
  onRemoveCourse: (courseId: string) => void;
  studentProfile: StudentProfile;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  isOpen,
  onClose,
  comparedCourses,
  onRemoveCourse,
  studentProfile,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Evaluate each course match for comparison rows
  const scoredList = comparedCourses.map((course) => ({
    course,
    match: evaluateCourseMatch(course, studentProfile),
  }));

  // Calculate 3-Year Estimated ROI
  const calculateROI = (c: Course) => {
    const totalCost = c.tuitionTotalUSD + c.livingCostAnnualUSD * c.durationYears;
    const totalEarnings3Yrs = c.avgGraduateSalaryUSD * 3;
    const netReturn = totalEarnings3Yrs - totalCost;
    const roiPercent = Math.round((netReturn / totalCost) * 100);
    return { totalCost, netReturn, roiPercent };
  };

  const handleCopySummary = () => {
    let summary = `🎓 *GRADGUIDE COURSE COMPARISON MATRIX FOR ALEX CHEN*\n\n`;
    scoredList.forEach(({ course, match }, idx) => {
      const { totalCost, roiPercent } = calculateROI(course);
      summary += `${idx + 1}. *${course.name}* - ${course.university} (${course.country})\n`;
      summary += `   • Tier: ${match.tier} (${match.eligibilityScore}% Match Fit)\n`;
      summary += `   • Total Cost: $${totalCost.toLocaleString()} USD | Avg Salary: $${course.avgGraduateSalaryUSD.toLocaleString()}/yr\n`;
      summary += `   • 3-Yr ROI: +${roiPercent}% | Post-Study Visa: ${course.postStudyWorkVisaYears} Years\n`;
      summary += `   • Requirement: Min GPA ${course.requirements.minGPA.toFixed(2)} | IELTS ${course.requirements.minIELTS}\n\n`;
    });

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Columns3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Feature 3: Side-by-Side Trade-off & ROI Comparison Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Comparing {comparedCourses.length} courses against student financial & visa requirements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Summary!" : "Copy Summary Sheet"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Matrix Body */}
        {comparedCourses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Columns3 className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No courses selected for comparison</p>
            <p className="text-xs text-slate-500">
              Click the "Compare" button on any course card to add it to this side-by-side trade-off matrix.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto p-6">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider w-44 min-w-[170px] rounded-tl-xl border-b border-slate-800">
                    Criteria
                  </th>
                  {scoredList.map(({ course, match }) => (
                    <th
                      key={course.id}
                      className="p-4 bg-slate-950/60 text-slate-200 min-w-[240px] border-b border-l border-slate-800 relative align-top"
                    >
                      <button
                        onClick={() => onRemoveCourse(course.id)}
                        className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove from matrix"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="space-y-1 pr-6">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold">
                          QS #{course.qsRanking}
                        </span>
                        <h4 className="font-bold text-sm text-white line-clamp-2">
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
              <tbody className="divide-y divide-slate-800">
                {/* Row 1: Admission Tier */}
                <tr>
                  <td className="p-3 font-semibold text-slate-300 bg-slate-950/40">
                    Admission Tier
                  </td>
                  {scoredList.map(({ course, match }) => (
                    <td key={course.id} className="p-4 border-l border-slate-800">
                      <div className="flex items-center gap-2">
                        {match.tier === "Safe" && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Safe Match
                          </span>
                        )}
                        {match.tier === "Moderate" && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30 flex items-center gap-1">
                            <Target className="w-3.5 h-3.5" /> Moderate
                          </span>
                        )}
                        {match.tier === "Reach" && (
                          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30 flex items-center gap-1">
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
                  <td className="p-3 font-semibold text-slate-300 bg-slate-950/40">
                    Total Study Cost
                  </td>
                  {scoredList.map(({ course }) => {
                    const { totalCost } = calculateROI(course);
                    return (
                      <td key={course.id} className="p-4 border-l border-slate-800">
                        <div className="space-y-0.5">
                          <span className="text-sm font-bold text-white">
                            ${totalCost.toLocaleString()} USD
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Tuition: ${course.tuitionTotalUSD.toLocaleString()} + Living: $
                            {(course.livingCostAnnualUSD * course.durationYears).toLocaleString()}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Row 3: Post-Study Work Visa */}
                <tr>
                  <td className="p-3 font-semibold text-slate-300 bg-slate-950/40">
                    PSW Visa Rights
                  </td>
                  {scoredList.map(({ course }) => (
                    <td key={course.id} className="p-4 border-l border-slate-800">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                        {course.postStudyWorkVisaYears} Years {course.isStem ? "(STEM OPT)" : ""}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row 4: 3-Year Estimated ROI */}
                <tr>
                  <td className="p-3 font-semibold text-slate-300 bg-slate-950/40">
                    Est. 3-Year ROI %
                  </td>
                  {scoredList.map(({ course }) => {
                    const { roiPercent, netReturn } = calculateROI(course);
                    return (
                      <td key={course.id} className="p-4 border-l border-slate-800">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>+{roiPercent}% ROI</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Net 3-Yr Gain: +${netReturn.toLocaleString()}
                        </p>
                      </td>
                    );
                  })}
                </tr>

                {/* Row 5: Min Requirements */}
                <tr>
                  <td className="p-3 font-semibold text-slate-300 bg-slate-950/40">
                    Entry Criteria
                  </td>
                  {scoredList.map(({ course }) => (
                    <td key={course.id} className="p-4 border-l border-slate-800 space-y-1">
                      <p>• Min GPA: <span className="font-semibold text-white">{course.requirements.minGPA}</span></p>
                      <p>• Min IELTS: <span className="font-semibold text-white">{course.requirements.minIELTS}</span></p>
                      <p>• GRE: <span className="font-semibold text-white">{course.requirements.greRequired}</span></p>
                      <p>• Min Work Exp: <span className="font-semibold text-white">{course.requirements.minWorkExpYears} Yrs</span></p>
                    </td>
                  ))}
                </tr>

                {/* Row 6: Intakes & Deadlines */}
                <tr>
                  <td className="p-3 font-semibold text-slate-300 bg-slate-950/40">
                    Intakes & Deadlines
                  </td>
                  {scoredList.map(({ course }) => (
                    <td key={course.id} className="p-4 border-l border-slate-800">
                      <p className="font-semibold text-slate-200 mb-1">
                        {course.intakes.join(", ")}
                      </p>
                      {Object.entries(course.deadlines).map(([intake, deadline]) => (
                        <p key={intake} className="text-[11px] text-amber-400">
                          {intake}: {deadline}
                        </p>
                      ))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
