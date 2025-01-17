"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Game, Shot } from "../types"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

interface SessionComparisonProps {
  games?: Game[]
  shots: Shot[]
}

export default function SessionComparison({ games = [], shots }: SessionComparisonProps) {
  if (games.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No games available for comparison.
          </p>
        </CardContent>
      </Card>
    )
  }

  const gameStats = games.map(game => {
    const gameShots = shots.filter(shot => shot.gameId === game.id)
    const totalShots = gameShots.length
    const savedShots = gameShots.filter(shot => shot.saved).length
    const savePercentage = totalShots > 0 ? (savedShots / totalShots) * 100 : 0

    return {
      name: game.name,
      saves: savedShots,
      total: totalShots,
      percentage: Number(savePercentage.toFixed(1))
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gameStats}>
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="saves"
                stroke="#eab308"
                name="Saves"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                name="Total Shots"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                stroke="#22c55e"
                name="Save %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

