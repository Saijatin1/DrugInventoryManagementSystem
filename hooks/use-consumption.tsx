"use client"

import { useEffect, useState } from "react"

// Type for consumption data
type ConsumptionData = {
  date: string
  category?: string
  quantity: number
}

// Generate mock consumption data for the past 90 days
const generateConsumptionData = (): ConsumptionData[] => {
  const consumptionData: ConsumptionData[] = []

  const today = new Date()

  for (let i = 90; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dateString = date.toISOString().split("T")[0]

    // Generate a random quantity with an upward trend
    const baseQuantity = 15 + (90 - i) * 0.1
    const randomFactor = Math.random() * 10 - 5 // Random variation between -5 and 5

    consumptionData.push({
      date: dateString,
      quantity: Math.round(Math.max(0, baseQuantity + randomFactor)),
    })
  }

  return consumptionData
}

// Generate category-specific consumption data
const generateCategoryConsumption = (): Record<string, ConsumptionData[]> => {
  const categories = ["Antibiotics", "Analgesics", "Antivirals", "Vaccines", "Other"]
  const categoryConsumption: Record<string, ConsumptionData[]> = {}

  categories.forEach((category) => {
    const consumption = generateConsumptionData()
    // Add category to each consumption item
    categoryConsumption[category] = consumption.map((item) => ({
      ...item,
      category,
      // Adjust values based on category to make them different
      quantity: item.quantity * (Math.random() * 0.5 + 0.75),
    }))
  })

  return categoryConsumption
}

export function useConsumption() {
  const [consumption, setConsumption] = useState<ConsumptionData[]>([])
  const [categoryConsumption, setCategoryConsumption] = useState<Record<string, ConsumptionData[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConsumption = async () => {
      // In a real app, this would fetch data from an API
      // For demo purposes, we'll generate mock consumption data

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const consumptionData = generateConsumptionData()
      const catConsumption = generateCategoryConsumption()

      setConsumption(consumptionData)
      setCategoryConsumption(catConsumption)
      setLoading(false)
    }

    fetchConsumption()
  }, [])

  // Get consumption data for a specific category
  const getConsumptionByCategory = (category: string): ConsumptionData[] => {
    return categoryConsumption[category] || []
  }

  return {
    consumption,
    categoryConsumption,
    getConsumptionByCategory,
    loading,
  }
}

