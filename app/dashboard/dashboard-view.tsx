'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Game } from "../types"
import { createGame, deleteGame } from "../actions"
import { Plus, LogOut, Trophy, User, Trash2, Edit, Shield, Settings } from 'lucide-react'
import { ThemeToggle } from "@/app/components/theme-toggle"
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DashboardViewProps {
  games: Game[]
}

export function DashboardView({ games: initialGames }: DashboardViewProps) {
  const [games, setGames] = useState<Game[]>(initialGames)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newGame, setNewGame] = useState({
    name: "",
    opponent: "",
    tournament: ""
  })
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const router = useRouter()

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGame.name) return

    const game = await createGame({
      name: newGame.name,
      opponent: newGame.opponent || undefined,
      tournament: newGame.tournament || undefined,
      goalkeeper: "Default",
    })
    
    // Reset form and close dialog
    setNewGame({ name: "", opponent: "", tournament: "" })
    setIsDialogOpen(false)
    
    // Immediately redirect to the new game
    router.push(`/game/${game.id}`)
  }

  const handleDeleteGame = async (game: Game) => {
    await deleteGame(game.id)
    setGameToDelete(null)
    router.refresh()
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href="/admin">
              <Shield className="h-5 w-5" />
              <span className="sr-only">Admin Dashboard</span>
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Games</CardTitle>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {games.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No games yet. Start by creating a new game!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {games.map((game, index) => (
                <Card
                  key={game.id}
                  className="hover:bg-muted/50 transition-colors shadow-sm hover:shadow-md fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 cursor-pointer" onClick={() => router.push(`/game/${game.id}`)}>
                          <h3 className="font-semibold">{game.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(game.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setNewGame({
                                name: game.name,
                                opponent: game.opponent || "",
                                tournament: game.tournament || ""
                              })
                              setIsEditMode(true)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setGameToDelete(game)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {(game.opponent || game.tournament) && (
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {game.opponent && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{game.opponent}</span>
                            </div>
                          )}
                          {game.tournament && (
                            <div className="flex items-center gap-1">
                              <Trophy className="h-3 w-3" />
                              <span>{game.tournament}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/5">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Enjoying this app?{" "}
            <a 
              href="https://buymeacoffee.com/joelfisher" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline"
            >
              Please buy me a coffee
            </a>
          </p>
        </CardContent>
      </Card>

      {/* New Game Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Game' : 'Create New Game'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGame} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Game Name *</Label>
              <Input
                id="name"
                placeholder="Enter game name"
                value={newGame.name}
                onChange={(e) => setNewGame(prev => ({ ...prev, name: e.target.value }))}
                autoFocus
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="opponent">Opponent (optional)</Label>
              <Input
                id="opponent"
                placeholder="Enter opponent name"
                value={newGame.opponent}
                onChange={(e) => setNewGame(prev => ({ ...prev, opponent: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tournament">Tournament/Location (optional)</Label>
              <Input
                id="tournament"
                placeholder="Enter tournament or location"
                value={newGame.tournament}
                onChange={(e) => setNewGame(prev => ({ ...prev, tournament: e.target.value }))}
              />
            </div>

            <Button type="submit" className="w-full">
              {isEditMode ? 'Save Changes' : 'Create Game'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!gameToDelete} onOpenChange={() => setGameToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Game</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{gameToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => gameToDelete && handleDeleteGame(gameToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

