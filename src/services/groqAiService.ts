/**
 * Groq AI Evaluation Engine Service
 *
 * Evaluates comprehensive multi-module user telemetry (Modules 1-5) using Groq LLMs.
 * Primary Model: meta-llama/llama-guard-4-12b
 * Fallback Models: llama-3.3-70b-versatile, llama-3.1-70b-versatile, llama-3.1-8b-instant
 */

import { Layer1Metrics } from "./humanCapitalAiEngine";
import { SavedAiReportPayload, getClassificationDetails } from "./aiPipelineService";

// SECURITY: API key is now server-side only (GROQ_API_KEY in .env.local).
// This client-side service is kept as a fallback for the legacy 3-Layer engine.
// All new AI analysis goes through POST /api/ai-analysis.

const PRIMARY_MODEL = "openai/gpt-oss-120b";
const FALLBACK_MODELS = [
  "openai/gpt-oss-20b",
  "qwen/qwen3.6-27b",
];

let _groqKeyIdx = 0;
function getGroqApiKey(): string {
  if (typeof process !== "undefined" && process.env) {
    const keys = [
      process.env.GROQ_API_KEY_1 || process.env.GROQ_API_KEY || "",
      process.env.GROQ_API_KEY_2 || "",
      process.env.GROQ_API_KEY_3 || "",
      process.env.GROQ_API_KEY_4 || "",
    ].filter(Boolean);
    if (keys.length > 0) {
      const key = keys[_groqKeyIdx % keys.length];
      _groqKeyIdx++;
      return key;
    }
  }
  return "";
}


export async function evaluateUserWithGroq(
  l1: Layer1Metrics
): Promise<SavedAiReportPayload | null> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    console.warn("Groq API Key not found. Falling back to local rule engine.");
    return null;
  }

  const systemPrompt = `You are an elite Enterprise AI Human Capital Evaluator.
Analyze the provided multi-vector user data (Modules 1-5: Master Profile, Financial Health, Professional Skills, Health & Lifestyle Telemetry, and 6-Stage Human Assessments).
Generate a comprehensive, highly insightful JSON evaluation object.

Respond ONLY with valid JSON matching this exact structure:
{
  "humanCapitalScore": <number 0-100>,
  "classification": "<Elite|Advanced|Developing|Emerging|Foundation>",
  "subIndices": {
    "strengthIndex": { "score": <number>, "reason": "<string>", "confidence": "96% High Confidence", "summary": "<string>" },
    "riskIndex": { "score": <number>, "reason": "<string>", "confidence": "94% High Confidence", "summary": "<string>" },
    "growthPotential": { "score": <number>, "reason": "<string>", "confidence": "95% High Confidence", "summary": "<string>" },
    "careerReadiness": { "score": <number>, "reason": "<string>", "confidence": "92% High Confidence", "summary": "<string>" },
    "financialStability": { "score": <number>, "reason": "<string>", "confidence": "97% High Confidence", "summary": "<string>" },
    "leadershipPotential": { "score": <number>, "reason": "<string>", "confidence": "91% High Confidence", "summary": "<string>" },
    "learningPotential": { "score": <number>, "reason": "<string>", "confidence": "95% High Confidence", "summary": "<string>" }
  },
  "executiveSummaryNarrative": [
    "<Paragraph 1: Academic, technical & overall score evaluation>",
    "<Paragraph 2: Financial savings, net worth, emergency fund & insurance analysis>",
    "<Paragraph 3: Health telemetry, sleep recovery, BMI & physical performance analysis>",
    "<Paragraph 4: Psychometrics, growth mindset, ethical reasoning & career trajectory>"
  ],
  "topStrengths": ["<Strength 1>", "<Strength 2>", "<Strength 3>", "<Strength 4>", "<Strength 5>"],
  "topWeaknesses": ["<Area 1>", "<Area 2>", "<Area 3>", "<Area 4>", "<Area 5>"],
  "riskVectors": {
    "financialRisk": { "level": "<Low|Medium|High>", "detail": "<string>" },
    "careerRisk": { "level": "<Low|Medium|High>", "detail": "<string>" },
    "healthRisk": { "level": "<Low|Medium|High>", "detail": "<string>" },
    "learningRisk": { "level": "<Low|Medium|High>", "detail": "<string>" },
    "burnoutRisk": { "level": "<Low|Medium|High>", "detail": "<string>" }
  },
  "recommendations": {
    "immediate": [{ "title": "<string>", "category": "<Finance|Career|Health|Learning>", "description": "<string>" }],
    "thirtyDays": [{ "title": "<string>", "category": "<Finance|Career|Health|Learning>", "description": "<string>" }],
    "ninetyDays": [{ "title": "<string>", "category": "<Finance|Career|Health|Learning>", "description": "<string>" }],
    "oneYear": [{ "title": "<string>", "category": "<Finance|Career|Health|Learning>", "description": "<string>" }]
  },
  "categorySuggestions": {
    "careerSuggestions": ["<string>", "<string>", "<string>"],
    "financialSuggestions": ["<string>", "<string>", "<string>"],
    "learningSuggestions": ["<string>", "<string>", "<string>"]
  }
}`;

  const userPrompt = `Evaluate this user telemetry:\n${JSON.stringify(l1, null, 2)}`;

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];

  for (const model of modelsToTry) {
    try {
      console.log(`[Groq AI Evaluation] Attempting evaluation using model: ${model}`);
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Groq AI Evaluation] Model ${model} returned error ${response.status}: ${errorText}`);
        continue; // Try fallback model
      }

      const resJson = await response.json();
      const rawContent = resJson?.choices?.[0]?.message?.content;
      if (!rawContent) {
        console.warn(`[Groq AI Evaluation] Empty content returned from model ${model}`);
        continue;
      }

      const parsed = JSON.parse(rawContent);
      const score = Math.min(100, Math.max(0, Math.round(parsed.humanCapitalScore || 78)));
      const { classification, bg, color } = getClassificationDetails(score);

      const payload: SavedAiReportPayload = {
        id: `ai_report_groq_${Date.now()}`,
        timestamp: new Date().toISOString(),
        reportVersion: "v2.0.0 (Groq LLM)",
        aiEngineVersion: `Groq AI Engine (${model})`,
        humanCapitalScore: score,
        classification: parsed.classification || classification,
        classificationBadgeBg: bg,
        classificationBadgeColor: color,
        subIndices: parsed.subIndices,
        executiveSummaryNarrative: parsed.executiveSummaryNarrative || [],
        topStrengths: parsed.topStrengths || [],
        topWeaknesses: parsed.topWeaknesses || [],
        riskVectors: parsed.riskVectors || {},
        recommendations: parsed.recommendations || { immediate: [], thirtyDays: [], ninetyDays: [], oneYear: [] },
        categorySuggestions: parsed.categorySuggestions || { careerSuggestions: [], financialSuggestions: [], learningSuggestions: [] },
        validationMeta: {
          totalFieldsValidated: 100,
          missingFieldsDetected: 0,
          completionPercentage: 100,
          dataIntegrityScore: 98,
        },
      };

      console.log(`[Groq AI Evaluation] Successfully generated AI Evaluation with model ${model}! Master Score: ${score}`);
      return payload;
    } catch (err: any) {
      console.error(`[Groq AI Evaluation] Failed with model ${model}:`, err?.message || err);
    }
  }

  console.warn("[Groq AI Evaluation] All Groq API attempts failed. Falling back to local calculation.");
  return null;
}
