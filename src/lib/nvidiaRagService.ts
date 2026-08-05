/**
 * NVIDIA NIM RAG & Retriever Service
 *
 * Supports NVIDIA Embedding & Reranking Models:
 * - nvidia/nemotron-3-embed-1b (1B Embedding model for semantic search & retrieval)
 * - nvidia/llama-nemotron-embed-1b-v2 (Multilingual cross-lingual embedding model)
 * - nvidia/llama-nemotron-rerank-1b-v2 (GPU-accelerated passage reranking)
 * - nvidia/llama-nemotron-rerank-vl-1b-v2 (GPU-accelerated multimodal/passage reranking)
 */

const NVIDIA_EMBEDDING_URL = "https://integrate.api.nvidia.com/v1/embeddings";
const NVIDIA_RERANK_URL = "https://integrate.api.nvidia.com/v1/ranking";

let nvidiaKeyIndex = 0;
function getRotatingNvidiaApiKey(): string {
  const keys = [
    process.env.NVIDIA_API_KEY_1 || process.env.NVIDIA_API_KEY || "",
    process.env.NVIDIA_API_KEY_2 || "",
    process.env.NVIDIA_API_KEY_3 || "",
    process.env.NVIDIA_API_KEY_4 || "",
  ].filter(Boolean);
  if (keys.length === 0) return "";
  const key = keys[nvidiaKeyIndex % keys.length];
  nvidiaKeyIndex++;
  return key;
}

export interface NvidiaEmbeddingResponse {
  object: string;
  data: Array<{
    object: string;
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface NvidiaRerankResult {
  index: number;
  logit: number;
}

export interface NvidiaRerankResponse {
  rankings: NvidiaRerankResult[];
  usage: {
    total_tokens: number;
  };
}

/**
 * Generate text embeddings using NVIDIA Nemotron 1B / Llama Embedding Models
 */
export async function generateNvidiaEmbeddings(
  texts: string[],
  model: "nvidia/nemotron-3-embed-1b" | "nvidia/llama-nemotron-embed-1b-v2" = "nvidia/nemotron-3-embed-1b"
): Promise<number[][]> {
  const apiKey = getRotatingNvidiaApiKey();
  if (!apiKey) {
    throw new Error("[NVIDIA RAG] Missing NVIDIA API Key");
  }

  const res = await fetch(NVIDIA_EMBEDDING_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model,
      input_type: "query",
      encoding_format: "float",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`[NVIDIA Embedding] HTTP ${res.status}: ${errText.substring(0, 200)}`);
  }

  const data: NvidiaEmbeddingResponse = await res.json();
  return data.data.map(d => d.embedding);
}

/**
 * Rerank retrieved passages using NVIDIA Llama-Nemotron Rerank 1B Models
 */
export async function rerankNvidiaPassages(
  query: string,
  passages: string[],
  model: "nvidia/llama-nemotron-rerank-1b-v2" | "nvidia/llama-nemotron-rerank-vl-1b-v2" = "nvidia/llama-nemotron-rerank-1b-v2"
): Promise<Array<{ text: string; score: number; originalIndex: number }>> {
  const apiKey = getRotatingNvidiaApiKey();
  if (!apiKey) {
    throw new Error("[NVIDIA RAG] Missing NVIDIA API Key");
  }

  const res = await fetch(NVIDIA_RERANK_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      query: { text: query },
      passages: passages.map(text => ({ text })),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`[NVIDIA Rerank] HTTP ${res.status}: ${errText.substring(0, 200)}`);
  }

  const data: NvidiaRerankResponse = await res.json();
  return data.rankings.map(r => ({
    text: passages[r.index],
    score: r.logit,
    originalIndex: r.index,
  }));
}
