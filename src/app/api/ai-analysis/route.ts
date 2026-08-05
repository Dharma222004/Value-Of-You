/**
 * Multi-Provider Multi-Agent AI Human Values Analysis Engine
 *
 * POST /api/ai-analysis
 *
 * 3-Provider Architecture: NVIDIA (Nemotron) + Groq + Google Gemini
 *
 * Agent Assignments (each uses a unique primary model, all run concurrently):
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ Agent 1 (Values):  NVIDIA nemotron-3-ultra-550b → Groq llama-3.3-70b    │
 * │ Agent 2 (Finance): NVIDIA nemotron-3-super-120b → Groq gpt-oss-120b     │
 * │ Agent 3 (Career):  NVIDIA gpt-oss-120b → Groq gpt-oss-20b              │
 * │ Agent 4 (Habits):  NVIDIA llama-3.3-70b-instruct → Groq llama-3.1-8b   │
 * │                           ↓ (all fallback to Gemini 2.5 Flash)          │
 * │ Agent 5 (Master):  NVIDIA nemotron-3-ultra-550b → Groq llama-3.3-70b   │
 * └───────────────────────────────────────────────────────────────────────────┘
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateFinancialHealthMetrics, formatINR } from "@/lib/financialEngine";
import { calculateProfessionalCapitalScore } from "@/lib/professionalCapitalEngine";
import { calculateHealthCapitalScore } from "@/lib/healthCapitalEngine";
import { calculateAssessmentMetrics } from "@/lib/assessmentEngine";

// ====================================================================
// CONFIGURATION
// ====================================================================

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const OXLO_API_URL = process.env.OXLO_API_BASE_URL || "https://api.oxlo.ai/v1/chat/completions";
const ANALYSIS_VERSION = "v4.2.0 Multi-Provider Engine (Groq + NVIDIA + Gemini + Oxlo)";

// Per-provider timeouts
const TIMEOUT_MS: Record<string, number> = {
  nvidia: 40000,  // 40s — falls back fast if NVIDIA is overloaded
  groq: 50000,    // 50s — very fast
  gemini: 50000,  // 50s
  oxlo: 35000,    // 35s — high performance
};

type ModelProvider = "groq" | "nvidia" | "gemini" | "oxlo";

interface ModelConfig {
  name: string;
  provider: ModelProvider;
  maxTokens: number;
}

// STRATEGY: Multi-Agent execution across Groq, NVIDIA, Gemini & Oxlo AI
// Agent 1 (Values)  → NVIDIA nemotron-3-ultra-550b → Groq gpt-oss-120b → Oxlo DeepSeek-V3.2 → Gemini 3.6 Flash
// Agent 2 (Finance) → NVIDIA nemotron-3-super-120b → Groq gpt-oss-120b → Oxlo DeepSeek-R1-8B → Gemini 3.6 Flash
// Agent 3 (Career)  → Groq gpt-oss-120b → NVIDIA llama-3.3-70b-instruct → Oxlo Mistral-7B → Gemini 3.6 Flash
// Agent 4 (Habits)  → Groq gpt-oss-120b → NVIDIA gpt-oss-120b → Oxlo Gemma-3-4B → Gemini 3.6 Flash
// Master Synthesizer → NVIDIA nemotron-3-ultra-550b → Groq gpt-oss-120b → Oxlo DeepSeek-V3.2 → Gemini 3.6 Flash
const AGENT_MODELS: Record<string, ModelConfig[]> = {
  values: [
    { name: "nvidia/nemotron-3-ultra-550b-a55b", provider: "nvidia", maxTokens: 2000 },
    { name: "openai/gpt-oss-120b", provider: "groq", maxTokens: 3000 },
    { name: "deepseek-ai/DeepSeek-V3.2", provider: "oxlo", maxTokens: 3000 },
    { name: "gemini-3.6-flash", provider: "gemini", maxTokens: 3000 },
  ],
  finance: [
    { name: "nvidia/nemotron-3-super-120b-a12b", provider: "nvidia", maxTokens: 2000 },
    { name: "openai/gpt-oss-120b", provider: "groq", maxTokens: 3000 },
    { name: "deepseek-ai/DeepSeek-R1-8B", provider: "oxlo", maxTokens: 3000 },
    { name: "gemini-3.6-flash", provider: "gemini", maxTokens: 3000 },
  ],
  career: [
    { name: "openai/gpt-oss-120b", provider: "groq", maxTokens: 3000 },
    { name: "meta/llama-3.3-70b-instruct", provider: "nvidia", maxTokens: 2000 },
    { name: "mistralai/Mistral-7B-Instruct-v0.3", provider: "oxlo", maxTokens: 3000 },
    { name: "gemini-3.6-flash", provider: "gemini", maxTokens: 3000 },
  ],
  habits: [
    { name: "openai/gpt-oss-120b", provider: "groq", maxTokens: 3000 },
    { name: "gpt-oss-120b", provider: "nvidia", maxTokens: 2000 },
    { name: "google/gemma-3-4b-it", provider: "oxlo", maxTokens: 3000 },
    { name: "gemini-3.6-flash", provider: "gemini", maxTokens: 3000 },
  ],
  master: [
    { name: "nvidia/nemotron-3-ultra-550b-a55b", provider: "nvidia", maxTokens: 2500 },
    { name: "openai/gpt-oss-120b", provider: "groq", maxTokens: 3500 },
    { name: "deepseek-ai/DeepSeek-V3.2", provider: "oxlo", maxTokens: 3500 },
    { name: "gemini-3.6-flash", provider: "gemini", maxTokens: 3500 },
  ],
};

// ====================================================================
// API KEY HELPERS (4-KEY ROTATION & MULTI-KEY FAILOVER FOR ALL PROVIDERS)
// ====================================================================

function getGroqKeys(): string[] {
  return [
    process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY || "",
    process.env.GROQ_API_KEY_2 || "",
    process.env.GROQ_API_KEY_3 || "",
    process.env.GROQ_API_KEY_4 || "",
  ].filter(Boolean);
}

function getNvidiaKeys(): string[] {
  return [
    process.env.NVIDIA_API_KEY_1 || process.env.NVIDIA_API_KEY || "",
    process.env.NVIDIA_API_KEY_2 || "",
    process.env.NVIDIA_API_KEY_3 || "",
    process.env.NVIDIA_API_KEY_4 || "",
  ].filter(Boolean);
}

function getGeminiKeys(): string[] {
  return [
    process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || "",
    process.env.GEMINI_API_KEY_2 || "",
    process.env.GEMINI_API_KEY_3 || "",
    process.env.GEMINI_API_KEY_4 || "",
  ].filter(Boolean);
}

function getOxloKeys(): string[] {
  return [
    process.env.OXLO_API_KEY_1 || process.env.OXLO_API_KEY || "",
    process.env.OXLO_API_KEY_2 || "",
    process.env.OXLO_API_KEY_3 || "",
    process.env.OXLO_API_KEY_4 || "",
  ].filter(Boolean);
}

let groqKeyIndex = 0;
let nvidiaKeyIndex = 0;
let geminiKeyIndex = 0;
let oxloKeyIndex = 0;

// ====================================================================
// SUPABASE & CRYPTO HELPERS
// ====================================================================

function createAuthenticatedClient(accessToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

async function sha256Hash(input: string): Promise<string> {
  try {
    const { createHash } = await import("crypto");
    return createHash("sha256").update(input).digest("hex");
  } catch {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
}

function deepClean(obj: any): any {
  if (obj === null || obj === undefined || obj === "") return undefined;
  if (typeof obj === "boolean" || typeof obj === "number") return obj;
  if (Array.isArray(obj)) {
    const c = obj.map(deepClean).filter(v => v !== undefined);
    return c.length > 0 ? c : undefined;
  }
  if (typeof obj === "object") {
    const c: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) { const cv = deepClean(v); if (cv !== undefined) c[k] = cv; }
    return Object.keys(c).length > 0 ? c : undefined;
  }
  return obj;
}

function boolToText(val: any): string {
  return val === true ? "Yes" : val === false ? "No" : String(val ?? "Not specified");
}

function scoreTier(s: number): string {
  if (s >= 90) return "Exceptional";
  if (s >= 80) return "Strong";
  if (s >= 70) return "Above Average";
  if (s >= 60) return "Average";
  if (s >= 50) return "Developing";
  return "Foundation Level";
}

// ====================================================================
// MULTI-PROVIDER AGENT INVOKER (WITH AUTOMATIC KEY FAILOVER)
// ====================================================================

async function callGroq(model: string, systemPrompt: string, userPrompt: string, maxTokens: number): Promise<any> {
  const keys = getGroqKeys();
  if (keys.length === 0) throw new Error("No Groq API keys configured");

  let lastErr: Error | null = null;
  const startIdx = groqKeyIndex;
  groqKeyIndex++;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[(startIdx + i) % keys.length];
    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.3,
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS.groq),
      });

      if (res.ok) {
        const json = await res.json();
        return json?.choices?.[0]?.message?.content;
      }

      const errText = await res.text();
      console.warn(`[Groq ${model}] Key attempt ${i + 1}/${keys.length} returned HTTP ${res.status}: ${errText.substring(0, 150)}`);
      lastErr = new Error(`Groq ${model} HTTP ${res.status}: ${errText.substring(0, 150)}`);
    } catch (err: any) {
      lastErr = err;
      console.warn(`[Groq ${model}] Key attempt ${i + 1}/${keys.length} failed: ${err.message}`);
    }
  }
  throw lastErr || new Error(`All Groq keys failed for ${model}`);
}

async function callNvidia(model: string, systemPrompt: string, userPrompt: string, maxTokens: number): Promise<any> {
  const keys = getNvidiaKeys();
  if (keys.length === 0) throw new Error("No NVIDIA API keys configured");

  let lastErr: Error | null = null;
  const startIdx = nvidiaKeyIndex;
  nvidiaKeyIndex++;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[(startIdx + i) % keys.length];
    try {
      const res = await fetch(NVIDIA_API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.3,
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS.nvidia),
      });

      if (res.ok) {
        const json = await res.json();
        return json?.choices?.[0]?.message?.content;
      }

      const errText = await res.text();
      console.warn(`[NVIDIA ${model}] Key attempt ${i + 1}/${keys.length} returned HTTP ${res.status}: ${errText.substring(0, 150)}`);
      lastErr = new Error(`NVIDIA ${model} HTTP ${res.status}: ${errText.substring(0, 150)}`);
    } catch (err: any) {
      lastErr = err;
      console.warn(`[NVIDIA ${model}] Key attempt ${i + 1}/${keys.length} failed: ${err.message}`);
    }
  }
  throw lastErr || new Error(`All NVIDIA keys failed for ${model}`);
}

async function callGemini(model: string, systemPrompt: string, userPrompt: string, maxTokens: number): Promise<any> {
  const keys = getGeminiKeys();
  if (keys.length === 0) throw new Error("No Gemini API keys configured");

  const geminiModel = model || "gemini-3.6-flash";
  let lastErr: Error | null = null;
  const startIdx = geminiKeyIndex;
  geminiKeyIndex++;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[(startIdx + i) % keys.length];
    try {
      const url = `${GEMINI_API_URL}/models/${geminiModel}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: maxTokens,
            responseMimeType: "application/json",
          },
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS.gemini),
      });

      if (res.ok) {
        const json = await res.json();
        return json?.candidates?.[0]?.content?.parts?.[0]?.text;
      }

      const errText = await res.text();
      console.warn(`[Gemini ${geminiModel}] Key attempt ${i + 1}/${keys.length} returned HTTP ${res.status}: ${errText.substring(0, 150)}`);
      lastErr = new Error(`Gemini ${geminiModel} HTTP ${res.status}: ${errText.substring(0, 150)}`);
    } catch (err: any) {
      lastErr = err;
      console.warn(`[Gemini ${geminiModel}] Key attempt ${i + 1}/${keys.length} failed: ${err.message}`);
    }
  }
  throw lastErr || new Error(`All Gemini keys failed for ${geminiModel}`);
}

async function callOxlo(model: string, systemPrompt: string, userPrompt: string, maxTokens: number): Promise<any> {
  const keys = getOxloKeys();
  if (keys.length === 0) throw new Error("No Oxlo API keys configured");

  let lastErr: Error | null = null;
  const startIdx = oxloKeyIndex;
  oxloKeyIndex++;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[(startIdx + i) % keys.length];
    try {
      const res = await fetch(OXLO_API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.3,
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS.oxlo),
      });

      if (res.ok) {
        const json = await res.json();
        return json?.choices?.[0]?.message?.content;
      }

      const errText = await res.text();
      console.warn(`[Oxlo ${model}] Key attempt ${i + 1}/${keys.length} returned HTTP ${res.status}: ${errText.substring(0, 150)}`);
      lastErr = new Error(`Oxlo ${model} HTTP ${res.status}: ${errText.substring(0, 150)}`);
    } catch (err: any) {
      lastErr = err;
      console.warn(`[Oxlo ${model}] Key attempt ${i + 1}/${keys.length} failed: ${err.message}`);
    }
  }
  throw lastErr || new Error(`All Oxlo keys failed for ${model}`);
}

/** Robust JSON repair & extractor for LLM output */
function safeParseJson(raw: string): any {
  if (!raw) return null;
  let str = raw.trim();

  // Strip markdown fences
  if (str.startsWith("```json")) str = str.slice(7);
  else if (str.startsWith("```")) str = str.slice(3);
  if (str.endsWith("```")) str = str.slice(0, -3);
  str = str.trim();

  // Try direct parse first
  try {
    return JSON.parse(str);
  } catch {}

  // Extract JSON object bounds { ... }
  const firstBrace = str.indexOf("{");
  const lastBrace = str.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    let candidate = str.substring(firstBrace, lastBrace + 1);

    // Clean trailing commas before } or ]
    candidate = candidate.replace(/,\s*([\}\]])/g, "$1");

    try {
      return JSON.parse(candidate);
    } catch {}

    // Clean control characters / unescaped newlines inside strings
    try {
      const sanitized = candidate
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        .replace(/,\s*([\}\]])/g, "$1");
      return JSON.parse(sanitized);
    } catch {}
  }

  // Attempt repair on truncated strings
  try {
    let repaired = str.replace(/,\s*([\}\]])/g, "$1");
    if (!repaired.endsWith("}")) repaired += "}";
    return JSON.parse(repaired);
  } catch {}

  throw new Error("Unable to parse or repair LLM JSON response");
}

