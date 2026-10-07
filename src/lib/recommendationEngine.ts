import { Course, StudentProfile, MatchDetails, ScoredCourse, AdmissionTier } from "@/types/course";
import rawCourses from "@/data/courses.json";

const coursesData: Course[] = (rawCourses as unknown) as Course[];

export function normalizeGPA(gpa: number, scale: "4.0" | "10.0"): number {
  if (scale === "10.0") {
    return Math.min(4.0, (gpa / 10.0) * 4.0);
  }
  return Math.min(4.0, Math.max(0, gpa));
}

export function evaluateCourseMatch(course: Course, profile: StudentProfile): MatchDetails {
  const incompleteWarnings: string[] = [];
  
  // 1. GPA Evaluation & Incomplete Handling
  let normGPA = 3.2; // Default baseline if missing
  let gpaFit: MatchDetails["gpaFit"] = "Meets";
  let gpaScore = 25;

  if (profile.gpa !== undefined && profile.gpa > 0) {
    normGPA = normalizeGPA(profile.gpa, profile.gpaScale);
    const minGPA = course.requirements.minGPA;
    const gpaDiff = normGPA - minGPA;

    if (gpaDiff >= 0.3) {
      gpaScore = 35;
      gpaFit = "Exceeds";
    } else if (gpaDiff >= 0) {
      gpaScore = 28 + (gpaDiff / 0.3) * 7;
      gpaFit = "Meets";
    } else if (gpaDiff >= -0.3) {
      gpaScore = Math.max(10, 25 + gpaDiff * 50);
      gpaFit = "Below";
    } else {
      gpaScore = 5;
      gpaFit = "Below";
    }
  } else {
    gpaFit = "Not Provided";
    incompleteWarnings.push("GPA not provided by student - using estimated baseline.");
  }

  // 2. English Score & Incomplete Handling
  let englishScore = 20;
  let englishFit: MatchDetails["englishFit"] = "Meets";
  if (profile.ielts !== undefined && profile.ielts > 0) {
    if (profile.ielts < course.requirements.minIELTS) {
      englishScore = 8;
      englishFit = "Below";
    }
  } else if (profile.toefl !== undefined && profile.toefl > 0) {
    if (profile.toefl < course.requirements.minTOEFL) {
      englishScore = 8;
      englishFit = "Below";
    }
  } else {
    englishFit = "Not Provided";
    incompleteWarnings.push("Language test score missing - verify IELTS/TOEFL waiver eligibility.");
  }

  // 3. Work Experience Score
  let workExpScore = 15;
  let workExpFit: MatchDetails["workExpFit"] = "Meets";
  const requiredExp = course.requirements.minWorkExpYears;
  if (profile.workExperienceYears > requiredExp + 1) {
    workExpScore = 15;
    workExpFit = "Exceeds";
  } else if (profile.workExperienceYears >= requiredExp) {
    workExpScore = 13;
    workExpFit = "Meets";
  } else {
    workExpScore = 5;
    workExpFit = "Below";
  }

  // 4. Budget Score & Fit
  const courseCost =
    profile.budgetPeriod === "annual"
      ? course.tuitionAnnualUSD
      : course.tuitionTotalUSD;
  
  let budgetFit: MatchDetails["budgetFit"] = "Within Budget";
  let budgetScore = 15;

  if (profile.maxBudgetUSD > 0) {
    if (courseCost <= profile.maxBudgetUSD) {
      budgetScore = 15;
      budgetFit = "Within Budget";
    } else {
      const overagePercent = (courseCost - profile.maxBudgetUSD) / profile.maxBudgetUSD;
      if (overagePercent <= 0.15) {
        budgetScore = 10;
        budgetFit = "Within Budget";
      } else {
        budgetScore = Math.max(0, 15 - overagePercent * 20);
        budgetFit = "Exceeds Budget";
      }
    }
  } else {
    budgetFit = "No Limit Set";
    incompleteWarnings.push("Budget limit not set - showing standard tuition fees.");
  }

  // 5. Selectivity Adjust
  let selectivityAdjust = 15;
  if (course.acceptanceRate <= 15) {
    selectivityAdjust = 5;
  } else if (course.acceptanceRate <= 30) {
    selectivityAdjust = 10;
  } else {
    selectivityAdjust = 15;
  }

  const rawTotalScore = Math.min(100, Math.round(gpaScore + englishScore + workExpScore + budgetScore + selectivityAdjust));
  const eligibilityScore = rawTotalScore;

  // Tier Assignment
  let tier: AdmissionTier = "Moderate";
  const minGPA = course.requirements.minGPA;
  const gpaDiff = normGPA - minGPA;
  const isHighlySelective = course.acceptanceRate < 15;
  const isGpaDeficit = gpaFit === "Below";

  if (isHighlySelective || isGpaDeficit || eligibilityScore < 60) {
    tier = "Reach";
  } else if (gpaDiff >= 0.25 && eligibilityScore >= 75 && course.acceptanceRate >= 25) {
    tier = "Safe";
  } else {
    tier = "Moderate";
  }

  // Explicit Explainability Rationale ("Why This Course?")
  const whyRelevant: string[] = [];
  const missingRequirements: string[] = [];
  const highlights: string[] = [];

  if (gpaFit === "Exceeds") {
    whyRelevant.push(`Academic Profile: Student's GPA (${normGPA.toFixed(2)}) exceeds min threshold of ${minGPA.toFixed(2)}.`);
  } else if (gpaFit === "Meets") {
    whyRelevant.push(`Academic Alignment: Student satisfies the program's min GPA requirement of ${minGPA.toFixed(2)}.`);
  } else if (gpaFit === "Below") {
    whyRelevant.push(`Academic Challenge: GPA (${normGPA.toFixed(2)}) is below standard threshold of ${minGPA.toFixed(2)}. Suggest highlighting work experience.`);
    missingRequirements.push(`GPA Target: ${minGPA.toFixed(2)} (Student: ${normGPA.toFixed(2)})`);
  }

  if (course.isStem) {
    whyRelevant.push(`Visa Advantage: STEM Designated program granting up to ${course.postStudyWorkVisaYears} years of post-study work authorization.`);
    highlights.push(`STEM Designated: ${course.postStudyWorkVisaYears}-Yr Post-Study Work Visa`);
  } else {
    highlights.push(`${course.postStudyWorkVisaYears}-Yr Post-Study Work Visa`);
  }

  if (budgetFit === "Within Budget") {
    whyRelevant.push(`Financial Viability: Tuition ($${courseCost.toLocaleString()}) fits within student's budget ($${profile.maxBudgetUSD.toLocaleString()}).`);
    highlights.push(`Within Budget ($${courseCost.toLocaleString()})`);
  } else if (budgetFit === "Exceeds Budget") {
    whyRelevant.push(`Financial Stretch: Tuition ($${courseCost.toLocaleString()}) exceeds stated budget ($${profile.maxBudgetUSD.toLocaleString()}).`);
    missingRequirements.push(`Tuition ($${courseCost.toLocaleString()}) exceeds budget ($${profile.maxBudgetUSD.toLocaleString()})`);
  }

  whyRelevant.push(`Career Outcome: Avg starting salary of $${course.avgGraduateSalaryUSD.toLocaleString()}/yr with top roles in ${course.careerOutcomes.slice(0, 2).join(", ")}.`);

  return {
    tier,
    eligibilityScore,
    gpaFit,
    englishFit,
    workExpFit,
    budgetFit,
    scoreBreakdown: {
      gpaScore: Math.round(gpaScore),
      englishScore: Math.round(englishScore),
      workExpScore: Math.round(workExpScore),
      selectivityAdjust: Math.round(selectivityAdjust),
    },
    whyRelevant,
    reasons: whyRelevant,
    missingRequirements,
    highlights,
    incompleteWarnings,
  };
}

