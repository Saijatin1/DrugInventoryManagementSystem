"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useInventory } from "@/hooks/use-inventory"
import { useRestockRequests } from "@/hooks/use-restock-requests"
import { AlertCircle, Calendar, Package, ShoppingCart } from "lucide-react"
import { StockChart } from "@/components/stock-chart"
import { RecentActivity } from "@/components/recent-activity"
import { StockAlerts } from "@/components/stock-alerts"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { RestockRequestList } from "@/components/restock-request-list"
import { CreateRestockRequestDialog } from "@/components/create-restock-request-dialog"
import { motion } from "framer-motion"

export default function PharmacistDashboardPage() {
  const { user } = useAuth()
  const { inventory, loading: inventoryLoading } = useInventory()
  const { restockRequests, loading: requestsLoading } = useRestockRequests()
  const [showCreateRequest, setShowCreateRequest] = useState(false)
  const [stats, setStats] = useState({
    totalDrugs: 0,
    lowStock: 0,
    nearExpiry: 0,
    pendingRequests: 0,
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

      setStats((prev) => ({ ...prev, totalDrugs, lowStock, nearExpiry }))
    }
  }, [inventory])

  useEffect(() => {
    if (restockRequests) {
      const pendingRequests = restockRequests.filter((req) => req.status === "pending").length
      setStats((prev) => ({ ...prev, pendingRequests }))
    }
  }, [restockRequests])

  if (!user || user.role !== "pharmacist") {
    return null // Handle unauthorized access
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Pharmacist Dashboard" text="Manage your inventory and restock requests.">
        <Button onClick={() => setShowCreateRequest(true)}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Create Restock Request
        </Button>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requestsLoading ? "..." : stats.pendingRequests}</div>
              <p className="text-xs text-muted-foreground">
                {requestsLoading ? "Loading..." : `${stats.pendingRequests} restock requests awaiting approval`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="restock">Restock Requests</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="col-span-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Stock Levels</CardTitle>
                  <CardDescription>Current stock levels across all medication categories</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <StockChart />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="col-span-3"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Stock Alerts</CardTitle>
                  <CardDescription>Items requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <StockAlerts />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
        <TabsContent value="restock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restock Requests</CardTitle>
              <CardDescription>Manage your restock requests to suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <RestockRequestList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alerts" className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Critical Low Stock</AlertTitle>
            <AlertDescription>{stats.lowStock} medications are low in stock and need restocking.</AlertDescription>
          </Alert>
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertTitle>Upcoming Expirations</AlertTitle>
            <AlertDescription>{stats.nearExpiry} medications will expire within the next 30 days.</AlertDescription>
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

      <CreateRestockRequestDialog open={showCreateRequest} onOpenChange={setShowCreateRequest} />
    </DashboardShell>
  )
}