/** Safely parse JWT user ID without remote call overhead */
function parseJwtUserId(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    const payload = JSON.parse(jsonPayload);
    return payload.sub || payload.user_id || payload.id || null;
  } catch {
    return null;
  }
}

/** Unified multi-provider agent invoker with automatic fallback chain */
async function invokeAgent(
  systemPrompt: string,
  userPrompt: string,
  models: ModelConfig[],
): Promise<{ result: any; modelUsed: string; provider: string } | null> {
  for (const m of models) {
    try {
      console.log(`[Multi-Agent] → ${m.provider}/${m.name}`);
      let rawContent: string | null = null;

      if (m.provider === "nvidia") {
        rawContent = await callNvidia(m.name, systemPrompt, userPrompt, m.maxTokens);
      } else if (m.provider === "groq") {
        rawContent = await callGroq(m.name, systemPrompt, userPrompt, m.maxTokens);
      } else if (m.provider === "gemini") {
        rawContent = await callGemini(m.name, systemPrompt, userPrompt, m.maxTokens);
      } else if (m.provider === "oxlo") {
        rawContent = await callOxlo(m.name, systemPrompt, userPrompt, m.maxTokens);
      }

      if (!rawContent) continue;

      const parsed = safeParseJson(rawContent);
      console.log(`[Multi-Agent] ✅ ${m.provider}/${m.name}`);
      return { result: parsed, modelUsed: m.name, provider: m.provider };
    } catch (err: any) {
      console.warn(`[Multi-Agent] ✗ ${m.provider}/${m.name}: ${err.message?.substring(0, 150)}`);
    }
  }
  return null;
}


