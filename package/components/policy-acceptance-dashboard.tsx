"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, FileText, History, GitCompare, User, Building2, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePolicyAcceptance } from "../hooks/use-policy-acceptance"
import { PolicyDiff } from "./policy-diff"
import { VersionHistory } from "./version-history"
import { VersionBadge } from "./version-badge"
import { DeadlineIndicator } from "./deadline-indicator"
import type { AcceptanceType, CompanyInfo } from "../types"
import { canAcceptVersion } from "../utils/version-acceptance"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getPolicyTypeInfo } from "../utils"
import { AIAssistantBar, type AIAssistantConfig } from "./ai-assistant-bar"

interface PolicyAcceptanceDashboardProps {
  policyId?: string
  initialVersion?: string
  onAcceptComplete?: () => void
  aiAssistant?: AIAssistantConfig
}

export const PolicyAcceptanceDashboard: React.FC<PolicyAcceptanceDashboardProps> = ({
  policyId,
  initialVersion,
  onAcceptComplete,
  aiAssistant,
}) => {
  const { policies, acceptPolicy, config, currentUser } = usePolicyAcceptance()

  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("")
  const [hasReadPolicy, setHasReadPolicy] = useState(false)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
  const [selectedTab, setSelectedTab] = useState("current")
  const [viewingVersion, setViewingVersion] = useState<string>("")
  const [compareVersions, setCompareVersions] = useState<{ current: string; previous: string } | null>(null)

  const [acceptanceType, setAcceptanceType] = useState<AcceptanceType>("individual")
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: "",
    acceptorName: "",
    acceptorTitle: "",
    acceptorEmail: "",
  })
  const [hasAuthority, setHasAuthority] = useState(false)

  const getEarliestUnacceptedPolicy = (): string | undefined => {
    for (const policy of policies) {
      const reversedVersions = [...policy.versions].reverse()
      for (const version of reversedVersions) {
        const isAccepted = policy.userAcceptances.some(
          (a) => a.userId === currentUser.id && a.version === version.version && a.isValid,
        )
        if (!isAccepted) {
          return policy.id
        }
      }
    }
    return policies[0]?.id
  }

  useEffect(() => {
    if (policyId) {
      setSelectedPolicyId(policyId)
    } else {
      const earliestPolicy = getEarliestUnacceptedPolicy()
      setSelectedPolicyId(earliestPolicy || policies[0]?.id || "")
    }
    if (initialVersion) {
      setViewingVersion(initialVersion)
      setSelectedTab("view")
    } else {
      setSelectedTab("current")
    }
    setHasReadPolicy(false)
    setIsScrolledToBottom(false)
    setCompareVersions(null)
  }, [policyId, initialVersion, policies])

  useEffect(() => {
    setHasReadPolicy(false)
    setIsScrolledToBottom(false)
    setSelectedTab("current")
    setViewingVersion("")
    setCompareVersions(null)
  }, [selectedPolicyId])

  const policyData = policies.find((p) => p.id === selectedPolicyId)

  if (!policyData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No policy data available.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentVersion = policyData.versions[0]
  const previousVersion = policyData.versions[1]
  const isCurrentAccepted = policyData.userAcceptances.some(
    (a) => a.userId === currentUser.id && a.version === currentVersion.version && a.isValid,
  )
  const needsAcceptance = !isCurrentAccepted

  const versionAcceptanceCheck = canAcceptVersion(policyData, currentVersion.version, currentUser.id)
  const canAcceptCurrentVersion = versionAcceptanceCheck.canAccept

  const handleScrollChange = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    setIsScrolledToBottom(isAtBottom)
  }

  const handleViewVersion = (version: string) => {
    setViewingVersion(version)
    setSelectedTab("view")
  }

  const handleCompareVersions = (current: string, previous: string) => {
    setCompareVersions({ current, previous })
    setSelectedTab("compare")
  }

  const isCompanyFormValid =
    acceptanceType === "individual" ||
    (companyInfo.companyName.trim() !== "" &&
      companyInfo.acceptorName.trim() !== "" &&
      companyInfo.acceptorTitle.trim() !== "" &&
      companyInfo.acceptorEmail.trim() !== "" &&
      hasAuthority)

  const canAccept =
    hasReadPolicy && isScrolledToBottom && needsAcceptance && isCompanyFormValid && canAcceptCurrentVersion

  const getVersionByNumber = (version: string) => {
    return policyData.versions.find((v) => v.version === version)
  }

  const handleAccept = async () => {
    await acceptPolicy(
      policyData.id,
      currentVersion.version,
      acceptanceType,
      acceptanceType === "company" ? companyInfo : undefined,
    )
    onAcceptComplete?.()
  }

  const handleDecline = () => {
    config.callbacks.onDecline?.(policyData.id)
  }

  const getVisibleAcceptances = () => {
    if (config.organization.whoCanAcceptForCompany !== "any-user") {
      return policyData.userAcceptances
    } else {
      return policyData.userAcceptances.filter((acceptance) => acceptance.acceptanceType === "individual")
    }
  }

  const visibleAcceptances = getVisibleAcceptances()
  const shouldShowAcceptanceForm = selectedTab === "current" && needsAcceptance
  const viewingVersionAcceptance = viewingVersion ? visibleAcceptances.find((a) => a.version === viewingVersion) : null

  return (
    <>
      <div className="container mx-auto p-6 max-w-5xl">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              {needsAcceptance ? (
                <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />
              ) : (
                <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                {policies.length > 1 && (
                  <div className="mb-3">
                    <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
                      <SelectTrigger className="w-full max-w-md">
                        <SelectValue placeholder="Select a policy" />
                      </SelectTrigger>
                      <SelectContent>
                        {policies.map((policy) => {
                          const policyTypeInfo = getPolicyTypeInfo(policy.type)
                          const currentVer = policy.versions[0]
                          const isAccepted = policy.userAcceptances.some(
                            (a) => a.userId === currentUser.id && a.version === currentVer.version && a.isValid,
                          )
                          return (
                            <SelectItem key={policy.id} value={policy.id}>
                              <div className="flex items-center gap-2">
                                <span>{policy.title}</span>
                                <Badge variant={isAccepted ? "secondary" : "destructive"} className="text-xs">
                                  v{currentVer.version}
                                </Badge>
                                {!isAccepted && <span className="text-xs text-amber-600">• Pending</span>}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <CardTitle className="text-xl">
                  {policyData.title}
                  {needsAcceptance && " - Update Required"}
                </CardTitle>
                <div className="mt-1 flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                  <span>
                    {needsAcceptance
                      ? "Please review and accept the latest version to continue."
                      : "You're up to date with the current policy version."}
                  </span>
                  <VersionBadge
                    version={currentVersion.version}
                    isAccepted={isCurrentAccepted}
                    isCurrent={true}
                    isBreaking={currentVersion.isBreaking}
                  />
                </div>
                {currentVersion.deadline && (
                  <div className="mt-2">
                    <DeadlineIndicator deadline={currentVersion.deadline} isAccepted={isCurrentAccepted} />
                  </div>
                )}
                {!canAcceptCurrentVersion && versionAcceptanceCheck.reason && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      {versionAcceptanceCheck.reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="current" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Current</span>
                </TabsTrigger>
                <TabsTrigger value="changes" className="flex items-center gap-2">
                  <GitCompare className="h-4 w-4" />
                  <span className="hidden sm:inline">Changes</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
                <TabsTrigger value="view" disabled={!viewingVersion} className="text-xs">
                  {viewingVersion ? `v${viewingVersion}` : "View"}
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="current" className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Version {currentVersion.version}</span>
                      <span className="text-muted-foreground">Released: {currentVersion.date}</span>
                    </div>
                  </div>
                  <ScrollArea className="h-64 w-full border rounded-md p-4" onScrollCapture={handleScrollChange}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{currentVersion.content}</div>
                  </ScrollArea>
                  {!isScrolledToBottom && needsAcceptance && (
                    <p className="text-xs text-muted-foreground text-center">Please scroll to the bottom to continue</p>
                  )}
                </TabsContent>

                <TabsContent value="changes">
                  <PolicyDiff currentVersion={currentVersion} previousVersion={previousVersion} />
                </TabsContent>

                <TabsContent value="history">
                  <div className="h-96">
                    <VersionHistory
                      versions={policyData.versions}
                      acceptances={visibleAcceptances}
                      currentVersion={currentVersion.version}
                      onViewVersion={handleViewVersion}
                      onCompareVersions={handleCompareVersions}
                      policyType={policyData.type}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="view">
                  {viewingVersion && (
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Version {viewingVersion}</span>
                          <span className="text-muted-foreground">
                            Released: {getVersionByNumber(viewingVersion)?.date}
                          </span>
                        </div>
                      </div>

                      {viewingVersionAcceptance && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Acceptance Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3">
                                {viewingVersionAcceptance.acceptanceType === "company" ? (
                                  <Building2 className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <User className="h-5 w-5 text-green-600" />
                                )}
                                <div>
                                  <div className="font-medium">
                                    {viewingVersionAcceptance.acceptanceType === "company"
                                      ? "Company Acceptance"
                                      : "Individual Acceptance"}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Acceptance Type</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-gray-600" />
                                <div>
                                  <div className="font-medium">
                                    {new Date(viewingVersionAcceptance.acceptedAt).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(viewingVersionAcceptance.acceptedAt).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {viewingVersionAcceptance.acceptanceType === "company" &&
                              viewingVersionAcceptance.companyInfo && (
                                <div className="border-t pt-4 space-y-3">
                                  <h4 className="font-medium text-gray-900">Company Details</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium text-gray-700">Company:</span>
                                      <div className="text-gray-600">
                                        {viewingVersionAcceptance.companyInfo.companyName}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Accepted by:</span>
                                      <div className="text-gray-600">
                                        {viewingVersionAcceptance.companyInfo.acceptorTitle}
                                      </div>
                                    </div>
                                    <div className="md:col-span-2">
                                      <span className="font-medium text-gray-700">Contact:</span>
                                      <div className="text-gray-600">
                                        {viewingVersionAcceptance.companyInfo.acceptorEmail}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                            <div className="border-t pt-4">
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <Clock className="h-4 w-4" />
                                <span>
                                  Accepted{" "}
                                  {Math.floor(
                                    (new Date().getTime() - new Date(viewingVersionAcceptance.acceptedAt).getTime()) /
                                      (1000 * 60 * 60 * 24),
                                  )}{" "}
                                  days ago
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {!viewingVersionAcceptance && (
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground">
                              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p>This version has not been accepted yet.</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <ScrollArea className="h-64 w-full border rounded-md p-4">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {getVersionByNumber(viewingVersion)?.content}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {aiAssistant && <AIAssistantBar config={aiAssistant} />}
    </>
  )
}
