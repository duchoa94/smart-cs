import { create } from 'zustand'
import type { Conversation, Message, ConversationFilters } from '@smart-cs/types'

type ConversationState = {
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Record<string, Message[]>
  typingConversations: Set<string>
  hasMore: boolean
  filters: Partial<ConversationFilters>

  setConversations: (conversations: Conversation[], hasMore: boolean) => void
  appendConversation: (conversation: Conversation) => void
  setActiveConversation: (id: string | null) => void
  setMessages: (conversationId: string, messages: Message[]) => void
  addMessage: (conversationId: string, message: Message) => void
  setTyping: (conversationId: string, isTyping: boolean) => void
  setFilters: (filters: Partial<ConversationFilters>) => void
  updateConversationStatus: (id: string, status: Conversation['status']) => void
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingConversations: new Set(),
  hasMore: false,
  filters: { limit: 20 },

  setConversations: (conversations, hasMore) => set({ conversations, hasMore }),
  appendConversation: (conversation) =>
    set((s) => ({ conversations: [conversation, ...s.conversations] })),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setMessages: (conversationId, messages) =>
    set((s) => ({ messages: { ...s.messages, [conversationId]: messages } })),
  addMessage: (conversationId, message) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: [...(s.messages[conversationId] ?? []), message],
      },
    })),
  setTyping: (conversationId, isTyping) =>
    set((s) => {
      const next = new Set(s.typingConversations)
      if (isTyping) next.add(conversationId)
      else next.delete(conversationId)
      return { typingConversations: next }
    }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  updateConversationStatus: (id, status) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, status } : c)),
    })),
}))