export function searchAndScoreCourses(
  profile: StudentProfile,
  allCourses: Course[] = coursesData
): ScoredCourse[] {
  let filtered = allCourses;

  if (profile.preferredCountries.length > 0) {
    filtered = filtered.filter((c) =>
      profile.preferredCountries.includes(c.country)
    );
  }

  if (profile.degreeLevel) {
    filtered = filtered.filter(
      (c) => c.degreeLevel.toLowerCase() === profile.degreeLevel.toLowerCase()
    );
  }

  if (profile.stemOnly) {
    filtered = filtered.filter((c) => c.isStem);
  }

  if (profile.preferredField || profile.searchKeyword) {
    const query = (profile.preferredField + " " + profile.searchKeyword).toLowerCase().trim();
    if (query.length > 0) {
      filtered = filtered.filter((c) => {
        const textToSearch = (
          c.name +
          " " +
          c.university +
          " " +
          c.country +
          " " +
          c.description +
          " " +
          c.tags.join(" ") +
          " " +
          c.requirements.targetMajors.join(" ")
        ).toLowerCase();

        const queryWords = query.split(/\s+/).filter(w => w.length > 2);
        if (queryWords.length === 0) return true;
        return queryWords.some((w) => textToSearch.includes(w));
      });
    }
  }

  const scored = filtered.map((course) => {
    const match = evaluateCourseMatch(course, profile);
    return { course, match };
  });

  return scored.sort((a, b) => b.match.eligibilityScore - a.match.eligibilityScore);
}

// Requirement from PDF: "Allow the counsellor to explore alternative recommendations"
export function findAlternativeRecommendations(
  targetCourse: Course,
  profile: StudentProfile,
  allCourses: Course[] = coursesData
): Course[] {
  return allCourses
    .filter(
      (c) =>
        c.id !== targetCourse.id &&
        (c.country !== targetCourse.country || c.tuitionTotalUSD < targetCourse.tuitionTotalUSD)
    )
    .slice(0, 3);
}
