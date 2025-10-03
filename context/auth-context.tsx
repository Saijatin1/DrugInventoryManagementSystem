"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/types/user"

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  signup: (name: string, email: string, password: string, role: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll simulate a successful login

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a mock user based on the email
    let role: "admin" | "pharmacist" | "supplier" = "pharmacist"

    if (email.includes("admin")) {
      role = "admin"
    } else if (email.includes("supplier") || email.includes("corp") || email.includes("supply")) {
      role = "supplier"
    }

    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: email
        .split("@")[0]
        .replace(/[.]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      role,
    }

    // Store user in state and localStorage
    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))

    return mockUser
  }

  const signup = async (name: string, email: string, password: string, role: string) => {
    // In a real app, this would make an API call to create a new user
    // For demo purposes, we'll simulate a successful signup

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a new user
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: role as "admin" | "pharmacist" | "supplier",
    }

    // Store user in state and localStorage
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))

    return newUser
  }

  const logout = () => {
    // Clear user from state and localStorage
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

