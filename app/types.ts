export interface Game {
  id: string
  name: string
  goalkeeper: string
  opponent?: string
  tournament?: string
  createdAt: Date
  notes?: string
}

export interface Shot {
  id: string
  gameId: string
  saved: boolean
  position: { x: number; y: number }
  power?: 1 | 2 | 3
  notes?: string
  timestamp: number
  half?: "first" | "second"
}

export interface User {
  id: string
  email: string
  name: string
  password: string // This would be hashed in production
  createdAt: Date
  role: "user" | "admin"
}

