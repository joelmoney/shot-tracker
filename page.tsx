import { getGames } from "./actions"
import GameList from "./game-list"

export default async function Home() {
  const games = await getGames()
  return <GameList games={games} />
}

