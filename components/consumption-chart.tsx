"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useConsumption } from "@/hooks/use-consumption"

interface ConsumptionChartProps {
  days?: number
  category?: string
}

export function ConsumptionChart({ days = 30, category }: ConsumptionChartProps) {
  const { consumption, loading } = useConsumption()

  if (loading) {
    return <div className="flex items-center justify-center h-[300px]">Loading consumption data...</div>
  }

  // Filter consumption data by category if specified
  const filteredData = category ? consumption?.filter((item) => item.category === category) : consumption

  // Limit data to specified number of days
  const limitedData = filteredData?.slice(0, days) || []

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={limitedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" name="Consumption" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  )
}

