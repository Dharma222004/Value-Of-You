"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Code,
  Briefcase,
  Award,
  BookOpen,
  Globe,
  FolderGit2,
  Trophy,
  Users,
  Flame,
  Zap,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Activity,
  BarChart3,
  ExternalLink,
  Star,
  FileText,
  Layout,
  Search,
  RotateCcw,
  Check,
  AlertCircle,
  Target,
  Cpu,
  Layers,
  Laptop,
  Heart,
  Lightbulb,
  Radio,
  Dumbbell,
  Compass,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

// --- DATA TYPES & INTERFACES ---

export interface EducationData {
  qualification: string;
  degree: string;
  university: string;
  department: string;
  cgpa: string;
  gradYear: string;
}

export interface TechnicalSkill {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Cloud/DevOps" | "AI/ML" | "Database" | "Mobile" | "Security" | "Other";
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  yearsExp: number;
  lastUsed: string;
}

export interface IndustrySkill {
  id: string;
  name: string;
  domain: string;
  proficiency: "Foundational" | "Practitioner" | "Specialist" | "Thought Leader";
  yearsExp: number;
}

export interface DigitalSkill {
  id: string;
  name: string;
  category: "Analytics" | "Design" | "Development" | "AI Tools" | "Productivity" | "Management";
  level: "Basic" | "Proficient" | "Advanced" | "Master";
  verified: boolean;
}

export interface SoftSkill {
  name: string;
  score: number; // 1 - 5
  yearsApplied: number;
  notes: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  read: boolean;
  write: boolean;
  speak: boolean;
  proficiency: "Elementary" | "Professional" | "Native / Fluent";
}

export interface CertificationItem {
  id: string;
  name: string;
  provider: string;
  issueDate: string;
  expiry: string;
  credentialId: string;
  verificationUrl: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technology: string[];
  role: string;
  github: string;
  demo: string;
  year: string;
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  role: string;
  years: number;
  industry: string;
  responsibilities: string;
  achievements: string;
  period: string;
}

export interface SportsItem {
  id: string;
  sport: string;
  level: "School" | "College" | "District" | "State" | "National" | "International";
  years: number;
  achievements: string;
}

export interface LeadershipItem {
  id: string;
  category: "College Clubs" | "Student Council" | "NSS" | "NCC" | "NGO" | "Mentoring" | "Public Speaking";
  roleTitle: string;
  organization: string;
  achievements: string;
}

export interface AwardItem {
  id: string;
  name: string;
  category: "Academic" | "Sports" | "Hackathons" | "Innovation" | "Scholarships" | "Recognition";
  issuer: string;
  year: string;
  description: string;
}

export interface ContinuousLearningData {
  booksCount: number;
  coursesCompleted: number;
  podcastsListened: number;
  conferencesAttended: number;
  weeklyLearningHours: number;
  recentTopics: string[];
}

export interface SkillsModuleState {
  education: EducationData;
  technicalSkills: TechnicalSkill[];
  selectedIndustry: string;
  industrySkills: IndustrySkill[];
  digitalSkills: DigitalSkill[];
  softSkills: Record<string, SoftSkill>;
  languages: LanguageItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  workExperience: WorkExperienceItem[];
  sports: SportsItem[];
  leadership: LeadershipItem[];
  awards: AwardItem[];
  continuousLearning: ContinuousLearningData;
}

// --- DEFAULT INITIAL STATE ---

const defaultSkillsState: SkillsModuleState = {
  education: {
    qualification: "Master's Degree",
    degree: "M.S. Computer Science & Artificial Intelligence",
    university: "Stanford University",
    department: "Department of Computer Science",
    cgpa: "3.92 / 4.0",
    gradYear: "2023",
  },
  technicalSkills: [
    { id: "tech-1", name: "Python & PyTorch", category: "AI/ML", level: "Expert", yearsExp: 5, lastUsed: "2026" },
    { id: "tech-2", name: "TypeScript & React / Next.js", category: "Frontend", level: "Expert", yearsExp: 6, lastUsed: "2026" },
    { id: "tech-3", name: "Node.js & Microservices", category: "Backend", level: "Advanced", yearsExp: 4, lastUsed: "2026" },
    { id: "tech-4", name: "Kubernetes & AWS Cloud", category: "Cloud/DevOps", level: "Advanced", yearsExp: 3, lastUsed: "2025" },
    { id: "tech-5", name: "PostgreSQL & VectorDB", category: "Database", level: "Advanced", yearsExp: 4, lastUsed: "2026" },
  ],
  selectedIndustry: "AI",
  industrySkills: [
    { id: "ind-1", name: "LLM Fine-Tuning & RAG Architecture", domain: "AI", proficiency: "Specialist", yearsExp: 3 },
    { id: "ind-2", name: "Prompt Optimization & Evaluation", domain: "AI", proficiency: "Thought Leader", yearsExp: 2 },
    { id: "ind-3", name: "Quantitative Financial Modeling", domain: "Finance", proficiency: "Practitioner", yearsExp: 2 },
  ],
  digitalSkills: [
    { id: "dig-1", name: "Excel & Advanced Formulas", category: "Analytics", level: "Advanced", verified: true },
    { id: "dig-2", name: "Power BI / Tableau", category: "Analytics", level: "Proficient", verified: true },
    { id: "dig-3", name: "Figma & UI Prototyping", category: "Design", level: "Advanced", verified: true },
    { id: "dig-4", name: "Git & GitHub Workflow", category: "Development", level: "Master", verified: true },
    { id: "dig-5", name: "ChatGPT / Claude / Gemini APIs", category: "AI Tools", level: "Master", verified: true },
    { id: "dig-6", name: "Jira & Notion Workspaces", category: "Management", level: "Master", verified: true },
  ],
  softSkills: {
    Communication: { name: "Communication", score: 5, yearsApplied: 6, notes: "Delivered keynote presentations & executive briefings" },
    Leadership: { name: "Leadership", score: 4, yearsApplied: 4, notes: "Led a cross-functional engineering squad of 8 members" },
    Teamwork: { name: "Teamwork", score: 5, yearsApplied: 6, notes: "Active open-source contributor and peer mentor" },
    "Critical Thinking": { name: "Critical Thinking", score: 5, yearsApplied: 5, notes: "Architected resilient distributed systems under high load" },
    "Emotional Intelligence": { name: "Emotional Intelligence", score: 4, yearsApplied: 4, notes: "Effective conflict resolution and empathetic coaching" },
    Negotiation: { name: "Negotiation", score: 4, yearsApplied: 3, notes: "Vendor contract reviews & project roadmap alignment" },
    Creativity: { name: "Creativity", score: 5, yearsApplied: 5, notes: "Designed innovative human capital scoring algorithms" },
    Adaptability: { name: "Adaptability", score: 5, yearsApplied: 6, notes: "Rapidly adopted emerging AI frameworks & market shifts" },
  },
  languages: [
    { id: "lang-1", language: "English", read: true, write: true, speak: true, proficiency: "Native / Fluent" },
    { id: "lang-2", language: "Spanish", read: true, write: true, speak: true, proficiency: "Professional" },
    { id: "lang-3", language: "German", read: true, write: false, speak: false, proficiency: "Elementary" },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Professional",
      provider: "Amazon Web Services",
      issueDate: "2023-08",
      expiry: "2026-08",
      credentialId: "AWS-PROF-981204",
      verificationUrl: "https://aws.amazon.com/verification/AWS-PROF-981204",
    },
    {
      id: "cert-2",
      name: "Generative AI Engineering Specialist",
      provider: "DeepLearning.AI & Stanford",
      issueDate: "2024-02",
      expiry: "Lifetime",
      credentialId: "DLAI-GENAI-772910",
      verificationUrl: "https://coursera.org/verify/DLAI-GENAI-772910",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Autonomous AI Agent Swarm",
      description: "Distributed multi-agent pipeline executing real-time data analysis and code generation.",
      technology: ["Python", "LangChain", "FastAPI", "React", "Docker"],
      role: "Lead Architect & Developer",
      github: "https://github.com/example/ai-agent-swarm",
      demo: "https://ai-swarm-demo.internal",
      year: "2025",
    },
    {
      id: "proj-2",
      name: "Enterprise Capital Analytics Engine",
      description: "Financial & Human Capital scoring platform providing real-time valuation insights.",
      technology: ["TypeScript", "Next.js", "TailwindCSS", "PostgreSQL"],
      role: "Full Stack Engineer",
      github: "https://github.com/example/capital-engine",
      demo: "https://capital-analytics.example.com",
      year: "2024",
    },
  ],
  workExperience: [
    {
      id: "work-1",
      company: "Apex Nexus AI Labs",
      role: "Senior AI Solutions Engineer",
      years: 3,
      industry: "Artificial Intelligence",
      responsibilities: "Designed and scaled enterprise LLM applications, mentored junior developers, and reduced latency by 45%.",
      achievements: "Spearheaded patent filing for dynamic RAG compression; awarded Employee of the Year 2025.",
      period: "2023 - Present",
    },
    {
      id: "work-2",
      company: "Quantum Vantage Systems",
      role: "Full Stack Developer",
      years: 2,
      industry: "Software & Cloud",
      responsibilities: "Developed microservices architecture, improved CI/CD deployment throughput, and managed cloud infrastructure.",
      achievements: "Built high-frequency data pipeline processing over 10M events daily with 99.99% uptime.",
      period: "2021 - 2023",
    },
  ],
  sports: [
    {
      id: "sport-1",
      sport: "Marathon Running",
      level: "State",
      years: 4,
      achievements: "Completed 5 full marathons; personal best of 3h 12m.",
    },
    {
      id: "sport-2",
      sport: "Competitive Chess",
      level: "National",
      years: 6,
      achievements: "FIDE rated 1890; 1st Runner Up in Inter-University Championship.",
    },
  ],
  leadership: [
    {
      id: "lead-1",
      category: "Student Council",
      roleTitle: "President & Technical Head",
      organization: "Stanford Computer Science Society",
      achievements: "Organized annual hackathon with 1,200+ participants and $50k in sponsor grants.",
    },
    {
      id: "lead-2",
      category: "Mentoring",
      roleTitle: "AI & Tech Mentor",
      organization: "TechStars Diversity Initiative",
      achievements: "Mentored 15+ underrepresented founders in product strategy and AI integration.",
    },
  ],
  awards: [
    {
      id: "award-1",
      name: "Global AI Hackathon Grand Champion",
      category: "Hackathons",
      issuer: "OpenAI & Microsoft",
      year: "2024",
      description: "First place out of 800 international teams for real-time multimodal accessibility copilot.",
    },
    {
      id: "award-2",
      name: "Presidential Merit Scholarship",
      category: "Scholarships",
      issuer: "Stanford University",
      year: "2021",
      description: "Full academic scholarship awarded for top 1% academic performance and research promise.",
    },
  ],
  continuousLearning: {
    booksCount: 22,
    coursesCompleted: 14,
    podcastsListened: 48,
    conferencesAttended: 6,
    weeklyLearningHours: 12,
    recentTopics: ["Quantum Machine Learning", "Agentic Systems Architecture", "Systematic Asset Valuation"],
  },
};

