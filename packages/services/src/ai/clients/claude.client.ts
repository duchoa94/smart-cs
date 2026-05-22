import Anthropic from '@anthropic-ai/sdk'

let _client: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env['ANTHROPIC_API_KEY'] })
  }
  return _client
}

export type ClaudeMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type ClaudeResponse = {
  content: string
  inputTokens: number
  outputTokens: number
  model: string
}

export async function chat(opts: {
  model: string
  systemPrompt: string
  messages: ClaudeMessage[]
  temperature: number
  maxTokens: number
}): Promise<ClaudeResponse> {
  const client = getAnthropicClient()

  const response = await client.messages.create({
    model: opts.model,
    max_tokens: opts.maxTokens,
    temperature: opts.temperature,
    system: opts.systemPrompt,
    messages: opts.messages,
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  return {
    content: textBlock?.type === 'text' ? textBlock.text : '',
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    model: response.model,
  }
}