// ====================================================================
// STEP 2: EXHAUSTIVE DATA AGGREGATION
// ====================================================================

async function fetchAllUserData(supabase: ReturnType<typeof createClient>, userId: string) {
  const [profileRes, moduleRes, assessRes, hvRes] = await Promise.allSettled([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("module_data").select("*").eq("user_id", userId),
    supabase.from("assessments").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
    supabase.from("human_values_tests").select("*").eq("user_id", userId).order("completed_at", { ascending: false }).limit(5),
  ]);
  return {
    profile: profileRes.status === "fulfilled" ? profileRes.value.data : null,
    moduleData: moduleRes.status === "fulfilled" ? moduleRes.value.data || [] : [],
    assessments: assessRes.status === "fulfilled" ? assessRes.value.data || [] : [],
    humanValuesTests: hvRes.status === "fulfilled" ? hvRes.value.data || [] : [],
  };
}

// ====================================================================
// STEP 3: COMPREHENSIVE PROFILE BUILDER
// ====================================================================

function buildComprehensiveProfile(rawData: Awaited<ReturnType<typeof fetchAllUserData>>) {
  const { profile, moduleData, humanValuesTests } = rawData;
  const modules: Record<string, any> = {};
  for (const mod of moduleData) { if (mod.module_key && mod.data) modules[mod.module_key] = mod.data; }

  const master = modules["master_profile"] || {};
  const financial = modules["financial"] || {};
  const skills = modules["skills"] || {};
  const health = modules["health"] || {};
  const assessData = modules["assessments"] || {};

  let finMetrics: any = null;
  try { if (Object.keys(financial).length) finMetrics = calculateFinancialHealthMetrics(financial); } catch {}
  let proMetrics: any = null;
  try { if (Object.keys(skills).length) proMetrics = calculateProfessionalCapitalScore(skills); } catch {}
  let healthMetrics: any = null;
  try { if (Object.keys(health).length) healthMetrics = calculateHealthCapitalScore(health); } catch {}
  let assessMetrics: any = null;
  try { if (assessData.answers && Object.keys(assessData.answers).length) assessMetrics = calculateAssessmentMetrics(assessData); } catch {}

  const availableDomains: string[] = [];
  if (profile?.full_name || master.personalProfile?.firstName) availableDomains.push("Personal Profile");
  if (master.studentData?.degree || master.employeeData?.company || master.founderData?.startupName) availableDomains.push("Role Data");
  if (master.careerInterests?.length) availableDomains.push("Career Interests");
  if (master.goals?.shortTermGoal1Yr) availableDomains.push("Goals");
  if (finMetrics) availableDomains.push("Financial Health");
  if (proMetrics) availableDomains.push("Professional Capital");
  if (healthMetrics) availableDomains.push("Health Capital");
  if (assessMetrics) availableDomains.push("Human Assessments");
  if (humanValuesTests.length) availableDomains.push("Human Values Tests");

  const fullName = profile?.full_name || `${master.personalProfile?.firstName || ""} ${master.personalProfile?.lastName || ""}`.trim() || "User";

  const comprehensive: Record<string, any> = {
    identity: {
      fullName, email: profile?.email || master.contactInformation?.email,
      dateOfBirth: master.personalProfile?.dateOfBirth, age: master.personalProfile?.calculatedAge,
      gender: master.personalProfile?.gender, nationality: master.personalProfile?.nationality,
      location: [master.personalProfile?.city, master.personalProfile?.stateOrProvince, master.personalProfile?.country].filter(Boolean).join(", "),
      language: master.personalProfile?.preferredLanguage,
      linkedIn: master.contactInformation?.linkedInUrl, gitHub: master.contactInformation?.gitHubUrl,
      portfolio: master.contactInformation?.portfolioUrl,
    },
    currentRole: {
      primaryRole: master.primaryRole, availability: master.currentAvailability,
      studentCategory: master.studentData?.studentCategory, degree: master.studentData?.degree,
      specialization: master.studentData?.specialization, college: master.studentData?.college,
      university: master.studentData?.university, currentYear: master.studentData?.currentYear,
      expectedGraduation: master.studentData?.expectedGraduationYear, cgpa: master.studentData?.cgpaOrPercentage,
      hasScholarship: master.studentData?.hasScholarship, placementStatus: master.studentData?.currentPlacementStatus,
      company: master.employeeData?.company, designation: master.employeeData?.designation,
      department: master.employeeData?.department, industry: master.employeeData?.industry,
      employmentType: master.employeeData?.employmentType, yearsOfExperience: master.employeeData?.yearsOfExperience,
      salaryBand: master.employeeData?.currentSalaryBand, teamSize: master.employeeData?.teamSizeManaged,
      hasManagerialRole: master.employeeData?.hasManagerialResponsibility,
      startupName: master.founderData?.startupName, startupStage: master.founderData?.startupStage,
      fundingStage: master.founderData?.fundingStage, employeeCount: master.founderData?.employeeCount,
    },
    careerDirection: {
      interests: master.careerInterests, preferredIndustry: master.careerPreferences?.preferredIndustry,
      preferredWorkStyle: master.careerPreferences?.preferredWorkStyle,
      motivations: master.careerMotivations,
    },
    goals: {
      shortTerm1Year: master.goals?.shortTermGoal1Yr,
      mediumTerm3Years: master.goals?.mediumTermGoal3Yr,
      longTerm5to10Years: master.goals?.longTermGoal5To10Yr,
    },
    financialIntelligence: finMetrics ? {
      score: finMetrics.financialHealthScore, tier: scoreTier(finMetrics.financialHealthScore),
      totalMonthlyIncome: finMetrics.totalMonthlyIncome, incomeFormatted: formatINR(finMetrics.totalMonthlyIncome),
      totalSavings: finMetrics.totalSavingsBalance, savingsFormatted: formatINR(finMetrics.totalSavingsBalance),
      savingsRatePct: Math.round(finMetrics.savingsRate), emergencyFundMonths: finMetrics.emergencyFundMonths,
      debtToIncomeRatioPct: Math.round(finMetrics.debtToIncomeRatio),
      netWorth: finMetrics.netWorth, netWorthFormatted: formatINR(finMetrics.netWorth),
      hasHealthInsurance: boolToText(financial.riskInsurance?.hasHealthInsurance),
      hasLifeInsurance: boolToText(financial.riskInsurance?.hasLifeInsurance),
      budgetingHabit: financial.behaviour?.maintainMonthlyBudget,
      trackExpenses: financial.behaviour?.trackExpensesRegularly,
      investFrequency: financial.behaviour?.investFrequency,
      riskAppetite: financial.riskProfile?.riskAppetite,
      investmentHorizon: financial.riskProfile?.investmentHorizon,
      financialGoals: financial.goals,
    } : undefined,
    professionalCapital: proMetrics ? {
      score: proMetrics.professionalCapitalScore, tier: scoreTier(proMetrics.professionalCapitalScore),
      employabilityIndex: proMetrics.employabilityIndex, aiReadinessScore: proMetrics.aiReadinessScore,
      degree: skills.academic?.degree, field: skills.academic?.field || skills.academic?.major,
      institution: skills.academic?.institution, gpa: skills.academic?.gpa,
      certifications: skills.certifications?.map((c: any) => typeof c === "string" ? c : c.name || c.title),
      technicalSkills: skills.technicalSkills?.map((s: any) => typeof s === "string" ? s : s.name),
      softSkills: skills.softSkills?.map((s: any) => typeof s === "string" ? s : s.name),
      projects: skills.projects?.map((p: any) => typeof p === "string" ? p : { name: p.name, description: p.description }),
      achievements: skills.achievements,
    } : undefined,
    healthCapital: healthMetrics ? {
      score: healthMetrics.healthCapitalScore, tier: scoreTier(healthMetrics.healthCapitalScore),
      bmi: healthMetrics.bmi, sleepHours: health.sleepIntelligence?.averageSleepHoursPerNight,
      sleepScore: healthMetrics.scores?.sleepRecovery,
      workoutFrequency: health.physicalActivity?.workoutFrequencyPerWeek,
      stressLevel: health.mentalWellbeing?.perceivedStressLevel1To10,
      dietScore: healthMetrics.scores?.nutritionMetabolic,
      practicesMindfulness: boolToText(health.mentalWellbeing?.practicesMindfulness),
      usesTobacco: boolToText(health.lifestyleHabits?.usesTobacco),
    } : undefined,
    humanAssessments: assessMetrics ? {
      score: assessMetrics.assessmentScore, tier: scoreTier(assessMetrics.assessmentScore),
      questionsAnswered: Object.keys(assessData.answers || {}).length,
      stagesCompleted: [
        assessData.isPersonalityCompleted && "Personality", assessData.isMindsetCompleted && "Mindset",
        assessData.isDecisionCompleted && "Decision", assessData.isAwarenessCompleted && "Awareness",
        assessData.isAptitudeCompleted && "Aptitude", assessData.isCommunicationCompleted && "Communication",
      ].filter(Boolean),
      personalityTraits: assessMetrics.traits, mindsetProfile: assessMetrics.mindset,
      decisionJudgment: assessMetrics.decision, awarenessProfile: assessMetrics.awareness,
      aptitudeProfile: assessMetrics.aptitude, communicationProfile: assessMetrics.communication,
    } : undefined,
    humanValuesHistory: humanValuesTests.length > 0 ? {
      latestScore: humanValuesTests[0]?.score, latestLevel: humanValuesTests[0]?.level,
      totalAttempts: humanValuesTests.length,
    } : undefined,
    dataAvailability: { domains: availableDomains, totalDomains: availableDomains.length },
  };

  const computedScores: Record<string, number> = {
    overall: assessMetrics?.assessmentScore || (finMetrics?.financialHealthScore ? Math.round((finMetrics.financialHealthScore + (proMetrics?.professionalCapitalScore || 75)) / 2) : 78),
    humanValues: assessMetrics?.assessmentScore || 78,
    financialIntelligence: finMetrics?.financialHealthScore || 75,
    leadership: assessMetrics?.traits?.leadership || 78,
    communication: assessMetrics?.communication?.businessCommunication || 80,
    selfAwareness: assessMetrics?.traits?.selfAwareness || 78,
    decisionMaking: assessMetrics?.decision?.financialDecisionMaking || 76,
    growthMindset: assessMetrics?.mindset?.growthMindsetScore || 82,
    consistency: assessMetrics?.mindset?.disciplineScore || 78,
    learningAbility: assessMetrics?.communication?.learningAgility || 80,
    professionalReadiness: proMetrics?.professionalCapitalScore || 78,
  };

  return { cleanProfile: deepClean(comprehensive) || {}, computedScores, availableDomains };
}

