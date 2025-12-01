import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

interface VersionBadgeProps {
  version: string
  isAccepted?: boolean
  isCurrent?: boolean
  isBreaking?: boolean
  className?: string
}

export function VersionBadge({ version, isAccepted, isCurrent, isBreaking, className }: VersionBadgeProps) {
  const getVariant = () => {
    if (isCurrent && isAccepted) return "default"
    if (isCurrent) return "secondary"
    if (isAccepted) return "secondary"
    return "outline"
  }

  const getIcon = () => {
    if (isCurrent && isAccepted) return <CheckCircle className="h-3 w-3" />
    if (isCurrent) return <AlertCircle className="h-3 w-3" />
    if (isAccepted) return <CheckCircle className="h-3 w-3" />
    return <Clock className="h-3 w-3" />
  }

  return (
    <Badge variant={getVariant()} className={`gap-1 ${className || ""}`}>
      {getIcon()}v{version}
      {isBreaking && <span className="text-xs">⚠️</span>}
    </Badge>
  )
}
