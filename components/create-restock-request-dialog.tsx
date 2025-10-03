"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRestockRequests } from "@/hooks/use-restock-requests"
import { useInventory } from "@/hooks/use-inventory"
import { useUsers } from "@/hooks/use-users"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface CreateRestockRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateRestockRequestDialog({ open, onOpenChange }: CreateRestockRequestDialogProps) {
  const [medicationId, setMedicationId] = useState("")
  const [supplierId, setSupplierId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { createRestockRequest } = useRestockRequests()
  const { inventory, loading: inventoryLoading } = useInventory()
  const { users, loading: usersLoading } = useUsers()
  const { toast } = useToast()

  // Filter users to get only suppliers
  const suppliers = users?.filter((user) => user.role === "supplier") || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const medication = inventory?.find((med) => med.id === medicationId)
      const supplier = suppliers.find((sup) => sup.id === supplierId)

      if (!medication || !supplier) {
        throw new Error("Invalid medication or supplier")
      }

      await createRestockRequest({
        medicationId,
        medicationName: medication.name,
        supplierId,
        supplierName: supplier.name,
        pharmacistId: "current-user-id", // In a real app, this would be the current user's ID
        pharmacistName: "Current User", // In a real app, this would be the current user's name
        quantity: Number.parseInt(quantity),
        notes,
        status: "pending",
        dateRequested: new Date().toISOString(),
      })

      toast({
        title: "Restock request created",
        description: `Request for ${medication.name} has been sent to ${supplier.name}.`,
      })

      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the restock request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setMedicationId("")
    setSupplierId("")
    setQuantity("")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Restock Request</DialogTitle>
            <DialogDescription>Request additional stock from a supplier.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medication" className="text-right">
                Medication
              </Label>
              <div className="col-span-3">
                <Select value={medicationId} onValueChange={setMedicationId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medication" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading medications...
                      </SelectItem>
                    ) : inventory?.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No medications available
                      </SelectItem>
                    ) : (
                      inventory?.map((med) => (
                        <SelectItem key={med.id} value={med.id}>
                          {med.name} ({med.quantity} in stock)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <div className="col-span-3">
                <Select value={supplierId} onValueChange={setSupplierId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading suppliers...
                      </SelectItem>
                    ) : suppliers.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No suppliers available
                      </SelectItem>
                    ) : (
                      suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional information for the supplier"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