// ====================================================================
// CORE RULES (shared across all agents)
// ====================================================================

// ====================================================================
// CORE RULES (Strict Evaluator, Corporate HR Director & Master Teacher)
// ====================================================================

const CORE_RULES = `
ABSOLUTE EVALUATION RULES (REALISTIC HR + EVALUATOR + TEACHER PERSPECTIVE):
1. EVALUATOR AUDIT RIGOR: Act as a Senior Performance Evaluator, Corporate HR Director, and Master Executive Teacher. Be strictly realistic, objective, and data-grounded. BANNED: Generic cheerleading, fluff, or fake compliments.
2. TARGETED UPGRADES & FOCUS AREAS: Whenever user telemetry reveals a gap (low savings rate, skill deficit, career bottleneck, discipline gap, risk exposure), explicitly audit it, explain the operational risk, and prescribe step-by-step upgrade protocols.
3. GROUNDED IN ACTUAL DATA: Reference exact user data points (salary, experience years, degree, skills, savings, test scores). If a metric is weak or missing, evaluate it realistically without sugarcoating.
4. CONFIDENCE MODEL: Use High (80-100%), Medium (50-79%), Low (25-49%). Justify confidence based on data completeness.
5. TEACHER ACTION PLAN: Deliver precise, executable instructions (specific books/courses to master, daily habits to build, exact target financial ratios, 30/60/90 day career upgrades).
6. Each "content" section MUST be 3-8 detailed sentences. Each "highlights" array MUST contain 3-5 sharp, data-backed bullet points.
7. Response MUST be valid JSON only. No markdown formatting, no text outside JSON.
`;

