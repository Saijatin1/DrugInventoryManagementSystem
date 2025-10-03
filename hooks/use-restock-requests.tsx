"use client"

import { useEffect, useState } from "react"
import type { RestockRequest } from "@/types/restock-request"

// Mock data for restock requests
const mockRestockRequests: RestockRequest[] = [
  {
    id: "1",
    medicationId: "1",
    medicationName: "Amoxicillin",
    supplierId: "4",
    supplierName: "MediSupply Inc.",
    pharmacistId: "2",
    pharmacistName: "John Pharmacist",
    quantity: 100,
    status: "pending",
    dateRequested: "2025-03-25T10:30:00Z",
  },
  {
    id: "2",
    medicationId: "2",
    medicationName: "Ibuprofen",
    supplierId: "5",
    supplierName: "PharmaCorp",
    pharmacistId: "2",
    pharmacistName: "John Pharmacist",
    quantity: 150,
    status: "approved",
    dateRequested: "2025-03-24T14:15:00Z",
    dateResponded: "2025-03-24T16:45:00Z",
    responseNotes: "Approved. Will be delivered within 3 business days.",
  },
  {
    id: "3",
    medicationId: "4",
    medicationName: "Oseltamivir",
    supplierId: "4",
    supplierName: "MediSupply Inc.",
    pharmacistId: "3",
    pharmacistName: "Sarah Pharmacist",
    quantity: 50,
    status: "completed",
    dateRequested: "2025-03-20T09:00:00Z",
    dateResponded: "2025-03-20T11:30:00Z",
    dateCompleted: "2025-03-22T14:00:00Z",
  },
  {
    id: "4",
    medicationId: "5",
    medicationName: "COVID-19 Vaccine",
    supplierId: "6",
    supplierName: "BioTech Supplies",
    pharmacistId: "3",
    pharmacistName: "Sarah Pharmacist",
    quantity: 75,
    status: "rejected",
    dateRequested: "2025-03-18T16:20:00Z",
    dateResponded: "2025-03-19T10:15:00Z",
    responseNotes: "Currently out of stock. Expected restock in 2 weeks.",
  },
  {
    id: "5",
    medicationId: "3",
    medicationName: "Paracetamol",
    supplierId: "5",
    supplierName: "PharmaCorp",
    pharmacistId: "2",
    pharmacistName: "John Pharmacist",
    quantity: 200,
    status: "pending",
    dateRequested: "2025-03-26T08:45:00Z",
    notes: "Urgent request due to unexpected demand increase.",
  },
]

export function useRestockRequests() {
  const [restockRequests, setRestockRequests] = useState<RestockRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Load restock requests data on mount
  useEffect(() => {
    const fetchRestockRequests = async () => {
      // In a real app, this would fetch data from an API
      // For demo purposes, we'll use the mock data

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Load restock requests from localStorage or use mock data
      const storedRequests = localStorage.getItem("restockRequests")
      if (storedRequests) {
        setRestockRequests(JSON.parse(storedRequests))
      } else {
        setRestockRequests(mockRestockRequests)
        localStorage.setItem("restockRequests", JSON.stringify(mockRestockRequests))
      }

      setLoading(false)
    }

    fetchRestockRequests()
  }, [])

  // Create a new restock request
  const createRestockRequest = async (request: Omit<RestockRequest, "id">) => {
    // In a real app, this would make an API call

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a new request with a unique ID
    const newRequest: RestockRequest = {
      ...request,
      id: Math.random().toString(36).substring(2, 9),
    }

    // Update state and localStorage
    const updatedRequests = [...restockRequests, newRequest]
    setRestockRequests(updatedRequests)
    localStorage.setItem("restockRequests", JSON.stringify(updatedRequests))

    return newRequest
  }

  // Update an existing restock request
  const updateRestockRequest = async (request: RestockRequest) => {
    // In a real app, this would make an API call

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update the request in the restockRequests array
    const updatedRequests = restockRequests.map((item) => (item.id === request.id ? request : item))

    // Update state and localStorage
    setRestockRequests(updatedRequests)
    localStorage.setItem("restockRequests", JSON.stringify(updatedRequests))

    return request
  }

  // Delete a restock request
  const deleteRestockRequest = async (id: string) => {
    // In a real app, this would make an API call

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Remove the request from the restockRequests array
    const updatedRequests = restockRequests.filter((item) => item.id !== id)

    // Update state and localStorage
    setRestockRequests(updatedRequests)
    localStorage.setItem("restockRequests", JSON.stringify(updatedRequests))
  }

  return {
    restockRequests,
    loading,
    createRestockRequest,
    updateRestockRequest,
    deleteRestockRequest,
  }
}

