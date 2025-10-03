"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"
import { useRestockRequests } from "@/hooks/use-restock-requests"
import { useUsers } from "@/hooks/use-users"
import { useForecast } from "@/hooks/use-forecast"
import { AlertCircle, CheckCircle, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { ForecastChart } from "@/components/forecast-chart"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SupplierRestockRequests } from "@/components/supplier-restock-requests"
import { PharmacistList } from "@/components/pharmacist-list"
import { motion } from "framer-motion"

export default function SupplierDashboardPage() {
  const { user } = useAuth()
  const { restockRequests, loading: requestsLoading } = useRestockRequests()
  const { users, loading: usersLoading } = useUsers()
  const { forecast, loading: forecastLoading } = useForecast()
  const [stats, setStats] = useState({
    pendingRequests: 0,
    completedRequests: 0,
    totalPharmacists: 0,
    predictedDemand: 0,
  })

  useEffect(() => {
    if (restockRequests) {
      const pendingRequests = restockRequests.filter((req) => req.status === "pending").length
      const completedRequests = restockRequests.filter((req) => req.status === "completed").length
      setStats((prev) => ({ ...prev, pendingRequests, completedRequests }))
    }
  }, [restockRequests])

  useEffect(() => {
    if (users) {
      const totalPharmacists = users.filter((user) => user.role === "pharmacist").length
      setStats((prev) => ({ ...prev, totalPharmacists }))
    }
  }, [users])

  useEffect(() => {
    if (forecast) {
      // Calculate average predicted demand for next 7 days
      const predictedDemand = Math.round(forecast.slice(0, 7).reduce((sum, item) => sum + item.predicted, 0) / 7)
      setStats((prev) => ({ ...prev, predictedDemand }))
    }
  }, [forecast])

  if (!user || user.role !== "supplier") {
    return null // Handle unauthorized access
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Supplier Dashboard" text="Manage restock requests and monitor demand forecasts." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">
                {requestsLoading ? "Loading..." : `${stats.pendingRequests} restock requests need attention`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Requests</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedRequests}</div>
              <p className="text-xs text-muted-foreground">
                {requestsLoading ? "Loading..." : `${stats.completedRequests} requests fulfilled this month`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pharmacists</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPharmacists}</div>
              <p className="text-xs text-muted-foreground">
                {usersLoading ? "Loading..." : `${stats.totalPharmacists} pharmacists in your network`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Predicted Demand</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forecastLoading ? "..." : stats.predictedDemand}</div>
              <p className="text-xs text-muted-foreground">
                {forecastLoading ? "Loading..." : "Average daily demand forecast"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Restock Requests</TabsTrigger>
          <TabsTrigger value="pharmacists">Pharmacists</TabsTrigger>
          <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="space-y-4">
          {stats.pendingRequests > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pending Restock Requests</AlertTitle>
              <AlertDescription>
                You have {stats.pendingRequests} pending restock requests that need your attention.
              </AlertDescription>
            </Alert>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Restock Requests</CardTitle>
              <CardDescription>Manage restock requests from pharmacists</CardDescription>
            </CardHeader>
            <CardContent>
              <SupplierRestockRequests />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pharmacists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacist Network</CardTitle>
              <CardDescription>Pharmacists in your supply network</CardDescription>
            </CardHeader>
            <CardContent>
              <PharmacistList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecast</CardTitle>
              <CardDescription>ML-powered prediction for future demand</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ForecastChart detailed />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Forecast Accuracy</CardTitle>
              <CardDescription>Comparison of predicted vs. actual demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">0%</div>
                    <div className="text-xs text-muted-foreground">Overall Accuracy</div>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">±0%</div>
                    <div className="text-xs text-muted-foreground">Mean Absolute Error</div>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <div className="text-2xl font-bold">0.00</div>
                    <div className="text-xs text-muted-foreground">R² Score</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  The forecast model uses historical consumption data and a linear regression algorithm to predict
                  future demand. The model is retrained daily with new data to improve accuracy.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

