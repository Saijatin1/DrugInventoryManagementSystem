"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRestockRequests } from "@/hooks/use-restock-requests"
import { useState, useEffect } from "react"

interface ViewPharmacistDialogProps {
  pharmacist: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewPharmacistDialog({ pharmacist, open, onOpenChange }: ViewPharmacistDialogProps) {
  const { restockRequests, loading } = useRestockRequests()
  const [pharmacistStats, setPharmacistStats] = useState({
    pendingRequests: 0,
    completedRequests: 0,
    totalRequests: 0,
  })

  useEffect(() => {
    if (restockRequests) {
      const pharmacistRequests = restockRequests.filter((req) => req.pharmacistId === pharmacist.id)
      const pendingRequests = pharmacistRequests.filter((req) => req.status === "pending").length
      const completedRequests = pharmacistRequests.filter((req) => req.status === "completed").length

      setPharmacistStats({
        pendingRequests,
        completedRequests,
        totalRequests: pharmacistRequests.length,
      })
    }
  }, [restockRequests, pharmacist.id])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pharmacist Details</DialogTitle>
          <DialogDescription>View details about this pharmacist.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="/placeholder-user.jpg" alt={pharmacist.name} />
            <AvatarFallback className="text-2xl">{pharmacist.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold">{pharmacist.name}</h3>
          <p className="text-muted-foreground">{pharmacist.email}</p>
          <div className="mt-4 flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
              Active
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="flex flex-col items-center justify-center rounded-lg border p-4">
            <div className="text-2xl font-bold">{loading ? "..." : pharmacistStats.totalRequests}</div>
            <div className="text-xs text-muted-foreground">Total Requests</div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-4">
            <div className="text-2xl font-bold">{loading ? "..." : pharmacistStats.pendingRequests}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border p-4">
            <div className="text-2xl font-bold">{loading ? "..." : pharmacistStats.completedRequests}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

