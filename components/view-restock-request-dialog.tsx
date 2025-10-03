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
import type { RestockRequest } from "@/types/restock-request"

interface ViewRestockRequestDialogProps {
  request: RestockRequest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewRestockRequestDialog({ request, open, onOpenChange }: ViewRestockRequestDialogProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning" as const
      case "approved":
        return "outline" as const
      case "completed":
        return "default" as const
      case "rejected":
      case "cancelled":
        return "destructive" as const
      default:
        return "outline" as const
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Restock Request Details</DialogTitle>
          <DialogDescription>View the details of this restock request.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Medication:</div>
            <div className="col-span-2">{request.medicationName}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Quantity:</div>
            <div className="col-span-2">{request.quantity}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Supplier:</div>
            <div className="col-span-2">{request.supplierName}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Pharmacist:</div>
            <div className="col-span-2">{request.pharmacistName}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Date Requested:</div>
            <div className="col-span-2">{new Date(request.dateRequested).toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Status:</div>
            <div className="col-span-2">
              <Badge variant={getStatusBadgeVariant(request.status)}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </div>
          {request.notes && (
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Notes:</div>
              <div className="col-span-2">{request.notes}</div>
            </div>
          )}
          {request.responseNotes && (
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Response:</div>
              <div className="col-span-2">{request.responseNotes}</div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

