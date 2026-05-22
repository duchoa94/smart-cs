import { MilvusClient } from '@zilliz/milvus2-sdk-node'

let _client: MilvusClient | null = null

export function getMilvusClient(): MilvusClient {
  if (!_client) {
    const config: { address: string; token?: string } = {
      address: process.env['MILVUS_ADDRESS'] ?? 'localhost:19530',
    }
    const token = process.env['MILVUS_TOKEN']
    if (token) config.token = token
    _client = new MilvusClient(config)
  }
  return _client
}
