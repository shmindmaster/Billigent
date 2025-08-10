import 'dotenv/config';

/**
 * Centralized Azure OpenAI Embedding service.
 * Uses direct HTTPS call to the deployment-specific embeddings endpoint.
 *
 * Env required:
 * - AZURE_OPENAI_EMBEDDING_ENDPOINT: full https endpoint for the deployment's embeddings API
 * - AZURE_OPENAI_EMBEDDING_KEY: API key
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  let endpoint = process.env.AZURE_OPENAI_EMBEDDING_ENDPOINT;
  let apiKey = process.env.AZURE_OPENAI_EMBEDDING_KEY;

  // Fallback: derive from Azure OpenAI base endpoint if not provided explicitly
  if (!endpoint) {
    const base = (process.env.AZURE_OPENAI_ENDPOINT || '').replace(/\/$/, '');
    const ver = process.env.AZURE_OPENAI_API_VERSION || '2025-04-01-preview';
    const model = process.env.AZURE_OPENAI_EMBED_MODEL || 'text-embedding-3-small';
    if (base) endpoint = `${base}/openai/deployments/${encodeURIComponent(model)}/embeddings?api-version=${encodeURIComponent(ver)}`;
  }
  if (!apiKey) apiKey = process.env.AZURE_OPENAI_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error('Embedding service misconfigured: missing embedding endpoint or API key');
  }
  if (!text || typeof text !== 'string') {
    throw new Error('generateEmbedding: text must be a non-empty string');
  }

  const body = { input: text }; // Azure OpenAI embeddings accepts { input }

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await safeText(resp);
    throw new Error(`Embedding request failed (${resp.status} ${resp.statusText}): ${errText}`);
  }

  const json: any = await resp.json().catch(() => ({}));
  const vector: number[] | undefined = json?.data?.[0]?.embedding;
  if (!Array.isArray(vector)) {
    throw new Error('Embedding response missing data[0].embedding');
  }
  return vector.map((v: any) => Number(v));
}

async function safeText(resp: Response): Promise<string> {
  try {
    return await resp.text();
  } catch {
    return '<no-body>';
  }
}

