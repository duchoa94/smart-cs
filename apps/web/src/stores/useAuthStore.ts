import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Tenant } from '@smart-cs/types'

type AuthState = {
  user: User | null
  tenant: Tenant | null
  accessToken: string | null
  isLoading: boolean
  setAuth: (user: User, tenant: Tenant, accessToken: string) => void
  setAccessToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      accessToken: null,
      isLoading: false,
      setAuth: (user, tenant, accessToken) => set({ user, tenant, accessToken }),
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => set({ user: null, tenant: null, accessToken: null }),
    }),
    {
      name: 'smart-cs-auth',
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
)
