"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useInventory } from "@/hooks/use-inventory"
import { AlertCircle, Calendar, Mail } from "lucide-react"
import type { Medication } from "@/types/medication"
import { useToast } from "@/components/ui/use-toast"

export default function AlertsPage() {
  const { inventory, loading } = useInventory()
  const { toast } = useToast()
  const [emailSent, setEmailSent] = useState<Record<string, boolean>>({})

  const lowStockItems = inventory?.filter((item) => item.quantity < item.minQuantity) || []
  const criticalItems = inventory?.filter((item) => item.quantity <= item.minQuantity * 0.5) || []
  const nearExpiryItems =
    inventory?.filter((item) => {
      const expiryDate = new Date(item.expiryDate)
      const today = new Date()
      const diffTime = expiryDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays < 30 && diffDays >= 0
    }) || []
  const expiredItems =
    inventory?.filter((item) => {
      const expiryDate = new Date(item.expiryDate)
      const today = new Date()
      return expiryDate < today
    }) || []

  const sendNotification = (medication: Medication, type: "restock" | "expiry") => {
    const key = `${medication.id}-${type}`

    // In a real app, this would send an actual email notification
    toast({
      title: "Notification sent",
      description: `Email notification sent for ${medication.name} (${type === "restock" ? "Restock Required" : "Expiry Warning"})`,
    })

    setEmailSent((prev) => ({ ...prev, [key]: true }))
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Stock Alerts" text="Monitor low stock levels and upcoming expirations." />

      {criticalItems.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Stock Alert</AlertTitle>
          <AlertDescription>
            {criticalItems.length} medications are critically low and need immediate restocking.
          </AlertDescription>
        </Alert>
      )}

      {nearExpiryItems.length > 0 && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertTitle>Upcoming Expirations</AlertTitle>
          <AlertDescription>{nearExpiryItems.length} medications will expire within the next 30 days.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="low-stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Warnings</TabsTrigger>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Medications</CardTitle>
              <CardDescription>Medications that need to be restocked soon</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Current Quantity</TableHead>
                    <TableHead className="text-right">Min Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Loading alerts...
                      </TableCell>
                    </TableRow>
                  ) : lowStockItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No low stock alerts.
                      </TableCell>
                    </TableRow>
                  ) : (
                    lowStockItems.map((medication) => {
                      const isCritical = medication.quantity <= medication.minQuantity * 0.5
                      const notificationKey = `${medication.id}-restock`

                      return (
                        <TableRow key={medication.id}>
                          <TableCell className="font-medium">{medication.name}</TableCell>
                          <TableCell>{medication.category}</TableCell>
                          <TableCell className="text-right">{medication.quantity}</TableCell>
                          <TableCell className="text-right">{medication.minQuantity}</TableCell>
                          <TableCell>
                            <Badge variant={isCritical ? "destructive" : "warning"}>
                              {isCritical ? "Critical" : "Low"}
                            </Badge>
                          </TableCell>
                          <TableCell>{medication.supplier}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendNotification(medication, "restock")}
                              disabled={emailSent[notificationKey]}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              {emailSent[notificationKey] ? "Sent" : "Notify"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expiry Warnings</CardTitle>
              <CardDescription>Medications that will expire soon or have already expired</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading expiry warnings...
                      </TableCell>
                    </TableRow>
                  ) : nearExpiryItems.length === 0 && expiredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No expiry warnings.
                      </TableCell>
                    </TableRow>
                  ) : (
                    [...expiredItems, ...nearExpiryItems].map((medication) => {
                      const daysUntilExpiry = getDaysUntilExpiry(medication.expiryDate)
                      const isExpired = daysUntilExpiry < 0
                      const notificationKey = `${medication.id}-expiry`

                      return (
                        <TableRow key={medication.id}>
                          <TableCell className="font-medium">{medication.name}</TableCell>
                          <TableCell>{medication.category}</TableCell>
                          <TableCell>{new Date(medication.expiryDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={isExpired ? "destructive" : "warning"}>
                              {isExpired ? "Expired" : `Expires in ${daysUntilExpiry} days`}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{medication.quantity}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendNotification(medication, "expiry")}
                              disabled={emailSent[notificationKey] || isExpired}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              {emailSent[notificationKey] ? "Sent" : "Notify"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Alerts</CardTitle>
              <CardDescription>Complete list of all inventory alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Alert Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading alerts...
                      </TableCell>
                    </TableRow>
                  ) : lowStockItems.length === 0 && nearExpiryItems.length === 0 && expiredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No alerts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    [
                      ...lowStockItems.map((med) => ({ ...med, alertType: "stock" })),
                      ...nearExpiryItems.map((med) => ({ ...med, alertType: "expiry" })),
                      ...expiredItems.map((med) => ({ ...med, alertType: "expired" })),
                    ].map((medication) => {
                      const { alertType } = medication
                      const isCritical = alertType === "stock" && medication.quantity <= medication.minQuantity * 0.5
                      const isExpired = alertType === "expired"
                      const daysUntilExpiry = alertType === "expiry" ? getDaysUntilExpiry(medication.expiryDate) : null
                      const notificationKey = `${medication.id}-${alertType === "expired" ? "expiry" : alertType}`

                      return (
                        <TableRow key={`${medication.id}-${alertType}`}>
                          <TableCell className="font-medium">{medication.name}</TableCell>
                          <TableCell>{medication.category}</TableCell>
                          <TableCell>
                            {alertType === "stock" ? "Low Stock" : alertType === "expiry" ? "Near Expiry" : "Expired"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={isExpired || isCritical ? "destructive" : "warning"}>
                              {isExpired
                                ? "Expired"
                                : isCritical
                                  ? "Critical"
                                  : alertType === "expiry"
                                    ? `${daysUntilExpiry} days`
                                    : "Low"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {alertType === "stock"
                              ? `${medication.quantity}/${medication.minQuantity}`
                              : new Date(medication.expiryDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                sendNotification(medication, alertType === "expired" ? "expiry" : (alertType as any))
                              }
                              disabled={emailSent[notificationKey] || isExpired}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              {emailSent[notificationKey] ? "Sent" : "Notify"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

