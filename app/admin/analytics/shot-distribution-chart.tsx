"use client"

import { Shot } from "@/app/types"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts"

interface ShotDistributionChartProps {
  shots: Shot[]
}

export function ShotDistributionChart({ shots }: ShotDistributionChartProps) {
  // Calculate shot distribution data
  const data = [
    {
      name: "Saves",
      value: shots.filter(shot => shot.saved).length,
      color: "#ef4444", // red-500 for saves
    },
    {
      name: "Goals",
      value: shots.filter(shot => !shot.saved).length,
      color: "#eab308", // yellow-500 for goals
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        {/* Render pie chart with inner radius for donut style */}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60} // Creates donut hole
          outerRadius={80}
          paddingAngle={5} // Space between segments
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

