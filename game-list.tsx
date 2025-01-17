'use client'

import { useState, useEffect } from "react"
import { Game } from "./types"
import { createGame, deleteGame, getGames } from "./actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from 'lucide-react'
import ShotTracker from "./shot-tracker"
import WelcomeScreen from "./app/components/welcome-screen"

export default function GameList({ games: initialGames }: { games: Game[] }) {
  const [games, setGames] = useState<Game[]>(initialGames)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [newGameName, setNewGameName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  // Fetch games on mount and when games change
  useEffect(() => {
    getGames().then(setGames)
  }, [])

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGameName) return

    const game = await createGame({
      name: newGameName,
      goalkeeper: "Default",
    })
    setGames([...games, game])
    setNewGameName("")
    setIsDialogOpen(false)
    setShowWelcome(false)
  }

  const handleDeleteGame = async (gameId: string) => {
    await deleteGame(gameId)
    setGames(games.filter(game => game.id !== gameId))
    if (selectedGame?.id === gameId) {
      setSelectedGame(null)
    }
  }

  if (showWelcome) {
    return <WelcomeScreen onStartNew={() => setIsDialogOpen(true)} />
  }

  if (selectedGame) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{selectedGame.name}</h2>
          <Button variant="ghost" onClick={() => setSelectedGame(null)}>
            Back to Games
          </Button>
        </div>
        <ShotTracker gameId={selectedGame.id} games={games} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Your Games</h2>
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Game
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Game</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGame} className="space-y-4">
            <Input
              placeholder="Game Name"
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="w-full">
              Create Game
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {games.length === 0 ? (
        <Card className="p-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              No games yet. Create one to get started!
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Game
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {games.map((game) => (
            <Card key={game.id} className="p-4">
              <div className="flex items-center justify-between">
                <button
                  className="text-left flex-1"
                  onClick={() => setSelectedGame(game)}
                >
                  <h3 className="font-semibold">{game.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteGame(game.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

