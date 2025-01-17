"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
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
import { addShot, getShots, exportGameData, updateGameNotes, getAllShots } from "./actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Camera, Trash2, Undo2, Redo2 } from 'lucide-react'
import ExportDialog from "./components/export-dialog"
import StatsDonut from "./components/stats-donut"
import ZoneBarChart from "./components/zone-bar-chart"
import { InstructionsDialog } from "./components/instructions-dialog"
import { ShotLegend } from "./components/shot-legend"

interface ShotTrackerProps {
  gameId: string
  games: Game[]
}

const getZone = (x: number, y: number): string => {
  // Vertical zones
  let vertical = ""
  if (y <= 33.33) vertical = "upper"
  else if (y <= 66.66) vertical = ""
  else vertical = "low"

  // Horizontal zones
  let horizontal = ""
  if (x <= 33.33) horizontal = "left"
  else if (x <= 66.66) horizontal = "center"
  else horizontal = "right"

  return `${vertical} ${horizontal}`.trim()
}

const calculateZoneStats = (shots: Shot[]) => {
  const zones = {
    'upper left': { total: 0, saved: 0 },
    'upper center': { total: 0, saved: 0 },
    'upper right': { total: 0, saved: 0 },
    'left': { total: 0, saved: 0 },
    'center': { total: 0, saved: 0 },
    'right': { total: 0, saved: 0 },
    'low left': { total: 0, saved: 0 },
    'low center': { total: 0, saved: 0 },
    'low right': { total: 0, saved: 0 }
  }

  shots.forEach(shot => {
    if (isInsideGoal(shot.position)) {
      const zone = getZone(shot.position.x, shot.position.y)
      zones[zone].total++
      if (shot.saved) zones[zone].saved++
    }
  })

  return zones
}

const isInsideGoal = (position: { x: number; y: number }): boolean => {
  // Goal is centered and takes up half the width/height
  const goalLeft = 25
  const goalRight = 75
  const goalTop = 25
  const goalBottom = 75

  return position.x >= goalLeft && 
         position.x <= goalRight && 
         position.y >= goalTop && 
         position.y <= goalBottom
}

