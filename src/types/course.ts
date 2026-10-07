export type Country =
  | "United States"
  | "United Kingdom"
  | "Canada"
  | "Australia"
  | "Germany"
  | "Ireland";

export type DegreeLevel = "Master's" | "Bachelor's" | "Doctorate";

export type AdmissionTier = "Safe" | "Moderate" | "Reach";

export interface EntryRequirements {
  minGPA: number; // 4.0 scale normalized
  minIELTS: number;
  minTOEFL: number;
  greRequired: "Required" | "Optional" | "Waived" | "Not Required";
  minGREScore?: number;
  minWorkExpYears: number;
  targetMajors: string[];
}

export interface Course {
  id: string;
  name: string;
  university: string;
  country: Country;
  city: string;
  degreeLevel: DegreeLevel;
  qsRanking: number;
  tuitionAnnualUSD: number;
  tuitionTotalUSD: number;
  durationYears: number;
  livingCostAnnualUSD: number;
  currency: string;
  intakes: string[];
  deadlines: Record<string, string>;
  isStem: boolean;
  postStudyWorkVisaYears: number;
  requirements: EntryRequirements;
  avgGraduateSalaryUSD: number;
  careerOutcomes: string[];
  acceptanceRate: number; // e.g. 15 for 15%
  description: string;
  tags: string[];
  featuredImageUrl?: string;
}

export interface StudentProfile {
  gpa?: number; // e.g. 3.4
  gpaScale: "4.0" | "10.0";
  ielts?: number; // e.g. 7.5
  toefl?: number; // e.g. 100
  gre?: number; // e.g. 320
  workExperienceYears: number; // e.g. 2
  maxBudgetUSD: number; // annual or total limit
  budgetPeriod: "annual" | "total";
  targetIntake: string;
  preferredCountries: Country[];
  preferredField: string;
  degreeLevel: DegreeLevel;
  stemOnly: boolean;
  searchKeyword: string;
}

export interface MatchDetails {
  tier: AdmissionTier;
  eligibilityScore: number; // 0 - 100
  gpaFit: "Exceeds" | "Meets" | "Below" | "Not Provided";
  englishFit: "Meets" | "Below" | "Not Provided";
  workExpFit: "Meets" | "Exceeds" | "Below";
  budgetFit: "Within Budget" | "Exceeds Budget" | "No Limit Set";
  scoreBreakdown: {
    gpaScore: number;
    englishScore: number;
    workExpScore: number;
    selectivityAdjust: number;
  };
  whyRelevant: string[]; // Explicit explanation for counsellor
  reasons: string[]; // Backward compatible match reasons list
  missingRequirements: string[];
  highlights: string[];
  incompleteWarnings: string[]; // Flags for missing profile info
}

export interface ScoredCourse {
  course: Course;
  match: MatchDetails;
}

export interface ExtractedContext {
  gpa?: number;
  gpaScale?: "4.0" | "10.0";
  ielts?: number;
  toefl?: number;
  gre?: number;
  budgetUSD?: number;
  countries?: Country[];
  field?: string;
  workExpYears?: number;
  targetIntake?: string;
  stemOnly?: boolean;
  confidence: number;
  rawNote: string;
  extractedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
  suggestedCourses?: Course[];
}