// --- PRESET SELECTION LISTS ---

const INDUSTRY_OPTIONS = [
  "Finance",
  "Healthcare",
  "Marketing",
  "AI",
  "Manufacturing",
  "Legal",
  "Education",
  "Sales",
  "Operations",
];

const PRESET_INDUSTRY_SKILLS: Record<string, string[]> = {
  Finance: ["Financial Modeling", "Valuation & M&A", "Risk Management", "Portfolio Optimization", "Algorithmic Trading"],
  Healthcare: ["Clinical Data Analysis", "HIPAA Compliance", "Medical Imaging AI", "Health Informatics", "Biostatistics"],
  Marketing: ["Growth Hacking", "SEO & Content Strategy", "Performance Marketing", "Brand Positioning", "Marketing Automation"],
  AI: ["LLM Fine-Tuning", "RAG & Vector Search", "Computer Vision", "Model Alignment & RLHF", "MLOps Pipeline"],
  Manufacturing: ["Six Sigma & Lean", "Supply Chain Optimization", "IoT Sensor Integration", "CAD/CAM Design", "Quality Assurance"],
  Legal: ["Contract Law & Analysis", "IP & Patent Filing", "Regulatory Compliance", "GDPR & Privacy", "Legal Tech Automation"],
  Education: ["Curriculum Design", "EdTech Platform Design", "Pedagogy & Assessment", "Interactive E-Learning", "Student Analytics"],
  Sales: ["Enterprise B2B Sales", "Pipeline Management", "Solution Selling", "CRM Strategy (Salesforce)", "Contract Negotiation"],
  Operations: ["Process Automation", "Agile & Scrum Operations", "Vendor Management", "Logistics & Fulfillment", "Cost Optimization"],
};

const PRESET_DIGITAL_SKILLS = [
  { name: "Excel", category: "Analytics" as const },
  { name: "Power BI", category: "Analytics" as const },
  { name: "Tableau", category: "Analytics" as const },
  { name: "Canva", category: "Design" as const },
  { name: "Photoshop", category: "Design" as const },
  { name: "Figma", category: "Design" as const },
  { name: "Git", category: "Development" as const },
  { name: "GitHub", category: "Development" as const },
  { name: "ChatGPT", category: "AI Tools" as const },
  { name: "Claude", category: "AI Tools" as const },
  { name: "Gemini", category: "AI Tools" as const },
  { name: "Notion", category: "Productivity" as const },
  { name: "Jira", category: "Management" as const },
];

const WIZARD_STEPS = [
  { id: 1, name: "Education", icon: GraduationCap, short: "Edu" },
  { id: 2, name: "Technical Skills", icon: Code, short: "Tech" },
  { id: 3, name: "Industry Skills", icon: Briefcase, short: "Industry" },
  { id: 4, name: "Digital Skills", icon: Laptop, short: "Digital" },
  { id: 5, name: "Soft Skills", icon: Heart, short: "Soft" },
  { id: 6, name: "Languages", icon: Globe, short: "Lang" },
  { id: 7, name: "Certifications", icon: Award, short: "Certs" },
  { id: 8, name: "Projects", icon: FolderGit2, short: "Projects" },
  { id: 9, name: "Work Experience", icon: Activity, short: "Work" },
  { id: 10, name: "Sports", icon: Dumbbell, short: "Sports" },
  { id: 11, name: "Leadership", icon: Users, short: "Leader" },
  { id: 12, name: "Awards", icon: Trophy, short: "Awards" },
  { id: 13, name: "Continuous Learning", icon: BookOpen, short: "Learning" },
  { id: 14, name: "Skills Capital Matrix", icon: Sparkles, short: "Summary" },
];

