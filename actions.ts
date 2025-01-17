'use server'

import { Game, Shot } from "./types"
import { revalidatePath } from "next/cache"

// Seed data for games
let games: Game[] = [
  {
    id: "game1",
    name: "Morning Practice - Jan 15",
    goalkeeper: "Default",
    createdAt: new Date('2024-01-15T09:00:00'),
    notes: "Good session, focused on low shots"
  },
  {
    id: "game2",
    name: "Evening Training - Jan 15",
    goalkeeper: "Default",
    createdAt: new Date('2024-01-15T18:00:00'),
    notes: "Worked on high corner saves"
  },
  {
    id: "game3",
    name: "Team Practice - Jan 16",
    goalkeeper: "Default",
    createdAt: new Date('2024-01-16T14:00:00'),
    notes: "Full team training session"
  }
]

// Seed data for shots
let shots: Shot[] = [
  // Morning Practice shots
  {
    id: "shot1",
    gameId: "game1",
    saved: true,
    position: { x: 30, y: 70 },
    power: 2,
    timestamp: new Date('2024-01-15T09:05:00').getTime(),
    notes: "Good low save"
  },
  {
    id: "shot2",
    gameId: "game1",
    saved: false,
    position: { x: 80, y: 20 },
    power: 3,
    timestamp: new Date('2024-01-15T09:07:00').getTime(),
    notes: "Top corner shot"
  },
  {
    id: "shot3",
    gameId: "game1",
    saved: true,
    position: { x: 50, y: 50 },
    power: 2,
    timestamp: new Date('2024-01-15T09:10:00').getTime()
  },

  // Evening Training shots
  {
    id: "shot4",
    gameId: "game2",
    saved: true,
    position: { x: 15, y: 25 },
    power: 3,
    timestamp: new Date('2024-01-15T18:05:00').getTime(),
    notes: "Great stretch save"
  },
  {
    id: "shot5",
    gameId: "game2",
    saved: false,
    position: { x: 85, y: 15 },
    power: 3,
    timestamp: new Date('2024-01-15T18:08:00').getTime()
  },
  {
    id: "shot6",
    gameId: "game2",
    saved: true,
    position: { x: 45, y: 30 },
    power: 2,
    timestamp: new Date('2024-01-15T18:12:00').getTime()
  },

  // Team Practice shots
  {
    id: "shot7",
    gameId: "game3",
    saved: true,
    position: { x: 25, y: 60 },
    power: 1,
    timestamp: new Date('2024-01-16T14:05:00').getTime()
  },
  {
    id: "shot8",
    gameId: "game3",
    saved: false,
    position: { x: 75, y: 40 },
    power: 3,
    timestamp: new Date('2024-01-16T14:08:00').getTime(),
    notes: "Powerful strike"
  },
  {
    id: "shot9",
    gameId: "game3",
    saved: true,
    position: { x: 50, y: 20 },
    power: 2,
    timestamp: new Date('2024-01-16T14:12:00').getTime()
  }
]

export async function createGame(data: Omit<Game, 'id' | 'createdAt'>) {
  const game: Game = {
    id: Math.random().toString(36).substring(7),
    ...data,
    createdAt: new Date(),
  }

  games.push(game)
  revalidatePath('/')
  return game
}

export async function getGames() {
  return games
}

export async function addShot(gameId: string, shot: Omit<Shot, 'id' | 'gameId'>) {
  const newShot: Shot = {
    id: Math.random().toString(36).substring(7),
    gameId,
    ...shot,
  }

  shots.push(newShot)
  revalidatePath('/')
  return newShot
}

export async function getShots(gameId?: string) {
  if (gameId) {
    return shots.filter(shot => shot.gameId === gameId)
  }
  return shots
}

export async function getAllShots() {
  return shots
}

export async function deleteGame(gameId: string) {
  games = games.filter(game => game.id !== gameId)
  shots = shots.filter(shot => shot.gameId !== gameId)
  revalidatePath('/')
}

export async function updateGameNotes(gameId: string, notes: string) {
  const game = games.find(g => g.id === gameId)
  if (game) {
    game.notes = notes
    revalidatePath('/')
  }
}

export async function updateShotNotes(shotId: string, notes: string) {
  const shot = shots.find(s => s.id === shotId)
  if (shot) {
    shot.notes = notes
    revalidatePath('/')
  }
}

export async function exportGameData(gameId: string) {
  const game = games.find(g => g.id === gameId)
  const gameShots = shots.filter(s => s.gameId === gameId)

  const data = {
    game,
    shots: gameShots,
    stats: {
      totalShots: gameShots.length,
      savedShots: gameShots.filter(s => s.saved).length,
      savePercentage: (gameShots.filter(s => s.saved).length / gameShots.length) * 100
    }
  }

  return JSON.stringify(data, null, 2)
}