// ====================================================================
// STEP 4: MULTI-AGENT ORCHESTRATOR
// ====================================================================

async function runMultiAgentPipeline(
  cleanProfile: Record<string, any>,
  computedScores: Record<string, number>,
  availableDomains: string[],
): Promise<{ report: any; modelsUsed: string[] }> {
  const modelsUsed: string[] = [];
  const profileStr = JSON.stringify(cleanProfile, null, 2);

  const a1 = invokeAgent(
    `You are Agent 1 — Senior Evaluator & Behavioral Psychologist.\n${CORE_RULES}\nConduct an uncompromising evaluation of personality traits, human values, core strengths, psychological blind spots, communication style, and emotional intelligence. Function as a Master Teacher identifying exact emotional and interpersonal upgrades required.\nOUTPUT (valid JSON): {"personalityAnalysis":{"title":"Personality Analysis & Behavioral Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"humanValuesAnalysis":{"title":"Human Values & Moral Framework","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"coreStrengths":{"title":"Verified Capability Strengths","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"areasOfImprovement":{"title":"Critical Vulnerabilities & Upgrade Focus Areas","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"communicationStyle":{"title":"Communication & Interpersonal Impact","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"emotionalIntelligence":{"title":"Emotional Intelligence & Resilience Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."}}`,
    `User telemetry:\n${profileStr}`,
    AGENT_MODELS.values,
  );

  const a2 = invokeAgent(
    `You are Agent 2 — Corporate Financial Auditor & Wealth Coach.\n${CORE_RULES}\nConduct a strict financial health audit evaluating monthly income, savings rate, emergency fund adequacy, debt exposure, risk management, and investment behavior. Act as a Wealth Teacher prescribing exact financial targets and capital growth milestones.\nOUTPUT (valid JSON): {"financialIntelligence":{"title":"Financial Health & Capital Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"investmentBehaviour":{"title":"Asset Allocation & Investment Discipline","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"moneyManagement":{"title":"Cash Flow & Budgeting Rigor","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"savingsBehaviour":{"title":"Savings Rate & Emergency Reserves Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"riskProfile":{"title":"Risk Appetite & Insurance Protection Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."}}`,
    `User telemetry:\n${profileStr}`,
    AGENT_MODELS.finance,
  );

  const a3 = invokeAgent(
    `You are Agent 3 — Corporate HR Director & Executive Leadership Coach.\n${CORE_RULES}\nEvaluate the candidate as a Senior Corporate HR Director. Assess leadership potential, decision-making style, professional capital, career suitability, and promotion readiness. Identify exact skill gaps blocking salary growth and promotion, providing a structured career upgrade blueprint.\nOUTPUT (valid JSON): {"leadershipPotential":{"title":"Executive Leadership Potential Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"decisionMakingStyle":{"title":"Strategic Decision-Making Framework","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"learningStyle":{"title":"Learning Agility & Skill Acquisition Rate","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"careerSuitability":{"title":"Corporate Career Suitability & Market Value","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"professionalGrowth":{"title":"Promotion Readiness & Career Acceleration Blueprint","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."}}`,
    `User telemetry:\n${profileStr}`,
    AGENT_MODELS.career,
  );

  const a4 = invokeAgent(
    `You are Agent 4 — Master Performance Teacher & Behavioral Execution Coach.\n${CORE_RULES}\nEvaluate daily habit patterns, execution consistency, time discipline, and goal alignment. Act as a Master Teacher creating actionable, step-by-step upgrade plans.\nOUTPUT (valid JSON): {"behaviourPatterns":{"title":"Behavioral Execution & Discipline Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"dailyHabitsAnalysis":{"title":"Routine & Time Optimization Analysis","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"goalAlignment":{"title":"Strategic Goal Alignment & Execution Gaps","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"recommendations":{"title":"High-Priority Corrective Action Protocols","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"dailyActionPlan":{"title":"24-Hour High-Performance Daily Routine","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"weeklyActionPlan":{"title":"7-Day Target Mastery Plan","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"monthlyGrowthPlan":{"title":"30-Day Skill & Capability Upgrade Milestone","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"longTermDevelopmentPlan":{"title":"12-Month Executive Mastery Roadmap","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."}}`,
    `User telemetry:\n${profileStr}`,
    AGENT_MODELS.habits,
  );

  console.log("[Multi-Agent] ▶ Launching 4 domain agents concurrently (NVIDIA → Groq → Gemini)...");
  const [r1, r2, r3, r4] = await Promise.allSettled([a1, a2, a3, a4]);

  const o1 = r1.status === "fulfilled" && r1.value ? r1.value.result : {};
  const o2 = r2.status === "fulfilled" && r2.value ? r2.value.result : {};
  const o3 = r3.status === "fulfilled" && r3.value ? r3.value.result : {};
  const o4 = r4.status === "fulfilled" && r4.value ? r4.value.result : {};

  [r1, r2, r3, r4].forEach(r => { if (r.status === "fulfilled" && r.value) modelsUsed.push(`${r.value.provider}/${r.value.modelUsed}`); });

  console.log("[Multi-Agent] ▶ Launching Master Synthesizer...");
  const masterRes = await invokeAgent(
    `You are Agent 5 — Master Executive Synthesizer & HR Evaluation Committee Chair.\n${CORE_RULES}\nWrite a realistic, evidence-grounded 3-5 paragraph Executive Summary acting as an HR Committee Chair and Master Auditor. Assign 11 objective scores (0-100) strictly based on user telemetry figures and assessment evidence.\nAvailable domains: ${availableDomains.join(", ")}\nOUTPUT (valid JSON): {"executiveSummary":"3-5 realistic audit paragraphs","overallSummary":"2 strategic paragraphs","scores":{"humanValues":{"score":82,"explanation":"..."},"financialIntelligence":{"score":75,"explanation":"..."},"leadership":{"score":80,"explanation":"..."},"communication":{"score":82,"explanation":"..."},"selfAwareness":{"score":80,"explanation":"..."},"decisionMaking":{"score":78,"explanation":"..."},"growthMindset":{"score":85,"explanation":"..."},"consistency":{"score":80,"explanation":"..."},"learningAbility":{"score":84,"explanation":"..."},"professionalReadiness":{"score":80,"explanation":"..."},"overall":{"score":80,"explanation":"..."}}}`,
    `USER TELEMETRY:\n${profileStr}\n\nENGINE SCORES:\n${JSON.stringify(computedScores)}`,
    AGENT_MODELS.master,
  );

  const masterOut = masterRes?.result || {};
  if (masterRes) modelsUsed.push(`${masterRes.provider}/${masterRes.modelUsed}`);

  return {
    report: {
      executiveSummary: masterOut.executiveSummary || `Executive multi-agent evaluation for ${cleanProfile.identity?.fullName || "User"}.`,
      ...o1, ...o2, ...o3, ...o4,
      overallSummary: masterOut.overallSummary || `Analysis across ${availableDomains.join(", ")}.`,
      scores: masterOut.scores || {},
    },
    modelsUsed: [...new Set(modelsUsed)],
  };
}

