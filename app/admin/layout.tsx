import { redirect } from "next/navigation"
import { AdminNav } from "./admin-nav"

// This would normally check a real auth session
const isAdmin = true

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isAdmin) {
    redirect("/")
  }

  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] mt-4">
      <aside className="hidden w-[200px] flex-col md:flex">
        <AdminNav />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}

