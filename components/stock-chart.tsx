"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useInventory } from "@/hooks/use-inventory"

interface StockChartProps {
  category?: string
  detailed?: boolean
}

export function StockChart({ category, detailed = false }: StockChartProps) {
  const { inventory, loading } = useInventory()

  if (loading) {
    return <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
  }

  // Group medications by category and calculate total quantity
  const stockData =
    inventory?.reduce(
      (acc, med) => {
        if (category && med.category !== category) return acc

        const existingCategory = acc.find((item) => item.category === med.category)
        if (existingCategory) {
          existingCategory.quantity += med.quantity
          existingCategory.minQuantity += med.minQuantity
        } else {
          acc.push({
            category: med.category,
            quantity: med.quantity,
            minQuantity: med.minQuantity,
          })
        }
        return acc
      },
      [] as { category: string; quantity: number; minQuantity: number }[],
    ) || []

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" name="Current Stock" fill="hsl(var(--primary))" />
        <Bar dataKey="minQuantity" name="Minimum Required" fill="hsl(var(--destructive))" />
      </BarChart>
    </ResponsiveContainer>
  )
}

