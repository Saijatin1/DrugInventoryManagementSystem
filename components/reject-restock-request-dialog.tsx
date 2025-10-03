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

interface RejectRestockRequestDialogProps {
  request: RestockRequest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RejectRestockRequestDialog({ request, open, onOpenChange }: RejectRestockRequestDialogProps) {
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { updateRestockRequest } = useRestockRequests()
  const { toast } = useToast()

  const handleReject = async () => {
    if (!notes) {
      toast({
        title: "Notes required",
        description: "Please provide a reason for rejecting this request.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await updateRestockRequest({
        ...request,
        status: "rejected",
        responseNotes: notes,
        dateResponded: new Date().toISOString(),
      })

      toast({
        title: "Request rejected",
        description: `Restock request for ${request.medicationName} has been rejected.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error rejecting the request. Please try again.",
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
          <DialogTitle>Reject Restock Request</DialogTitle>
          <DialogDescription>
            Reject the request for {request.quantity} units of {request.medicationName}.
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
              placeholder="Provide a reason for rejecting this request"
              className="col-span-3"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReject} disabled={isLoading} variant="destructive">
            {isLoading ? "Rejecting..." : "Reject Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

