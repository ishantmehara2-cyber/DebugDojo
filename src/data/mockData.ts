export type Skill = {
  name: string
  mastery: number
  color: string
}

export type Achievement = {
  title: string
  description: string
  icon: string
  date: string
}

export type LearnerProfile = {
  name: string
  rank: string
  xp: number
  streak: number
  overallMastery: number
  challengesCompleted: number
  bugsFixed: number
  independentPasses: number
  hintsUsed: number
  skills: Skill[]
  achievements: Achievement[]
  milestones: string[]
  bugDiary: string[]
  learningHistory: string[]
}

export const learnerProfile: LearnerProfile = {
  name: 'Rohan',
  rank: 'Blue Belt',
  xp: 1240,
  streak: 7,
  overallMastery: 72,
  challengesCompleted: 18,
  bugsFixed: 14,
  independentPasses: 9,
  hintsUsed: 6,
  skills: [
    { name: 'Loops', mastery: 88, color: 'gold' },
    { name: 'Lists', mastery: 79, color: 'blue' },
    { name: 'Functions', mastery: 71, color: 'violet' },
    { name: 'Boundary logic', mastery: 52, color: 'orange' },
    { name: 'Edge cases', mastery: 43, color: 'rose' },
  ],
  achievements: [
    {
      title: 'Eyes of the Eagle',
      description: 'Found 3 bugs without a hint',
      icon: 'eye',
      date: 'Today',
    },
    {
      title: 'Week of Focus',
      description: 'Trained 7 days in a row',
      icon: 'flame',
      date: 'Yesterday',
    },
    {
      title: 'Loop Breaker',
      description: 'Mastered your first loop challenge',
      icon: 'target',
      date: '3 days ago',
    },
  ],
  milestones: ['First independent fix', 'White Belt achieved', 'Ten bugs found', 'Blue Belt achieved'],
  bugDiary: ['Off-by-one boundary', 'Loop skipped final item', 'Empty list edge case'],
  learningHistory: ['Range Detective · Independent pass', 'The Missing Total · 1 hint used', 'List Lantern · Independent pass'],
}

export const recommendedChallenge = {
  title: 'The Fencepost Dilemma',
  category: 'BOUNDARY LOGIC',
  duration: '8 min',
  difficulty: 'Focused practice',
  reason: "I chose this because you've made a boundary-comparison mistake in two different challenges.",
}
