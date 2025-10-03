"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { useInventory } from "@/hooks/use-inventory"
import { AddMedicationDialog } from "@/components/add-medication-dialog"
import { EditMedicationDialog } from "@/components/edit-medication-dialog"
import { DeleteMedicationDialog } from "@/components/delete-medication-dialog"
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Medication } from "@/types/medication"

export default function InventoryPage() {
  const { inventory, loading } = useInventory()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editMedication, setEditMedication] = useState<Medication | null>(null)
  const [deleteMedication, setDeleteMedication] = useState<Medication | null>(null)

  const filteredInventory =
    inventory?.filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || med.category === categoryFilter
      return matchesSearch && matchesCategory
    }) || []

  const categories = inventory ? [...new Set(inventory.map((med) => med.category))] : []

  const getStockStatus = (medication: Medication) => {
    if (medication.quantity <= medication.minQuantity * 0.5) {
      return { label: "Critical", variant: "destructive" as const }
    } else if (medication.quantity <= medication.minQuantity) {
      return { label: "Low", variant: "warning" as const }
    } else {
      return { label: "In Stock", variant: "outline" as const }
    }
  }

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { label: "Expired", variant: "destructive" as const }
    } else if (diffDays < 30) {
      return { label: "Soon", variant: "warning" as const }
    } else {
      return { label: diffDays > 180 ? "Valid" : `${diffDays} days`, variant: "outline" as const }
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Inventory Management" text="Add, edit, and manage your pharmaceutical inventory.">
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Medication
        </Button>
      </DashboardHeader>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading inventory...
                </TableCell>
              </TableRow>
            ) : filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No medications found.
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((medication) => {
                const stockStatus = getStockStatus(medication)
                const expiryStatus = getExpiryStatus(medication.expiryDate)

                return (
                  <TableRow key={medication.id}>
                    <TableCell className="font-medium">{medication.name}</TableCell>
                    <TableCell>{medication.category}</TableCell>
                    <TableCell className="text-right">{medication.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{new Date(medication.expiryDate).toLocaleDateString()}</span>
                        <Badge variant={expiryStatus.variant} className="w-fit mt-1">
                          {expiryStatus.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{medication.supplier}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setEditMedication(medication)}>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteMedication(medication)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AddMedicationDialog open={showAddDialog} onOpenChange={setShowAddDialog} />

      {editMedication && (
        <EditMedicationDialog
          medication={editMedication}
          open={!!editMedication}
          onOpenChange={() => setEditMedication(null)}
        />
      )}

      {deleteMedication && (
        <DeleteMedicationDialog
          medication={deleteMedication}
          open={!!deleteMedication}
          onOpenChange={() => setDeleteMedication(null)}
        />
      )}
    </DashboardShell>
  )
}

