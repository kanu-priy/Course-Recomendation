"use client";

import React, { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  FileText,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Target,
  Rocket,
  Printer,
} from "lucide-react";
import { StudentProfile, Course, ScoredCourse } from "@/types/course";

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentProfile;
  sessionNotes: string;
  scoredCourses: ScoredCourse[];
  shortlist: Course[];
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  sessionNotes,
  scoredCourses,
  shortlist,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const topRecommendations = scoredCourses.slice(0, 6);

  const generateMarkdownReport = () => {
    let doc = `# GRADGUIDE COUNSELLING SUMMARY REPORT\n`;
    doc += `**Date:** ${new Date().toLocaleDateString()}\n`;
    doc += `**Student Name:** Alex Chen | **Advisor:** Sarah Jenkins\n\n`;

    doc += `## 1. Student Academic Profile\n`;
    doc += `- **GPA:** ${studentProfile.gpa} (Scale: ${studentProfile.gpaScale})\n`;
    doc += `- **English Test:** IELTS ${studentProfile.ielts || "N/A"} / TOEFL ${studentProfile.toefl || "N/A"}\n`;
    doc += `- **Work Experience:** ${studentProfile.workExperienceYears} Years\n`;
    doc += `- **Max Budget:** $${studentProfile.maxBudgetUSD.toLocaleString()} USD (${studentProfile.budgetPeriod})\n`;
    doc += `- **Preferred Destinations:** ${studentProfile.preferredCountries.join(", ") || "All International"}\n\n`;

    doc += `## 2. Counsellor Session Notes\n`;
    doc += `> ${sessionNotes || "No specific session notes recorded."}\n\n`;

    doc += `## 3. Recommended Course Shortlist\n`;
    topRecommendations.forEach(({ course, match }, idx) => {
      doc += `### ${idx + 1}. ${course.name} - ${course.university} (${course.country})\n`;
      doc += `- **Admission Tier:** ${match.tier} (${match.eligibilityScore}% Fit Score)\n`;
      doc += `- **Total Tuition:** $${course.tuitionTotalUSD.toLocaleString()} USD | **QS Rank:** #${course.qsRanking}\n`;
      doc += `- **PSW Visa Rights:** ${course.postStudyWorkVisaYears} Years ${course.isStem ? "(STEM Designated)" : ""}\n`;
      doc += `- **Avg Graduate Salary:** $${course.avgGraduateSalaryUSD.toLocaleString()}/yr\n`;
      doc += `- **Match Summary:** ${(match.whyRelevant || match.reasons || []).join(" ")}\n\n`;
    });

    return doc;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Export Session Summary Sheet
              </h2>
              <p className="text-xs text-slate-400">
                Send structured recommendation report to student post-call
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 font-mono bg-slate-950">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-blue-400">GRADGUIDE ADVISORY REPORT</h3>
                <p className="text-[11px] text-slate-400">Generated for Alex Chen</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>GPA: <span className="text-white font-bold">{studentProfile.gpa}</span></div>
              <div>IELTS: <span className="text-white font-bold">{studentProfile.ielts || "7.5"}</span></div>
              <div>Budget: <span className="text-amber-400 font-bold">${studentProfile.maxBudgetUSD.toLocaleString()}</span></div>
              <div>Countries: <span className="text-purple-300 font-bold">{studentProfile.preferredCountries.join(", ") || "All"}</span></div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Session Notes:</span>
              <p className="text-slate-200 italic">{sessionNotes || "No notes recorded."}</p>
            </div>

            {/* Recommendations List */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="font-bold text-slate-200 text-xs">Recommended Course Shortlist ({topRecommendations.length} Options):</span>
              <div className="space-y-2">
                {topRecommendations.map(({ course, match }, idx) => (
                  <div
                    key={course.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-bold text-white">{idx + 1}. {course.name}</span>
                      <p className="text-slate-400">{course.university} ({course.country}) • Total Cost: ${course.tuitionTotalUSD.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        match.tier === "Safe"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : match.tier === "Moderate"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-purple-500/20 text-purple-300"
                      }`}>
                        {match.tier}
                      </span>
                      <p className="text-[10px] text-blue-400 font-bold mt-0.5">{match.eligibilityScore}% Fit</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied to Clipboard!" : "Copy Formatted Report"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
