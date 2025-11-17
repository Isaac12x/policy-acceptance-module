"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, FileText, History, GitCompare, X, User, Building2, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePolicyAcceptance } from "../hooks/use-policy-acceptance"
import { PolicyDiff } from "./policy-diff"
import { VersionHistory } from "./version-history"
import { VersionBadge } from "./version-badge"
import { CompanyAcceptanceForm } from "./company-acceptance-form"
import { DeadlineIndicator } from "./deadline-indicator"
import type { AcceptanceType, CompanyInfo } from "../types"
import { canAcceptVersion } from "../utils/version-acceptance"

interface PolicyAcceptanceModalProps {
  isOpen: boolean
  onClose: () => void
  policyId?: string
  initialVersion?: string
}

export const PolicyAcceptanceModal: React.FC<PolicyAcceptanceModalProps> = ({
  isOpen,
  onClose,
  policyId,
  initialVersion,
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
      // Check versions from oldest to newest (reverse order since they're sorted newest first)
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
    if (isOpen) {
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
      // Reset form state when policy changes
      setHasReadPolicy(false)
      setIsScrolledToBottom(false)
      setCompareVersions(null)
    }
  }, [isOpen, policyId, initialVersion, policies])

  useEffect(() => {
    setHasReadPolicy(false)
    setIsScrolledToBottom(false)
    setSelectedTab("current")
    setViewingVersion("")
    setCompareVersions(null)
  }, [selectedPolicyId])

  const policyData = policies.find((p) => p.id === selectedPolicyId)

  if (!policyData) {
    return null
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
    onClose()
  }

  const handleDecline = () => {
    config.callbacks.onDecline?.(policyData.id)
    onClose()
  }

  // Filter acceptances based on user permissions
  const getVisibleAcceptances = () => {
    if (config.organization.whoCanAcceptForCompany !== "any-user") {
      return policyData.userAcceptances
    } else {
      return policyData.userAcceptances.filter((acceptance) => acceptance.acceptanceType === "individual")
    }
  }

  const visibleAcceptances = getVisibleAcceptances()

  // Check if we should show acceptance form (only for current tab with unaccepted version)
  const shouldShowAcceptanceForm = selectedTab === "current" && needsAcceptance

  // Get acceptance info for viewing version
  const getViewingVersionAcceptance = () => {
    if (!viewingVersion) return null
    return visibleAcceptances.find((a) => a.version === viewingVersion)
  }

  const viewingVersionAcceptance = getViewingVersionAcceptance()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl max-h-[90vh] p-0 w-[95vw] flex flex-col">
        {/* Custom Close Button */}
        <Button variant="ghost" size="sm" className="absolute right-4 top-4 z-10 h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6">
            <DialogHeader className="pb-4">
              <div className="flex items-center justify-between pr-8">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {needsAcceptance ? (
                    <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />
                  ) : (
                    <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    {policies.length > 1 && (
                      <div className="mb-3">
                        {/* Select component implementation goes here */}
                        {/* Placeholder for Select component */}
                        <div>Select component goes here</div>
                      </div>
                    )}
                    <DialogTitle className="text-xl">
                      {policyData.title}
                      {needsAcceptance && " - Update Required"}
                    </DialogTitle>
                    <DialogDescription className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="text-sm">
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
                    </DialogDescription>
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
              </div>
            </DialogHeader>

            <div className="space-y-6">
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
                      <p className="text-xs text-muted-foreground text-center">
                        Please scroll to the bottom to continue
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="changes">
                    <PolicyDiff currentVersion={currentVersion} previousVersion={previousVersion} />
                  </TabsContent>

                  <TabsContent value="history" className="mt-0">
                    <div className="h-[500px] max-h-[60vh]">
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

                        {/* Version Stats Card */}
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

                  {compareVersions && (
                    <TabsContent value="compare">
                      <PolicyDiff
                        currentVersion={getVersionByNumber(compareVersions.current)!}
                        previousVersion={getVersionByNumber(compareVersions.previous)}
                      />
                    </TabsContent>
                  )}
                </div>
              </Tabs>

              {shouldShowAcceptanceForm && (
                <div className="space-y-4 border-t pt-4">
                  {config.organization.allowIndividualAcceptance && config.organization.requireCompanyAcceptance && (
                    <CompanyAcceptanceForm
                      acceptanceType={acceptanceType}
                      onAcceptanceTypeChange={setAcceptanceType}
                      companyInfo={companyInfo}
                      onCompanyInfoChange={setCompanyInfo}
                      hasAuthority={hasAuthority}
                      onAuthorityChange={setHasAuthority}
                      isValid={isCompanyFormValid}
                    />
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="policy-read"
                      checked={hasReadPolicy}
                      onCheckedChange={(checked) => setHasReadPolicy(checked as boolean)}
                      disabled={!isScrolledToBottom || !canAcceptCurrentVersion}
                    />
                    <label
                      htmlFor="policy-read"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I have read and understand version {currentVersion.version} of the{" "}
                      {policyData.title.toLowerCase()}
                    </label>
                  </div>

                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={handleDecline}
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      I'll review later
                    </Button>
                    <Button onClick={handleAccept} disabled={!canAccept}>
                      Accept Version {currentVersion.version}
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {!shouldShowAcceptanceForm && (
                <div className="border-t pt-4">
                  <DialogFooter>
                    <Button onClick={onClose} variant="outline">
                      Close
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
