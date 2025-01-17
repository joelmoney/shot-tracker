import { getGames } from "../../actions"
import ShotTracker from "../../shot-tracker"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Trophy, User } from 'lucide-react'
import { ThemeToggle } from "@/app/components/theme-toggle"

export default async function GamePage({ params }: { params: { id: string } }) {
  const games = await getGames()
  const game = games.find(g => g.id === params.id)

  if (!game) {
    return <div>Game not found</div>
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/dashboard">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{game.name}</h1>
            {(game.opponent || game.tournament) && (
              <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
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
        </div>
        <ThemeToggle />
      </div>
      <ShotTracker gameId={params.id} games={games} />
    </div>
  )
}

