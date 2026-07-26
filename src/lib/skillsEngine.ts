import { SkillsModuleState, CalculatedSkillsMetrics } from "@/types/skills";

export function calculateProfessionalCapitalScore(state: SkillsModuleState): CalculatedSkillsMetrics {
  // 1. Technical Skills Score (Max 100, Weight 20%)
  let techPoints = 0;
  if (state.technicalSkills.length > 0) {
    const totalLevelScore = state.technicalSkills.reduce((acc, skill) => {
      const levelMultiplier = skill.level === 'Expert' ? 25 : skill.level === 'Advanced' ? 20 : skill.level === 'Intermediate' ? 15 : 10;
      const ratingBonus = (skill.selfRating || 3) * 2;
      return acc + levelMultiplier + ratingBonus;
    }, 0);
    techPoints = Math.min(100, Math.round(totalLevelScore / Math.max(1, state.technicalSkills.length / 3)));
  } else {
    techPoints = 30; // Baseline
  }

  // 2. Industry Skills Score (Max 100, Weight 15%)
  let industryPoints = 0;
  if (state.industrySkills.length > 0) {
    const totalInd = state.industrySkills.reduce((acc, skill) => {
      const prof = skill.proficiency === 'Expert' ? 25 : skill.proficiency === 'Advanced' ? 20 : skill.proficiency === 'Intermediate' ? 15 : 10;
      return acc + prof + Math.min(10, skill.yearsExp * 2);
    }, 0);
    industryPoints = Math.min(100, Math.round(totalInd / Math.max(1, state.industrySkills.length / 2.5)));
  } else {
    industryPoints = 35;
  }

  // 3. Project Score (Max 100, Weight 10%)
  let projectPoints = Math.min(100, state.projects.length * 25 + (state.projects.filter(p => p.liveDemoUrl || p.githubUrl).length * 15));
  if (state.projects.length === 0) projectPoints = 20;

  // 4. Certification Score (Max 100, Weight 10%)
  let certPoints = Math.min(100, state.certifications.length * 30 + (state.certifications.filter(c => c.verificationUrl).length * 10));
  if (state.certifications.length === 0) certPoints = 15;

  // 5. Work Experience Score (Max 100, Weight 10%)
  let expPoints = 40;
  const we = state.workExperience;
  if (we.persona === 'Student') {
    expPoints = Math.min(100, (we.student.internships ? 30 : 0) + (we.student.industrialTraining ? 20 : 0) + (we.student.freelancingDetails ? 25 : 0) + (we.student.researchWork ? 25 : 0));
  } else if (we.persona === 'Employee') {
    expPoints = Math.min(100, Math.round(we.employee.totalYearsExp * 15) + (we.employee.keyAchievements ? 25 : 0));
  } else if (we.persona === 'Founder') {
    expPoints = Math.min(100, (we.founder.revenueStage ? 40 : 20) + (we.founder.fundingStage ? 35 : 15) + 25);
  }
  expPoints = Math.max(25, expPoints);

  // 6. Leadership Score (Max 100, Weight 10%)
  let leadershipPoints = Math.min(100, state.leadership.length * 28 + 20);
  if (state.leadership.length === 0) leadershipPoints = 25;

  // 7. Communication & Languages Score (Max 100, Weight 10%)
  let commPoints = 30;
  if (state.languages.length > 0) {
    const langScore = state.languages.reduce((acc, l) => {
      const p = l.proficiency === 'Native' ? 30 : l.proficiency === 'Advanced' ? 25 : l.proficiency === 'Intermediate' ? 18 : 10;
      const skills = (l.read ? 5 : 0) + (l.write ? 5 : 0) + (l.speak ? 10 : 0);
      return acc + p + skills;
    }, 0);
    commPoints = Math.min(100, Math.round(langScore / Math.max(1, state.languages.length / 2)));
  }

  // 8. Continuous Learning Score (Max 100, Weight 5%)
  const cl = state.continuousLearning;
  let learningPoints = Math.min(100,
    (cl.booksPerYear * 4) +
    (cl.coursesCompleted * 8) +
    (cl.learningHoursPerWeek * 3) +
    (cl.hackathonsAttended * 10) +
    (cl.researchPapersPublished * 15)
  );
  learningPoints = Math.max(30, learningPoints);

  // 9. Sports & Activities Score (Max 100, Weight 5%)
  let sportsPoints = Math.min(100, state.sports.reduce((acc, s) => {
    const levelBonus = s.level === 'International' ? 40 : s.level === 'National' ? 35 : s.level === 'State' ? 28 : 20;
    const captainBonus = s.wasCaptain ? 15 : 0;
    return acc + levelBonus + captainBonus;
  }, 20));

  // 10. Awards Score (Max 100, Weight 5%)
  let awardsPoints = Math.min(100, state.awards.length * 35 + 20);

  // 11. Career Vision Score (Max 100, Weight 10%)
  const cv = state.careerVision;
  let visionPoints = 30;
  if (cv.dreamJob) visionPoints += 15;
  if (cv.dreamCompany) visionPoints += 15;
  if (cv.fiveYearVision && cv.fiveYearVision.length > 10) visionPoints += 25;
  if (cv.expectedSalary) visionPoints += 15;
  visionPoints = Math.min(100, visionPoints);

  // Derived Auxiliary Metrics
  const professionalReadiness = Math.round((techPoints * 0.3) + (expPoints * 0.3) + (certPoints * 0.2) + (projectPoints * 0.2));
  const growthPotential = Math.round((learningPoints * 0.4) + (visionPoints * 0.3) + (leadershipPoints * 0.3));
  const industryMatch = Math.round((industryPoints * 0.5) + (techPoints * 0.3) + (certPoints * 0.2));
  const promotionReadiness = Math.round((leadershipPoints * 0.4) + (expPoints * 0.4) + (commPoints * 0.2));
  const innovationScore = Math.round((projectPoints * 0.4) + (awardsPoints * 0.3) + (techPoints * 0.3));

  // Final Weighted Professional Capital Score (0 - 100)
  const weightedCapitalScore = Math.round(
    (techPoints * 0.20) +
    (industryPoints * 0.15) +
    (projectPoints * 0.10) +
    (certPoints * 0.10) +
    (expPoints * 0.10) +
    (leadershipPoints * 0.10) +
    (commPoints * 0.10) +
    (learningPoints * 0.05) +
    (sportsPoints * 0.05) +
    (awardsPoints * 0.05) +
    (visionPoints * 0.10)
  );

  return {
    technicalScore: techPoints,
    industryScore: industryPoints,
    projectScore: projectPoints,
    certificationScore: certPoints,
    experienceScore: expPoints,
    leadershipScore: leadershipPoints,
    communicationScore: commPoints,
    learningScore: learningPoints,
    sportsScore: sportsPoints,
    awardsScore: awardsPoints,
    careerVisionScore: visionPoints,

    professionalReadiness,
    growthPotential,
    industryMatch,
    promotionReadiness,
    innovationScore,

    professionalCapitalScore: Math.min(100, Math.max(1, weightedCapitalScore)),
  };
}
