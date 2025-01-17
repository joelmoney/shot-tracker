"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 234,
  },
  {
    name: "Feb",
    total: 345,
  },
  {
    name: "Mar",
    total: 412,
  },
  {
    name: "Apr",
    total: 451,
  },
  {
    name: "May",
    total: 478,
  },
  {
    name: "Jun",
    total: 523,
  },
  {
    name: "Jul",
    total: 573,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

