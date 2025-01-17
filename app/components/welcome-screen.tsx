import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from 'lucide-react'

interface WelcomeScreenProps {
  onStartNew: () => void
}

export default function WelcomeScreen({ onStartNew }: WelcomeScreenProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl">Shot Tracker</CardTitle>
          <CardDescription className="text-lg">
            Track and analyze your goalkeeper performance
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="space-y-4 w-full max-w-xs">
            <Button 
              size="lg" 
              className="w-full text-lg h-12"
              onClick={onStartNew}
            >
              Start New Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

