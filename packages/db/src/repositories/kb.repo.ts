import { eq, and } from 'drizzle-orm'
import type { Db } from '../client.js'
import {
  kbDocuments,
  kbChunks,
  type KbDocumentRow,
  type NewKbDocumentRow,
  type KbChunkRow,
  type NewKbChunkRow,
} from '../schema/index.js'

export class KbRepository {
  constructor(private readonly db: Db) {}

  async findDocumentById(id: string, tenantId: string): Promise<KbDocumentRow | null> {
    const rows = await this.db
      .select()
      .from(kbDocuments)
      .where(and(eq(kbDocuments.id, id), eq(kbDocuments.tenantId, tenantId)))
      .limit(1)
    return rows[0] ?? null
  }

  async findDocumentsByTenant(tenantId: string): Promise<KbDocumentRow[]> {
    return this.db.select().from(kbDocuments).where(eq(kbDocuments.tenantId, tenantId))
  }

  async createDocument(data: NewKbDocumentRow): Promise<KbDocumentRow> {
    const rows = await this.db.insert(kbDocuments).values(data).returning()
    const row = rows[0]
    if (!row) throw new Error('Insert failed')
    return row
  }

  async updateDocumentStatus(
    id: string,
    status: string,
    extra: Partial<NewKbDocumentRow> = {},
  ): Promise<void> {
    await this.db
      .update(kbDocuments)
      .set({ status, updatedAt: new Date(), ...extra })
      .where(eq(kbDocuments.id, id))
  }

  async deleteDocument(id: string, tenantId: string): Promise<boolean> {
    const result = await this.db
      .delete(kbDocuments)
      .where(and(eq(kbDocuments.id, id), eq(kbDocuments.tenantId, tenantId)))
    return (result.rowCount ?? 0) > 0
  }

  async createChunks(data: NewKbChunkRow[]): Promise<KbChunkRow[]> {
    if (data.length === 0) return []
    return this.db.insert(kbChunks).values(data).returning()
  }

  async findChunksByDocument(documentId: string): Promise<KbChunkRow[]> {
    return this.db
      .select()
      .from(kbChunks)
      .where(eq(kbChunks.documentId, documentId))
  }

  async deleteChunksByDocument(documentId: string): Promise<void> {
    await this.db.delete(kbChunks).where(eq(kbChunks.documentId, documentId))
  }

  async findChunksByMilvusIds(milvusIds: bigint[]): Promise<KbChunkRow[]> {
    if (milvusIds.length === 0) return []
    return this.db
      .select()
      .from(kbChunks)
      .where(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (kbChunks as any).milvusId.in(milvusIds),
      )
  }
}
