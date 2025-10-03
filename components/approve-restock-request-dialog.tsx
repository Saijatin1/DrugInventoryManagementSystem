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

interface ApproveRestockRequestDialogProps {
  request: RestockRequest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApproveRestockRequestDialog({ request, open, onOpenChange }: ApproveRestockRequestDialogProps) {
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { updateRestockRequest } = useRestockRequests()
  const { toast } = useToast()

  const handleApprove = async () => {
    setIsLoading(true)

    try {
      await updateRestockRequest({
        ...request,
        status: "approved",
        responseNotes: notes,
        dateResponded: new Date().toISOString(),
      })

      toast({
        title: "Request approved",
        description: `Restock request for ${request.medicationName} has been approved.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error approving the request. Please try again.",
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
          <DialogTitle>Approve Restock Request</DialogTitle>
          <DialogDescription>
            Approve the request for {request.quantity} units of {request.medicationName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional information for the pharmacist"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? "Approving..." : "Approve Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

