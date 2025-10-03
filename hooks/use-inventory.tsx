"use client"

import { useEffect, useState } from "react"
import type { Medication } from "@/types/medication"

// Mock data for inventory
const mockInventory: Medication[] = [
  {
    id: "1",
    name: "Amoxicillin",
    category: "Antibiotics",
    quantity: 150,
    minQuantity: 50,
    expiryDate: "2025-12-31",
    supplier: "PharmaCorp",
  },
  {
    id: "2",
    name: "Ibuprofen",
    category: "Analgesics",
    quantity: 200,
    minQuantity: 100,
    expiryDate: "2025-10-15",
    supplier: "MediSupply",
  },
  {
    id: "3",
    name: "Paracetamol",
    category: "Analgesics",
    quantity: 80,
    minQuantity: 100,
    expiryDate: "2025-08-20",
    supplier: "MediSupply",
  },
  {
    id: "4",
    name: "Oseltamivir",
    category: "Antivirals",
    quantity: 30,
    minQuantity: 40,
    expiryDate: "2025-05-10",
    supplier: "PharmaCorp",
  },
  {
    id: "5",
    name: "COVID-19 Vaccine",
    category: "Vaccines",
    quantity: 50,
    minQuantity: 100,
    expiryDate: "2024-04-15",
    supplier: "BioTech",
  },
  {
    id: "6",
    name: "Influenza Vaccine",
    category: "Vaccines",
    quantity: 120,
    minQuantity: 80,
    expiryDate: "2024-06-30",
    supplier: "BioTech",
  },
  {
    id: "7",
    name: "Loratadine",
    category: "Antihistamines",
    quantity: 90,
    minQuantity: 60,
    expiryDate: "2025-11-20",
    supplier: "MediSupply",
  },
  {
    id: "8",
    name: "Metformin",
    category: "Antidiabetics",
    quantity: 180,
    minQuantity: 100,
    expiryDate: "2026-01-15",
    supplier: "PharmaCorp",
  },
  {
    id: "9",
    name: "Atorvastatin",
    category: "Statins",
    quantity: 120,
    minQuantity: 80,
    expiryDate: "2025-09-10",
    supplier: "PharmaCorp",
  },
  {
    id: "10",
    name: "Salbutamol",
    category: "Bronchodilators",
    quantity: 40,
    minQuantity: 30,
    expiryDate: "2024-05-05",
    supplier: "MediSupply",
  },
]

export function useInventory() {
  const [inventory, setInventory] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)

  // Load inventory data on mount
  useEffect(() => {
    const fetchInventory = async () => {
      // In a real app, this would fetch data from an API
      // For demo purposes, we'll use the mock data

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Load inventory from localStorage or use mock data
      const storedInventory = localStorage.getItem("inventory")
      if (storedInventory) {
        setInventory(JSON.parse(storedInventory))
      } else {
        setInventory(mockInventory)
        localStorage.setItem("inventory", JSON.stringify(mockInventory))
      }

      setLoading(false)
    }

    fetchInventory()
  }, [])

  // Add a new medication to the inventory
  const addMedication = async (medication: Omit<Medication, "id">) => {
    // In a real app, this would make an API call

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a new medication with a unique ID
    const newMedication: Medication = {
      ...medication,
      id: Math.random().toString(36).substring(2, 9),
    }

    // Update state and localStorage
    const updatedInventory = [...inventory, newMedication]
    setInventory(updatedInventory)
    localStorage.setItem("inventory", JSON.stringify(updatedInventory))

    return newMedication
  }

  // Update an existing medication
  const updateMedication = async (medication: Medication) => {
    // In a real app, this would make an API call

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update the medication in the inventory
    const updatedInventory = inventory.map((item) => (item.id === medication.id ? medication : item))

    // Update state and localStorage
    setInventory(updatedInventory)
    localStorage.setItem("inventory", JSON.stringify(updatedInventory))

    return medication
  }

  // Delete a medication from the inventory
  const deleteMedication = async (id: string) => {
    // In a real app, this would make an API call

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Remove the medication from the inventory
    const updatedInventory = inventory.filter((item) => item.id !== id)

    // Update state and localStorage
    setInventory(updatedInventory)
    localStorage.setItem("inventory", JSON.stringify(updatedInventory))
  }

  return {
    inventory,
    loading,
    addMedication,
    updateMedication,
    deleteMedication,
  }
}

