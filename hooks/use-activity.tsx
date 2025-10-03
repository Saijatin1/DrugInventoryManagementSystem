"use client"

import { useEffect, useState } from "react"

// Type for activity data
type ActivityItem = {
  id: string
  userName: string
  userAvatar?: string
  action: string
  actionType?: "add" | "update" | "delete"
  medicationName: string
  details?: string
  timestamp: string
}

// Generate mock activity data
const generateActivityData = (): ActivityItem[] => {
  const actions = [
    { action: "added", type: "add" as const },
    { action: "updated", type: "update" as const },
    { action: "deleted", type: "delete" as const },
    { action: "restocked", type: "update" as const },
  ]

  const medications = [
    "Amoxicillin",
    "Ibuprofen",
    "Paracetamol",
    "Oseltamivir",
    "COVID-19 Vaccine",
    "Influenza Vaccine",
    "Loratadine",
    "Metformin",
    "Atorvastatin",
    "Salbutamol",
  ]

  const users = [
    { name: "John Doe", avatar: "/placeholder-user.jpg" },
    { name: "Jane Smith", avatar: "/placeholder-user.jpg" },
    { name: "Admin User", avatar: "/placeholder-user.jpg" },
  ]

  const activityData: ActivityItem[] = []

  // Generate 20 random activity items
  for (let i = 0; i < 20; i++) {
    const actionInfo = actions[Math.floor(Math.random() * actions.length)]
    const medication = medications[Math.floor(Math.random() * medications.length)]
    const user = users[Math.floor(Math.random() * users.length)]

    // Generate a random timestamp within the last 7 days
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 7))

    let details
    if (actionInfo.type === "add") {
      details = "Added to inventory"
    } else if (actionInfo.type === "update") {
      details =
        actionInfo.action === "restocked"
          ? `Quantity increased by ${Math.floor(Math.random() * 50) + 10}`
          : `Updated ${["quantity", "expiry date", "supplier"][Math.floor(Math.random() * 3)]}`
    }

    activityData.push({
      id: Math.random().toString(36).substring(2, 9),
      userName: user.name,
      userAvatar: user.avatar,
      action: actionInfo.action,
      actionType: actionInfo.type,
      medicationName: medication,
      details,
      timestamp: timestamp.toISOString(),
    })
  }

  // Sort by timestamp (newest first)
  activityData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return activityData
}

export function useActivity() {
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      // In a real app, this would fetch data from an API
      // For demo purposes, we'll generate mock activity data

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const activityData = generateActivityData()

      setActivity(activityData)
      setLoading(false)
    }

    fetchActivity()
  }, [])

  return {
    activity,
    loading,
  }
}

