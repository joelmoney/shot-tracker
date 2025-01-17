import { DashboardView } from "./dashboard-view"
import { getGames } from "../actions"

export default async function DashboardPage() {
  const games = await getGames()
  const recentGames = games.slice(0, 5) // Get last 5 games
  return <DashboardView games={recentGames} />
}

