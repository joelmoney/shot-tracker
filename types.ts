export interface Game {
  id: string
  name: string
  createdAt: Date
  goalkeeper: string
  notes?: string
}

export interface Shot {
  id: string
  gameId: string
  saved: boolean
  position: { x: number; y: number }
  power: 1 | 2 | 3 // 1: Low, 2: Medium, 3: High
  notes?: string
  timestamp: number
}

export interface TrainingRecommendation {
  area: "Left" | "Center" | "Right"
  improvement: string
  drills: string[]
}

