import { SettingsForm } from "./settings-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'
import Link from "next/link"

export default function SettingsPage() {
  return (
    // Main container with max width and padding
    <div className="container max-w-2xl mx-auto p-4 space-y-6">
      // Navigation and header section
      <div className="flex items-start gap-4">
        // Back button to dashboard
        <Button variant="ghost" size="icon" asChild className="mt-1">
          <Link href="/dashboard">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        
        // Page title and description
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>
      <Separator />
      <SettingsForm />
    </div>
  )
}