const LOCAL_STORAGE_KEY = "human_capital_skills_module_v7";

export const SkillsModule: React.FC = () => {
  // --- STATE ---
  const [data, setData] = useState<SkillsModuleState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load skills module data from localStorage", e);
      }
    }
    return defaultSkillsState;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [lastSavedTime, setLastSavedTime] = useState<string>("Just now");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // --- AUTOSAVE ENGINE ---
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          const now = new Date();
          setLastSavedTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        } catch (e) {
          console.error("Error saving skills module data", e);
        }
      }
      setIsSaving(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [data]);

  // --- SCORE CALCULATIONS ---
  const scores = useMemo(() => {
    // 1. Technical Score (0 - 100)
    const techSkillCount = data.technicalSkills.length;
    const expertTechCount = data.technicalSkills.filter((s) => s.level === "Expert").length;
    const advTechCount = data.technicalSkills.filter((s) => s.level === "Advanced").length;
    const digitalCount = data.digitalSkills.length;
    const projectCount = data.projects.length;

    let rawTech = 40 + techSkillCount * 6 + expertTechCount * 8 + advTechCount * 4 + digitalCount * 3 + projectCount * 5;
    const technicalScore = Math.min(100, Math.max(0, Math.round(rawTech)));

    // 2. Leadership Score (0 - 100)
    const leadershipEntries = data.leadership.length;
    const leadershipSoftScore = data.softSkills.Leadership?.score || 3;
    const teamworkSoftScore = data.softSkills.Teamwork?.score || 3;
    const workYearsTotal = data.workExperience.reduce((sum, w) => sum + (w.years || 0), 0);
    const sportsLevelBonus = data.sports.filter((s) => s.level === "State" || s.level === "National" || s.level === "International").length * 5;

    let rawLeadership = 35 + leadershipEntries * 12 + (leadershipSoftScore + teamworkSoftScore) * 5 + Math.min(20, workYearsTotal * 3) + sportsLevelBonus;
    const leadershipScore = Math.min(100, Math.max(0, Math.round(rawLeadership)));

    // 3. Communication Score (0 - 100)
    const commSoftScore = data.softSkills.Communication?.score || 3;
    const eqSoftScore = data.softSkills["Emotional Intelligence"]?.score || 3;
    const negSoftScore = data.softSkills.Negotiation?.score || 3;
    const langCount = data.languages.length;
    const fluentLangCount = data.languages.filter((l) => l.proficiency === "Native / Fluent" || l.proficiency === "Professional").length;
    const publicSpeakingBonus = data.leadership.some((l) => l.category === "Public Speaking" || l.category === "Mentoring") ? 10 : 0;

    let rawComm = 40 + (commSoftScore + eqSoftScore + negSoftScore) * 5 + langCount * 4 + fluentLangCount * 6 + publicSpeakingBonus;
    const communicationScore = Math.min(100, Math.max(0, Math.round(rawComm)));

    // 4. Learning Score (0 - 100)
    const cl = data.continuousLearning;
    const certCount = data.certifications.length;
    const adaptSoftScore = data.softSkills.Adaptability?.score || 3;
    const critSoftScore = data.softSkills["Critical Thinking"]?.score || 3;

    let rawLearning =
      30 +
      Math.min(25, cl.weeklyLearningHours * 2) +
      Math.min(15, cl.booksCount * 1) +
      Math.min(15, cl.coursesCompleted * 2) +
      certCount * 8 +
      (adaptSoftScore + critSoftScore) * 4;
    const learningScore = Math.min(100, Math.max(0, Math.round(rawLearning)));

    // 5. Career Readiness Score (0 - 100)
    const hasDegree = data.education.degree.length > 3 ? 15 : 5;
    const hasUniv = data.education.university.length > 3 ? 10 : 5;
    const workCount = data.workExperience.length;
    const awardsCount = data.awards.length;
    const projWithLinks = data.projects.filter((p) => p.github.length > 5 || p.demo.length > 5).length;

    let rawCareer = 25 + hasDegree + hasUniv + workCount * 10 + projectCount * 6 + projWithLinks * 5 + awardsCount * 7 + certCount * 5;
    const careerReadinessScore = Math.min(100, Math.max(0, Math.round(rawCareer)));

    // 6. Overall Skills Score (0 - 100)
    const overallSkillsScore = Math.round(
      technicalScore * 0.25 +
        leadershipScore * 0.2 +
        communicationScore * 0.15 +
        learningScore * 0.15 +
        careerReadinessScore * 0.25
    );

    return {
      technicalScore,
      leadershipScore,
      communicationScore,
      learningScore,
      careerReadinessScore,
      overallSkillsScore,
    };
  }, [data]);

  // --- STEP VALIDATION CHECKER ---
  const validateStep = (stepNum: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!data.education.qualification) errors.qualification = "Qualification is required";
      if (!data.education.degree) errors.degree = "Degree is required";
      if (!data.education.university) errors.university = "University is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(WIZARD_STEPS.length, prev + 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const resetToDefaultData = () => {
    if (window.confirm("Reset all skills and career data to initial demo benchmarks?")) {
      setData(defaultSkillsState);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // --- FORMS & ITEM HANDLERS ---

  // Technical Skill Add Form State
  const [techInput, setTechInput] = useState({
    name: "",
    category: "Frontend" as TechnicalSkill["category"],
    level: "Advanced" as TechnicalSkill["level"],
    yearsExp: 3,
    lastUsed: "2026",
  });

  const addTechnicalSkill = () => {
    if (!techInput.name.trim()) return;
    const newSkill: TechnicalSkill = {
      id: `tech-${Date.now()}`,
      ...techInput,
    };
    setData((prev) => ({ ...prev, technicalSkills: [...prev.technicalSkills, newSkill] }));
    setTechInput({ name: "", category: "Frontend", level: "Advanced", yearsExp: 3, lastUsed: "2026" });
  };

  const removeTechnicalSkill = (id: string) => {
    setData((prev) => ({ ...prev, technicalSkills: prev.technicalSkills.filter((s) => s.id !== id) }));
  };

  // Industry Skill Add Form State
  const [indInput, setIndInput] = useState({
    name: "",
    proficiency: "Practitioner" as IndustrySkill["proficiency"],
    yearsExp: 2,
  });

  const addIndustrySkill = () => {
    if (!indInput.name.trim()) return;
    const newSkill: IndustrySkill = {
      id: `ind-${Date.now()}`,
      name: indInput.name,
      domain: data.selectedIndustry,
      proficiency: indInput.proficiency,
      yearsExp: indInput.yearsExp,
    };
    setData((prev) => ({ ...prev, industrySkills: [...prev.industrySkills, newSkill] }));
    setIndInput({ name: "", proficiency: "Practitioner", yearsExp: 2 });
  };

  const removeIndustrySkill = (id: string) => {
    setData((prev) => ({ ...prev, industrySkills: prev.industrySkills.filter((s) => s.id !== id) }));
  };

  // Digital Skill Add / Toggle State
  const [customDigitalName, setCustomDigitalName] = useState("");

  const togglePresetDigitalSkill = (preset: { name: string; category: DigitalSkill["category"] }) => {
    const existing = data.digitalSkills.find((d) => d.name.toLowerCase() === preset.name.toLowerCase());
    if (existing) {
      setData((prev) => ({ ...prev, digitalSkills: prev.digitalSkills.filter((d) => d.id !== existing.id) }));
    } else {
      const newDig: DigitalSkill = {
        id: `dig-${Date.now()}`,
        name: preset.name,
        category: preset.category,
        level: "Proficient",
        verified: true,
      };
      setData((prev) => ({ ...prev, digitalSkills: [...prev.digitalSkills, newDig] }));
    }
  };

  const addCustomDigitalSkill = () => {
    if (!customDigitalName.trim()) return;
    const newDig: DigitalSkill = {
      id: `dig-${Date.now()}`,
      name: customDigitalName.trim(),
      category: "Tools" as any,
      level: "Proficient",
      verified: false,
    };
    setData((prev) => ({ ...prev, digitalSkills: [...prev.digitalSkills, newDig] }));
    setCustomDigitalName("");
  };

  const removeDigitalSkill = (id: string) => {
    setData((prev) => ({ ...prev, digitalSkills: prev.digitalSkills.filter((d) => d.id !== id) }));
  };

  // Language Add / Toggle State
  const [langInput, setLangInput] = useState({
    language: "",
    read: true,
    write: true,
    speak: true,
    proficiency: "Professional" as LanguageItem["proficiency"],
  });

  const addLanguage = () => {
    if (!langInput.language.trim()) return;
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      ...langInput,
    };
    setData((prev) => ({ ...prev, languages: [...prev.languages, newLang] }));
    setLangInput({ language: "", read: true, write: true, speak: true, proficiency: "Professional" });
  };

  const removeLanguage = (id: string) => {
    setData((prev) => ({ ...prev, languages: prev.languages.filter((l) => l.id !== id) }));
  };

  // Certification Add Form State
  const [certInput, setCertInput] = useState({
    name: "",
    provider: "",
    issueDate: "",
    expiry: "Lifetime",
    credentialId: "",
    verificationUrl: "",
  });

  const addCertification = () => {
    if (!certInput.name.trim() || !certInput.provider.trim()) return;
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      ...certInput,
    };
    setData((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
    setCertInput({ name: "", provider: "", issueDate: "", expiry: "Lifetime", credentialId: "", verificationUrl: "" });
  };

  const removeCertification = (id: string) => {
    setData((prev) => ({ ...prev, certifications: prev.certifications.filter((c) => c.id !== id) }));
  };

  // Project Add Form State
  const [projInput, setProjInput] = useState({
    name: "",
    description: "",
    techString: "",
    role: "",
    github: "",
    demo: "",
    year: "2026",
  });

  const addProject = () => {
    if (!projInput.name.trim() || !projInput.description.trim()) return;
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: projInput.name,
      description: projInput.description,
      technology: projInput.techString
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      role: projInput.role || "Developer",
      github: projInput.github,
      demo: projInput.demo,
      year: projInput.year || "2026",
    };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
    setProjInput({ name: "", description: "", techString: "", role: "", github: "", demo: "", year: "2026" });
  };

  const removeProject = (id: string) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  };

  // Work Experience Form State
  const [workInput, setWorkInput] = useState({
    company: "",
    role: "",
    years: 2,
    industry: "Technology",
    responsibilities: "",
    achievements: "",
    period: "2024 - Present",
  });

  const addWorkExperience = () => {
    if (!workInput.company.trim() || !workInput.role.trim()) return;
    const newWork: WorkExperienceItem = {
      id: `work-${Date.now()}`,
      ...workInput,
    };
    setData((prev) => ({ ...prev, workExperience: [...prev.workExperience, newWork] }));
    setWorkInput({
      company: "",
      role: "",
      years: 2,
      industry: "Technology",
      responsibilities: "",
      achievements: "",
      period: "2024 - Present",
    });
  };

  const removeWorkExperience = (id: string) => {
    setData((prev) => ({ ...prev, workExperience: prev.workExperience.filter((w) => w.id !== id) }));
  };

  // Sports Add Form State
  const [sportInput, setSportInput] = useState({
    sport: "",
    level: "College" as SportsItem["level"],
    years: 3,
    achievements: "",
  });

  const addSport = () => {
    if (!sportInput.sport.trim()) return;
    const newSport: SportsItem = {
      id: `sport-${Date.now()}`,
      ...sportInput,
    };
    setData((prev) => ({ ...prev, sports: [...prev.sports, newSport] }));
    setSportInput({ sport: "", level: "College", years: 3, achievements: "" });
  };

  const removeSport = (id: string) => {
    setData((prev) => ({ ...prev, sports: prev.sports.filter((s) => s.id !== id) }));
  };

  // Leadership Add Form State
  const [leadInput, setLeadInput] = useState({
    category: "College Clubs" as LeadershipItem["category"],
    roleTitle: "",
    organization: "",
    achievements: "",
  });

  const addLeadership = () => {
    if (!leadInput.roleTitle.trim() || !leadInput.organization.trim()) return;
    const newLead: LeadershipItem = {
      id: `lead-${Date.now()}`,
      ...leadInput,
    };
    setData((prev) => ({ ...prev, leadership: [...prev.leadership, newLead] }));
    setLeadInput({ category: "College Clubs", roleTitle: "", organization: "", achievements: "" });
  };

  const removeLeadership = (id: string) => {
    setData((prev) => ({ ...prev, leadership: prev.leadership.filter((l) => l.id !== id) }));
  };

  // Award Add Form State
  const [awardInput, setAwardInput] = useState({
    name: "",
    category: "Academic" as AwardItem["category"],
    issuer: "",
    year: "2025",
    description: "",
  });

  const addAward = () => {
    if (!awardInput.name.trim() || !awardInput.issuer.trim()) return;
    const newAward: AwardItem = {
      id: `award-${Date.now()}`,
      ...awardInput,
    };
    setData((prev) => ({ ...prev, awards: [...prev.awards, newAward] }));
    setAwardInput({ name: "", category: "Academic", issuer: "", year: "2025", description: "" });
  };

  const removeAward = (id: string) => {
    setData((prev) => ({ ...prev, awards: prev.awards.filter((a) => a.id !== id) }));
  };

  // Step Completion Tracker
  const stepProgressPercentage = Math.round((currentStep / WIZARD_STEPS.length) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* HEADER BANNER & AUTOSAVE STATUS */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-gradient-to-r from-[#0a0f1d] via-[#0d1428] to-[#0a0f1d] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                PHASE 7 · SKILLS & CAREER CAPITAL MODULE
              </span>
              <span className="text-[11px] font-mono text-slate-400">Multi-Step Wizard Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Professional Capabilities & Skills Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Measure technical mastery, leadership depth, soft skill EQ, continuous learning velocity, and employability metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefaultData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition-colors"
              title="Reset data to default benchmarks"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <Save className={`w-3.5 h-3.5 ${isSaving ? "text-amber-400 animate-spin" : "text-emerald-400"}`} />
              <span className="text-slate-300">
                {isSaving ? "Autosaving..." : `Autosaved (${lastSavedTime})`}
              </span>
            </div>
          </div>
        </div>

        {/* OVERALL SCORE SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TECHNICAL SCORE</span>
            <div className="text-xl font-black font-mono text-sky-400">{scores.technicalScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full transition-all duration-500" style={{ width: `${scores.technicalScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">LEADERSHIP</span>
            <div className="text-xl font-black font-mono text-indigo-400">{scores.leadershipScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${scores.leadershipScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">COMMUNICATION</span>
            <div className="text-xl font-black font-mono text-emerald-400">{scores.communicationScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${scores.communicationScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">LEARNING AGILITY</span>
            <div className="text-xl font-black font-mono text-purple-400">{scores.learningScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full transition-all duration-500" style={{ width: `${scores.learningScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CAREER READINESS</span>
            <div className="text-xl font-black font-mono text-amber-400">{scores.careerReadinessScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${scores.careerReadinessScore}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 space-y-1">
            <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider">SKILLS SCORE</span>
            <div className="text-xl font-black font-mono text-white">{scores.overallSkillsScore} <span className="text-xs text-indigo-300 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-sky-400 to-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${scores.overallSkillsScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-STEP WIZARD NAVIGATION BAR */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>WIZARD STEP {currentStep} OF {WIZARD_STEPS.length}: <strong className="text-white">{WIZARD_STEPS[currentStep - 1].name}</strong></span>
          <span>{stepProgressPercentage}% COMPLETE</span>
        </div>

        {/* Wizard Step Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-[1px] border border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-full"
            animate={{ width: `${stepProgressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Buttons horizontal scrollable list */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
          {WIZARD_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/50"
                    : isCompleted
                    ? "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
                    : "bg-slate-950/40 text-slate-500 border border-slate-900 hover:text-slate-400"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : isCompleted ? "text-emerald-400" : "text-slate-500"}`} />
                <span>{step.short}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT RENDERER WITH ANIMATION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* STEP 1: EDUCATION */}
          {currentStep === 1 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 1: Educational Qualification</h2>
                  <p className="text-xs text-slate-400">Record your academic foundation, institution pedigree, and CGPA metrics.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Highest Qualification *</label>
                  <select
                    value={data.education.qualification}
                    onChange={(e) =>
                      setData({ ...data, education: { ...data.education, qualification: e.target.value } })
                    }
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="High School">High School / Secondary</option>
                    <option value="Diploma">Diploma / Associate Degree</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Doctorate (Ph.D.)">Doctorate (Ph.D.)</option>
                    <option value="Post-Doctoral">Post-Doctoral</option>
                  </select>
                  {validationErrors.qualification && (
                    <span className="text-[11px] text-rose-400 font-mono">{validationErrors.qualification}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Degree & Specialization *</label>
                  <input
                    type="text"
                    placeholder="e.g. M.S. Computer Science & Artificial Intelligence"
                    value={data.education.degree}
                    onChange={(e) =>
                      setData({ ...data, education: { ...data.education, degree: e.target.value } })
                    }
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                  {validationErrors.degree && (
                    <span className="text-[11px] text-rose-400 font-mono">{validationErrors.degree}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">University / College *</label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford University"
                    value={data.education.university}
                    onChange={(e) =>
                      setData({ ...data, education: { ...data.education, university: e.target.value } })
                    }
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                  {validationErrors.university && (
                    <span className="text-[11px] text-rose-400 font-mono">{validationErrors.university}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Department / Faculty</label>
                  <input
                    type="text"
                    placeholder="e.g. School of Engineering"
                    value={data.education.department}
                    onChange={(e) =>
                      setData({ ...data, education: { ...data.education, department: e.target.value } })
                    }
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">CGPA / Percentage Score</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.92 / 4.0 or 92%"
                    value={data.education.cgpa}
                    onChange={(e) =>
                      setData({ ...data, education: { ...data.education, cgpa: e.target.value } })
                    }
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Graduation Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2023"
                    value={data.education.gradYear}
                    onChange={(e) =>
                      setData({ ...data, education: { ...data.education, gradYear: e.target.value } })
                    }
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TECHNICAL SKILLS */}
          {currentStep === 2 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 2: Technical Skills Inventory</h2>
                  <p className="text-xs text-slate-400">Add unlimited core engineering, software, and technical competencies.</p>
                </div>
              </div>

              {/* Add New Technical Skill Bar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">Add Technical Skill</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <input
                    type="text"
                    placeholder="Skill Name (e.g. Python, Rust)"
                    value={techInput.name}
                    onChange={(e) => setTechInput({ ...techInput, name: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />

                  <select
                    value={techInput.category}
                    onChange={(e) => setTechInput({ ...techInput, category: e.target.value as any })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Cloud/DevOps">Cloud/DevOps</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Database">Database</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Security">Security</option>
                    <option value="Other">Other</option>
                  </select>

                  <select
                    value={techInput.level}
                    onChange={(e) => setTechInput({ ...techInput, level: e.target.value as any })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Years Exp"
                    value={techInput.yearsExp}
                    onChange={(e) => setTechInput({ ...techInput, yearsExp: parseInt(e.target.value) || 0 })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                  />

                  <button
                    onClick={addTechnicalSkill}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>
              </div>

              {/* Technical Skill Chips & Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.technicalSkills.map((skill) => (
                  <div key={skill.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {skill.category}
                      </span>
                      <button
                        onClick={() => removeTechnicalSkill(skill.id)}
                        className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-bold text-sm text-white">{skill.name}</div>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-900">
                      <span>Level: <strong className="text-sky-400">{skill.level}</strong></span>
                      <span>{skill.yearsExp} Yrs Exp</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: INDUSTRY SKILLS */}
          {currentStep === 3 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 3: Industry & Domain Skills</h2>
                  <p className="text-xs text-slate-400">Dynamic skills tailored specifically to your core industry vertical.</p>
                </div>
              </div>

              {/* Industry Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Select Primary Industry</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth">
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setData({ ...data, selectedIndustry: ind })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        data.selectedIndustry === ind
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-md"
                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Skills Pill Recommendations */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-slate-400">Suggested {data.selectedIndustry} Domain Skills (Click to quick add):</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(PRESET_INDUSTRY_SKILLS[data.selectedIndustry] || []).map((presetName) => {
                    const isAdded = data.industrySkills.some((s) => s.name === presetName);
                    return (
                      <button
                        key={presetName}
                        disabled={isAdded}
                        onClick={() => {
                          const newSkill: IndustrySkill = {
                            id: `ind-${Date.now()}`,
                            name: presetName,
                            domain: data.selectedIndustry,
                            proficiency: "Practitioner",
                            yearsExp: 3,
                          };
                          setData((prev) => ({ ...prev, industrySkills: [...prev.industrySkills, newSkill] }));
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                          isAdded
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default"
                            : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700 hover:text-white"
                        }`}
                      >
                        {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-emerald-400" />}
                        <span>{presetName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Industry Skill Add Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Custom Industry Skill Name"
                  value={indInput.name}
                  onChange={(e) => setIndInput({ ...indInput, name: e.target.value })}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                />

                <select
                  value={indInput.proficiency}
                  onChange={(e) => setIndInput({ ...indInput, proficiency: e.target.value as any })}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                >
                  <option value="Foundational">Foundational</option>
                  <option value="Practitioner">Practitioner</option>
                  <option value="Specialist">Specialist</option>
                  <option value="Thought Leader">Thought Leader</option>
                </select>

                <button
                  onClick={addIndustrySkill}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Industry Skill</span>
                </button>
              </div>

              {/* Added Industry Skills List */}
              <div className="space-y-2">
                {data.industrySkills.map((s) => (
                  <div key={s.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {s.domain}
                      </span>
                      <span className="font-bold text-white">{s.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 font-mono">{s.proficiency}</span>
                      <button
                        onClick={() => removeIndustrySkill(s.id)}
                        className="text-slate-600 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: DIGITAL SKILLS */}
          {currentStep === 4 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 4: Digital Tools & Software Skills</h2>
                  <p className="text-xs text-slate-400">Proficiency in key software, design tools, analytics suites, and AI models.</p>
                </div>
              </div>

              {/* Preset Digital Tool Chips */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-300">Preset Digital Stack (Click to Toggle):</span>
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_DIGITAL_SKILLS.map((preset) => {
                    const isSelected = data.digitalSkills.some((d) => d.name.toLowerCase() === preset.name.toLowerCase());
                    return (
                      <button
                        key={preset.name}
                        onClick={() => togglePresetDigitalSkill(preset)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                          isSelected
                            ? "bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/30 border border-purple-400/50"
                            : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="w-4 h-4 text-purple-200" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{preset.name}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-sans">({preset.category})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Tool Input */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Add custom digital tool (e.g. Webflow, Blender, SAP)..."
                  value={customDigitalName}
                  onChange={(e) => setCustomDigitalName(e.target.value)}
                  className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={addCustomDigitalSkill}
                  className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tool</span>
                </button>
              </div>

              {/* Active Digital Stack Table / Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                {data.digitalSkills.map((d) => (
                  <div key={d.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{d.name}</div>
                      <div className="text-[10px] text-purple-400 font-mono">{d.level}</div>
                    </div>
                    <button
                      onClick={() => removeDigitalSkill(d.id)}
                      className="text-slate-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SOFT SKILLS */}
          {currentStep === 5 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 5: Soft Skills & Emotional Intelligence</h2>
                  <p className="text-xs text-slate-400">Evaluate interpersonal effectiveness, leadership potential, and collaboration skills.</p>
                </div>
              </div>

              {/* Soft Skills Rating Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.keys(data.softSkills).map((skillKey) => {
                  const item = data.softSkills[skillKey];
                  return (
                    <div key={skillKey} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{skillKey}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                setData({
                                  ...data,
                                  softSkills: {
                                    ...data.softSkills,
                                    [skillKey]: { ...item, score: star },
                                  },
                                })
                              }
                              className={`p-1 transition-transform hover:scale-125 ${
                                star <= item.score ? "text-amber-400" : "text-slate-700"
                              }`}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-slate-400">Contextual Application Notes / Evidence</label>
                        <input
                          type="text"
                          placeholder="e.g. Led cross-functional teams, resolved vendor disputes..."
                          value={item.notes}
                          onChange={(e) =>
                            setData({
                              ...data,
                              softSkills: {
                                ...data.softSkills,
                                [skillKey]: { ...item, notes: e.target.value },
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: LANGUAGES */}
          {currentStep === 6 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 6: Languages & Communication Matrix</h2>
                  <p className="text-xs text-slate-400">Multi-language fluency across reading, writing, and spoken communication.</p>
                </div>
              </div>

              {/* Add Language Form */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">Add Language</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Language (e.g. English, French, Japanese)"
                    value={langInput.language}
                    onChange={(e) => setLangInput({ ...langInput, language: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />

                  <select
                    value={langInput.proficiency}
                    onChange={(e) => setLangInput({ ...langInput, proficiency: e.target.value as any })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="Elementary">Elementary</option>
                    <option value="Professional">Professional</option>
                    <option value="Native / Fluent">Native / Fluent</option>
                  </select>

                  <div className="flex items-center justify-around px-2 text-xs text-slate-300 font-mono">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={langInput.read}
                        onChange={(e) => setLangInput({ ...langInput, read: e.target.checked })}
                      />
                      <span>Read</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={langInput.write}
                        onChange={(e) => setLangInput({ ...langInput, write: e.target.checked })}
                      />
                      <span>Write</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={langInput.speak}
                        onChange={(e) => setLangInput({ ...langInput, speak: e.target.checked })}
                      />
                      <span>Speak</span>
                    </label>
                  </div>

                  <div className="lg:col-span-2">
                    <button
                      onClick={addLanguage}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-600/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Language</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Language List */}
              <div className="space-y-3">
                {data.languages.map((l) => (
                  <div key={l.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-white text-sm">{l.language}</span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {l.proficiency}
                      </span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                        <span>Read: <strong className={l.read ? "text-emerald-400" : "text-slate-600"}>{l.read ? "Yes" : "No"}</strong></span>
                        <span>Write: <strong className={l.write ? "text-emerald-400" : "text-slate-600"}>{l.write ? "Yes" : "No"}</strong></span>
                        <span>Speak: <strong className={l.speak ? "text-emerald-400" : "text-slate-600"}>{l.speak ? "Yes" : "No"}</strong></span>
                      </div>

                      <button
                        onClick={() => removeLanguage(l.id)}
                        className="text-slate-600 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: CERTIFICATIONS */}
          {currentStep === 7 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 7: Certifications & Industry Credentials</h2>
                  <p className="text-xs text-slate-400">Add verified certificates, professional licensing, and credential links.</p>
                </div>
              </div>

              {/* Add Certification Form */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Add Certification Entry</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Certificate Name *"
                    value={certInput.name}
                    onChange={(e) => setCertInput({ ...certInput, name: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Provider (e.g. AWS, Coursera) *"
                    value={certInput.provider}
                    onChange={(e) => setCertInput({ ...certInput, provider: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Issue Date (e.g. 2024-02)"
                    value={certInput.issueDate}
                    onChange={(e) => setCertInput({ ...certInput, issueDate: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Expiry Date or Lifetime"
                    value={certInput.expiry}
                    onChange={(e) => setCertInput({ ...certInput, expiry: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Credential ID"
                    value={certInput.credentialId}
                    onChange={(e) => setCertInput({ ...certInput, credentialId: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Verification URL"
                    value={certInput.verificationUrl}
                    onChange={(e) => setCertInput({ ...certInput, verificationUrl: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={addCertification}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Certification</span>
                </button>
              </div>

              {/* Certification Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certifications.map((c) => (
                  <div key={c.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        <div className="text-xs text-amber-400 font-mono mt-0.5">{c.provider}</div>
                      </div>
                      <button
                        onClick={() => removeCertification(c.id)}
                        className="text-slate-600 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-900">
                      <span>Issued: {c.issueDate || "N/A"} · Expires: {c.expiry}</span>
                      {c.credentialId && <span>ID: {c.credentialId}</span>}
                    </div>

                    {c.verificationUrl && (
                      <a
                        href={c.verificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:underline"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: PROJECTS */}
          {currentStep === 8 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 8: Key Projects Portfolio</h2>
                  <p className="text-xs text-slate-400">Showcase unlimited software, research, or product implementations.</p>
                </div>
              </div>

              {/* Add Project Form */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider font-mono">Add Project Entry</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Project Name *"
                    value={projInput.name}
                    onChange={(e) => setProjInput({ ...projInput, name: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Your Role (e.g. Lead Architect, Full Stack)"
                    value={projInput.role}
                    onChange={(e) => setProjInput({ ...projInput, role: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma separated: Python, React, AWS)"
                    value={projInput.techString}
                    onChange={(e) => setProjInput({ ...projInput, techString: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="GitHub Repository URL"
                    value={projInput.github}
                    onChange={(e) => setProjInput({ ...projInput, github: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Live Demo / Website URL"
                    value={projInput.demo}
                    onChange={(e) => setProjInput({ ...projInput, demo: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <textarea
                    placeholder="Project Description & Key Impact *"
                    rows={2}
                    value={projInput.description}
                    onChange={(e) => setProjInput({ ...projInput, description: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none sm:col-span-2"
                  />
                </div>
                <button
                  onClick={addProject}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                {data.projects.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base">{p.name}</h3>
                        <span className="text-xs font-mono text-teal-400">{p.role} · {p.year}</span>
                      </div>
                      <button
                        onClick={() => removeProject(p.id)}
                        className="text-slate-600 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300">{p.description}</p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {p.technology.map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-slate-900">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" />
                          <span>GitHub Repo</span>
                        </a>
                      )}
                      {p.demo && (
                        <a href={p.demo} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: WORK EXPERIENCE */}
          {currentStep === 9 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 9: Work Experience Timeline</h2>
                  <p className="text-xs text-slate-400">Dynamic work history, responsibilities, and quantifiable career achievements.</p>
                </div>
              </div>

              {/* Add Work Form */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">Add Work Experience</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Company Name *"
                    value={workInput.company}
                    onChange={(e) => setWorkInput({ ...workInput, company: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Role / Title *"
                    value={workInput.role}
                    onChange={(e) => setWorkInput({ ...workInput, role: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Years at Company"
                    value={workInput.years}
                    onChange={(e) => setWorkInput({ ...workInput, years: parseFloat(e.target.value) || 0 })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Period (e.g. 2023 - Present)"
                    value={workInput.period}
                    onChange={(e) => setWorkInput({ ...workInput, period: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <textarea
                    placeholder="Key Responsibilities..."
                    rows={2}
                    value={workInput.responsibilities}
                    onChange={(e) => setWorkInput({ ...workInput, responsibilities: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none sm:col-span-2"
                  />
                  <textarea
                    placeholder="Quantifiable Achievements..."
                    rows={2}
                    value={workInput.achievements}
                    onChange={(e) => setWorkInput({ ...workInput, achievements: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none sm:col-span-2"
                  />
                </div>
                <button
                  onClick={addWorkExperience}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              {/* Experience Timeline Cards */}
              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                {data.workExperience.map((w) => (
                  <div key={w.id} className="relative group">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-950" />
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-white text-base">{w.role}</h3>
                          <div className="text-xs font-mono text-blue-400">{w.company} · {w.period} ({w.years} Yrs)</div>
                        </div>
                        <button
                          onClick={() => removeWorkExperience(w.id)}
                          className="text-slate-600 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {w.responsibilities && (
                        <div className="text-xs text-slate-300">
                          <strong className="text-slate-400">Responsibilities:</strong> {w.responsibilities}
                        </div>
                      )}

                      {w.achievements && (
                        <div className="text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/40">
                          <strong className="text-emerald-300">Key Achievement:</strong> {w.achievements}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 10: SPORTS */}
          {currentStep === 10 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 10: Sports & Physical Discipline</h2>
                  <p className="text-xs text-slate-400">Track athletic achievements, competition levels, and long-term physical grit.</p>
                </div>
              </div>

              {/* Add Sport Form */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Add Sport Entry</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Sport Name (e.g. Tennis, Chess, Marathon)"
                    value={sportInput.sport}
                    onChange={(e) => setSportInput({ ...sportInput, sport: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <select
                    value={sportInput.level}
                    onChange={(e) => setSportInput({ ...sportInput, level: e.target.value as any })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="School">School Level</option>
                    <option value="College">College Level</option>
                    <option value="District">District Level</option>
                    <option value="State">State Level</option>
                    <option value="National">National Level</option>
                    <option value="International">International Level</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Years Played"
                    value={sportInput.years}
                    onChange={(e) => setSportInput({ ...sportInput, years: parseInt(e.target.value) || 0 })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={addSport}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Sport</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Achievements (e.g. 1st Place Inter-University Tournament)"
                  value={sportInput.achievements}
                  onChange={(e) => setSportInput({ ...sportInput, achievements: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Sports Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.sports.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{s.sport}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {s.level} Level
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{s.years} Years active</div>
                    {s.achievements && <div className="text-xs text-slate-300 pt-2 border-t border-slate-900">{s.achievements}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 11: LEADERSHIP */}
          {currentStep === 11 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 11: Leadership & Social Impact</h2>
                  <p className="text-xs text-slate-400">College clubs, Student Council, NSS, NCC, NGO initiatives, Mentoring, and Public Speaking.</p>
                </div>
              </div>

              {/* Add Leadership Form */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">Add Leadership Entry</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={leadInput.category}
                    onChange={(e) => setLeadInput({ ...leadInput, category: e.target.value as any })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="College Clubs">College Clubs</option>
                    <option value="Student Council">Student Council</option>
                    <option value="NSS">NSS</option>
                    <option value="NCC">NCC</option>
                    <option value="NGO">NGO</option>
                    <option value="Mentoring">Mentoring</option>
                    <option value="Public Speaking">Public Speaking</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Role Title (e.g. President, Lead Mentor)"
                    value={leadInput.roleTitle}
                    onChange={(e) => setLeadInput({ ...leadInput, roleTitle: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Organization Name"
                    value={leadInput.organization}
                    onChange={(e) => setLeadInput({ ...leadInput, organization: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <textarea
                  placeholder="Key Leadership Impact & Initiatives..."
                  rows={2}
                  value={leadInput.achievements}
                  onChange={(e) => setLeadInput({ ...leadInput, achievements: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={addLeadership}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Leadership Entry</span>
                </button>
              </div>

              {/* Leadership List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.leadership.map((l) => (
                  <div key={l.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {l.category}
                      </span>
                      <button onClick={() => removeLeadership(l.id)} className="text-slate-600 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-bold text-white text-sm">{l.roleTitle}</div>
                    <div className="text-xs text-slate-400 font-mono">{l.organization}</div>
                    <p className="text-xs text-slate-300 pt-2 border-t border-slate-900">{l.achievements}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 12: AWARDS */}
          {currentStep === 12 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 12: Honors, Awards & Recognition</h2>
                  <p className="text-xs text-slate-400">Academic honors, sports medals, hackathon wins, innovation grants, and scholarships.</p>
                </div>
              </div>

              {/* Add Award Form */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider font-mono">Add Award / Honor</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Award Name *"
                    value={awardInput.name}
                    onChange={(e) => setAwardInput({ ...awardInput, name: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <select
                    value={awardInput.category}
                    onChange={(e) => setAwardInput({ ...awardInput, category: e.target.value as any })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Hackathons">Hackathons</option>
                    <option value="Innovation">Innovation</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Recognition">Recognition</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Issuer (e.g. IEEE, Microsoft) *"
                    value={awardInput.issuer}
                    onChange={(e) => setAwardInput({ ...awardInput, issuer: e.target.value })}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <textarea
                  placeholder="Award Description..."
                  rows={2}
                  value={awardInput.description}
                  onChange={(e) => setAwardInput({ ...awardInput, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={addAward}
                  className="px-4 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-yellow-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Award</span>
                </button>
              </div>

              {/* Awards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.awards.map((a) => (
                  <div key={a.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        {a.category}
                      </span>
                      <button onClick={() => removeAward(a.id)} className="text-slate-600 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-bold text-white text-sm">{a.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{a.issuer} · {a.year}</div>
                    <p className="text-xs text-slate-300 pt-2 border-t border-slate-900">{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 13: CONTINUOUS LEARNING */}
          {currentStep === 13 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Section 13: Continuous Learning & Upskilling Velocity</h2>
                  <p className="text-xs text-slate-400">Quantify annual reading volume, online courses, podcasts, conferences, and weekly study hours.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Books Read Per Year</label>
                  <input
                    type="number"
                    value={data.continuousLearning.booksCount}
                    onChange={(e) =>
                      setData({
                        ...data,
                        continuousLearning: {
                          ...data.continuousLearning,
                          booksCount: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 font-mono">Industry benchmark: 12-24 books/yr</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Online Courses Completed</label>
                  <input
                    type="number"
                    value={data.continuousLearning.coursesCompleted}
                    onChange={(e) =>
                      setData({
                        ...data,
                        continuousLearning: {
                          ...data.continuousLearning,
                          coursesCompleted: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 font-mono">Coursera, edX, Udemy, Stanford Online</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Podcasts / Technical Lectures</label>
                  <input
                    type="number"
                    value={data.continuousLearning.podcastsListened}
                    onChange={(e) =>
                      setData({
                        ...data,
                        continuousLearning: {
                          ...data.continuousLearning,
                          podcastsListened: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 font-mono">Episodes / tech talks listened</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Conferences Attended</label>
                  <input
                    type="number"
                    value={data.continuousLearning.conferencesAttended}
                    onChange={(e) =>
                      setData({
                        ...data,
                        continuousLearning: {
                          ...data.continuousLearning,
                          conferencesAttended: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 font-mono">Keynotes, summits, hackathons</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Weekly Upskilling & Learning Hours</label>
                  <input
                    type="number"
                    value={data.continuousLearning.weeklyLearningHours}
                    onChange={(e) =>
                      setData({
                        ...data,
                        continuousLearning: {
                          ...data.continuousLearning,
                          weeklyLearningHours: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-purple-400 font-mono">Target: 10+ hours per week for high growth velocity</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 14: SUMMARY ANALYTICS & SKILLS CAPITAL MATRIX DASHBOARD */}
          {currentStep === 14 && (
            <div className="space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-950 to-purple-950/30 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      <h2 className="text-xl font-black text-white">Skills Capital & Employability Intelligence Matrix</h2>
                    </div>
                    <p className="text-xs text-slate-400">Comprehensive score analysis generated across all 13 assessment sections.</p>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
                    MARKET MATCH RATING: TOP 3%
                  </div>
                </div>

                {/* SVG RADAR CHART & METRIC BREAKDOWN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Radar Chart */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">5-Axis Skills Radar Chart</span>
                    <svg viewBox="0 0 300 300" className="w-full max-w-[280px] h-auto">
                      {/* Pentagon Grid Rings */}
                      {[0.2, 0.4, 0.6, 0.8, 1.0].map((r, idx) => (
                        <polygon
                          key={idx}
                          points={[
                            [150, 150 - 110 * r],
                            [150 + 104 * r, 150 - 34 * r],
                            [150 + 64 * r, 150 + 89 * r],
                            [150 - 64 * r, 150 + 89 * r],
                            [150 - 104 * r, 150 - 34 * r],
                          ]
                            .map((p) => p.join(","))
                            .join(" ")}
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Axis Lines */}
                      {[
                        [150, 40],
                        [254, 116],
                        [214, 239],
                        [86, 239],
                        [46, 116],
                      ].map((p, idx) => (
                        <line key={idx} x1="150" y1="150" x2={p[0]} y2={p[1]} stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                      ))}

                      {/* Radar Polygon Filled */}
                      {(() => {
                        const t = scores.technicalScore / 100;
                        const l = scores.leadershipScore / 100;
                        const c = scores.communicationScore / 100;
                        const lr = scores.learningScore / 100;
                        const cr = scores.careerReadinessScore / 100;

                        const pts = [
                          [150, 150 - 110 * t],
                          [150 + 104 * l, 150 - 34 * l],
                          [150 + 64 * c, 150 + 89 * c],
                          [150 - 64 * lr, 150 + 89 * lr],
                          [150 - 104 * cr, 150 - 34 * cr],
                        ];
                        const pointsString = pts.map((p) => p.join(",")).join(" ");
                        return (
                          <g>
                            <polygon points={pointsString} fill="rgba(99, 102, 241, 0.35)" stroke="#6366f1" strokeWidth="2.5" />
                            {pts.map((p, idx) => (
                              <circle key={idx} cx={p[0]} cy={p[1]} r="4" fill="#a5b4fc" stroke="#4338ca" strokeWidth="2" />
                            ))}
                          </g>
                        );
                      })()}

                      {/* Labels */}
                      <text x="150" y="25" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">TECHNICAL</text>
                      <text x="260" y="115" textAnchor="start" fill="#818cf8" fontSize="10" fontWeight="bold" fontFamily="monospace">LEADERSHIP</text>
                      <text x="220" y="255" textAnchor="start" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">COMMUNICATION</text>
                      <text x="80" y="255" textAnchor="end" fill="#c084fc" fontSize="10" fontWeight="bold" fontFamily="monospace">LEARNING</text>
                      <text x="40" y="115" textAnchor="end" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="monospace">READINESS</text>
                    </svg>
                  </div>

                  {/* Dimension Cards */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">1. TECHNICAL SCORE</span>
                        <div className="text-sm font-bold text-white">Engineering & Software Stack</div>
                      </div>
                      <div className="text-xl font-black font-mono text-sky-400">{scores.technicalScore} / 100</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">2. LEADERSHIP SCORE</span>
                        <div className="text-sm font-bold text-white">Initiative, Council & Clubs</div>
                      </div>
                      <div className="text-xl font-black font-mono text-indigo-400">{scores.leadershipScore} / 100</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">3. COMMUNICATION SCORE</span>
                        <div className="text-sm font-bold text-white">Soft Skills & Language Fluency</div>
                      </div>
                      <div className="text-xl font-black font-mono text-emerald-400">{scores.communicationScore} / 100</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">4. LEARNING SCORE</span>
                        <div className="text-sm font-bold text-white">Upskilling & Certifications</div>
                      </div>
                      <div className="text-xl font-black font-mono text-purple-400">{scores.learningScore} / 100</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">5. CAREER READINESS</span>
                        <div className="text-sm font-bold text-white">Degree, Projects & Experience</div>
                      </div>
                      <div className="text-xl font-black font-mono text-amber-400">{scores.careerReadinessScore} / 100</div>
                    </div>
                  </div>
                </div>

                {/* OVERALL COMPOSITE HIGHLIGHT */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 border border-indigo-500/40 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-300 uppercase">OVERALL SKILLS CAPITAL SCORE</span>
                    <h3 className="text-3xl font-black text-white">{scores.overallSkillsScore} <span className="text-base text-indigo-300 font-normal">/ 100</span></h3>
                    <p className="text-xs text-slate-300">Composite score calculated with weighted AI algorithms across all 13 sections.</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Review Wizard Answers</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* FOOTER WIZARD CONTROLS */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            currentStep === 1
              ? "opacity-40 cursor-not-allowed bg-slate-900 text-slate-600 border border-slate-800"
              : "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Step {currentStep} of {WIZARD_STEPS.length}</span>
        </div>

        {currentStep < WIZARD_STEPS.length ? (
          <button
            onClick={handleNextStep}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30"
          >
            <span>Next Section</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finish & Restart Wizard</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillsModule;
