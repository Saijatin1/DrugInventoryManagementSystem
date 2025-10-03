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
import { useToast } from "@/components/ui/use-toast"
import { useInventory } from "@/hooks/use-inventory"
import type { Medication } from "@/types/medication"

interface DeleteMedicationDialogProps {
  medication: Medication
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteMedicationDialog({ medication, open, onOpenChange }: DeleteMedicationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { deleteMedication } = useInventory()
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      await deleteMedication(medication.id)

      toast({
        title: "Medication deleted",
        description: `${medication.name} has been removed from the inventory.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the medication. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Medication</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {medication.name} from your inventory? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

