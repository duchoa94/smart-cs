import { create } from 'zustand'
import type { Agent } from '@smart-cs/types'

type AgentState = {
  agents: Agent[]
  selectedAgent: Agent | null
  isDirty: boolean
  setAgents: (agents: Agent[]) => void
  setSelectedAgent: (agent: Agent | null) => void
  updateLocal: (patch: Partial<Agent>) => void
  markClean: () => void
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  selectedAgent: null,
  isDirty: false,
  setAgents: (agents) => set({ agents }),
  setSelectedAgent: (agent) => set({ selectedAgent: agent, isDirty: false }),
  updateLocal: (patch) =>
    set((s) => ({
      selectedAgent: s.selectedAgent ? { ...s.selectedAgent, ...patch } : null,
      isDirty: true,
    })),
  markClean: () => set({ isDirty: false }),
}))
