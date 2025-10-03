"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import { useInventory } from "@/hooks/use-inventory"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Medication } from "@/types/medication"

interface EditMedicationDialogProps {
  medication: Medication
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMedicationDialog({ medication, open, onOpenChange }: EditMedicationDialogProps) {
  const [name, setName] = useState(medication.name)
  const [category, setCategory] = useState(medication.category)
  const [quantity, setQuantity] = useState(medication.quantity.toString())
  const [minQuantity, setMinQuantity] = useState(medication.minQuantity.toString())
  const [expiryDate, setExpiryDate] = useState("")
  const [supplier, setSupplier] = useState(medication.supplier)
  const [isLoading, setIsLoading] = useState(false)

  const { updateMedication, inventory } = useInventory()
  const { toast } = useToast()

  // Format the expiry date for the input field
  useEffect(() => {
    const date = new Date(medication.expiryDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    setExpiryDate(`${year}-${month}-${day}`)
  }, [medication.expiryDate])

  // Extract unique categories from existing inventory
  const categories = inventory ? [...new Set(inventory.map((med) => med.category))] : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateMedication({
        ...medication,
        name,
        category,
        quantity: Number.parseInt(quantity),
        minQuantity: Number.parseInt(minQuantity),
        expiryDate,
        supplier,
      })

      toast({
        title: "Medication updated",
        description: `${name} has been updated in the inventory.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the medication. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
            <DialogDescription>Update medication details in your inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                    <SelectItem value="Analgesics">Analgesics</SelectItem>
                    <SelectItem value="Antivirals">Antivirals</SelectItem>
                    <SelectItem value="Vaccines">Vaccines</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min-quantity" className="text-right">
                Min Quantity
              </Label>
              <Input
                id="min-quantity"
                type="number"
                min="0"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry-date" className="text-right">
                Expiry Date
              </Label>
              <Input
                id="expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Medication"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

