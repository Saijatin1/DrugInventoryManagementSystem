"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRestockRequests } from "@/hooks/use-restock-requests"
import { MoreHorizontal, Search, ShoppingCart } from "lucide-react"
import { CreateRestockRequestDialog } from "@/components/create-restock-request-dialog"
import { ViewRestockRequestDialog } from "@/components/view-restock-request-dialog"
import { CancelRestockRequestDialog } from "@/components/cancel-restock-request-dialog"
import type { RestockRequest } from "@/types/restock-request"

export function RestockRequestList() {
  const { restockRequests, loading } = useRestockRequests()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateRequest, setShowCreateRequest] = useState(false)
  const [viewRequest, setViewRequest] = useState<RestockRequest | null>(null)
  const [cancelRequest, setCancelRequest] = useState<RestockRequest | null>(null)

  const filteredRequests =
    restockRequests?.filter(
      (req) =>
        req.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.status.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning" as const
      case "approved":
        return "outline" as const
      case "completed":
        return "default" as const
      case "cancelled":
        return "destructive" as const
      default:
        return "outline" as const
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={() => setShowCreateRequest(true)}>
          <ShoppingCart className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading restock requests...
                </TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No restock requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.medicationName}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>{request.supplierName}</TableCell>
                  <TableCell>{new Date(request.dateRequested).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => setViewRequest(request)}>View Details</DropdownMenuItem>
                        {request.status === "pending" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setCancelRequest(request)} className="text-destructive">
                              Cancel Request
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateRestockRequestDialog open={showCreateRequest} onOpenChange={setShowCreateRequest} />

      {viewRequest && (
        <ViewRestockRequestDialog
          request={viewRequest}
          open={!!viewRequest}
          onOpenChange={() => setViewRequest(null)}
        />
      )}

      {cancelRequest && (
        <CancelRestockRequestDialog
          request={cancelRequest}
          open={!!cancelRequest}
          onOpenChange={() => setCancelRequest(null)}
        />
      )}
    </div>
  )
}

