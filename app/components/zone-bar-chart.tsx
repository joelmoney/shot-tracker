"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Shot } from "../types"

interface ZoneBarChartProps {
  shots: Shot[]
}

export default function ZoneBarChart({ shots }: ZoneBarChartProps) {
  const zones = [
    'Upper Left',
    'Upper Center',
    'Upper Right',
    'Center Left',
    'Center',
    'Center Right',
    'Lower Left',
    'Lower Center',
    'Lower Right'
  ]
  
  const data = zones.map(zone => {
    const zoneShots = shots.filter(shot => {
      const x = shot.position.x
      const y = shot.position.y
      
      // Determine horizontal position
      const isLeft = x < 33.33
      const isCenter = x >= 33.33 && x < 66.66
      const isRight = x >= 66.66
      
      // Determine vertical position
      const isUpper = y < 33.33
      const isMiddle = y >= 33.33 && y < 66.66
      const isLower = y >= 66.66
      
      // Match zone
      if (zone === 'Upper Left') return isLeft && isUpper
      if (zone === 'Upper Center') return isCenter && isUpper
      if (zone === 'Upper Right') return isRight && isUpper
      if (zone === 'Center Left') return isLeft && isMiddle
      if (zone === 'Center') return isCenter && isMiddle
      if (zone === 'Center Right') return isRight && isMiddle
      if (zone === 'Lower Left') return isLeft && isLower
      if (zone === 'Lower Center') return isCenter && isLower
      if (zone === 'Lower Right') return isRight && isLower
      return false
    })
    
    const saves = zoneShots.filter(shot => shot.saved).length
    const goals = zoneShots.filter(shot => !shot.saved).length
    
    return {
      zone,
      Saves: saves,
      Goals: goals,
      Total: saves + goals
    }
  })

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="zone" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Saves" fill="rgb(239, 68, 68)" /> {/* red-500 */}
          <Bar dataKey="Goals" fill="rgb(234, 179, 8)" /> {/* yellow-400 */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

