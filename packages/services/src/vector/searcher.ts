import { getMilvusClient } from './client.js'
import { collectionName } from './collections.js'
import { embed } from './embedder.js'

export type SearchResult = {
  milvusId: string
  chunkPgId: string
  content: string
  docTitle: string
  score: number
}

const MIN_SCORE = 0.7
const DEFAULT_TOP_K = 5

export async function semanticSearch(opts: {
  tenantId: string
  agentId: string
  query: string
  topK?: number
  minScore?: number
}): Promise<SearchResult[]> {
  const { tenantId, agentId, query, topK = DEFAULT_TOP_K, minScore = MIN_SCORE } = opts
  const client = getMilvusClient()
  const queryEmbedding = await embed(query)

  const result = await client.search({
    collection_name: collectionName(tenantId),
    data: [queryEmbedding],
    anns_field: 'embedding',
    params: { nprobe: 16 },
    limit: topK,
    output_fields: ['chunk_pg_id', 'content', 'doc_title'],
    filter: `agent_id == "${agentId}" || agent_id == ""`,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hits: any[] = Array.isArray(result.results) ? result.results : []

  return hits
    .filter((r) => typeof r.score === 'number' && r.score >= minScore)
    .map((r) => ({
      milvusId: String(r.id ?? ''),
      chunkPgId: String(r['chunk_pg_id'] ?? ''),
      content: String(r['content'] ?? ''),
      docTitle: String(r['doc_title'] ?? ''),
      score: r.score as number,
    }))
}
