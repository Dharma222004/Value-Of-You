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

export const dynamic = "force-dynamic";
import { calculateProfessionalCapitalScore } from "@/lib/professionalCapitalEngine";
import { calculateHealthCapitalScore } from "@/lib/healthCapitalEngine";
import { calculateAssessmentMetrics } from "@/lib/assessmentEngine";
import { checkRateLimit } from "@/lib/security";

// ====================================================================
// CONFIGURATION
// ====================================================================

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const OXLO_API_URL = process.env.OXLO_API_BASE_URL || "https://api.oxlo.ai/v1/chat/completions";
const ANALYSIS_VERSION = "v4.2.0 Multi-Agent AI Analysis Engine";

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

// STRATEGY: High-Speed Multi-Agent execution across Groq, Google Gemini & Oxlo AI
// Diversified primary models across concurrent agents prevent rate-limit congestion:
// Agent 1 (Values)  → Groq llama-3.3-70b-versatile → Gemini 2.5 Flash → Groq openai/gpt-oss-120b → Oxlo DeepSeek-V3.2
// Agent 2 (Finance) → Groq openai/gpt-oss-120b → Groq llama-3.3-70b-versatile → Gemini 2.5 Flash → Oxlo DeepSeek-R1-8B
// Agent 3 (Career)  → Gemini 2.5 Flash → Groq llama-3.3-70b-versatile → Groq openai/gpt-oss-120b → Oxlo Mistral-7B
// Agent 4 (Habits)  → Groq llama-3.1-8b-instant → Gemini 2.5 Flash → Groq openai/gpt-oss-120b → Oxlo Gemma-3-4B
// Master Synthesizer → Groq llama-3.3-70b-versatile → Gemini 2.5 Flash → Groq openai/gpt-oss-120b → Oxlo DeepSeek-V3.2
const AGENT_MODELS: Record<string, ModelConfig[]> = {
  values: [
    { name: "llama-3.3-70b-versatile", provider: "groq", maxTokens: 3000 },
    { name: "gemini-2.5-flash", provider: "gemini", maxTokens: 3000 },
    { name: "openai/gpt-oss-120b", provider: "groq", maxTokens: 3000 },
    { name: "deepseek-ai/DeepSeek-V3.2", provider: "oxlo", maxTokens: 3000 },
  ],
  finance: [
    { name: "openai/gpt-oss-120b", provider: "groq", maxTokens: 3000 },
    { name: "llama-3.3-70b-versatile", provider: "groq", maxTokens: 3000 },
    { name: "gemini-2.5-flash", provider: "gemini", maxTokens: 3000 },
    { name: "deepseek-ai/DeepSeek-R1-8B", provider: "oxlo", maxTokens: 3000 },
  ],
  career: [
    { name: "gemini-2.5-flash", provider: "gemini", maxTokens: 3000 },
    { name: "llama-3.3-70b-versatile", provider: "groq", maxTokens: 3000 },
    { name: "openai/gpt-oss-120b", provider: "groq", maxTokens: 3000 },
    { name: "mistralai/Mistral-7B-Instruct-v0.3", provider: "oxlo", maxTokens: 3000 },
  ],
  habits: [
    { name: "llama-3.1-8b-instant", provider: "groq", maxTokens: 3000 },
    { name: "gemini-2.5-flash", provider: "gemini", maxTokens: 3000 },
    { name: "openai/gpt-oss-120b", provider: "groq", maxTokens: 3000 },
    { name: "google/gemma-3-4b-it", provider: "oxlo", maxTokens: 3000 },
  ],
  master: [
    { name: "llama-3.3-70b-versatile", provider: "groq", maxTokens: 3500 },
    { name: "gemini-2.5-flash", provider: "gemini", maxTokens: 3500 },
    { name: "openai/gpt-oss-120b", provider: "groq", maxTokens: 3500 },
    { name: "deepseek-ai/DeepSeek-V3.2", provider: "oxlo", maxTokens: 3500 },
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

  const geminiModel = model || "gemini-2.5-flash";
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
  const allowNvidia = process.env.ENABLE_NVIDIA_API === "true";

  for (const m of models) {
    if (m.provider === "nvidia" && !allowNvidia) {
      continue;
    }
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

async function fetchAllUserData(supabase: ReturnType<typeof createAuthenticatedClient>, userId: string) {
  const [profileRes, moduleRes, assessRes, hvRes] = await Promise.allSettled([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("module_data").select("*").eq("user_id", userId),
    supabase.from("assessments").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
    supabase.from("human_values_tests").select("*").eq("user_id", userId).order("completed_at", { ascending: false }).limit(5),
  ]);

  const profile: Record<string, any> | null =
    profileRes.status === "fulfilled" ? (profileRes.value.data as any) : null;
  const moduleData: Array<{ module_key: string; data: Record<string, any> | null; is_completed: boolean }> =
    moduleRes.status === "fulfilled" ? (moduleRes.value.data as any ?? []) : [];
  const assessments: any[] =
    assessRes.status === "fulfilled" ? (assessRes.value.data as any || []) : [];
  const humanValuesTests: any[] =
    hvRes.status === "fulfilled" ? (hvRes.value.data as any || []) : [];

  // DEBUG: log what was actually fetched from Supabase
  console.log(`[AI Data Pipeline] User: ${userId}`);
  console.log(`[AI Data Pipeline] Profile: ${profile ? JSON.stringify(Object.keys(profile)) : 'NULL'}`);
  console.log(`[AI Data Pipeline] Module rows: ${moduleData.length} — keys: [${moduleData.map((m) => m.module_key).join(', ')}]`);
  moduleData.forEach((m) => {
    const dataKeys = m.data ? Object.keys(m.data) : [];
    const totalFields = JSON.stringify(m.data ?? {}).length;
    console.log(`[AI Data Pipeline]   ${m.module_key}: ${dataKeys.length} top-level keys, ${totalFields} chars — is_completed: ${m.is_completed}`);
  });
  console.log(`[AI Data Pipeline] Assessments: ${assessments.length}, HV Tests: ${humanValuesTests.length}`);

  return { profile, moduleData, assessments, humanValuesTests };
}

// ====================================================================
// STEP 3: COMPREHENSIVE PROFILE BUILDER
// ====================================================================

function buildComprehensiveProfile(rawData: Awaited<ReturnType<typeof fetchAllUserData>>) {
  const { profile, moduleData, humanValuesTests } = rawData;

  // Build module map from fetched rows
  const modules: Record<string, any> = {};
  for (const mod of moduleData) {
    if (mod.module_key && mod.data) modules[mod.module_key] = mod.data;
  }

  const master = modules["master_profile"] || {};
  const financial = modules["financial"] || {};
  const skills = modules["skills"] || {};
  const health = modules["health"] || {};
  const assessData = modules["assessments"] || {};

  const hasMaster = Object.keys(master).length > 0;
  const hasFinancial = Object.keys(financial).length > 0;
  const hasSkills = Object.keys(skills).length > 0;
  const hasHealth = Object.keys(health).length > 0;
  const hasAssessments = Object.keys(assessData).length > 0;

  console.log(`[AI Data Pipeline] Module data presence — profile:${hasMaster} financial:${hasFinancial} skills:${hasSkills} health:${hasHealth} assessments:${hasAssessments}`);

  // Compute metrics ONLY when real data exists — no fallback values
  let finMetrics: any = null;
  try { if (hasFinancial) finMetrics = calculateFinancialHealthMetrics(financial); } catch {}
  let proMetrics: any = null;
  try { if (hasSkills) proMetrics = calculateProfessionalCapitalScore(skills); } catch {}
  let healthMetrics: any = null;
  try { if (hasHealth) healthMetrics = calculateHealthCapitalScore(health); } catch {}
  let assessMetrics: any = null;
  try { if (hasAssessments && assessData.answers && Object.keys(assessData.answers).length > 0) assessMetrics = calculateAssessmentMetrics(assessData); } catch {}

  const availableDomains: string[] = [];
  if (hasMaster) availableDomains.push("Master Profile");
  if (hasFinancial) availableDomains.push("Financial Health");
  if (hasSkills) availableDomains.push("Skills Capital");
  if (hasHealth) availableDomains.push("Health Capital");
  if (hasAssessments) availableDomains.push("Human Assessments");
  if (humanValuesTests.length > 0) availableDomains.push("Human Values Tests");

  const fullName = profile?.full_name
    || `${master.personalProfile?.firstName || ""} ${master.personalProfile?.lastName || ""}`.trim()
    || "User";

  // ────────────────────────────────────────────────────────────────
  // COMPREHENSIVE PROFILE — pass ALL raw data to agents, no filtering
  // ────────────────────────────────────────────────────────────────
  const comprehensive: Record<string, any> = {
    // Section 1: Identity (from Supabase profiles + master_profile)
    identity: {
      fullName,
      email: profile?.email || master.contactInformation?.email,
      dateOfBirth: master.personalProfile?.dateOfBirth,
      age: master.personalProfile?.calculatedAge,
      gender: master.personalProfile?.gender,
      nationality: master.personalProfile?.nationality,
      location: [
        master.personalProfile?.city,
        master.personalProfile?.stateOrProvince,
        master.personalProfile?.country,
      ].filter(Boolean).join(", ") || null,
      language: master.personalProfile?.preferredLanguage,
      linkedIn: master.contactInformation?.linkedInUrl,
      gitHub: master.contactInformation?.gitHubUrl,
      portfolio: master.contactInformation?.portfolioUrl,
    },

    // Section 2: Current Role (raw master_profile fields)
    currentRole: {
      primaryRole: master.primaryRole,
      // Student fields
      studentCategory: master.studentData?.studentCategory,
      degree: master.studentData?.degree,
      specialization: master.studentData?.specialization,
      college: master.studentData?.college || master.studentData?.university,
      currentYear: master.studentData?.currentYear,
      expectedGraduation: master.studentData?.expectedGraduationYear,
      cgpa: master.studentData?.cgpaOrPercentage,
      hasScholarship: master.studentData?.hasScholarship,
      placementStatus: master.studentData?.currentPlacementStatus,
      // Employee fields
      company: master.employeeData?.company,
      designation: master.employeeData?.designation,
      department: master.employeeData?.department,
      industry: master.employeeData?.industry,
      employmentType: master.employeeData?.employmentType,
      yearsOfExperience: master.employeeData?.yearsOfExperience,
      salaryBand: master.employeeData?.currentSalaryBand,
      teamSize: master.employeeData?.teamSizeManaged,
      hasManagerialRole: master.employeeData?.hasManagerialResponsibility,
      // Founder fields
      startupName: master.founderData?.startupName,
      startupStage: master.founderData?.startupStage,
      fundingStage: master.founderData?.fundingStage,
      employeeCount: master.founderData?.employeeCount,
    },

    // Section 3: Career Direction
    careerDirection: {
      interests: master.careerInterests,
      preferredIndustry: master.careerPreferences?.preferredIndustry,
      preferredWorkStyle: master.careerPreferences?.preferredWorkStyle,
      motivations: master.careerMotivations,
    },

    // Section 4: Goals (exact user text)
    goals: {
      shortTerm1Year: master.goals?.shortTermGoal1Yr,
      mediumTerm3Years: master.goals?.mediumTermGoal3Yr,
      longTerm5to10Years: master.goals?.longTermGoal5To10Yr,
    },

    // Section 5: Financial Health (RAW + computed metrics)
    financialIntelligence: hasFinancial ? {
      // Income fields (from incomeProfile)
      monthlySalary: financial.incomeProfile?.monthlyActiveIncome,
      otherIncome: financial.incomeProfile?.monthlyOtherIncome,
      passiveIncome: financial.incomeProfile?.monthlyPassiveIncome,
      freelanceIncome: financial.incomeProfile?.monthlyFreelanceIncome,
      totalMonthlyIncome: finMetrics?.totalMonthlyIncome,
      // Expense fields (summed from expenses object)
      monthlyExpenses: finMetrics
        ? (() => {
            const e = financial.expenses || {};
            return Object.values(e).reduce((s: number, v: any) => s + (Number(v) || 0), 0);
          })()
        : null,
      rentOrEMI: (financial.expenses?.housing || 0) + finMetrics?.totalMonthlyEMI,
      // Savings (from savingsPosition)
      emergencyFundBalance: financial.savingsPosition?.emergencyFundBalance,
      emergencyFundMonths: finMetrics?.emergencyCoverageMonths,
      savingsRatePct: finMetrics?.savingsRate !== undefined ? Math.round(finMetrics.savingsRate) : null,
      totalSavingsBalance: finMetrics?.totalSavingsBalance,
      // Investments (from investments array)
      investmentsTotal: finMetrics?.totalPortfolioValue,
      investFrequency: financial.behaviour?.investFrequency,
      riskAppetite: financial.riskProfile?.riskAppetite,
      investmentHorizon: financial.riskProfile?.investmentHorizon,
      // Liabilities (from liabilities array)
      totalDebt: finMetrics?.totalLiabilitiesAmount,
      monthlyEMI: finMetrics?.totalMonthlyEMI,
      debtToIncomeRatioPct: finMetrics?.debtToIncomeRatio !== undefined ? Math.round(finMetrics.debtToIncomeRatio) : null,
      // Insurance (from insuranceProtection array)
      hasHealthInsurance: boolToText(
        (financial.insuranceProtection || []).some((ins: any) =>
          ins?.type === "Health Insurance" || ins?.insuranceType === "Health Insurance"
        )
      ),
      hasLifeInsurance: boolToText(
        (financial.insuranceProtection || []).some((ins: any) =>
          ins?.type === "Life Insurance" || ins?.type === "Term Life Insurance" || ins?.insuranceType === "Life Insurance"
        )
      ),
      // Net worth
      netWorth: finMetrics?.netWorth,
      financialHealthScore: finMetrics?.financialHealthScore || null,
      // Behaviour
      maintainsBudget: boolToText(financial.behaviour?.maintainMonthlyBudget),
      tracksExpenses: boolToText(financial.behaviour?.trackExpensesRegularly),
      financialGoals: financial.goals,
    } : { DATA_MISSING: true, reason: "User has not completed the Financial Health module" },

    // Section 6: Professional Capital (RAW + computed metrics)
    professionalCapital: hasSkills ? {
      degree: skills.academic?.degree,
      field: skills.academic?.major || skills.academic?.field,
      institution: skills.academic?.university || skills.academic?.college || skills.academic?.institution,
      gpa: skills.academic?.cgpa || skills.academic?.percentage || skills.academic?.gpa,
      certifications: skills.certifications?.map((c: any) => typeof c === "string" ? c : (c.name || c.title || c.certificationName)).filter(Boolean),
      technicalSkills: skills.technicalSkills?.map((s: any) => typeof s === "string" ? s : (s.name || s.skillName)).filter(Boolean),
      industryExpertise: skills.industryExpertise?.map((s: any) => typeof s === "string" ? s : (s.name || s.domain)).filter(Boolean),
      projects: skills.projects?.map((p: any) => typeof p === "string" ? p : { name: p.name || p.projectName, description: p.description || p.role }),
      achievements: skills.achievements,
      aiReadinessScore: proMetrics?.aiReadinessScore,
      employabilityIndex: proMetrics?.employabilityIndex,
      professionalCapitalScore: proMetrics?.professionalCapitalScore || null,
    } : { DATA_MISSING: true, reason: "User has not completed the Skills Capital module" },

    // Section 7: Health Capital (RAW + computed metrics)
    healthCapital: hasHealth ? {
      heightCm: health.bodyMetrics?.heightCm,
      weightKg: health.bodyMetrics?.weightKg,
      bmi: (() => {
        const h = health.bodyMetrics?.heightCm;
        const w = health.bodyMetrics?.weightKg;
        if (h > 0 && w > 0) return Math.round((w / Math.pow(h / 100, 2)) * 10) / 10;
        return health.bodyMetrics?.bmi || null;
      })(),
      bmiCategory: (() => {
        const h = health.bodyMetrics?.heightCm;
        const w = health.bodyMetrics?.weightKg;
        if (h > 0 && w > 0) {
          const bmi = w / Math.pow(h / 100, 2);
          if (bmi < 18.5) return "Underweight";
          if (bmi < 25) return "Normal";
          if (bmi < 30) return "Overweight";
          return "Obese";
        }
        return null;
      })(),
      sleepHoursPerNight: health.sleepIntelligence?.averageSleepHoursPerNight,
      sleepQuality: health.sleepIntelligence?.sleepQuality,
      workoutFrequencyPerWeek: health.physicalActivity?.workoutFrequencyPerWeek,
      workoutType: health.physicalActivity?.workoutIntensity,
      // stressLevel is the actual field (perceivedStressLevel1To10 is a wrong alias)
      stressLevel_1to10: health.mentalWellbeing?.stressLevel ?? health.mentalWellbeing?.perceivedStressLevel1To10,
      // mindfulnessPracticed is the actual field name
      practicesMindfulness: boolToText(
        health.mentalWellbeing?.mindfulnessPracticed ?? health.mentalWellbeing?.practicesMindfulness
      ),
      dietQuality: health.nutritionIntelligence?.sugarIntakeLevel,
      // tobaccoStatus is the actual field (usesTobacco is wrong)
      usesTobacco: boolToText(
        health.lifestyleHabits?.tobaccoStatus && health.lifestyleHabits.tobaccoStatus !== "None"
        || health.lifestyleHabits?.smokingStatus && health.lifestyleHabits.smokingStatus !== "Non-Smoker"
        || health.lifestyleHabits?.usesTobacco
      ),
      alcoholConsumption: health.lifestyleHabits?.alcoholStatus || health.lifestyleHabits?.alcoholConsumption,
      screenTimeHrsPerDay: health.lifestyleHabits?.dailyScreenTimeHours,
      healthCapitalScore: healthMetrics?.healthCapitalScore || null,
    } : { DATA_MISSING: true, reason: "User has not completed the Health Capital module" },

    // Section 8: Human Assessments (RAW answers + computed results)
    humanAssessments: hasAssessments ? {
      isPersonalityCompleted: assessData.isPersonalityCompleted,
      isMindsetCompleted: assessData.isMindsetCompleted,
      isDecisionCompleted: assessData.isDecisionCompleted,
      isAwarenessCompleted: assessData.isAwarenessCompleted,
      isAptitudeCompleted: assessData.isAptitudeCompleted,
      isCommunicationCompleted: assessData.isCommunicationCompleted,
      stagesCompleted: [
        assessData.isPersonalityCompleted && "Personality",
        assessData.isMindsetCompleted && "Mindset",
        assessData.isDecisionCompleted && "Decision Making",
        assessData.isAwarenessCompleted && "Self Awareness",
        assessData.isAptitudeCompleted && "Aptitude",
        assessData.isCommunicationCompleted && "Communication",
      ].filter(Boolean),
      personalityTraits: assessMetrics?.traits,
      mindsetProfile: assessMetrics?.mindset,
      decisionJudgment: assessMetrics?.decision,
      awarenessProfile: assessMetrics?.awareness,
      aptitudeProfile: assessMetrics?.aptitude,
      communicationProfile: assessMetrics?.communication,
      assessmentScore: assessMetrics?.assessmentScore || null,
    } : { DATA_MISSING: true, reason: "User has not completed the Human Assessments module" },

    // Section 9: Human Values Test history
    humanValuesHistory: humanValuesTests.length > 0 ? {
      latestScore: humanValuesTests[0]?.score,
      latestLevel: humanValuesTests[0]?.level,
      categoryScores: humanValuesTests[0]?.category_scores,
      totalAttempts: humanValuesTests.length,
    } : { DATA_MISSING: true, reason: "No human values tests completed" },

    // Section 10: Data availability manifest (exact truth for the AI)
    _dataAvailability: {
      availableDomains,
      masterProfile: hasMaster,
      financial: hasFinancial,
      skills: hasSkills,
      health: hasHealth,
      assessments: hasAssessments,
      humanValues: humanValuesTests.length > 0,
      totalModulesCompleted: availableDomains.filter(d => d !== "Human Values Tests").length,
      WARNING: availableDomains.length < 5
        ? `INCOMPLETE DATA: Only ${availableDomains.length}/5 modules submitted. Agents MUST note this explicitly and MUST NOT assign high scores to missing domains.`
        : "All 5 modules present — full evaluation enabled.",
    },
  };

  // Compute scores ONLY from real data — null = data not available (no fake defaults)
  const computedScores: Record<string, number | null> = {
    overall: assessMetrics?.assessmentScore || (finMetrics?.financialHealthScore && proMetrics?.professionalCapitalScore
      ? Math.round((finMetrics.financialHealthScore + proMetrics.professionalCapitalScore) / 2)
      : null),
    humanValues: assessMetrics?.assessmentScore || (humanValuesTests[0]?.score ? Math.round(humanValuesTests[0].score) : null),
    financialIntelligence: finMetrics?.financialHealthScore || null,
    leadership: assessMetrics?.traits?.leadership || null,
    communication: assessMetrics?.communication?.businessCommunication || null,
    selfAwareness: assessMetrics?.traits?.selfAwareness || null,
    decisionMaking: assessMetrics?.decision?.financialDecisionMaking || null,
    growthMindset: assessMetrics?.mindset?.growthMindsetScore || null,
    consistency: healthMetrics?.scores?.disciplineScore || assessMetrics?.mindset?.disciplineScore || null,
    learningAbility: proMetrics?.aiReadinessScore || assessMetrics?.communication?.learningAgility || null,
    professionalReadiness: proMetrics?.professionalCapitalScore || null,
  };

  // Log what scores we actually have
  const nullScores = Object.entries(computedScores).filter(([, v]) => v === null).map(([k]) => k);
  const realScores = Object.entries(computedScores).filter(([, v]) => v !== null).map(([k, v]) => `${k}:${v}`);
  console.log(`[AI Data Pipeline] Real scores (${realScores.length}): ${realScores.join(', ')}`);
  if (nullScores.length) console.log(`[AI Data Pipeline] NULL scores (no data): ${nullScores.join(', ')}`);

  return {
    cleanProfile: deepClean(comprehensive) || {},
    rawModules: { master, financial, skills, health, assessData },
    computedScores,
    availableDomains,
  };
}

// ====================================================================
// CORE RULES — ANTI-OVERCOATING & STRICT GROUNDING MANDATE
// ====================================================================

const CORE_RULES = `
ABSOLUTE EVALUATION RULES (STRICT PERFORMANCE AUDITOR):
1. DATA-GROUNDED ONLY: Every score, observation, and recommendation MUST reference specific user data provided. Never praise without referencing a specific telemetry fact.
2. NO SUGARCOATING: Do NOT inflate scores. A user with 0 savings rate CANNOT score above 40 on financial discipline. A user with no certifications CANNOT score 90 on professional readiness.
3. REALISTIC SCORING: Scores 80-100 = demonstrably exceptional (cite exact evidence). Scores 60-79 = above average with specific evidence. Scores 40-59 = average. Scores below 40 = genuine deficiency that must be directly named.
4. CONSTRUCTIVE BUT HONEST: Identify actual strengths (with evidence) AND actual weaknesses (named directly, not softened). Provide precise corrective steps.
5. NO FILLER: Banned phrases: "comprehensive approach", "well-rounded", "great potential" without evidence. Every sentence must contain actionable information.
6. JSON ONLY: Response MUST be valid JSON. No markdown formatting, no text outside JSON.
7. MENTOR FUNCTION: Act as a trusted senior mentor who will not lie to protect feelings — only truthful guidance creates real growth.
`;

// ====================================================================
// STEP 4: MULTI-AGENT ORCHESTRATOR
// ====================================================================

async function runMultiAgentPipeline(
  cleanProfile: Record<string, any>,
  computedScores: Record<string, number | null>,
  availableDomains: string[],
): Promise<{ report: any; modelsUsed: string[] }> {
  const modelsUsed: string[] = [];
  const profileStr = JSON.stringify(cleanProfile, null, 2);

  // AGENT 1: Profile & Vision Evaluator — analyzes identity, background, career stage
  const a1 = invokeAgent(
    `You are Agent 1 — Senior Background & Vision Evaluator.\n${CORE_RULES}\nEvaluate ONLY what is present in the user's profile data: name, age, location, role, education (degree/CGPA/college), work experience (years/company/designation/salary band), startup details, career interests, and stated goals. Score identity maturity, career stage appropriateness, and goal clarity using EXACT values from the data. Do NOT praise if data is missing.\nOUTPUT (valid JSON): {"personalityAnalysis":{"title":"Background & Career Stage Evaluation","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"humanValuesAnalysis":{"title":"Goal Clarity & Life Direction","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"coreStrengths":{"title":"Verified Profile Strengths","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"areasOfImprovement":{"title":"Profile Gaps & Urgent Upgrades","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."}}`,
    `User profile telemetry:\n${profileStr}`,
    AGENT_MODELS.values,
  );

  // AGENT 2: Financial Health Auditor — strict financial analysis
  const a2 = invokeAgent(
    `You are Agent 2 — Strict Financial Health Auditor & Wealth Coach.\n${CORE_RULES}\nConduct a strict financial audit using ONLY the actual numbers in the data: monthly active income, passive income, total expenses, savings amount, savings rate %, emergency fund months, total debt, EMIs, net worth, insurance coverage, investment frequency, risk appetite. If savings rate < 10% flag it clearly. If no emergency fund exists, say so directly. Score financial health 0-100 strictly based on the actual numbers — not potential.\nOUTPUT (valid JSON): {"financialIntelligence":{"title":"Financial Health Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"savingsBehaviour":{"title":"Savings Rate & Emergency Fund Status","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"moneyManagement":{"title":"Income vs Expense Control","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"riskProfile":{"title":"Insurance & Risk Protection Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"investmentBehaviour":{"title":"Investment Discipline Assessment","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."}}`,
    `User financial telemetry:\n${profileStr}`,
    AGENT_MODELS.finance,
  );

  // AGENT 3: Professional Capital & Market Value Evaluator
  const a3 = invokeAgent(
    `You are Agent 3 — Corporate HR Director & Professional Capital Evaluator.\n${CORE_RULES}\nEvaluate professional capital using ONLY the skills data: technical skills (list and proficiency), certifications (list them), projects (count and quality), academic degree and GPA, AI readiness self-score, employment history, and promotion potential. If no certifications exist, say so and prescribe exactly which ones to get. Score employability 0-100 based on actual listed skills vs. market demand.\nOUTPUT (valid JSON): {"leadershipPotential":{"title":"Leadership & Promotion Readiness","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"learningStyle":{"title":"Technical Skill Depth & AI Readiness","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"careerSuitability":{"title":"Market Value & Employability Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"professionalGrowth":{"title":"Skill Gap Analysis & Career Acceleration Blueprint","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"decisionMakingStyle":{"title":"Strategic Career Decision Framework","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."}}`,
    `User skills/career telemetry:\n${profileStr}`,
    AGENT_MODELS.career,
  );

  // AGENT 4: Health & Vitality Auditor — burnout risk and lifestyle performance
  const a4 = invokeAgent(
    `You are Agent 4 — Lifestyle Performance & Health Capital Auditor.\n${CORE_RULES}\nEvaluate health capital using ONLY the health data: BMI (height/weight), sleep hours per night, sleep quality, weekly workout frequency, stress level (1-10 scale), diet quality, mindfulness practice (yes/no), tobacco/alcohol usage. If BMI is outside healthy range, name it. If stress level > 7, flag burnout risk explicitly. Score health capital 0-100 based on actual metrics, not aspirations.\nOUTPUT (valid JSON): {"behaviourPatterns":{"title":"Daily Health Discipline Audit","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"dailyHabitsAnalysis":{"title":"Sleep, Recovery & Workout Adherence","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"goalAlignment":{"title":"Stress Management & Burnout Risk Assessment","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"recommendations":{"title":"Health Upgrade Protocol (Immediate Actions)","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"dailyActionPlan":{"title":"Optimized Daily Health Routine","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"weeklyActionPlan":{"title":"7-Day Fitness & Recovery Protocol","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"monthlyGrowthPlan":{"title":"30-Day Health Capital Upgrade","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."},"longTermDevelopmentPlan":{"title":"12-Month Longevity & Peak Performance Roadmap","content":"...","highlights":["..."],"dataAvailable":true,"confidence":"..."}}`,
    `User health telemetry:\n${profileStr}`,
    AGENT_MODELS.habits,
  );

  console.log("[Multi-Agent] ▶ Launching 4 domain agents concurrently...");
  const [r1, r2, r3, r4] = await Promise.allSettled([a1, a2, a3, a4]);

  const o1 = r1.status === "fulfilled" && r1.value ? r1.value.result : {};
  const o2 = r2.status === "fulfilled" && r2.value ? r2.value.result : {};
  const o3 = r3.status === "fulfilled" && r3.value ? r3.value.result : {};
  const o4 = r4.status === "fulfilled" && r4.value ? r4.value.result : {};

  [r1, r2, r3, r4].forEach(r => { if (r.status === "fulfilled" && r.value) modelsUsed.push(`${r.value.provider}/${r.value.modelUsed}`); });

  // AGENT 5 / MASTER MENTOR SYNTHESIZER: Grounded, realistic, zero sugarcoating
  console.log("[Multi-Agent] ▶ Launching Master Mentor Synthesizer...");
  const masterRes = await invokeAgent(
    `You are Agent 6 — Master Human Capital Mentor & Realistic Performance Synthesizer.\n${CORE_RULES}\n
YOUR ROLE: You are a trusted senior mentor who gives honest, data-grounded feedback. You synthesize all 5 domain evaluations and produce a Master Report. Your output will be used to guide this person's life decisions — therefore dishonesty, inflation, or sugarcoating is a form of harm.

SCORING CALIBRATION RULES (MANDATORY):
- Score 85-100: ONLY if user has concrete evidence of excellence (e.g., high savings rate >30%, multiple certifications, optimal BMI & sleep, strong assessment results)
- Score 70-84: Solid performer with minor gaps
- Score 55-69: Average with notable gaps that must be named
- Score 40-54: Below standard — must clearly identify the reason
- Score 0-39: Significant deficiency — prescribe exact corrective action

SYNTHESIS REQUIREMENTS:
1. Executive Summary: 4 paragraphs — (1) Who this person truly is based on data, (2) Their actual financial & professional capital position, (3) Their real health & behavioral patterns, (4) The single most important thing they must change NOW.
2. Assign 11 objective scores strictly based on telemetry evidence.
3. Top 3 Blind Spots: Critical vulnerabilities that could derail their goals if unaddressed.
4. Mentor Action Plan: 7-day immediate fixes, 30-day milestones, 90-day transformation targets.
5. Key Metrics to Track: Specific numbers the user should monitor monthly.

Available domains: ${availableDomains.join(", ")}
OUTPUT (valid JSON): {
  "executiveSummary": ["Paragraph 1 — Who you are (data-driven profile assessment)...", "Paragraph 2 — Your financial & professional capital position...", "Paragraph 3 — Your health & behavioral patterns...", "Paragraph 4 — The ONE thing you must change NOW..."],
  "overallSummary": ["One-line verdict...", "Strategic positioning statement..."],
  "scores": {
    "humanValues": {"score": 75, "explanation": "Cite specific assessment data..."},
    "financialIntelligence": {"score": 60, "explanation": "Cite actual savings rate, income, emergency fund..."},
    "leadership": {"score": 72, "explanation": "Cite actual leadership assessment score..."},
    "communication": {"score": 78, "explanation": "Cite communication assessment data..."},
    "selfAwareness": {"score": 74, "explanation": "Cite self-awareness assessment data..."},
    "decisionMaking": {"score": 70, "explanation": "Cite decision making data..."},
    "growthMindset": {"score": 76, "explanation": "Cite growth mindset assessment..."},
    "consistency": {"score": 68, "explanation": "Cite health/workout/sleep consistency data..."},
    "learningAbility": {"score": 73, "explanation": "Cite certifications, skills, learning data..."},
    "professionalReadiness": {"score": 71, "explanation": "Cite technical skills, experience, employability..."},
    "overall": {"score": 72, "explanation": "Weighted composite of all domain scores..."}
  },
  "blindSpots": ["Critical blind spot 1 with specific data reference...", "Critical blind spot 2...", "Critical blind spot 3..."],
  "mentorActionPlan": {
    "sevenDayFixes": ["Immediate action 1...", "Immediate action 2...", "Immediate action 3..."],
    "thirtyDayMilestones": ["30-day milestone 1...", "30-day milestone 2..."],
    "ninetyDayTargets": ["90-day target 1...", "90-day target 2..."]
  },
  "keyMetricsToTrack": ["Metric 1: e.g., Monthly savings rate % (target: X%)", "Metric 2: ...", "Metric 3: ...", "Metric 4: ...", "Metric 5: ..."]
}`,
    `USER TELEMETRY:\n${profileStr}\n\nDOMAIN ENGINE SCORES:\n${JSON.stringify(computedScores)}\n\nDOMAIN AGENT OUTPUTS:\nAgent 1 (Profile): ${JSON.stringify(o1)}\nAgent 2 (Financial): ${JSON.stringify(o2)}\nAgent 3 (Skills/Career): ${JSON.stringify(o3)}\nAgent 4 (Health): ${JSON.stringify(o4)}`,
    AGENT_MODELS.master,
  );

  const masterOut = masterRes?.result || {};
  if (masterRes) modelsUsed.push(`${masterRes.provider}/${masterRes.modelUsed}`);

  return {
    report: {
      executiveSummary: masterOut.executiveSummary || [`Multi-agent evaluation for user.`],
      ...o1, ...o2, ...o3, ...o4,
      overallSummary: masterOut.overallSummary || [`Analysis across ${availableDomains.join(", ")}.`],
      scores: masterOut.scores || {},
      blindSpots: masterOut.blindSpots || [],
      mentorActionPlan: masterOut.mentorActionPlan || {},
      keyMetricsToTrack: masterOut.keyMetricsToTrack || [],
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
  // Require ALL 5 modules to be fully saved before generating report
  const isFullyComplete = completedCount >= 5;

  return { isFullyComplete, status, completedCount, totalCount: status.length };
}

// ====================================================================
// MULTI-TIER SUPABASE REPORT PERSISTENCE ENGINE
// ====================================================================

async function fetchReportFromSupabase(supabase: ReturnType<typeof createAuthenticatedClient>, userId: string): Promise<any | null> {
  // 1. Try ai_reports FIRST (Master Mentor table)
  try {
    const { data }: any = await (supabase as any)
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

  // 2. Try ai_evaluations
  try {
    const { data }: any = await (supabase as any)
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

  // 3. Try module_data (key = 'ai_report')
  try {
    const { data }: any = await (supabase as any)
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

  // 4. Try memory (key = 'ai_report')
  try {
    const { data }: any = await (supabase as any)
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

  return null;
}

async function saveReportToSupabase(supabase: ReturnType<typeof createAuthenticatedClient>, userId: string, record: any): Promise<boolean> {
  let saved = false;
  const nowIso = new Date().toISOString();

  // Target 1: ai_reports (Primary Master Mentor table)
  try {
    const aiReportsPayload = {
      user_id: userId,
      report_version: record.report_version || "v5.0",
      status: record.status || "COMPLETED",
      executive_summary: Array.isArray(record.executive_summary) ? record.executive_summary : [record.executive_summary].filter(Boolean),
      overall_summary: typeof record.overall_summary === "string" ? record.overall_summary : JSON.stringify(record.overall_summary || ""),
      scores_json: record.scores_json || record.report_json?.scores || {},
      report_json: record.report_json || record,
      mentor_action_plan: record.report_json?.mentorActionPlan || record.mentor_action_plan || {},
      risk_vectors: record.report_json?.blindSpots || record.risk_vectors || {},
      top_strengths: record.report_json?.coreStrengths?.highlights || [],
      top_weaknesses: record.report_json?.areasOfImprovement?.highlights || [],
      overall_score: Number(record.overall_score) || 0,
      confidence_score: Number(record.confidence_score) || 94,
      data_hash: record.data_hash || "",
      models_used: record.models_used || [],
      ai_model: record.ai_model || "Multi-Agent Pipeline",
      generated_at: nowIso,
      updated_at: nowIso,
    };

    let savedAiReport = false;
    try {
      const { data, error }: any = await (supabase as any)
        .from("ai_reports")
        .upsert([aiReportsPayload], { onConflict: "user_id" })
        .select()
        .single();
      if (!error && data) {
        saved = true;
        savedAiReport = true;
        console.log(`[AI Report Engine] ✅ Saved to public.ai_reports: ${data.id}`);
      }
    } catch {}

    if (!savedAiReport) {
      try {
        await (supabase as any).from("ai_reports").delete().eq("user_id", userId);
        const { data, error }: any = await (supabase as any)
          .from("ai_reports")
          .insert([aiReportsPayload])
          .select()
          .single();
        if (!error && data) {
          saved = true;
          console.log(`[AI Report Engine] ✅ Saved to public.ai_reports: ${data.id}`);
        }
      } catch {}
    }
  } catch (e: any) {
    console.warn(`[AI Report Engine] ai_reports exception:`, e.message);
  }

  // Target 2: ai_evaluations (Compatibility)
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

    await (supabase as any).from("ai_evaluations").delete().eq("user_id", userId);

    const { data, error }: any = await (supabase as any)
      .from("ai_evaluations")
      .insert([evalPayload])
      .select()
      .single();

    if (!error && data) {
      saved = true;
      console.log(`[AI Report Engine] ✅ Saved to public.ai_evaluations: ${data.id}`);
    }
  } catch {}

  // Target 3: module_data (key = 'ai_report')
  try {
    const { data, error }: any = await (supabase as any)
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

  // Target 4: memory table (key = 'ai_report')
  try {
    const { data, error }: any = await (supabase as any)
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

    let userId: string | null = null;
    const supabase = createAuthenticatedClient(accessToken);
    try {
      const { data: userData } = await supabase.auth.getUser(accessToken);
      if (userData?.user?.id) userId = userData.user.id;
    } catch {}
    if (!userId) userId = parseJwtUserId(accessToken);

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

    return NextResponse.json({
      success: true,
      report: null,
      status: "PENDING",
      cached: false,
      completeness,
    });
  } catch (err: any) {
    console.error("[AI Report Engine] Unhandled error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch AI report", report: null }, { status: 500 });
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

    let userId: string | null = null;
    const supabase = createAuthenticatedClient(accessToken);
    try {
      const { data: userData } = await supabase.auth.getUser(accessToken);
      if (userData?.user?.id) userId = userData.user.id;
    } catch {}
    if (!userId) userId = parseJwtUserId(accessToken);

    if (!userId) return NextResponse.json({ success: false, error: "Invalid session", errorCode: "AUTH_INVALID" }, { status: 401 });

    const rl = checkRateLimit(`ai-analysis:${userId}`, 10, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Please wait before generating another report.", errorCode: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      );
    }

    console.log(`[Multi-Agent AI] ═══ User: ${userId} ═══`);

    let forceRegenerate = false;
    try { const t = await request.text(); if (t) forceRegenerate = JSON.parse(t)?.forceRegenerate === true; } catch {}

    const rawData = await fetchAllUserData(supabase, userId);
    const completeness = checkModuleCompleteness(rawData);
    const { cleanProfile, computedScores, availableDomains } = buildComprehensiveProfile(rawData);
    console.log(`[Multi-Agent AI] Domains: ${availableDomains.join(", ")} | Profile: ${JSON.stringify(cleanProfile).length} chars`);

    const dataHash = await sha256Hash(JSON.stringify(cleanProfile));

    // SMART CACHE RULE:
    // When NOT forcing regenerate, return stored report from Supabase if available
    if (!forceRegenerate) {
      const cachedReport = await fetchReportFromSupabase(supabase, userId);
      if (cachedReport && cachedReport.report_json) {
        if (!cachedReport.data_hash || cachedReport.data_hash === dataHash) {
          console.log("[Multi-Agent AI] ✅ Production Cache Hit — serving stored report from Supabase");
          return NextResponse.json({
            success: true,
            report: cachedReport,
            status: cachedReport.status || "COMPLETED",
            cached: true,
          });
        }
      }
    }

    console.log("[Multi-Agent AI] ▶ Multi-Provider Orchestration (Executing fresh AI evaluation)...");
    const { report, modelsUsed } = await runMultiAgentPipeline(cleanProfile, computedScores, availableDomains);

    // Ensure all 11 scores are populated from AI output.
    // Only use computedScores as fallback if they are REAL (non-null).
    // Never inject fake default values — if AI didn't score it and no data exists, let it be 0.
    if (!report.scores) report.scores = {};
    for (const key of Object.keys(computedScores)) {
      const ex = report.scores[key];
      const base = computedScores[key]; // null if no real data exists
      if (!ex || typeof ex.score !== "number" || ex.score <= 0) {
        // Only fall back to computedScore if it is a real value from actual data
        if (base !== null && base !== undefined) {
          report.scores[key] = { score: base, explanation: `Score derived from platform telemetry data for ${key}.` };
        }
        // If base is null, leave the score as whatever the AI assigned (or 0)
      } else {
        report.scores[key].score = Math.min(100, Math.max(0, Math.round(ex.score)));
      }
    }

    const overallScore = report.scores.overall?.score || (computedScores.overall ?? 0);
    const modelStr = "Multi-Agent AI Intelligence Engine";
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
    return NextResponse.json({ success: false, error: "Failed to process AI report", status: "FAILED" }, { status: 500 });
  }
}

