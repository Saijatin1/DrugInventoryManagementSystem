"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRestockRequests } from "@/hooks/use-restock-requests"
import type { RestockRequest } from "@/types/restock-request"

interface CancelRestockRequestDialogProps {
  request: RestockRequest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CancelRestockRequestDialog({ request, open, onOpenChange }: CancelRestockRequestDialogProps) {
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { updateRestockRequest } = useRestockRequests()
  const { toast } = useToast()

  const handleCancel = async () => {
    setIsLoading(true)

    try {
      await updateRestockRequest({
        ...request,
        status: "cancelled",
        notes: notes ? `${request.notes || ""}\n\nCancellation reason: ${notes}` : request.notes,
        dateCancelled: new Date().toISOString(),
      })

      toast({
        title: "Request cancelled",
        description: `Restock request for ${request.medicationName} has been cancelled.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error cancelling the request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cancel Restock Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this restock request for {request.medicationName}?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Reason
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional reason for cancellation"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Go Back
          </Button>
          <Button onClick={handleCancel} disabled={isLoading} variant="destructive">
            {isLoading ? "Cancelling..." : "Cancel Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

