"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  User,
  FileText,
  Shield,
  Cookie,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { usePolicyAcceptance } from "../hooks/use-policy-acceptance";
import { PolicyAcceptanceModal } from "./policy-acceptance-modal";
import { VersionBadge } from "./version-badge";
import { DeadlineIndicator } from "./deadline-indicator";
import { getPolicyTypeInfo, canAcceptVersion } from "../utils";
import type { PolicyAcceptance, PolicyData, PolicyVersion } from "../types";

export const PolicyVersioningDemo: React.FC = () => {
  const { policies, config, currentUser } = usePolicyAcceptance();
  const [showModal, setShowModal] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | undefined>(
    undefined
  );
  const [selectedVersion, setSelectedVersion] = useState<string | undefined>(
    undefined
  );

  if (!policies || policies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No policy data available.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getEarliestUnacceptedPolicy = (): PolicyData => {
    for (const policy of policies as PolicyData[]) {
      const reversedVersions = [...policy.versions].reverse();
      for (const version of reversedVersions) {
        const isAccepted = policy.userAcceptances.some(
          (acceptance: PolicyAcceptance) =>
            acceptance.userId === currentUser.id &&
            acceptance.version === version.version &&
            acceptance.isValid
        );
        if (!isAccepted) {
          return policy;
        }
      }
    }
    return (policies as PolicyData[])[0];
  };

  const policyData = getEarliestUnacceptedPolicy();
  const currentVersion = policyData.versions[0] as PolicyVersion;
  const isCurrentAccepted = policyData.userAcceptances.some(
    (acceptance: PolicyAcceptance) =>
      acceptance.userId === currentUser.id &&
      acceptance.version === currentVersion.version &&
      acceptance.isValid
  );
  const lastAcceptedVersion = policyData.userAcceptances
    .filter(
      (acceptance: PolicyAcceptance) =>
        acceptance.userId === currentUser.id && acceptance.isValid
    )
    .sort(
      (a: PolicyAcceptance, b: PolicyAcceptance) =>
        new Date(b.acceptedAt).getTime() - new Date(a.acceptedAt).getTime()
    )[0];

  // Filter acceptances based on user permissions
  const getVisibleAcceptances = (): PolicyAcceptance[] => {
    if (config.organization.whoCanAcceptForCompany !== "any-user") {
      return policyData.userAcceptances;
    }
    return policyData.userAcceptances.filter(
      (acceptance: PolicyAcceptance) =>
        acceptance.acceptanceType === "individual"
    );
  };

  const visibleAcceptances = getVisibleAcceptances();
  const policyTypeInfo = getPolicyTypeInfo(policyData.type);

  const handleVersionClick = (policyId: string, version: string) => {
    setSelectedPolicyId(policyId);
    setSelectedVersion(version);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Policy Version Management
          </h1>
          <p className="text-lg text-gray-600">
            Advanced policy acceptance with version tracking and diff comparison
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Policy Status</span>
                <VersionBadge
                  version={currentVersion.version}
                  isAccepted={isCurrentAccepted}
                  isCurrent={true}
                  isBreaking={currentVersion.isBreaking}
                />
              </CardTitle>
              <CardDescription>
                {isCurrentAccepted
                  ? "You're up to date with the latest policy version"
                  : "Action required: Please review and accept the latest policy version"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Current Version</h4>
                  <div className="text-sm text-muted-foreground">
                    Version {currentVersion.version} • Released{" "}
                    {currentVersion.date}
                  </div>
                  {currentVersion.isBreaking && (
                    <Badge variant="destructive" className="text-xs">
                      Breaking Changes
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Your Status</h4>
                  <div className="text-sm text-muted-foreground">
                    {lastAcceptedVersion
                      ? `Last accepted: v${lastAcceptedVersion.version}`
                      : "No versions accepted yet"}
                  </div>
                  {!isCurrentAccepted && (
                    <Badge variant="outline" className="text-xs">
                      Update Required
                    </Badge>
                  )}
                </div>
              </div>

              {currentVersion.changes && (
                <div className="space-y-2">
                  <h4 className="font-medium">Latest Changes</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {currentVersion.changes
                      .slice(0, 3)
                      .map((change: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{change}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {currentVersion.deadline && (
                <div className="space-y-2">
                  <h4 className="font-medium">Acceptance Deadline</h4>
                  <DeadlineIndicator
                    deadline={currentVersion.deadline}
                    isAccepted={isCurrentAccepted}
                  />
                </div>
              )}

              <Button
                onClick={() =>
                  handleVersionClick(policyData.id, currentVersion.version)
                }
                className="w-full"
                variant={isCurrentAccepted ? "outline" : "default"}
              >
                {isCurrentAccepted ? "Review Policy" : "Accept Latest Version"}
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle>Version Acceptances</CardTitle>
              <CardDescription>
                Policy acceptance history and status
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
              <ScrollArea className="h-[400px] px-6 pb-6">
                <div className="space-y-2">
                  {policyData.versions.map((version: PolicyVersion) => {
                    const acceptance = visibleAcceptances.find(
                      (candidate: PolicyAcceptance) =>
                        candidate.version === version.version
                    );
                    const isAccepted = !!acceptance;
                    const isCurrent =
                      version.version === currentVersion.version;
                    const PolicyIcon =
                      policyTypeInfo.label === "Terms of Service"
                        ? FileText
                        : policyTypeInfo.label === "Privacy Policy"
                        ? Shield
                        : Cookie;

                    const acceptanceCheck = canAcceptVersion(
                      policyData,
                      version.version,
                      currentUser.id
                    );
                    const isBlocked = !isAccepted && !acceptanceCheck.canAccept;

                    return (
                      <div
                        key={version.version}
                        className="border rounded-lg p-2 space-y-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          handleVersionClick(policyData.id, version.version)
                        }
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {isAccepted && (
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                            )}
                            {isBlocked && (
                              <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            )}
                            <VersionBadge
                              version={version.version}
                              isAccepted={isAccepted}
                              isCurrent={isCurrent}
                              isBreaking={version.isBreaking}
                            />
                            {version.deadline && (
                              <DeadlineIndicator
                                deadline={version.deadline}
                                isAccepted={isAccepted}
                                className="text-xs"
                              />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex-shrink-0">
                            {version.date}
                          </div>
                        </div>

                        {/* Policy Type Badge */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${policyTypeInfo.bgColor} ${policyTypeInfo.borderColor} border`}
                          >
                            <PolicyIcon
                              className={`h-3 w-3 ${policyTypeInfo.color}`}
                            />
                            <span className={policyTypeInfo.color}>
                              {policyTypeInfo.label}
                            </span>
                          </div>
                        </div>

                        {acceptance && (
                          <div className="bg-gray-50 rounded-md px-2 py-1.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs min-w-0 flex-1">
                              {acceptance.acceptanceType === "company" ? (
                                <>
                                  <Building2 className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                                  <span className="font-medium truncate">
                                    {acceptance.companyInfo?.companyName ||
                                      "Company"}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <User className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                                  <span className="font-medium truncate">
                                    {currentUser.name}
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex-shrink-0 text-right">
                              <div className="text-green-600 font-medium">
                                Accepted
                              </div>
                              <div>
                                {new Date(
                                  acceptance.acceptedAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        )}

                        {!acceptance && isBlocked && (
                          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Accept v{acceptanceCheck.missingVersion} first
                          </div>
                        )}

                        {!acceptance && !isBlocked && (
                          <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            Not yet accepted
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <PolicyAcceptanceModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedPolicyId(undefined);
            setSelectedVersion(undefined);
          }}
          policyId={selectedPolicyId}
          initialVersion={selectedVersion}
        />
      </div>
    </div>
  );
};