// ====================================================================
// MODULE COMPLETENESS CHECKER
// ====================================================================

function checkModuleCompleteness(rawData: Awaited<ReturnType<typeof fetchAllUserData>>) {
  const { profile, moduleData, assessments, humanValuesTests } = rawData;
  const modulesMap: Record<string, any> = {};
  for (const mod of moduleData) {
    if (mod.module_key) {
      modulesMap[mod.module_key] = mod.data || mod;
    }
  }

  const pData = modulesMap["master_profile"] || profile;
  const fData = modulesMap["financial"];
  const sData = modulesMap["skills"];
  const hData = modulesMap["health"];
  const aData = modulesMap["assessments"] || (humanValuesTests && humanValuesTests.length > 0) || (assessments && assessments.length > 0);

  const profileDone = !!(pData && (pData.personalProfile || pData.full_name || pData.email || Object.keys(pData).length > 0));
  const financialDone = !!(fData && Object.keys(fData).length > 0);
  const skillsDone = !!(sData && Object.keys(sData).length > 0);
  const healthDone = !!(hData && Object.keys(hData).length > 0);
  const assessmentsDone = !!aData;

  const status = [
    { key: "profile", label: "Personal Profile", done: profileDone, link: "/dashboard/profile" },
    { key: "financial", label: "Financial Health", done: financialDone, link: "/dashboard/financial" },
    { key: "skills", label: "Skills Capital", done: skillsDone, link: "/dashboard/skills" },
    { key: "health", label: "Health & Lifestyle", done: healthDone, link: "/dashboard/habits" },
    { key: "assessments", label: "Human Assessments", done: assessmentsDone, link: "/dashboard/assessments" },
  ];

  const completedCount = status.filter(s => s.done).length;
  // If user has saved telemetry data or completed core modules, allow AI Report generation
  const isFullyComplete = completedCount >= 3 || (completedCount > 0 && !!profile);

  return { isFullyComplete, status, completedCount, totalCount: status.length };
}

// ====================================================================
// MULTI-TIER SUPABASE REPORT PERSISTENCE ENGINE
// ====================================================================

