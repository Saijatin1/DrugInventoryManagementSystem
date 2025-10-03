"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUsers } from "@/hooks/use-users"
import { MoreHorizontal, Search } from "lucide-react"
import { ViewPharmacistDialog } from "@/components/view-pharmacist-dialog"
import type { User } from "@/types/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function PharmacistList() {
  const { users, loading } = useUsers()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewPharmacist, setViewPharmacist] = useState<User | null>(null)

  const pharmacists = users?.filter((user) => user.role === "pharmacist") || []

  const filteredPharmacists = pharmacists.filter(
    (pharmacist) =>
      pharmacist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharmacist.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pharmacists..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pharmacist</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pending Requests</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading pharmacists...
                </TableCell>
              </TableRow>
            ) : filteredPharmacists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No pharmacists found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPharmacists.map((pharmacist) => (
                <TableRow key={pharmacist.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" alt={pharmacist.name} />
                        <AvatarFallback>{pharmacist.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{pharmacist.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{pharmacist.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{Math.floor(Math.random() * 5)}</Badge>
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
                        <DropdownMenuItem onClick={() => setViewPharmacist(pharmacist)}>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {viewPharmacist && (
        <ViewPharmacistDialog
          pharmacist={viewPharmacist}
          open={!!viewPharmacist}
          onOpenChange={() => setViewPharmacist(null)}
        />
      )}
    </div>
  )
}

