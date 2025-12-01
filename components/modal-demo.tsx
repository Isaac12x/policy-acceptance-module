"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  FileText,
  Shield,
  Cookie,
  CheckCircle2,
} from "lucide-react";
import {
  PolicyAcceptanceProvider,
  PolicyAcceptanceModal,
} from "@fortisvincere/policy-acceptance-module";

import {
  createUser,
  generateSamplePolicies,
  createIndividualOnlyConfig,
  getPolicyTypeInfo,
} from "@fortisvincere/policy-acceptance-module";

const sampleUser = createUser(
  "user-001",
  "john@example.com",
  "John Smith",
  "user"
);
const samplePolicies = generateSamplePolicies();

const config = createIndividualOnlyConfig(sampleUser, {
  dataSource: {
    type: "local",
    localData: {
      policies: samplePolicies,
      users: [sampleUser],
      companies: [],
      currentUser: sampleUser,
    },
  },
  callbacks: {
    onAcceptance: (acceptance) => {
      console.log("Policy accepted:", acceptance);
    },
  },
});

export function ModalDemo() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | undefined>(
    undefined
  );

  const handlePolicyClick = (policyId: string) => {
    setSelectedPolicyId(policyId);
    setShowModal(true);
  };

  const aiAssistantConfig = {
    onSendMessage: async (message: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (message.toLowerCase().includes("privacy")) {
        return "The Privacy Policy outlines how we collect, use, and protect your personal information. The current version includes updates about data retention and third-party sharing practices.";
      }
      if (
        message.toLowerCase().includes("deadline") ||
        message.toLowerCase().includes("when")
      ) {
        return "You can check the deadline for each policy in the dashboard. Overdue policies are marked with a red indicator. Most policies have a 30-day acceptance window.";
      }
      if (
        message.toLowerCase().includes("accept") ||
        message.toLowerCase().includes("how")
      ) {
        return "To accept a policy: 1) Click on the policy card, 2) Read through the content, 3) Scroll to the bottom, 4) Check the acceptance box, and 5) Click 'Accept Policy'.";
      }

      return `I can help you understand the policies, deadlines, and acceptance process. Feel free to ask specific questions about any policy!`;
    },
    assistantName: "Legal Assistant",
    placeholder: "Ask about policies...",
    welcomeMessage:
      "👋 Need help understanding policies or compliance requirements? Let me know!",
    suggestedPrompts: [
      "What's the privacy policy about?",
      "When is the deadline?",
      "How do I accept a policy?",
    ],
  };

  return (
    <PolicyAcceptanceProvider config={config}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 mb-24 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              Policy Acceptance - Modal Demo
            </h1>
            <p className="text-lg text-gray-600">
              Click on any policy card to open the acceptance modal
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {samplePolicies.map((policy) => {
              const currentVersion = policy.versions[0];
              const isAccepted = policy.userAcceptances.some(
                (a) =>
                  a.userId === sampleUser.id &&
                  a.version === currentVersion.version &&
                  a.isValid
              );
              const policyTypeInfo = getPolicyTypeInfo(policy.type);
              const PolicyIcon =
                policy.type === "terms"
                  ? FileText
                  : policy.type === "privacy"
                  ? Shield
                  : Cookie;

              return (
                <Card
                  key={policy.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    !isAccepted ? "border-amber-300 bg-amber-50/50" : ""
                  }`}
                  onClick={() => handlePolicyClick(policy.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <PolicyIcon
                          className={`h-5 w-5 ${policyTypeInfo.color} flex-shrink-0`}
                        />
                        <CardTitle className="text-lg truncate">
                          {policy.title}
                        </CardTitle>
                      </div>
                      {isAccepted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    <CardDescription>
                      Version {currentVersion.version} •{" "}
                      {policy.versions.length} version
                      {policy.versions.length > 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={isAccepted ? "secondary" : "destructive"}>
                        {isAccepted ? "Accepted" : "Pending"}
                      </Badge>
                      {currentVersion.deadline && (
                        <span className="text-xs text-muted-foreground">
                          Deadline:{" "}
                          {new Date(
                            currentVersion.deadline
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {!isAccepted && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-amber-700 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Action required
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                How the Modal Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Click any policy card to open the acceptance modal</p>
              <p>• Review policy content, changes, and version history</p>
              <p>• Scroll to bottom and accept to complete the process</p>
              <p>• Modal automatically shows required policies first</p>
            </CardContent>
          </Card>
        </div>

        <PolicyAcceptanceModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedPolicyId(undefined);
          }}
          policyId={selectedPolicyId}
          legalHubUrl="https://legal-hub.example.com/view"
        />
      </div>
    </PolicyAcceptanceProvider>
  );
}
