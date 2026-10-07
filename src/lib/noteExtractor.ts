import { ExtractedContext, Country } from "@/types/course";

export function extractContextFromNotes(noteText: string): ExtractedContext {
  const text = noteText.toLowerCase();
  const context: ExtractedContext = {
    confidence: 0.85,
    rawNote: noteText,
    extractedAt: new Date().toLocaleTimeString(),
  };

  // 1. Detect GPA / CGPA
  // Examples: "3.5 gpa", "gpa 3.8", "8.5 cgpa", "cgpa 7.8/10", "3.4 / 4.0"
  const gpaTenMatch = text.match(/(?:cgpa|gpa)?\s*([6-9]\.\d{1,2}|10\.0)\s*(?:\/10|cgpa|out of 10)?/i);
  const gpaFourMatch = text.match(/(?:gpa|cgpa)?\s*([2-3]\.\d{1,2}|4\.0)\s*(?:\/4|gpa|out of 4)?/i);

  if (text.includes("cgpa") || text.includes("/10") || text.includes("out of 10")) {
    const cgpaVal = text.match(/([5-9]\.\d{1,2}|10\.0)/);
    if (cgpaVal) {
      context.gpa = parseFloat(cgpaVal[1]);
      context.gpaScale = "10.0";
    }
  } else if (gpaFourMatch) {
    context.gpa = parseFloat(gpaFourMatch[1]);
    context.gpaScale = "4.0";
  } else if (gpaTenMatch) {
    context.gpa = parseFloat(gpaTenMatch[1]);
    context.gpaScale = "10.0";
  }

  // 2. Detect IELTS / TOEFL / GRE
  // Examples: "ielts 7.5", "ielts score 7.0", "toefl 100", "gre 320"
  const ieltsMatch = text.match(/ielts\s*(?:score|of)?\s*([5-9](?:\.[05])?)/i);
  if (ieltsMatch) {
    context.ielts = parseFloat(ieltsMatch[1]);
  }

  const toeflMatch = text.match(/toefl\s*(?:score|of)?\s*(7[0-9]|8[0-9]|9[0-9]|1[0-1][0-9]|120)/i);
  if (toeflMatch) {
    context.toefl = parseInt(toeflMatch[1], 10);
  }

  const greMatch = text.match(/gre\s*(?:score|of)?\s*(2[9][0-9]|3[0-3][0-9]|340)/i);
  if (greMatch) {
    context.gre = parseInt(greMatch[1], 10);
  }

  // 3. Detect Budget
  // Examples: "under 35k", "$40000", "40k usd", "max 30,000", "30000 dollars"
  const budgetKMatch = text.match(/(?:budget|under|max|around|\$)\s*(\d{2,3})\s*k/i);
  const budgetFullMatch = text.match(/(?:budget|under|max|around|\$)?\s*\$?(\d{2,3},\d{3}|\d{5,6})\s*(?:usd|dollars|\$)?/i);

  if (budgetKMatch) {
    context.budgetUSD = parseInt(budgetKMatch[1], 10) * 1000;
  } else if (budgetFullMatch) {
    const rawVal = budgetFullMatch[1].replace(/,/g, "");
    const parsed = parseInt(rawVal, 10);
    if (parsed >= 10000 && parsed <= 150000) {
      context.budgetUSD = parsed;
    }
  }

  // 4. Detect Countries
  const detectedCountries: Country[] = [];
  if (text.includes("us") || text.includes("usa") || text.includes("united states") || text.includes("america")) {
    detectedCountries.push("United States");
  }
  if (text.includes("uk") || text.includes("united kingdom") || text.includes("britain") || text.includes("england")) {
    detectedCountries.push("United Kingdom");
  }
  if (text.includes("canada") || text.includes("canadian")) {
    detectedCountries.push("Canada");
  }
  if (text.includes("australia") || text.includes("aussie") || text.includes("sydney") || text.includes("melbourne")) {
    detectedCountries.push("Australia");
  }
  if (text.includes("germany") || text.includes("german") || text.includes("munich")) {
    detectedCountries.push("Germany");
  }
  if (text.includes("ireland") || text.includes("dublin") || text.includes("irish")) {
    detectedCountries.push("Ireland");
  }
  if (detectedCountries.length > 0) {
    context.countries = Array.from(new Set(detectedCountries));
  }

  // 5. Detect Fields / Specializations
  const fields = [
    { key: "computer science", name: "Computer Science" },
    { key: "data science", name: "Data Science" },
    { key: "artificial intelligence", name: "Artificial Intelligence" },
    { key: "ai", name: "Artificial Intelligence" },
    { key: "machine learning", name: "Data Science" },
    { key: "business analytics", name: "Business Analytics" },
    { key: "cybersecurity", name: "Cybersecurity" },
    { key: "robotics", name: "Robotics" },
    { key: "mechanical engineering", name: "Mechanical Engineering" },
    { key: "software engineering", name: "Software Engineering" },
    { key: "information technology", name: "Information Technology" },
  ];

  for (const f of fields) {
    if (text.includes(f.key)) {
      context.field = f.name;
      break;
    }
  }

  // 6. Detect Work Experience
  // Examples: "2 years work exp", "3 yrs experience", "1 year exp"
  const expMatch = text.match(/(\d+)\s*(?:yrs|years|year|yr)\s*(?:of)?\s*(?:work\s*)?(?:exp|experience)?/i);
  if (expMatch) {
    const val = parseInt(expMatch[1], 10);
    if (val >= 0 && val <= 15) {
      context.workExpYears = val;
    }
  }

  // 7. Detect Intake
  if (text.includes("fall 2025")) context.targetIntake = "Fall 2025";
  else if (text.includes("spring 2026")) context.targetIntake = "Spring 2026";
  else if (text.includes("winter 2026")) context.targetIntake = "Winter 2026";

  // 8. Detect STEM preference
  if (text.includes("stem") || text.includes("opt")) {
    context.stemOnly = true;
  }

  return context;
}
