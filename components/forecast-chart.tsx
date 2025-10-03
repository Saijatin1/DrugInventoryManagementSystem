"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useForecast } from "@/hooks/use-forecast"

interface ForecastChartProps {
  detailed?: boolean
  days?: number
  category?: string
}

export function ForecastChart({ detailed = false, days = 30, category }: ForecastChartProps) {
  const { forecast, loading } = useForecast()

  if (loading) {
    return <div className="flex items-center justify-center h-[300px]">Loading forecast data...</div>
  }

  // Filter forecast data by category if specified
  const filteredData = category ? forecast?.filter((item) => item.category === category) : forecast

  // Limit data to specified number of days
  const limitedData = filteredData?.slice(0, days) || []

  if (detailed) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={limitedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" name="Actual Demand" stroke="hsl(var(--primary))" />
          <Line
            type="monotone"
            dataKey="predicted"
            name="Predicted Demand"
            stroke="hsl(var(--destructive))"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="upperBound"
            name="Upper Bound"
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="lowerBound"
            name="Lower Bound"
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={limitedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="predicted"
          name="Predicted Demand"
          fill="hsl(var(--primary))"
          fillOpacity={0.3}
          stroke="hsl(var(--primary))"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

