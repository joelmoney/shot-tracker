import { getGames } from "@/app/actions"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function GamesPage() {
  const games = await getGames()
  
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Games</h2>
      <div className="container mx-auto py-4">
        <DataTable columns={columns} data={games} />
      </div>
    </div>
  )
}

