"use client";

import React from "react";
import {
  Search,
  Filter,
  DollarSign,
  Globe,
  RotateCcw,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { StudentProfile, Country } from "@/types/course";

interface FilterControlsProps {
  profile: StudentProfile;
  onChangeProfile: (profile: StudentProfile) => void;
  onReset: () => void;
  totalMatchesCount: number;
}

const ALL_COUNTRIES: { name: Country; flag: string }[] = [
  { name: "United States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Ireland", flag: "🇮🇪" },
];

const FIELDS_LIST = [
  "All Disciplines",
  "Computer Science",
  "Data Science",
  "Artificial Intelligence",
  "Business Analytics",
  "Cybersecurity",
  "Robotics",
  "Mechanical Engineering",
];

export const FilterControls: React.FC<FilterControlsProps> = ({
  profile,
  onChangeProfile,
  onReset,
  totalMatchesCount,
}) => {
  const toggleCountry = (country: Country) => {
    const exists = profile.preferredCountries.includes(country);
    const updated = exists
      ? profile.preferredCountries.filter((c) => c !== country)
      : [...profile.preferredCountries, country];
    onChangeProfile({ ...profile, preferredCountries: updated });
  };

  return (
    <div className="flex flex-col gap-3.5 p-3.5 sm:p-5 bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-xl text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 uppercase tracking-wider text-xs">
              Recommendation Match Filters
            </h3>
            <p className="text-[11px] text-slate-400">
              <strong className="text-indigo-400 font-semibold">{totalMatchesCount}</strong> eligible courses matched against student profile
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-[11px] font-semibold transition-all active:scale-95"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" /> Reset Filters
        </button>
      </div>

      {/* Row 1: Search & Discipline Selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
        <div className="relative md:col-span-8">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={profile.searchKeyword}
            onChange={(e) =>
              onChangeProfile({ ...profile, searchKeyword: e.target.value })
            }
            placeholder="Search by university name, major, tech stack, or keyword..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 text-xs"
          />
        </div>

        <div className="relative md:col-span-4">
          <select
            value={profile.preferredField || "All Disciplines"}
            onChange={(e) =>
              onChangeProfile({
                ...profile,
                preferredField: e.target.value === "All Disciplines" ? "" : e.target.value,
              })
            }
            className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 text-xs cursor-pointer font-medium"
          >
            {FIELDS_LIST.map((f) => (
              <option key={f} value={f} className="bg-slate-900 text-slate-200">
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Destination Country Pills */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-cyan-400" /> Destination Countries (click to filter):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {ALL_COUNTRIES.map((c) => {
            const isSelected = profile.preferredCountries.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggleCountry(c.name)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-indigo-600/25 text-indigo-300 border-indigo-500/50 shadow-sm shadow-indigo-500/20"
                    : "bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Academic Scores & Budget (Responsive 1-col on mobile, 2-col on tablet, 4-col on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {/* GPA */}
        <div className="space-y-1 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Candidate GPA ({profile.gpaScale})
          </label>
          <div className="flex gap-1">
            <input
              type="number"
              step="0.1"
              min="0"
              max={profile.gpaScale === "4.0" ? 4.0 : 10.0}
              value={profile.gpa || ""}
              onChange={(e) =>
                onChangeProfile({
                  ...profile,
                  gpa: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
            <button
              onClick={() =>
                onChangeProfile({
                  ...profile,
                  gpaScale: profile.gpaScale === "4.0" ? "10.0" : "4.0",
                })
              }
              className="px-2 py-1 rounded-lg bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700 hover:bg-slate-700 active:scale-95"
              title="Toggle 4.0 or 10.0 CGPA scale"
            >
              {profile.gpaScale}
            </button>
          </div>
        </div>

        {/* IELTS */}
        <div className="space-y-1 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            IELTS Test Score
          </label>
          <input
            type="number"
            step="0.5"
            min="4.0"
            max="9.0"
            value={profile.ielts || ""}
            onChange={(e) =>
              onChangeProfile({
                ...profile,
                ielts: parseFloat(e.target.value) || undefined,
              })
            }
            placeholder="e.g. 7.5"
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono text-xs"
          />
        </div>

        {/* Max Budget */}
        <div className="space-y-1 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Max Tuition Budget ($ USD)
          </label>
          <input
            type="number"
            step="5000"
            value={profile.maxBudgetUSD || ""}
            onChange={(e) =>
              onChangeProfile({
                ...profile,
                maxBudgetUSD: parseInt(e.target.value, 10) || 0,
              })
            }
            placeholder="e.g. 40000"
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono text-xs"
          />
        </div>

        {/* Work Experience */}
        <div className="space-y-1 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/70">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Work Experience (Years)
          </label>
          <input
            type="number"
            min="0"
            max="15"
            value={profile.workExperienceYears || 0}
            onChange={(e) =>
              onChangeProfile({
                ...profile,
                workExperienceYears: parseInt(e.target.value, 10) || 0,
              })
            }
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono text-xs"
          />
        </div>
      </div>

      {/* Row 3: STEM Filter & Budget Period Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={profile.stemOnly}
            onChange={(e) =>
              onChangeProfile({ ...profile, stemOnly: e.target.checked })
            }
            className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
          />
          <span className="font-bold text-emerald-400 text-xs">STEM Designated Only (3-Year OPT / Extended Visa)</span>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium text-[11px]">Budget Scope:</span>
          <button
            onClick={() =>
              onChangeProfile({
                ...profile,
                budgetPeriod: profile.budgetPeriod === "annual" ? "total" : "annual",
              })
            }
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 uppercase font-bold text-[10px] transition-all"
          >
            {profile.budgetPeriod} Tuition
          </button>
        </div>
      </div>
    </div>
  );
};
