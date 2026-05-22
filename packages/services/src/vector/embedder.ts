import OpenAI from 'openai'

let _openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] })
  }
  return _openai
}

const DIMENSIONS = Number(process.env['EMBEDDING_DIMENSIONS'] ?? 1536)
const MODEL = process.env['EMBEDDING_MODEL'] ?? 'text-embedding-3-small'

export async function embed(text: string): Promise<number[]> {
  const response = await getOpenAI().embeddings.create({
    model: MODEL,
    input: text.slice(0, 8192),
    dimensions: DIMENSIONS,
  })
  const embedding = response.data[0]?.embedding
  if (!embedding) throw new Error('No embedding returned')
  return embedding
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []
  const response = await getOpenAI().embeddings.create({
    model: MODEL,
    input: texts.map((t) => t.slice(0, 8192)),
    dimensions: DIMENSIONS,
  })
  return response.data.map((d) => d.embedding)
}