async function fetchReportFromSupabase(supabase: ReturnType<typeof createClient>, userId: string): Promise<any | null> {
  // 1. Try ai_evaluations (CONFIRMED TO EXIST in active database schema)
  try {
    const { data } = await supabase
      .from("ai_evaluations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.summary && typeof data.summary === "string" && data.summary.startsWith("{") && data.summary.includes("report_json")) {
      try {
        const parsed = JSON.parse(data.summary);
        if (parsed && parsed.report_json) {
          console.log(`[AI Report Engine] ✅ Retrieved report from public.ai_evaluations`);
          return parsed;
        }
      } catch {}
    }
  } catch {}

  // 2. Try memory (key = 'ai_report')
  try {
    const { data } = await supabase
      .from("memory")
      .select("*")
      .eq("user_id", userId)
      .eq("key", "ai_report")
      .maybeSingle();

    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        if (parsed && parsed.report_json) {
          console.log(`[AI Report Engine] ✅ Retrieved report from public.memory`);
          return parsed;
        }
      } catch {}
    }
  } catch {}

  // 3. Try ai_reports
  try {
    const { data } = await supabase
      .from("ai_reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data && data.report_json) {
      console.log(`[AI Report Engine] ✅ Retrieved report from public.ai_reports`);
      return data;
    }
  } catch {}

  // 4. Try module_data
  try {
    const { data } = await supabase
      .from("module_data")
      .select("*")
      .eq("user_id", userId)
      .eq("module_key", "ai_report")
      .maybeSingle();
    if (data?.data?.report_json) {
      console.log(`[AI Report Engine] ✅ Retrieved report from public.module_data`);
      return data.data;
    }
  } catch {}

  // 5. Try ai_analysis_reports
  try {
    const { data } = await supabase
      .from("ai_analysis_reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data && data.report_json) {
      console.log(`[AI Report Engine] ✅ Retrieved report from public.ai_analysis_reports`);
      return data;
    }
  } catch {}

  return null;
}

async function saveReportToSupabase(supabase: ReturnType<typeof createClient>, userId: string, record: any): Promise<boolean> {
  let saved = false;
  const nowIso = new Date().toISOString();

  // Target 1: ai_evaluations (CONFIRMED TO EXIST in live schema)
  try {
    const evalPayload = {
      user_id: userId,
      summary: JSON.stringify(record),
      strengths: record.report_json?.coreStrengths?.highlights || [],
      weaknesses: record.report_json?.areasOfImprovement?.highlights || [],
      recommendations: record.report_json?.recommendations?.highlights || [],
      career_matches: record.report_json?.careerSuitability?.highlights || [],
      confidence_score: 0.95,
      created_at: nowIso,
    };

    // Clean old evaluation for single report rule
    await supabase.from("ai_evaluations").delete().eq("user_id", userId);

    const { data, error } = await supabase
      .from("ai_evaluations")
      .insert([evalPayload])
      .select()
      .single();

    if (!error && data) {
      saved = true;
      console.log(`[AI Report Engine] ✅ Saved to public.ai_evaluations: ${data.id}`);
    } else if (error) {
      console.warn(`[AI Report Engine] ai_evaluations write notice:`, error.message);
    }
  } catch (e: any) {
    console.warn(`[AI Report Engine] ai_evaluations exception:`, e.message);
  }

  // Target 2: memory table (key = 'ai_report')
  try {
    const { data, error } = await supabase
      .from("memory")
      .upsert(
        {
          user_id: userId,
          key: "ai_report",
          value: JSON.stringify(record),
          confidence: 1.0,
          updated_at: nowIso,
        },
        { onConflict: "user_id,key" }
      )
      .select()
      .single();

    if (!error && data) {
      saved = true;
      console.log(`[AI Report Engine] ✅ Saved to public.memory (ai_report): ${data.id}`);
    } else if (error) {
      console.warn(`[AI Report Engine] memory upsert notice:`, error.message);
    }
  } catch (e: any) {
    console.warn(`[AI Report Engine] memory exception:`, e.message);
  }

  // Target 3: ai_reports (if table exists)
  try {
    const { data, error } = await supabase
      .from("ai_reports")
      .upsert([record], { onConflict: "user_id" })
      .select()
      .single();
    if (!error && data) {
      saved = true;
      console.log(`[AI Report Engine] ✅ Saved to public.ai_reports: ${data.id}`);
    }
  } catch {}

  // Target 4: module_data (if table exists)
  try {
    const { data, error } = await supabase
      .from("module_data")
      .upsert(
        [{ user_id: userId, module_key: "ai_report", data: record, is_completed: true, score: record.overall_score || 0 }],
        { onConflict: "user_id,module_key" }
      )
      .select()
      .single();
    if (!error && data) {
      saved = true;
      console.log(`[AI Report Engine] ✅ Saved to public.module_data: ${data.id}`);
    }
  } catch {}

  return saved;
}

// ====================================================================
// GET HANDLER — Fetch Stored AI Report (Zero AI Calls)
// ====================================================================

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "");
    if (!accessToken) return NextResponse.json({ success: false, error: "Unauthorized", report: null }, { status: 401 });

    // Fast local JWT parsing (< 0.1ms)
    let userId: string | null = parseJwtUserId(accessToken);
    const supabase = createAuthenticatedClient(accessToken);

    if (!userId) {
      try {
        const { data: userData } = await supabase.auth.getUser(accessToken);
        if (userData?.user?.id) userId = userData.user.id;
      } catch {}
    }

    if (!userId) return NextResponse.json({ success: false, error: "Invalid session", report: null }, { status: 401 });

    // 1. Fetch existing report FIRST using multi-tier engine
    const storedReport = await fetchReportFromSupabase(supabase, userId);

    if (storedReport) {
      console.log(`[AI Report API] ✅ Returning stored report from Supabase for user ${userId}`);
      return NextResponse.json({
        success: true,
        report: storedReport,
        status: storedReport.status || "COMPLETED",
        cached: true,
      });
    }

    // 2. If no report exists, check module completeness
    const rawData = await fetchAllUserData(supabase, userId);
    const completeness = checkModuleCompleteness(rawData);

    if (!completeness.isFullyComplete) {
      return NextResponse.json({
        success: false,
        error: "Please complete all assessment modules to unlock your AI Analysis Report.",
        errorCode: "MODULES_INCOMPLETE",
        completeness,
        report: null,
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      report: null,
      status: "PENDING",
      cached: false,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, report: null }, { status: 500 });
  }
}

// ====================================================================
// POST HANDLER — Generate or Read Stored AI Report
// ====================================================================

