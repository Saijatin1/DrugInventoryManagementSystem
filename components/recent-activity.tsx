"use client"

import { useActivity } from "@/hooks/use-activity"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface RecentActivityProps {
  detailed?: boolean
}

export function RecentActivity({ detailed = false }: RecentActivityProps) {
  const { activity, loading } = useActivity()

  if (loading) {
    return <div className="flex items-center justify-center h-[200px]">Loading activity data...</div>
  }

  // Limit the number of activities to show unless detailed view
  const limitedActivity = detailed ? activity : activity?.slice(0, 5)

  return (
    <div className="space-y-8">
      {limitedActivity?.length === 0 ? (
        <p className="text-center text-muted-foreground">No recent activity.</p>
      ) : (
        limitedActivity?.map((item) => (
          <div key={item.id} className="flex items-start">
            <Avatar className="h-9 w-9">
              <AvatarImage src={item.userAvatar || "/placeholder-user.jpg"} alt={item.userName} />
              <AvatarFallback>{item.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium">{item.userName}</p>
              <p className="text-sm text-muted-foreground">
                {item.action} {item.medicationName}
                {item.details && <span> - {item.details}</span>}
              </p>
              <div className="flex items-center pt-2">
                <Badge variant="outline" className="text-xs">
                  {new Date(item.timestamp).toLocaleString()}
                </Badge>
                {item.actionType && (
                  <Badge
                    variant={
                      item.actionType === "add" ? "default" : item.actionType === "update" ? "outline" : "destructive"
                    }
                    className="ml-2 text-xs"
                  >
                    {item.actionType}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

