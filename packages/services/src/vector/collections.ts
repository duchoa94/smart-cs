import { DataType } from '@zilliz/milvus2-sdk-node'
import { getMilvusClient } from './client.js'

const DIMENSIONS = Number(process.env['EMBEDDING_DIMENSIONS'] ?? 1536)

export function collectionName(tenantId: string): string {
  return `kb_chunks_${tenantId.replace(/-/g, '')}`
}

export async function ensureCollection(tenantId: string): Promise<void> {
  const client = getMilvusClient()
  const name = collectionName(tenantId)

  const exists = await client.hasCollection({ collection_name: name })
  if (exists.value) return

  await client.createCollection({
    collection_name: name,
    fields: [
      { name: 'id', data_type: DataType.Int64, is_primary_key: true, autoID: true },
      { name: 'chunk_pg_id', data_type: DataType.VarChar, max_length: 36 },
      { name: 'document_id', data_type: DataType.VarChar, max_length: 36 },
      { name: 'agent_id', data_type: DataType.VarChar, max_length: 36 },
      { name: 'content', data_type: DataType.VarChar, max_length: 65535 },
      { name: 'doc_title', data_type: DataType.VarChar, max_length: 500 },
      { name: 'chunk_index', data_type: DataType.Int32 },
      { name: 'token_count', data_type: DataType.Int32 },
      { name: 'embedding', data_type: DataType.FloatVector, dim: DIMENSIONS },
    ],
  })

  await client.createIndex({
    collection_name: name,
    field_name: 'embedding',
    index_type: 'IVF_FLAT',
    metric_type: 'IP',
    params: { nlist: 128 },
  })

  await client.loadCollection({ collection_name: name })
}

export async function dropCollection(tenantId: string): Promise<void> {
  const client = getMilvusClient()
  await client.dropCollection({ collection_name: collectionName(tenantId) })
}