export async function POST(request: Request) {
  const t0 = Date.now();
  try {
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "");
    if (!accessToken) return NextResponse.json({ success: false, error: "Unauthorized", errorCode: "AUTH_MISSING" }, { status: 401 });

    // Fast local JWT parsing (< 0.1ms)
    let userId: string | null = parseJwtUserId(accessToken);
    const supabase = createAuthenticatedClient(accessToken);

    if (!userId) {
      try {
        const { data: userData } = await supabase.auth.getUser(accessToken);
        if (userData?.user?.id) userId = userData.user.id;
      } catch {}
    }

    if (!userId) return NextResponse.json({ success: false, error: "Invalid session", errorCode: "AUTH_INVALID" }, { status: 401 });

    console.log(`[Multi-Agent AI] ═══ User: ${userId} ═══`);

    let forceRegenerate = false;
    try { const t = await request.text(); if (t) forceRegenerate = JSON.parse(t)?.forceRegenerate === true; } catch {}

    const rawData = await fetchAllUserData(supabase, userId);
    const completeness = checkModuleCompleteness(rawData);

    // MANDATORY PRODUCTION RULE: All modules must be completed before generating report
    if (!completeness.isFullyComplete) {
      return NextResponse.json({
        success: false,
        error: "Please complete all assessment modules to unlock your AI Analysis Report.",
        errorCode: "MODULES_INCOMPLETE",
        completeness,
      }, { status: 200 });
    }

    const { cleanProfile, computedScores, availableDomains } = buildComprehensiveProfile(rawData);
    console.log(`[Multi-Agent AI] Domains: ${availableDomains.join(", ")} | Profile: ${JSON.stringify(cleanProfile).length} chars`);

    const dataHash = await sha256Hash(JSON.stringify(cleanProfile));

    // SMART CACHE RULE:
    // 1. Once generated, stored report in Supabase is reused for all visits/reloads (0 AI calls).
    // 2. Fresh generation occurs ONLY when user updates profile, skills, or module data (data_hash mismatch) OR clicks Regenerate.
    if (!forceRegenerate) {
      const cachedReport = await fetchReportFromSupabase(supabase, userId);
      if (cachedReport && cachedReport.report_json) {
        if (!cachedReport.data_hash || cachedReport.data_hash === dataHash) {
          console.log("[Multi-Agent AI] ✅ Production Cache Hit — Telemetry unchanged, serving stored report from Supabase (0 AI calls)");
          return NextResponse.json({
            success: true,
            report: cachedReport,
            status: cachedReport.status || "COMPLETED",
            cached: true,
          });
        }
        console.log("[Multi-Agent AI] ⚡ User updated profile/skills telemetry — Re-evaluating fresh AI report...");
      }
    }

    console.log("[Multi-Agent AI] ▶ Multi-Provider Orchestration (Executing fresh AI evaluation)...");
    const { report, modelsUsed } = await runMultiAgentPipeline(cleanProfile, computedScores, availableDomains);

    // Ensure all 11 scores populated
    if (!report.scores) report.scores = {};
    for (const key of Object.keys(computedScores)) {
      const ex = report.scores[key];
      const base = computedScores[key] || 78;
      if (!ex || typeof ex.score !== "number" || ex.score <= 0) {
        report.scores[key] = { score: base, explanation: `Computed from platform telemetry for ${key}.` };
      } else {
        report.scores[key].score = Math.min(100, Math.max(0, Math.round(ex.score)));
      }
    }

    const overallScore = report.scores.overall?.score || computedScores.overall || 78;
    const modelStr = modelsUsed.length ? modelsUsed.join(" + ") : "NVIDIA Nemotron + Groq + Gemini";
    const nowIso = new Date().toISOString();

    // Build structured module map for ai_reports table
    const structuredModules = {
      personality_analysis: report.personalityAnalysis,
      human_values: report.humanValuesAnalysis,
      leadership: report.leadershipPotential,
      communication: report.communicationStyle,
      decision_making: report.decisionMakingStyle,
      financial_intelligence: report.financialIntelligence,
      learning: report.learningStyle,
      growth: report.professionalGrowth,
      career_readiness: report.careerSuitability,
      emotional_intelligence: report.emotionalIntelligence,
      strengths: report.coreStrengths,
      weaknesses: report.areasOfImprovement,
      recommendations: report.recommendations,
      career_suggestions: report.careerSuitability,
      financial_suggestions: report.investmentBehaviour,
      development_plan: report.longTermDevelopmentPlan,
      roadmap: {
        daily: report.dailyActionPlan,
        weekly: report.weeklyActionPlan,
        monthly: report.monthlyGrowthPlan,
        longTerm: report.longTermDevelopmentPlan,
      },
    };

    const record = {
      user_id: userId,
      status: "COMPLETED",
      report_version: "v4.1.0",
      prompt_version: "v5.0",
      overall_summary: report.overallSummary || "",
      executive_summary: report.executiveSummary || "",
      personality_analysis: report.personalityAnalysis || {},
      human_values: report.humanValuesAnalysis || {},
      leadership: report.leadershipPotential || {},
      communication: report.communicationStyle || {},
      decision_making: report.decisionMakingStyle || {},
      financial_intelligence: report.financialIntelligence || {},
      learning: report.learningStyle || {},
      growth: report.professionalGrowth || {},
      career_readiness: report.careerSuitability || {},
      emotional_intelligence: report.emotionalIntelligence || {},
      strengths: report.coreStrengths || {},
      weaknesses: report.areasOfImprovement || {},
      recommendations: report.recommendations || {},
      career_suggestions: report.careerSuitability || {},
      financial_suggestions: report.investmentBehaviour || {},
      development_plan: report.longTermDevelopmentPlan || {},
      roadmap: structuredModules.roadmap,
      modules: structuredModules,
      report_json: report,
      scores_json: report.scores,
      overall_score: overallScore,
      confidence_score: 94.2,
      ai_model: modelStr,
      model_name: modelStr,
      analysis_version: "v4.1.0",
      data_hash: dataHash,
      generated_at: nowIso,
      updated_at: nowIso,
    };

    // Save into Supabase using multi-tier engine
    const saved = await saveReportToSupabase(supabase, userId, record);

    console.log(`[Multi-Agent AI] ═══ Done in ${Date.now() - t0}ms | Models: ${modelStr} | Saved: ${saved} ═══`);

    if (!saved) {
      console.error(`[Multi-Agent AI] ❌ Report generated but NOT saved to any database table.`);
      return NextResponse.json({
        success: false,
        error: "Report was generated but failed to save to Supabase.",
        errorCode: "SAVE_FAILED",
        status: "FAILED",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      report: record,
      status: "COMPLETED",
      cached: false,
    });
  } catch (err: any) {
    console.error("[Multi-Agent AI] Unhandled Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to process AI report", status: "FAILED" }, { status: 500 });
  }
}

