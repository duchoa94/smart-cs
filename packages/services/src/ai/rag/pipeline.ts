import type { SearchResult } from '../../vector/searcher.js'
import { semanticSearch } from '../../vector/searcher.js'
import { ConvMemoryCache } from '../../cache/conv-memory.cache.js'
import { chat } from '../clients/claude.client.js'
import { detectHandoff, estimateConfidence } from '../agents/handoff-detector.js'

export type PipelineInput = {
  tenantId: string
  agentId: string
  conversationId: string
  userMessage: string
  turnCount: number
  agentConfig: {
    name: string
    llmModel: string
    systemPrompt: string | null
    temperature: number
    maxTokens: number
    handoffThreshold: number
    language: string
    fallbackMessage: string | null
  }
}

export type PipelineOutput = {
  reply: string
  confidence: number
  ragContext: SearchResult[]
  tokensUsed: number
  latencyMs: number
  handoffRequired: boolean
  handoffReason: string | null
}

export class RagPipeline {
  constructor(private readonly memory: ConvMemoryCache) {}

  async run(input: PipelineInput): Promise<PipelineOutput> {
    const start = Date.now()
    const { tenantId, agentId, conversationId, userMessage, agentConfig, turnCount } = input

    // Step 1: Retrieve conversation memory
    const history = await this.memory.getHistory(tenantId, conversationId)

    // Step 2 & 3: Embed query + semantic search
    const chunks = await semanticSearch({
      tenantId,
      agentId,
      query: userMessage,
      topK: 5,
    })

    // Step 4: Build augmented system prompt
    const systemPrompt = buildSystemPrompt(agentConfig, chunks)

    // Step 5: Call LLM
    const llmMessages = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: userMessage },
    ]

    const llmResponse = await chat({
      model: agentConfig.llmModel,
      systemPrompt,
      messages: llmMessages,
      temperature: agentConfig.temperature,
      maxTokens: agentConfig.maxTokens,
    })

    // Step 6: Estimate confidence
    const confidence = estimateConfidence(chunks.map((c) => c.score))

    // Step 7: Handoff decision
    const handoff = detectHandoff({
      userMessage,
      aiReply: llmResponse.content,
      confidence,
      threshold: agentConfig.handoffThreshold,
      turnCount,
    })

    // Step 8: Update memory
    await this.memory.push(tenantId, conversationId, {
      role: 'user',
      content: userMessage,
      createdAt: Date.now(),
    })
    await this.memory.push(tenantId, conversationId, {
      role: 'assistant',
      content: llmResponse.content,
      createdAt: Date.now(),
    })

    return {
      reply: llmResponse.content,
      confidence,
      ragContext: chunks,
      tokensUsed: llmResponse.inputTokens + llmResponse.outputTokens,
      latencyMs: Date.now() - start,
      handoffRequired: handoff.required,
      handoffReason: handoff.reason,
    }
  }
}

function buildSystemPrompt(
  config: PipelineInput['agentConfig'],
  chunks: SearchResult[],
): string {
  const base = config.systemPrompt ?? `You are ${config.name}, a helpful customer service assistant.`

  if (chunks.length === 0) {
    return `${base}\n\nRespond in ${config.language}. If you cannot answer, offer to connect the user with a human agent.`
  }

  const context = chunks
    .map((c) => `[Source: ${c.docTitle}]\n${c.content}`)
    .join('\n\n---\n\n')

  return `${base}

## Knowledge Base Context
Use the following information to answer the user's question accurately.
If the answer is not in the context below, say you're not sure and offer human support.

${context}

## Instructions
- Respond in ${config.language}
- Be concise and helpful
- Only use information from the context above
- Do not make up facts`
}
