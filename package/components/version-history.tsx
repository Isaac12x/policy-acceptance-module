"use client"

import { Button } from "@/components/ui/button"
import { VersionBadge } from "./version-badge"
import { Calendar, User, Eye, Building2, Clock, FileText, Shield, Cookie } from "lucide-react"
import type { PolicyVersion, PolicyAcceptance, PolicyType } from "../types"
import { DeadlineIndicator } from "./deadline-indicator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VersionHistoryProps {
  versions: PolicyVersion[]
  acceptances: PolicyAcceptance[]
  currentVersion: string
  onViewVersion: (version: string) => void
  onCompareVersions: (current: string, previous: string) => void
  policyType?: PolicyType
}

// Helper function to get policy type info
const getPolicyTypeInfo = (type: PolicyType) => {
  switch (type) {
    case "terms":
      return {
        label: "Terms of Service",
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      }
    case "privacy":
      return {
        label: "Privacy Policy",
        icon: Shield,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      }
    case "cookies":
      return {
        label: "Cookie Policy",
        icon: Cookie,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      }
    case "data-processing":
      return {
        label: "Data Processing Agreement",
        icon: FileText,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
      }
    case "security":
      return {
        label: "Security Policy",
        icon: Shield,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      }
    case "custom":
      return {
        label: "Policy",
        icon: FileText,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      }
  }
}

export function VersionHistory({
  versions,
  acceptances,
  currentVersion,
  onViewVersion,
  onCompareVersions,
  policyType = "terms",
}: VersionHistoryProps) {
  const isVersionAccepted = (version: string) => {
    return acceptances.some((acceptance) => acceptance.version === version)
  }

  const getAcceptance = (version: string) => {
    return acceptances.find((a) => a.version === version)
  }

  const policyTypeInfo = getPolicyTypeInfo(policyType)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-base font-semibold">Version History</h3>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-3 pr-4">
          {versions.map((version, index) => {
            const acceptance = getAcceptance(version.version)
            const isAccepted = !!acceptance
            const isCurrent = version.version === currentVersion
            const previousVersion = versions[index + 1]
            const PolicyIcon = policyTypeInfo.icon

            return (
              <div key={version.version} className="border rounded-lg p-3 space-y-3">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <VersionBadge
                      version={version.version}
                      isAccepted={isAccepted}
                      isCurrent={isCurrent}
                      isBreaking={version.isBreaking}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {version.date}
                      </div>
                      {version.deadline && (
                        <DeadlineIndicator deadline={version.deadline} isAccepted={isAccepted} className="text-xs" />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewVersion(version.version)}
                      className="h-8 px-3 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {previousVersion && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCompareVersions(version.version, previousVersion.version)}
                        className="h-8 px-3 text-xs"
                      >
                        Compare
                      </Button>
                    )}
                  </div>
                </div>

                {/* Policy Type Badge */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${policyTypeInfo.bgColor} ${policyTypeInfo.borderColor} border`}
                  >
                    <PolicyIcon className={`h-3 w-3 ${policyTypeInfo.color}`} />
                    <span className={policyTypeInfo.color}>{policyTypeInfo.label}</span>
                  </div>
                </div>

                {/* Acceptance Information */}
                {acceptance && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-green-800">
                      {acceptance.acceptanceType === "company" ? (
                        <Building2 className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      <span>
                        {acceptance.acceptanceType === "company"
                          ? acceptance.companyInfo?.companyName || "Company"
                          : "Individual"}
                      </span>
                      <span className="text-green-600 ml-auto">Accepted</span>
                      <span className="text-green-600">
                        {new Date(acceptance.acceptedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Changes Section */}
                {version.changes && version.changes.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-medium text-gray-700">Key Changes:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {version.changes.slice(0, 2).map((change, changeIndex) => (
                        <li key={changeIndex} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                          <span className="break-words line-clamp-2">{change}</span>
                        </li>
                      ))}
                      {version.changes.length > 2 && (
                        <li className="text-xs text-muted-foreground ml-4">+{version.changes.length - 2} more...</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
