"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useInventory } from "@/hooks/use-inventory"

export function CategoryDistributionChart() {
  const { inventory, loading } = useInventory()

  if (loading) {
    return <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
  }

  // Group medications by category and count
  const categoryData =
    inventory?.reduce(
      (acc, med) => {
        const existingCategory = acc.find((item) => item.name === med.category)
        if (existingCategory) {
          existingCategory.value += 1
        } else {
          acc.push({
            name: med.category,
            value: 1,
          })
        }
        return acc
      },
      [] as { name: string; value: number }[],
    ) || []

  // Colors for the pie chart
  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--destructive))",
    "hsl(var(--warning))",
    "hsl(var(--secondary))",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

