export interface RestockRequest {
  id: string
  medicationId: string
  medicationName: string
  supplierId: string
  supplierName: string
  pharmacistId: string
  pharmacistName: string
  quantity: number
  status: "pending" | "approved" | "completed" | "rejected" | "cancelled"
  dateRequested: string
  dateResponded?: string
  dateCompleted?: string
  dateCancelled?: string
  notes?: string
  responseNotes?: string
}

