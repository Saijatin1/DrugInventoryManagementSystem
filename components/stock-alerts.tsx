"use client"

import { useInventory } from "@/hooks/use-inventory"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import type { Medication } from "@/types/medication"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface StockAlertsProps {
  detailed?: boolean
}

export function StockAlerts({ detailed = false }: StockAlertsProps) {
  const { inventory, loading } = useInventory()
  const { toast } = useToast()
  const [emailSent, setEmailSent] = useState<Record<string, boolean>>({})

  // Get low stock and near expiry items
  const lowStockItems = inventory?.filter((item) => item.quantity < item.minQuantity) || []
  const nearExpiryItems =
    inventory?.filter((item) => {
      const expiryDate = new Date(item.expiryDate)
      const today = new Date()
      const diffTime = expiryDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays < 30 && diffDays >= 0
    }) || []

  // Combine alerts and sort by priority
  const alerts = [
    ...lowStockItems.map((item) => ({ ...item, alertType: "stock" as const })),
    ...nearExpiryItems.map((item) => ({ ...item, alertType: "expiry" as const })),
  ].sort((a, b) => {
    // Sort by alert type (stock first) and then by priority
    if (a.alertType !== b.alertType) {
      return a.alertType === "stock" ? -1 : 1
    }

    if (a.alertType === "stock") {
      // For stock alerts, sort by how far below minimum quantity
      const aRatio = a.quantity / a.minQuantity
      const bRatio = b.quantity / b.minQuantity
      return aRatio - bRatio
    } else {
      // For expiry alerts, sort by days until expiry
      const aExpiry = new Date(a.expiryDate).getTime()
      const bExpiry = new Date(b.expiryDate).getTime()
      return aExpiry - bExpiry
    }
  })

  // Limit the number of alerts to show unless detailed view
  const limitedAlerts = detailed ? alerts : alerts.slice(0, 5)

  const sendNotification = (medication: Medication & { alertType: "stock" | "expiry" }) => {
    const key = `${medication.id}-${medication.alertType}`

    // In a real app, this would send an actual email notification
    toast({
      title: "Notification sent",
      description: `Email notification sent for ${medication.name} (${medication.alertType === "stock" ? "Restock Required" : "Expiry Warning"})`,
    })

    setEmailSent((prev) => ({ ...prev, [key]: true }))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-[200px]">Loading alerts...</div>
  }

  if (limitedAlerts.length === 0) {
    return <p className="text-center text-muted-foreground">No alerts at this time.</p>
  }

  return (
    <div className="space-y-4">
      {limitedAlerts.map((item) => {
        const isCritical = item.alertType === "stock" && item.quantity <= item.minQuantity * 0.5
        const notificationKey = `${item.id}-${item.alertType}`

        let statusText = ""
        if (item.alertType === "stock") {
          statusText = isCritical ? "Critical" : "Low Stock"
        } else {
          const daysUntilExpiry = Math.ceil(
            (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          )
          statusText = `Expires in ${daysUntilExpiry} days`
        }

        return (
          <div key={`${item.id}-${item.alertType}`} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">{item.name}</p>
              <div className="flex items-center">
                <Badge variant={isCritical ? "destructive" : "warning"}>{statusText}</Badge>
                <span className="ml-2 text-sm text-muted-foreground">
                  {item.alertType === "stock"
                    ? `${item.quantity}/${item.minQuantity}`
                    : new Date(item.expiryDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendNotification(item)}
              disabled={emailSent[notificationKey]}
            >
              <Mail className="mr-2 h-4 w-4" />
              {emailSent[notificationKey] ? "Sent" : "Notify"}
            </Button>
          </div>
        )
      })}
    </div>
  )
}

