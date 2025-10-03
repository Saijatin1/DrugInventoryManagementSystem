"use client"

import { useEffect, useState } from "react"
import * as tf from "@tensorflow/tfjs"

// Type for forecast data
type ForecastData = {
  date: string
  category?: string
  actual: number
  predicted: number
  upperBound: number
  lowerBound: number
}

// Mock historical consumption data
const mockHistoricalData = [
  { date: "2024-01-01", quantity: 12 },
  { date: "2024-01-02", quantity: 15 },
  { date: "2024-01-03", quantity: 10 },
  { date: "2024-01-04", quantity: 18 },
  { date: "2024-01-05", quantity: 20 },
  { date: "2024-01-06", quantity: 15 },
  { date: "2024-01-07", quantity: 13 },
  { date: "2024-01-08", quantity: 16 },
  { date: "2024-01-09", quantity: 19 },
  { date: "2024-01-10", quantity: 22 },
  { date: "2024-01-11", quantity: 25 },
  { date: "2024-01-12", quantity: 20 },
  { date: "2024-01-13", quantity: 18 },
  { date: "2024-01-14", quantity: 15 },
  { date: "2024-01-15", quantity: 21 },
  { date: "2024-01-16", quantity: 24 },
  { date: "2024-01-17", quantity: 22 },
  { date: "2024-01-18", quantity: 20 },
  { date: "2024-01-19", quantity: 18 },
  { date: "2024-01-20", quantity: 16 },
  { date: "2024-01-21", quantity: 19 },
  { date: "2024-01-22", quantity: 23 },
  { date: "2024-01-23", quantity: 26 },
  { date: "2024-01-24", quantity: 25 },
  { date: "2024-01-25", quantity: 22 },
  { date: "2024-01-26", quantity: 20 },
  { date: "2024-01-27", quantity: 18 },
  { date: "2024-01-28", quantity: 21 },
  { date: "2024-01-29", quantity: 24 },
  { date: "2024-01-30", quantity: 27 },
]

// Generate forecast data for the next 30 days
const generateForecastData = (): ForecastData[] => {
  const forecastData: ForecastData[] = []

  // Simple linear regression model
  const xs = tf.tensor1d(mockHistoricalData.map((_, i) => i))
  const ys = tf.tensor1d(mockHistoricalData.map((d) => d.quantity))

  // y = mx + b
  const m = tf.scalar(Math.random() * 0.5 + 0.1) // Slope
  const b = tf.scalar(Math.random() * 5 + 15) // Y-intercept

  // Generate predictions for the next 30 days
  const today = new Date()

  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)

    const dateString = date.toISOString().split("T")[0]

    // Predict using our simple model: y = mx + b
    const x = mockHistoricalData.length + i
    const predicted = m.mul(x).add(b).dataSync()[0]

    // Add some randomness for actual values (for past dates)
    const actual = i < 7 ? predicted + (Math.random() * 6 - 3) : 0 // No actual data for future dates

    // Add error bounds
    const errorMargin = predicted * 0.15 // 15% error margin

    forecastData.push({
      date: dateString,
      actual: Math.round(actual),
      predicted: Math.round(predicted),
      upperBound: Math.round(predicted + errorMargin),
      lowerBound: Math.round(Math.max(0, predicted - errorMargin)),
    })
  }

  return forecastData
}

// Generate category-specific forecast data
const generateCategoryForecasts = (): Record<string, ForecastData[]> => {
  const categories = ["Antibiotics", "Analgesics", "Antivirals", "Vaccines", "Other"]
  const categoryForecasts: Record<string, ForecastData[]> = {}

  categories.forEach((category) => {
    const forecast = generateForecastData()
    // Add category to each forecast item
    categoryForecasts[category] = forecast.map((item) => ({
      ...item,
      category,
      // Adjust values based on category to make them different
      actual: item.actual * (Math.random() * 0.5 + 0.75),
      predicted: item.predicted * (Math.random() * 0.5 + 0.75),
      upperBound: item.upperBound * (Math.random() * 0.5 + 0.75),
      lowerBound: item.lowerBound * (Math.random() * 0.5 + 0.75),
    }))
  })

  return categoryForecasts
}

export function useForecast() {
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [categoryForecasts, setCategoryForecasts] = useState<Record<string, ForecastData[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForecast = async () => {
      // In a real app, this would fetch data from an API or run ML model
      // For demo purposes, we'll generate mock forecast data

      // Simulate API/ML processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const forecastData = generateForecastData()
      const catForecasts = generateCategoryForecasts()

      setForecast(forecastData)
      setCategoryForecasts(catForecasts)
      setLoading(false)
    }

    fetchForecast()
  }, [])

  // Get forecast data for a specific category
  const getForecastByCategory = (category: string): ForecastData[] => {
    return categoryForecasts[category] || []
  }

  return {
    forecast,
    categoryForecasts,
    getForecastByCategory,
    loading,
  }
}

