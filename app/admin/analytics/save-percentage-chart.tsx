"use client"

import { Shot } from "@/app/types"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface SavePercentageChartProps {
  shots: Shot[]
}

export function SavePercentageChart({ shots }: SavePercentageChartProps) {
  // Process shots data to calculate save percentage by date
  const shotsByDate = shots.reduce((acc, shot) => {
    const date = new Date(shot.timestamp).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = { total: 0, saved: 0 }
    }
    acc[date].total++
    if (shot.saved) {
      acc[date].saved++
    }
    return acc
  }, {} as Record<string, { total: number; saved: number }>)

  // Transform data for chart display
  const data = Object.entries(shotsByDate).map(([date, stats]) => ({
    date,
    percentage: Math.round((stats.saved / stats.total) * 100),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis unit="%" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="percentage"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

