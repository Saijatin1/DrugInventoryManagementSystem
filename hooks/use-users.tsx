"use client"

import { useEffect, useState } from "react"
import type { User } from "@/types/user"

// Mock data for users
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@pharmalink.com",
    role: "admin",
  },
  {
    id: "2",
    name: "John Pharmacist",
    email: "john@pharmacy.com",
    role: "pharmacist",
  },
  {
    id: "3",
    name: "Sarah Pharmacist",
    email: "sarah@pharmacy.com",
    role: "pharmacist",
  },
  {
    id: "4",
    name: "MediSupply Inc.",
    email: "contact@medisupply.com",
    role: "supplier",
  },
  {
    id: "5",
    name: "PharmaCorp",
    email: "info@pharmacorp.com",
    role: "supplier",
  },
  {
    id: "6",
    name: "BioTech Supplies",
    email: "orders@biotech.com",
    role: "supplier",
  },
  {
    id: "7",
    name: "David Pharmacist",
    email: "david@pharmacy.com",
    role: "pharmacist",
  },
  {
    id: "8",
    name: "Emily Pharmacist",
    email: "emily@pharmacy.com",
    role: "pharmacist",
  },
]

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // Load users data on mount
  useEffect(() => {
    const fetchUsers = async () => {
      // In a real app, this would fetch data from an API
      // For demo purposes, we'll use the mock data

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Load users from localStorage or use mock data
      const storedUsers = localStorage.getItem("users")
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers))
      } else {
        setUsers(mockUsers)
        localStorage.setItem("users", JSON.stringify(mockUsers))
      }

      setLoading(false)
    }

    fetchUsers()
  }, [])

  // Add a new user
  const addUser = async (user: Omit<User, "id">) => {
    // In a real app, this would make an API call

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a new user with a unique ID
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(2, 9),
    }

    // Update state and localStorage
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    return newUser
  }

  // Update an existing user
  const updateUser = async (user: User) => {
    // In a real app, this would make an API call

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update the user in the users array
    const updatedUsers = users.map((item) => (item.id === user.id ? user : item))

    // Update state and localStorage
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    return user
  }

  // Delete a user
  const deleteUser = async (id: string) => {
    // In a real app, this would make an API call

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Remove the user from the users array
    const updatedUsers = users.filter((item) => item.id !== id)

    // Update state and localStorage
    setUsers(updatedUsers)
    localStorage.setItem("users", JSON.stringify(updatedUsers))
  }

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
  }
}