export default function ShotTracker({ gameId, games }: ShotTrackerProps) {
  const [shots, setShots] = useState<Shot[]>([])
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null)
  const [activeTab, setActiveTab] = useState("field")
  const [gameNotes, setGameNotes] = useState("")
  const [allShots, setAllShots] = useState<Shot[]>([])
  const [selectedHalf, setSelectedHalf] = useState<"first" | "second" | "all">("all")
  const [isLoading, setIsLoading] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  
  // Undo/Redo state
  const [history, setHistory] = useState<Shot[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const game = games.find(g => g.id === gameId)
        if (game) {
          setGameNotes(game.notes || "")
        }
        
        const [fetchedShots, allFetchedShots] = await Promise.all([
          getShots(gameId),
          getAllShots()
        ])
        
        setShots(fetchedShots)
        setHistory([[]])
        setHistoryIndex(0)
        setAllShots(allFetchedShots)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [gameId, games])

  const addToHistory = useCallback((newShots: Shot[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      return [...newHistory, newShots]
    })
    setHistoryIndex(prev => prev + 1)
  }, [historyIndex])

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setShots(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setShots(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const handleAddShot = async (saved: boolean) => {
    if (selectedPosition) {
      try {
        const newShot = await addShot(gameId, {
          saved,
          position: selectedPosition,
          timestamp: Date.now(),
          half: selectedHalf === "all" ? "first" : selectedHalf
        })
        const newShots = [...shots, newShot]
        setShots(newShots)
        addToHistory(newShots)
      } catch (error) {
        console.error('Error adding shot:', error)
      } finally {
        setSelectedPosition(null)
        setShowDialog(false)
      }
    }
  }

  const handleUpdateShot = async (saved: boolean) => {
    if (selectedShot) {
      try {
        const updatedShots = shots.map(shot => 
          shot.id === selectedShot.id ? { ...shot, saved } : shot
        )
        setShots(updatedShots)
        addToHistory(updatedShots)
      } catch (error) {
        console.error('Error updating shot:', error)
      } finally {
        setSelectedShot(null)
        setShowDialog(false)
      }
    }
  }

  const handleDeleteShot = () => {
    if (selectedShot) {
      const updatedShots = shots.filter(shot => shot.id !== selectedShot.id)
      setShots(updatedShots)
      addToHistory(updatedShots)
      setSelectedShot(null)
      setShowDialog(false)
    }
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default touch behaviors
    if (!touchStartRef.current) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    
    // Increase the tap threshold for better mobile detection
    if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = ((touch.clientX - rect.left) / rect.width) * 100
      const y = ((touch.clientY - rect.top) / rect.height) * 100
      handleShotPlacement(x, y)
    }
    
    touchStartRef.current = null
  }

  const handleShotPlacement = async (x: number, y: number) => {
    const position = { x, y }
    
    // Check if clicking near an existing shot
    const clickedShot = shots.find(shot => {
      const dx = shot.position.x - x
      const dy = shot.position.y - y
      return Math.sqrt(dx * dx + dy * dy) < 5 // 5% radius for click detection
    })

    if (clickedShot) {
      setSelectedShot(clickedShot)
      setShowDialog(true)
      return
    }
    
    if (isInsideGoal(position)) {
      // For shots inside the goal, show dialog to ask if it was saved
      setSelectedPosition(position)
      setShowDialog(true)
    } else {
      // For shots outside the goal, automatically mark as not saved
      try {
        const newShot = await addShot(gameId, {
          saved: false,
          position,
          timestamp: Date.now(),
          half: selectedHalf === "all" ? "first" : selectedHalf
        })
        const newShots = [...shots, newShot]
        setShots(newShots)
        addToHistory(newShots)
      } catch (error) {
        console.error('Error adding shot:', error)
      }
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    handleShotPlacement(x, y)
  }

  const handleExport = async () => {
    try {
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
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const handleGameNotesChange = useCallback(async (notes: string) => {
    setGameNotes(notes)
    try {
      await updateGameNotes(gameId, notes)
    } catch (error) {
      console.error('Failed to update game notes:', error)
    }
  }, [gameId])

  const filteredShots = shots.filter(shot => 
    selectedHalf === "all" ? true : shot.half === selectedHalf
  )

  const totalShots = shots.length
  const savedShots = shots.filter(shot => shot.saved && isInsideGoal(shot.position)).length
  const goalsScored = shots.filter(shot => !shot.saved && isInsideGoal(shot.position)).length
  const missedShots = shots.filter(shot => !isInsideGoal(shot.position)).length
  const savePercentage = totalShots > 0 ? (savedShots / totalShots) * 100 : 0

  const getHalfStats = (half: "first" | "second") => {
    const halfShots = shots.filter(shot => shot.half === half)
    return {
      saves: halfShots.filter(shot => shot.saved && isInsideGoal(shot.position)).length,
      goals: halfShots.filter(shot => !shot.saved && isInsideGoal(shot.position)).length,
      misses: halfShots.filter(shot => !isInsideGoal(shot.position)).length
    }
  }

  const firstHalfStats = getHalfStats("first")
  const secondHalfStats = getHalfStats("second")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Card className="flex-1 shadow-md fade-in">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4" role="region" aria-label="Game Statistics">
              <div className="text-center">
                <div className="text-2xl font-bold" aria-label="Total Shots">{totalShots}</div>
                <div className="text-sm text-muted-foreground">Total Shots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" aria-label="Total Saves">{savedShots}</div>
                <div className="text-sm text-muted-foreground">Saves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" aria-label="Save Percentage">{savePercentage.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Save %</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="field">Goal</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="field" className="mt-4">
          <Card className="shadow-lg">
            <CardContent className="p-4 fade-in">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Select value={selectedHalf} onValueChange={(value: "first" | "second" | "all") => setSelectedHalf(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select half" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Shots</SelectItem>
                      <SelectItem value="first">First Half</SelectItem>
                      <SelectItem value="second">Second Half</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleUndo}
                      disabled={historyIndex === 0}
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRedo}
                      disabled={historyIndex === history.length - 1}
                    >
                      <Redo2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <InstructionsDialog />
              </div>
              <div 
                ref={fieldRef}
                className="relative aspect-square overflow-hidden rounded-lg touch-action-none"
                style={{
                  background: 'linear-gradient(to bottom, #87CEEB 0%, #87CEEB 75%, #2e7d32 75%, #2e7d32 100%)',
                  touchAction: 'none'
                }}
                onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                role="application"
                aria-label="Soccer goal shot placement field"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = 50 // Center X
                    const y = 50 // Center Y
                    handleShotPlacement(x, y)
                  }
                }}
                tabIndex={0}
              >
                {/* Goal frame */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2">
                  {/* Top border */}
                  <div className="absolute top-0 left-0 right-0 h-[5px] bg-white" />
                  {/* Left border */}
                  <div className="absolute top-0 left-0 bottom-0 w-[5px] bg-white" />
                  {/* Right border */}
                  <div className="absolute top-0 right-0 bottom-0 w-[5px] bg-white" />
                  {/* Vertical grid lines */}
                  <div className="absolute left-1/3 top-0 h-full w-[1px] bg-white/50" />
                  <div className="absolute left-2/3 top-0 h-full w-[1px] bg-white/50" />
                  {/* Horizontal grid lines */}
                  <div className="absolute top-1/3 left-0 w-full h-[1px] bg-white/50" />
                  <div className="absolute top-2/3 left-0 w-full h-[1px] bg-white/50" />
                </div>
                
                {filteredShots.map((shot) => {
                  const isInGoal = isInsideGoal(shot.position)
                  let dotColor = 'border-2 border-white bg-transparent'
                  if (isInGoal) {
                    dotColor = shot.saved ? 'bg-red-500' : 'bg-yellow-400'
                  }
                  const shotType = isInGoal 
                    ? (shot.saved ? 'Saved shot' : 'Goal scored') 
                    : 'Missed shot'
                  return (
                    <div
                      key={shot.id}
                      className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${dotColor}`}
                      style={{
                        left: `${shot.position.x}%`,
                        top: `${shot.position.y}%`
                      }}
                      role="img"
                      aria-label={`${shotType} at position ${Math.round(shot.position.x)}% from left, ${Math.round(shot.position.y)}% from top`}
                    />
                  )
                })}

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
              <ShotLegend />
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardContent ref={statsRef} className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
                <h3 className="font-semibold">Overall Statistics</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" onClick={handleExport} className="flex-1 sm:flex-initial">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <div className="flex-1 sm:flex-initial">
                    <ExportDialog statsRef={statsRef} />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <StatsDonut saves={savedShots} goals={goalsScored} misses={missedShots} />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">First Half</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Saves</div>
                          <div className="text-xl font-bold text-red-500">{firstHalfStats.saves}</div>
                        </div>
                        <div>
                          <div className="font-medium">Goals</div>
                          <div className="text-xl font-bold text-yellow-400">{firstHalfStats.goals}</div>
                        </div>
                        <div>
                          <div className="font-medium">Misses</div>
                          <div className="text-xl font-bold text-gray-400">{firstHalfStats.misses}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Second Half</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Saves</div>
                          <div className="text-xl font-bold text-red-500">{secondHalfStats.saves}</div>
                        </div>
                        <div>
                          <div className="font-medium">Goals</div>
                          <div className="text-xl font-bold text-yellow-400">{secondHalfStats.goals}</div>
                        </div>
                        <div>
                          <div className="font-medium">Misses</div>
                          <div className="text-xl font-bold text-gray-400">{secondHalfStats.misses}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Shot Distribution</h3>
                  <ZoneBarChart shots={shots} />
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Zone Statistics</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {Object.entries(calculateZoneStats(shots)).map(([zone, stats]) => (
                      <div key={zone} className="p-2 bg-muted rounded-lg">
                        <div className="font-medium capitalize">{zone}</div>
                        <div className="text-muted-foreground">
                          {stats.saved}/{stats.total} saved
                          {stats.total > 0 && (
                            <span className="ml-1">
                              ({((stats.saved / stats.total) * 100).toFixed(0)}%)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Textarea
        placeholder="Game notes..."
        value={gameNotes}
        onChange={(e) => handleGameNotesChange(e.target.value)}
        className="min-h-[100px]"
      />

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent role="dialog" aria-modal="true" aria-labelledby="shot-dialog-title">
          <AlertDialogHeader>
            <AlertDialogTitle id="shot-dialog-title" className="text-center">Was it saved?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col items-center space-y-2">
            {selectedShot ? (
              <>
                <div className="flex w-full gap-2">
                  <AlertDialogAction 
                    onClick={() => handleUpdateShot(true)} 
                    className="flex-1 h-9"
                  >
                    Yes
                  </AlertDialogAction>
                  <AlertDialogCancel 
                    onClick={() => handleUpdateShot(false)} 
                    className="flex-1 h-9 mt-0"
                  >
                    No
                  </AlertDialogCancel>
                </div>
                <button
                  onClick={handleDeleteShot}
                  className="text-sm text-destructive hover:underline mt-2"
                  aria-label="Delete this shot"
                >
                  Delete shot
                </button>
              </>
            ) : (
              <div className="flex w-full gap-2">
                <AlertDialogAction 
                  onClick={() => handleAddShot(true)} 
                  className="flex-1 h-9"
                >
                  Yes
                </AlertDialogAction>
                <AlertDialogCancel 
                  onClick={() => handleAddShot(false)} 
                  className="flex-1 h-9 mt-0"
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

