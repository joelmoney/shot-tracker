'use server'

import { Game, Shot, User } from "./types"
import { revalidatePath } from "next/cache"

// Initialize empty arrays instead of seeded data
let games: Game[] = []
let shots: Shot[] = []
let users: User[] = []

export async function registerUser(data: { 
  name: string
  email: string
  password: string 
}) {
  // Check if user already exists
  if (users.find(user => user.email === data.email)) {
    throw new Error("User already exists")
  }

  const user: User = {
    id: Math.random().toString(36).substring(7),
    ...data,
    createdAt: new Date(),
    role: "user"
  }

  users.push(user)
  revalidatePath('/')
  return user
}

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
    return game
  }
  return null
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

export async function getUsers() {
  return users
}

export async function updateUserSettings(settings: {
  email: string
  emailNotifications: boolean
  darkMode: boolean
}) {
  // In a real app, this would update the user in the database
  // For now, we'll just simulate success
  return settings
}

export async function deleteUserAccount() {
  // In a real app, this would delete the user from the database
  // For now, we'll just simulate success
  return true
}

