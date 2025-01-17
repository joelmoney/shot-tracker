"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shot, Game } from "./types"
import { addShot, getShots, exportGameData, updateGameNotes, updateShotNotes, getAllShots } from "./actions"
import GameStats from "../components/game-stats"
import ShotTimeline from "../components/shot-timeline"
import HeatMap from "../components/heat-map"
import VideoRecorder from "../components/video-recorder"
import TrainingRecommendations from "../components/training-recommendations"
import SessionComparison from "../components/session-comparison"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from 'lucide-react'

interface ShotTrackerProps {
  gameId: string
  games: Game[]
}

export default function ShotTracker({ gameId, games }: ShotTrackerProps) {
  const [shots, setShots] = useState<Shot[]>([])
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("field")
  const [shotPower, setShotPower] = useState<"1" | "2" | "3">("2")
  const [gameNotes, setGameNotes] = useState("")
  const [allShots, setAllShots] = useState<Shot[]>([])
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);

  useEffect(() => {
    getShots(gameId).then(setShots)
    getAllShots().then(setAllShots)
  }, [gameId])

  const handleAddShot = async (saved: boolean) => {
    if (selectedPosition) {
      const newShot = await addShot(gameId, {
        saved,
        position: selectedPosition,
        power: Number(shotPower) as 1 | 2 | 3,
        timestamp: Date.now()
      })
      setShots([...shots, newShot])
      setSelectedPosition(null)
      setShowDialog(false)
    }
  }

  const handleUpdateShot = async (saved: boolean) => {
    if (selectedShot) {
      await updateShotNotes(selectedShot.id, { saved });
      const updatedShots = shots.map((shot) =>
        shot.id === selectedShot.id ? { ...shot, saved } : shot
      );
      setShots(updatedShots);
      setSelectedShot(null);
      setShowDialog(false);
    }
  };

  const handleDeleteShot = async () => {
    if (selectedShot) {
      // Add your delete shot logic here
      console.log("Delete shot:", selectedShot);
      setSelectedShot(null);
      setShowDialog(false);
    }
  };


  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setSelectedPosition({ x, y })
    setShowDialog(true)
  }

  const handleExport = async () => {
    const data = await exportGameData(gameId)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `game-${gameId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleGameNotesChange = useCallback(async (notes: string) => {
    setGameNotes(notes)
    await updateGameNotes(gameId, notes)
  }, [gameId])

  const totalShots = shots.length
  const savedShots = shots.filter(shot => shot.saved).length
  const savePercentage = totalShots > 0 ? (savedShots / totalShots) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Card className="flex-1">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalShots}</div>
                <div className="text-sm text-muted-foreground">Total Shots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{savedShots}</div>
                <div className="text-sm text-muted-foreground">Saves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{savePercentage.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Save %</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button variant="outline" className="ml-4" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Textarea
        placeholder="Game notes..."
        value={gameNotes}
        onChange={(e) => handleGameNotesChange(e.target.value)}
        className="min-h-[100px]"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="field">Field</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>
        
        <TabsContent value="field" className="mt-4">
          <Card>
            <CardContent className="p-2">
              <div 
                className="relative aspect-square bg-green-800 rounded-lg border-2 border-white overflow-hidden"
                onClick={handleClick}
                role="button"
                tabIndex={0}
                aria-label="Shot placement field"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border-2 border-white rounded" />
                
                {shots.map((shot) => (
                  <div
                    key={shot.id}
                    className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                      shot.saved ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{
                      left: `${shot.position.x}%`,
                      top: `${shot.position.y}%`
                    }}
                    onClick={() => {setSelectedShot(shot); setShowDialog(true)}}
                  />
                ))}

                {selectedPosition && (
                  <div
                    className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white animate-pulse"
                    style={{
                      left: `${selectedPosition.x}%`,
                      top: `${selectedPosition.y}%`
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="mt-4">
          <Card>
            <CardContent className="p-2">
              <div className="relative aspect-square bg-green-800 rounded-lg border-2 border-white overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border-2 border-white rounded" />
                <HeatMap shots={shots} width={400} height={400} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <GameStats shots={shots} />
          <div className="mt-4">
            <SessionComparison games={games} shots={allShots} />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <ShotTimeline shots={shots} />
        </TabsContent>

        <TabsContent value="video" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <VideoRecorder />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="mt-4">
          <TrainingRecommendations shots={shots} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Shot Details</AlertDialogTitle>
            <AlertDialogDescription>
              Select the shot power and whether it was saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={shotPower} onValueChange={(value: "1" | "2" | "3") => setShotPower(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Shot Power" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Low Power</SelectItem>
                <SelectItem value="2">Medium Power</SelectItem>
                <SelectItem value="3">High Power</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter className="flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {selectedShot ? (
              <>
                <div className="grid grid-cols-2 gap-2 items-center sm:flex sm:flex-row">
                  <AlertDialogAction 
                    onClick={() => handleUpdateShot(true)} 
                    className="w-full h-10"
                  >
                    Yes
                  </AlertDialogAction>
                  <AlertDialogCancel 
                    onClick={() => handleUpdateShot(false)} 
                    className="w-full h-10"
                  >
                    No
                  </AlertDialogCancel>
                </div>
                <button
                  onClick={handleDeleteShot}
                  className="mt-4 w-full text-sm text-destructive hover:underline sm:mt-0 sm:w-auto"
                >
                  Delete shot
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 items-center sm:flex sm:flex-row">
                <AlertDialogAction 
                  onClick={() => handleAddShot(true)} 
                  className="w-full h-10"
                >
                  Yes
                </AlertDialogAction>
                <AlertDialogCancel 
                  onClick={() => handleAddShot(false)} 
                  className="w-full h-10"
                >
                  No
                </AlertDialogCancel>
              </div>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

