const HANDOFF_KEYWORDS = [
  'speak to human',
  'real person',
  'human agent',
  'customer service',
  'supervisor',
  'manager',
  'nói chuyện với người thật',
  'nhân viên hỗ trợ',
  'hỗ trợ trực tiếp',
  'gặp nhân viên',
]

const UNCERTAINTY_PHRASES = [
  "i don't know",
  "i'm not sure",
  'cannot help',
  'not able to help',
  'beyond my knowledge',
  'tôi không biết',
  'không chắc',
  'không thể giúp',
]

const MAX_AI_TURNS = 10

export type HandoffDecision = {
  required: boolean
  reason: 'low_confidence' | 'user_request' | 'max_turns' | null
}

export function detectHandoff(opts: {
  userMessage: string
  aiReply: string
  confidence: number
  threshold: number
  turnCount: number
}): HandoffDecision {
  const { userMessage, aiReply, confidence, threshold, turnCount } = opts
  const msgLower = userMessage.toLowerCase()
  const replyLower = aiReply.toLowerCase()

  if (HANDOFF_KEYWORDS.some((kw) => msgLower.includes(kw))) {
    return { required: true, reason: 'user_request' }
  }

  if (turnCount >= MAX_AI_TURNS) {
    return { required: true, reason: 'max_turns' }
  }

  const uncertaintyPenalty = UNCERTAINTY_PHRASES.some((p) => replyLower.includes(p)) ? 0.2 : 0
  const effectiveConfidence = Math.max(0, confidence - uncertaintyPenalty)

  if (effectiveConfidence < threshold) {
    return { required: true, reason: 'low_confidence' }
  }

  return { required: false, reason: null }
}

export function estimateConfidence(topScores: number[]): number {
  if (topScores.length === 0) return 0.15
  const avg = topScores.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, topScores.length)
  return Math.min(1, Math.max(0, avg))
}
