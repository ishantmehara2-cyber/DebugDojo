import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AvatarGender } from '../config/avatarConfig'

type LearnerState = {
  name: string | null
  avatarPreference: AvatarGender | null
  setName: (name: string) => void
  setAvatarPreference: (avatar: AvatarGender) => void
}

export const useLearnerStore = create<LearnerState>()(
  persist(
    (set) => ({
      name: null,
      avatarPreference: null,
      setName: (name) => set({ name }),
      setAvatarPreference: (avatarPreference) => set({ avatarPreference }),
    }),
    {
      name: 'debug-dojo-learner',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        name: state.name,
        avatarPreference: state.avatarPreference,
      }),
    },
  ),
)
