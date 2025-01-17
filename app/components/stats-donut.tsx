"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface StatsDonutProps {
  saves: number
  goals: number
  misses: number
}

export default function StatsDonut({ saves, goals, misses }: StatsDonutProps) {
  const data = [
    { name: "Saves", value: saves, color: "rgb(239, 68, 68)" },    // red-500
    { name: "Goals", value: goals, color: "rgb(234, 179, 8)" },    // yellow-400
    { name: "Misses", value: misses, color: "rgb(156, 163, 175)" } // gray-400
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg shadow-lg p-2">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.value} shots</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[180px] relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold">{saves + goals + misses}</div>
          <div className="text-sm text-muted-foreground">Total Shots</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

