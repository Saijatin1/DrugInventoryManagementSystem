"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"
import { useInventory } from "@/hooks/use-inventory"
import { useForecast } from "@/hooks/use-forecast"
import { AlertCircle, Calendar, Package, TrendingUp } from "lucide-react"
import { StockChart } from "@/components/stock-chart"
import { ForecastChart } from "@/components/forecast-chart"
import { RecentActivity } from "@/components/recent-activity"
import { StockAlerts } from "@/components/stock-alerts"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function DashboardPage() {
  const { user } = useAuth()
  const { inventory, loading: inventoryLoading } = useInventory()
  const { forecast, loading: forecastLoading } = useForecast()
  const [stats, setStats] = useState({
    totalDrugs: 0,
    lowStock: 0,
    nearExpiry: 0,
  })

  useEffect(() => {
    if (inventory) {
      const totalDrugs = inventory.length
      const lowStock = inventory.filter((item) => item.quantity < item.minQuantity).length
      const nearExpiry = inventory.filter((item) => {
        const expiryDate = new Date(item.expiryDate)
        const today = new Date()
        const diffTime = expiryDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays < 30
      }).length

      setStats({ totalDrugs, lowStock, nearExpiry })
    }
  }, [inventory])

  if (!user) {
    return null // Handle unauthenticated state or redirect
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your pharmaceutical inventory and analytics." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrugs}</div>
            <p className="text-xs text-muted-foreground">
              {inventoryLoading ? "Loading..." : `${inventory?.length || 0} unique medications`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              {inventoryLoading ? "Loading..." : `${stats.lowStock} medications need restocking`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Near Expiry</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nearExpiry}</div>
            <p className="text-xs text-muted-foreground">
              {inventoryLoading ? "Loading..." : `${stats.nearExpiry} medications expiring soon`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Demand</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forecastLoading ? "..." : "+12%"}</div>
            <p className="text-xs text-muted-foreground">
              {forecastLoading ? "Loading..." : "Increase in demand predicted"}
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
                <CardDescription>Current stock levels across all medication categories</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <StockChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Demand Forecast</CardTitle>
                <CardDescription>ML-powered prediction for the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ForecastChart />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates to your inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Stock Alerts</CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <StockAlerts />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumption Trends</CardTitle>
              <CardDescription>Historical consumption data and future predictions</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ForecastChart detailed />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alerts" className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Critical Low Stock</AlertTitle>
            <AlertDescription>5 medications are critically low and need immediate restocking.</AlertDescription>
          </Alert>
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertTitle>Upcoming Expirations</AlertTitle>
            <AlertDescription>8 medications will expire within the next 30 days.</AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
              <CardDescription>Complete list of inventory alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <StockAlerts detailed />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>All recent inventory changes and system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity detailed />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

