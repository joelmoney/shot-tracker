import { DataTable } from "./data-table"
import { columns } from "./columns"

const data = [
  {
    id: "728ed52f",
    name: "John Smith",
    email: "john@example.com",
    games: 23,
    status: "active",
    lastActive: "2024-01-15",
  },
  {
    id: "489e1d42",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    games: 15,
    status: "active",
    lastActive: "2024-01-14",
  },
  // Add more sample data as needed
]

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      <div className="container mx-auto py-4">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

