import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react"

interface DeadlineIndicatorProps {
  deadline: string
  isAccepted?: boolean
  className?: string
}

export function DeadlineIndicator({ deadline, isAccepted, className }: DeadlineIndicatorProps) {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntilDeadline < 0
  const isUrgent = daysUntilDeadline <= 3 && daysUntilDeadline >= 0
  const isSoon = daysUntilDeadline <= 7 && daysUntilDeadline > 3

  if (isAccepted) {
    return (
      <Badge variant="secondary" className={`gap-1 ${className || ""}`}>
        <CheckCircle className="h-3 w-3" />
        Accepted
      </Badge>
    )
  }

  if (isOverdue) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Overdue
        </Badge>
        <span className="text-sm text-muted-foreground">
          {Math.abs(daysUntilDeadline)} day{Math.abs(daysUntilDeadline) !== 1 ? "s" : ""} ago • Due{" "}
          {deadlineDate.toLocaleDateString()}
        </span>
      </div>
    )
  }

  if (isUrgent) {
    return (
      <Badge variant="destructive" className={`gap-1 ${className || ""}`}>
        <AlertTriangle className="h-3 w-3" />
        {daysUntilDeadline} day{daysUntilDeadline !== 1 ? "s" : ""} left
      </Badge>
    )
  }

  if (isSoon) {
    return (
      <Badge variant="secondary" className={`gap-1 border-amber-200 bg-amber-50 text-amber-700 ${className || ""}`}>
        <Clock className="h-3 w-3" />
        {daysUntilDeadline} days left
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className={`gap-1 ${className || ""}`}>
      <Clock className="h-3 w-3" />
      Due {deadlineDate.toLocaleDateString()}
    </Badge>
  )
}
