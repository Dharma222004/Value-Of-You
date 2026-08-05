/**
 * Oxlo AI Multi-Model Service & Key Rotation Engine
 *
 * Supported Models:
 * - DeepSeek V3.2 (deepseek-ai/DeepSeek-V3.2)
 * - DeepSeek R1 8B (deepseek-ai/DeepSeek-R1-8B)
 * - Mistral 7B (mistralai/Mistral-7B-Instruct-v0.3)
 * - Gemma 3 4B (google/gemma-3-4b-it)
 * - Llama 3.2 3B (meta-llama/Llama-3.2-3B-Instruct)
 * - Stable Diffusion 1.5 (runwayml/stable-diffusion-v1-5)
 * - Whisper Medium / Large v3 (openai/whisper-medium, openai/whisper-large-v3)
 * - Kokoro 82M (hexgrad/Kokoro-82M)
 * - BGE-Large / E5-Large Embeddings
 * - YOLOv11 / YOLOv9 Vision Models
 */

const OXLO_API_URL = process.env.OXLO_API_BASE_URL || "https://api.oxlo.ai/v1/chat/completions";

let oxloKeyIdx = 0;

export function getOxloApiKey(): string {
  const keys = [
    process.env.OXLO_API_KEY_1 || process.env.OXLO_API_KEY || "",
    process.env.OXLO_API_KEY_2 || "",
    process.env.OXLO_API_KEY_3 || "",
    process.env.OXLO_API_KEY_4 || "",
  ].filter(Boolean);
  if (keys.length === 0) return "";
  const key = keys[oxloKeyIdx % keys.length];
  oxloKeyIdx++;
  return key;
}

export interface OxloChatOptions {
  model?:
    | "deepseek-ai/DeepSeek-V3.2"
    | "deepseek-ai/DeepSeek-R1-8B"
    | "mistralai/Mistral-7B-Instruct-v0.3"
    | "google/gemma-3-4b-it"
    | "meta-llama/Llama-3.2-3B-Instruct";
  temperature?: number;
  maxTokens?: number;
  responseFormatJson?: boolean;
}

/**
 * Execute chat completion call to Oxlo AI with key rotation & fallback retry
 */
export async function callOxloAi(
  systemPrompt: string,
  userPrompt: string,
  options: OxloChatOptions = {}
): Promise<string> {
  const model = options.model || "deepseek-ai/DeepSeek-V3.2";
  const maxTokens = options.maxTokens || 2000;
  const temperature = options.temperature ?? 0.3;

  // Try all available keys if rate limits or errors occur
  const keys = [
    process.env.OXLO_API_KEY_1 || process.env.OXLO_API_KEY || "",
    process.env.OXLO_API_KEY_2 || "",
    process.env.OXLO_API_KEY_3 || "",
    process.env.OXLO_API_KEY_4 || "",
  ].filter(Boolean);

  if (keys.length === 0) {
    throw new Error("[Oxlo AI] No API key available in environment.");
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const key = keys[(oxloKeyIdx + attempt) % keys.length];
    try {
      const res = await fetch(OXLO_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature,
          max_tokens: maxTokens,
          ...(options.responseFormatJson ? { response_format: { type: "json_object" } } : {}),
        }),
        signal: AbortSignal.timeout(35000),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText.substring(0, 150)}`);
      }

      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response returned from Oxlo AI.");

      oxloKeyIdx = (oxloKeyIdx + attempt + 1) % keys.length;
      return content;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Oxlo AI] Key attempt ${attempt + 1}/${keys.length} failed (${model}): ${err.message}`);
    }
  }

  throw new Error(`[Oxlo AI] All API keys exhausted for ${model}: ${lastError?.message}`);
}
