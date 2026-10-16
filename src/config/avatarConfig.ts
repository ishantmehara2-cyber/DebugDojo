import femaleImg from '../assets/avatar/avatar.png'
import maleImg from '../assets/avatar/male.png'

export type AvatarGender = 'female' | 'male'

export interface AvatarOption {
  id: AvatarGender
  title: string
  subtitle: string
  image: string
  accentColor: string
}

export const avatarOptions: Record<AvatarGender, AvatarOption> = {
  female: {
    id: 'female',
    title: 'Code Mentor',
    subtitle: 'Calm, thoughtful and precise.',
    image: femaleImg,
    accentColor: 'rose',
  },
  male: {
    id: 'male',
    title: 'Code Coach',
    subtitle: 'Focused, practical and analytical.',
    image: maleImg,
    accentColor: 'blue',
  },
}
